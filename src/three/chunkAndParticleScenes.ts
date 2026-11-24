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

export function buildChunkAndParticleScene(sceneId: string): BuiltScene | null {
  switch (sceneId) {
    // ── MODULE 5: Chunks & Ghost Prepositions ────────────────────────────
    case 'm5-verb-bonds': {
      const group = new THREE.Group();
      const pairs: { y: number; verb: string; prep: string; color: number; hex: string }[] = [
        { y: 1.95, verb: 'RELY / DEPEND', prep: 'ON', color: COLORS.coral, hex: '#C24124' },
        { y: 1.1, verb: 'PREVENT / RECOVER', prep: 'FROM', color: COLORS.violet, hex: '#6D28D9' },
        { y: 0.25, verb: 'ADAPT / OBJECT', prep: 'TO', color: COLORS.emerald, hex: '#0F766E' },
      ];

      const orbs: THREE.Mesh[] = [];
      pairs.forEach(({ y, verb, prep, color, hex }) => {
        const left = makeOrb(0.28, COLORS.ink, 0.15);
        left.position.set(-1.7, y, 0);
        const right = makeOrb(0.28, color, 0.45);
        right.position.set(1.7, y, 0);
        group.add(left, right);
        orbs.push(right);

        const bond = new THREE.Mesh(
          new THREE.CylinderGeometry(0.06, 0.06, 3.1, 16),
          new THREE.MeshStandardMaterial({ color, emissive: color, emissiveIntensity: 0.3 })
        );
        bond.rotation.z = Math.PI / 2;
        bond.position.set(0, y, 0);
        group.add(bond);

        const lLbl = makeLabelSprite(verb, { bg: '#18181B', scale: 0.34 });
        lLbl.position.set(-1.7, y + 0.44, 0);
        const rLbl = makeLabelSprite(prep, { bg: hex, scale: 0.36 });
        rLbl.position.set(1.7, y + 0.44, 0);
        group.add(lLbl, rLbl);
      });

      return {
        group,
        cameraPos: [0.4, 2.2, 5.9],
        target: [0, 1.15, 0],
        update: (t) => {
          orbs.forEach((o, i) => {
            o.scale.setScalar(1 + Math.sin(t * 2.8 + i) * 0.1);
          });
        },
      };
    }

    case 'm5-adj-bonds': {
      const group = new THREE.Group();
      const center = makeOrb(0.45, COLORS.cobalt, 0.35);
      center.position.set(0, 1.25, 0);
      group.add(center);

      const centerLbl = makeLabelSprite('ADJECTIVE ORBITS', { bg: '#234DC7', scale: 0.36 });
      centerLbl.position.set(0, 2.0, 0);
      group.add(centerLbl);

      const satellites: { mesh: THREE.Mesh; lbl: THREE.Sprite; angle: number; r: number }[] = [];
      const specs = [
        { text: 'capable OF', color: COLORS.amber, hex: '#B45309' },
        { text: 'good AT', color: COLORS.emerald, hex: '#0F766E' },
        { text: 'responsible FOR', color: COLORS.coral, hex: '#C24124' },
        { text: 'married TO', color: COLORS.violet, hex: '#6D28D9' },
      ];

      specs.forEach((sp, i) => {
        const angle = (i / specs.length) * Math.PI * 2;
        const r = 1.95;
        const m = makeOrb(0.26, sp.color, 0.4);
        const lbl = makeLabelSprite(sp.text, { bg: sp.hex, scale: 0.35 });
        group.add(m, lbl);
        satellites.push({ mesh: m, lbl, angle, r });
      });

      const orbitRing = new THREE.Mesh(
        new THREE.TorusGeometry(1.95, 0.025, 16, 64),
        new THREE.MeshBasicMaterial({ color: COLORS.cobalt, transparent: true, opacity: 0.35 })
      );
      orbitRing.rotation.x = Math.PI / 2;
      orbitRing.position.set(0, 1.25, 0);
      group.add(orbitRing);

      return {
        group,
        cameraPos: [0.6, 3.3, 5.6],
        target: [0, 1.2, 0],
        update: (t) => {
          satellites.forEach((s) => {
            const a = s.angle + t * 0.45;
            const x = Math.cos(a) * s.r;
            const z = Math.sin(a) * s.r;
            s.mesh.position.set(x, 1.25, z);
            s.lbl.position.set(x, 1.78, z);
          });
        },
      };
    }

    case 'm5-ghost-reject': {
      const group = new THREE.Group();
      // Solid direct lock between DISCUSS and THE PLAN
      const verbBlock = makeSurfacePlate(1.5, 0.9, 0.9, COLORS.ink, COLORS.emerald);
      verbBlock.position.set(-1.35, 1.0, 0);
      const objBlock = makeSurfacePlate(1.5, 0.9, 0.9, COLORS.ink, COLORS.emerald);
      objBlock.position.set(1.35, 1.0, 0);
      group.add(verbBlock, objBlock);

      const lockBar = new THREE.Mesh(
        new THREE.CylinderGeometry(0.14, 0.14, 1.3, 20),
        new THREE.MeshStandardMaterial({ color: COLORS.emerald, emissive: COLORS.emerald, emissiveIntensity: 0.35 })
      );
      lockBar.rotation.z = Math.PI / 2;
      lockBar.position.set(0, 1.0, 0);
      group.add(lockBar);

      const vLbl = makeLabelSprite('DISCUSS', { bg: '#18181B', scale: 0.38 });
      vLbl.position.set(-1.35, 1.85, 0);
      const oLbl = makeLabelSprite('THE PLAN', { bg: '#18181B', scale: 0.38 });
      oLbl.position.set(1.35, 1.85, 0);
      group.add(vLbl, oLbl);

      // Intrusive red "ABOUT" orb trying to wedge in from above and getting repelled!
      const intruder = makeOrb(0.32, COLORS.rose, 0.5);
      group.add(intruder);

      const badLbl = makeLabelSprite('✕ ABOUT', { bg: '#BE123C', scale: 0.36 });
      group.add(badLbl);

      const shield = makePulseRing(0.45, 0.58, COLORS.rose);
      shield.position.set(0, 1.48, 0);
      group.add(shield);

      return {
        group,
        cameraPos: [0.3, 2.7, 5.7],
        target: [0, 1.25, 0],
        update: (t) => {
          const c = (t * 0.9) % 1;
          const dip = c < 0.4 ? c / 0.4 : Math.max(0, 1 - (c - 0.4) / 0.6);
          const y = 2.75 - dip * 0.95;
          intruder.position.set(0, y, 0);
          badLbl.position.set(0, y + 0.52, 0);
          shield.scale.setScalar(dip > 0.85 ? 1.35 : 0.85);
        },
      };
    }

    case 'm5-missing-circuit': {
      const group = new THREE.Group();
      const leftBlock = makeSurfacePlate(1.5, 0.85, 0.85, COLORS.ink, COLORS.cobalt);
      leftBlock.position.set(-1.95, 1.0, 0);
      const rightBlock = makeSurfacePlate(1.3, 0.85, 0.85, COLORS.ink, COLORS.cobalt);
      rightBlock.position.set(1.95, 1.0, 0);
      group.add(leftBlock, rightBlock);

      const lLbl = makeLabelSprite('EXPLAIN [IT]', { bg: '#18181B', scale: 0.36 });
      lLbl.position.set(-1.95, 1.85, 0);
      const rLbl = makeLabelSprite('ME', { bg: '#18181B', scale: 0.36 });
      rLbl.position.set(1.95, 1.85, 0);
      group.add(lLbl, rLbl);

      // Emerald bridge piece ("TO") dropping cleanly into the gap and lighting up the circuit!
      const bridge = makeSurfacePlate(1.4, 0.5, 0.65, COLORS.emerald, COLORS.emerald);
      group.add(bridge);

      const bLbl = makeLabelSprite('TO (Required Bridge)', { bg: '#0F766E', scale: 0.38 });
      group.add(bLbl);

      const spark = makePulseRing(0.35, 0.5, COLORS.emerald);
      spark.position.set(0, 0.45, 0);
      group.add(spark);

      return {
        group,
        cameraPos: [0.3, 2.7, 5.9],
        target: [0, 1.15, 0],
        update: (t) => {
          const phase = Math.sin(t * 1.4);
          const locked = phase > -0.15;
          const y = locked ? 1.0 : 1.0 + (-0.15 - phase) * 1.1;
          bridge.position.set(0, y, 0);
          bLbl.position.set(0, y + 0.68, 0);
          spark.scale.setScalar(locked ? 1.25 : 0.65);
        },
      };
    }

    // ── MODULE 6: Particle Logic ─────────────────────────────────────────
    case 'm6-up-complete': {
      const group = new THREE.Group();
      // Glass cylinder filling all the way to 100% brim
      const outer = new THREE.Mesh(
        new THREE.CylinderGeometry(0.95, 0.95, 2.3, 36, 1, true),
        new THREE.MeshPhysicalMaterial({
          color: COLORS.violet,
          transparent: true,
          opacity: 0.22,
          roughness: 0.1,
          side: THREE.DoubleSide,
          depthWrite: false,
        })
      );
      outer.position.y = 1.25;
      group.add(outer);

      const rim = new THREE.Mesh(
        new THREE.TorusGeometry(0.96, 0.04, 16, 48),
        new THREE.MeshStandardMaterial({ color: COLORS.violet, emissive: COLORS.violet, emissiveIntensity: 0.4 })
      );
      rim.rotation.x = Math.PI / 2;
      rim.position.y = 2.4;
      group.add(rim);

      const fillGeo = new THREE.CylinderGeometry(0.86, 0.86, 2.2, 32);
      fillGeo.translate(0, 1.1, 0);
      const fill = new THREE.Mesh(
        fillGeo,
        new THREE.MeshStandardMaterial({
          color: COLORS.violet,
          emissive: COLORS.violet,
          emissiveIntensity: 0.32,
          transparent: true,
          opacity: 0.82,
        })
      );
      fill.position.y = 0.12;
      group.add(fill);

      // Rising completion sparks
      const sparks = [0, 1, 2, 3, 4].map((i) => {
        const s = makeOrb(0.09, COLORS.amber, 0.65);
        s.position.set(Math.cos(i * 1.3) * 0.5, 0.5, Math.sin(i * 1.3) * 0.5);
        group.add(s);
        return s;
      });

      const lbl = makeLabelSprite('UP · Fill to 100% Completion', { bg: '#6D28D9', scale: 0.44 });
      lbl.position.set(0, 3.0, 0);
      group.add(lbl);

      return {
        group,
        cameraPos: [2.8, 2.8, 4.9],
        target: [0, 1.3, 0],
        update: (t) => {
          const cycle = (t * 0.35) % 1;
          const level = Math.min(1, cycle * 1.25);
          fill.scale.y = Math.max(0.05, level);
          sparks.forEach((s, i) => {
            const su = (t * 0.6 + i * 0.2) % 1;
            s.position.y = 0.25 + su * 2.5;
          });
        },
      };
    }

    case 'm6-down-reduce': {
      const group = new THREE.Group();
      const base = makeSurfacePlate(3.2, 0.16, 2.4, COLORS.cream, COLORS.cobalt);
      base.position.y = 0.08;
      group.add(base);

      // Compressing stack of energy bars descending smoothly
      const bars = [-0.9, 0, 0.9].map((x) => {
        const geo = new THREE.BoxGeometry(0.62, 2.0, 0.62);
        geo.translate(0, 1.0, 0);
        const m = new THREE.Mesh(
          geo,
          new THREE.MeshStandardMaterial({
            color: COLORS.cobalt,
            emissive: COLORS.cobalt,
            emissiveIntensity: 0.22,
            roughness: 0.3,
          })
        );
        m.position.set(x, 0.16, 0);
        m.castShadow = true;
        group.add(m);
        return m;
      });

      const lbl = makeLabelSprite('DOWN · Reduce · Calm · Record', { bg: '#234DC7', scale: 0.44 });
      lbl.position.set(0, 2.75, 0);
      group.add(lbl);

      return {
        group,
        cameraPos: [2.6, 2.7, 4.9],
        target: [0, 1.1, 0],
        update: (t) => {
          const u = (t * 0.38) % 1;
          const h = 1 - u * 0.72;
          bars.forEach((b, i) => {
            b.scale.y = Math.max(0.18, h - i * 0.08);
          });
        },
      };
    }

    case 'm6-out-exhaust': {
      const group = new THREE.Group();
      const core = makeGlassBox(1.3, 1.3, 1.3, COLORS.amber, 0.2);
      core.position.y = 1.2;
      group.add(core);

      // Radiant particles bursting outward in 6 directions
      const dirs = [
        new THREE.Vector3(1, 0.2, 0),
        new THREE.Vector3(-1, 0.2, 0),
        new THREE.Vector3(0, 0.3, 1),
        new THREE.Vector3(0, 0.3, -1),
        new THREE.Vector3(0.75, 0.5, 0.75),
        new THREE.Vector3(-0.75, 0.5, -0.75),
      ];
      const rays = dirs.map(() => {
        const o = makeOrb(0.2, COLORS.amber, 0.5);
        group.add(o);
        return o;
      });

      const lbl = makeLabelSprite('OUT · Reveal / Distribute / Exhaust', { bg: '#B45309', scale: 0.44 });
      lbl.position.set(0, 2.75, 0);
      group.add(lbl);

      return {
        group,
        cameraPos: [2.8, 3.0, 5.1],
        target: [0, 1.2, 0],
        update: (t) => {
          const u = (t * 0.48) % 1;
          rays.forEach((o, i) => {
            const d = dirs[i];
            o.position.set(d.x * u * 2.2, 1.2 + d.y * u * 1.4, d.z * u * 2.2);
            o.scale.setScalar(1.15 - u * 0.55);
          });
          core.rotation.y = t * 0.45;
        },
      };
    }

    case 'm6-in-absorb': {
      const group = new THREE.Group();
      const core = makeGlassBox(1.5, 1.5, 1.5, COLORS.cobalt, 0.22);
      core.position.y = 1.2;
      group.add(core);

      const centerOrb = makeOrb(0.35, COLORS.cobalt, 0.45);
      centerOrb.position.y = 1.2;
      group.add(centerOrb);

      const dirs = [
        new THREE.Vector3(2.2, 0.4, 0),
        new THREE.Vector3(-2.2, 0.4, 0),
        new THREE.Vector3(0, 0.4, 2.2),
        new THREE.Vector3(0, 0.4, -2.2),
        new THREE.Vector3(1.5, 1.2, 1.5),
        new THREE.Vector3(-1.5, 1.2, -1.5),
      ];
      const drops = dirs.map(() => {
        const o = makeOrb(0.18, COLORS.emerald, 0.5);
        group.add(o);
        return o;
      });

      const lbl = makeLabelSprite('IN · Submit / Absorb / Fit In', { bg: '#234DC7', scale: 0.44 });
      lbl.position.set(0, 2.75, 0);
      group.add(lbl);

      return {
        group,
        cameraPos: [2.8, 3.0, 5.1],
        target: [0, 1.2, 0],
        update: (t) => {
          const u = 1 - ((t * 0.48) % 1);
          drops.forEach((o, i) => {
            const d = dirs[i];
            o.position.set(d.x * u, 1.2 + d.y * u, d.z * u);
          });
          centerOrb.scale.setScalar(0.95 + (1 - u) * 0.35);
        },
      };
    }

    case 'm6-off-detach': {
      const group = new THREE.Group();
      const base = makeSurfacePlate(2.0, 0.75, 2.0, COLORS.ink, COLORS.rose);
      base.position.set(-0.4, 0.38, 0);
      group.add(base);

      // Glowing cap cleanly detaching and drifting away
      const cap = makeSurfacePlate(1.7, 0.38, 1.7, COLORS.rose, COLORS.rose);
      group.add(cap);

      const lbl = makeLabelSprite('OFF · Detach · Cancel · Depart', { bg: '#BE123C', scale: 0.44 });
      lbl.position.set(0.2, 2.75, 0);
      group.add(lbl);

      return {
        group,
        cameraPos: [2.8, 2.7, 5.0],
        target: [0, 1.1, 0],
        update: (t) => {
          const u = (t * 0.42) % 1;
          const lift = Math.sin(u * Math.PI);
          cap.position.set(-0.4 + lift * 1.45, 0.96 + lift * 1.15, 0);
          cap.rotation.z = -lift * 0.28;
        },
      };
    }

    case 'm6-on-continue': {
      const group = new THREE.Group();
      const track = makeSurfacePlate(5.6, 0.22, 1.1, COLORS.cream, COLORS.emerald);
      track.position.y = 0.25;
      group.add(track);

      const nodes = [0, 1, 2, 3].map(() => {
        const o = makeOrb(0.26, COLORS.emerald, 0.45);
        group.add(o);
        return o;
      });

      const lbl = makeLabelSprite('ON · Steady Forward Momentum', { bg: '#0F766E', scale: 0.44 });
      lbl.position.set(0, 2.0, 0);
      group.add(lbl);

      return {
        group,
        cameraPos: [1.5, 2.7, 5.4],
        target: [0, 0.7, 0],
        update: (t) => {
          nodes.forEach((o, i) => {
            const u = (t * 0.35 + i * 0.25) % 1;
            o.position.set(-2.5 + u * 5.0, 0.65, 0);
          });
        },
      };
    }

    case 'm6-over-through': {
      const group = new THREE.Group();
      // Dense wall in center
      const wall = makeGlassBox(0.85, 1.85, 2.8, COLORS.violet, 0.28);
      wall.position.set(0, 0.95, 0);
      group.add(wall);

      // Track 1 (front): OVER arc
      const overPath = makeCurveTube(
        [
          new THREE.Vector3(-2.4, 0.6, 0.7),
          new THREE.Vector3(0, 2.45, 0.7),
          new THREE.Vector3(2.4, 0.6, 0.7),
        ],
        COLORS.coral,
        0.04,
        0.65
      );
      group.add(overPath.mesh);
      const overOrb = makeOrb(0.24, COLORS.coral, 0.5);
      group.add(overOrb);

      // Track 2 (back): THROUGH piercing straight through wall
      const throughPath = makeCurveTube(
        [
          new THREE.Vector3(-2.4, 0.95, -0.7),
          new THREE.Vector3(0, 0.95, -0.7),
          new THREE.Vector3(2.4, 0.95, -0.7),
        ],
        COLORS.cobalt,
        0.04,
        0.65
      );
      group.add(throughPath.mesh);
      const throughOrb = makeOrb(0.24, COLORS.cobalt, 0.5);
      group.add(throughOrb);

      const lbl1 = makeLabelSprite('OVER (review / recover)', { bg: '#C24124', scale: 0.36 });
      lbl1.position.set(0, 2.9, 0.7);
      const lbl2 = makeLabelSprite('THROUGH (endure / finish)', { bg: '#234DC7', scale: 0.36 });
      lbl2.position.set(0, 0.35, -0.7);
      group.add(lbl1, lbl2);

      return {
        group,
        cameraPos: [2.2, 3.0, 5.6],
        target: [0, 1.15, 0],
        update: (t) => {
          const u = (t * 0.4) % 1;
          overOrb.position.copy(overPath.curve.getPointAt(u));
          throughOrb.position.copy(throughPath.curve.getPointAt(u));
        },
      };
    }

    default:
      return null;
  }
}
