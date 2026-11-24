import * as THREE from 'three';
import { KidsWorldId } from '../data/kidsData';
import { makeGlassBox, makeSurfacePlate } from './helpers';

export interface PipRig {
  root: THREE.Group;
  body: THREE.Group;
  tail: THREE.Mesh;
  earLeft: THREE.Mesh;
  earRight: THREE.Mesh;
  updateIdle: (t: number, happySpin: number) => void;
}

/** Build adorable procedural low-poly 3D puppy "Pip" */
export function buildPipPuppy(): PipRig {
  const root = new THREE.Group();
  const body = new THREE.Group();
  root.add(body);

  const furMat = new THREE.MeshStandardMaterial({ color: 0xf4a259, roughness: 0.55 });
  const creamMat = new THREE.MeshStandardMaterial({ color: 0xfff3df, roughness: 0.6 });
  const earMat = new THREE.MeshStandardMaterial({ color: 0xb56537, roughness: 0.65 });
  const darkMat = new THREE.MeshStandardMaterial({ color: 0x1f242d, roughness: 0.25 });
  const collarMat = new THREE.MeshStandardMaterial({ color: 0xe63946, roughness: 0.35 });
  const cheekMat = new THREE.MeshStandardMaterial({ color: 0xff8fab, roughness: 0.5 });

  // Torso
  const torso = new THREE.Mesh(new THREE.SphereGeometry(0.28, 24, 24), furMat);
  torso.scale.set(0.95, 0.9, 1.15);
  torso.position.set(0, 0.3, 0);
  torso.castShadow = true;
  body.add(torso);

  // Cream belly patch
  const belly = new THREE.Mesh(new THREE.SphereGeometry(0.2, 20, 20), creamMat);
  belly.position.set(0, 0.28, 0.14);
  body.add(belly);

  // 4 cute stubby paws
  const pawGeo = new THREE.SphereGeometry(0.095, 16, 16);
  [
    [-0.14, 0.09, 0.16],
    [0.14, 0.09, 0.16],
    [-0.14, 0.09, -0.15],
    [0.14, 0.09, -0.15],
  ].forEach(([x, y, z]) => {
    const paw = new THREE.Mesh(pawGeo, creamMat);
    paw.scale.set(1, 0.85, 1.15);
    paw.position.set(x, y, z);
    paw.castShadow = true;
    body.add(paw);
  });

  // Red collar + gold tag
  const collar = new THREE.Mesh(new THREE.TorusGeometry(0.18, 0.035, 12, 24), collarMat);
  collar.rotation.x = Math.PI / 2;
  collar.position.set(0, 0.49, 0.08);
  body.add(collar);

  const tag = new THREE.Mesh(
    new THREE.SphereGeometry(0.05, 12, 12),
    new THREE.MeshStandardMaterial({ color: 0xfbbf24, metalness: 0.4, roughness: 0.25 })
  );
  tag.position.set(0, 0.44, 0.26);
  body.add(tag);

  // Head
  const head = new THREE.Mesh(new THREE.SphereGeometry(0.25, 24, 24), furMat);
  head.position.set(0, 0.67, 0.12);
  head.castShadow = true;
  body.add(head);

  // Muzzle + button nose
  const muzzle = new THREE.Mesh(new THREE.SphereGeometry(0.11, 18, 18), creamMat);
  muzzle.scale.set(1.2, 0.85, 0.9);
  muzzle.position.set(0, 0.62, 0.33);
  body.add(muzzle);

  const nose = new THREE.Mesh(new THREE.SphereGeometry(0.048, 16, 16), darkMat);
  nose.scale.set(1.2, 0.85, 0.85);
  nose.position.set(0, 0.65, 0.42);
  body.add(nose);

  // Eyes + sparkle catchlights
  [-0.095, 0.095].forEach((x) => {
    const eye = new THREE.Mesh(new THREE.SphereGeometry(0.042, 16, 16), darkMat);
    eye.position.set(x, 0.72, 0.33);
    body.add(eye);

    const glint = new THREE.Mesh(
      new THREE.SphereGeometry(0.015, 10, 10),
      new THREE.MeshBasicMaterial({ color: 0xffffff })
    );
    glint.position.set(x + 0.014, 0.735, 0.365);
    body.add(glint);

    const cheek = new THREE.Mesh(new THREE.SphereGeometry(0.036, 12, 12), cheekMat);
    cheek.scale.set(1.2, 0.7, 0.5);
    cheek.position.set(x * 1.45, 0.64, 0.3);
    body.add(cheek);
  });

  // Floppy ears
  const earGeo = new THREE.CapsuleGeometry(0.065, 0.14, 8, 12);
  const earLeft = new THREE.Mesh(earGeo, earMat);
  earLeft.position.set(-0.23, 0.67, 0.08);
  earLeft.rotation.z = 0.38;
  earLeft.castShadow = true;
  const earRight = new THREE.Mesh(earGeo, earMat);
  earRight.position.set(0.23, 0.67, 0.08);
  earRight.rotation.z = -0.38;
  earRight.castShadow = true;
  body.add(earLeft, earRight);

  // Wagging tail
  const tailGeo = new THREE.CapsuleGeometry(0.045, 0.16, 8, 12);
  tailGeo.translate(0, 0.1, 0);
  const tail = new THREE.Mesh(tailGeo, earMat);
  tail.position.set(0, 0.35, -0.28);
  tail.rotation.x = -0.7;
  body.add(tail);

  return {
    root,
    body,
    tail,
    earLeft,
    earRight,
    updateIdle: (t, happySpin) => {
      const wagSpeed = happySpin > 0 ? 18 : 8.5;
      tail.rotation.z = Math.sin(t * wagSpeed) * 0.55;
      earLeft.rotation.z = 0.38 + Math.sin(t * 3.5) * 0.08;
      earRight.rotation.z = -0.38 - Math.sin(t * 3.5) * 0.08;

      if (happySpin > 0) {
        body.position.y = Math.abs(Math.sin(happySpin * Math.PI * 2)) * 0.45;
        body.rotation.y = happySpin * Math.PI * 2;
      } else {
        body.position.y = Math.sin(t * 3.2) * 0.03;
        body.rotation.y = 0;
      }
    },
  };
}

