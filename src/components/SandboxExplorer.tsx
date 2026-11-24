import React, { useMemo, useState } from 'react';
import { ArrowRight, Box, Sparkles } from 'lucide-react';
import { SANDBOX_CONCEPTS } from '../data/courseData';
import { ACCENT_STYLES } from '../data/theme';
import { SandboxConcept } from '../types/course';
import { ThreeStage } from './ThreeStage';
import { SpeakButton } from './SpeakButton';

type CategoryFilter = 'All' | SandboxConcept['category'];

interface SandboxExplorerProps {
  onOpenLesson: (lessonId: string) => void;
}

const CATEGORIES: CategoryFilter[] = [
  'All',
  'Space',
  'Motion',
  'Time',
  'Nuance',
  'Chunks',
  'Particles',
];

export const SandboxExplorer: React.FC<SandboxExplorerProps> = ({ onOpenLesson }) => {
  const [category, setCategory] = useState<CategoryFilter>('All');
  const [selectedId, setSelectedId] = useState<string>(SANDBOX_CONCEPTS[0].id);

  const filtered = useMemo(
    () =>
      category === 'All'
        ? SANDBOX_CONCEPTS
        : SANDBOX_CONCEPTS.filter((c) => c.category === category),
    [category]
  );

  const activeConcept =
    filtered.find((c) => c.id === selectedId) ?? filtered[0] ?? SANDBOX_CONCEPTS[0];
  const style = ACCENT_STYLES[activeConcept.accent];

  return (
    <div className="mx-auto max-w-7xl px-4 pb-20 pt-8 sm:px-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 font-mono text-xs font-semibold uppercase tracking-wider text-zinc-500">
            <Box className="h-3.5 w-3.5 text-[#3B6CF5]" />
            <span>Interactive 3D Spatial Dictionary</span>
          </div>
          <h1 className="mt-1 font-display text-3xl font-semibold text-zinc-950">
            3D Preposition Sandbox
          </h1>
          <p className="mt-1 max-w-2xl text-sm text-zinc-600">
            Click any spatial schema, path, timeline, relationship, or particle below to inspect its
            live Three.js model from any angle.
          </p>
        </div>

        {/* Category Filter Chips */}
        <div className="flex flex-wrap gap-1.5">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => {
                setCategory(cat);
                const first =
                  cat === 'All'
                    ? SANDBOX_CONCEPTS[0]
                    : SANDBOX_CONCEPTS.find((c) => c.category === cat);
                if (first) setSelectedId(first.id);
              }}
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
      </div>

      <div className="mt-6 grid items-start gap-6 lg:grid-cols-12">
        {/* Left: Concept Selector List */}
        <div className="grid max-h-[620px] grid-cols-1 gap-2 overflow-y-auto pr-1 sm:grid-cols-2 lg:col-span-4 lg:grid-cols-1">
          {filtered.map((item) => {
            const active = item.id === activeConcept.id;
            const itemStyle = ACCENT_STYLES[item.accent];
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setSelectedId(item.id)}
                className={`rounded-xl border p-3.5 text-left transition ${
                  active
                    ? `${itemStyle.border} bg-white ring-2 ${itemStyle.ring} shadow-xs`
                    : 'border-zinc-900/8 bg-white/75 hover:border-zinc-900/20 hover:bg-white'
                }`}
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="font-mono text-sm font-bold text-zinc-950">{item.label}</span>
                  <span
                    className={`rounded-md border px-1.5 py-0.5 font-mono text-[10px] font-semibold ${itemStyle.badge}`}
                  >
                    {item.category}
                  </span>
                </div>
                <p className="mt-1 text-xs font-medium text-zinc-500">{item.schemaTag}</p>
              </button>
            );
          })}
        </div>

        {/* Right: Live 3D Stage + Concept Breakdown */}
        <div className="space-y-4 lg:col-span-8">
          <ThreeStage
            sceneId={activeConcept.sceneId}
            caption={activeConcept.caption}
            heightClass="h-[380px] sm:h-[460px]"
          />

          <div className="rounded-2xl border border-zinc-900/10 bg-white p-5 shadow-2xs">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <span
                    className={`inline-flex items-center gap-1 rounded-md border px-2 py-0.5 font-mono text-xs font-bold ${style.badge}`}
                  >
                    <Sparkles className="h-3 w-3" />
                    {activeConcept.label}
                  </span>
                  <span className="text-xs font-semibold text-zinc-500">
                    {activeConcept.schemaTag}
                  </span>
                </div>
                <p className="mt-2.5 text-sm leading-relaxed text-zinc-700">
                  {activeConcept.oneLiner}
                </p>
              </div>

              <button
                type="button"
                onClick={() => onOpenLesson(activeConcept.relatedLessonId)}
                className="inline-flex shrink-0 items-center gap-1.5 rounded-xl bg-zinc-900 px-3.5 py-2 text-xs font-semibold text-white transition hover:bg-zinc-800"
              >
                <span>Open Full Lesson</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </button>
            </div>

            <div className="mt-4 flex flex-wrap gap-2">
              {activeConcept.examples.map((ex, i) => (
                <div
                  key={i}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-zinc-900/10 bg-[#FAF8F4] py-1 pl-3 pr-1.5 font-mono text-xs text-zinc-800"
                >
                  <span>{ex}</span>
                  <SpeakButton text={ex} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
