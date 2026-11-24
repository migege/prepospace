// Lightweight Web Speech API helper for spoken pronunciation & stress contrast

let preferredVoice: SpeechSynthesisVoice | null = null;

function pickEnglishVoice(): SpeechSynthesisVoice | null {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) return null;
  const voices = window.speechSynthesis.getVoices();
  if (!voices.length) return null;

  const preferredNames = [
    'Samantha',
    'Google US English',
    'Daniel',
    'Alex',
    'Karen',
    'Moira',
    'Microsoft Aria',
    'Microsoft Guy',
  ];

  for (const name of preferredNames) {
    const match = voices.find((v) => v.name.includes(name) && v.lang.startsWith('en'));
    if (match) return match;
  }

  return (
    voices.find((v) => v.lang === 'en-US') ||
    voices.find((v) => v.lang === 'en-GB') ||
    voices.find((v) => v.lang.startsWith('en')) ||
    null
  );
}

export function isSpeechSupported(): boolean {
  return typeof window !== 'undefined' && 'speechSynthesis' in window;
}

export function speakEnglish(
  text: string,
  options?: { rate?: number; onEnd?: () => void }
): boolean {
  if (!isSpeechSupported()) return false;

  // Clean zero-preposition markers for natural spoken delivery
  const spokenText = text
    .replace(/Ø/g, '')
    .replace(/✕/g, '')
    .replace(/\s+/g, ' ')
    .trim();

  if (!spokenText) return false;

  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(spokenText);
  utterance.lang = 'en-US';
  utterance.rate = options?.rate ?? 0.96;

  if (!preferredVoice) {
    preferredVoice = pickEnglishVoice();
  }
  if (preferredVoice) {
    utterance.voice = preferredVoice;
  }

  if (options?.onEnd) {
    utterance.onend = options.onEnd;
    utterance.onerror = options.onEnd;
  }

  window.speechSynthesis.speak(utterance);
  return true;
}

export function stopSpeaking(): void {
  if (isSpeechSupported()) {
    window.speechSynthesis.cancel();
  }
}
