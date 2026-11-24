export type PlacementSceneKind =
  | 'corner'
  | 'hospital'
  | 'transport'
  | 'deadline'
  | 'traversal'
  | 'vertical'
  | 'between-among'
  | 'ghost-circuit';

export interface PlacementHotspot {
  id: string;
  label: string;
  position: [number, number, number];
  orbTarget: [number, number, number];
  radius?: number;
}

export interface PlacementChallenge {
  id: string;
  moduleTag: string;
  lessonId: string;
  sceneKind: PlacementSceneKind;
  instruction: string;
  sentence: string;
  targetHighlight: string;
  correctHotspotId: string;
  explanation: string;
  hotspots: PlacementHotspot[];
}

export const PLACEMENT_CHALLENGES: PlacementChallenge[] = [
  {
    id: 'place-corner-on',
    moduleTag: 'Module 1 · Geometry',
    lessonId: 'm1-l1',
    sceneKind: 'corner',
    instruction: 'Click the exact 3D spot that matches this sentence:',
    sentence: 'A new sourdough bakery just opened on the corner of Oak and 4th.',
    targetHighlight: 'on the corner',
    correctHotspotId: 'street-edge',
    explanation:
      'Exterior street-level corners are open 2D edges (ON the corner). The interior angle between two walls is IN the corner, and the map intersection itself is AT the corner.',
    hotspots: [
      { id: 'room-inside', label: 'A · Interior Wall Angle', position: [-0.72, 0.32, -0.52], orbTarget: [-0.72, 0.56, -0.52] },
      { id: 'street-edge', label: 'B · Outer Street Edge', position: [0.45, 0.25, 0.45], orbTarget: [0.45, 0.58, 0.45] },
      { id: 'intersection-pin', label: 'C · Road Intersection Pin', position: [1.45, 0.22, 1.45], orbTarget: [1.45, 0.8, 1.45] },
    ],
  },
  {
    id: 'place-hospital-at',
    moduleTag: 'Module 1 · Institutions',
    lessonId: 'm1-l2',
    sceneKind: 'hospital',
    instruction: 'Place the orb for the speaker’s role in this sentence:',
    sentence: 'I am at the hospital right now waiting in the parking lot to pick up my sister.',
    targetHighlight: 'at the hospital',
    correctHotspotId: 'outside-pin',
    explanation:
      'As a visitor or driver treating the facility as a map address, use AT the hospital. Being admitted as a patient inside the ward is IN the hospital.',
    hotspots: [
      { id: 'inside-ward', label: 'A · Inside the Ward', position: [-0.55, 0.55, -0.15], orbTarget: [-0.55, 0.82, -0.15] },
      { id: 'outside-pin', label: 'B · Entrance / Address Pin', position: [1.7, 0.25, 0.85], orbTarget: [1.7, 0.85, 0.85] },
      { id: 'on-roof', label: 'C · Top of the Roof', position: [-0.55, 2.08, -0.15], orbTarget: [-0.55, 2.35, -0.15] },
    ],
  },
  {
    id: 'place-transport-bus',
    moduleTag: 'Module 1 · Transport',
    lessonId: 'm1-l2',
    sceneKind: 'transport',
    instruction: 'Click the vehicle or point that matches the preposition ON:',
    sentence: 'I answered three emails on the bus before arriving downtown.',
    targetHighlight: 'on the bus',
    correctHotspotId: 'bus-deck',
    explanation:
      'Large transit vehicles have an open walkable aisle/deck (ON a bus/train/plane). Tight enclosed cabins take IN (in a taxi), and the waiting curb takes AT (at the bus stop).',
    hotspots: [
      { id: 'taxi-cabin', label: 'A · Low Enclosed Cabin', position: [-1.95, 0.92, 0], orbTarget: [-1.95, 0.95, 0] },
      { id: 'bus-deck', label: 'B · Walkable Transit Deck', position: [0.45, 0.78, 0], orbTarget: [0.45, 1.05, 0] },
      { id: 'curb-stop', label: 'C · Curbside Stop Pin', position: [2.55, 0.24, 0.85], orbTarget: [2.55, 0.78, 0.85] },
    ],
  },
  {
    id: 'place-motion-through',
    moduleTag: 'Module 2 · Traversal',
    lessonId: 'm2-l2',
    sceneKind: 'traversal',
    instruction: 'Click the 3D path matching THROUGH:',
    sentence: 'We pushed our way through the crowded underground passage.',
    targetHighlight: 'through',
    correctHotspotId: 'tunnel-path',
    explanation:
      'THROUGH enters and exits a 3D surrounding medium or tunnel. Moving over an open flat plane is ACROSS, and moving parallel beside a border is ALONG.',
    hotspots: [
      { id: 'tunnel-path', label: 'A · Inside 3D Tunnel', position: [0, 1.1, -1.35], orbTarget: [0, 1.1, -1.35] },
      { id: 'bridge-plane', label: 'B · Flat 2D Bridge', position: [0, 0.4, 0.15], orbTarget: [0, 0.65, 0.15] },
      { id: 'parallel-rail', label: 'C · Parallel 1D Edge', position: [0, 0.32, 1.55], orbTarget: [0, 0.58, 1.55] },
    ],
  },
  {
    id: 'place-time-by',
    moduleTag: 'Module 3 · Deadlines',
    lessonId: 'm3-l3',
    sceneKind: 'deadline',
    instruction: 'Click the timeline zone representing BY Friday:',
    sentence: 'Please upload your signed tax form by Friday at 5 p.m.',
    targetHighlight: 'by Friday',
    correctHotspotId: 'before-wall-single',
    explanation:
      'BY means a single completion action happens at any point before the deadline wall. Continuous activity stretching all the way to the wall is UNTIL; beyond the wall is AFTER.',
    hotspots: [
      { id: 'before-wall-single', label: 'A · Single Point Before Wall', position: [-0.25, 0.95, 0.75], orbTarget: [-0.25, 1.0, 0.75] },
      { id: 'continuous-until', label: 'B · Continuous Beam Up To Wall', position: [-0.6, 0.85, -0.75], orbTarget: [-0.6, 0.95, -0.75] },
      { id: 'past-wall', label: 'C · Past the Deadline Wall', position: [2.35, 0.85, 0], orbTarget: [2.35, 0.95, 0] },
    ],
  },
  {
    id: 'place-vertical-under',
    moduleTag: 'Module 2 · Verticality',
    lessonId: 'm2-l3',
    sceneKind: 'vertical',
    instruction: 'Click the vertical zone that corresponds to UNDER (as in "under pressure" / "under a roof"):',
    sentence: 'The bridge is under repair, and engineers are working under heavy pressure.',
    targetHighlight: 'under',
    correctHotspotId: 'beneath-canopy',
    explanation:
      'UNDER sits directly beneath a covering canopy or weight. BELOW measures a position lower than a flat numerical scale/benchmark; ABOVE floats higher without crossing.',
    hotspots: [
      { id: 'above-sky', label: 'A · High Static Scale', position: [-1.4, 2.25, 0], orbTarget: [-1.4, 2.35, 0] },
      { id: 'beneath-canopy', label: 'B · Directly Beneath Canopy', position: [-1.4, 0.58, 0], orbTarget: [-1.4, 0.68, 0] },
      { id: 'below-line', label: 'C · Lower Than 0° Benchmark', position: [1.55, 0.55, 0], orbTarget: [1.55, 0.68, 0] },
    ],
  },
  {
    id: 'place-between',
    moduleTag: 'Module 4 · Nuance',
    lessonId: 'm4-l3',
    sceneKind: 'between-among',
    instruction: 'Click the spatial zone that matches BETWEEN (even with three cities!):',
    sentence: 'A new night train runs between Zurich, Milan, and Munich.',
    targetHighlight: 'between',
    correctHotspotId: 'three-pillars',
    explanation:
      'BETWEEN connects individually distinct, named entities—even 3 or more! AMONG surrounds you inside a large undifferentiated crowd.',
    hotspots: [
      { id: 'three-pillars', label: 'A · Center of 3 Named Pillars', position: [-1.55, 0.8, 0], orbTarget: [-1.55, 1.05, 0] },
      { id: 'dense-crowd', label: 'B · Inside Dense Crowd', position: [1.65, 0.8, 0], orbTarget: [1.65, 1.05, 0] },
    ],
  },
  {
    id: 'place-ghost',
    moduleTag: 'Module 5 · Ghost Ø',
    lessonId: 'm5-l3',
    sceneKind: 'ghost-circuit',
    instruction: 'Click the grammatically valid 3D connection for DISCUSS:',
    sentence: 'Let us discuss ___ the pricing model before Friday.',
    targetHighlight: 'discuss Ø',
    correctHotspotId: 'direct-lock',
    explanation:
      'DISCUSS is a direct transitive verb—it locks straight onto its object with zero preposition (Ø). Adding "about" creates a Ghost Preposition error!',
    hotspots: [
      { id: 'direct-lock', label: 'A · Direct Lock (Ø No Prep)', position: [-1.45, 1.05, 0], orbTarget: [-1.45, 1.35, 0] },
      { id: 'ghost-about', label: 'B · Insert "ABOUT"', position: [0.35, 1.05, 0], orbTarget: [0.35, 1.35, 0] },
      { id: 'ghost-on', label: 'C · Insert "ON"', position: [1.95, 1.05, 0], orbTarget: [1.95, 1.35, 0] },
    ],
  },
];
