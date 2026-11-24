import React, { useState } from 'react';
import { Volume2, Square } from 'lucide-react';
import { isSpeechSupported, speakEnglish, stopSpeaking } from '../utils/speech';

interface SpeakButtonProps {
  text: string;
  size?: 'xs' | 'sm';
  label?: string;
  slow?: boolean;
}

export const SpeakButton: React.FC<SpeakButtonProps> = ({
  text,
  size = 'xs',
  label,
  slow = false,
}) => {
  const [speaking, setSpeaking] = useState(false);

  if (!isSpeechSupported()) return null;

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (speaking) {
      stopSpeaking();
      setSpeaking(false);
      return;
    }
    setSpeaking(true);
    const ok = speakEnglish(text, {
      rate: slow ? 0.8 : 0.96,
      onEnd: () => setSpeaking(false),
    });
    if (!ok) setSpeaking(false);
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      title={speaking ? 'Stop audio' : 'Listen to natural pronunciation'}
      className={`inline-flex items-center gap-1 rounded-lg border transition ${
        speaking
          ? 'border-[#3B6CF5]/40 bg-[#3B6CF5]/15 text-[#234DC7]'
          : 'border-zinc-900/10 bg-white/90 text-zinc-600 hover:border-zinc-900/25 hover:text-zinc-950'
      } ${size === 'xs' ? 'px-2 py-1 text-[11px] font-medium' : 'px-2.5 py-1.5 text-xs font-semibold'}`}
    >
      {speaking ? (
        <Square className="h-3 w-3 fill-current" />
      ) : (
        <Volume2 className="h-3.5 w-3.5" />
      )}
      {label && <span>{speaking ? 'Stop' : label}</span>}
    </button>
  );
};
