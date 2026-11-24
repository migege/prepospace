import React, { useState } from 'react';
import {
  ArrowRight,
  CheckCircle2,
  Clock,
  Sparkles,
  Box,
  PlayCircle,
  Dumbbell,
} from 'lucide-react';
import { COURSE_MODULES, getLessonById } from '../data/courseData';
import { ACCENT_STYLES } from '../data/theme';
import { LearnerProgress, SceneCaption, ScenePresetId } from '../types/course';
import { ThreeStage } from './ThreeStage';

interface CourseAtlasProps {
  progress: LearnerProgress;
  overallPercent: number;
  completedCount: number;
  totalLessons: number;
  correctExercises: number;
  totalExercises: number;
  onOpenLesson: (lessonId: string) => void;
  onOpenSandbox: () => void;
  onOpenPractice: () => void;
  onOpenKids: () => void;
}

const HERO_DEMOS: {
  id: string;
  label: string;
  sceneId: ScenePresetId;
  caption: SceneCaption;
}[] = [
  {
    id: 'trio',
    label: 'IN · ON · AT',
    sceneId: 'hero-trio',
    caption: {
      badge: '3D / 2D / 0D',
      title: 'The Core Spatial Model',
      subtitle: 'Container (IN) · Surface (ON) · Coordinate (AT) — every abstract meaning begins here.',
      accent: 'cobalt',
    },
  },
  {
    id: 'through',
    label: 'THROUGH',
    sceneId: 'm2-through',
    caption: {
      badge: 'Motion · 3D',
      title: 'Passing THROUGH a 3D Medium',
      subtitle: 'Surrounded on all sides—unlike flat 2D ACROSS.',
      accent: 'cobalt',
    },
  },
  {
    id: 'by',
    label: 'BY vs. UNTIL',
    sceneId: 'm3-by',
    caption: {
      badge: 'Timeline',
      title: 'BY = Finish Before the Wall',
      subtitle: 'One completion event before the deadline (vs. continuous UNTIL).',
      accent: 'rose',
    },
  },
  {
    id: 'ghost',
    label: 'Ghost Ø',
    sceneId: 'm5-ghost-reject',
    caption: {
      badge: 'Zero-Prep',
      title: 'discuss Ø the plan (Not "discuss about"!)',
      subtitle: 'Transitive verbs deflect intrusive ghost prepositions.',
      accent: 'rose',
    },
  },
  {
    id: 'up',
    label: 'UP (100%)',
    sceneId: 'm6-up-complete',
    caption: {
      badge: 'Particle',
      title: 'UP = Fill to 100% Completion',
      subtitle: 'Why "use up" and "wrap up" mean finishing completely.',
      accent: 'violet',
    },
  },
];

