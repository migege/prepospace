export type KidsWorldId = 'toyroom' | 'backyard' | 'playground' | 'park';

export type KidsButtonColor = 'sky' | 'coral' | 'emerald' | 'amber' | 'violet' | 'pink';

export interface KidsPrepItem {
  id: string;
  worldId: KidsWorldId;
  word: string;
  emoji: string;
  color: KidsButtonColor;
  sentence: string;
  tapPrompt: string;
  quizClue: string;
  /** Center of clickable star hotspot in 3D Tap-to-Place mode */
  hotspotPos: [number, number, number];
  /** Static target position for Pip, OR animated path points */
  pipPos: [number, number, number];
  pipFacingY?: number;
  pipPath?: [number, number, number][];
  pathLoop?: 'loop' | 'circle-pond';
}

export interface KidsWorld {
  id: KidsWorldId;
  number: number;
  name: string;
  emoji: string;
  subtitle: string;
  bgTint: string;
  cameraPos: [number, number, number];
  cameraTarget: [number, number, number];
  items: KidsPrepItem[];
}

export const KIDS_WORLDS: KidsWorld[] = [
  {
    id: 'toyroom',
    number: 1,
    name: 'Toy Room',
    emoji: '🧸',
    subtitle: 'in · on · under',
    bgTint: 'from-[#E0F2FE] to-[#FEF9C3]',
    cameraPos: [3.8, 3.3, 5.2],
    cameraTarget: [0, 0.85, 0],
    items: [
      {
        id: 'kids-in',
        worldId: 'toyroom',
        word: 'in',
        emoji: '📦',
        color: 'sky',
        sentence: 'Pip is IN the toy box!',
        tapPrompt: 'Tap to put Pip IN the toy box!',
        quizClue: 'Look inside the blue box!',
        hotspotPos: [-1.55, 0.72, 0],
        pipPos: [-1.55, 0.42, 0],
        pipFacingY: 0.4,
      },
      {
        id: 'kids-on',
        worldId: 'toyroom',
        word: 'on',
        emoji: '🪑',
        color: 'coral',
        sentence: 'Pip is ON the table!',
        tapPrompt: 'Tap to put Pip ON the yellow table!',
        quizClue: 'Look right on top of the table!',
        hotspotPos: [1.35, 1.55, 0],
        pipPos: [1.35, 1.32, 0],
        pipFacingY: -0.35,
      },
      {
        id: 'kids-under',
        worldId: 'toyroom',
        word: 'under',
        emoji: '🙈',
        color: 'violet',
        sentence: 'Pip is UNDER the table!',
        tapPrompt: 'Tap to hide Pip UNDER the table!',
        quizClue: 'Peek below the yellow table!',
        hotspotPos: [1.35, 0.42, 0],
        pipPos: [1.35, 0.16, 0],
        pipFacingY: -0.25,
      },
    ],
  },
  {
    id: 'backyard',
    number: 2,
    name: 'Sunny House',
    emoji: '🏡',
    subtitle: 'in front of · behind · next to · between',
    bgTint: 'from-[#DCFCE7] to-[#FEF3C7]',
    cameraPos: [4.2, 3.8, 5.8],
    cameraTarget: [0.1, 0.9, 0.1],
    items: [
      {
        id: 'kids-in-front-of',
        worldId: 'backyard',
        word: 'in front of',
        emoji: '🚪',
        color: 'coral',
        sentence: 'Pip is IN FRONT OF the house!',
        tapPrompt: 'Tap to put Pip IN FRONT OF the house door!',
        quizClue: 'Right by the front door!',
        hotspotPos: [-0.95, 0.45, 1.45],
        pipPos: [-0.95, 0.16, 1.45],
        pipFacingY: 0,
      },
      {
        id: 'kids-behind',
        worldId: 'backyard',
        word: 'behind',
        emoji: '👀',
        color: 'violet',
        sentence: 'Pip is BEHIND the house! Peek-a-boo!',
        tapPrompt: 'Tap to hide Pip BEHIND the house!',
        quizClue: 'Spin the world to peek around the back!',
        hotspotPos: [-0.95, 0.45, -1.65],
        pipPos: [-0.95, 0.16, -1.65],
        pipFacingY: Math.PI,
      },
      {
        id: 'kids-next-to',
        worldId: 'backyard',
        word: 'next to',
        emoji: '🤝',
        color: 'sky',
        sentence: 'Pip is NEXT TO the house!',
        tapPrompt: 'Tap to put Pip NEXT TO the side of the house!',
        quizClue: 'Right beside the wall of the house!',
        hotspotPos: [-2.55, 0.45, 0.1],
        pipPos: [-2.55, 0.16, 0.1],
        pipFacingY: 0.5,
      },
      {
        id: 'kids-between',
        worldId: 'backyard',
        word: 'between',
        emoji: '🌳',
        color: 'emerald',
        sentence: 'Pip is BETWEEN the two apple trees!',
        tapPrompt: 'Tap to put Pip BETWEEN the two apple trees!',
        quizClue: 'Right in the middle of the two trees!',
        hotspotPos: [2.05, 0.45, 0.05],
        pipPos: [2.05, 0.16, 0.05],
        pipFacingY: -0.4,
      },
    ],
  },
  {
    id: 'playground',
    number: 3,
    name: 'Playground',
    emoji: '🌈',
    subtitle: 'into · out of · over · through',
    bgTint: 'from-[#FCE7F3] to-[#E0E7FF]',
    cameraPos: [3.8, 3.6, 6.0],
    cameraTarget: [0, 0.9, 0],
    items: [
      {
        id: 'kids-into',
        worldId: 'playground',
        word: 'into',
        emoji: '📥',
        color: 'sky',
        sentence: 'Pip jumps INTO the magic box!',
        tapPrompt: 'Tap the box to make Pip jump INTO it!',
        quizClue: 'Watch Pip hop from outside to inside!',
        hotspotPos: [-2.15, 0.85, 0.65],
        pipPos: [-2.15, 0.42, 0.65],
        pipPath: [
          [-3.25, 0.16, 1.55],
          [-2.75, 1.65, 1.1],
          [-2.15, 0.42, 0.65],
        ],
        pathLoop: 'loop',
      },
      {
        id: 'kids-out-of',
        worldId: 'playground',
        word: 'out of',
        emoji: '📤',
        color: 'amber',
        sentence: 'Pip pops OUT OF the magic box!',
        tapPrompt: 'Tap outside the box to make Pip pop OUT OF it!',
        quizClue: 'Watch Pip leap from inside to outside!',
        hotspotPos: [-2.95, 0.45, 1.85],
        pipPos: [-2.95, 0.16, 1.85],
        pipPath: [
          [-2.15, 0.42, 0.65],
          [-2.6, 1.75, 1.25],
          [-3.15, 0.16, 1.85],
        ],
        pathLoop: 'loop',
      },
      {
        id: 'kids-over',
        worldId: 'playground',
        word: 'over',
        emoji: '🌈',
        color: 'pink',
        sentence: 'Pip leaps OVER the rainbow fence!',
        tapPrompt: 'Tap above the rainbow fence so Pip leaps OVER it!',
        quizClue: 'Watch Pip jump high across the rainbow fence!',
        hotspotPos: [0.25, 1.65, 0.85],
        pipPos: [0.25, 1.55, 0.85],
        pipPath: [
          [-0.75, 0.16, 1.75],
          [0.25, 1.85, 0.85],
          [1.25, 0.16, -0.05],
        ],
        pathLoop: 'loop',
      },
      {
        id: 'kids-through',
        worldId: 'playground',
        word: 'through',
        emoji: '🚇',
        color: 'emerald',
        sentence: 'Pip zooms THROUGH the striped tunnel!',
        tapPrompt: 'Tap the tunnel to make Pip zoom THROUGH it!',
        quizClue: 'Watch Pip run straight inside the tunnel!',
        hotspotPos: [1.55, 0.82, -1.25],
        pipPos: [1.55, 0.32, -1.25],
        pipPath: [
          [-0.25, 0.28, -1.25],
          [1.55, 0.28, -1.25],
          [3.35, 0.28, -1.25],
        ],
        pathLoop: 'loop',
      },
    ],
  },
  {
    id: 'park',
    number: 4,
    name: 'Duck Park',
    emoji: '🦆',
    subtitle: 'up · down · around',
    bgTint: 'from-[#CCFBF1] to-[#FEF9C3]',
    cameraPos: [4.0, 3.6, 5.9],
    cameraTarget: [0.1, 0.85, 0],
    items: [
      {
        id: 'kids-up',
        worldId: 'park',
        word: 'up',
        emoji: '⬆️',
        color: 'emerald',
        sentence: 'Pip climbs UP the green hill!',
        tapPrompt: 'Tap the stairs to make Pip climb UP the hill!',
        quizClue: 'Watch Pip step higher and higher!',
        hotspotPos: [-2.05, 1.15, 0.45],
        pipPos: [-1.45, 1.62, 0],
        pipPath: [
          [-2.85, 0.16, 0.65],
          [-2.15, 0.92, 0.32],
          [-1.45, 1.65, 0],
        ],
        pathLoop: 'loop',
      },
      {
        id: 'kids-down',
        worldId: 'park',
        word: 'down',
        emoji: '🛝',
        color: 'amber',
        sentence: 'Pip slides DOWN the yellow slide!',
        tapPrompt: 'Tap the yellow slide so Pip zooms DOWN!',
        quizClue: 'Wheee! Watch Pip go from top to bottom!',
        hotspotPos: [-0.35, 0.98, 0.35],
        pipPos: [0.45, 0.16, 0.65],
        pipPath: [
          [-1.25, 1.65, 0],
          [-0.35, 0.9, 0.32],
          [0.55, 0.16, 0.65],
        ],
        pathLoop: 'loop',
      },
      {
        id: 'kids-around',
        worldId: 'park',
        word: 'around',
        emoji: '🔄',
        color: 'sky',
        sentence: 'Pip runs AROUND the duck pond!',
        tapPrompt: 'Tap near the pond so Pip runs AROUND it!',
        quizClue: 'Watch Pip run in a happy circle!',
        hotspotPos: [2.05, 0.45, 1.15],
        pipPos: [2.05, 0.16, 1.15],
        pathLoop: 'circle-pond',
      },
    ],
  },
];

