import { CourseModule, ExerciseItem, Lesson, SandboxConcept } from '../types/course';
import { module1 } from './module1';
import { module2 } from './module2';
import { module3 } from './module3';
import { module4 } from './module4';
import { module5 } from './module5';
import { module6 } from './module6';

export const COURSE_MODULES: CourseModule[] = [
  module1,
  module2,
  module3,
  module4,
  module5,
  module6,
];

export const ALL_LESSONS: Lesson[] = COURSE_MODULES.flatMap((m) => m.lessons);

export function getLessonById(lessonId: string): Lesson | undefined {
  return ALL_LESSONS.find((l) => l.id === lessonId);
}

export function getModuleById(moduleId: string): CourseModule | undefined {
  return COURSE_MODULES.find((m) => m.id === moduleId);
}

export interface PracticeEntry {
  exercise: ExerciseItem;
  lessonId: string;
  lessonNumber: string;
  lessonTitle: string;
  moduleId: string;
  moduleTitle: string;
}

export const ALL_PRACTICE_ENTRIES: PracticeEntry[] = COURSE_MODULES.flatMap((mod) =>
  mod.lessons.flatMap((lesson) =>
    lesson.exercises.map((exercise) => ({
      exercise,
      lessonId: lesson.id,
      lessonNumber: lesson.number,
      lessonTitle: lesson.title,
      moduleId: mod.id,
      moduleTitle: mod.title,
    }))
  )
);

