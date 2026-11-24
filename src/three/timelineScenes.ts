import * as THREE from 'three';
import {
  BuiltScene,
  COLORS,
  makeArrowCone,
  makeGlassBox,
  makeLabelSprite,
  makeOrb,
  makePulseRing,
  makeSurfacePlate,
} from './helpers';

function addTimelineAxis(group: THREE.Group, width = 6.4): void {
  const rail = new THREE.Mesh(
    new THREE.CylinderGeometry(0.055, 0.055, width, 20),
    new THREE.MeshStandardMaterial({ color: COLORS.ink, roughness: 0.4 })
  );
  rail.rotation.z = Math.PI / 2;
  rail.position.y = 0.25;
  group.add(rail);

  const arrow = makeArrowCone(COLORS.ink, 0.9);
  arrow.rotation.z = -Math.PI / 2;
  arrow.position.set(width / 2 + 0.15, 0.25, 0);
  group.add(arrow);

  // Tick marks
  for (let x = -2.4; x <= 2.4; x += 1.2) {
    const tick = new THREE.Mesh(
      new THREE.BoxGeometry(0.04, 0.22, 0.04),
      new THREE.MeshStandardMaterial({ color: COLORS.slate })
    );
    tick.position.set(x, 0.25, 0);
    group.add(tick);
  }
}

