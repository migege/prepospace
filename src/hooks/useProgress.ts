import { useCallback, useEffect, useState } from 'react';
import { LearnerProgress } from '../types/course';
import { ALL_LESSONS, ALL_PRACTICE_ENTRIES } from '../data/courseData';

const STORAGE_KEY = 'prepospace_progress_v1';

// Spaced repetition intervals in days: level 1 -> 1d, 2 -> 3d, 3 -> 7d, 4 -> 14d
const SRS_INTERVAL_DAYS = [0, 1, 3, 7, 14];
const DAY_MS = 24 * 60 * 60 * 1000;

const DEFAULT_PROGRESS: LearnerProgress = {
  completedLessonIds: [],
  exerciseResults: {},
  streak: 0,
  lastVisitedLessonId: undefined,
};

function loadProgress(): LearnerProgress {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_PROGRESS;
    const parsed = JSON.parse(raw) as Partial<LearnerProgress>;
    return {
      completedLessonIds: Array.isArray(parsed.completedLessonIds) ? parsed.completedLessonIds : [],
      exerciseResults:
        parsed.exerciseResults && typeof parsed.exerciseResults === 'object'
          ? parsed.exerciseResults
          : {},
      streak: typeof parsed.streak === 'number' ? parsed.streak : 0,
      lastVisitedLessonId: parsed.lastVisitedLessonId,
    };
  } catch {
    return DEFAULT_PROGRESS;
  }
}

export function isItemDueForReview(
  entry:
    | { correct: boolean; nextReviewAt?: number }
    | undefined,
  now = Date.now()
): boolean {
  if (!entry) return false;
  if (!entry.correct) return true;
  if (entry.nextReviewAt !== undefined && entry.nextReviewAt <= now) return true;
  return false;
}

export function useProgress() {
  const [progress, setProgress] = useState<LearnerProgress>(loadProgress);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
    } catch {
      // Ignore storage quota errors
    }
  }, [progress]);

  const recordExerciseResult = useCallback((exerciseId: string, correct: boolean) => {
    setProgress((prev) => {
      const existing = prev.exerciseResults[exerciseId];
      const now = Date.now();
      const prevLevel = existing?.srsLevel ?? 0;
      const nextLevel = correct
        ? Math.min(SRS_INTERVAL_DAYS.length - 1, prevLevel + 1)
        : 0;
      const nextReviewAt = correct
        ? now + SRS_INTERVAL_DAYS[nextLevel] * DAY_MS
        : now;

      return {
        ...prev,
        streak: correct ? prev.streak + 1 : 0,
        exerciseResults: {
          ...prev.exerciseResults,
          [exerciseId]: {
            correct,
            attempts: (existing?.attempts ?? 0) + 1,
            lastAnsweredAt: now,
            srsLevel: nextLevel,
            nextReviewAt,
          },
        },
      };
    });
  }, []);

  const markLessonComplete = useCallback((lessonId: string) => {
    setProgress((prev) => {
      if (prev.completedLessonIds.includes(lessonId)) return prev;
      return {
        ...prev,
        completedLessonIds: [...prev.completedLessonIds, lessonId],
      };
    });
  }, []);

  const toggleLessonComplete = useCallback((lessonId: string) => {
    setProgress((prev) => {
      const exists = prev.completedLessonIds.includes(lessonId);
      return {
        ...prev,
        completedLessonIds: exists
          ? prev.completedLessonIds.filter((id) => id !== lessonId)
          : [...prev.completedLessonIds, lessonId],
      };
    });
  }, []);

  const setLastVisitedLesson = useCallback((lessonId: string) => {
    setProgress((prev) => ({
      ...prev,
      lastVisitedLessonId: lessonId,
    }));
  }, []);

  const resetProgress = useCallback(() => {
    setProgress(DEFAULT_PROGRESS);
  }, []);

  const now = Date.now();
  const totalLessons = ALL_LESSONS.length;
  const completedCount = progress.completedLessonIds.length;
  const totalExercises = ALL_PRACTICE_ENTRIES.length;
  const correctExercises = ALL_PRACTICE_ENTRIES.filter(
    (e) => progress.exerciseResults[e.exercise.id]?.correct
  ).length;
  const dueCount = ALL_PRACTICE_ENTRIES.filter((e) =>
    isItemDueForReview(progress.exerciseResults[e.exercise.id], now)
  ).length;
  const overallPercent = Math.round(
    ((completedCount / Math.max(1, totalLessons)) * 0.6 +
      (correctExercises / Math.max(1, totalExercises)) * 0.4) *
      100
  );

  return {
    progress,
    recordExerciseResult,
    markLessonComplete,
    toggleLessonComplete,
    setLastVisitedLesson,
    resetProgress,
    stats: {
      totalLessons,
      completedCount,
      totalExercises,
      correctExercises,
      missedCount: dueCount,
      overallPercent,
    },
  };
}
