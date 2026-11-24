import React, { useMemo, useState } from 'react';
import {
  CheckCircle2,
  XCircle,
  ArrowRight,
  RotateCcw,
  Dumbbell,
  Flame,
  BookOpen,
  Sparkles,
  MousePointerClick,
  Keyboard,
  ListChecks,
  Clock,
} from 'lucide-react';
import { ALL_PRACTICE_ENTRIES, COURSE_MODULES } from '../data/courseData';
import { ExerciseItem, ExerciseKind, LearnerProgress } from '../types/course';
import { isItemDueForReview } from '../hooks/useProgress';
import { ThreeStage } from './ThreeStage';
import { PlacementArena3D } from './PlacementArena3D';
import { SpeakButton } from './SpeakButton';

interface PracticeLabProps {
  progress: LearnerProgress;
  onRecordExercise: (exerciseId: string, correct: boolean) => void;
  onOpenLesson: (lessonId: string) => void;
}

type LabMode = 'quiz' | 'placement3d';
type ModuleFilter = 'all' | 'due' | string;
type KindFilter = 'all' | ExerciseKind;

/** Whether a drill supports clean Active Recall typing (short preposition / slash pair answers) */
function supportsTypingMode(ex: ExerciseItem): boolean {
  const answer = ex.options[ex.correctIndex] ?? '';
  return answer.length <= 28;
}

function normalizeTypedAnswer(raw: string): string {
  return raw
    .toLowerCase()
    .replace(/\(no word\)|\(none\)|none|zero|nothing|-/g, 'ø')
    .replace(/[,;|]+/g, '/')
    .replace(/\s*\/\s*/g, '/')
    .replace(/\s+/g, ' ')
    .trim();
}

function checkTypedMatch(userInput: string, expectedOption: string): boolean {
  const normUser = normalizeTypedAnswer(userInput);
  const normExpected = normalizeTypedAnswer(expectedOption);
  if (!normUser) return false;
  if (normUser === normExpected) return true;
  // Also allow space-separated tokens when expected uses "/" (e.g. "on in" matches "on/in")
  if (normExpected.includes('/') && normUser.replace(/\s+/g, '/') === normExpected) {
    return true;
  }
  return false;
}