export const SANDBOX_CONCEPTS: SandboxConcept[] = [
  // Space
  {
    id: 'sb-in',
    label: 'IN',
    category: 'Space',
    schemaTag: '3D Container / Volume',
    oneLiner: 'Enclosed inside a boundary, room, vehicle cabin, text artifact, or surrounding state.',
    examples: ['in the corner (of a room)', 'in a taxi', 'in an email', 'in debt / in demand'],
    sceneId: 'm1-in-container',
    caption: {
      badge: 'IN · 3D Volume',
      title: 'Container / Enclosure Schema',
      subtitle: 'Surrounded on multiple sides by physical walls or conceptual boundaries.',
      accent: 'cobalt',
    },
    accent: 'cobalt',
    relatedLessonId: 'm1-l1',
  },
  {
    id: 'sb-on',
    label: 'ON',
    category: 'Space',
    schemaTag: '2D Surface / 1D Line',
    oneLiner: 'Direct contact with a surface, walkable transit deck, coastline, digital screen, or active mode.',
    examples: ['on the corner (of a street)', 'on the train', 'on Zoom / on LinkedIn', 'on strike / on track'],
    sceneId: 'm1-on-surface',
    caption: {
      badge: 'ON · 2D Surface',
      title: 'Contact / Support / Platform Schema',
      subtitle: 'Resting on a plane, aligned along a line, or active on a channel.',
      accent: 'coral',
    },
    accent: 'coral',
    relatedLessonId: 'm1-l1',
  },
  {
    id: 'sb-at',
    label: 'AT',
    category: 'Space',
    schemaTag: '0D Point / Coordinate',
    oneLiner: 'Pinpoints a map coordinate, functional workstation, clock time, or sharp tension threshold.',
    examples: ['at the desk', 'at the hospital (visitor)', 'at 7:30 p.m.', 'at risk / at ease'],
    sceneId: 'm1-at-point',
    caption: {
      badge: 'AT · 0D Point',
      title: 'Pinpoint / Target / Threshold Schema',
      subtitle: 'Zoomed out to a single coordinate or functional point of contact.',
      accent: 'emerald',
    },
    accent: 'emerald',
    relatedLessonId: 'm1-l1',
  },
  {
    id: 'sb-bus-vs-car',
    label: 'ON a bus vs. IN a car',
    category: 'Space',
    schemaTag: 'Walkable Deck vs. Cabin',
    oneLiner: 'Walkable public transit floors act as platforms (ON); tight seated cabins act as containers (IN).',
    examples: ['on the subway / plane / ferry', 'in a car / taxi / van', 'get off the bus vs. get out of the car'],
    sceneId: 'm1-transport-bus',
    caption: {
      badge: 'ON · Transit Deck',
      title: 'Walkable Platform Geometry',
      subtitle: 'If you can stand up and walk the aisle, English treats it as a deck (ON).',
      accent: 'coral',
    },
    accent: 'coral',
    relatedLessonId: 'm1-l2',
  },
  // Motion
  {
    id: 'sb-into',
    label: 'INTO',
    category: 'Motion',
    schemaTag: 'Dynamic Volume Entry',
    oneLiner: 'Crossing a boundary from outside to inside—or transforming into a new state.',
    examples: ['walk into the room', 'turn into a habit', 'talk someone into a deal'],
    sceneId: 'm2-into',
    caption: {
      badge: 'INTO · Boundary Crossing',
      title: 'Outside → Inside Transition',
      subtitle: 'Dynamic entry piercing a 3D wall or state boundary.',
      accent: 'cobalt',
    },
    accent: 'cobalt',
    relatedLessonId: 'm2-l1',
  },
  {
    id: 'sb-onto',
    label: 'ONTO',
    category: 'Motion',
    schemaTag: 'Dynamic Surface Landing',
    oneLiner: 'Moving through space to land cleanly onto an open surface or platform.',
    examples: ['step onto the stage', 'upload onto the server', 'hop onto the bike'],
    sceneId: 'm2-onto',
    caption: {
      badge: 'ONTO · Surface Landing',
      title: 'Dynamic Arc → Surface Contact',
      subtitle: 'Motion terminating on top of an open 2D plane.',
      accent: 'coral',
    },
    accent: 'coral',
    relatedLessonId: 'm2-l1',
  },
  {
    id: 'sb-through',
    label: 'THROUGH',
    category: 'Motion',
    schemaTag: '3D Tunnel Traversal',
    oneLiner: 'Passing inside and out the other side of a 3D medium, tunnel, crowd, or tough experience.',
    examples: ['through the tunnel', 'through the forest', 'go through a rough patch'],
    sceneId: 'm2-through',
    caption: {
      badge: 'THROUGH · 3D Medium',
      title: 'Piercing a 3D Tunnel / Crowd',
      subtitle: 'Surrounded on all sides from entry to exit.',
      accent: 'cobalt',
    },
    accent: 'cobalt',
    relatedLessonId: 'm2-l2',
  },
  {
    id: 'sb-across',
    label: 'ACROSS',
    category: 'Motion',
    schemaTag: '2D Plane Crossing',
    oneLiner: 'Moving from one side of a flat 2D surface to the opposite side.',
    examples: ['across the bridge', 'across the plaza', 'get an idea across'],
    sceneId: 'm2-across',
    caption: {
      badge: 'ACROSS · 2D Plane',
      title: 'Side A → Side B over Flat Space',
      subtitle: 'Open horizontal crossing without surrounding walls.',
      accent: 'coral',
    },
    accent: 'coral',
    relatedLessonId: 'm2-l2',
  },
  {
    id: 'sb-along',
    label: 'ALONG',
    category: 'Motion',
    schemaTag: '1D Linear Path',
    oneLiner: 'Moving parallel beside a road, river, coast, or corridor.',
    examples: ['jog along the canal', 'shops along the avenue', 'get along with coworkers'],
    sceneId: 'm2-along',
    caption: {
      badge: 'ALONG · 1D Parallel',
      title: 'Following a Linear Edge',
      subtitle: 'Tracing a 1D axis without crossing to the opposite side.',
      accent: 'amber',
    },
    accent: 'amber',
    relatedLessonId: 'm2-l2',
  },
  {
    id: 'sb-over',
    label: 'OVER vs. ABOVE',
    category: 'Motion',
    schemaTag: 'Dynamic Arc vs. Static Scale',
    oneLiner: 'OVER arches across, covers, or exerts control; ABOVE only marks higher vertical level.',
    examples: ['jump over the barrier', 'authority over the team', 'above sea level'],
    sceneId: 'm2-over',
    caption: {
      badge: 'OVER · Arc / Cover',
      title: 'Dynamic Crossing or Covering',
      subtitle: 'Curves over an obstacle—unlike static height-only ABOVE.',
      accent: 'coral',
    },
    accent: 'coral',
    relatedLessonId: 'm2-l3',
  },
  // Time
  {
    id: 'sb-by',
    label: 'BY (Deadline)',
    category: 'Time',
    schemaTag: 'Single Completion Before Wall',
    oneLiner: 'Finish a single action at any point at or before the deadline barrier.',
    examples: ['submit by Friday', 'arrive by 9 a.m.', 'pay the invoice by May 31'],
    sceneId: 'm3-by',
    caption: {
      badge: 'BY · No Later Than',
      title: 'Deadline Barrier',
      subtitle: 'One completion event lands cleanly before the red wall.',
      accent: 'rose',
    },
    accent: 'rose',
    relatedLessonId: 'm3-l3',
  },
  {
    id: 'sb-until',
    label: 'UNTIL (Duration)',
    category: 'Time',
    schemaTag: 'Continuous Beam to Wall',
    oneLiner: 'An ongoing state or activity runs uninterrupted right up to the endpoint and stops.',
    examples: ['stay open until Friday', 'wait until noon', 'work until midnight'],
    sceneId: 'm3-until',
    caption: {
      badge: 'UNTIL · Unbroken Flow',
      title: 'Continuous State Up to Barrier',
      subtitle: 'Activity continues steadily and terminates at the wall.',
      accent: 'amber',
    },
    accent: 'amber',
    relatedLessonId: 'm3-l3',
  },
  {
    id: 'sb-since',
    label: 'SINCE vs. FOR',
    category: 'Time',
    schemaTag: 'Past Anchor → NOW',
    oneLiner: 'SINCE locks onto a past starting milestone reaching NOW; FOR measures a length.',
    examples: ['since 2022', 'for four years', 'during the conference'],
    sceneId: 'm3-since',
    caption: {
      badge: 'SINCE · Anchor Ray',
      title: 'Starting Pillar → NOW',
      subtitle: 'Continuous projection from a specific past milestone into the present.',
      accent: 'emerald',
    },
    accent: 'emerald',
    relatedLessonId: 'm3-l2',
  },
  // Nuance
  {
    id: 'sb-to-for',
    label: 'TO vs. FOR',
    category: 'Nuance',
    schemaTag: 'Recipient vs. Beneficiary',
    oneLiner: 'TO sends an object or kindness directly into B; FOR acts for B’s benefit or purpose.',
    examples: ['good to me (kind) vs. good for me (healthy)', 'send to Sarah vs. send for Sarah'],
    sceneId: 'm4-for-benefit',
    caption: {
      badge: 'FOR · Benefit Halo',
      title: 'Acting on Behalf / Purpose',
      subtitle: 'Creates value, protection, or service around the beneficiary.',
      accent: 'amber',
    },
    accent: 'amber',
    relatedLessonId: 'm4-l1',
  },
  {
    id: 'sb-of-from',
    label: 'OF vs. FROM',
    category: 'Nuance',
    schemaTag: 'Visible Material vs. Transformation',
    oneLiner: 'Made OF keeps the material recognizable; made FROM transforms raw input into something new.',
    examples: ['table made of oak', 'wine made from grapes', 'paper made from wood pulp'],
    sceneId: 'm4-from-transform',
    caption: {
      badge: 'FROM · Prism Transform',
      title: 'Raw Material → New Substance',
      subtitle: 'Underlying source is chemically or physically transformed.',
      accent: 'violet',
    },
    accent: 'violet',
    relatedLessonId: 'm4-l2',
  },
  {
    id: 'sb-between-among',
    label: 'BETWEEN vs. AMONG',
    category: 'Nuance',
    schemaTag: 'Distinct Nodes vs. Crowd',
    oneLiner: 'BETWEEN connects 2, 3, or more clearly distinct entities; AMONG embeds inside a collective mass.',
    examples: ['between Zurich, Milan, and Munich', 'popular among designers'],
    sceneId: 'm4-between',
    caption: {
      badge: 'BETWEEN · Distinct Pillars',
      title: 'Clear Relationships Between Named Items',
      subtitle: 'Works even for 3+ parties when each party is distinct.',
      accent: 'emerald',
    },
    accent: 'emerald',
    relatedLessonId: 'm4-l3',
  },
  // Chunks
  {
    id: 'sb-ghost',
    label: 'Ghost Prepositions (Ø)',
    category: 'Chunks',
    schemaTag: 'Direct Transitive Lock',
    oneLiner: 'Verbs like discuss, marry, enter, emphasize, approach, and reach reject prepositions.',
    examples: ['discuss Ø the plan', 'marry Ø him', 'enter Ø the room', 'emphasize Ø quality'],
    sceneId: 'm5-ghost-reject',
    caption: {
      badge: 'Ø · Deflection Field',
      title: 'Zero-Preposition Direct Lock',
      subtitle: 'Intrusive prepositions bounce straight off transitive verbs.',
      accent: 'rose',
    },
    accent: 'rose',
    relatedLessonId: 'm5-l3',
  },
  {
    id: 'sb-missing',
    label: 'Missing-Prep Circuit',
    category: 'Chunks',
    schemaTag: 'Required Bridge (explain TO)',
    oneLiner: 'Verbs like explain, suggest, listen, and graduate break unless their bridging preposition is present.',
    examples: ['explain it to me', 'suggest a plan to us', 'listen to podcasts', 'consist of'],
    sceneId: 'm5-missing-circuit',
    caption: {
      badge: 'TO · Circuit Bridge',
      title: 'Closing the Required Grammatical Circuit',
      subtitle: 'Insert TO/FOR/OF so the verb connects cleanly to its target.',
      accent: 'emerald',
    },
    accent: 'emerald',
    relatedLessonId: 'm5-l3',
  },
  // Particles
  {
    id: 'sb-up',
    label: 'UP (Particle)',
    category: 'Particles',
    schemaTag: '100% Completion & Rise',
    oneLiner: 'Fills an action to 100% completion, boosts intensity, or brings a topic into view.',
    examples: ['use up', 'wrap up', 'bring up a question', 'show up'],
    sceneId: 'm6-up-complete',
    caption: {
      badge: 'UP · Full Capacity',
      title: 'Filling to the Brim (Completion)',
      subtitle: 'Explains why "eat up" and "wrap up" mean finishing 100%.',
      accent: 'violet',
    },
    accent: 'violet',
    relatedLessonId: 'm6-l1',
  },
  {
    id: 'sb-out',
    label: 'OUT (Particle)',
    category: 'Particles',
    schemaTag: 'Reveal / Exhaust / Distribute',
    oneLiner: 'Pulls hidden answers into daylight, distributes outward, or empties reserves to zero.',
    examples: ['figure out', 'stand out', 'hand out', 'burn out / run out'],
    sceneId: 'm6-out-exhaust',
    caption: {
      badge: 'OUT · Outward Burst',
      title: 'Discovery, Distribution & Exhaustion',
      subtitle: 'Moving from concealed/full inside to exposed/empty outside.',
      accent: 'amber',
    },
    accent: 'amber',
    relatedLessonId: 'm6-l2',
  },
  {
    id: 'sb-off',
    label: 'OFF (Particle)',
    category: 'Particles',
    schemaTag: 'Detach / Cancel / Delay',
    oneLiner: 'Separates cleanly from a surface, schedule, obligation, or power source.',
    examples: ['call off', 'put off', 'take off', 'pay off'],
    sceneId: 'm6-off-detach',
    caption: {
      badge: 'OFF · Separation',
      title: 'Clean Detachment from Base',
      subtitle: 'Canceling plans, delaying dates, or taking flight.',
      accent: 'rose',
    },
    accent: 'rose',
    relatedLessonId: 'm6-l3',
  },
];

