import { AccentColor } from '../types/course';

export const ACCENT_HEX: Record<AccentColor, string> = {
  cobalt: '#3B6CF5',
  coral: '#E85D3F',
  emerald: '#0D9488',
  amber: '#D97706',
  violet: '#7C3AED',
  rose: '#E11D48',
};

export const ACCENT_STYLES: Record<
  AccentColor,
  {
    badge: string;
    pill: string;
    border: string;
    text: string;
    softBg: string;
    ring: string;
    dot: string;
  }
> = {
  cobalt: {
    badge: 'bg-[#3B6CF5]/12 text-[#234DC7] border-[#3B6CF5]/25',
    pill: 'bg-[#3B6CF5] text-white',
    border: 'border-[#3B6CF5]/30',
    text: 'text-[#234DC7]',
    softBg: 'bg-[#3B6CF5]/[0.06]',
    ring: 'ring-[#3B6CF5]/30',
    dot: 'bg-[#3B6CF5]',
  },
  coral: {
    badge: 'bg-[#E85D3F]/12 text-[#C24124] border-[#E85D3F]/25',
    pill: 'bg-[#E85D3F] text-white',
    border: 'border-[#E85D3F]/30',
    text: 'text-[#C24124]',
    softBg: 'bg-[#E85D3F]/[0.06]',
    ring: 'ring-[#E85D3F]/30',
    dot: 'bg-[#E85D3F]',
  },
  emerald: {
    badge: 'bg-[#0D9488]/12 text-[#0F766E] border-[#0D9488]/25',
    pill: 'bg-[#0D9488] text-white',
    border: 'border-[#0D9488]/30',
    text: 'text-[#0F766E]',
    softBg: 'bg-[#0D9488]/[0.06]',
    ring: 'ring-[#0D9488]/30',
    dot: 'bg-[#0D9488]',
  },
  amber: {
    badge: 'bg-[#D97706]/12 text-[#B45309] border-[#D97706]/25',
    pill: 'bg-[#D97706] text-white',
    border: 'border-[#D97706]/30',
    text: 'text-[#B45309]',
    softBg: 'bg-[#D97706]/[0.06]',
    ring: 'ring-[#D97706]/30',
    dot: 'bg-[#D97706]',
  },
  violet: {
    badge: 'bg-[#7C3AED]/12 text-[#6D28D9] border-[#7C3AED]/25',
    pill: 'bg-[#7C3AED] text-white',
    border: 'border-[#7C3AED]/30',
    text: 'text-[#6D28D9]',
    softBg: 'bg-[#7C3AED]/[0.06]',
    ring: 'ring-[#7C3AED]/30',
    dot: 'bg-[#7C3AED]',
  },
  rose: {
    badge: 'bg-[#E11D48]/12 text-[#BE123C] border-[#E11D48]/25',
    pill: 'bg-[#E11D48] text-white',
    border: 'border-[#E11D48]/30',
    text: 'text-[#BE123C]',
    softBg: 'bg-[#E11D48]/[0.06]',
    ring: 'ring-[#E11D48]/30',
    dot: 'bg-[#E11D48]',
  },
};
