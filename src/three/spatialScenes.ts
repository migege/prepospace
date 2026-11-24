import * as THREE from 'three';
import {
  BuiltScene,
  COLORS,
  makeCurveTube,
  makeGlassBox,
  makeLabelSprite,
  makeOrb,
  makePulseRing,
  makeSurfacePlate,
} from './helpers';

export function buildHeroTrio(): BuiltScene {
  const group = new THREE.Group();

  // Base architectural plinth
  const plinth = makeSurfacePlate(7.4, 0.24, 3.6, COLORS.cream, COLORS.stone);
  plinth.position.y = -0.12;
  group.add(plinth);

  // 1. IN Container (Left)
  const inBox = makeGlassBox(1.55, 1.55, 1.55, COLORS.cobalt, 0.2);
  inBox.position.set(-2.3, 0.9, 0);
  group.add(inBox);

  const inOrb = makeOrb(0.34, COLORS.cobalt, 0.35);
  inOrb.position.set(-2.3, 0.9, 0);
  group.add(inOrb);

  const inLbl = makeLabelSprite('IN · 3D', { bg: '#234DC7', scale: 0.44 });
  inLbl.position.set(-2.3, 2.05, 0);
  group.add(inLbl);

  // 2. ON Surface (Center)
  const onPad = makeSurfacePlate(1.75, 0.18, 1.75, COLORS.coral, COLORS.coral);
  onPad.position.set(0, 0.16, 0);
  group.add(onPad);

  const onOrb = makeOrb(0.36, COLORS.coral, 0.3);
  onOrb.position.set(0, 0.61, 0);
  group.add(onOrb);

  const onRing = makePulseRing(0.42, 0.56, COLORS.coral);
  onRing.position.set(0, 0.26, 0);
  group.add(onRing);

  const onLbl = makeLabelSprite('ON · 2D', { bg: '#C24124', scale: 0.44 });
  onLbl.position.set(0, 1.5, 0);
  group.add(onLbl);

  // 3. AT Pinpoint (Right)
  const atRingOuter = makePulseRing(0.45, 0.52, COLORS.emerald);
  atRingOuter.position.set(2.3, 0.03, 0);
  group.add(atRingOuter);

  const atRingInner = makePulseRing(0.16, 0.22, COLORS.emerald);
  atRingInner.position.set(2.3, 0.035, 0);
  group.add(atRingInner);

  const pinStem = new THREE.Mesh(
    new THREE.CylinderGeometry(0.03, 0.01, 1.05, 16),
    new THREE.MeshStandardMaterial({ color: COLORS.emerald, roughness: 0.2 })
  );
  pinStem.position.set(2.3, 0.56, 0);
  group.add(pinStem);

  const atOrb = makeOrb(0.24, COLORS.emerald, 0.4);
  atOrb.position.set(2.3, 1.12, 0);
  group.add(atOrb);

  const atLbl = makeLabelSprite('AT · 0D', { bg: '#0F766E', scale: 0.44 });
  atLbl.position.set(2.3, 1.85, 0);
  group.add(atLbl);

  // Sweeping dynamic motion arc above them
  const { curve, mesh: arcMesh } = makeCurveTube(
    [
      new THREE.Vector3(-2.3, 2.35, -0.4),
      new THREE.Vector3(0, 2.95, 0.45),
      new THREE.Vector3(2.3, 2.35, -0.4),
    ],
    COLORS.violet,
    0.03,
    0.45
  );
  group.add(arcMesh);

  const comet = makeOrb(0.13, COLORS.violet, 0.6);
  group.add(comet);

  return {
    group,
    cameraPos: [0.2, 3.6, 7.6],
    target: [0, 0.9, 0],
    update: (t) => {
      inOrb.position.y = 0.9 + Math.sin(t * 2.1) * 0.14;
      inBox.rotation.y = Math.sin(t * 0.5) * 0.12;

      onRing.scale.setScalar(1 + Math.sin(t * 2.5) * 0.12);
      onOrb.position.y = 0.61 + Math.abs(Math.sin(t * 1.8)) * 0.08;

      const s = 1 + (t * 0.65) % 0.6;
      atRingOuter.scale.setScalar(s);
      (atRingOuter.material as THREE.MeshBasicMaterial).opacity = Math.max(0, 0.75 - ((t * 0.65) % 0.6));
      atOrb.position.y = 1.12 + Math.sin(t * 2.6 + 1) * 0.08;

      const u = (t * 0.24) % 1;
      comet.position.copy(curve.getPointAt(u));
    },
  };
}