export interface ReferenceItem {
  id: string;
  prep: string;
  category: 'Geometry' | 'Motion' | 'Time' | 'Nuance' | 'Chunks' | 'Ghost Ø' | 'Particles';
  rule: string;
  examples: string[];
  contrast?: string;
  lessonId: string;
}

export const QUICK_REFERENCE_ITEMS: ReferenceItem[] = [
  {
    id: 'ref-1',
    prep: 'in / on / at (space)',
    category: 'Geometry',
    rule: '3D container (IN) · 2D surface or 1D line (ON) · 0D coordinate or workstation (AT)',
    examples: ['in the corner (room)', 'on the corner (street)', 'at the desk', 'on the coast'],
    contrast: 'in the tree (canopy) vs. apples on the tree (outer branch)',
    lessonId: 'm1-l1',
  },
  {
    id: 'ref-2',
    prep: 'in a car vs. on a bus',
    category: 'Geometry',
    rule: 'Tight enclosed cabins take IN (exit: OUT OF); walkable transit decks take ON (exit: OFF).',
    examples: ['in a taxi / van', 'on a bus / train / plane / ferry', 'get off the train'],
    contrast: 'arrive IN a city/country vs. arrive AT an airport/station',
    lessonId: 'm1-l2',
  },
  {
    id: 'ref-3',
    prep: 'on Zoom vs. in an email',
    category: 'Geometry',
    rule: 'Live channels, screens, platforms, and active modes take ON; text artifacts and enveloping states take IN.',
    examples: ['on LinkedIn / on the phone / on strike', 'in a PDF / in debt / in demand', 'at risk / at ease'],
    lessonId: 'm1-l3',
  },
  {
    id: 'ref-4',
    prep: 'into / onto / out of / off',
    category: 'Motion',
    rule: 'Dynamic boundary crossing counterparts to static IN and ON.',
    examples: ['walk into the room', 'step onto the stage', 'run out of time', 'get off the hook'],
    contrast: 'driving IN the garage (already inside) vs. driving INTO the garage (entering)',
    lessonId: 'm2-l1',
  },
  {
    id: 'ref-5',
    prep: 'through / across / along / past',
    category: 'Motion',
    rule: '3D medium (THROUGH) · 2D flat plane (ACROSS) · 1D parallel edge (ALONG) · 0D landmark (PAST).',
    examples: ['through the forest/crowd', 'across the plaza/bridge', 'along the river', 'walk past (not passed) the café'],
    lessonId: 'm2-l2',
  },
  {
    id: 'ref-6',
    prep: 'over / above · under / below',
    category: 'Motion',
    rule: 'OVER/UNDER = arcing, covering, control, or burden; ABOVE/BELOW = pure vertical scale or benchmark.',
    examples: ['blanket over the chair', 'under pressure / under review', 'above sea level', 'below expectations'],
    contrast: 'TO reaches the goal vs. TOWARD aims in that direction',
    lessonId: 'm2-l3',
  },
  {
    id: 'ref-7',
    prep: 'at / on / in / Ø (time)',
    category: 'Time',
    rule: 'AT clock point · ON day/date (overrides morning/evening!) · IN month/year · Ø before this/next/last/every.',
    examples: ['at 8:30', 'on Friday morning', 'in October', 'Ø next Tuesday (no prep!)'],
    contrast: 'on time (exact schedule) vs. in time (before deadline expires)',
    lessonId: 'm3-l1',
  },
  {
    id: 'ref-8',
    prep: 'for / since / during / while',
    category: 'Time',
    rule: 'FOR + length · SINCE + past start point to NOW · DURING + noun event · WHILE + subject+verb clause.',
    examples: ['for 3 years', 'since 2022', 'during the keynote', 'while I was presenting'],
    lessonId: 'm3-l2',
  },
  {
    id: 'ref-9',
    prep: 'by vs. until · in vs. after',
    category: 'Time',
    rule: 'BY = single completion no later than deadline; UNTIL = continuous state up to wall. IN = future offset from NOW.',
    examples: ['submit by Friday', 'stay open until Friday', 'within 24 hours', 'starts in 10 minutes'],
    contrast: '2 years ago (from NOW) vs. 2 years before (from another past event)',
    lessonId: 'm3-l3',
  },
  {
    id: 'ref-10',
    prep: 'to vs. for',
    category: 'Nuance',
    rule: 'TO = recipient/transfer/personal motive (+ base verb); FOR = beneficiary/behalf/object function (+ -ing).',
    examples: ['good to me (kind) vs. good for me (healthy)', 'tool for measuring', 'came to learn'],
    contrast: 'shout TO someone (to be heard) vs. shout AT someone (in anger)',
    lessonId: 'm4-l1',
  },
  {
    id: 'ref-11',
    prep: 'of vs. from · with vs. by',
    category: 'Nuance',
    rule: 'Made OF (visible intact material) vs. FROM (transformed); WITH = physical tool, BY = agent or no-article method.',
    examples: ['made of oak vs. made from grapes', 'cut with a knife', 'written by Ada', 'pay by card / travel by train'],
    contrast: 'hear OF (know exists) vs. hear FROM (receive a message)',
    lessonId: 'm4-l2',
  },
  {
    id: 'ref-12',
    prep: 'between / among · about / on · like / as',
    category: 'Nuance',
    rule: 'BETWEEN = distinct named items (even 3+); AMONG = crowd/mass; ON = specialist focus; AS = actual role, LIKE = similarity.',
    examples: ['between Paris, Rome, and Madrid', 'a paper on AI', 'work as a designer vs. work like a CEO'],
    lessonId: 'm4-l3',
  },
  {
    id: 'ref-13',
    prep: 'Verb + Prep Families',
    category: 'Chunks',
    rule: 'ON (rely, depend, insist, focus, congratulate) · FROM (prevent, suffer, recover) · TO + -ing (adapt, object, look forward).',
    examples: ['depend on', 'prevent from -ing', 'look forward to meeting', 'agree with (person) / on (topic) / to (terms)'],
    lessonId: 'm5-l1',
  },
  {
    id: 'ref-14',
    prep: 'Adjective + Prep Patterns',
    category: 'Chunks',
    rule: 'OF (aware, capable, proud) · FOR (responsible, eligible) · TO (married, similar, committed) · AT (good, skilled).',
    examples: ['capable of leading', 'responsible for onboarding', 'married to', 'interested in vs. keen on'],
    contrast: '[Person] familiar WITH [thing] vs. [Thing] familiar TO [person]',
    lessonId: 'm5-l2',
  },
  {
    id: 'ref-15',
    prep: 'Ghost Prepositions (Ø) & Circuit Verbs',
    category: 'Ghost Ø',
    rule: 'Zero prep after discuss, marry, enter (a place), emphasize, approach, reach, attend, lack (verb). Always add TO after explain/suggest!',
    examples: ['discuss Ø the plan (vs. discussion about)', 'lack Ø time (vs. a lack of)', 'explain the rule to me'],
    lessonId: 'm5-l3',
  },
  {
    id: 'ref-16',
    prep: 'up / down / out / in / off / on / over / through',
    category: 'Particles',
    rule: 'UP = 100% completion; DOWN = reduce/record/reject; OUT = reveal/exhaust; IN = absorb/submit; OFF = detach/cancel; THROUGH = endure/complete.',
    examples: ['wrap up / use up', 'cut down on / turn down', 'figure out / hand out vs. hand in', 'call off / put off / follow through'],
    contrast: 'Pronouns split separable phrasal verbs: "wrap it up", never "wrap up it"!',
    lessonId: 'm6-l1',
  },
];
