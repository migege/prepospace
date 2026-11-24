import React, { useMemo, useState } from 'react';
import { BookOpen, Search, ArrowRight, RotateCcw } from 'lucide-react';
import { QUICK_REFERENCE_ITEMS, ReferenceItem } from '../data/courseData';

type RefCategory = 'All' | ReferenceItem['category'];

const REF_CATEGORIES: RefCategory[] = [
  'All',
  'Geometry',
  'Motion',
  'Time',
  'Nuance',
  'Chunks',
  'Ghost Ø',
  'Particles',
];

interface ReferenceSheetProps {
  onOpenLesson: (lessonId: string) => void;
  onResetProgress: () => void;
}

export const ReferenceSheet: React.FC<ReferenceSheetProps> = ({
  onOpenLesson,
  onResetProgress,
}) => {
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState<RefCategory>('All');
  const [confirmReset, setConfirmReset] = useState(false);

  const items = useMemo(() => {
    const q = query.trim().toLowerCase();
    return QUICK_REFERENCE_ITEMS.filter((item) => {
      if (category !== 'All' && item.category !== category) return false;
      if (!q) return true;
      return (
        item.prep.toLowerCase().includes(q) ||
        item.rule.toLowerCase().includes(q) ||
        item.examples.some((e) => e.toLowerCase().includes(q)) ||
        (item.contrast?.toLowerCase().includes(q) ?? false)
      );
    });
  }, [query, category]);

  return (
    <div className="mx-auto max-w-6xl px-4 pb-20 pt-8 sm:px-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 font-mono text-xs font-semibold uppercase tracking-wider text-zinc-500">
            <BookOpen className="h-3.5 w-3.5 text-[#7C3AED]" />
            <span>Searchable B1–B2 Field Guide</span>
          </div>
          <h1 className="mt-1 font-display text-3xl font-semibold text-zinc-950">
            Preposition Cheat Sheet
          </h1>
          <p className="mt-1 text-sm text-zinc-600">
            Fast lookup for spatial geometry, timelines, confusion pairs, verb/adj chunks, ghost
            prepositions, and phrasal particles.
          </p>
        </div>

        {/* Search Input */}
        <div className="relative w-full sm:w-72">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search e.g. until, discuss, bus..."
            className="w-full rounded-xl border border-zinc-900/12 bg-white py-2 pl-9 pr-3 text-sm text-zinc-900 placeholder:text-zinc-400 focus:border-zinc-900 focus:outline-none"
          />
        </div>
      </div>

      {/* Category Filter */}
      <div className="mt-5 flex flex-wrap gap-1.5">
        {REF_CATEGORIES.map((cat) => (
          <button
            key={cat}
            type="button"
            onClick={() => setCategory(cat)}
            className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition ${
              category === cat
                ? 'bg-zinc-900 text-white'
                : 'border border-zinc-900/10 bg-white text-zinc-600 hover:bg-zinc-50 hover:text-zinc-950'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Cards Grid */}
      <div className="mt-6 grid gap-4 md:grid-cols-2">
        {items.map((item) => (
          <div
            key={item.id}
            className="flex flex-col justify-between rounded-2xl border border-zinc-900/10 bg-white p-5 shadow-2xs"
          >
            <div>
              <div className="flex items-center justify-between gap-2">
                <h2 className="font-mono text-sm font-bold text-zinc-950">{item.prep}</h2>
                <span className="rounded-md bg-zinc-100 px-2 py-0.5 font-mono text-[10px] font-semibold text-zinc-600">
                  {item.category}
                </span>
              </div>
              <p className="mt-2 text-sm leading-relaxed text-zinc-700">{item.rule}</p>

              <div className="mt-3 flex flex-wrap gap-1.5">
                {item.examples.map((ex, i) => (
                  <span
                    key={i}
                    className="rounded-lg border border-zinc-900/8 bg-[#FAF8F4] px-2.5 py-1 font-mono text-xs text-zinc-800"
                  >
                    {ex}
                  </span>
                ))}
              </div>

              {item.contrast && (
                <p className="mt-3 rounded-lg bg-[#3B6CF5]/[0.06] px-3 py-2 text-xs text-[#234DC7]">
                  <strong>Key contrast:</strong> {item.contrast}
                </p>
              )}
            </div>

            <div className="mt-4 flex justify-end">
              <button
                type="button"
                onClick={() => onOpenLesson(item.lessonId)}
                className="inline-flex items-center gap-1 text-xs font-semibold text-zinc-700 transition hover:text-[#234DC7]"
              >
                <span>See 3D Lesson</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Progress Management Footer */}
      <div className="mt-12 flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-zinc-900/10 bg-white/80 p-4">
        <p className="text-xs text-zinc-500">
          Your lesson completions and practice history are saved locally in this browser.
        </p>
        {!confirmReset ? (
          <button
            type="button"
            onClick={() => setConfirmReset(true)}
            className="inline-flex items-center gap-1.5 rounded-lg border border-zinc-900/12 px-3 py-1.5 text-xs font-semibold text-zinc-600 transition hover:border-rose-500/40 hover:text-rose-700"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            <span>Reset Local Progress</span>
          </button>
        ) : (
          <div className="flex items-center gap-2">
            <span className="text-xs font-medium text-rose-700">Clear all progress?</span>
            <button
              type="button"
              onClick={() => {
                onResetProgress();
                setConfirmReset(false);
              }}
              className="rounded-lg bg-rose-600 px-3 py-1 text-xs font-semibold text-white"
            >
              Confirm
            </button>
            <button
              type="button"
              onClick={() => setConfirmReset(false)}
              className="rounded-lg bg-zinc-200 px-3 py-1 text-xs font-semibold text-zinc-700"
            >
              Cancel
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
