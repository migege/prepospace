import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { RotateCcw, Play, Pause, Move3d, Sparkles } from 'lucide-react';
import { SceneCaption, ScenePresetId } from '../types/course';
import { ACCENT_STYLES } from '../data/theme';
import { buildSceneById } from '../three/sceneRegistry';
import { BuiltScene, disposeGroup } from '../three/helpers';

interface ThreeStageProps {
  sceneId: ScenePresetId;
  caption?: SceneCaption;
  heightClass?: string;
  compact?: boolean;
  showHint?: boolean;
}

const SCRUB_DURATION_SEC = 4.0;

export const ThreeStage: React.FC<ThreeStageProps> = ({
  sceneId,
  caption,
  heightClass = 'h-[380px] lg:h-[520px]',
  compact = false,
  showHint = true,
}) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [webglError, setWebglError] = useState(false);
  const [isPlaying, setIsPlaying] = useState(true);
  const [scrubValue, setScrubValue] = useState(0);

  // Refs shared with the live animation loop
  const activeBuiltRef = useRef<BuiltScene | null>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const controlsRef = useRef<OrbitControls | null>(null);
  const isPlayingRef = useRef<boolean>(true);
  const simTimeRef = useRef<number>(0);
  const desiredCamPosRef = useRef<THREE.Vector3 | null>(null);
  const desiredTargetRef = useRef<THREE.Vector3 | null>(null);
  const isLerpingCameraRef = useRef<boolean>(false);
  const lastUiSyncRef = useRef<number>(0);

  // 1. Initialize WebGLRenderer, Scene, Studio Lighting, Grid Floor, OrbitControls once
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: false,
        powerPreference: 'high-performance',
      });
    } catch {
      setWebglError(true);
      return;
    }

    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.setSize(container.clientWidth || 600, container.clientHeight || 420);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.08;
    container.innerHTML = '';
    container.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xf2efe8);
    scene.fog = new THREE.Fog(0xf2efe8, 12, 26);
    sceneRef.current = scene;

    const camera = new THREE.PerspectiveCamera(
      40,
      (container.clientWidth || 600) / (container.clientHeight || 420),
      0.1,
      60
    );
    camera.position.set(2.8, 3.0, 5.4);
    cameraRef.current = camera;

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.07;
    controls.minDistance = 2.6;
    controls.maxDistance = 12.5;
    controls.maxPolarAngle = Math.PI / 2 - 0.04;
    controls.addEventListener('start', () => {
      isLerpingCameraRef.current = false;
    });
    controlsRef.current = controls;

    // Warm architectural studio lighting
    const hemi = new THREE.HemisphereLight(0xfffdf9, 0xd8d2c5, 1.15);
    scene.add(hemi);

    const keyLight = new THREE.DirectionalLight(0xfff9f0, 1.35);
    keyLight.position.set(5, 8.5, 6);
    keyLight.castShadow = true;
    keyLight.shadow.mapSize.width = 1024;
    keyLight.shadow.mapSize.height = 1024;
    keyLight.shadow.camera.near = 1;
    keyLight.shadow.camera.far = 22;
    const d = 6;
    keyLight.shadow.camera.left = -d;
    keyLight.shadow.camera.right = d;
    keyLight.shadow.camera.top = d;
    keyLight.shadow.camera.bottom = -d;
    keyLight.shadow.bias = -0.0005;
    scene.add(keyLight);

    const rimLight = new THREE.DirectionalLight(0xc7dcff, 0.55);
    rimLight.position.set(-5, 4, -5);
    scene.add(rimLight);

    // Subtle ground shadow catcher + studio grid
    const shadowPlane = new THREE.Mesh(
      new THREE.PlaneGeometry(30, 30),
      new THREE.ShadowMaterial({ opacity: 0.14 })
    );
    shadowPlane.rotation.x = -Math.PI / 2;
    shadowPlane.position.y = -0.005;
    shadowPlane.receiveShadow = true;
    scene.add(shadowPlane);

    const grid = new THREE.GridHelper(22, 22, 0xd4cfc2, 0xe2ddd2);
    grid.position.y = -0.01;
    scene.add(grid);

    const ro = new ResizeObserver(() => {
      if (!container) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      if (w > 0 && h > 0) {
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
        renderer.setSize(w, h);
      }
    });
    ro.observe(container);

    let rafId = 0;
    const clock = new THREE.Clock();
    const animate = () => {
      rafId = requestAnimationFrame(animate);
      const delta = Math.min(clock.getDelta(), 0.05);

      if (isPlayingRef.current) {
        simTimeRef.current += delta;
      }

      if (isLerpingCameraRef.current && desiredCamPosRef.current && desiredTargetRef.current) {
        camera.position.lerp(desiredCamPosRef.current, Math.min(1, delta * 5.2));
        controls.target.lerp(desiredTargetRef.current, Math.min(1, delta * 5.2));
        if (
          camera.position.distanceTo(desiredCamPosRef.current) < 0.03 &&
          controls.target.distanceTo(desiredTargetRef.current) < 0.03
        ) {
          isLerpingCameraRef.current = false;
        }
      }

      if (activeBuiltRef.current?.update) {
        activeBuiltRef.current.update(simTimeRef.current, delta);
      }

      // Periodically sync scrubber slider (~15fps) when playing
      const now = performance.now();
      if (isPlayingRef.current && now - lastUiSyncRef.current > 70) {
        lastUiSyncRef.current = now;
        const pct = ((simTimeRef.current % SCRUB_DURATION_SEC) / SCRUB_DURATION_SEC) * 100;
        setScrubValue(Math.round(pct));
      }

      controls.update();
      renderer.render(scene, camera);
    };
    animate();

    return () => {
      cancelAnimationFrame(rafId);
      ro.disconnect();
      controls.dispose();
      if (activeBuiltRef.current) {
        scene.remove(activeBuiltRef.current.group);
        disposeGroup(activeBuiltRef.current.group);
        activeBuiltRef.current = null;
      }
      renderer.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  // 2. Swap 3D diorama smoothly whenever sceneId changes
  useEffect(() => {
    const scene = sceneRef.current;
    if (!scene) return;

    if (activeBuiltRef.current) {
      scene.remove(activeBuiltRef.current.group);
      disposeGroup(activeBuiltRef.current.group);
      activeBuiltRef.current = null;
    }

    const built = buildSceneById(sceneId);
    scene.add(built.group);
    activeBuiltRef.current = built;
    simTimeRef.current = 0;
    isPlayingRef.current = true;
    setIsPlaying(true);
    setScrubValue(0);

    desiredCamPosRef.current = new THREE.Vector3(...built.cameraPos);
    desiredTargetRef.current = new THREE.Vector3(...built.target);
    isLerpingCameraRef.current = true;
  }, [sceneId]);

  const handleResetView = () => {
    const built = activeBuiltRef.current;
    if (!built) return;
    desiredCamPosRef.current = new THREE.Vector3(...built.cameraPos);
    desiredTargetRef.current = new THREE.Vector3(...built.target);
    isLerpingCameraRef.current = true;
  };

  const handleTogglePlay = () => {
    const next = !isPlayingRef.current;
    isPlayingRef.current = next;
    setIsPlaying(next);
  };

  const handleScrub = (val: number) => {
    isPlayingRef.current = false;
    setIsPlaying(false);
    setScrubValue(val);
    simTimeRef.current = (val / 100) * SCRUB_DURATION_SEC;
  };

  const accentStyle = caption ? ACCENT_STYLES[caption.accent] : ACCENT_STYLES.cobalt;

  return (
    <div
      className={`touch-canvas-stage relative w-full ${heightClass} overflow-hidden rounded-2xl border border-zinc-900/10 bg-[#F2EFE8] shadow-sm`}
    >
      {webglError ? (
        <div className="flex h-full flex-col items-center justify-center p-6 text-center text-zinc-600">
          <Sparkles className="mb-3 h-8 w-8 text-zinc-400" />
          <p className="font-medium text-zinc-800">3D Studio Preview Unavailable</p>
          <p className="mt-1 max-w-sm text-sm">
            WebGL is disabled in this browser context. All lessons, minimal pairs, and exercises remain fully interactive.
          </p>
        </div>
      ) : (
        <div ref={containerRef} className="h-full w-full cursor-grab active:cursor-grabbing" />
      )}

      {/* Top-right studio controls: Play/Pause + Scrubber + Reset View */}
      {!webglError && (
        <div className="pointer-events-auto absolute right-3 top-3 flex items-center gap-1.5">
          <div className="hidden items-center gap-2 rounded-lg border border-zinc-900/10 bg-white/85 px-2.5 py-1.5 backdrop-blur-md sm:flex">
            <button
              type="button"
              onClick={handleTogglePlay}
              title={isPlaying ? 'Pause animation to inspect in 3D' : 'Resume animation'}
              className="text-zinc-700 transition hover:text-zinc-950"
            >
              {isPlaying ? <Pause className="h-3.5 w-3.5" /> : <Play className="h-3.5 w-3.5" />}
            </button>
            <input
              type="range"
              min={0}
              max={100}
              value={scrubValue}
              aria-label="Scrub 3D animation timeline"
              onChange={(e) => handleScrub(Number(e.target.value))}
              className="h-1 w-16 cursor-pointer accent-zinc-900"
            />
          </div>
          <button
            type="button"
            onClick={handleTogglePlay}
            title={isPlaying ? 'Pause' : 'Play'}
            className="inline-flex items-center rounded-lg border border-zinc-900/10 bg-white/85 p-1.5 text-zinc-700 backdrop-blur-md transition hover:bg-white hover:text-zinc-950 sm:hidden"
          >
            {isPlaying ? <Pause className="h-3.5 w-3.5" /> : <Play className="h-3.5 w-3.5" />}
          </button>
          <button
            type="button"
            onClick={handleResetView}
            title="Reset camera angle"
            className="inline-flex items-center gap-1 rounded-lg border border-zinc-900/10 bg-white/85 px-2.5 py-1.5 text-xs font-medium text-zinc-700 backdrop-blur-md transition hover:bg-white hover:text-zinc-950"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            {!compact && <span className="hidden md:inline">Reset View</span>}
          </button>
        </div>
      )}

      {/* Top-left orbit hint */}
      {showHint && !webglError && (
        <div className="pointer-events-none absolute left-3 top-3 inline-flex items-center gap-1.5 rounded-full border border-zinc-900/10 bg-white/80 px-2.5 py-1 text-[11px] font-medium text-zinc-600 backdrop-blur-md">
          <Move3d className="h-3.5 w-3.5 text-zinc-500" />
          <span>Drag to orbit · Scroll to zoom</span>
        </div>
      )}

      {/* Bottom floating semantic caption */}
      {caption && (
        <div className="pointer-events-none absolute bottom-3 left-3 right-3">
          <div className="rounded-xl border border-zinc-900/10 bg-white/90 px-3.5 py-2.5 shadow-sm backdrop-blur-md">
            <div className="flex flex-wrap items-center gap-2">
              <span
                className={`inline-flex items-center rounded-md border px-2 py-0.5 font-mono text-[11px] font-semibold tracking-tight ${accentStyle.badge}`}
              >
                {caption.badge}
              </span>
              <span className="text-sm font-semibold text-zinc-900">{caption.title}</span>
            </div>
            <p className="mt-0.5 text-xs leading-relaxed text-zinc-600">{caption.subtitle}</p>
          </div>
        </div>
      )}
    </div>
  );
};
