import React, { useEffect, useState } from 'react';
import {
  Volume2,
  VolumeX,
  Star,
  Sparkles,
  GraduationCap,
  Award,
  X,
  ArrowRight,
  RotateCcw,
} from 'lucide-react';
import {
  ALL_KIDS_ITEMS,
  KIDS_BUTTON_STYLES,
  KIDS_STICKERS,
  KIDS_WORLDS,
  KidsPrepItem,
  KidsWorldId,
} from '../data/kidsData';
import { KidsStage3D, KidsStageMode } from './KidsStage3D';
import { speakEnglish } from '../utils/speech';
import { playPopSound, playTryAgainSound, playWinSound } from '../utils/sounds';

interface KidsAppProps {
  onSwitchToAdults: () => void;
}

const KIDS_STORAGE_KEY = 'prepospace_kids_v1';

interface KidsSavedState {
  stars: number;
  discoveredIds: string[];
  soundOn: boolean;
}

function loadKidsState(): KidsSavedState {
  try {
    const raw = localStorage.getItem(KIDS_STORAGE_KEY);
    if (!raw) return { stars: 0, discoveredIds: [], soundOn: true };
    const parsed = JSON.parse(raw) as Partial<KidsSavedState>;
    return {
      stars: typeof parsed.stars === 'number' ? parsed.stars : 0,
      discoveredIds: Array.isArray(parsed.discoveredIds) ? parsed.discoveredIds : [],
      soundOn: typeof parsed.soundOn === 'boolean' ? parsed.soundOn : true,
    };
  } catch {
    return { stars: 0, discoveredIds: [], soundOn: true };
  }
}

