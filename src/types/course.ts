export type AccentColor =
  | 'cobalt'
  | 'coral'
  | 'emerald'
  | 'amber'
  | 'violet'
  | 'rose';

export type ScenePresetId =
  | 'hero-trio'
  // Module 1: Big Three
  | 'm1-trio-overview'
  | 'm1-in-container'
  | 'm1-on-surface'
  | 'm1-at-point'
  | 'm1-corner-in'
  | 'm1-corner-on'
  | 'm1-corner-at'
  | 'm1-transport-car'
  | 'm1-transport-bus'
  | 'm1-hospital-in'
  | 'm1-hospital-at'
  | 'm1-media-on'
  | 'm1-media-in'
  | 'm1-state-at'
  // Module 2: Motion & Paths
  | 'm2-into'
  | 'm2-out-of'
  | 'm2-onto'
  | 'm2-off'
  | 'm2-through'
  | 'm2-across'
  | 'm2-along'
  | 'm2-past'
  | 'm2-to'
  | 'm2-toward'
  | 'm2-over'
  | 'm2-above'
  | 'm2-under'
  | 'm2-below'
  // Module 3: Time & Timelines
  | 'm3-time-trio'
  | 'm3-zero-time'
  | 'm3-for'
  | 'm3-since'
  | 'm3-during'
  | 'm3-by'
  | 'm3-until'
  | 'm3-within'
  | 'm3-in-vs-after'
  // Module 4: Nuance & Pairs
  | 'm4-to-transfer'
  | 'm4-for-benefit'
  | 'm4-of-material'
  | 'm4-from-transform'
  | 'm4-with-tool'
  | 'm4-by-agent'
  | 'm4-between'
  | 'm4-among'
  | 'm4-about-orbit'
  | 'm4-on-focus'
  | 'm4-like-mirror'
  | 'm4-as-role'
  // Module 5: Chunks & Ghost Prepositions
  | 'm5-verb-bonds'
  | 'm5-adj-bonds'
  | 'm5-ghost-reject'
  | 'm5-missing-circuit'
  // Module 6: Particle Logic
  | 'm6-up-complete'
  | 'm6-down-reduce'
  | 'm6-out-exhaust'
  | 'm6-in-absorb'
  | 'm6-off-detach'
  | 'm6-on-continue'
  | 'm6-over-through';

export interface SceneCaption {
  badge: string;
  title: string;
  subtitle: string;
  accent: AccentColor;
}

export interface MinimalPairOption {
  id: string;
  preposition: string;
  sentence: string;
  highlight: string;
  meaning: string;
  sceneId: ScenePresetId;
  sceneCaption: SceneCaption;
}

export interface MinimalPairGroup {
  id: string;
  title: string;
  contextNote: string;
  options: MinimalPairOption[];
}

export interface MetaphorStep {
  domain: 'Physical Space' | 'Time / Media' | 'Abstract / Idiomatic';
  example: string;
  explanation: string;
}

export interface CommonTrap {
  wrong: string;
  right: string;
  why: string;
  tag: string;
}

export interface ChunkRow {
  anchor: string;
  prep: string;
  example: string;
  note: string;
}

export type ExerciseKind = 'visual-scene' | 'minimal-pair' | 'error-fix' | 'sentence-complete';

export interface ExerciseItem {
  id: string;
  kind: ExerciseKind;
  prompt: string;
  sentence?: string;
  sceneId?: ScenePresetId;
  sceneCaption?: SceneCaption;
  options: string[];
  correctIndex: number;
  explanation: string;
  focusTag: string;
}

export interface Lesson {
  id: string;
  moduleId: string;
  number: string;
  title: string;
  subtitle: string;
  durationMin: number;
  targetPrepositions: string[];
  defaultSceneId: ScenePresetId;
  defaultSceneCaption: SceneCaption;
  mentalModel: {
    headline: string;
    summary: string;
    keyTakeaways: string[];
    metaphorLadder?: MetaphorStep[];
  };
  minimalPairs: MinimalPairGroup[];
  chunks?: {
    title: string;
    description: string;
    rows: ChunkRow[];
  };
  commonTraps: CommonTrap[];
  exercises: ExerciseItem[];
}

export interface CourseModule {
  id: string;
  number: number;
  title: string;
  tagline: string;
  description: string;
  accent: AccentColor;
  heroSceneId: ScenePresetId;
  corePrepositions: string[];
  lessons: Lesson[];
}

export interface SandboxConcept {
  id: string;
  label: string;
  category: 'Space' | 'Motion' | 'Time' | 'Nuance' | 'Chunks' | 'Particles';
  schemaTag: string;
  oneLiner: string;
  examples: string[];
  sceneId: ScenePresetId;
  caption: SceneCaption;
  accent: AccentColor;
  relatedLessonId: string;
}

export interface LearnerProgress {
  completedLessonIds: string[];
  exerciseResults: Record<
    string,
    {
      correct: boolean;
      attempts: number;
      lastAnsweredAt: number;
      srsLevel?: number;
      nextReviewAt?: number;
    }
  >;
  streak: number;
  lastVisitedLessonId?: string;
}