/** Build each of the 4 colorful 3D Kids Worlds */
export function buildKidsWorldBackdrop(worldId: KidsWorldId): {
  group: THREE.Group;
  update?: (t: number) => void;
} {
  const group = new THREE.Group();

  // Warm soft play-mat base disc for every world
  const meadowColor =
    worldId === 'toyroom' ? 0xfef3c7 : worldId === 'playground' ? 0xecfdf5 : 0xbbf7d0;
  const baseMat = new THREE.MeshStandardMaterial({ color: meadowColor, roughness: 0.85 });
  const baseDisc = new THREE.Mesh(new THREE.CylinderGeometry(4.6, 4.8, 0.24, 48), baseMat);
  baseDisc.position.y = -0.12;
  baseDisc.receiveShadow = true;
  group.add(baseDisc);

  if (worldId === 'toyroom') {
    // Soft striped rug
    const rug = new THREE.Mesh(
      new THREE.CylinderGeometry(3.4, 3.4, 0.04, 40),
      new THREE.MeshStandardMaterial({ color: 0xfde68a, roughness: 0.9 })
    );
    rug.position.y = 0.02;
    rug.receiveShadow = true;
    group.add(rug);

    // Translucent open-top Sky-Blue Toy Box (Left)
    const boxFrame = makeGlassBox(1.55, 1.08, 1.45, 0x0284c7, 0.24);
    boxFrame.position.set(-1.55, 0.56, 0);
    group.add(boxFrame);

    const boxFloor = makeSurfacePlate(1.55, 0.12, 1.45, 0x38bdf8, 0x0284c7);
    boxFloor.position.set(-1.55, 0.08, 0);
    group.add(boxFloor);

    // Little colorful toy ball beside box
    const ball = new THREE.Mesh(
      new THREE.SphereGeometry(0.24, 24, 24),
      new THREE.MeshStandardMaterial({ color: 0xf43f5e, roughness: 0.3 })
    );
    ball.position.set(-0.25, 0.24, 1.35);
    ball.castShadow = true;
    group.add(ball);

    // Sunny Wooden Table (Right) — clear space ON top and UNDER beneath!
    const top = makeSurfacePlate(2.15, 0.16, 1.65, 0xfbbf24, 0xd97706);
    top.position.set(1.35, 1.24, 0);
    group.add(top);

    const legMat = new THREE.MeshStandardMaterial({ color: 0xd97706, roughness: 0.6 });
    [
      [0.42, 0.6, -0.65],
      [2.28, 0.6, -0.65],
      [0.42, 0.6, 0.65],
      [2.28, 0.6, 0.65],
    ].forEach(([x, y, z]) => {
      const leg = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.08, 1.2, 16), legMat);
      leg.position.set(x, y, z);
      leg.castShadow = true;
      group.add(leg);
    });

    return { group };
  }

  if (worldId === 'backyard') {
    // Cute Red-Roofed Playhouse (Left-Center)
    const walls = makeSurfacePlate(1.9, 1.45, 1.75, 0xfff7ed, 0xfdba74);
    walls.position.set(-0.95, 0.725, 0);
    group.add(walls);

    // Pitched red roof
    const roof = new THREE.Mesh(
      new THREE.ConeGeometry(1.6, 1.0, 4),
      new THREE.MeshStandardMaterial({ color: 0xef4444, roughness: 0.45 })
    );
    roof.rotation.y = Math.PI / 4;
    roof.position.set(-0.95, 1.94, 0);
    roof.castShadow = true;
    group.add(roof);

    // Front wooden door so "in front of" vs "behind" is unmistakably clear!
    const door = new THREE.Mesh(
      new THREE.BoxGeometry(0.55, 0.85, 0.08),
      new THREE.MeshStandardMaterial({ color: 0x0284c7, roughness: 0.45 })
    );
    door.position.set(-0.95, 0.44, 0.89);
    group.add(door);

    const knob = new THREE.Mesh(
      new THREE.SphereGeometry(0.05, 12, 12),
      new THREE.MeshStandardMaterial({ color: 0xfbbf24 })
    );
    knob.position.set(-0.77, 0.44, 0.95);
    group.add(knob);

    // Two Apple Trees on the right (Pip stands BETWEEN them!)
    const makeTree = (x: number, z: number) => {
      const trunk = new THREE.Mesh(
        new THREE.CylinderGeometry(0.14, 0.18, 1.0, 14),
        new THREE.MeshStandardMaterial({ color: 0x92400e, roughness: 0.8 })
      );
      trunk.position.set(x, 0.5, z);
      trunk.castShadow = true;
      group.add(trunk);

      const canopy = new THREE.Mesh(
        new THREE.SphereGeometry(0.68, 20, 20),
        new THREE.MeshStandardMaterial({ color: 0x16a34a, roughness: 0.65 })
      );
      canopy.position.set(x, 1.35, z);
      canopy.castShadow = true;
      group.add(canopy);

      // Cute apples
      [
        [0.35, 1.4, 0.45],
        [-0.38, 1.25, 0.42],
        [0.15, 1.65, -0.4],
      ].forEach(([ax, ay, az]) => {
        const apple = new THREE.Mesh(
          new THREE.SphereGeometry(0.09, 12, 12),
          new THREE.MeshStandardMaterial({ color: 0xef4444, roughness: 0.3 })
        );
        apple.position.set(x + ax, ay, z + az);
        group.add(apple);
      });
    };

    makeTree(2.05, -1.15);
    makeTree(2.05, 1.25);

    return { group };
  }

  if (worldId === 'playground') {
    // 1. Magic Open Box (Left) for INTO & OUT OF
    const magicBox = makeGlassBox(1.3, 0.95, 1.3, 0x0284c7, 0.25);
    magicBox.position.set(-2.15, 0.49, 0.65);
    group.add(magicBox);
    const magicBase = makeSurfacePlate(1.3, 0.1, 1.3, 0x38bdf8, 0x0284c7);
    magicBase.position.set(-2.15, 0.06, 0.65);
    group.add(magicBase);

    // 2. Rainbow Hurdle Fence (Center) for OVER
    const rainbowColors = [0xef4444, 0xf59e0b, 0x10b981, 0x3b82f6];
    rainbowColors.forEach((col, i) => {
      const bar = new THREE.Mesh(
        new THREE.BoxGeometry(1.5, 0.14, 0.16),
        new THREE.MeshStandardMaterial({ color: col, roughness: 0.35 })
      );
      bar.position.set(0.25, 0.25 + i * 0.22, 0.85);
      bar.rotation.y = Math.PI / 4;
      bar.castShadow = true;
      group.add(bar);
    });

    // 3. Striped Playground Tunnel (Back Right) for THROUGH
    const tunnel = new THREE.Mesh(
      new THREE.CylinderGeometry(0.75, 0.75, 2.2, 28, 1, true),
      new THREE.MeshPhysicalMaterial({
        color: 0x10b981,
        transparent: true,
        opacity: 0.34,
        side: THREE.DoubleSide,
        depthWrite: false,
      })
    );
    tunnel.rotation.z = Math.PI / 2;
    tunnel.position.set(1.55, 0.78, -1.25);
    group.add(tunnel);

    [0.5, 1.55, 2.6].forEach((x, idx) => {
      const ring = new THREE.Mesh(
        new THREE.TorusGeometry(0.77, 0.06, 14, 36),
        new THREE.MeshStandardMaterial({
          color: idx === 1 ? 0xfbbf24 : 0x059669,
          roughness: 0.35,
        })
      );
      ring.rotation.y = Math.PI / 2;
      ring.position.set(x, 0.78, -1.25);
      group.add(ring);
    });

    return { group };
  }

  // World 4: Duck Park (Green Hill + Steps + Yellow Slide + Duck Pond)
  // Green Hill Platform
  const hill = new THREE.Mesh(
    new THREE.CylinderGeometry(0.85, 1.35, 1.48, 24),
    new THREE.MeshStandardMaterial({ color: 0x4ade80, roughness: 0.75 })
  );
  hill.position.set(-1.45, 0.74, 0);
  hill.castShadow = true;
  hill.receiveShadow = true;
  group.add(hill);

  // Wooden Steps going UP (Left side of hill)
  [0, 1, 2, 3].forEach((s) => {
    const step = makeSurfacePlate(0.45, 0.16, 0.75, 0xfbbf24, 0xd97706);
    step.position.set(-2.75 + s * 0.36, 0.14 + s * 0.38, 0.52 - s * 0.15);
    group.add(step);
  });

  // Yellow Slide going DOWN (Right side of hill)
  const slide = new THREE.Mesh(
    new THREE.BoxGeometry(1.95, 0.12, 0.72),
    new THREE.MeshStandardMaterial({ color: 0xfacc15, roughness: 0.25 })
  );
  slide.position.set(-0.32, 0.85, 0.32);
  slide.rotation.z = -0.68;
  slide.rotation.y = -0.32;
  slide.castShadow = true;
  group.add(slide);

  // Sparkly Blue Duck Pond (Right side) for AROUND
  const pond = new THREE.Mesh(
    new THREE.CylinderGeometry(1.15, 1.2, 0.12, 36),
    new THREE.MeshStandardMaterial({
      color: 0x38bdf8,
      emissive: 0x0284c7,
      emissiveIntensity: 0.15,
      roughness: 0.15,
    })
  );
  pond.position.set(2.05, 0.06, 0.05);
  group.add(pond);

  // Cute Floating Yellow Rubber Duck in center of pond!
  const duck = new THREE.Group();
  duck.position.set(2.05, 0.22, 0.05);
  const duckBody = new THREE.Mesh(
    new THREE.SphereGeometry(0.22, 20, 20),
    new THREE.MeshStandardMaterial({ color: 0xfde047, roughness: 0.3 })
  );
  duckBody.scale.set(1.15, 0.85, 1.0);
  const duckHead = new THREE.Mesh(
    new THREE.SphereGeometry(0.14, 18, 18),
    new THREE.MeshStandardMaterial({ color: 0xfde047, roughness: 0.3 })
  );
  duckHead.position.set(0.14, 0.2, 0);
  const beak = new THREE.Mesh(
    new THREE.ConeGeometry(0.06, 0.12, 12),
    new THREE.MeshStandardMaterial({ color: 0xf97316 })
  );
  beak.rotation.z = -Math.PI / 2;
  beak.position.set(0.28, 0.19, 0);
  duck.add(duckBody, duckHead, beak);
  group.add(duck);

  return {
    group,
    update: (t) => {
      duck.position.y = 0.22 + Math.sin(t * 2.5) * 0.04;
      duck.rotation.y = Math.sin(t * 0.7) * 0.5;
    },
  };
}