export function buildSpatialScene(sceneId: string): BuiltScene | null {
  switch (sceneId) {
    case 'hero-trio':
    case 'm1-trio-overview':
      return buildHeroTrio();

    case 'm1-in-container': {
      const group = new THREE.Group();
      const box = makeGlassBox(2.2, 2.2, 2.2, COLORS.cobalt, 0.2);
      box.position.y = 1.15;
      group.add(box);

      const orb = makeOrb(0.46, COLORS.cobalt, 0.35);
      orb.position.y = 1.15;
      group.add(orb);

      const lbl = makeLabelSprite('IN · 3D Container', { bg: '#234DC7', scale: 0.46 });
      lbl.position.set(0, 2.75, 0);
      group.add(lbl);

      return {
        group,
        cameraPos: [3.2, 2.8, 4.2],
        target: [0, 1.15, 0],
        update: (t) => {
          orb.position.y = 1.15 + Math.sin(t * 2) * 0.2;
          orb.position.x = Math.cos(t * 1.3) * 0.18;
          box.rotation.y = Math.sin(t * 0.45) * 0.15;
        },
      };
    }

    case 'm1-on-surface': {
      const group = new THREE.Group();
      const plate = makeSurfacePlate(3.6, 0.26, 2.8, COLORS.warmWhite, COLORS.coral);
      plate.position.y = 0.13;
      group.add(plate);

      const accentTop = makeSurfacePlate(3.3, 0.05, 2.5, COLORS.coral);
      accentTop.position.y = 0.28;
      group.add(accentTop);

      const orb = makeOrb(0.48, COLORS.coral, 0.28);
      orb.position.y = 0.79;
      group.add(orb);

      const ring = makePulseRing(0.55, 0.72, COLORS.coral);
      ring.position.y = 0.32;
      group.add(ring);

      const lbl = makeLabelSprite('ON · Surface Contact', { bg: '#C24124', scale: 0.46 });
      lbl.position.set(0, 1.85, 0);
      group.add(lbl);

      return {
        group,
        cameraPos: [3.2, 2.8, 4.1],
        target: [0, 0.7, 0],
        update: (t) => {
          ring.scale.setScalar(1 + Math.sin(t * 2.4) * 0.14);
          orb.position.x = Math.sin(t * 1.1) * 0.55;
          ring.position.x = orb.position.x;
        },
      };
    }

    case 'm1-at-point': {
      const group = new THREE.Group();
      const mapPad = makeSurfacePlate(4.2, 0.12, 3.4, COLORS.cream, COLORS.stone);
      mapPad.position.y = 0.06;
      group.add(mapPad);

      // Crosshair lines
      const crossMat = new THREE.MeshBasicMaterial({ color: COLORS.emerald, transparent: true, opacity: 0.5 });
      const crossX = new THREE.Mesh(new THREE.BoxGeometry(3.2, 0.02, 0.04), crossMat);
      crossX.position.y = 0.14;
      const crossZ = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.02, 2.6), crossMat);
      crossZ.position.y = 0.14;
      group.add(crossX, crossZ);

      const ring = makePulseRing(0.32, 0.42, COLORS.emerald);
      ring.position.y = 0.15;
      group.add(ring);

      const pin = new THREE.Mesh(
        new THREE.ConeGeometry(0.18, 0.7, 24),
        new THREE.MeshStandardMaterial({ color: COLORS.emerald, roughness: 0.25 })
      );
      pin.rotation.x = Math.PI;
      pin.position.y = 0.55;
      group.add(pin);

      const head = makeOrb(0.34, COLORS.emerald, 0.38);
      head.position.y = 1.05;
      group.add(head);

      const lbl = makeLabelSprite('AT · 0D Coordinate', { bg: '#0F766E', scale: 0.46 });
      lbl.position.set(0, 1.9, 0);
      group.add(lbl);

      return {
        group,
        cameraPos: [3.2, 3.0, 4.1],
        target: [0, 0.7, 0],
        update: (t) => {
          const bounce = Math.sin(t * 2.8) * 0.1;
          pin.position.y = 0.55 + bounce;
          head.position.y = 1.05 + bounce;
          const p = (t * 0.7) % 1;
          ring.scale.setScalar(0.8 + p * 1.4);
          (ring.material as THREE.MeshBasicMaterial).opacity = (1 - p) * 0.75;
        },
      };
    }

    case 'm1-corner-in':
    case 'm1-corner-on':
    case 'm1-corner-at': {
      const group = new THREE.Group();

      // Floor slab
      const floor = makeSurfacePlate(4.6, 0.18, 4.6, COLORS.cream, COLORS.stone);
      floor.position.y = -0.09;
      group.add(floor);

      // L-shaped architectural walls
      const wallMat = new THREE.MeshStandardMaterial({
        color: 0xe7e2d7,
        roughness: 0.65,
      });
      const wallA = new THREE.Mesh(new THREE.BoxGeometry(2.6, 1.9, 0.22), wallMat);
      wallA.position.set(-0.2, 0.95, -1.2);
      wallA.castShadow = true;
      wallA.receiveShadow = true;

      const wallB = new THREE.Mesh(new THREE.BoxGeometry(0.22, 1.9, 2.6), wallMat);
      wallB.position.set(-1.39, 0.95, -0.01);
      wallB.castShadow = true;
      wallB.receiveShadow = true;

      group.add(wallA, wallB);

      if (sceneId === 'm1-corner-in') {
        // Interior room corner
        const highlight = makeGlassBox(1.15, 1.2, 1.15, COLORS.cobalt, 0.18);
        highlight.position.set(-0.68, 0.6, -0.5);
        group.add(highlight);

        const orb = makeOrb(0.32, COLORS.cobalt, 0.35);
        orb.position.set(-0.68, 0.45, -0.5);
        group.add(orb);

        const lbl = makeLabelSprite('IN the corner (inside walls)', { bg: '#234DC7', scale: 0.44 });
        lbl.position.set(-0.68, 1.75, -0.5);
        group.add(lbl);

        return {
          group,
          cameraPos: [3.2, 3.2, 3.6],
          target: [-0.3, 0.6, -0.3],
          update: (t) => {
            orb.position.y = 0.45 + Math.sin(t * 2.2) * 0.08;
          },
        };
      }

      if (sceneId === 'm1-corner-on') {
        // Street roads along exterior edges
        const roadMat = new THREE.MeshStandardMaterial({ color: 0x3f434e, roughness: 0.85 });
        const road1 = new THREE.Mesh(new THREE.BoxGeometry(4.6, 0.04, 1.1), roadMat);
        road1.position.set(0, 0.02, 1.55);
        const road2 = new THREE.Mesh(new THREE.BoxGeometry(1.1, 0.04, 4.6), roadMat);
        road2.position.set(1.55, 0.02, 0);
        group.add(road1, road2);

        // Exterior corner building pad
        const cafePad = makeSurfacePlate(1.0, 0.14, 1.0, COLORS.coral, COLORS.coral);
        cafePad.position.set(0.45, 0.08, 0.45);
        group.add(cafePad);

        const orb = makeOrb(0.34, COLORS.coral, 0.35);
        orb.position.set(0.45, 0.5, 0.45);
        group.add(orb);

        const lbl = makeLabelSprite('ON the corner (street edge)', { bg: '#C24124', scale: 0.44 });
        lbl.position.set(0.45, 1.45, 0.45);
        group.add(lbl);

        return {
          group,
          cameraPos: [3.8, 3.4, 3.8],
          target: [0.3, 0.5, 0.3],
          update: (t) => {
            orb.position.y = 0.5 + Math.abs(Math.sin(t * 2)) * 0.09;
          },
        };
      }

      // m1-corner-at: Pinpoint intersection
      const roadMat = new THREE.MeshStandardMaterial({ color: 0x3f434e, roughness: 0.85 });
      const road1 = new THREE.Mesh(new THREE.BoxGeometry(4.6, 0.04, 1.0), roadMat);
      road1.position.set(0, 0.02, 1.25);
      const road2 = new THREE.Mesh(new THREE.BoxGeometry(1.0, 0.04, 4.6), roadMat);
      road2.position.set(1.25, 0.02, 0);
      group.add(road1, road2);

      const ring = makePulseRing(0.28, 0.4, COLORS.emerald);
      ring.position.set(1.25, 0.06, 1.25);
      group.add(ring);

      const pin = makeOrb(0.28, COLORS.emerald, 0.42);
      pin.position.set(1.25, 0.95, 1.25);
      group.add(pin);

      const stem = new THREE.Mesh(
        new THREE.CylinderGeometry(0.03, 0.015, 0.85, 12),
        new THREE.MeshStandardMaterial({ color: COLORS.emerald })
      );
      stem.position.set(1.25, 0.48, 1.25);
      group.add(stem);

      const lbl = makeLabelSprite('AT the corner (map point)', { bg: '#0F766E', scale: 0.44 });
      lbl.position.set(1.25, 1.7, 1.25);
      group.add(lbl);

      return {
        group,
        cameraPos: [3.8, 3.4, 4.0],
        target: [0.5, 0.6, 0.5],
        update: (t) => {
          const p = (t * 0.7) % 1;
          ring.scale.setScalar(0.8 + p * 1.4);
          (ring.material as THREE.MeshBasicMaterial).opacity = (1 - p) * 0.8;
          pin.position.y = 0.95 + Math.sin(t * 2.5) * 0.08;
        },
      };
    }

    case 'm1-transport-car': {
      const group = new THREE.Group();
      // Road
      const road = makeSurfacePlate(5.6, 0.14, 2.8, 0x3b404c);
      road.position.y = -0.07;
      group.add(road);

      // Compact car body + glass cabin
      const chassis = makeSurfacePlate(2.8, 0.55, 1.45, COLORS.cobalt, COLORS.cobalt);
      chassis.position.set(0, 0.42, 0);
      group.add(chassis);

      const cabin = makeGlassBox(1.6, 0.78, 1.32, COLORS.cobalt, 0.25);
      cabin.position.set(-0.08, 1.08, 0);
      group.add(cabin);

      // Wheels
      const wheelGeo = new THREE.CylinderGeometry(0.28, 0.28, 0.22, 24);
      const wheelMat = new THREE.MeshStandardMaterial({ color: 0x1e2028, roughness: 0.8 });
      const wheelPositions: [number, number, number][] = [
        [-0.85, 0.28, 0.72],
        [0.85, 0.28, 0.72],
        [-0.85, 0.28, -0.72],
        [0.85, 0.28, -0.72],
      ];
      wheelPositions.forEach(([x, y, z]) => {
        const w = new THREE.Mesh(wheelGeo, wheelMat);
        w.rotation.x = Math.PI / 2;
        w.position.set(x, y, z);
        group.add(w);
      });

      // Passenger seated tightly INSIDE cabin
      const passenger = makeOrb(0.28, COLORS.amber, 0.4);
      passenger.position.set(-0.1, 0.98, 0);
      group.add(passenger);

      const lbl = makeLabelSprite('IN a car / taxi (enclosed cabin)', { bg: '#234DC7', scale: 0.44 });
      lbl.position.set(0, 2.15, 0);
      group.add(lbl);

      return {
        group,
        cameraPos: [3.2, 2.4, 4.2],
        target: [0, 0.9, 0],
        update: (t) => {
          const hum = Math.sin(t * 7) * 0.015;
          chassis.position.y = 0.42 + hum;
          cabin.position.y = 1.08 + hum;
          passenger.position.y = 0.98 + hum;
        },
      };
    }

    case 'm1-transport-bus': {
      const group = new THREE.Group();
      const road = makeSurfacePlate(6.6, 0.14, 3.0, 0x3b404c);
      road.position.y = -0.07;
      group.add(road);

      // Long walkable transit floor deck
      const deck = makeSurfacePlate(4.4, 0.24, 1.65, COLORS.coral, COLORS.coral);
      deck.position.set(0, 0.58, 0);
      group.add(deck);

      // Open frame rails showing tall walkable aisle
      const frame = makeGlassBox(4.4, 1.45, 1.65, COLORS.warmWhite, 0.1);
      frame.position.set(0, 1.42, 0);
      group.add(frame);

      // Wheels
      const wheelGeo = new THREE.CylinderGeometry(0.34, 0.34, 0.24, 24);
      const wheelMat = new THREE.MeshStandardMaterial({ color: 0x1e2028, roughness: 0.8 });
      [
        [-1.4, 0.34, 0.8],
        [1.4, 0.34, 0.8],
        [-1.4, 0.34, -0.8],
        [1.4, 0.34, -0.8],
      ].forEach(([x, y, z]) => {
        const w = new THREE.Mesh(wheelGeo, wheelMat);
        w.rotation.x = Math.PI / 2;
        w.position.set(x, y, z);
        group.add(w);
      });

      // Standing walker moving along the walkable deck!
      const walker = makeOrb(0.28, COLORS.coral, 0.42);
      walker.position.set(0, 1.05, 0);
      group.add(walker);

      const footRing = makePulseRing(0.25, 0.38, COLORS.warmWhite);
      footRing.position.set(0, 0.72, 0);
      group.add(footRing);

      const lbl = makeLabelSprite('ON a bus / train (walkable deck)', { bg: '#C24124', scale: 0.44 });
      lbl.position.set(0, 2.65, 0);
      group.add(lbl);

      return {
        group,
        cameraPos: [3.6, 2.6, 5.1],
        target: [0, 1.1, 0],
        update: (t) => {
          const x = Math.sin(t * 1.1) * 1.45;
          walker.position.x = x;
          walker.position.y = 1.05 + Math.abs(Math.sin(t * 4.4)) * 0.08;
          footRing.position.x = x;
        },
      };
    }

    case 'm1-hospital-in':
    case 'm1-hospital-at': {
      const group = new THREE.Group();
      const ground = makeSurfacePlate(5.6, 0.16, 4.2, COLORS.cream, COLORS.stone);
      ground.position.y = -0.08;
      group.add(ground);

      // Stylized hospital building
      const building = makeGlassBox(2.8, 2.0, 2.1, COLORS.cobalt, 0.16);
      building.position.set(-0.5, 1.0, -0.2);
      group.add(building);

      // Red cross emblem on front wall
      const crossMat = new THREE.MeshStandardMaterial({ color: COLORS.rose, emissive: COLORS.rose, emissiveIntensity: 0.25 });
      const c1 = new THREE.Mesh(new THREE.BoxGeometry(0.65, 0.2, 0.08), crossMat);
      c1.position.set(-0.5, 1.45, 0.88);
      const c2 = new THREE.Mesh(new THREE.BoxGeometry(0.2, 0.65, 0.08), crossMat);
      c2.position.set(-0.5, 1.45, 0.88);
      group.add(c1, c2);

      if (sceneId === 'm1-hospital-in') {
        const patient = makeOrb(0.36, COLORS.cobalt, 0.45);
        patient.position.set(-0.5, 0.72, -0.2);
        group.add(patient);

        const lbl = makeLabelSprite('IN the hospital (admitted inside)', { bg: '#234DC7', scale: 0.44 });
        lbl.position.set(-0.5, 2.5, -0.2);
        group.add(lbl);

        return {
          group,
          cameraPos: [3.4, 2.9, 4.8],
          target: [-0.3, 0.9, 0],
          update: (t) => {
            patient.position.y = 0.72 + Math.sin(t * 2) * 0.1;
          },
        };
      }

      // m1-hospital-at
      const visitor = makeOrb(0.3, COLORS.emerald, 0.45);
      visitor.position.set(1.65, 0.9, 0.9);
      group.add(visitor);

      const pin = new THREE.Mesh(
        new THREE.CylinderGeometry(0.03, 0.015, 0.8, 12),
        new THREE.MeshStandardMaterial({ color: COLORS.emerald })
      );
      pin.position.set(1.65, 0.42, 0.9);
      group.add(pin);

      const ring = makePulseRing(0.26, 0.38, COLORS.emerald);
      ring.position.set(1.65, 0.03, 0.9);
      group.add(ring);

      const lbl = makeLabelSprite('AT the hospital (visitor / address)', { bg: '#0F766E', scale: 0.44 });
      lbl.position.set(1.4, 1.8, 0.9);
      group.add(lbl);

      return {
        group,
        cameraPos: [3.8, 3.0, 4.9],
        target: [0.2, 0.9, 0.2],
        update: (t) => {
          const p = (t * 0.7) % 1;
          ring.scale.setScalar(0.8 + p * 1.4);
          (ring.material as THREE.MeshBasicMaterial).opacity = (1 - p) * 0.8;
          visitor.position.y = 0.9 + Math.sin(t * 2.4) * 0.08;
        },
      };
    }

    case 'm1-media-on': {
      const group = new THREE.Group();
      // Glowing floating screen / stage surface
      const frame = makeSurfacePlate(3.6, 2.2, 0.18, 0x1e2028, COLORS.coral);
      frame.position.set(0, 1.35, 0);
      group.add(frame);

      const screen = new THREE.Mesh(
        new THREE.PlaneGeometry(3.25, 1.85),
        new THREE.MeshStandardMaterial({
          color: COLORS.coral,
          emissive: COLORS.coral,
          emissiveIntensity: 0.32,
          roughness: 0.2,
        })
      );
      screen.position.set(0, 1.35, 0.1);
      group.add(screen);

      // Floating avatars projected ON the surface
      const dot1 = makeOrb(0.24, COLORS.warmWhite, 0.35);
      dot1.position.set(-0.75, 1.35, 0.28);
      const dot2 = makeOrb(0.24, COLORS.amber, 0.35);
      dot2.position.set(0.75, 1.35, 0.28);
      group.add(dot1, dot2);

      const lbl = makeLabelSprite('ON Zoom / ON the screen (2D stage)', { bg: '#C24124', scale: 0.44 });
      lbl.position.set(0, 2.85, 0);
      group.add(lbl);

      return {
        group,
        cameraPos: [2.4, 2.2, 4.7],
        target: [0, 1.35, 0],
        update: (t) => {
          dot1.position.y = 1.35 + Math.sin(t * 2.2) * 0.1;
          dot2.position.y = 1.35 + Math.cos(t * 2.2) * 0.1;
          frame.rotation.y = Math.sin(t * 0.5) * 0.12;
          screen.rotation.y = frame.rotation.y;
        },
      };
    }

    case 'm1-media-in': {
      const group = new THREE.Group();
      // Translucent envelope / document box
      const env = makeGlassBox(3.0, 1.9, 1.15, COLORS.cobalt, 0.2);
      env.position.set(0, 1.2, 0);
      group.add(env);

      // Inside content blocks (messages / files)
      const doc1 = makeSurfacePlate(1.9, 0.18, 0.45, COLORS.cobalt);
      doc1.position.set(0, 0.85, 0);
      const doc2 = makeSurfacePlate(1.5, 0.18, 0.45, COLORS.emerald);
      doc2.position.set(-0.15, 1.25, 0);
      const doc3 = makeSurfacePlate(1.7, 0.18, 0.45, COLORS.amber);
      doc3.position.set(0.1, 1.65, 0);
      group.add(doc1, doc2, doc3);

      const lbl = makeLabelSprite('IN an email / PDF (content container)', { bg: '#234DC7', scale: 0.44 });
      lbl.position.set(0, 2.6, 0);
      group.add(lbl);

      return {
        group,
        cameraPos: [2.8, 2.3, 4.6],
        target: [0, 1.2, 0],
        update: (t) => {
          doc1.position.y = 0.85 + Math.sin(t * 2) * 0.05;
          doc2.position.y = 1.25 + Math.sin(t * 2 + 1) * 0.05;
          doc3.position.y = 1.65 + Math.sin(t * 2 + 2) * 0.05;
          env.rotation.y = Math.sin(t * 0.55) * 0.14;
        },
      };
    }

    case 'm1-state-at': {
      const group = new THREE.Group();
      // Sharp balancing cone / threshold point
      const base = new THREE.Mesh(
        new THREE.ConeGeometry(1.1, 1.3, 4),
        new THREE.MeshStandardMaterial({ color: COLORS.ink, roughness: 0.45 })
      );
      base.position.y = 0.65;
      base.castShadow = true;
      group.add(base);

      const orb = makeOrb(0.36, COLORS.emerald, 0.45);
      orb.position.y = 1.66;
      group.add(orb);

      // Orbiting tension rings around the exact point
      const torus1 = new THREE.Mesh(
        new THREE.TorusGeometry(0.85, 0.03, 16, 64),
        new THREE.MeshBasicMaterial({ color: COLORS.emerald, transparent: true, opacity: 0.7 })
      );
      torus1.position.y = 1.66;
      const torus2 = new THREE.Mesh(
        new THREE.TorusGeometry(1.15, 0.025, 16, 64),
        new THREE.MeshBasicMaterial({ color: COLORS.rose, transparent: true, opacity: 0.55 })
      );
      torus2.position.y = 1.66;
      group.add(torus1, torus2);

      const lbl = makeLabelSprite('AT risk / AT stake (threshold point)', { bg: '#0F766E', scale: 0.44 });
      lbl.position.set(0, 2.85, 0);
      group.add(lbl);

      return {
        group,
        cameraPos: [3.2, 2.7, 4.2],
        target: [0, 1.3, 0],
        update: (t) => {
          torus1.rotation.x = t * 1.1;
          torus1.rotation.y = t * 0.7;
          torus2.rotation.x = -t * 0.8;
          torus2.rotation.z = t * 0.6;
          orb.scale.setScalar(1 + Math.sin(t * 3.5) * 0.07);
        },
      };
    }

    default:
      return null;
  }
}