export const KidsApp: React.FC<KidsAppProps> = ({ onSwitchToAdults }) => {
  const [saved, setSaved] = useState<KidsSavedState>(loadKidsState);
  const [worldId, setWorldId] = useState<KidsWorldId>('toyroom');
  const [mode, setMode] = useState<KidsStageMode>('play');
  const [selectedItemId, setSelectedItemId] = useState<string>(KIDS_WORLDS[0].items[0].id);

  // Game state for Tap-in-3D & Quiz modes
  const [targetIndex, setTargetIndex] = useState(0);
  const [roundWon, setRoundWon] = useState(false);
  const [wrongId, setWrongId] = useState<string | null>(null);
  const [feedbackMsg, setFeedbackMsg] = useState<string | null>(null);
  const [celebrateNonce, setCelebrateNonce] = useState(0);
  const [showStickers, setShowStickers] = useState(false);

  useEffect(() => {
    try {
      localStorage.setItem(KIDS_STORAGE_KEY, JSON.stringify(saved));
    } catch {
      // Ignore quota errors
    }
  }, [saved]);

  const world = KIDS_WORLDS.find((w) => w.id === worldId) ?? KIDS_WORLDS[0];
  const playItem = world.items.find((i) => i.id === selectedItemId) ?? world.items[0];
  const gameTarget: KidsPrepItem = world.items[targetIndex % world.items.length];

  // Which item Pip currently demonstrates on the 3D stage
  const pipDisplayItem: KidsPrepItem | null =
    mode === 'play'
      ? playItem
      : mode === 'quiz'
        ? gameTarget
        : roundWon
          ? gameTarget
          : null;

  const say = (text: string) => {
    if (!saved.soundOn) return;
    speakEnglish(text, { rate: 0.9 });
  };

  const awardStar = (itemId: string) => {
    setSaved((prev) => ({
      ...prev,
      stars: prev.stars + 1,
      discoveredIds: prev.discoveredIds.includes(itemId)
        ? prev.discoveredIds
        : [...prev.discoveredIds, itemId],
    }));
  };

  const handleSelectWorld = (nextWorldId: KidsWorldId) => {
    const nextWorld = KIDS_WORLDS.find((w) => w.id === nextWorldId) ?? KIDS_WORLDS[0];
    setWorldId(nextWorldId);
    setSelectedItemId(nextWorld.items[0].id);
    setTargetIndex(0);
    setRoundWon(false);
    setWrongId(null);
    setFeedbackMsg(null);
    if (saved.soundOn) playPopSound();
  };

  const handleSelectMode = (nextMode: KidsStageMode) => {
    setMode(nextMode);
    setTargetIndex(0);
    setRoundWon(false);
    setWrongId(null);
    setFeedbackMsg(null);
    if (saved.soundOn) {
      playPopSound();
      if (nextMode === 'tap') {
        say(world.items[0].tapPrompt);
      } else if (nextMode === 'quiz') {
        say('Where is Pip? Spin the world to find him!');
      } else {
        say(playItem.sentence);
      }
    }
  };

  const handlePlayTapWord = (item: KidsPrepItem) => {
    setSelectedItemId(item.id);
    setCelebrateNonce((n) => n + 1);
    if (saved.soundOn) playPopSound();
    say(item.sentence);
    setSaved((prev) => ({
      ...prev,
      discoveredIds: prev.discoveredIds.includes(item.id)
        ? prev.discoveredIds
        : [...prev.discoveredIds, item.id],
    }));
  };

  const handleTap3DHotspot = (tappedId: string) => {
    if (roundWon) return;
    if (tappedId === gameTarget.id) {
      setRoundWon(true);
      setWrongId(null);
      setFeedbackMsg(`Yay! ${gameTarget.sentence}`);
      setCelebrateNonce((n) => n + 1);
      awardStar(gameTarget.id);
      if (saved.soundOn) {
        playWinSound();
        setTimeout(() => say(`Great job! ${gameTarget.sentence}`), 260);
      }
    } else {
      const tappedItem = world.items.find((i) => i.id === tappedId);
      setWrongId(tappedId);
      setFeedbackMsg(
        tappedItem
          ? `Oops! That spot is "${tappedItem.word.toUpperCase()}"! Try tapping "${gameTarget.word.toUpperCase()}"!`
          : 'Try another glowing star!'
      );
      if (saved.soundOn) {
        playTryAgainSound();
        say(`Try again! ${gameTarget.tapPrompt}`);
      }
    }
  };

  const handleQuizAnswer = (chosenId: string) => {
    if (roundWon) return;
    if (chosenId === gameTarget.id) {
      setRoundWon(true);
      setWrongId(null);
      setFeedbackMsg(`Woohoo! ${gameTarget.sentence}`);
      setCelebrateNonce((n) => n + 1);
      awardStar(gameTarget.id);
      if (saved.soundOn) {
        playWinSound();
        setTimeout(() => say(`Yes! ${gameTarget.sentence}`), 260);
      }
    } else {
      setWrongId(chosenId);
      setFeedbackMsg(`Almost! ${gameTarget.quizClue}`);
      if (saved.soundOn) {
        playTryAgainSound();
        say(`Almost! ${gameTarget.quizClue}`);
      }
    }
  };

  const handleNextRound = () => {
    const nextIdx = (targetIndex + 1) % world.items.length;
    setTargetIndex(nextIdx);
    setRoundWon(false);
    setWrongId(null);
    setFeedbackMsg(null);
    const nextItem = world.items[nextIdx];
    if (saved.soundOn) {
      playPopSound();
      if (mode === 'tap') {
        say(nextItem.tapPrompt);
      } else if (mode === 'quiz') {
        say('Where is Pip now?');
      }
    }
  };

  const unlockedStickers = KIDS_STICKERS.filter((s) => saved.stars >= s.starsNeeded).length;

  return (
    <div
      className={`safe-pt safe-pb flex min-h-[100dvh] flex-col bg-gradient-to-br ${world.bgTint} text-zinc-900 lg:h-[100dvh] lg:overflow-hidden`}
    >
      {/* Top Kid-Friendly iPad Header */}
      <header className="flex shrink-0 flex-wrap items-center justify-between gap-2 px-3 py-2.5 sm:px-5">
        <div className="flex items-center gap-2.5">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-amber-400 text-2xl shadow-sm">
            🐶
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-display text-lg font-bold tracking-tight text-zinc-950 sm:text-xl">
                Pip’s 3D World
              </span>
              <span className="rounded-full bg-amber-400/90 px-2.5 py-0.5 text-[11px] font-extrabold uppercase text-amber-950">
                Kids
              </span>
            </div>
            <p className="hidden text-xs font-medium text-zinc-600 sm:block">
              Learn English prepositions with Pip the Puppy!
            </p>
          </div>
        </div>

        {/* World Switcher Pills (Centered on iPad Landscape) */}
        <div className="order-3 flex w-full items-center gap-1.5 overflow-x-auto pb-1 lg:order-2 lg:w-auto lg:pb-0">
          {KIDS_WORLDS.map((w) => {
            const active = w.id === world.id;
            return (
              <button
                key={w.id}
                type="button"
                onClick={() => handleSelectWorld(w.id)}
                className={`inline-flex shrink-0 items-center gap-1.5 rounded-2xl border-b-4 px-3.5 py-2 text-sm font-extrabold transition active:translate-y-0.5 ${
                  active
                    ? 'border-sky-700 bg-sky-500 text-white shadow-sm'
                    : 'border-zinc-900/10 bg-white/90 text-zinc-800 hover:bg-white'
                }`}
              >
                <span className="text-base">{w.emoji}</span>
                <span>{w.name}</span>
              </button>
            );
          })}
        </div>

        {/* Right Controls: Stars, Stickers, Sound, Switch to Adults */}
        <div className="order-2 flex items-center gap-2 lg:order-3">
          <button
            type="button"
            onClick={() => setShowStickers(true)}
            className="inline-flex items-center gap-1.5 rounded-2xl border-b-4 border-amber-500 bg-amber-300 px-3.5 py-2 text-sm font-extrabold text-amber-950 shadow-xs transition active:translate-y-0.5"
          >
            <Star className="h-4 w-4 fill-amber-600 text-amber-700" />
            <span>{saved.stars}</span>
            <span className="hidden text-xs sm:inline">
              · {unlockedStickers}/{KIDS_STICKERS.length} 🏆
            </span>
          </button>

          <button
            type="button"
            onClick={() => setSaved((p) => ({ ...p, soundOn: !p.soundOn }))}
            title={saved.soundOn ? 'Mute sounds' : 'Unmute sounds'}
            className="flex h-10 w-10 items-center justify-center rounded-2xl border-b-4 border-zinc-900/10 bg-white/90 text-zinc-800 active:translate-y-0.5"
          >
            {saved.soundOn ? <Volume2 className="h-5 w-5 text-sky-600" /> : <VolumeX className="h-5 w-5 text-zinc-400" />}
          </button>

          <button
            type="button"
            onClick={onSwitchToAdults}
            className="inline-flex items-center gap-1.5 rounded-2xl border-b-4 border-zinc-900/15 bg-white/90 px-3 py-2 text-xs font-bold text-zinc-700 hover:bg-white active:translate-y-0.5"
          >
            <GraduationCap className="h-4 w-4 text-[#3B6CF5]" />
            <span className="hidden sm:inline">B1–B2</span>
          </button>
        </div>
      </header>

      {/* Main iPad Split Stage: 3D World Left/Top + Big Chunky Controls Right/Bottom */}
      <div className="grid flex-1 gap-3 px-3 pb-3 sm:gap-4 sm:px-5 sm:pb-4 lg:min-h-0 lg:grid-cols-12">
        {/* 3D Interactive Puppy World */}
        <div className="h-[46vh] min-h-[300px] sm:h-[52vh] lg:col-span-7 lg:h-full">
          <KidsStage3D
            world={world}
            mode={mode}
            activeItem={pipDisplayItem}
            celebrateNonce={celebrateNonce}
            wrongHotspotId={wrongId}
            wonHotspotId={roundWon ? gameTarget.id : null}
            onTapHotspot={handleTap3DHotspot}
          />
        </div>

        {/* Right/Bottom Chunky iPad Control Deck */}
        <div className="flex flex-col justify-between gap-3 rounded-3xl border-2 border-white/80 bg-white/85 p-4 shadow-sm backdrop-blur-md sm:p-5 lg:col-span-5 lg:h-full lg:overflow-y-auto">
          <div>
            {/* 3 Giant Mode Tabs */}
            <div className="grid grid-cols-3 gap-2 rounded-2xl bg-sky-950/[0.06] p-1.5">
              {(
                [
                  { id: 'play', label: '🐾 Play' },
                  { id: 'tap', label: '⭐ Tap 3D' },
                  { id: 'quiz', label: '❓ Quiz' },
                ] as { id: KidsStageMode; label: string }[]
              ).map((m) => (
                <button
                  key={m.id}
                  type="button"
                  onClick={() => handleSelectMode(m.id)}
                  className={`rounded-xl py-2.5 text-sm font-extrabold transition sm:text-base ${
                    mode === m.id
                      ? 'bg-zinc-900 text-white shadow-sm'
                      : 'text-zinc-700 hover:bg-white/70'
                  }`}
                >
                  {m.label}
                </button>
              ))}
            </div>

            {/* MODE 1: PLAY WITH PIP */}
            {mode === 'play' && (
              <div className="mt-4 space-y-4">
                {/* Big Spoken Sentence Card */}
                <div className="rounded-2xl border-2 border-sky-200 bg-sky-50/80 p-4">
                  <div className="flex items-center justify-between gap-3">
                    <span
                      className={`inline-flex items-center gap-1.5 rounded-xl px-3 py-1 text-base font-black uppercase tracking-wide ${KIDS_BUTTON_STYLES[playItem.color].pill}`}
                    >
                      <span>{playItem.emoji}</span>
                      <span>{playItem.word}</span>
                    </span>
                    <button
                      type="button"
                      onClick={() => say(playItem.sentence)}
                      className="inline-flex items-center gap-1.5 rounded-2xl border-b-4 border-sky-700 bg-sky-500 px-4 py-2 text-sm font-extrabold text-white active:translate-y-0.5"
                    >
                      <Volume2 className="h-4 w-4" />
                      <span>Listen</span>
                    </button>
                  </div>
                  <p className="mt-3 font-display text-2xl font-bold leading-snug text-zinc-950 sm:text-3xl">
                    {playItem.sentence}
                  </p>
                </div>

                {/* Giant Tactile Preposition Buttons */}
                <div>
                  <p className="mb-2 text-xs font-bold uppercase tracking-wider text-zinc-500">
                    Tap a word to move Pip!
                  </p>
                  <div className="grid grid-cols-2 gap-2.5">
                    {world.items.map((item) => {
                      const active = item.id === playItem.id;
                      const st = KIDS_BUTTON_STYLES[item.color];
                      return (
                        <button
                          key={item.id}
                          type="button"
                          onClick={() => handlePlayTapWord(item)}
                          className={`flex min-h-[68px] flex-col items-center justify-center rounded-2xl border-2 border-b-4 px-3 py-3 text-center transition active:translate-y-0.5 ${
                            active ? st.active : st.idle
                          }`}
                        >
                          <span className="text-2xl">{item.emoji}</span>
                          <span className="mt-1 text-lg font-black uppercase tracking-wide">
                            {item.word}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

            {/* MODE 2: TAP IN 3D HIDE & SEEK */}
            {mode === 'tap' && (
              <div className="mt-4 space-y-4">
                <div className="rounded-2xl border-2 border-amber-300 bg-amber-50 p-4">
                  <div className="flex items-center justify-between gap-2">
                    <span className="rounded-xl bg-amber-400 px-3 py-1 text-xs font-black uppercase text-amber-950">
                      Help Pip! ({(targetIndex % world.items.length) + 1}/{world.items.length})
                    </span>
                    <button
                      type="button"
                      onClick={() => say(gameTarget.tapPrompt)}
                      className="inline-flex items-center gap-1.5 rounded-2xl border-b-4 border-amber-600 bg-amber-400 px-3.5 py-2 text-xs font-extrabold text-amber-950 active:translate-y-0.5"
                    >
                      <Volume2 className="h-4 w-4" />
                      <span>Hear It</span>
                    </button>
                  </div>
                  <p className="mt-3 font-display text-2xl font-bold leading-snug text-zinc-950">
                    {gameTarget.tapPrompt}
                  </p>
                  <p className="mt-1.5 text-sm font-medium text-amber-900/80">
                    Tap one of the spinning ⭐ stars inside the 3D world!
                  </p>
                </div>

                {/* Big fallback numbered buttons for accessibility / tiny hands */}
                <div className="grid grid-cols-2 gap-2">
                  {world.items.map((item, idx) => (
                    <button
                      key={item.id}
                      type="button"
                      disabled={roundWon}
                      onClick={() => handleTap3DHotspot(item.id)}
                      className={`min-h-[56px] rounded-2xl border-2 border-b-4 px-3 py-2.5 text-sm font-extrabold transition active:translate-y-0.5 ${
                        roundWon && item.id === gameTarget.id
                          ? 'border-emerald-600 bg-emerald-500 text-white'
                          : wrongId === item.id
                            ? 'border-rose-400 bg-rose-100 text-rose-800'
                            : 'border-sky-300 bg-sky-50 text-sky-900 hover:bg-sky-100'
                      }`}
                    >
                      ⭐ Star #{idx + 1}
                    </button>
                  ))}
                </div>

                {feedbackMsg && (
                  <div
                    className={`rounded-2xl p-4 text-base font-bold ${
                      roundWon
                        ? 'bg-emerald-500/15 text-emerald-950'
                        : 'bg-amber-500/15 text-amber-950'
                    }`}
                  >
                    {feedbackMsg}
                  </div>
                )}

                {roundWon && (
                  <button
                    type="button"
                    onClick={handleNextRound}
                    className="inline-flex min-h-[60px] w-full items-center justify-center gap-2 rounded-2xl border-b-4 border-emerald-700 bg-emerald-500 px-5 py-3 text-lg font-black text-white shadow-sm active:translate-y-0.5"
                  >
                    <span>Next Star Challenge!</span>
                    <ArrowRight className="h-5 w-5" />
                  </button>
                )}
              </div>
            )}

            {/* MODE 3: WHERE IS PIP? QUIZ */}
            {mode === 'quiz' && (
              <div className="mt-4 space-y-4">
                <div className="rounded-2xl border-2 border-violet-200 bg-violet-50 p-4">
                  <div className="flex items-center justify-between gap-2">
                    <span className="rounded-xl bg-violet-500 px-3 py-1 text-xs font-black uppercase text-white">
                      Where is Pip? ({(targetIndex % world.items.length) + 1}/{world.items.length})
                    </span>
                    <button
                      type="button"
                      onClick={() => say(`Where is Pip? ${gameTarget.quizClue}`)}
                      className="inline-flex items-center gap-1.5 rounded-2xl border-b-4 border-violet-700 bg-violet-500 px-3.5 py-2 text-xs font-extrabold text-white active:translate-y-0.5"
                    >
                      <Volume2 className="h-4 w-4" />
                      <span>Hint</span>
                    </button>
                  </div>
                  <p className="mt-3 font-display text-2xl font-bold text-zinc-950">
                    Look at Pip in 3D! Where is Pip?
                  </p>
                  <p className="mt-1 text-sm font-medium text-violet-900/75">
                    Tip: Spin the world with your finger if Pip is hiding!
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-2.5">
                  {world.items.map((item) => {
                    const st = KIDS_BUTTON_STYLES[item.color];
                    const isWinner = roundWon && item.id === gameTarget.id;
                    const isWrong = wrongId === item.id;

                    return (
                      <button
                        key={item.id}
                        type="button"
                        disabled={roundWon}
                        onClick={() => handleQuizAnswer(item.id)}
                        className={`flex min-h-[68px] flex-col items-center justify-center rounded-2xl border-2 border-b-4 px-3 py-3 text-center transition active:translate-y-0.5 ${
                          isWinner
                            ? 'border-emerald-700 bg-emerald-500 text-white shadow-md'
                            : isWrong
                              ? 'border-rose-400 bg-rose-100 text-rose-800'
                              : st.idle
                        }`}
                      >
                        <span className="text-2xl">{item.emoji}</span>
                        <span className="mt-1 text-lg font-black uppercase tracking-wide">
                          {item.word}
                        </span>
                      </button>
                    );
                  })}
                </div>

                {feedbackMsg && (
                  <div
                    className={`rounded-2xl p-4 text-base font-bold ${
                      roundWon
                        ? 'bg-emerald-500/15 text-emerald-950'
                        : 'bg-amber-500/15 text-amber-950'
                    }`}
                  >
                    {feedbackMsg}
                  </div>
                )}

                {roundWon && (
                  <button
                    type="button"
                    onClick={handleNextRound}
                    className="inline-flex min-h-[60px] w-full items-center justify-center gap-2 rounded-2xl border-b-4 border-emerald-700 bg-emerald-500 px-5 py-3 text-lg font-black text-white shadow-sm active:translate-y-0.5"
                  >
                    <span>Find Pip Again!</span>
                    <ArrowRight className="h-5 w-5" />
                  </button>
                )}
              </div>
            )}
          </div>

          {/* Bottom Mini Progress Footer */}
          <div className="mt-2 flex items-center justify-between rounded-2xl bg-zinc-900/[0.04] px-3.5 py-2.5 text-xs font-bold text-zinc-600">
            <span className="inline-flex items-center gap-1.5">
              <Sparkles className="h-4 w-4 text-amber-500" />
              <span>
                Words explored: {saved.discoveredIds.length} / {ALL_KIDS_ITEMS.length}
              </span>
            </span>
            <button
              type="button"
              onClick={() => setShowStickers(true)}
              className="inline-flex items-center gap-1 text-sky-700 hover:underline"
            >
              <Award className="h-4 w-4" />
              <span>Stickers</span>
            </button>
          </div>
        </div>
      </div>

      {/* Sticker Book Trophy Modal */}
      {showStickers && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-zinc-950/40 p-4 backdrop-blur-xs"
          onClick={() => setShowStickers(false)}
        >
          <div
            className="w-full max-w-md rounded-3xl border-4 border-amber-300 bg-white p-6 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-2xl">🏆</span>
                <h2 className="font-display text-2xl font-bold text-zinc-950">
                  My Sticker Book
                </h2>
              </div>
              <button
                type="button"
                onClick={() => setShowStickers(false)}
                className="flex h-9 w-9 items-center justify-center rounded-full bg-zinc-100 text-zinc-600"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <p className="mt-1 text-sm font-medium text-zinc-600">
              You have <strong className="text-amber-600">{saved.stars} ⭐ stars</strong>! Play
              Tap 3D and Quiz to unlock every sticker!
            </p>

            <div className="mt-4 grid grid-cols-2 gap-3">
              {KIDS_STICKERS.map((st) => {
                const unlocked = saved.stars >= st.starsNeeded;
                return (
                  <div
                    key={st.id}
                    className={`flex flex-col items-center rounded-2xl border-2 p-3.5 text-center ${
                      unlocked
                        ? 'border-amber-300 bg-amber-50'
                        : 'border-dashed border-zinc-200 bg-zinc-50 opacity-65'
                    }`}
                  >
                    <span className={`text-4xl ${unlocked ? '' : 'grayscale'}`}>
                      {st.emoji}
                    </span>
                    <span className="mt-1.5 text-sm font-extrabold text-zinc-900">
                      {st.name}
                    </span>
                    <span className="mt-0.5 text-xs font-bold text-amber-700">
                      {unlocked ? 'Unlocked! ✨' : `Need ${st.starsNeeded} ⭐`}
                    </span>
                  </div>
                );
              })}
            </div>

            <div className="mt-5 flex items-center justify-between">
              <button
                type="button"
                onClick={() => setSaved({ stars: 0, discoveredIds: [], soundOn: saved.soundOn })}
                className="inline-flex items-center gap-1 text-xs font-bold text-zinc-400 hover:text-rose-600"
              >
                <RotateCcw className="h-3.5 w-3.5" />
                <span>Reset Stars</span>
              </button>
              <button
                type="button"
                onClick={() => setShowStickers(false)}
                className="rounded-2xl border-b-4 border-sky-700 bg-sky-500 px-5 py-2.5 text-sm font-extrabold text-white active:translate-y-0.5"
              >
                Keep Playing!
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
