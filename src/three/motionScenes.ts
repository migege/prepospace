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

function addAnimatedPath(
  group: THREE.Group,
  points: THREE.Vector3[],
  color: number,
  speed = 0.38
): { update: (t: number) => void } {
  const { curve, mesh } = makeCurveTube(points, color, 0.04, 0.65);
  group.add(mesh);

  const orb = makeOrb(0.28, color, 0.45);
  group.add(orb);

  // End cone arrow
  const endPt = curve.getPointAt(1);
  const tangent = curve.getTangentAt(1).normalize();
  const cone = makeArrowCone(color, 1.0);
  cone.position.copy(endPt);
  cone.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), tangent);
  group.add(cone);

  // Subtle trailing dots
  const trail = [0, 1, 2].map((i) => {
    const m = makeOrb(0.11 - i * 0.025, color, 0.35);
    group.add(m);
    return m;
  });

  return {
    update: (t: number) => {
      const u = (t * speed) % 1;
      orb.position.copy(curve.getPointAt(u));
      trail.forEach((m, i) => {
        const tu = Math.max(0, u - (i + 1) * 0.055);
        m.position.copy(curve.getPointAt(tu));
        m.visible = u > (i + 1) * 0.055;
      });
    },
  };
}

export function buildMotionScene(sceneId: string): BuiltScene | null {
  switch (sceneId) {
    case 'm2-into': {
      const group = new THREE.Group();
      const box = makeGlassBox(2.2, 2.0, 2.0, COLORS.cobalt, 0.2);
      box.position.set(1.0, 1.05, 0);
      group.add(box);

      const anim = addAnimatedPath(
        group,
        [
          new THREE.Vector3(-2.6, 1.05, 0),
          new THREE.Vector3(-0.7, 1.35, 0),
          new THREE.Vector3(1.0, 1.05, 0),
        ],
        COLORS.cobalt,
        0.4
      );

      const lbl = makeLabelSprite('INTO · Crossing into volume', { bg: '#234DC7', scale: 0.45 });
      lbl.position.set(0.2, 2.55, 0);
      group.add(lbl);

      return {
        group,
        cameraPos: [1.5, 3.0, 5.4],
        target: [0, 1.0, 0],
        update: (t) => anim.update(t),
      };
    }

    case 'm2-out-of': {
      const group = new THREE.Group();
      const box = makeGlassBox(2.2, 2.0, 2.0, COLORS.amber, 0.2);
      box.position.set(-1.1, 1.05, 0);
      group.add(box);

      const anim = addAnimatedPath(
        group,
        [
          new THREE.Vector3(-1.1, 1.05, 0),
          new THREE.Vector3(0.6, 1.4, 0),
          new THREE.Vector3(2.5, 1.0, 0),
        ],
        COLORS.amber,
        0.4
      );

      const lbl = makeLabelSprite('OUT OF · Exiting volume', { bg: '#B45309', scale: 0.45 });
      lbl.position.set(0.2, 2.55, 0);
      group.add(lbl);

      return {
        group,
        cameraPos: [1.5, 3.0, 5.4],
        target: [0, 1.0, 0],
        update: (t) => anim.update(t),
      };
    }

    case 'm2-onto': {
      const group = new THREE.Group();
      const stage = makeSurfacePlate(2.5, 0.85, 2.2, COLORS.cream, COLORS.coral);
      stage.position.set(1.0, 0.425, 0);
      group.add(stage);

      const top = makeSurfacePlate(2.4, 0.06, 2.1, COLORS.coral);
      top.position.set(1.0, 0.88, 0);
      group.add(top);

      const ring = makePulseRing(0.32, 0.48, COLORS.coral);
      ring.position.set(1.0, 0.93, 0);
      group.add(ring);

      const anim = addAnimatedPath(
        group,
        [
          new THREE.Vector3(-2.3, 0.35, 0),
          new THREE.Vector3(-0.7, 2.1, 0),
          new THREE.Vector3(1.0, 1.18, 0),
        ],
        COLORS.coral,
        0.42
      );

      const lbl = makeLabelSprite('ONTO · Landing on surface', { bg: '#C24124', scale: 0.45 });
      lbl.position.set(0.2, 2.65, 0);
      group.add(lbl);

      return {
        group,
        cameraPos: [1.8, 3.0, 5.4],
        target: [0, 1.0, 0],
        update: (t) => {
          anim.update(t);
          ring.scale.setScalar(1 + Math.sin(t * 4) * 0.14);
        },
      };
    }

    case 'm2-off': {
      const group = new THREE.Group();
      const stage = makeSurfacePlate(2.4, 0.85, 2.2, COLORS.cream, COLORS.rose);
      stage.position.set(-1.1, 0.425, 0);
      group.add(stage);

      const anim = addAnimatedPath(
        group,
        [
          new THREE.Vector3(-1.1, 1.16, 0),
          new THREE.Vector3(0.6, 1.95, 0),
          new THREE.Vector3(2.4, 0.35, 0),
        ],
        COLORS.rose,
        0.42
      );

      const lbl = makeLabelSprite('OFF · Detaching from surface', { bg: '#BE123C', scale: 0.45 });
      lbl.position.set(0.2, 2.6, 0);
      group.add(lbl);

      return {
        group,
        cameraPos: [1.8, 3.0, 5.4],
        target: [0, 1.0, 0],
        update: (t) => anim.update(t),
      };
    }

    case 'm2-through': {
      const group = new THREE.Group();
      // Ribbed 3D translucent tunnel along X axis
      const tunnelGeo = new THREE.CylinderGeometry(1.05, 1.05, 2.6, 32, 1, true);
      const tunnelMat = new THREE.MeshPhysicalMaterial({
        color: COLORS.cobalt,
        transparent: true,
        opacity: 0.22,
        roughness: 0.15,
        side: THREE.DoubleSide,
        depthWrite: false,
      });
      const tunnel = new THREE.Mesh(tunnelGeo, tunnelMat);
      tunnel.rotation.z = Math.PI / 2;
      tunnel.position.set(0, 1.15, 0);
      group.add(tunnel);

      // Tunnel rings
      [-1.25, -0.42, 0.42, 1.25].forEach((x) => {
        const ring = new THREE.Mesh(
          new THREE.TorusGeometry(1.06, 0.04, 16, 48),
          new THREE.MeshStandardMaterial({ color: COLORS.cobalt, roughness: 0.3 })
        );
        ring.rotation.y = Math.PI / 2;
        ring.position.set(x, 1.15, 0);
        group.add(ring);
      });

      const anim = addAnimatedPath(
        group,
        [
          new THREE.Vector3(-2.8, 1.15, 0),
          new THREE.Vector3(0, 1.15, 0),
          new THREE.Vector3(2.8, 1.15, 0),
        ],
        COLORS.cobalt,
        0.38
      );

      const lbl = makeLabelSprite('THROUGH · 3D Tunnel / Medium', { bg: '#234DC7', scale: 0.45 });
      lbl.position.set(0, 2.7, 0);
      group.add(lbl);

      return {
        group,
        cameraPos: [2.4, 2.9, 5.3],
        target: [0, 1.1, 0],
        update: (t) => anim.update(t),
      };
    }

    case 'm2-across': {
      const group = new THREE.Group();
      // Flat 2D bridge / river surface
      const water = makeSurfacePlate(4.6, 0.1, 4.4, 0x93c5fd);
      water.position.y = 0.05;
      group.add(water);

      const bridge = makeSurfacePlate(4.8, 0.16, 1.4, COLORS.warmWhite, COLORS.coral);
      bridge.position.y = 0.24;
      group.add(bridge);

      const anim = addAnimatedPath(
        group,
        [
          new THREE.Vector3(-2.3, 0.62, 0),
          new THREE.Vector3(0, 0.62, 0),
          new THREE.Vector3(2.3, 0.62, 0),
        ],
        COLORS.coral,
        0.38
      );

      const lbl = makeLabelSprite('ACROSS · Flat 2D Plane', { bg: '#C24124', scale: 0.45 });
      lbl.position.set(0, 1.85, 0);
      group.add(lbl);

      return {
        group,
        cameraPos: [2.4, 3.2, 4.9],
        target: [0, 0.5, 0],
        update: (t) => anim.update(t),
      };
    }

    case 'm2-along': {
      const group = new THREE.Group();
      // Linear canal / boulevard strip
      const canal = makeSurfacePlate(5.6, 0.14, 0.85, 0x60a5fa, COLORS.cobalt);
      canal.position.set(0, 0.07, -0.65);
      group.add(canal);

      const path = makeSurfacePlate(5.6, 0.14, 1.0, COLORS.cream, COLORS.amber);
      path.position.set(0, 0.07, 0.45);
      group.add(path);

      // Decorative trees along the line
      [-2.0, -0.7, 0.7, 2.0].forEach((x) => {
        const trunk = new THREE.Mesh(
          new THREE.CylinderGeometry(0.06, 0.08, 0.5, 12),
          new THREE.MeshStandardMaterial({ color: 0x785a3a })
        );
        trunk.position.set(x, 0.35, -1.35);
        const crown = new THREE.Mesh(
          new THREE.SphereGeometry(0.28, 16, 16),
          new THREE.MeshStandardMaterial({ color: COLORS.emerald, roughness: 0.6 })
        );
        crown.position.set(x, 0.72, -1.35);
        group.add(trunk, crown);
      });

      const anim = addAnimatedPath(
        group,
        [
          new THREE.Vector3(-2.5, 0.46, 0.45),
          new THREE.Vector3(0, 0.46, 0.45),
          new THREE.Vector3(2.5, 0.46, 0.45),
        ],
        COLORS.amber,
        0.36
      );

      const lbl = makeLabelSprite('ALONG · Parallel to 1D Line', { bg: '#B45309', scale: 0.45 });
      lbl.position.set(0, 1.95, 0);
      group.add(lbl);

      return {
        group,
        cameraPos: [2.6, 3.2, 5.0],
        target: [0, 0.5, 0],
        update: (t) => anim.update(t),
      };
    }

    case 'm2-past': {
      const group = new THREE.Group();
      // Tall landmark pillar
      const pillar = makeSurfacePlate(0.95, 2.2, 0.95, COLORS.warmWhite, COLORS.emerald);
      pillar.position.set(0, 1.1, -0.75);
      group.add(pillar);

      const cap = makeOrb(0.22, COLORS.emerald, 0.35);
      cap.position.set(0, 2.45, -0.75);
      group.add(cap);

      const anim = addAnimatedPath(
        group,
        [
          new THREE.Vector3(-2.7, 0.55, 0.6),
          new THREE.Vector3(0, 0.55, 0.75),
          new THREE.Vector3(2.7, 0.55, 0.6),
        ],
        COLORS.emerald,
        0.4
      );

      const lbl = makeLabelSprite('PAST · Sweeping Beyond Landmark', { bg: '#0F766E', scale: 0.44 });
      lbl.position.set(0, 3.05, -0.4);
      group.add(lbl);

      return {
        group,
        cameraPos: [2.6, 3.0, 5.2],
        target: [0, 1.0, 0],
        update: (t) => anim.update(t),
      };
    }

    case 'm2-to':
    case 'm2-toward': {
      const isTo = sceneId === 'm2-to';
      const color = isTo ? COLORS.emerald : COLORS.amber;
      const group = new THREE.Group();

      // Destination beacon on right
      const pad = makeSurfacePlate(1.3, 0.16, 1.3, COLORS.cream, color);
      pad.position.set(2.1, 0.08, 0);
      group.add(pad);

      const beacon = makeOrb(0.38, color, isTo ? 0.5 : 0.15);
      beacon.position.set(2.1, 0.95, 0);
      group.add(beacon);

      const ring = makePulseRing(0.45, 0.6, color);
      ring.position.set(2.1, 0.18, 0);
      group.add(ring);

      const endX = isTo ? 1.65 : 0.45;
      const anim = addAnimatedPath(
        group,
        [
          new THREE.Vector3(-2.5, 0.95, 0),
          new THREE.Vector3(-0.6, 0.95, 0),
          new THREE.Vector3(endX, 0.95, 0),
        ],
        color,
        0.38
      );

      const lbl = makeLabelSprite(
        isTo ? 'TO · Reaches Destination' : 'TOWARD · Direction Only (No Arrival)',
        { bg: isTo ? '#0F766E' : '#B45309', scale: 0.44 }
      );
      lbl.position.set(0, 2.25, 0);
      group.add(lbl);

      return {
        group,
        cameraPos: [0.4, 2.8, 5.5],
        target: [0, 0.9, 0],
        update: (t) => {
          anim.update(t);
          if (isTo) {
            ring.scale.setScalar(1 + Math.sin(t * 4) * 0.18);
          }
        },
      };
    }

    case 'm2-over': {
      const group = new THREE.Group();
      const barrier = makeSurfacePlate(1.2, 1.35, 2.2, COLORS.stone, COLORS.ink);
      barrier.position.set(0, 0.675, 0);
      group.add(barrier);

      const anim = addAnimatedPath(
        group,
        [
          new THREE.Vector3(-2.4, 0.45, 0),
          new THREE.Vector3(0, 2.45, 0),
          new THREE.Vector3(2.4, 0.45, 0),
        ],
        COLORS.coral,
        0.38
      );

      const lbl = makeLabelSprite('OVER · Dynamic Arc Across Barrier', { bg: '#C24124', scale: 0.44 });
      lbl.position.set(0, 3.05, 0);
      group.add(lbl);

      return {
        group,
        cameraPos: [1.8, 2.9, 5.5],
        target: [0, 1.2, 0],
        update: (t) => anim.update(t),
      };
    }

    case 'm2-above': {
      const group = new THREE.Group();
      // Reference plane
      const refPlane = makeSurfacePlate(3.6, 0.12, 2.4, COLORS.cream, COLORS.slate);
      refPlane.position.y = 0.65;
      group.add(refPlane);

      // Vertical measurement dashed line
      const pole = new THREE.Mesh(
        new THREE.CylinderGeometry(0.025, 0.025, 1.4, 12),
        new THREE.MeshBasicMaterial({ color: COLORS.cobalt, transparent: true, opacity: 0.55 })
      );
      pole.position.y = 1.4;
      group.add(pole);

      const orb = makeOrb(0.4, COLORS.cobalt, 0.35);
      orb.position.y = 2.15;
      group.add(orb);

      const lbl = makeLabelSprite('ABOVE · Higher Elevation (No Crossing)', { bg: '#234DC7', scale: 0.44 });
      lbl.position.set(0, 2.95, 0);
      group.add(lbl);

      return {
        group,
        cameraPos: [2.8, 2.8, 4.9],
        target: [0, 1.3, 0],
        update: (t) => {
          orb.position.y = 2.15 + Math.sin(t * 2) * 0.1;
        },
      };
    }

    case 'm2-under': {
      const group = new THREE.Group();
      // Canopy / bridge cover overhead
      const roof = makeSurfacePlate(3.2, 0.25, 2.2, COLORS.violet, COLORS.violet);
      roof.position.set(0, 1.85, 0);
      group.add(roof);

      // Pillars supporting roof
      [
        [-1.35, 0.9, -0.85],
        [1.35, 0.9, -0.85],
        [-1.35, 0.9, 0.85],
        [1.35, 0.9, 0.85],
      ].forEach(([x, y, z]) => {
        const col = new THREE.Mesh(
          new THREE.CylinderGeometry(0.08, 0.08, 1.8, 16),
          new THREE.MeshStandardMaterial({ color: COLORS.stone })
        );
        col.position.set(x, y, z);
        group.add(col);
      });

      // Orb directly sheltered / pressed underneath
      const orb = makeOrb(0.38, COLORS.violet, 0.4);
      orb.position.set(0, 0.6, 0);
      group.add(orb);

      const lbl = makeLabelSprite('UNDER · Beneath Cover / Weight', { bg: '#6D28D9', scale: 0.44 });
      lbl.position.set(0, 2.6, 0);
      group.add(lbl);

      return {
        group,
        cameraPos: [3.0, 2.5, 4.8],
        target: [0, 1.0, 0],
        update: (t) => {
          roof.position.y = 1.85 + Math.sin(t * 2) * 0.08;
          orb.scale.y = 1 - Math.sin(t * 2) * 0.06;
        },
      };
    }

    case 'm2-below': {
      const group = new THREE.Group();
      // Translucent zero-threshold benchmark plane
      const threshold = makeGlassBox(3.8, 0.08, 2.4, COLORS.emerald, 0.3);
      threshold.position.y = 1.7;
      group.add(threshold);

      const zeroLbl = makeLabelSprite('0° / TARGET LINE', { bg: '#18181B', scale: 0.34 });
      zeroLbl.position.set(1.9, 1.75, 0);
      group.add(zeroLbl);

      const orb = makeOrb(0.38, COLORS.emerald, 0.38);
      orb.position.y = 0.65;
      group.add(orb);

      const lbl = makeLabelSprite('BELOW · Beneath Benchmark Scale', { bg: '#0F766E', scale: 0.44 });
      lbl.position.set(0, 2.65, 0);
      group.add(lbl);

      return {
        group,
        cameraPos: [2.8, 2.6, 4.9],
        target: [0, 1.1, 0],
        update: (t) => {
          orb.position.y = 0.65 + Math.sin(t * 1.8) * 0.12;
        },
      };
    }

    default:
      return null;
  }
}