export const PracticeLab: React.FC<PracticeLabProps> = ({
  progress,
  onRecordExercise,
  onOpenLesson,
}) => {
  const [labMode, setLabMode] = useState<LabMode>('quiz');
  const [moduleFilter, setModuleFilter] = useState<ModuleFilter>('all');
  const [kindFilter, setKindFilter] = useState<KindFilter>('all');
  const [typingMode, setTypingMode] = useState<boolean>(false);
  const [typedInput, setTypedInput] = useState<string>('');
  const [typedOutcome, setTypedOutcome] = useState<'correct' | 'wrong' | null>(null);
  const [cursor, setCursor] = useState(0);
  const [selectedIdx, setSelectedIdx] = useState<number | null>(null);
  const [sessionStats, setSessionStats] = useState({ answered: 0, correct: 0 });

  const dueCount = useMemo(
    () =>
      ALL_PRACTICE_ENTRIES.filter((entry) =>
        isItemDueForReview(progress.exerciseResults[entry.exercise.id])
      ).length,
    [progress.exerciseResults]
  );

  const deck = useMemo(() => {
    return ALL_PRACTICE_ENTRIES.filter((entry) => {
      if (moduleFilter === 'due') {
        if (!isItemDueForReview(progress.exerciseResults[entry.exercise.id])) return false;
      } else if (moduleFilter !== 'all' && entry.moduleId !== moduleFilter) {
        return false;
      }
      if (kindFilter !== 'all' && entry.exercise.kind !== kindFilter) {
        return false;
      }
      return true;
    });
  }, [moduleFilter, kindFilter, progress.exerciseResults]);

  const safeIdx = deck.length > 0 ? cursor % deck.length : 0;
  const current = deck[safeIdx];
  const canTypeCurrent = current ? supportsTypingMode(current.exercise) : false;
  const activeTyping = typingMode && canTypeCurrent;
  const hasAnswered = selectedIdx !== null || typedOutcome !== null;
  const wasCorrect =
    typedOutcome === 'correct' ||
    (selectedIdx !== null && current && selectedIdx === current.exercise.correctIndex);

  const handleSelectOption = (idx: number) => {
    if (!current || hasAnswered) return;
    setSelectedIdx(idx);
    const isCorrect = idx === current.exercise.correctIndex;
    onRecordExercise(current.exercise.id, isCorrect);
    setSessionStats((prev) => ({
      answered: prev.answered + 1,
      correct: prev.correct + (isCorrect ? 1 : 0),
    }));
  };

  const handleSubmitTyped = (e: React.FormEvent) => {
    e.preventDefault();
    if (!current || hasAnswered || !typedInput.trim()) return;
    const expected = current.exercise.options[current.exercise.correctIndex] ?? '';
    const ok = checkTypedMatch(typedInput, expected);
    setTypedOutcome(ok ? 'correct' : 'wrong');
    onRecordExercise(current.exercise.id, ok);
    setSessionStats((prev) => ({
      answered: prev.answered + 1,
      correct: prev.correct + (ok ? 1 : 0),
    }));
  };

  const handleNext = () => {
    setSelectedIdx(null);
    setTypedInput('');
    setTypedOutcome(null);
    setCursor((c) => c + 1);
  };

  const handleFilterChange = (nextMod: ModuleFilter, nextKind: KindFilter) => {
    setModuleFilter(nextMod);
    setKindFilter(nextKind);
    setCursor(0);
    setSelectedIdx(null);
    setTypedInput('');
    setTypedOutcome(null);
  };

  const accuracy =
    sessionStats.answered > 0
      ? Math.round((sessionStats.correct / sessionStats.answered) * 100)
      : null;

  return (
    <div className="mx-auto max-w-6xl px-4 pb-20 pt-8 sm:px-6">
      {/* Header */}
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 font-mono text-xs font-semibold uppercase tracking-wider text-zinc-500">
            <Dumbbell className="h-3.5 w-3.5 text-[#0D9488]" />
            <span>Spaced Repetition · Active Recall · 3D Placement</span>
          </div>
          <h1 className="mt-1 font-display text-3xl font-semibold text-zinc-950">
            Practice Lab
          </h1>
          <p className="mt-1 text-sm text-zinc-600">
            Switch between spaced-repetition drills (with Choice or Active Typing mode) and
            kinesthetic 3D click-to-place challenges.
          </p>
        </div>

        {/* Mode Switcher + Live Session Metrics */}
        <div className="flex flex-wrap items-center gap-2.5">
          <div className="inline-flex rounded-xl border border-zinc-900/10 bg-white p-1">
            <button
              type="button"
              onClick={() => setLabMode('quiz')}
              className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition ${
                labMode === 'quiz'
                  ? 'bg-zinc-900 text-white'
                  : 'text-zinc-600 hover:text-zinc-950'
              }`}
            >
              <ListChecks className="h-3.5 w-3.5" />
              <span>Drills & SRS</span>
            </button>
            <button
              type="button"
              onClick={() => setLabMode('placement3d')}
              className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition ${
                labMode === 'placement3d'
                  ? 'bg-[#3B6CF5] text-white'
                  : 'text-zinc-600 hover:text-zinc-950'
              }`}
            >
              <MousePointerClick className="h-3.5 w-3.5" />
              <span>3D Click-to-Place</span>
            </button>
          </div>

          <div className="inline-flex items-center gap-1.5 rounded-xl border border-amber-500/25 bg-amber-500/10 px-3 py-2 text-xs font-semibold text-amber-800">
            <Flame className="h-4 w-4 text-amber-600" />
            <span>{progress.streak} streak</span>
          </div>
          {labMode === 'quiz' && (
            <div className="rounded-xl border border-zinc-900/10 bg-white px-3.5 py-2 text-xs font-semibold text-zinc-700">
              Session:{' '}
              <span className="font-mono text-zinc-950">
                {sessionStats.correct}/{sessionStats.answered}
                {accuracy !== null ? ` (${accuracy}%)` : ''}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* MODE B: 3D RAYCAST PLACEMENT ARENA */}
      {labMode === 'placement3d' ? (
        <div className="mt-6">
          <PlacementArena3D
            onOpenLesson={onOpenLesson}
            onRecordResult={onRecordExercise}
          />
        </div>
      ) : (
        <>
          {/* Filters */}
          <div className="mt-6 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-zinc-900/10 bg-white p-3.5">
            <div className="flex flex-wrap items-center gap-1.5">
              <button
                type="button"
                onClick={() => handleFilterChange('all', kindFilter)}
                className={`rounded-lg px-2.5 py-1.5 text-xs font-semibold transition ${
                  moduleFilter === 'all'
                    ? 'bg-zinc-900 text-white'
                    : 'bg-zinc-100 text-zinc-600 hover:text-zinc-950'
                }`}
              >
                All Modules
              </button>
              <button
                type="button"
                onClick={() => handleFilterChange('due', kindFilter)}
                className={`inline-flex items-center gap-1 rounded-lg px-2.5 py-1.5 text-xs font-semibold transition ${
                  moduleFilter === 'due'
                    ? 'bg-[#E11D48] text-white'
                    : 'bg-rose-500/10 text-rose-700 hover:bg-rose-500/20'
                }`}
              >
                <Clock className="h-3.5 w-3.5" />
                <span>Due for Review ({dueCount})</span>
              </button>
              {COURSE_MODULES.map((m) => (
                <button
                  key={m.id}
                  type="button"
                  onClick={() => handleFilterChange(m.id, kindFilter)}
                  className={`rounded-lg px-2.5 py-1.5 font-mono text-xs font-semibold transition ${
                    moduleFilter === m.id
                      ? 'bg-zinc-900 text-white'
                      : 'bg-zinc-100 text-zinc-600 hover:text-zinc-950'
                  }`}
                >
                  M{m.number}
                </button>
              ))}
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <div className="flex flex-wrap items-center gap-1">
                {(
                  [
                    { id: 'all', label: 'All Types' },
                    { id: 'visual-scene', label: '3D Visual' },
                    { id: 'minimal-pair', label: 'Minimal Pair' },
                    { id: 'sentence-complete', label: 'Fill-in' },
                    { id: 'error-fix', label: 'Error Fix' },
                  ] as { id: KindFilter; label: string }[]
                ).map((k) => (
                  <button
                    key={k.id}
                    type="button"
                    onClick={() => handleFilterChange(moduleFilter, k.id)}
                    className={`rounded-lg border px-2.5 py-1 text-[11px] font-semibold transition ${
                      kindFilter === k.id
                        ? 'border-zinc-900 bg-zinc-900 text-white'
                        : 'border-zinc-900/10 bg-[#FAF8F4] text-zinc-600 hover:bg-white'
                    }`}
                  >
                    {k.label}
                  </button>
                ))}
              </div>

              {/* Active Typing Toggle */}
              <button
                type="button"
                onClick={() => {
                  setTypingMode((v) => !v);
                  setTypedInput('');
                  setTypedOutcome(null);
                  setSelectedIdx(null);
                }}
                title="Type answers directly on short preposition drills instead of multiple-choice"
                className={`inline-flex items-center gap-1.5 rounded-lg border px-2.5 py-1 text-[11px] font-semibold transition ${
                  typingMode
                    ? 'border-[#7C3AED] bg-[#7C3AED]/12 text-[#6D28D9]'
                    : 'border-zinc-900/12 bg-white text-zinc-600 hover:text-zinc-950'
                }`}
              >
                <Keyboard className="h-3.5 w-3.5" />
                <span>{typingMode ? 'Active Typing: ON' : 'Active Typing'}</span>
              </button>
            </div>
          </div>

          {/* Empty Deck State */}
          {!current ? (
            <div className="mt-8 rounded-2xl border border-zinc-900/10 bg-white p-10 text-center">
              <Sparkles className="mx-auto h-8 w-8 text-[#0D9488]" />
              <h2 className="mt-3 font-display text-xl font-semibold text-zinc-950">
                {moduleFilter === 'due'
                  ? 'All caught up — zero items due for review!'
                  : 'No drills match this filter combination.'}
              </h2>
              <p className="mt-1 text-sm text-zinc-600">
                Switch back to All Modules or try the 3D Click-to-Place Arena!
              </p>
              <div className="mt-4 flex justify-center gap-2">
                <button
                  type="button"
                  onClick={() => handleFilterChange('all', 'all')}
                  className="inline-flex items-center gap-1.5 rounded-xl bg-zinc-900 px-4 py-2.5 text-xs font-semibold text-white"
                >
                  <RotateCcw className="h-3.5 w-3.5" />
                  <span>Reset Filters</span>
                </button>
                <button
                  type="button"
                  onClick={() => setLabMode('placement3d')}
                  className="inline-flex items-center gap-1.5 rounded-xl bg-[#3B6CF5] px-4 py-2.5 text-xs font-semibold text-white"
                >
                  <MousePointerClick className="h-3.5 w-3.5" />
                  <span>Try 3D Click-to-Place</span>
                </button>
              </div>
            </div>
          ) : (
            <div
              className={`mt-6 grid items-start gap-6 ${
                current.exercise.sceneId ? 'lg:grid-cols-12' : 'mx-auto max-w-3xl'
              }`}
            >
              {/* Optional 3D Stage for Visual Drills */}
              {current.exercise.sceneId && (
                <div className="lg:col-span-6">
                  <ThreeStage
                    sceneId={current.exercise.sceneId}
                    caption={current.exercise.sceneCaption}
                    heightClass="h-[340px] sm:h-[420px]"
                  />
                </div>
              )}

              {/* Question Card */}
              <div
                className={`rounded-2xl border border-zinc-900/10 bg-white p-6 shadow-2xs ${
                  current.exercise.sceneId ? 'lg:col-span-6' : ''
                }`}
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-zinc-400">
                      CARD {safeIdx + 1} / {deck.length}
                    </span>
                    <span className="rounded-md bg-zinc-100 px-2 py-0.5 font-mono text-[11px] font-semibold text-zinc-600">
                      {current.exercise.focusTag}
                    </span>
                    {(progress.exerciseResults[current.exercise.id]?.srsLevel ?? 0) > 0 && (
                      <span className="rounded-md bg-emerald-500/10 px-2 py-0.5 font-mono text-[10px] font-semibold text-emerald-700">
                        SRS Lv.{progress.exerciseResults[current.exercise.id]?.srsLevel}
                      </span>
                    )}
                  </div>
                  <button
                    type="button"
                    onClick={() => onOpenLesson(current.lessonId)}
                    className="inline-flex items-center gap-1 text-xs font-semibold text-[#234DC7] hover:underline"
                  >
                    <BookOpen className="h-3.5 w-3.5" />
                    <span>Lesson {current.lessonNumber}</span>
                  </button>
                </div>

                <h2 className="mt-4 text-base font-semibold leading-snug text-zinc-950">
                  {current.exercise.prompt}
                </h2>

                {current.exercise.sentence && (
                  <div className="mt-3 flex items-start justify-between gap-2 rounded-xl border border-zinc-900/8 bg-[#FAF8F4] px-4 py-3 font-mono text-sm text-zinc-900">
                    <span>{current.exercise.sentence}</span>
                    {hasAnswered && (
                      <SpeakButton
                        text={current.exercise.sentence.replace(
                          /___/g,
                          current.exercise.options[current.exercise.correctIndex] ?? ''
                        )}
                      />
                    )}
                  </div>
                )}

                {/* Active Recall Typing Input OR Multiple Choice */}
                {activeTyping ? (
                  <form onSubmit={handleSubmitTyped} className="mt-4 space-y-3">
                    <div>
                      <label className="block text-xs font-medium text-zinc-500">
                        Type the exact preposition(s) — separate multiple blanks with{' '}
                        <code className="rounded bg-zinc-100 px-1">/</code> (use{' '}
                        <code className="rounded bg-zinc-100 px-1">none</code> or{' '}
                        <code className="rounded bg-zinc-100 px-1">Ø</code> for zero preposition):
                      </label>
                      <div className="mt-2 flex gap-2">
                        <input
                          type="text"
                          value={typedInput}
                          disabled={hasAnswered}
                          onChange={(e) => setTypedInput(e.target.value)}
                          placeholder="e.g. on / in"
                          autoFocus
                          className="flex-1 rounded-xl border border-zinc-900/15 bg-[#FAF8F4] px-3.5 py-2.5 font-mono text-sm text-zinc-950 focus:border-zinc-900 focus:bg-white focus:outline-none"
                        />
                        <button
                          type="submit"
                          disabled={hasAnswered || !typedInput.trim()}
                          className="rounded-xl bg-zinc-900 px-4 py-2.5 text-xs font-semibold text-white transition hover:bg-zinc-800 disabled:opacity-40"
                        >
                          Check
                        </button>
                      </div>
                    </div>
                    {!hasAnswered && (
                      <button
                        type="button"
                        onClick={() => setTypingMode(false)}
                        className="text-xs font-medium text-zinc-500 hover:text-zinc-900"
                      >
                        Need hints? Switch to Multiple Choice
                      </button>
                    )}
                    {hasAnswered && (
                      <div className="rounded-xl border border-zinc-900/10 bg-[#FAF8F4] px-3.5 py-2 text-xs text-zinc-700">
                        Expected answer:{' '}
                        <strong className="font-mono text-zinc-950">
                          {current.exercise.options[current.exercise.correctIndex]}
                        </strong>
                      </div>
                    )}
                  </form>
                ) : (
                  <div className="mt-4 space-y-2.5">
                    {current.exercise.options.map((opt, idx) => {
                      const isSelected = selectedIdx === idx;
                      const isCorrect = idx === current.exercise.correctIndex;

                      let cls =
                        'border-zinc-900/10 bg-[#FAF8F4] text-zinc-800 hover:border-zinc-900/30 hover:bg-white';
                      if (hasAnswered) {
                        if (isCorrect) {
                          cls =
                            'border-emerald-500/40 bg-emerald-500/10 font-semibold text-emerald-950';
                        } else if (isSelected) {
                          cls = 'border-rose-500/40 bg-rose-500/10 text-rose-950';
                        } else {
                          cls = 'border-zinc-900/8 bg-zinc-50 text-zinc-400';
                        }
                      }

                      return (
                        <button
                          key={idx}
                          type="button"
                          disabled={hasAnswered}
                          onClick={() => handleSelectOption(idx)}
                          className={`flex w-full items-center justify-between gap-2 rounded-xl border px-4 py-3 text-left text-sm transition ${cls}`}
                        >
                          <span>{opt}</span>
                          {hasAnswered && isCorrect && (
                            <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600" />
                          )}
                          {hasAnswered && isSelected && !isCorrect && (
                            <XCircle className="h-4 w-4 shrink-0 text-rose-600" />
                          )}
                        </button>
                      );
                    })}
                  </div>
                )}

                {hasAnswered && (
                  <div className="mt-4 space-y-3">
                    <div
                      className={`rounded-xl px-4 py-3 text-xs leading-relaxed ${
                        wasCorrect
                          ? 'bg-emerald-500/10 text-emerald-950'
                          : 'bg-rose-500/10 text-rose-950'
                      }`}
                    >
                      <strong>
                        {wasCorrect ? 'Correct! Scheduled further out in SRS.' : 'Added back to your Due queue:'}
                      </strong>{' '}
                      {current.exercise.explanation}
                    </div>

                    <div className="flex items-center justify-between gap-3">
                      <button
                        type="button"
                        onClick={() => onOpenLesson(current.lessonId)}
                        className="text-xs font-semibold text-zinc-600 hover:text-zinc-950"
                      >
                        Review Lesson {current.lessonNumber}: {current.lessonTitle}
                      </button>
                      <button
                        type="button"
                        onClick={handleNext}
                        className="inline-flex items-center gap-1.5 rounded-xl bg-zinc-950 px-4 py-2.5 text-xs font-semibold text-white transition hover:bg-zinc-800"
                      >
                        <span>Next Drill</span>
                        <ArrowRight className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};
