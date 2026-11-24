import * as THREE from 'three';

export const COLORS = {
  cobalt: 0x3b6cf5,
  coral: 0xe85d3f,
  emerald: 0x0d9488,
  amber: 0xd97706,
  violet: 0x7c3aed,
  rose: 0xe11d48,
  ink: 0x1e2028,
  slate: 0x64748b,
  stone: 0xd6d1c4,
  warmWhite: 0xf4f1ea,
  cream: 0xe9e4d9,
  gold: 0xf59e0b,
};

export interface BuiltScene {
  group: THREE.Group;
  cameraPos: [number, number, number];
  target: [number, number, number];
  update?: (elapsed: number, delta: number) => void;
}

/** Crisp high-DPI pill badge rendered onto a 3D THREE.Sprite */
export function makeLabelSprite(
  text: string,
  options?: {
    bg?: string;
    color?: string;
    border?: string;
    scale?: number;
  }
): THREE.Sprite {
  const bg = options?.bg ?? 'rgba(24, 24, 27, 0.88)';
  const color = options?.color ?? '#FFFFFF';
  const border = options?.border ?? 'rgba(255,255,255,0.18)';
  const scaleFactor = options?.scale ?? 0.55;

  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  const fontSize = 44;
  const paddingX = 30;
  const paddingY = 18;

  if (ctx) {
    ctx.font = `700 ${fontSize}px Inter, -apple-system, BlinkMacSystemFont, sans-serif`;
    const metrics = ctx.measureText(text);
    const width = Math.ceil(metrics.width + paddingX * 2);
    const height = fontSize + paddingY * 2;
    canvas.width = Math.max(128, width);
    canvas.height = Math.max(64, height);

    ctx.font = `700 ${fontSize}px Inter, -apple-system, BlinkMacSystemFont, sans-serif`;
    const r = canvas.height / 2;

    // Rounded pill
    ctx.beginPath();
    ctx.moveTo(r, 2);
    ctx.lineTo(canvas.width - r, 2);
    ctx.quadraticCurveTo(canvas.width - 2, 2, canvas.width - 2, r);
    ctx.quadraticCurveTo(canvas.width - 2, canvas.height - 2, canvas.width - r, canvas.height - 2);
    ctx.lineTo(r, canvas.height - 2);
    ctx.quadraticCurveTo(2, canvas.height - 2, 2, r);
    ctx.quadraticCurveTo(2, 2, r, 2);
    ctx.closePath();

    ctx.fillStyle = bg;
    ctx.fill();
    ctx.lineWidth = 3;
    ctx.strokeStyle = border;
    ctx.stroke();

    ctx.fillStyle = color;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(text, canvas.width / 2, canvas.height / 2 + 2);
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.needsUpdate = true;

  const mat = new THREE.SpriteMaterial({
    map: texture,
    transparent: true,
    depthTest: false,
  });
  const sprite = new THREE.Sprite(mat);
  const aspect = canvas.width / canvas.height;
  sprite.scale.set(aspect * scaleFactor, scaleFactor, 1);
  sprite.renderOrder = 20;
  return sprite;
}

export function makeOrb(
  radius: number,
  color: number,
  emissiveIntensity = 0.25
): THREE.Mesh {
  const geo = new THREE.SphereGeometry(radius, 36, 36);
  const mat = new THREE.MeshStandardMaterial({
    color,
    emissive: color,
    emissiveIntensity,
    roughness: 0.22,
    metalness: 0.12,
  });
  const mesh = new THREE.Mesh(geo, mat);
  mesh.castShadow = true;
  mesh.receiveShadow = true;
  return mesh;
}

export function makeGlassBox(
  w: number,
  h: number,
  d: number,
  color: number,
  opacity = 0.22
): THREE.Group {
  const grp = new THREE.Group();
  const geo = new THREE.BoxGeometry(w, h, d);
  const mat = new THREE.MeshPhysicalMaterial({
    color,
    transparent: true,
    opacity,
    roughness: 0.12,
    metalness: 0.05,
    transmission: 0.2,
    side: THREE.DoubleSide,
    depthWrite: false,
  });
  const box = new THREE.Mesh(geo, mat);
  grp.add(box);

  const edges = new THREE.EdgesGeometry(geo);
  const line = new THREE.LineSegments(
    edges,
    new THREE.LineBasicMaterial({
      color,
      transparent: true,
      opacity: 0.85,
    })
  );
  grp.add(line);
  return grp;
}

export function makeSurfacePlate(
  w: number,
  h: number,
  d: number,
  color = COLORS.warmWhite,
  borderColor?: number
): THREE.Group {
  const grp = new THREE.Group();
  const geo = new THREE.BoxGeometry(w, h, d);
  const mat = new THREE.MeshStandardMaterial({
    color,
    roughness: 0.55,
    metalness: 0.05,
  });
  const mesh = new THREE.Mesh(geo, mat);
  mesh.receiveShadow = true;
  mesh.castShadow = true;
  grp.add(mesh);

  if (borderColor !== undefined) {
    const edges = new THREE.EdgesGeometry(geo);
    const line = new THREE.LineSegments(
      edges,
      new THREE.LineBasicMaterial({ color: borderColor, transparent: true, opacity: 0.65 })
    );
    grp.add(line);
  }
  return grp;
}

export function makePulseRing(
  innerR: number,
  outerR: number,
  color: number
): THREE.Mesh {
  const geo = new THREE.RingGeometry(innerR, outerR, 48);
  const mat = new THREE.MeshBasicMaterial({
    color,
    transparent: true,
    opacity: 0.65,
    side: THREE.DoubleSide,
  });
  const mesh = new THREE.Mesh(geo, mat);
  mesh.rotation.x = -Math.PI / 2;
  return mesh;
}

export function makeCurveTube(
  points: THREE.Vector3[],
  color: number,
  radius = 0.045,
  opacity = 0.7
): { curve: THREE.CatmullRomCurve3; mesh: THREE.Mesh } {
  const curve = new THREE.CatmullRomCurve3(points);
  const geo = new THREE.TubeGeometry(curve, 64, radius, 12, false);
  const mat = new THREE.MeshStandardMaterial({
    color,
    emissive: color,
    emissiveIntensity: 0.2,
    transparent: opacity < 1,
    opacity,
    roughness: 0.3,
  });
  const mesh = new THREE.Mesh(geo, mat);
  return { curve, mesh };
}

export function makeArrowCone(color: number, scale = 1): THREE.Mesh {
  const geo = new THREE.ConeGeometry(0.14 * scale, 0.36 * scale, 20);
  const mat = new THREE.MeshStandardMaterial({
    color,
    emissive: color,
    emissiveIntensity: 0.25,
    roughness: 0.25,
  });
  return new THREE.Mesh(geo, mat);
}

/** Properly dispose every geometry, material, and texture inside a Three.js group */
export function disposeGroup(group: THREE.Object3D): void {
  group.traverse((obj) => {
    const mesh = obj as THREE.Mesh;
    if (mesh.geometry) {
      mesh.geometry.dispose();
    }
    const mat = (mesh as { material?: THREE.Material | THREE.Material[] }).material;
    if (mat) {
      const list = Array.isArray(mat) ? mat : [mat];
      for (const m of list) {
        const textured = m as { map?: THREE.Texture | null };
        if (textured.map) {
          textured.map.dispose();
        }
        m.dispose();
      }
    }
  });
}
