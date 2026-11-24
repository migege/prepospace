import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import {
  CheckCircle2,
  XCircle,
  ArrowRight,
  RotateCcw,
  MousePointerClick,
  BookOpen,
} from 'lucide-react';
import {
  PLACEMENT_CHALLENGES,
  PlacementChallenge,
  PlacementSceneKind,
} from '../data/placementChallenges';
import {
  COLORS,
  disposeGroup,
  makeGlassBox,
  makeLabelSprite,
  makeOrb,
  makeSurfacePlate,
} from '../three/helpers';
import { SpeakButton } from './SpeakButton';

interface PlacementArena3DProps {
  onOpenLesson: (lessonId: string) => void;
  onRecordResult?: (challengeId: string, correct: boolean) => void;
}

function buildPlacementBackdrop(kind: PlacementSceneKind): {
  group: THREE.Group;
  cameraPos: [number, number, number];
  target: [number, number, number];
} {
  const group = new THREE.Group();

  switch (kind) {
    case 'corner': {
      const floor = makeSurfacePlate(5.0, 0.16, 5.0, COLORS.cream, COLORS.stone);
      floor.position.y = -0.08;
      group.add(floor);

      const wallMat = new THREE.MeshStandardMaterial({ color: 0xe6e0d4, roughness: 0.65 });
      const wallA = new THREE.Mesh(new THREE.BoxGeometry(2.6, 1.8, 0.2), wallMat);
      wallA.position.set(-0.25, 0.9, -1.25);
      wallA.castShadow = true;
      const wallB = new THREE.Mesh(new THREE.BoxGeometry(0.2, 1.8, 2.6), wallMat);
      wallB.position.set(-1.45, 0.9, -0.05);
      wallB.castShadow = true;
      group.add(wallA, wallB);

      const roadMat = new THREE.MeshStandardMaterial({ color: 0x3f434e, roughness: 0.85 });
      const r1 = new THREE.Mesh(new THREE.BoxGeometry(5.0, 0.04, 1.15), roadMat);
      r1.position.set(0, 0.02, 1.45);
      const r2 = new THREE.Mesh(new THREE.BoxGeometry(1.15, 0.04, 5.0), roadMat);
      r2.position.set(1.45, 0.02, 0);
      group.add(r1, r2);

      return { group, cameraPos: [4.2, 4.0, 4.4], target: [0.2, 0.5, 0.2] };
    }

    case 'hospital': {
      const ground = makeSurfacePlate(5.8, 0.16, 4.2, COLORS.cream, COLORS.stone);
      ground.position.y = -0.08;
      group.add(ground);

      const bldg = makeGlassBox(2.6, 1.95, 2.0, COLORS.cobalt, 0.16);
      bldg.position.set(-0.55, 0.98, -0.15);
      group.add(bldg);

      const crossMat = new THREE.MeshStandardMaterial({ color: COLORS.rose, emissive: COLORS.rose, emissiveIntensity: 0.25 });
      const c1 = new THREE.Mesh(new THREE.BoxGeometry(0.6, 0.18, 0.08), crossMat);
      c1.position.set(-0.55, 1.35, 0.88);
      const c2 = new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.6, 0.08), crossMat);
      c2.position.set(-0.55, 1.35, 0.88);
      group.add(c1, c2);

      return { group, cameraPos: [3.8, 3.3, 5.2], target: [0.2, 0.95, 0.1] };
    }

    case 'transport': {
      const road = makeSurfacePlate(6.8, 0.14, 3.2, 0x3b404c);
      road.position.y = -0.07;
      group.add(road);

      // Left: Compact car cabin
      const carBase = makeSurfacePlate(1.7, 0.42, 1.1, COLORS.cobalt, COLORS.cobalt);
      carBase.position.set(-1.95, 0.32, 0);
      const carCab = makeGlassBox(1.15, 0.68, 1.0, COLORS.cobalt, 0.24);
      carCab.position.set(-1.95, 0.88, 0);
      group.add(carBase, carCab);

      // Center: Walkable bus deck
      const busDeck = makeSurfacePlate(2.5, 0.22, 1.35, COLORS.coral, COLORS.coral);
      busDeck.position.set(0.45, 0.56, 0);
      const busFrame = makeGlassBox(2.5, 1.25, 1.35, COLORS.warmWhite, 0.1);
      busFrame.position.set(0.45, 1.28, 0);
      group.add(busDeck, busFrame);

      // Right: Stop pole
      const pole = new THREE.Mesh(
        new THREE.CylinderGeometry(0.04, 0.04, 1.5, 12),
        new THREE.MeshStandardMaterial({ color: COLORS.emerald })
      );
      pole.position.set(2.55, 0.75, 0.85);
      group.add(pole);

      return { group, cameraPos: [0.4, 3.4, 6.2], target: [0.2, 0.8, 0.1] };
    }

    case 'traversal': {
      // 3 parallel tracks: Tunnel (back), Bridge (mid), Linear rail (front)
      const tunnel = new THREE.Mesh(
        new THREE.CylinderGeometry(0.75, 0.75, 2.6, 28, 1, true),
        new THREE.MeshPhysicalMaterial({
          color: COLORS.cobalt,
          transparent: true,
          opacity: 0.22,
          side: THREE.DoubleSide,
          depthWrite: false,
        })
      );
      tunnel.rotation.z = Math.PI / 2;
      tunnel.position.set(0, 1.1, -1.35);
      group.add(tunnel);

      const bridge = makeSurfacePlate(3.2, 0.14, 0.9, COLORS.warmWhite, COLORS.coral);
      bridge.position.set(0, 0.2, 0.15);
      group.add(bridge);

      const canal = makeSurfacePlate(3.6, 0.1, 0.5, 0x60a5fa);
      canal.position.set(0, 0.05, 1.05);
      const railPath = makeSurfacePlate(3.6, 0.1, 0.55, COLORS.cream, COLORS.amber);
      railPath.position.set(0, 0.05, 1.58);
      group.add(canal, railPath);

      return { group, cameraPos: [3.2, 3.6, 5.2], target: [0, 0.65, 0.1] };
    }

    case 'deadline': {
      const axis = new THREE.Mesh(
        new THREE.CylinderGeometry(0.05, 0.05, 6.2, 16),
        new THREE.MeshStandardMaterial({ color: COLORS.ink })
      );
      axis.rotation.z = Math.PI / 2;
      axis.position.y = 0.25;
      group.add(axis);

      // Red Friday Wall
      const wall = makeSurfacePlate(0.22, 2.0, 2.4, COLORS.rose, COLORS.rose);
      wall.position.set(1.35, 1.05, 0);
      group.add(wall);

      const wLbl = makeLabelSprite('FRIDAY 5 PM', { bg: '#BE123C', scale: 0.36 });
      wLbl.position.set(1.35, 2.35, 0);
      group.add(wLbl);

      // Back track: continuous beam right up to wall
      const beam = new THREE.Mesh(
        new THREE.BoxGeometry(3.5, 0.36, 0.45),
        new THREE.MeshStandardMaterial({ color: COLORS.amber, emissive: COLORS.amber, emissiveIntensity: 0.25 })
      );
      beam.position.set(-0.55, 0.72, -0.75);
      group.add(beam);

      // Front track: safe completion zone
      const safe = makeGlassBox(3.4, 0.38, 0.75, COLORS.emerald, 0.2);
      safe.position.set(-0.55, 0.72, 0.75);
      group.add(safe);

      return { group, cameraPos: [1.2, 3.5, 5.8], target: [0.3, 0.9, 0] };
    }

    case 'vertical': {
      // Left: Canopy roof (OVER/ABOVE above it, UNDER directly beneath it)
      const roof = makeSurfacePlate(2.1, 0.2, 1.7, COLORS.violet, COLORS.violet);
      roof.position.set(-1.4, 1.45, 0);
      group.add(roof);
      [
        [-2.25, 0.7, -0.65],
        [-0.55, 0.7, -0.65],
        [-2.25, 0.7, 0.65],
        [-0.55, 0.7, 0.65],
      ].forEach(([x, y, z]) => {
        const col = new THREE.Mesh(
          new THREE.CylinderGeometry(0.06, 0.06, 1.4, 12),
          new THREE.MeshStandardMaterial({ color: COLORS.stone })
        );
        col.position.set(x, y, z);
        group.add(col);
      });

      // Right: 0° benchmark glass plane (BELOW is underneath)
      const bench = makeGlassBox(2.1, 0.08, 1.7, COLORS.emerald, 0.3);
      bench.position.set(1.55, 1.45, 0);
      group.add(bench);
      const bLbl = makeLabelSprite('0° BENCHMARK', { bg: '#18181B', scale: 0.3 });
      bLbl.position.set(1.55, 1.85, 0);
      group.add(bLbl);

      return { group, cameraPos: [0.3, 3.1, 6.0], target: [0, 1.15, 0] };
    }

    case 'between-among': {
      // Left: 3 distinct named pillars
      [
        [-2.35, -0.55],
        [-0.75, -0.55],
        [-1.55, 0.95],
      ].forEach(([x, z]) => {
        const p = makeSurfacePlate(0.55, 1.65, 0.55, COLORS.warmWhite, COLORS.emerald);
        p.position.set(x, 0.82, z);
        group.add(p);
      });

      // Right: dense organic crowd of 14 spheres
      for (let i = 0; i < 14; i++) {
        const a = (i / 14) * Math.PI * 2;
        const r = i % 2 === 0 ? 0.78 : 1.18;
        const s = makeOrb(0.22, COLORS.stone, 0.05);
        s.position.set(1.65 + Math.cos(a) * r, 0.45 + (i % 3) * 0.25, Math.sin(a) * r);
        group.add(s);
      }

      return { group, cameraPos: [0.1, 3.6, 5.8], target: [0, 0.85, 0] };
    }

    case 'ghost-circuit': {
      // 3 pedestals: Direct Lock vs ABOUT vs ON
      const p1 = makeSurfacePlate(1.4, 0.5, 1.1, COLORS.ink, COLORS.emerald);
      p1.position.set(-1.45, 0.5, 0);
      const p2 = makeSurfacePlate(1.3, 0.5, 1.1, COLORS.cream, COLORS.rose);
      p2.position.set(0.35, 0.5, 0);
      const p3 = makeSurfacePlate(1.3, 0.5, 1.1, COLORS.cream, COLORS.amber);
      p3.position.set(1.95, 0.5, 0);
      group.add(p1, p2, p3);

      return { group, cameraPos: [0.25, 2.9, 5.6], target: [0.25, 0.95, 0] };
    }
  }
}