export function buildTimelineScene(sceneId: string): BuiltScene | null {
  switch (sceneId) {
    case 'm3-time-trio': {
      const group = new THREE.Group();
      addTimelineAxis(group, 6.6);

      // AT: pinpoint clock needle
      const pin = new THREE.Mesh(
        new THREE.CylinderGeometry(0.03, 0.015, 0.8, 12),
        new THREE.MeshStandardMaterial({ color: COLORS.emerald })
      );
      pin.position.set(-2.2, 0.65, 0);
      const pinHead = makeOrb(0.2, COLORS.emerald, 0.45);
      pinHead.position.set(-2.2, 1.1, 0);
      const atLbl = makeLabelSprite('AT 9:00', { bg: '#0F766E', scale: 0.4 });
      atLbl.position.set(-2.2, 1.75, 0);
      group.add(pin, pinHead, atLbl);

      // ON: raised 2D day tile
      const dayTile = makeSurfacePlate(1.05, 0.18, 1.05, COLORS.coral, COLORS.coral);
      dayTile.position.set(-0.35, 0.42, 0);
      const onLbl = makeLabelSprite('ON Friday', { bg: '#C24124', scale: 0.4 });
      onLbl.position.set(-0.35, 1.35, 0);
      group.add(dayTile, onLbl);

      // IN: wide translucent month container
      const monthBox = makeGlassBox(2.1, 1.1, 1.2, COLORS.cobalt, 0.22);
      monthBox.position.set(1.85, 0.85, 0);
      const inLbl = makeLabelSprite('IN May / 2026', { bg: '#234DC7', scale: 0.4 });
      inLbl.position.set(1.85, 1.85, 0);
      group.add(monthBox, inLbl);

      return {
        group,
        cameraPos: [0, 3.0, 6.2],
        target: [0, 0.8, 0],
        update: (t) => {
          pinHead.position.y = 1.1 + Math.sin(t * 2.5) * 0.08;
          dayTile.position.y = 0.42 + Math.sin(t * 2 + 1) * 0.05;
        },
      };
    }

    case 'm3-zero-time': {
      const group = new THREE.Group();
      addTimelineAxis(group, 6.0);

      // Glowing shield node: NEXT / LAST / THIS / EVERY
      const core = makeSurfacePlate(2.5, 0.9, 0.9, COLORS.ink, COLORS.emerald);
      core.position.set(0.3, 0.85, 0);
      group.add(core);

      const coreLbl = makeLabelSprite('NEXT FRIDAY', { bg: '#0F766E', scale: 0.44 });
      coreLbl.position.set(0.3, 1.75, 0);
      group.add(coreLbl);

      // Red orb "ON" trying to attach and bouncing back!
      const badOrb = makeOrb(0.32, COLORS.rose, 0.45);
      badOrb.position.set(-1.9, 0.85, 0);
      group.add(badOrb);

      const badLbl = makeLabelSprite('✕ ON / IN', { bg: '#BE123C', scale: 0.36 });
      badLbl.position.set(-1.9, 1.5, 0);
      group.add(badLbl);

      const shield = new THREE.Mesh(
        new THREE.TorusGeometry(0.65, 0.04, 16, 48),
        new THREE.MeshBasicMaterial({ color: COLORS.rose, transparent: true, opacity: 0.7 })
      );
      shield.rotation.y = Math.PI / 2;
      shield.position.set(-1.15, 0.85, 0);
      group.add(shield);

      return {
        group,
        cameraPos: [0.4, 2.7, 5.8],
        target: [0, 0.9, 0],
        update: (t) => {
          const cycle = (t * 0.85) % 1;
          const approach = cycle < 0.45 ? cycle / 0.45 : Math.max(0, 1 - (cycle - 0.45) / 0.55);
          const x = -2.4 + approach * 0.82;
          badOrb.position.x = x;
          badLbl.position.x = x;
          shield.scale.setScalar(1 + (approach > 0.85 ? 0.25 : 0));
        },
      };
    }

    case 'm3-for': {
      const group = new THREE.Group();
      addTimelineAxis(group, 6.2);

      // Measured glowing block
      const block = makeSurfacePlate(3.2, 0.62, 0.78, COLORS.amber, COLORS.amber);
      block.position.set(0, 0.72, 0);
      group.add(block);

      const endA = new THREE.Mesh(
        new THREE.BoxGeometry(0.08, 1.15, 0.95),
        new THREE.MeshStandardMaterial({ color: COLORS.ink })
      );
      endA.position.set(-1.62, 0.72, 0);
      const endB = endA.clone();
      endB.position.set(1.62, 0.72, 0);
      group.add(endA, endB);

      const lbl = makeLabelSprite('FOR · 4 YEARS (Measured Width)', { bg: '#B45309', scale: 0.45 });
      lbl.position.set(0, 1.85, 0);
      group.add(lbl);

      return {
        group,
        cameraPos: [0.6, 2.8, 5.6],
        target: [0, 0.8, 0],
        update: (t) => {
          block.scale.y = 1 + Math.sin(t * 2.2) * 0.06;
        },
      };
    }

    case 'm3-since': {
      const group = new THREE.Group();
      addTimelineAxis(group, 6.4);

      // Past anchor pillar
      const startPillar = makeSurfacePlate(0.32, 1.5, 0.85, COLORS.emerald, COLORS.emerald);
      startPillar.position.set(-1.8, 0.9, 0);
      group.add(startPillar);

      const startLbl = makeLabelSprite('2022', { bg: '#18181B', scale: 0.36 });
      startLbl.position.set(-1.8, 2.0, 0);
      group.add(startLbl);

      // NOW pillar
      const nowRing = makePulseRing(0.32, 0.46, COLORS.emerald);
      nowRing.position.set(2.0, 0.28, 0);
      group.add(nowRing);

      const nowOrb = makeOrb(0.28, COLORS.emerald, 0.5);
      nowOrb.position.set(2.0, 0.95, 0);
      group.add(nowOrb);

      const nowLbl = makeLabelSprite('NOW', { bg: '#0F766E', scale: 0.4 });
      nowLbl.position.set(2.0, 1.75, 0);
      group.add(nowLbl);

      // Continuous glowing beam from 2022 → NOW
      const beam = new THREE.Mesh(
        new THREE.CylinderGeometry(0.14, 0.14, 3.6, 24),
        new THREE.MeshStandardMaterial({
          color: COLORS.emerald,
          emissive: COLORS.emerald,
          emissiveIntensity: 0.35,
          transparent: true,
          opacity: 0.78,
        })
      );
      beam.rotation.z = Math.PI / 2;
      beam.position.set(0.1, 0.95, 0);
      group.add(beam);

      const pulse = makeOrb(0.2, 0xffffff, 0.8);
      group.add(pulse);

      const lbl = makeLabelSprite('SINCE 2022 → NOW', { bg: '#0F766E', scale: 0.45 });
      lbl.position.set(0.1, 2.45, 0);
      group.add(lbl);

      return {
        group,
        cameraPos: [0.3, 2.9, 5.9],
        target: [0, 0.9, 0],
        update: (t) => {
          const u = (t * 0.5) % 1;
          pulse.position.set(-1.65 + u * 3.55, 0.95, 0);
          nowRing.scale.setScalar(1 + Math.sin(t * 3) * 0.15);
        },
      };
    }

    case 'm3-during': {
      const group = new THREE.Group();
      addTimelineAxis(group, 6.2);

      // Wide outer event canopy (THE KEYNOTE)
      const outer = makeGlassBox(3.8, 1.45, 1.45, COLORS.cobalt, 0.18);
      outer.position.set(0, 1.0, 0);
      group.add(outer);

      const outerLbl = makeLabelSprite('DURING THE KEYNOTE (Event Frame)', { bg: '#234DC7', scale: 0.42 });
      outerLbl.position.set(0, 2.2, 0);
      group.add(outerLbl);

      // Nested event orb occurring inside the frame
      const eventOrb = makeOrb(0.32, COLORS.coral, 0.45);
      eventOrb.position.set(0.45, 0.95, 0);
      group.add(eventOrb);

      const evLbl = makeLabelSprite('Phone died', { bg: '#C24124', scale: 0.34 });
      evLbl.position.set(0.45, 1.5, 0);
      group.add(evLbl);

      return {
        group,
        cameraPos: [1.0, 2.8, 5.7],
        target: [0, 0.95, 0],
        update: (t) => {
          eventOrb.position.y = 0.95 + Math.sin(t * 2.5) * 0.1;
          evLbl.position.y = 1.5 + Math.sin(t * 2.5) * 0.1;
        },
      };
    }

    case 'm3-by': {
      const group = new THREE.Group();
      addTimelineAxis(group, 6.4);

      // Solid red deadline wall
      const wall = makeSurfacePlate(0.24, 2.1, 1.85, COLORS.rose, COLORS.rose);
      wall.position.set(1.85, 1.15, 0);
      group.add(wall);

      const wallLbl = makeLabelSprite('FRIDAY 5 PM', { bg: '#BE123C', scale: 0.4 });
      wallLbl.position.set(1.85, 2.55, 0);
      group.add(wallLbl);

      // Safe completion zone before wall
      const safeZone = makeGlassBox(3.6, 0.45, 1.3, COLORS.emerald, 0.18);
      safeZone.position.set(-0.2, 0.5, 0);
      group.add(safeZone);

      // Single completion orb dropping cleanly BEFORE the wall
      const orb = makeOrb(0.34, COLORS.emerald, 0.45);
      orb.position.set(0.55, 1.0, 0);
      group.add(orb);

      const ring = makePulseRing(0.34, 0.48, COLORS.emerald);
      ring.position.set(0.55, 0.32, 0);
      group.add(ring);

      const lbl = makeLabelSprite('BY · Single Finish Before Wall', { bg: '#0F766E', scale: 0.44 });
      lbl.position.set(-0.35, 2.1, 0);
      group.add(lbl);

      return {
        group,
        cameraPos: [0.8, 3.0, 6.0],
        target: [0.2, 1.0, 0],
        update: (t) => {
          const cycle = (t * 0.45) % 1;
          const x = -1.5 + Math.sin(cycle * Math.PI) * 2.5;
          orb.position.x = x;
          orb.position.y = 0.85 + Math.abs(Math.cos(t * 2.4)) * 0.35;
          ring.position.x = x;
          ring.scale.setScalar(1 + Math.sin(t * 4) * 0.15);
        },
      };
    }

    case 'm3-until': {
      const group = new THREE.Group();
      addTimelineAxis(group, 6.4);

      // Deadline barrier wall
      const wall = makeSurfacePlate(0.24, 2.1, 1.85, COLORS.rose, COLORS.rose);
      wall.position.set(1.85, 1.15, 0);
      group.add(wall);

      const wallLbl = makeLabelSprite('FRIDAY 5 PM', { bg: '#BE123C', scale: 0.4 });
      wallLbl.position.set(1.85, 2.55, 0);
      group.add(wallLbl);

      // Continuous unbroken beam running all the way up to the wall
      const beam = new THREE.Mesh(
        new THREE.BoxGeometry(4.1, 0.46, 0.72),
        new THREE.MeshStandardMaterial({
          color: COLORS.amber,
          emissive: COLORS.amber,
          emissiveIntensity: 0.32,
          roughness: 0.25,
        })
      );
      beam.position.set(-0.32, 0.85, 0);
      group.add(beam);

      // Flow pulses gliding continuously along beam and terminating at wall
      const pulses = [0, 1, 2].map(() => {
        const p = makeOrb(0.16, 0xffffff, 0.75);
        group.add(p);
        return p;
      });

      const lbl = makeLabelSprite('UNTIL · Continuous State Up To Wall', { bg: '#B45309', scale: 0.44 });
      lbl.position.set(-0.4, 2.1, 0);
      group.add(lbl);

      return {
        group,
        cameraPos: [0.8, 3.0, 6.0],
        target: [0.2, 1.0, 0],
        update: (t) => {
          pulses.forEach((p, idx) => {
            const u = (t * 0.45 + idx / 3) % 1;
            p.position.set(-2.3 + u * 3.95, 0.85, 0);
          });
        },
      };
    }

    case 'm3-within': {
      const group = new THREE.Group();
      addTimelineAxis(group, 6.0);

      const windowBox = makeGlassBox(3.1, 1.45, 1.4, COLORS.cobalt, 0.22);
      windowBox.position.set(0, 1.0, 0);
      group.add(windowBox);

      const orb = makeOrb(0.32, COLORS.cobalt, 0.42);
      orb.position.set(0, 1.0, 0);
      group.add(orb);

      const lbl = makeLabelSprite('WITHIN · Inside 2-Hour Window', { bg: '#234DC7', scale: 0.44 });
      lbl.position.set(0, 2.25, 0);
      group.add(lbl);

      return {
        group,
        cameraPos: [0.8, 2.8, 5.7],
        target: [0, 0.95, 0],
        update: (t) => {
          orb.position.x = Math.sin(t * 1.5) * 1.05;
        },
      };
    }

    case 'm3-in-vs-after': {
      const group = new THREE.Group();
      addTimelineAxis(group, 6.2);

      // NOW marker on left
      const nowPost = makeSurfacePlate(0.24, 1.4, 0.24, COLORS.emerald, COLORS.emerald);
      nowPost.position.set(-2.0, 0.85, 0.7);
      const nowLbl = makeLabelSprite('NOW', { bg: '#0F766E', scale: 0.35 });
      nowLbl.position.set(-2.0, 1.85, 0.7);
      group.add(nowPost, nowLbl);

      // Top bar: IN 15 MIN (anchored to NOW)
      const inBar = makeSurfacePlate(2.8, 0.28, 0.38, COLORS.emerald);
      inBar.position.set(-0.5, 1.15, 0.7);
      const inEnd = makeOrb(0.24, COLORS.emerald, 0.5);
      inEnd.position.set(0.95, 1.15, 0.7);
      const inLbl = makeLabelSprite('IN 15 min (from NOW)', { bg: '#0F766E', scale: 0.38 });
      inLbl.position.set(1.1, 1.75, 0.7);
      group.add(inBar, inEnd, inLbl);

      // Back bar: AFTER 15 MIN (narrative sequence)
      const pastPost = makeSurfacePlate(0.24, 1.4, 0.24, COLORS.amber, COLORS.amber);
      pastPost.position.set(-2.0, 0.85, -0.85);
      const pastLbl = makeLabelSprite('PAST EVENT', { bg: '#B45309', scale: 0.34 });
      pastLbl.position.set(-2.0, 1.85, -0.85);
      const afterBar = makeSurfacePlate(2.8, 0.28, 0.38, COLORS.amber);
      afterBar.position.set(-0.5, 0.85, -0.85);
      const afterEnd = makeOrb(0.24, COLORS.amber, 0.5);
      afterEnd.position.set(0.95, 0.85, -0.85);
      const afterLbl = makeLabelSprite('AFTER 15 min (sequence)', { bg: '#B45309', scale: 0.38 });
      afterLbl.position.set(1.2, 1.45, -0.85);
      group.add(pastPost, pastLbl, afterBar, afterEnd, afterLbl);

      return {
        group,
        cameraPos: [1.5, 3.2, 5.8],
        target: [-0.2, 0.9, 0],
        update: (t) => {
          inEnd.scale.setScalar(1 + Math.sin(t * 3) * 0.1);
          afterEnd.scale.setScalar(1 + Math.cos(t * 3) * 0.1);
        },
      };
    }

    default:
      return null;
  }
}
