import React, { useCallback, useEffect, useState } from 'react';
import { ALL_LESSONS, getLessonById } from './data/courseData';
import { useProgress } from './hooks/useProgress';
import { AppView, Navbar } from './components/Navbar';
import { CourseAtlas } from './components/CourseAtlas';
import { LessonStudio } from './components/LessonStudio';
import { SandboxExplorer } from './components/SandboxExplorer';
import { PracticeLab } from './components/PracticeLab';
import { ReferenceSheet } from './components/ReferenceSheet';
import { KidsApp } from './components/KidsApp';

interface RouteState {
  view: AppView;
  lessonId: string;
}

function parseLocation(fallbackLessonId: string): RouteState {
  if (typeof window === 'undefined') {
    return { view: 'atlas', lessonId: fallbackLessonId };
  }
  const path = window.location.pathname.replace(/\/+$/, '') || '/';
  if (path === '/kids') return { view: 'kids', lessonId: fallbackLessonId };
  if (path === '/sandbox') return { view: 'sandbox', lessonId: fallbackLessonId };
  if (path === '/practice') return { view: 'practice', lessonId: fallbackLessonId };
  if (path === '/reference') return { view: 'reference', lessonId: fallbackLessonId };
  const lessonMatch = path.match(/^\/lesson\/([a-z0-9-]+)$/i);
  if (lessonMatch && getLessonById(lessonMatch[1])) {
    return { view: 'lesson', lessonId: lessonMatch[1] };
  }
  return { view: 'atlas', lessonId: fallbackLessonId };
}

function routeToPath(view: AppView, lessonId?: string): string {
  switch (view) {
    case 'kids':
      return '/kids';
    case 'lesson':
      return `/lesson/${lessonId ?? ALL_LESSONS[0].id}`;
    case 'sandbox':
      return '/sandbox';
    case 'practice':
      return '/practice';
    case 'reference':
      return '/reference';
    default:
      return '/';
  }
}

export const App: React.FC = () => {
  const {
    progress,
    recordExerciseResult,
    markLessonComplete,
    toggleLessonComplete,
    setLastVisitedLesson,
    resetProgress,
    stats,
  } = useProgress();

  const fallbackLesson = progress.lastVisitedLessonId ?? ALL_LESSONS[0].id;
  const [route, setRoute] = useState<RouteState>(() => parseLocation(fallbackLesson));

  useEffect(() => {
    const onPopState = () => {
      setRoute(parseLocation(progress.lastVisitedLessonId ?? ALL_LESSONS[0].id));
    };
    window.addEventListener('popstate', onPopState);
    return () => window.removeEventListener('popstate', onPopState);
  }, [progress.lastVisitedLessonId]);

  const pushRoute = useCallback(
    (nextView: AppView, nextLessonId?: string) => {
      const lid = nextLessonId ?? route.lessonId;
      const targetPath = routeToPath(nextView, lid);
      if (window.location.pathname !== targetPath) {
        window.history.pushState({ view: nextView, lessonId: lid }, '', targetPath);
      }
      setRoute({ view: nextView, lessonId: lid });
      window.scrollTo({ top: 0, behavior: 'smooth' });
    },
    [route.lessonId]
  );

  const openLesson = (lessonId: string) => {
    setLastVisitedLesson(lessonId);
    pushRoute('lesson', lessonId);
  };

  const navigate = (next: AppView) => {
    pushRoute(next);
  };

  if (route.view === 'kids') {
    return <KidsApp onSwitchToAdults={() => navigate('atlas')} />;
  }

  const activeLesson = getLessonById(route.lessonId) ?? ALL_LESSONS[0];

  return (
    <div className="min-h-screen bg-[#F7F5F0] text-[#18181B]">
      <Navbar
        currentView={route.view}
        onNavigate={navigate}
        overallPercent={stats.overallPercent}
        streak={progress.streak}
        missedCount={stats.missedCount}
      />

      <main>
        {route.view === 'atlas' && (
          <CourseAtlas
            progress={progress}
            overallPercent={stats.overallPercent}
            completedCount={stats.completedCount}
            totalLessons={stats.totalLessons}
            correctExercises={stats.correctExercises}
            totalExercises={stats.totalExercises}
            onOpenLesson={openLesson}
            onOpenSandbox={() => navigate('sandbox')}
            onOpenPractice={() => navigate('practice')}
            onOpenKids={() => navigate('kids')}
          />
        )}

        {route.view === 'lesson' && (
          <LessonStudio
            lesson={activeLesson}
            progress={progress}
            onBackToAtlas={() => navigate('atlas')}
            onSelectLesson={openLesson}
            onRecordExercise={recordExerciseResult}
            onMarkComplete={markLessonComplete}
            onToggleComplete={toggleLessonComplete}
          />
        )}

        {route.view === 'sandbox' && <SandboxExplorer onOpenLesson={openLesson} />}

        {route.view === 'practice' && (
          <PracticeLab
            progress={progress}
            onRecordExercise={recordExerciseResult}
            onOpenLesson={openLesson}
          />
        )}

        {route.view === 'reference' && (
          <ReferenceSheet onOpenLesson={openLesson} onResetProgress={resetProgress} />
        )}
      </main>
    </div>
  );
};

export default App;