export const PlacementArena3D: React.FC<PlacementArena3DProps> = ({
  onOpenLesson,
  onRecordResult,
}) => {
  const [index, setIndex] = useState(0);
  const [pickedId, setPickedId] = useState<string | null>(null);
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [score, setScore] = useState({ correct: 0, total: 0 });

  const challenge: PlacementChallenge = PLACEMENT_CHALLENGES[index % PLACEMENT_CHALLENGES.length];
  const isCorrect = pickedId === challenge.correctHotspotId;

  const containerRef = useRef<HTMLDivElement | null>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const controlsRef = useRef<OrbitControls | null>(null);
  const activeGroupRef = useRef<THREE.Group | null>(null);
  const hotspotMeshesRef = useRef<Map<string, THREE.Mesh>>(new Map());
  const heroOrbRef = useRef<THREE.Mesh | null>(null);
  const heroTargetPosRef = useRef<THREE.Vector3>(new THREE.Vector3(0, 2.6, 0));
  const hoveredIdRef = useRef<string | null>(null);
  const pickedIdRef = useRef<string | null>(null);
  const challengeRef = useRef<PlacementChallenge>(challenge);

  useEffect(() => {
    challengeRef.current = challenge;
    pickedIdRef.current = pickedId;
  }, [challenge, pickedId]);

  // 1. Setup Three.js canvas & Raycaster once
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
    renderer.setSize(container.clientWidth || 640, container.clientHeight || 420);
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
      (container.clientWidth || 640) / (container.clientHeight || 420),
      0.1,
      60
    );
    camera.position.set(3.8, 3.6, 5.2);
    cameraRef.current = camera;

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.08;
    controls.minDistance = 3.0;
    controls.maxDistance = 12;
    controls.maxPolarAngle = Math.PI / 2 - 0.04;
    controlsRef.current = controls;

    // Lighting
    scene.add(new THREE.HemisphereLight(0xfffdf9, 0xd8d2c5, 1.15));
    const key = new THREE.DirectionalLight(0xfff9f0, 1.35);
    key.position.set(5, 8.5, 6);
    key.castShadow = true;
    scene.add(key);
    const rim = new THREE.DirectionalLight(0xc7dcff, 0.55);
    rim.position.set(-5, 4, -5);
    scene.add(rim);

    const grid = new THREE.GridHelper(20, 20, 0xd4cfc2, 0xe2ddd2);
    grid.position.y = -0.01;
    scene.add(grid);

    // Raycaster for hover + click
    const raycaster = new THREE.Raycaster();
    const pointer = new THREE.Vector2();
    let pointerDownPos = { x: 0, y: 0 };

    const getHitHotspotId = (clientX: number, clientY: number): string | null => {
      const rect = renderer.domElement.getBoundingClientRect();
      pointer.x = ((clientX - rect.left) / rect.width) * 2 - 1;
      pointer.y = -((clientY - rect.top) / rect.height) * 2 + 1;
      raycaster.setFromCamera(pointer, camera);
      const meshes = Array.from(hotspotMeshesRef.current.values());
      const hits = raycaster.intersectObjects(meshes, false);
      if (hits.length > 0) {
        return (hits[0].object.userData.hotspotId as string) || null;
      }
      return null;
    };

    const onPointerMove = (e: PointerEvent) => {
      const id = getHitHotspotId(e.clientX, e.clientY);
      hoveredIdRef.current = id;
      setHoveredId(id);
      renderer.domElement.style.cursor = id ? 'pointer' : 'grab';
    };

    const onPointerDown = (e: PointerEvent) => {
      pointerDownPos = { x: e.clientX, y: e.clientY };
    };

    const onPointerUp = (e: PointerEvent) => {
      // Ignore drags (OrbitControls)
      const dist = Math.hypot(e.clientX - pointerDownPos.x, e.clientY - pointerDownPos.y);
      if (dist > 6) return;
      if (pickedIdRef.current !== null) return;

      const hitId = getHitHotspotId(e.clientX, e.clientY);
      if (!hitId) return;

      const ch = challengeRef.current;
      const hs = ch.hotspots.find((h) => h.id === hitId);
      if (!hs) return;

      heroTargetPosRef.current.set(...hs.orbTarget);
      pickedIdRef.current = hitId;
      setPickedId(hitId);
      const ok = hitId === ch.correctHotspotId;
      setScore((prev) => ({ correct: prev.correct + (ok ? 1 : 0), total: prev.total + 1 }));
      onRecordResult?.(ch.id, ok);
    };

    renderer.domElement.addEventListener('pointermove', onPointerMove);
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

      // Animate hero orb smoothly flying to chosen hotspot (or hovering gently before pick)
      if (heroOrbRef.current) {
        const target = heroTargetPosRef.current.clone();
        target.y += Math.sin(t * 2.8) * 0.06;
        heroOrbRef.current.position.lerp(target, Math.min(1, dt * 8));
      }

      // Pulse hotspot discs & tint according to hover / answer state
      hotspotMeshesRef.current.forEach((mesh, id) => {
        const mat = mesh.material as THREE.MeshStandardMaterial;
        const picked = pickedIdRef.current;
        const ch = challengeRef.current;

        if (picked !== null) {
          if (id === ch.correctHotspotId) {
            mat.color.setHex(COLORS.emerald);
            mat.emissive.setHex(COLORS.emerald);
            mat.emissiveIntensity = 0.55;
            mesh.scale.setScalar(1.18 + Math.sin(t * 4) * 0.06);
          } else if (id === picked) {
            mat.color.setHex(COLORS.rose);
            mat.emissive.setHex(COLORS.rose);
            mat.emissiveIntensity = 0.5;
            mesh.scale.setScalar(1.05);
          } else {
            mat.color.setHex(COLORS.stone);
            mat.emissiveIntensity = 0.05;
            mesh.scale.setScalar(0.85);
          }
        } else {
          const isHov = hoveredIdRef.current === id;
          mat.color.setHex(isHov ? COLORS.cobalt : COLORS.amber);
          mat.emissive.setHex(isHov ? COLORS.cobalt : COLORS.amber);
          mat.emissiveIntensity = isHov ? 0.55 : 0.25;
          mesh.scale.setScalar(isHov ? 1.24 : 1 + Math.sin(t * 3 + mesh.position.x) * 0.07);
        }
      });

      controls.update();
      renderer.render(scene, camera);
    };
    animate();

    return () => {
      cancelAnimationFrame(rafId);
      ro.disconnect();
      renderer.domElement.removeEventListener('pointermove', onPointerMove);
      renderer.domElement.removeEventListener('pointerdown', onPointerDown);
      renderer.domElement.removeEventListener('pointerup', onPointerUp);
      controls.dispose();
      if (activeGroupRef.current) {
        scene.remove(activeGroupRef.current);
        disposeGroup(activeGroupRef.current);
      }
      renderer.dispose();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // 2. Rebuild 3D challenge diorama whenever challenge index changes
  useEffect(() => {
    const scene = sceneRef.current;
    const camera = cameraRef.current;
    const controls = controlsRef.current;
    if (!scene || !camera || !controls) return;

    if (activeGroupRef.current) {
      scene.remove(activeGroupRef.current);
      disposeGroup(activeGroupRef.current);
      activeGroupRef.current = null;
    }
    hotspotMeshesRef.current.clear();

    const { group, cameraPos, target } = buildPlacementBackdrop(challenge.sceneKind);

    // Add interactive clickable 3D hotspot orbs/pads + floating letter badges
    challenge.hotspots.forEach((hs) => {
      const pad = new THREE.Mesh(
        new THREE.SphereGeometry(hs.radius ?? 0.34, 24, 24),
        new THREE.MeshStandardMaterial({
          color: COLORS.amber,
          emissive: COLORS.amber,
          emissiveIntensity: 0.25,
          transparent: true,
          opacity: 0.78,
          roughness: 0.25,
        })
      );
      pad.position.set(...hs.position);
      pad.userData = { hotspotId: hs.id };
      group.add(pad);
      hotspotMeshesRef.current.set(hs.id, pad);

      const badge = makeLabelSprite(hs.label, { bg: 'rgba(24,24,27,0.88)', scale: 0.34 });
      badge.position.set(hs.position[0], hs.position[1] + 0.62, hs.position[2]);
      group.add(badge);
    });

    // Hero orb hovering above waiting to fly into user's clicked zone
    const heroOrb = makeOrb(0.28, COLORS.cobalt, 0.45);
    heroOrb.position.set(0, 2.7, 0);
    group.add(heroOrb);
    heroOrbRef.current = heroOrb;
    heroTargetPosRef.current.set(0, 2.7, 0);

    scene.add(group);
    activeGroupRef.current = group;

    camera.position.set(...cameraPos);
    controls.target.set(...target);
    controls.update();
  }, [challenge]);

  const handleManualPick = (hsId: string) => {
    if (pickedId !== null) return;
    const hs = challenge.hotspots.find((h) => h.id === hsId);
    if (!hs) return;
    heroTargetPosRef.current.set(...hs.orbTarget);
    pickedIdRef.current = hsId;
    setPickedId(hsId);
    const ok = hsId === challenge.correctHotspotId;
    setScore((prev) => ({ correct: prev.correct + (ok ? 1 : 0), total: prev.total + 1 }));
    onRecordResult?.(challenge.id, ok);
  };

  const handleNext = () => {
    setPickedId(null);
    pickedIdRef.current = null;
    setIndex((i) => (i + 1) % PLACEMENT_CHALLENGES.length);
  };

  const handleRetry = () => {
    setPickedId(null);
    pickedIdRef.current = null;
    heroTargetPosRef.current.set(0, 2.7, 0);
  };

  return (
    <div className="grid items-start gap-6 lg:grid-cols-12">
      {/* 3D Raycast Stage */}
      <div className="lg:col-span-7">
        <div className="touch-canvas-stage relative h-[380px] w-full overflow-hidden rounded-2xl border border-zinc-900/10 bg-[#F2EFE8] shadow-sm sm:h-[460px]">
          <div ref={containerRef} className="h-full w-full" />

          <div className="pointer-events-none absolute left-3 top-3 inline-flex items-center gap-1.5 rounded-full border border-zinc-900/10 bg-white/90 px-3 py-1 text-xs font-semibold text-zinc-800 backdrop-blur-md">
            <MousePointerClick className="h-3.5 w-3.5 text-[#3B6CF5]" />
            <span>
              {pickedId
                ? isCorrect
                  ? 'Orb placed accurately!'
                  : 'Green zone shows the exact spatial match'
                : hoveredId
                  ? 'Click to place orb here!'
                  : 'Click a glowing amber orb inside the 3D scene'}
            </span>
          </div>

          <div className="pointer-events-none absolute right-3 top-3 rounded-lg border border-zinc-900/10 bg-white/85 px-2.5 py-1 font-mono text-xs font-semibold text-zinc-700 backdrop-blur-md">
            3D Score: {score.correct}/{score.total}
          </div>
        </div>
      </div>

      {/* Prompt & Controls Panel */}
      <div className="rounded-2xl border border-zinc-900/10 bg-white p-6 shadow-2xs lg:col-span-5">
        <div className="flex items-center justify-between gap-2">
          <span className="font-mono text-xs font-bold text-zinc-400">
            3D CHALLENGE {index + 1} / {PLACEMENT_CHALLENGES.length}
          </span>
          <span className="rounded-md bg-[#3B6CF5]/10 px-2 py-0.5 font-mono text-[11px] font-semibold text-[#234DC7]">
            {challenge.moduleTag}
          </span>
        </div>

        <p className="mt-3 text-xs font-semibold uppercase tracking-wide text-zinc-500">
          {challenge.instruction}
        </p>

        <div className="mt-2.5 flex items-start justify-between gap-3 rounded-xl border border-zinc-900/8 bg-[#FAF8F4] p-4">
          <p className="text-base font-semibold leading-snug text-zinc-950">
            “{challenge.sentence}”
          </p>
          <SpeakButton text={challenge.sentence} />
        </div>

        {/* Accessible Click Buttons synced with 3D Hotspots */}
        <div className="mt-4 space-y-2">
          <div className="text-[11px] font-semibold uppercase tracking-wide text-zinc-400">
            Click in 3D above — or select zone directly:
          </div>
          {challenge.hotspots.map((hs) => {
            const isPicked = pickedId === hs.id;
            const isAnswer = hs.id === challenge.correctHotspotId;
            const isHov = hoveredId === hs.id;

            let cls =
              'border-zinc-900/10 bg-[#FAF8F4] text-zinc-800 hover:border-[#3B6CF5]/40 hover:bg-white';
            if (pickedId !== null) {
              if (isAnswer) {
                cls = 'border-emerald-500/40 bg-emerald-500/10 font-semibold text-emerald-950';
              } else if (isPicked) {
                cls = 'border-rose-500/40 bg-rose-500/10 text-rose-950';
              } else {
                cls = 'border-zinc-900/8 bg-zinc-50 text-zinc-400';
              }
            } else if (isHov) {
              cls = 'border-[#3B6CF5] bg-[#3B6CF5]/10 text-[#234DC7] font-semibold';
            }

            return (
              <button
                key={hs.id}
                type="button"
                disabled={pickedId !== null}
                onClick={() => handleManualPick(hs.id)}
                className={`flex w-full items-center justify-between gap-2 rounded-xl border px-3.5 py-2.5 text-left text-sm transition ${cls}`}
              >
                <span>{hs.label}</span>
                {pickedId !== null && isAnswer && (
                  <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600" />
                )}
                {pickedId !== null && isPicked && !isAnswer && (
                  <XCircle className="h-4 w-4 shrink-0 text-rose-600" />
                )}
              </button>
            );
          })}
        </div>

        {pickedId !== null && (
          <div className="mt-4 space-y-3">
            <div
              className={`rounded-xl px-4 py-3 text-xs leading-relaxed ${
                isCorrect ? 'bg-emerald-500/10 text-emerald-950' : 'bg-rose-500/10 text-rose-950'
              }`}
            >
              <strong>{isCorrect ? 'Exact spatial match!' : 'Not quite — look at the green zone:'}</strong>{' '}
              {challenge.explanation}
            </div>

            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                {!isCorrect && (
                  <button
                    type="button"
                    onClick={handleRetry}
                    className="inline-flex items-center gap-1 rounded-xl border border-zinc-900/12 px-3 py-2 text-xs font-semibold text-zinc-700 hover:bg-zinc-50"
                  >
                    <RotateCcw className="h-3.5 w-3.5" />
                    <span>Retry</span>
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => onOpenLesson(challenge.lessonId)}
                  className="inline-flex items-center gap-1 text-xs font-semibold text-[#234DC7] hover:underline"
                >
                  <BookOpen className="h-3.5 w-3.5" />
                  <span>Open Lesson</span>
                </button>
              </div>
              <button
                type="button"
                onClick={handleNext}
                className="inline-flex items-center gap-1.5 rounded-xl bg-zinc-950 px-4 py-2.5 text-xs font-semibold text-white transition hover:bg-zinc-800"
              >
                <span>Next 3D Challenge</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
