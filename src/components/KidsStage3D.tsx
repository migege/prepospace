import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { RotateCcw, Hand } from 'lucide-react';
import {
  KIDS_BUTTON_STYLES,
  KidsPrepItem,
  KidsWorld,
} from '../data/kidsData';
import { buildKidsWorldBackdrop, buildPipPuppy, PipRig } from '../three/kidsWorld';
import { disposeGroup, makeCurveTube, makeLabelSprite } from '../three/helpers';

export type KidsStageMode = 'play' | 'tap' | 'quiz';

interface KidsStage3DProps {
  world: KidsWorld;
  mode: KidsStageMode;
  activeItem: KidsPrepItem | null;
  /** Increment to trigger Pip's happy jump & 3D star confetti burst */
  celebrateNonce: number;
  /** In tap mode, highlight a recently wrong hotspot briefly */
  wrongHotspotId?: string | null;
  /** In tap mode, reveal correct hotspot after winning */
  wonHotspotId?: string | null;
  onTapHotspot?: (itemId: string) => void;
}

interface BurstParticle {
  mesh: THREE.Mesh;
  vel: THREE.Vector3;
  life: number;
}

export const KidsStage3D: React.FC<KidsStage3DProps> = ({
  world,
  mode,
  activeItem,
  celebrateNonce,
  wrongHotspotId,
  wonHotspotId,
  onTapHotspot,
}) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const controlsRef = useRef<OrbitControls | null>(null);

  const worldGroupRef = useRef<THREE.Group | null>(null);
  const worldUpdateRef = useRef<((t: number) => void) | undefined>(undefined);
  const pipRef = useRef<PipRig | null>(null);
  const pathRibbonRef = useRef<THREE.Mesh | null>(null);
  const hotspotGroupRef = useRef<THREE.Group | null>(null);
  const hitTargetsRef = useRef<THREE.Mesh[]>([]);
  const hotspotVisualsRef = useRef<Map<string, THREE.Mesh>>(new Map());
  const burstParticlesRef = useRef<BurstParticle[]>([]);

  // Pip motion interpolation refs
  const pipStartPosRef = useRef<THREE.Vector3>(new THREE.Vector3(0, 0.16, 2.0));
  const pipEndPosRef = useRef<THREE.Vector3>(new THREE.Vector3(0, 0.16, 2.0));
  const pipHopProgressRef = useRef<number>(1);
  const pipActiveCurveRef = useRef<THREE.CatmullRomCurve3 | null>(null);
  const pipPathLoopRef = useRef<'loop' | 'circle-pond' | null>(null);
  const pipFacingYRef = useRef<number>(0);
  const happySpinRef = useRef<number>(0);

  // Latest props for pointer & loop callbacks
  const modeRef = useRef(mode);
  const wrongIdRef = useRef(wrongHotspotId);
  const wonIdRef = useRef(wonHotspotId);
  const onTapRef = useRef(onTapHotspot);
  const worldRef = useRef(world);

  useEffect(() => {
    modeRef.current = mode;
    wrongIdRef.current = wrongHotspotId;
    wonIdRef.current = wonHotspotId;
    onTapRef.current = onTapHotspot;
    worldRef.current = world;
  }, [mode, wrongHotspotId, wonHotspotId, onTapHotspot, world]);

  // 1. Setup Three.js canvas once
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: 'high-performance' });
    } catch {
      return;
    }

    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.setSize(container.clientWidth || 640, container.clientHeight || 480);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.1;
    container.innerHTML = '';
    container.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xeef6ff);
    scene.fog = new THREE.Fog(0xeef6ff, 13, 28);
    sceneRef.current = scene;

    const camera = new THREE.PerspectiveCamera(
      40,
      (container.clientWidth || 640) / (container.clientHeight || 480),
      0.1,
      60
    );
    camera.position.set(...world.cameraPos);
    cameraRef.current = camera;

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.08;
    controls.minDistance = 3.2;
    controls.maxDistance = 11.5;
    controls.maxPolarAngle = Math.PI / 2 - 0.05;
    controls.enablePan = false; // Keep world centered for kids on iPad!
    controls.target.set(...world.cameraTarget);
    controlsRef.current = controls;

    // Bright sunny storybook lighting
    scene.add(new THREE.HemisphereLight(0xffffff, 0xc7e6c9, 1.25));
    const sun = new THREE.DirectionalLight(0xfffbeb, 1.35);
    sun.position.set(5, 9, 6);
    sun.castShadow = true;
    sun.shadow.mapSize.width = 1024;
    sun.shadow.mapSize.height = 1024;
    const d = 6;
    sun.shadow.camera.left = -d;
    sun.shadow.camera.right = d;
    sun.shadow.camera.top = d;
    sun.shadow.camera.bottom = -d;
    scene.add(sun);

    const fill = new THREE.DirectionalLight(0xbae6fd, 0.55);
    fill.position.set(-5, 4, -5);
    scene.add(fill);

    // Build Pip Puppy once and keep him in scene
    const pip = buildPipPuppy();
    pip.root.position.set(0, 0.16, 1.8);
    scene.add(pip.root);
    pipRef.current = pip;

    // Touch-friendly Raycaster
    const raycaster = new THREE.Raycaster();
    const pointer = new THREE.Vector2();
    let downPos = { x: 0, y: 0 };

    const onPointerDown = (e: PointerEvent) => {
      downPos = { x: e.clientX, y: e.clientY };
    };

    const onPointerUp = (e: PointerEvent) => {
      if (modeRef.current !== 'tap') return;
      const moved = Math.hypot(e.clientX - downPos.x, e.clientY - downPos.y);
      if (moved > 14) return; // Ignore orbit drags, keep taps forgiving for kids' fingers

      const rect = renderer.domElement.getBoundingClientRect();
      pointer.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      pointer.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
      raycaster.setFromCamera(pointer, camera);

      const hits = raycaster.intersectObjects(hitTargetsRef.current, false);
      if (hits.length > 0) {
        const itemId = hits[0].object.userData.itemId as string | undefined;
        if (itemId) {
          onTapRef.current?.(itemId);
        }
      }
    };

    renderer.domElement.addEventListener('pointerdown', onPointerDown);
    renderer.domElement.addEventListener('pointerup', onPointerUp);

    const ro = new ResizeObserver(() => {
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
      const dt = Math.min(clock.getDelta(), 0.05);
      const t = clock.elapsedTime;

      worldUpdateRef.current?.(t);

      // Pip motion logic
      const p = pipRef.current;
      if (p) {
        if (happySpinRef.current > 0) {
          happySpinRef.current = Math.max(0, happySpinRef.current - dt * 1.15);
        }

        if (pipPathLoopRef.current === 'circle-pond') {
          // Run happily in a circle around the Duck Pond at (2.05, 0.16, 0.05)
          const angle = t * 1.35;
          const r = 1.52;
          const nx = 2.05 + Math.cos(angle) * r;
          const nz = 0.05 + Math.sin(angle) * r;
          p.root.position.set(nx, 0.16 + Math.abs(Math.sin(t * 7)) * 0.14, nz);
          p.root.rotation.y = -angle;
        } else if (pipActiveCurveRef.current) {
          // Loop along smooth 3D CatmullRom path (into / out of / over / through / up / down)
          const u = (t * 0.42) % 1;
          const pos = pipActiveCurveRef.current.getPointAt(u);
          const tan = pipActiveCurveRef.current.getTangentAt(u);
          p.root.position.copy(pos);
          p.root.rotation.y = Math.atan2(tan.x, tan.z);
        } else {
          // Smooth bouncy hop from start to static destination!
          if (pipHopProgressRef.current < 1) {
            pipHopProgressRef.current = Math.min(1, pipHopProgressRef.current + dt * 2.1);
            const u = pipHopProgressRef.current;
            const eased = u < 0.5 ? 2 * u * u : 1 - Math.pow(-2 * u + 2, 2) / 2;
            const lerped = new THREE.Vector3().lerpVectors(
              pipStartPosRef.current,
              pipEndPosRef.current,
              eased
            );
            // Cute parabolic jump height
            lerped.y += Math.sin(u * Math.PI) * 0.85;
            p.root.position.copy(lerped);
          } else {
            p.root.position.copy(pipEndPosRef.current);
          }
          // Smoothly rotate toward desired facing
          const targetY = pipFacingYRef.current;
          p.root.rotation.y += (targetY - p.root.rotation.y) * Math.min(1, dt * 6);
        }

        p.updateIdle(t, happySpinRef.current);
      }

      // Pulse Tap-in-3D star hotspots
      hotspotVisualsRef.current.forEach((mesh, id) => {
        const mat = mesh.material as THREE.MeshStandardMaterial;
        mesh.rotation.y = t * 1.8;
        if (wonIdRef.current === id) {
          mat.color.setHex(0x10b981);
          mat.emissive.setHex(0x10b981);
          mesh.scale.setScalar(1.3 + Math.sin(t * 6) * 0.1);
        } else if (wrongIdRef.current === id) {
          mat.color.setHex(0xf43f5e);
          mat.emissive.setHex(0xf43f5e);
          mesh.scale.setScalar(0.95);
        } else {
          mat.color.setHex(0xfbbf24);
          mat.emissive.setHex(0xf59e0b);
          mesh.scale.setScalar(1.0 + Math.sin(t * 3.5 + mesh.position.x) * 0.12);
        }
      });

      // Update celebration confetti star burst
      const alive: BurstParticle[] = [];
      for (const bp of burstParticlesRef.current) {
        bp.life -= dt;
        if (bp.life <= 0) {
          scene.remove(bp.mesh);
          bp.mesh.geometry.dispose();
          (bp.mesh.material as THREE.Material).dispose();
        } else {
          bp.mesh.position.addScaledVector(bp.vel, dt);
          bp.vel.y -= dt * 3.2;
          bp.mesh.rotation.x += dt * 4;
          bp.mesh.rotation.y += dt * 5;
          bp.mesh.scale.setScalar(Math.max(0.01, bp.life));
          alive.push(bp);
        }
      }
      burstParticlesRef.current = alive;

      controls.update();
      renderer.render(scene, camera);
    };
    animate();

    return () => {
      cancelAnimationFrame(rafId);
      ro.disconnect();
      renderer.domElement.removeEventListener('pointerdown', onPointerDown);
      renderer.domElement.removeEventListener('pointerup', onPointerUp);
      controls.dispose();
      renderer.dispose();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // 2. Rebuild World Backdrop whenever world changes
  useEffect(() => {
    const scene = sceneRef.current;
    const camera = cameraRef.current;
    const controls = controlsRef.current;
    if (!scene || !camera || !controls) return;

    if (worldGroupRef.current) {
      scene.remove(worldGroupRef.current);
      disposeGroup(worldGroupRef.current);
      worldGroupRef.current = null;
    }

    const built = buildKidsWorldBackdrop(world.id);
    scene.add(built.group);
    worldGroupRef.current = built.group;
    worldUpdateRef.current = built.update;

    camera.position.set(...world.cameraPos);
    controls.target.set(...world.cameraTarget);
    controls.update();
  }, [world]);

  // 3. Rebuild Tap-in-3D Star Hotspots when mode or world changes
  useEffect(() => {
    const scene = sceneRef.current;
    if (!scene) return;

    if (hotspotGroupRef.current) {
      scene.remove(hotspotGroupRef.current);
      disposeGroup(hotspotGroupRef.current);
      hotspotGroupRef.current = null;
    }
    hitTargetsRef.current = [];
    hotspotVisualsRef.current.clear();

    if (mode !== 'tap') return;

    const grp = new THREE.Group();
    world.items.forEach((item, idx) => {
      // Visible spinning golden octahedron star
      const vis = new THREE.Mesh(
        new THREE.OctahedronGeometry(0.28, 0),
        new THREE.MeshStandardMaterial({
          color: 0xfbbf24,
          emissive: 0xf59e0b,
          emissiveIntensity: 0.4,
          roughness: 0.25,
        })
      );
      vis.position.set(...item.hotspotPos);
      grp.add(vis);
      hotspotVisualsRef.current.set(item.id, vis);

      // Generous invisible touch hit-sphere for small iPad fingers
      const hit = new THREE.Mesh(
        new THREE.SphereGeometry(0.56, 12, 12),
        new THREE.MeshBasicMaterial({ visible: false })
      );
      hit.position.set(...item.hotspotPos);
      hit.userData = { itemId: item.id };
      grp.add(hit);
      hitTargetsRef.current.push(hit);

      // Friendly numbered badge above star
      const lbl = makeLabelSprite(`${idx + 1}`, {
        bg: '#0284C7',
        color: '#FFFFFF',
        scale: 0.34,
      });
      lbl.position.set(item.hotspotPos[0], item.hotspotPos[1] + 0.56, item.hotspotPos[2]);
      grp.add(lbl);
    });

    scene.add(grp);
    hotspotGroupRef.current = grp;
  }, [world, mode]);

  // 4. Move/Animate Pip whenever activeItem changes
  useEffect(() => {
    const scene = sceneRef.current;
    const pip = pipRef.current;
    if (!scene || !pip) return;

    // Remove previous path ribbon
    if (pathRibbonRef.current) {
      scene.remove(pathRibbonRef.current);
      pathRibbonRef.current.geometry.dispose();
      (pathRibbonRef.current.material as THREE.Material).dispose();
      pathRibbonRef.current = null;
    }

    if (!activeItem) {
      // Waiting pose in Tap mode before child answers
      pipActiveCurveRef.current = null;
      pipPathLoopRef.current = null;
      pipStartPosRef.current.copy(pip.root.position);
      pipEndPosRef.current.set(0, 0.16, 2.55);
      pipHopProgressRef.current = 0;
      pipFacingYRef.current = Math.PI;
      return;
    }

    if (activeItem.pathLoop === 'circle-pond') {
      pipActiveCurveRef.current = null;
      pipPathLoopRef.current = 'circle-pond';
      // Add dashed/glowing circular ring around pond
      const pts: THREE.Vector3[] = [];
      for (let i = 0; i <= 24; i++) {
        const a = (i / 24) * Math.PI * 2;
        pts.push(new THREE.Vector3(2.05 + Math.cos(a) * 1.52, 0.22, 0.05 + Math.sin(a) * 1.52));
      }
      const { mesh } = makeCurveTube(pts, KIDS_BUTTON_STYLES[activeItem.color].hex, 0.04, 0.55);
      scene.add(mesh);
      pathRibbonRef.current = mesh;
      return;
    }

    if (activeItem.pipPath && activeItem.pipPath.length >= 2) {
      pipPathLoopRef.current = 'loop';
      const vectors = activeItem.pipPath.map((pt) => new THREE.Vector3(...pt));
      const { curve, mesh } = makeCurveTube(
        vectors,
        KIDS_BUTTON_STYLES[activeItem.color].hex,
        0.045,
        0.55
      );
      pipActiveCurveRef.current = curve;
      scene.add(mesh);
      pathRibbonRef.current = mesh;
      return;
    }

    // Static target with joyful parabolic jump!
    pipActiveCurveRef.current = null;
    pipPathLoopRef.current = null;
    pipStartPosRef.current.copy(pip.root.position);
    pipEndPosRef.current.set(...activeItem.pipPos);
    pipHopProgressRef.current = 0;
    pipFacingYRef.current = activeItem.pipFacingY ?? 0;
  }, [activeItem]);

  // 5. Celebration 3D star confetti burst + Pip happy spin!
  useEffect(() => {
    if (celebrateNonce === 0) return;
    const scene = sceneRef.current;
    const pip = pipRef.current;
    if (!scene || !pip) return;

    happySpinRef.current = 1.0;
    const origin = pip.root.position.clone().add(new THREE.Vector3(0, 0.7, 0));
    const palette = [0xfbbf24, 0xf43f5e, 0x38bdf8, 0x34d399, 0xa78bfa];

    for (let i = 0; i < 16; i++) {
      const geo = new THREE.OctahedronGeometry(0.12, 0);
      const mat = new THREE.MeshStandardMaterial({
        color: palette[i % palette.length],
        emissive: palette[i % palette.length],
        emissiveIntensity: 0.45,
      });
      const m = new THREE.Mesh(geo, mat);
      m.position.copy(origin);
      scene.add(m);

      const angle = (i / 16) * Math.PI * 2;
      const speed = 1.2 + Math.random() * 1.4;
      burstParticlesRef.current.push({
        mesh: m,
        vel: new THREE.Vector3(
          Math.cos(angle) * speed,
          2.2 + Math.random() * 1.8,
          Math.sin(angle) * speed
        ),
        life: 1.0 + Math.random() * 0.4,
      });
    }
  }, [celebrateNonce]);

  const handleResetCamera = () => {
    const cam = cameraRef.current;
    const ctr = controlsRef.current;
    if (!cam || !ctr) return;
    cam.position.set(...worldRef.current.cameraPos);
    ctr.target.set(...worldRef.current.cameraTarget);
    ctr.update();
  };

  return (
    <div className="touch-canvas-stage relative h-full w-full overflow-hidden rounded-3xl border-2 border-sky-900/10 bg-[#EEF6FF] shadow-inner">
      <div ref={containerRef} className="h-full w-full" />

      {/* Kid-friendly touch hint */}
      <div className="pointer-events-none absolute left-3 top-3 inline-flex items-center gap-1.5 rounded-full bg-white/90 px-3 py-1.5 text-xs font-bold text-sky-900 shadow-xs backdrop-blur-md">
        <Hand className="h-4 w-4 text-sky-500" />
        <span>
          {mode === 'tap'
            ? 'Tap a glowing ⭐ star!'
            : 'Spin with 1 finger to look around!'}
        </span>
      </div>

      {/* Reset camera button */}
      <button
        type="button"
        onClick={handleResetCamera}
        className="absolute right-3 top-3 inline-flex items-center gap-1.5 rounded-full bg-white/90 px-3 py-1.5 text-xs font-bold text-sky-900 shadow-xs backdrop-blur-md active:scale-95"
      >
        <RotateCcw className="h-3.5 w-3.5" />
        <span>Center</span>
      </button>
    </div>
  );
};
