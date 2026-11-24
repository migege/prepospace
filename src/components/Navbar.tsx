import React from 'react';
import { Box, Compass, Dumbbell, BookOpen, Flame } from 'lucide-react';

export type AppView = 'atlas' | 'lesson' | 'sandbox' | 'practice' | 'reference' | 'kids';

interface NavbarProps {
  currentView: AppView;
  onNavigate: (view: AppView) => void;
  overallPercent: number;
  streak: number;
  missedCount: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentView,
  onNavigate,
  overallPercent,
  streak,
  missedCount,
}) => {
  const navItems: { id: AppView; label: string; icon: React.ReactNode; badge?: number }[] = [
    { id: 'atlas', label: 'Course Atlas', icon: <Compass className="h-4 w-4" /> },
    { id: 'sandbox', label: '3D Sandbox', icon: <Box className="h-4 w-4" /> },
    {
      id: 'practice',
      label: 'Practice Lab',
      icon: <Dumbbell className="h-4 w-4" />,
      badge: missedCount > 0 ? missedCount : undefined,
    },
    { id: 'reference', label: 'Cheat Sheet', icon: <BookOpen className="h-4 w-4" /> },
  ];

  return (
    <header className="sticky top-0 z-40 border-b border-zinc-900/10 bg-[#F7F5F0]/90 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
        {/* Brand */}
        <button
          type="button"
          onClick={() => onNavigate('atlas')}
          className="group flex items-center gap-2.5 text-left"
        >
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-zinc-900 text-white shadow-sm transition group-hover:scale-105">
            <Box className="h-5 w-5 text-[#60A5FA]" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-display text-lg font-bold tracking-tight text-zinc-900">
                PrepoSpace
              </span>
              <span className="rounded-md bg-[#3B6CF5]/12 px-1.5 py-0.5 font-mono text-[10px] font-semibold text-[#234DC7]">
                B1–B2
              </span>
            </div>
            <p className="hidden text-[11px] text-zinc-500 sm:block">
              3D Spatial English Prepositions
            </p>
          </div>
        </button>

        {/* Primary Nav */}
        <nav className="flex items-center gap-1 rounded-xl border border-zinc-900/8 bg-white/75 p-1 shadow-2xs">
          {navItems.map((item) => {
            const active =
              currentView === item.id || (currentView === 'lesson' && item.id === 'atlas');
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => onNavigate(item.id)}
                className={`relative inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-medium transition sm:px-3.5 sm:text-sm ${
                  active
                    ? 'bg-zinc-900 text-white shadow-xs'
                    : 'text-zinc-600 hover:bg-zinc-900/5 hover:text-zinc-950'
                }`}
              >
                {item.icon}
                <span className="hidden md:inline">{item.label}</span>
                {item.badge !== undefined && (
                  <span className="ml-0.5 inline-flex h-4 min-w-4 items-center justify-center rounded-full bg-[#E11D48] px-1 text-[10px] font-bold text-white">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Right Progress Stats + Kids Mode Switcher */}
        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={() => onNavigate('kids')}
            title="Switch to PrepoSpace Kids (iPad 3D Playground)"
            className="inline-flex items-center gap-1.5 rounded-xl border border-amber-500/35 bg-amber-300/35 px-3 py-1.5 text-xs font-bold text-amber-950 transition hover:bg-amber-300/60"
          >
            <span>🐶</span>
            <span>Kids</span>
          </button>

          {streak > 0 && (
            <div className="hidden items-center gap-1 rounded-full border border-amber-500/25 bg-amber-500/10 px-2.5 py-1 text-xs font-semibold text-amber-800 lg:inline-flex">
              <Flame className="h-3.5 w-3.5 text-amber-600" />
              <span>{streak} streak</span>
            </div>
          )}
          <div className="hidden items-center gap-2 rounded-full border border-zinc-900/10 bg-white px-3 py-1.5 lg:flex">
            <div className="h-2 w-20 overflow-hidden rounded-full bg-zinc-200">
              <div
                className="h-full rounded-full bg-[#3B6CF5] transition-all duration-500"
                style={{ width: `${overallPercent}%` }}
              />
            </div>
            <span className="font-mono text-xs font-semibold text-zinc-700">
              {overallPercent}%
            </span>
          </div>
        </div>
      </div>
    </header>
  );
};