export const ALL_KIDS_ITEMS: KidsPrepItem[] = KIDS_WORLDS.flatMap((w) => w.items);

export const KIDS_BUTTON_STYLES: Record<
  KidsButtonColor,
  { idle: string; active: string; pill: string; hex: number }
> = {
  sky: {
    idle: 'bg-[#E0F2FE] text-[#0369A1] border-[#38BDF8] hover:bg-[#BAE6FD]',
    active: 'bg-[#0284C7] text-white border-[#0369A1] shadow-md',
    pill: 'bg-[#0284C7] text-white',
    hex: 0x0284c7,
  },
  coral: {
    idle: 'bg-[#FFEDD5] text-[#C2410C] border-[#FB923C] hover:bg-[#FED7AA]',
    active: 'bg-[#EA580C] text-white border-[#C2410C] shadow-md',
    pill: 'bg-[#EA580C] text-white',
    hex: 0xea580c,
  },
  emerald: {
    idle: 'bg-[#D1FAE5] text-[#047857] border-[#34D399] hover:bg-[#A7F3D0]',
    active: 'bg-[#059669] text-white border-[#047857] shadow-md',
    pill: 'bg-[#059669] text-white',
    hex: 0x059669,
  },
  amber: {
    idle: 'bg-[#FEF3C7] text-[#B45309] border-[#FBBF24] hover:bg-[#FDE68A]',
    active: 'bg-[#D97706] text-white border-[#B45309] shadow-md',
    pill: 'bg-[#D97706] text-white',
    hex: 0xd97706,
  },
  violet: {
    idle: 'bg-[#EDE9FE] text-[#6D28D9] border-[#A78BFA] hover:bg-[#DDD6FE]',
    active: 'bg-[#7C3AED] text-white border-[#6D28D9] shadow-md',
    pill: 'bg-[#7C3AED] text-white',
    hex: 0x7c3aed,
  },
  pink: {
    idle: 'bg-[#FCE7F3] text-[#BE185D] border-[#F472B6] hover:bg-[#FBCFE8]',
    active: 'bg-[#DB2777] text-white border-[#BE185D] shadow-md',
    pill: 'bg-[#DB2777] text-white',
    hex: 0xdb2777,
  },
};

export interface KidsSticker {
  id: string;
  starsNeeded: number;
  emoji: string;
  name: string;
}

export const KIDS_STICKERS: KidsSticker[] = [
  { id: 'st-1', starsNeeded: 2, emoji: '🐶', name: 'Pip’s Best Friend' },
  { id: 'st-2', starsNeeded: 5, emoji: '📦', name: 'Box Explorer' },
  { id: 'st-3', starsNeeded: 9, emoji: '🌈', name: 'Rainbow Jumper' },
  { id: 'st-4', starsNeeded: 14, emoji: '🦆', name: 'Duck Park Hero' },
  { id: 'st-5', starsNeeded: 20, emoji: '👑', name: 'Preposition Star' },
];
