import React, { useEffect, useMemo, useState } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Layers,
  Sparkles,
  GitCompareArrows,
  ClipboardCheck,
  Lightbulb,
  BookMarked,
} from 'lucide-react';
import { ALL_LESSONS, getModuleById } from '../data/courseData';
import { ACCENT_STYLES } from '../data/theme';
import { LearnerProgress, Lesson, SceneCaption, ScenePresetId } from '../types/course';
import { ThreeStage } from './ThreeStage';
import { SpeakButton } from './SpeakButton';

type LessonTab = 'model' | 'pairs' | 'traps' | 'practice';

interface LessonStudioProps {
  lesson: Lesson;
  progress: LearnerProgress;
  onBackToAtlas: () => void;
  onSelectLesson: (lessonId: string) => void;
  onRecordExercise: (exerciseId: string, correct: boolean) => void;
  onMarkComplete: (lessonId: string) => void;
  onToggleComplete: (lessonId: string) => void;
}

export const LessonStudio: React.FC<LessonStudioProps> = ({
  lesson,
  progress,
  onBackToAtlas,
  onSelectLesson,
  onRecordExercise,
  onMarkComplete,
  onToggleComplete,
}) => {
  const mod = getModuleById(lesson.moduleId);
  const accent = mod?.accent ?? 'cobalt';
  const style = ACCENT_STYLES[accent];

  const [activeTab, setActiveTab] = useState<LessonTab>('model');
  const [sceneId, setSceneId] = useState<ScenePresetId>(lesson.defaultSceneId);
  const [sceneCaption, setSceneCaption] = useState<SceneCaption>(lesson.defaultSceneCaption);
  const [selectedPairIds, setSelectedPairIds] = useState<Record<string, string>>({});
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, number>>({});

  // Reset local lesson state when switching lessons
  useEffect(() => {
    setActiveTab('model');
    setSceneId(lesson.defaultSceneId);
    setSceneCaption(lesson.defaultSceneCaption);
    const initialPairs: Record<string, string> = {};
    lesson.minimalPairs.forEach((group) => {
      if (group.options[0]) {
        initialPairs[group.id] = group.options[0].id;
      }
    });
    setSelectedPairIds(initialPairs);
    setSelectedAnswers({});
  }, [lesson.id, lesson.defaultSceneId, lesson.defaultSceneCaption, lesson.minimalPairs]);

  // Collect all unique 3D presets available in this lesson for quick stage switching
  const quickStageViews = useMemo(() => {
    const map = new Map<
      ScenePresetId,
      { label: string; sceneId: ScenePresetId; caption: SceneCaption }
    >();
    map.set(lesson.defaultSceneId, {
      label: 'Overview',
      sceneId: lesson.defaultSceneId,
      caption: lesson.defaultSceneCaption,
    });
    lesson.minimalPairs.forEach((group) => {
      group.options.forEach((opt) => {
        if (!map.has(opt.sceneId)) {
          map.set(opt.sceneId, {
            label: opt.preposition.toUpperCase(),
            sceneId: opt.sceneId,
            caption: opt.sceneCaption,
          });
        }
      });
    });
    return Array.from(map.values());
  }, [lesson]);

  const lessonIdx = ALL_LESSONS.findIndex((l) => l.id === lesson.id);
  const prevLesson = lessonIdx > 0 ? ALL_LESSONS[lessonIdx - 1] : null;
  const nextLesson = lessonIdx >= 0 && lessonIdx < ALL_LESSONS.length - 1 ? ALL_LESSONS[lessonIdx + 1] : null;
  const isCompleted = progress.completedLessonIds.includes(lesson.id);

  const handleChoosePairOption = (
    groupId: string,
    optId: string,
    nextSceneId: ScenePresetId,
    nextCaption: SceneCaption
  ) => {
    setSelectedPairIds((prev) => ({ ...prev, [groupId]: optId }));
    setSceneId(nextSceneId);
    setSceneCaption(nextCaption);
  };

  const handleAnswerExercise = (exerciseId: string, optionIdx: number, correctIndex: number) => {
    setSelectedAnswers((prev) => ({ ...prev, [exerciseId]: optionIdx }));
    const isCorrect = optionIdx === correctIndex;
    onRecordExercise(exerciseId, isCorrect);

    // Check if all exercises in this lesson are now answered correctly
    const allCorrectAfterThis = lesson.exercises.every((ex) => {
      if (ex.id === exerciseId) return isCorrect;
      return selectedAnswers[ex.id] === ex.correctIndex || progress.exerciseResults[ex.id]?.correct;
    });
    if (allCorrectAfterThis) {
      onMarkComplete(lesson.id);
    }
  };

  const handleTabChange = (tab: LessonTab) => {
    setActiveTab(tab);
    if (tab === 'practice') {
      const firstVisual = lesson.exercises.find((e) => e.sceneId && e.sceneCaption);
      if (firstVisual?.sceneId && firstVisual.sceneCaption) {
        setSceneId(firstVisual.sceneId);
        setSceneCaption(firstVisual.sceneCaption);
      }
    } else if (tab === 'pairs') {
      const firstOpt = lesson.minimalPairs[0]?.options[0];
      if (firstOpt) {
        setSceneId(firstOpt.sceneId);
        setSceneCaption(firstOpt.sceneCaption);
      }
    }
  };

  const correctInLesson = lesson.exercises.filter(
    (ex) => selectedAnswers[ex.id] === ex.correctIndex || progress.exerciseResults[ex.id]?.correct
  ).length;

  return (
    <div className="mx-auto max-w-7xl px-4 pb-16 pt-5 sm:px-6">
      {/* Top Lesson Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-zinc-900/10 pb-4">
        <div className="flex flex-wrap items-center gap-2.5">
          <button
            type="button"
            onClick={onBackToAtlas}
            className="inline-flex items-center gap-1.5 rounded-lg border border-zinc-900/10 bg-white px-3 py-1.5 text-xs font-semibold text-zinc-700 transition hover:bg-zinc-50 hover:text-zinc-950"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>Atlas</span>
          </button>

          {mod && (
            <span
              className={`inline-flex items-center rounded-lg border px-2.5 py-1 font-mono text-xs font-semibold ${style.badge}`}
            >
              Module 0{mod.number} · {mod.title}
            </span>
          )}
        </div>

        <div className="flex items-center gap-2">
          {/* Quick lesson switcher within same module */}
          {mod && (
            <div className="hidden items-center gap-1 rounded-lg border border-zinc-900/10 bg-white p-1 sm:flex">
              {mod.lessons.map((l) => (
                <button
                  key={l.id}
                  type="button"
                  onClick={() => onSelectLesson(l.id)}
                  className={`rounded-md px-2.5 py-1 font-mono text-xs font-semibold transition ${
                    l.id === lesson.id
                      ? 'bg-zinc-900 text-white'
                      : 'text-zinc-500 hover:bg-zinc-100 hover:text-zinc-900'
                  }`}
                >
                  {l.number}
                </button>
              ))}
            </div>
          )}

          <button
            type="button"
            onClick={() => onToggleComplete(lesson.id)}
            className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition ${
              isCompleted
                ? 'bg-[#0D9488] text-white'
                : 'border border-zinc-900/12 bg-white text-zinc-700 hover:bg-zinc-50'
            }`}
          >
            <CheckCircle2 className="h-3.5 w-3.5" />
            <span>{isCompleted ? 'Completed' : 'Mark Complete'}</span>
          </button>
        </div>
      </div>

      {/* Lesson Heading */}
      <div className="mt-5">
        <div className="flex flex-wrap items-center gap-2">
          <span className="font-mono text-xs font-bold text-zinc-500">LESSON {lesson.number}</span>
          <span className="text-zinc-300">·</span>
          <div className="flex flex-wrap gap-1.5">
            {lesson.targetPrepositions.map((p) => (
              <span
                key={p}
                className={`rounded-md border px-2 py-0.5 font-mono text-[11px] font-semibold ${style.badge}`}
              >
                {p}
              </span>
            ))}
          </div>
        </div>
        <h1 className="mt-1.5 font-display text-2xl font-semibold text-zinc-950 sm:text-3xl">
          {lesson.title}
        </h1>
        <p className="mt-1 text-sm text-zinc-600">{lesson.subtitle}</p>
      </div>

      {/* Split Workspace: Sticky 3D Stage Left + Interactive Curriculum Right */}
      <div className="mt-6 grid items-start gap-7 lg:grid-cols-12">
        {/* LEFT: Interactive 3D Stage */}
        <div className="lg:sticky lg:top-20 lg:col-span-6">
          <ThreeStage
            sceneId={sceneId}
            caption={sceneCaption}
            heightClass="h-[340px] sm:h-[420px] lg:h-[500px]"
          />

          {/* Quick Scene Switcher Strip */}
          {quickStageViews.length > 1 && (
            <div className="mt-3 rounded-xl border border-zinc-900/10 bg-white/80 p-3">
              <div className="mb-2 flex items-center justify-between text-[11px] font-semibold uppercase tracking-wide text-zinc-500">
                <span>Interactive 3D Views in This Lesson</span>
                <span>Click to morph stage</span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {quickStageViews.map((v) => {
                  const active = sceneId === v.sceneId;
                  return (
                    <button
                      key={v.sceneId}
                      type="button"
                      onClick={() => {
                        setSceneId(v.sceneId);
                        setSceneCaption(v.caption);
                      }}
                      className={`rounded-lg px-2.5 py-1.5 font-mono text-xs font-semibold transition ${
                        active
                          ? 'bg-zinc-900 text-white shadow-xs'
                          : 'border border-zinc-900/10 bg-[#FAF8F4] text-zinc-700 hover:bg-white hover:text-zinc-950'
                      }`}
                    >
                      {v.label}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* RIGHT: 4-Step Pedagogical Loop */}
        <div className="lg:col-span-6">
          {/* Tab Switcher */}
          <div className="grid grid-cols-4 gap-1 rounded-xl border border-zinc-900/10 bg-white p-1 shadow-2xs">
            {(
              [
                { id: 'model', label: '1. Model', icon: <Lightbulb className="h-3.5 w-3.5" /> },
                { id: 'pairs', label: '2. Pairs', icon: <GitCompareArrows className="h-3.5 w-3.5" /> },
                { id: 'traps', label: '3. Traps', icon: <AlertTriangle className="h-3.5 w-3.5" /> },
                {
                  id: 'practice',
                  label: `4. Drills (${correctInLesson}/${lesson.exercises.length})`,
                  icon: <ClipboardCheck className="h-3.5 w-3.5" />,
                },
              ] as { id: LessonTab; label: string; icon: React.ReactNode }[]
            ).map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => handleTabChange(tab.id)}
                className={`inline-flex items-center justify-center gap-1.5 rounded-lg px-2 py-2 text-xs font-semibold transition ${
                  activeTab === tab.id
                    ? 'bg-zinc-900 text-white shadow-xs'
                    : 'text-zinc-600 hover:bg-zinc-100 hover:text-zinc-950'
                }`}
              >
                {tab.icon}
                <span className="truncate">{tab.label}</span>
              </button>
            ))}
          </div>

          {/* TAB 1: MENTAL MODEL */}
          {activeTab === 'model' && (
            <div className="mt-5 space-y-5">
              <div className="rounded-2xl border border-zinc-900/10 bg-white p-5 shadow-2xs">
                <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-zinc-500">
                  <Sparkles className="h-3.5 w-3.5 text-[#3B6CF5]" />
                  <span>Core Spatial Intuition</span>
                </div>
                <h2 className="mt-2 font-display text-xl font-semibold text-zinc-950">
                  {lesson.mentalModel.headline}
                </h2>
                <p className="mt-3 text-sm leading-relaxed text-zinc-700">
                  {lesson.mentalModel.summary}
                </p>

                <ul className="mt-4 space-y-2.5">
                  {lesson.mentalModel.keyTakeaways.map((tip, i) => (
                    <li
                      key={i}
                      className="flex items-start gap-2.5 rounded-xl bg-[#FAF8F4] px-3.5 py-2.5 text-sm text-zinc-800"
                    >
                      <span
                        className={`mt-1 h-2 w-2 shrink-0 rounded-full ${style.dot}`}
                      />
                      <span className="leading-relaxed">{tip}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Metaphor Ladder (if present) */}
              {lesson.mentalModel.metaphorLadder && (
                <div className="rounded-2xl border border-zinc-900/10 bg-white p-5 shadow-2xs">
                  <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-zinc-500">
                    <Layers className="h-3.5 w-3.5 text-[#7C3AED]" />
                    <span>Metaphor Ladder: Space → Abstract</span>
                  </div>
                  <div className="mt-3 space-y-2.5">
                    {lesson.mentalModel.metaphorLadder.map((step, i) => (
                      <div
                        key={i}
                        className="rounded-xl border border-zinc-900/8 bg-[#FAF8F4] p-3.5"
                      >
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <span className="font-mono text-[11px] font-bold uppercase text-[#6D28D9]">
                            {i + 1}. {step.domain}
                          </span>
                          <span className="font-mono text-xs font-semibold text-zinc-900">
                            {step.example}
                          </span>
                        </div>
                        <p className="mt-1 text-xs leading-relaxed text-zinc-600">
                          {step.explanation}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Optional Chunks Matrix */}
              {lesson.chunks && (
                <div className="rounded-2xl border border-zinc-900/10 bg-white p-5 shadow-2xs">
                  <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-zinc-500">
                    <BookMarked className="h-3.5 w-3.5 text-[#0D9488]" />
                    <span>{lesson.chunks.title}</span>
                  </div>
                  <p className="mt-1 text-xs text-zinc-600">{lesson.chunks.description}</p>
                  <div className="mt-3 space-y-2">
                    {lesson.chunks.rows.map((row, idx) => (
                      <div
                        key={idx}
                        className="rounded-xl border border-zinc-900/8 bg-[#FAF8F4] p-3"
                      >
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <span className="text-xs font-bold text-zinc-900">{row.anchor}</span>
                          <span
                            className={`rounded-md border px-2 py-0.5 font-mono text-[11px] font-bold ${style.badge}`}
                          >
                            {row.prep}
                          </span>
                        </div>
                        <p className="mt-1 font-mono text-xs text-zinc-800">{row.example}</p>
                        <p className="mt-1 text-xs text-zinc-500">{row.note}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <button
                type="button"
                onClick={() => handleTabChange('pairs')}
                className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-zinc-900 px-4 py-3 text-sm font-semibold text-white transition hover:bg-zinc-800"
              >
                <span>Next: Compare Interactive Minimal Pairs</span>
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          )}

          {/* TAB 2: MINIMAL PAIRS */}
          {activeTab === 'pairs' && (
            <div className="mt-5 space-y-5">
              {lesson.minimalPairs.map((group) => {
                const selectedOptId = selectedPairIds[group.id] ?? group.options[0]?.id;
                const selectedOpt =
                  group.options.find((o) => o.id === selectedOptId) ?? group.options[0];

                return (
                  <div
                    key={group.id}
                    className="rounded-2xl border border-zinc-900/10 bg-white p-5 shadow-2xs"
                  >
                    <h3 className="font-display text-lg font-semibold text-zinc-950">
                      {group.title}
                    </h3>
                    <p className="mt-1 text-xs text-zinc-500">{group.contextNote}</p>

                    {/* Toggle Pills */}
                    <div className="mt-4 flex flex-wrap gap-2">
                      {group.options.map((opt) => {
                        const isSelected = opt.id === selectedOpt?.id;
                        return (
                          <button
                            key={opt.id}
                            type="button"
                            onClick={() =>
                              handleChoosePairOption(
                                group.id,
                                opt.id,
                                opt.sceneId,
                                opt.sceneCaption
                              )
                            }
                            className={`rounded-xl px-3.5 py-2 font-mono text-xs font-bold transition ${
                              isSelected
                                ? 'bg-zinc-900 text-white shadow-sm'
                                : 'border border-zinc-900/12 bg-[#FAF8F4] text-zinc-700 hover:bg-zinc-100'
                            }`}
                          >
                            {opt.preposition.toUpperCase()}
                          </button>
                        );
                      })}
                    </div>

                    {/* All options listed so user can compare nuances side by side */}
                    <div className="mt-4 space-y-2.5">
                      {group.options.map((opt) => {
                        const isSelected = opt.id === selectedOpt?.id;
                        const optAccent = ACCENT_STYLES[opt.sceneCaption.accent];

                        return (
                          <button
                            key={opt.id}
                            type="button"
                            onClick={() =>
                              handleChoosePairOption(
                                group.id,
                                opt.id,
                                opt.sceneId,
                                opt.sceneCaption
                              )
                            }
                            className={`w-full rounded-xl border p-3.5 text-left transition ${
                              isSelected
                                ? `${optAccent.border} ${optAccent.softBg} ring-2 ${optAccent.ring}`
                                : 'border-zinc-900/8 bg-[#FAF8F4] hover:border-zinc-900/20 hover:bg-white'
                            }`}
                          >
                            <div className="flex flex-wrap items-center justify-between gap-2">
                              <span
                                className={`rounded-md border px-2 py-0.5 font-mono text-[11px] font-bold ${optAccent.badge}`}
                              >
                                {opt.highlight}
                              </span>
                              <div className="flex items-center gap-2">
                                {isSelected && (
                                  <span className="font-mono text-[10px] font-semibold uppercase text-zinc-500">
                                    Active on 3D Stage
                                  </span>
                                )}
                                <SpeakButton text={opt.sentence} />
                              </div>
                            </div>
                            <p className="mt-2 text-sm font-medium text-zinc-950">
                              “{opt.sentence}”
                            </p>
                            <p className="mt-1 text-xs leading-relaxed text-zinc-600">
                              {opt.meaning}
                            </p>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                );
              })}

              <button
                type="button"
                onClick={() => handleTabChange('traps')}
                className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-zinc-900 px-4 py-3 text-sm font-semibold text-white transition hover:bg-zinc-800"
              >
                <span>Next: Spot Real-Life Traps</span>
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          )}

          {/* TAB 3: COMMON TRAPS */}
          {activeTab === 'traps' && (
            <div className="mt-5 space-y-4">
              {lesson.commonTraps.map((trap, i) => (
                <div
                  key={i}
                  className="rounded-2xl border border-zinc-900/10 bg-white p-5 shadow-2xs"
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="rounded-md bg-rose-500/10 px-2 py-0.5 font-mono text-[11px] font-semibold text-rose-700">
                      Trap #{i + 1} · {trap.tag}
                    </span>
                  </div>

                  <div className="mt-3 space-y-2">
                    <div className="flex items-start gap-2 rounded-xl bg-rose-500/[0.06] px-3.5 py-2.5 text-sm text-rose-900">
                      <XCircle className="mt-0.5 h-4 w-4 shrink-0 text-rose-600" />
                      <span className="line-through decoration-rose-400">{trap.wrong}</span>
                    </div>
                    <div className="flex items-start justify-between gap-2 rounded-xl bg-emerald-500/[0.08] px-3.5 py-2.5 text-sm font-medium text-emerald-950">
                      <div className="flex items-start gap-2">
                        <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />
                        <span>{trap.right}</span>
                      </div>
                      <SpeakButton text={trap.right} />
                    </div>
                  </div>

                  <p className="mt-3 text-xs leading-relaxed text-zinc-600">
                    <strong className="font-semibold text-zinc-900">Why:</strong> {trap.why}
                  </p>
                </div>
              ))}

              <button
                type="button"
                onClick={() => handleTabChange('practice')}
                className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-zinc-900 px-4 py-3 text-sm font-semibold text-white transition hover:bg-zinc-800"
              >
                <span>Next: Active 3D Practice Drills</span>
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          )}

          {/* TAB 4: PRACTICE DRILLS */}
          {activeTab === 'practice' && (
            <div className="mt-5 space-y-4">
              {lesson.exercises.map((ex, idx) => {
                const chosen = selectedAnswers[ex.id];
                const hasAnswered = chosen !== undefined;
                const isRight = chosen === ex.correctIndex;
                const previouslyMastered = progress.exerciseResults[ex.id]?.correct;

                return (
                  <div
                    key={ex.id}
                    className="rounded-2xl border border-zinc-900/10 bg-white p-5 shadow-2xs"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-bold text-zinc-400">
                          DRILL {idx + 1}
                        </span>
                        <span className="rounded-md bg-zinc-100 px-2 py-0.5 font-mono text-[11px] font-semibold text-zinc-600">
                          {ex.focusTag}
                        </span>
                      </div>

                      {ex.sceneId && ex.sceneCaption && (
                        <button
                          type="button"
                          onClick={() => {
                            setSceneId(ex.sceneId!);
                            setSceneCaption(ex.sceneCaption!);
                          }}
                          className="rounded-lg border border-[#3B6CF5]/25 bg-[#3B6CF5]/10 px-2.5 py-1 text-[11px] font-semibold text-[#234DC7] transition hover:bg-[#3B6CF5]/20"
                        >
                          Show on 3D Stage
                        </button>
                      )}
                    </div>

                    <p className="mt-3 text-sm font-semibold text-zinc-900">{ex.prompt}</p>

                    {ex.sentence && (
                      <div className="mt-2.5 rounded-xl border border-zinc-900/8 bg-[#FAF8F4] px-3.5 py-2.5 font-mono text-sm text-zinc-900">
                        {ex.sentence}
                      </div>
                    )}

                    <div className="mt-3.5 space-y-2">
                      {ex.options.map((opt, optIdx) => {
                        const selected = chosen === optIdx;
                        const correctOpt = optIdx === ex.correctIndex;

                        let btnClass =
                          'border-zinc-900/10 bg-[#FAF8F4] text-zinc-800 hover:border-zinc-900/30 hover:bg-white';
                        if (hasAnswered) {
                          if (correctOpt) {
                            btnClass =
                              'border-emerald-500/40 bg-emerald-500/10 text-emerald-950 font-semibold';
                          } else if (selected && !correctOpt) {
                            btnClass = 'border-rose-500/40 bg-rose-500/10 text-rose-950';
                          } else {
                            btnClass = 'border-zinc-900/8 bg-zinc-50 text-zinc-400';
                          }
                        }

                        return (
                          <button
                            key={optIdx}
                            type="button"
                            onClick={() => {
                              if (ex.sceneId && ex.sceneCaption) {
                                setSceneId(ex.sceneId);
                                setSceneCaption(ex.sceneCaption);
                              }
                              handleAnswerExercise(ex.id, optIdx, ex.correctIndex);
                            }}
                            className={`flex w-full items-center justify-between gap-2 rounded-xl border px-3.5 py-2.5 text-left text-sm transition ${btnClass}`}
                          >
                            <span>{opt}</span>
                            {hasAnswered && correctOpt && (
                              <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600" />
                            )}
                            {hasAnswered && selected && !correctOpt && (
                              <XCircle className="h-4 w-4 shrink-0 text-rose-600" />
                            )}
                          </button>
                        );
                      })}
                    </div>

                    {hasAnswered ? (
                      <div
                        className={`mt-3 rounded-xl px-3.5 py-2.5 text-xs leading-relaxed ${
                          isRight
                            ? 'bg-emerald-500/10 text-emerald-950'
                            : 'bg-rose-500/10 text-rose-950'
                        }`}
                      >
                        <strong>{isRight ? 'Spot on!' : 'Not quite — here is why:'}</strong>{' '}
                        {ex.explanation}
                      </div>
                    ) : (
                      previouslyMastered && (
                        <div className="mt-2.5 inline-flex items-center gap-1 text-[11px] font-medium text-emerald-700">
                          <CheckCircle2 className="h-3.5 w-3.5" />
                          <span>Previously mastered</span>
                        </div>
                      )
                    )}
                  </div>
                );
              })}

              {/* Lesson Footer Navigation */}
              <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-zinc-900/10 bg-white p-4">
                {prevLesson ? (
                  <button
                    type="button"
                    onClick={() => onSelectLesson(prevLesson.id)}
                    className="inline-flex items-center gap-1.5 rounded-xl border border-zinc-900/12 px-3.5 py-2 text-xs font-semibold text-zinc-700 transition hover:bg-zinc-50"
                  >
                    <ArrowLeft className="h-3.5 w-3.5" />
                    <span>Prev: {prevLesson.number}</span>
                  </button>
                ) : (
                  <span />
                )}

                {nextLesson ? (
                  <button
                    type="button"
                    onClick={() => {
                      onMarkComplete(lesson.id);
                      onSelectLesson(nextLesson.id);
                    }}
                    className="inline-flex items-center gap-2 rounded-xl bg-zinc-950 px-4 py-2.5 text-xs font-semibold text-white transition hover:bg-zinc-800"
                  >
                    <span>
                      Next Lesson {nextLesson.number}: {nextLesson.title}
                    </span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => {
                      onMarkComplete(lesson.id);
                      onBackToAtlas();
                    }}
                    className="inline-flex items-center gap-2 rounded-xl bg-[#0D9488] px-4 py-2.5 text-xs font-semibold text-white transition hover:opacity-95"
                  >
                    <CheckCircle2 className="h-4 w-4" />
                    <span>Finish Course & Return to Atlas</span>
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
