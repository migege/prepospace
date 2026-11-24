import * as THREE from 'three';
import {
  BuiltScene,
  COLORS,
  makeArrowCone,
  makeCurveTube,
  makeGlassBox,
  makeLabelSprite,
  makeOrb,
  makePulseRing,
  makeSurfacePlate,
} from './helpers';

export function buildNuanceScene(sceneId: string): BuiltScene | null {
  switch (sceneId) {
    case 'm4-to-transfer': {
      const group = new THREE.Group();
      const nodeA = makeOrb(0.42, COLORS.ink, 0.15);
      nodeA.position.set(-2.0, 1.0, 0);
      const nodeB = makeOrb(0.45, COLORS.emerald, 0.35);
      nodeB.position.set(2.0, 1.0, 0);
      group.add(nodeA, nodeB);

      const lblA = makeLabelSprite('A (Sender)', { bg: '#18181B', scale: 0.36 });
      lblA.position.set(-2.0, 1.85, 0);
      const lblB = makeLabelSprite('B (Recipient)', { bg: '#0F766E', scale: 0.36 });
      lblB.position.set(2.0, 1.85, 0);
      group.add(lblA, lblB);

      const { curve, mesh } = makeCurveTube(
        [
          new THREE.Vector3(-1.45, 1.0, 0),
          new THREE.Vector3(0, 1.45, 0),
          new THREE.Vector3(1.45, 1.0, 0),
        ],
        COLORS.emerald,
        0.045,
        0.65
      );
      group.add(mesh);

      const packet = makeOrb(0.22, COLORS.emerald, 0.6);
      group.add(packet);

      const cone = makeArrowCone(COLORS.emerald, 0.9);
      cone.rotation.z = -Math.PI / 2;
      cone.position.set(1.48, 1.0, 0);
      group.add(cone);

      const topLbl = makeLabelSprite('TO · Direct Transfer into B', { bg: '#0F766E', scale: 0.44 });
      topLbl.position.set(0, 2.55, 0);
      group.add(topLbl);

      return {
        group,
        cameraPos: [0, 2.7, 5.8],
        target: [0, 1.0, 0],
        update: (t) => {
          const u = (t * 0.55) % 1;
          packet.position.copy(curve.getPointAt(u));
          nodeB.scale.setScalar(1 + (u > 0.85 ? 0.14 : 0));
        },
      };
    }

    case 'm4-for-benefit': {
      const group = new THREE.Group();
      const nodeA = makeOrb(0.38, COLORS.ink, 0.15);
      nodeA.position.set(-1.95, 1.0, 0);
      const nodeB = makeOrb(0.46, COLORS.amber, 0.35);
      nodeB.position.set(1.35, 1.0, 0);
      group.add(nodeA, nodeB);

      // Protective glowing benefit halo orbiting B
      const halo1 = new THREE.Mesh(
        new THREE.TorusGeometry(0.95, 0.04, 16, 64),
        new THREE.MeshStandardMaterial({ color: COLORS.amber, emissive: COLORS.amber, emissiveIntensity: 0.4 })
      );
      halo1.position.set(1.35, 1.0, 0);
      const halo2 = new THREE.Mesh(
        new THREE.TorusGeometry(1.2, 0.03, 16, 64),
        new THREE.MeshBasicMaterial({ color: COLORS.emerald, transparent: true, opacity: 0.6 })
      );
      halo2.position.set(1.35, 1.0, 0);
      group.add(halo1, halo2);

      const giftOrb = makeOrb(0.18, COLORS.emerald, 0.55);
      group.add(giftOrb);

      const lblA = makeLabelSprite('Actor A', { bg: '#18181B', scale: 0.35 });
      lblA.position.set(-1.95, 1.8, 0);
      const lblB = makeLabelSprite('Beneficiary B', { bg: '#B45309', scale: 0.36 });
      lblB.position.set(1.35, 2.35, 0);
      const topLbl = makeLabelSprite('FOR · Benefit / Behalf / Purpose', { bg: '#B45309', scale: 0.44 });
      topLbl.position.set(-0.2, 2.95, 0);
      group.add(lblA, lblB, topLbl);

      return {
        group,
        cameraPos: [0.3, 2.8, 5.8],
        target: [0, 1.1, 0],
        update: (t) => {
          halo1.rotation.x = t * 0.9;
          halo1.rotation.y = t * 0.6;
          halo2.rotation.y = -t * 0.8;
          halo2.rotation.z = Math.PI / 4;
          giftOrb.position.set(1.35 + Math.cos(t * 2.2) * 0.95, 1.0 + Math.sin(t * 2.2) * 0.35, Math.sin(t * 2.2) * 0.95);
        },
      };
    }

    case 'm4-of-material': {
      const group = new THREE.Group();
      // Raw oak cubes visibly forming an assembled table (same material!)
      const woodColor = 0xc58b4e;
      const raw1 = makeSurfacePlate(0.45, 0.45, 0.45, woodColor, 0x8b5a2b);
      raw1.position.set(-2.1, 0.35, 0.2);
      const raw2 = makeSurfacePlate(0.45, 0.45, 0.45, woodColor, 0x8b5a2b);
      raw2.position.set(-1.6, 0.35, -0.35);
      const raw3 = makeSurfacePlate(0.45, 0.45, 0.45, woodColor, 0x8b5a2b);
      raw3.position.set(-1.85, 0.85, -0.05);
      group.add(raw1, raw2, raw3);

      // Assembled oak table on the right (exact same wood color)
      const tabletop = makeSurfacePlate(2.1, 0.2, 1.35, woodColor, 0x8b5a2b);
      tabletop.position.set(1.25, 1.25, 0);
      group.add(tabletop);
      [
        [0.4, 0.6, -0.5],
        [2.1, 0.6, -0.5],
        [0.4, 0.6, 0.5],
        [2.1, 0.6, 0.5],
      ].forEach(([x, y, z]) => {
        const leg = makeSurfacePlate(0.16, 1.15, 0.16, woodColor, 0x8b5a2b);
        leg.position.set(x, y, z);
        group.add(leg);
      });

      const arrow = makeArrowCone(COLORS.amber, 0.9);
      arrow.rotation.z = -Math.PI / 2;
      arrow.position.set(-0.4, 0.9, 0);
      group.add(arrow);

      const lbl = makeLabelSprite('Made OF · Same Visible Material', { bg: '#B45309', scale: 0.44 });
      lbl.position.set(0, 2.35, 0);
      group.add(lbl);

      return {
        group,
        cameraPos: [0.6, 2.8, 5.7],
        target: [0, 0.9, 0],
        update: (t) => {
          raw3.rotation.y = t * 0.7;
          arrow.position.x = -0.4 + Math.sin(t * 2.5) * 0.12;
        },
      };
    }

    case 'm4-from-transform': {
      const group = new THREE.Group();
      // Left: purple grape cluster spheres
      const grapeGroup = new THREE.Group();
      [
        [-2.1, 0.8, 0],
        [-1.85, 1.05, 0.2],
        [-1.85, 0.55, -0.15],
        [-2.25, 1.05, -0.2],
        [-1.6, 0.82, 0],
      ].forEach(([x, y, z]) => {
        const g = makeOrb(0.24, COLORS.violet, 0.25);
        g.position.set(x, y, z);
        grapeGroup.add(g);
      });
      group.add(grapeGroup);

      // Center: glowing transformation prism
      const prism = new THREE.Mesh(
        new THREE.OctahedronGeometry(0.85, 0),
        new THREE.MeshPhysicalMaterial({
          color: COLORS.violet,
          transparent: true,
          opacity: 0.35,
          roughness: 0.1,
          metalness: 0.15,
        })
      );
      prism.position.set(0, 1.05, 0);
      group.add(prism);

      // Right: transformed glowing golden crystal / chalice
      const crystal = new THREE.Mesh(
        new THREE.CylinderGeometry(0.45, 0.25, 1.15, 24),
        new THREE.MeshStandardMaterial({
          color: COLORS.gold,
          emissive: COLORS.gold,
          emissiveIntensity: 0.35,
          roughness: 0.2,
          metalness: 0.35,
        })
      );
      crystal.position.set(2.0, 0.95, 0);
      crystal.castShadow = true;
      group.add(crystal);

      const lbl = makeLabelSprite('Made FROM · Transformed Substance', { bg: '#6D28D9', scale: 0.44 });
      lbl.position.set(0, 2.45, 0);
      group.add(lbl);

      return {
        group,
        cameraPos: [0.4, 2.7, 5.8],
        target: [0, 1.0, 0],
        update: (t) => {
          prism.rotation.y = t * 1.1;
          prism.rotation.x = Math.sin(t * 0.8) * 0.25;
          crystal.rotation.y = -t * 0.6;
        },
      };
    }

    case 'm4-with-tool': {
      const group = new THREE.Group();
      const actor = makeOrb(0.44, COLORS.ink, 0.15);
      actor.position.set(-1.6, 1.05, 0);
      group.add(actor);

      // Physical glowing tool / wrench bar linked directly to actor
      const tool = new THREE.Mesh(
        new THREE.BoxGeometry(1.7, 0.2, 0.2),
        new THREE.MeshStandardMaterial({
          color: COLORS.cobalt,
          emissive: COLORS.cobalt,
          emissiveIntensity: 0.3,
          roughness: 0.25,
          metalness: 0.4,
        })
      );
      tool.position.set(-0.25, 1.05, 0);
      group.add(tool);

      const targetBox = makeSurfacePlate(1.2, 1.2, 1.2, COLORS.cream, COLORS.cobalt);
      targetBox.position.set(1.6, 0.85, 0);
      group.add(targetBox);

      const lbl = makeLabelSprite('WITH · Physical Instrument in Hand', { bg: '#234DC7', scale: 0.44 });
      lbl.position.set(0, 2.35, 0);
      group.add(lbl);

      return {
        group,
        cameraPos: [0.6, 2.7, 5.5],
        target: [0, 0.95, 0],
        update: (t) => {
          tool.rotation.z = Math.sin(t * 3) * 0.18;
          tool.position.x = -0.25 + Math.sin(t * 3) * 0.12;
        },
      };
    }

    case 'm4-by-agent': {
      const group = new THREE.Group();
      const target = makeSurfacePlate(1.3, 1.3, 1.3, COLORS.cream, COLORS.emerald);
      target.position.set(1.2, 0.95, 0);
      group.add(target);

      const agent = makeOrb(0.45, COLORS.emerald, 0.4);
      agent.position.set(-1.9, 1.05, 0);
      group.add(agent);

      // Expanding agent wave rings traveling from agent to target
      const waves = [0, 1, 2].map(() => {
        const w = new THREE.Mesh(
          new THREE.TorusGeometry(0.45, 0.035, 16, 48),
          new THREE.MeshBasicMaterial({ color: COLORS.emerald, transparent: true, opacity: 0.7 })
        );
        w.rotation.y = Math.PI / 2;
        group.add(w);
        return w;
      });

      const lbl = makeLabelSprite('BY · External Agent or Method', { bg: '#0F766E', scale: 0.44 });
      lbl.position.set(0, 2.45, 0);
      group.add(lbl);

      return {
        group,
        cameraPos: [0.6, 2.7, 5.5],
        target: [0, 1.0, 0],
        update: (t) => {
          waves.forEach((w, idx) => {
            const u = (t * 0.55 + idx / 3) % 1;
            w.position.set(-1.35 + u * 2.15, 1.0, 0);
            w.scale.setScalar(0.6 + u * 0.8);
            (w.material as THREE.MeshBasicMaterial).opacity = (1 - u) * 0.8;
          });
        },
      };
    }

    case 'm4-between': {
      const group = new THREE.Group();
      // THREE distinct architectural pillars arranged in a clean triangle!
      const positions: [number, number, string][] = [
        [-1.8, -0.7, 'ZURICH'],
        [1.8, -0.7, 'MUNICH'],
        [0, 1.55, 'MILAN'],
      ];
      positions.forEach(([x, z, name]) => {
        const pillar = makeSurfacePlate(0.75, 2.0, 0.75, COLORS.warmWhite, COLORS.emerald);
        pillar.position.set(x, 1.0, z);
        group.add(pillar);

        const lbl = makeLabelSprite(name, { bg: '#18181B', scale: 0.34 });
        lbl.position.set(x, 2.35, z);
        group.add(lbl);

        // Connector beam to center
        const { mesh } = makeCurveTube(
          [new THREE.Vector3(x, 1.05, z), new THREE.Vector3(0, 1.05, 0.05)],
          COLORS.emerald,
          0.03,
          0.6
        );
        group.add(mesh);
      });

      const centerOrb = makeOrb(0.38, COLORS.emerald, 0.45);
      centerOrb.position.set(0, 1.05, 0.05);
      group.add(centerOrb);

      const topLbl = makeLabelSprite('BETWEEN · 3 Distinct Named Nodes', { bg: '#0F766E', scale: 0.44 });
      topLbl.position.set(0, 2.95, 0);
      group.add(topLbl);

      return {
        group,
        cameraPos: [0.5, 3.6, 5.8],
        target: [0, 1.0, 0.1],
        update: (t) => {
          centerOrb.position.y = 1.05 + Math.sin(t * 2.2) * 0.12;
        },
      };
    }

    case 'm4-among': {
      const group = new THREE.Group();
      // Dense crowd of 18 surrounding neutral spheres
      const crowd: THREE.Mesh[] = [];
      for (let i = 0; i < 18; i++) {
        const angle = (i / 18) * Math.PI * 2;
        const radius = i % 2 === 0 ? 1.35 : 2.05;
        const y = 0.45 + (i % 3) * 0.42;
        const s = makeOrb(0.28, COLORS.stone, 0.05);
        s.position.set(Math.cos(angle) * radius, y, Math.sin(angle) * radius);
        group.add(s);
        crowd.push(s);
      }

      const hero = makeOrb(0.4, COLORS.cobalt, 0.5);
      hero.position.set(0, 0.95, 0);
      group.add(hero);

      const lbl = makeLabelSprite('AMONG · Inside a Collective Crowd', { bg: '#234DC7', scale: 0.44 });
      lbl.position.set(0, 2.55, 0);
      group.add(lbl);

      return {
        group,
        cameraPos: [0.6, 3.5, 5.6],
        target: [0, 0.95, 0],
        update: (t) => {
          crowd.forEach((s, i) => {
            s.position.y = 0.45 + (i % 3) * 0.42 + Math.sin(t * 1.6 + i) * 0.08;
          });
          hero.position.y = 0.95 + Math.sin(t * 2.5) * 0.12;
        },
      };
    }

    case 'm4-about-orbit': {
      const group = new THREE.Group();
      const topic = makeOrb(0.62, COLORS.ink, 0.15);
      topic.position.set(0, 1.25, 0);
      group.add(topic);

      // Loose wide orbiting rings & satellites around the topic
      const ring1 = new THREE.Mesh(
        new THREE.TorusGeometry(1.55, 0.03, 16, 64),
        new THREE.MeshBasicMaterial({ color: COLORS.amber, transparent: true, opacity: 0.7 })
      );
      ring1.position.set(0, 1.25, 0);
      ring1.rotation.x = Math.PI / 2.6;

      const ring2 = new THREE.Mesh(
        new THREE.TorusGeometry(1.85, 0.025, 16, 64),
        new THREE.MeshBasicMaterial({ color: COLORS.amber, transparent: true, opacity: 0.45 })
      );
      ring2.position.set(0, 1.25, 0);
      ring2.rotation.x = -Math.PI / 3;
      group.add(ring1, ring2);

      const sat = makeOrb(0.22, COLORS.amber, 0.45);
      group.add(sat);

      const lbl = makeLabelSprite('ABOUT · Broad Orbit Around Topic', { bg: '#B45309', scale: 0.44 });
      lbl.position.set(0, 2.95, 0);
      group.add(lbl);

      return {
        group,
        cameraPos: [2.2, 2.8, 5.2],
        target: [0, 1.25, 0],
        update: (t) => {
          ring1.rotation.z = t * 0.5;
          ring2.rotation.y = -t * 0.4;
          sat.position.set(Math.cos(t * 1.6) * 1.55, 1.25 + Math.sin(t * 1.6) * 0.55, Math.sin(t * 1.6) * 1.35);
        },
      };
    }

    case 'm4-on-focus': {
      const group = new THREE.Group();
      const topic = makeOrb(0.62, COLORS.ink, 0.15);
      topic.position.set(0, 0.9, 0);
      group.add(topic);

      // Focused beam locked directly ONTO the topic surface
      const beam = new THREE.Mesh(
        new THREE.ConeGeometry(0.75, 1.8, 32, 1, true),
        new THREE.MeshBasicMaterial({
          color: COLORS.coral,
          transparent: true,
          opacity: 0.32,
          side: THREE.DoubleSide,
          depthWrite: false,
        })
      );
      beam.position.set(0, 1.85, 0);
      group.add(beam);

      const emitter = makeOrb(0.26, COLORS.coral, 0.55);
      emitter.position.set(0, 2.7, 0);
      group.add(emitter);

      const contact = makePulseRing(0.55, 0.72, COLORS.coral);
      contact.position.set(0, 0.9, 0);
      group.add(contact);

      const lbl = makeLabelSprite('ON · Specialist Focus Locked On', { bg: '#C24124', scale: 0.44 });
      lbl.position.set(0, 3.3, 0);
      group.add(lbl);

      return {
        group,
        cameraPos: [2.4, 2.8, 5.1],
        target: [0, 1.4, 0],
        update: (t) => {
          contact.scale.setScalar(1 + Math.sin(t * 3.5) * 0.14);
          emitter.scale.setScalar(1 + Math.sin(t * 3.5) * 0.08);
        },
      };
    }

    case 'm4-like-mirror': {
      const group = new THREE.Group();
      const subject = makeOrb(0.48, COLORS.ink, 0.18);
      subject.position.set(-1.35, 1.05, 0);
      group.add(subject);

      // Translucent glass mirror divider
      const glass = makeGlassBox(0.1, 2.1, 1.8, COLORS.violet, 0.25);
      glass.position.set(0, 1.1, 0);
      group.add(glass);

      // Twin hologram silhouette on right (similar, not identical)
      const twin = new THREE.Mesh(
        new THREE.SphereGeometry(0.48, 32, 32),
        new THREE.MeshPhysicalMaterial({
          color: COLORS.violet,
          transparent: true,
          opacity: 0.45,
          roughness: 0.15,
        })
      );
      twin.position.set(1.35, 1.05, 0);
      group.add(twin);

      const lbl = makeLabelSprite('LIKE · Mirror Similarity (Not Real Role)', { bg: '#6D28D9', scale: 0.43 });
      lbl.position.set(0, 2.6, 0);
      group.add(lbl);

      return {
        group,
        cameraPos: [1.2, 2.7, 5.3],
        target: [0, 1.1, 0],
        update: (t) => {
          const y = 1.05 + Math.sin(t * 2) * 0.14;
          subject.position.y = y;
          twin.position.y = y;
        },
      };
    }

    case 'm4-as-role': {
      const group = new THREE.Group();
      const subject = makeOrb(0.55, COLORS.ink, 0.18);
      subject.position.set(0, 1.05, 0);
      group.add(subject);

      // Official glowing crown / integrated role ring fused onto the subject
      const badge = new THREE.Mesh(
        new THREE.TorusGeometry(0.68, 0.09, 20, 48),
        new THREE.MeshStandardMaterial({
          color: COLORS.emerald,
          emissive: COLORS.emerald,
          emissiveIntensity: 0.4,
          roughness: 0.2,
          metalness: 0.4,
        })
      );
      badge.rotation.x = Math.PI / 2;
      badge.position.set(0, 1.55, 0);
      group.add(badge);

      const jewel = new THREE.Mesh(
        new THREE.OctahedronGeometry(0.24, 0),
        new THREE.MeshStandardMaterial({ color: COLORS.gold, emissive: COLORS.gold, emissiveIntensity: 0.35 })
      );
      jewel.position.set(0, 1.98, 0);
      group.add(jewel);

      const lbl = makeLabelSprite('AS · Actual Role / Identity', { bg: '#0F766E', scale: 0.44 });
      lbl.position.set(0, 2.75, 0);
      group.add(lbl);

      return {
        group,
        cameraPos: [2.2, 2.7, 4.9],
        target: [0, 1.25, 0],
        update: (t) => {
          jewel.rotation.y = t * 1.4;
          badge.rotation.z = t * 0.6;
        },
      };
    }

    default:
      return null;
  }
}