export const CourseAtlas: React.FC<CourseAtlasProps> = ({
  progress,
  overallPercent,
  completedCount,
  totalLessons,
  correctExercises,
  totalExercises,
  onOpenLesson,
  onOpenSandbox,
  onOpenPractice,
  onOpenKids,
}) => {
  const [heroIdx, setHeroIdx] = useState(0);
  const activeHero = HERO_DEMOS[heroIdx];

  const resumeLesson =
    (progress.lastVisitedLessonId && getLessonById(progress.lastVisitedLessonId)) ||
    COURSE_MODULES[0].lessons[0];

  const hasStarted = completedCount > 0 || Boolean(progress.lastVisitedLessonId);

  return (
    <div className="mx-auto max-w-7xl px-4 pb-20 pt-8 sm:px-6 lg:pt-10">
      {/* Editorial Hero Split */}
      <section className="grid items-center gap-8 lg:grid-cols-12">
        <div className="lg:col-span-5">
          <div className="inline-flex items-center gap-2 rounded-full border border-zinc-900/10 bg-white px-3 py-1 text-xs font-medium text-zinc-700 shadow-2xs">
            <Sparkles className="h-3.5 w-3.5 text-[#3B6CF5]" />
            <span>Intermediate B1–B2 · 6 Modules · 18 Interactive 3D Lessons</span>
          </div>

          <h1 className="mt-4 font-display text-4xl font-semibold leading-[1.1] tracking-tight text-zinc-950 sm:text-5xl">
            Stop guessing English prepositions.{' '}
            <span className="text-[#3B6CF5]">See them in 3D.</span>
          </h1>

          <p className="mt-4 text-base leading-relaxed text-zinc-600">
            Rote translation lists fail because English prepositions encode{' '}
            <strong className="font-semibold text-zinc-900">geometry, motion, and perspective</strong>.
            Explore 50+ interactive Three.js dioramas, toggle live minimal pairs, defeat ghost
            prepositions (<code className="rounded bg-rose-500/10 px-1 py-0.5 text-xs text-rose-700">discuss ✕about</code>), and decode phrasal verb particles with visual intuition.
          </p>

          {/* Primary Actions */}
          <div className="mt-6 flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={() => onOpenLesson(resumeLesson.id)}
              className="inline-flex items-center gap-2 rounded-xl bg-zinc-950 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-zinc-800"
            >
              <PlayCircle className="h-4 w-4 text-[#60A5FA]" />
              <span>{hasStarted ? `Resume ${resumeLesson.number}` : 'Start Lesson 1.1'}</span>
              <ArrowRight className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={onOpenSandbox}
              className="inline-flex items-center gap-2 rounded-xl border border-zinc-900/15 bg-white px-4 py-3 text-sm font-semibold text-zinc-800 transition hover:bg-zinc-50"
            >
              <Box className="h-4 w-4 text-[#E85D3F]" />
              <span>3D Sandbox</span>
            </button>
            <button
              type="button"
              onClick={onOpenKids}
              className="inline-flex items-center gap-2 rounded-xl border border-amber-500/35 bg-amber-300/35 px-4 py-3 text-sm font-semibold text-amber-950 transition hover:bg-amber-300/60"
            >
              <span>🐶</span>
              <span>Kids Edition (iPad)</span>
            </button>
          </div>

          {/* Progress Summary Strip */}
          <div className="mt-7 grid grid-cols-3 gap-3 rounded-2xl border border-zinc-900/10 bg-white/80 p-3.5 shadow-2xs">
            <div>
              <div className="font-mono text-lg font-bold text-zinc-900">
                {completedCount}/{totalLessons}
              </div>
              <div className="text-[11px] font-medium text-zinc-500">Lessons Done</div>
            </div>
            <div className="border-l border-zinc-900/10 pl-3">
              <div className="font-mono text-lg font-bold text-zinc-900">
                {correctExercises}/{totalExercises}
              </div>
              <div className="text-[11px] font-medium text-zinc-500">Drills Mastered</div>
            </div>
            <div className="border-l border-zinc-900/10 pl-3">
              <div className="font-mono text-lg font-bold text-[#234DC7]">{overallPercent}%</div>
              <div className="text-[11px] font-medium text-zinc-500">Course Mastery</div>
            </div>
          </div>
        </div>

        {/* Interactive Hero 3D Stage */}
        <div className="lg:col-span-7">
          <ThreeStage
            sceneId={activeHero.sceneId}
            caption={activeHero.caption}
            heightClass="h-[360px] sm:h-[420px]"
          />
          <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
            <span className="text-xs font-medium text-zinc-500">
              Preview live 3D schemas:
            </span>
            <div className="flex flex-wrap gap-1.5">
              {HERO_DEMOS.map((demo, idx) => (
                <button
                  key={demo.id}
                  type="button"
                  onClick={() => setHeroIdx(idx)}
                  className={`rounded-lg px-2.5 py-1 font-mono text-xs font-semibold transition ${
                    idx === heroIdx
                      ? 'bg-zinc-900 text-white shadow-xs'
                      : 'border border-zinc-900/10 bg-white text-zinc-600 hover:border-zinc-900/25 hover:text-zinc-950'
                  }`}
                >
                  {demo.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Curriculum Atlas */}
      <section className="mt-14">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="font-mono text-xs font-semibold uppercase tracking-wider text-zinc-500">
              Full B1–B2 Curriculum
            </p>
            <h2 className="mt-1 font-display text-3xl font-semibold text-zinc-950">
              Six Modules from Geometry to Fluency
            </h2>
          </div>
          <button
            type="button"
            onClick={onOpenPractice}
            className="inline-flex items-center gap-2 rounded-xl border border-zinc-900/15 bg-white px-4 py-2 text-xs font-semibold text-zinc-800 transition hover:bg-zinc-50"
          >
            <Dumbbell className="h-4 w-4 text-[#0D9488]" />
            <span>Open Mixed Practice Lab ({totalExercises} drills)</span>
          </button>
        </div>

        <div className="mt-6 grid gap-6 md:grid-cols-2">
          {COURSE_MODULES.map((mod) => {
            const style = ACCENT_STYLES[mod.accent];
            const modCompleted = mod.lessons.filter((l) =>
              progress.completedLessonIds.includes(l.id)
            ).length;
            const modPct = Math.round((modCompleted / mod.lessons.length) * 100);

            return (
              <div
                key={mod.id}
                className="flex flex-col justify-between rounded-2xl border border-zinc-900/10 bg-white p-5 shadow-2xs transition hover:border-zinc-900/20 hover:shadow-md"
              >
                <div>
                  {/* Module Header */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-2.5">
                      <span
                        className={`inline-flex h-8 w-8 items-center justify-center rounded-xl font-mono text-sm font-bold ${style.pill}`}
                      >
                        0{mod.number}
                      </span>
                      <div>
                        <div className="text-[11px] font-semibold uppercase tracking-wide text-zinc-500">
                          {mod.tagline}
                        </div>
                        <h3 className="font-display text-xl font-semibold text-zinc-950">
                          {mod.title}
                        </h3>
                      </div>
                    </div>
                    <span className="rounded-full bg-zinc-100 px-2.5 py-1 font-mono text-[11px] font-semibold text-zinc-600">
                      {modCompleted}/{mod.lessons.length}
                    </span>
                  </div>

                  <p className="mt-3 text-sm leading-relaxed text-zinc-600">{mod.description}</p>

                  {/* Preposition Chips */}
                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {mod.corePrepositions.slice(0, 8).map((prep) => (
                      <span
                        key={prep}
                        className={`rounded-md border px-2 py-0.5 font-mono text-[11px] font-semibold ${style.badge}`}
                      >
                        {prep}
                      </span>
                    ))}
                    {mod.corePrepositions.length > 8 && (
                      <span className="rounded-md bg-zinc-100 px-2 py-0.5 font-mono text-[11px] text-zinc-500">
                        +{mod.corePrepositions.length - 8} more
                      </span>
                    )}
                  </div>

                  {/* Lesson List */}
                  <div className="mt-4 divide-y divide-zinc-900/8 rounded-xl border border-zinc-900/8 bg-[#FAF8F4]">
                    {mod.lessons.map((lesson) => {
                      const done = progress.completedLessonIds.includes(lesson.id);
                      const lessonCorrect = lesson.exercises.filter(
                        (ex) => progress.exerciseResults[ex.id]?.correct
                      ).length;

                      return (
                        <button
                          key={lesson.id}
                          type="button"
                          onClick={() => onOpenLesson(lesson.id)}
                          className="group flex w-full items-center justify-between gap-3 px-3.5 py-2.5 text-left transition first:rounded-t-xl last:rounded-b-xl hover:bg-white"
                        >
                          <div className="flex min-w-0 items-center gap-2.5">
                            {done ? (
                              <CheckCircle2 className="h-4 w-4 shrink-0 text-[#0D9488]" />
                            ) : (
                              <span className="font-mono text-xs font-bold text-zinc-400 group-hover:text-zinc-700">
                                {lesson.number}
                              </span>
                            )}
                            <div className="min-w-0">
                              <div className="truncate text-sm font-semibold text-zinc-900 group-hover:text-[#234DC7]">
                                {lesson.title}
                              </div>
                              <div className="flex items-center gap-2 text-[11px] text-zinc-500">
                                <span className="inline-flex items-center gap-1">
                                  <Clock className="h-3 w-3" />
                                  {lesson.durationMin}m
                                </span>
                                <span>·</span>
                                <span>
                                  {lessonCorrect}/{lesson.exercises.length} drills
                                </span>
                              </div>
                            </div>
                          </div>
                          <ArrowRight className="h-4 w-4 shrink-0 text-zinc-300 transition group-hover:translate-x-0.5 group-hover:text-zinc-900" />
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Module Progress Bar */}
                <div className="mt-4 flex items-center gap-2.5">
                  <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-zinc-100">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${style.dot}`}
                      style={{ width: `${modPct}%` }}
                    />
                  </div>
                  <span className="font-mono text-[11px] font-semibold text-zinc-500">
                    {modPct}%
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
};
