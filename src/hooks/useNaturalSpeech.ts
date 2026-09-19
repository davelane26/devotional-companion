import { useState, useEffect, useRef, useCallback } from 'react';

export interface VoiceOption {
  voice: SpeechSynthesisVoice;
  name: string;
  lang: string;
  isNatural: boolean;
}

export interface UseNaturalSpeechReturn {
  isPlaying: boolean;
  isPaused: boolean;
  activeParagraphIndex: number;
  rate: number;
  setRate: (rate: number) => void;
  voices: VoiceOption[];
  selectedVoice: SpeechSynthesisVoice | null;
  setSelectedVoice: (voice: SpeechSynthesisVoice | null) => void;
  play: (startIndex?: number) => void;
  pause: () => void;
  resume: () => void;
  stop: () => void;
  nextParagraph: () => void;
  prevParagraph: () => void;
  speakParagraph: (index: number) => void;
  isSupported: boolean;
}

export const useNaturalSpeech = (paragraphs: string[]): UseNaturalSpeechReturn => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [activeParagraphIndex, setActiveParagraphIndex] = useState(0);
  const [rate, setRateState] = useState(() => {
    const saved = localStorage.getItem('wftw_speech_rate');
    return saved ? parseFloat(saved) : 1.0;
  });
  const [voices, setVoices] = useState<VoiceOption[]>([]);
  const [selectedVoice, setSelectedVoiceState] = useState<SpeechSynthesisVoice | null>(null);

  const activeIndexRef = useRef(0);
  const paragraphsRef = useRef(paragraphs);
  paragraphsRef.current = paragraphs;
  const isPlayingRef = useRef(false);
  const isPausedRef = useRef(false);
  const rateRef = useRef(rate);
  rateRef.current = rate;
  const voiceRef = useRef<SpeechSynthesisVoice | null>(null);
  voiceRef.current = selectedVoice;

  const isSupported = typeof window !== 'undefined' && 'speechSynthesis' in window;

  // Populate and filter voices
  useEffect(() => {
    if (!isSupported) return;

    const updateVoices = () => {
      const allVoices = window.speechSynthesis.getVoices();
      if (!allVoices || allVoices.length === 0) return;

      // Filter for English voices
      const englishVoices = allVoices.filter(
        (v) => v.lang.startsWith('en') || v.lang.includes('US') || v.lang.includes('GB')
      );

      const targetList = englishVoices.length > 0 ? englishVoices : allVoices;

      const scored = targetList.map((v) => {
        const lowerName = v.name.toLowerCase();
        // Identify high-quality neural / natural / enhanced voices
        const isNatural =
          lowerName.includes('natural') ||
          lowerName.includes('online') ||
          lowerName.includes('enhanced') ||
          lowerName.includes('neural') ||
          lowerName.includes('google') ||
          lowerName.includes('siri') ||
          v.name.includes('(Natural)');

        return {
          voice: v,
          name: v.name.replace(/Microsoft |Google |English \(United States\) |en-US /gi, '').trim(),
          lang: v.lang,
          isNatural,
        };
      });

      // Sort natural/enhanced voices to the top
      scored.sort((a, b) => {
        if (a.isNatural && !b.isNatural) return -1;
        if (!a.isNatural && b.isNatural) return 1;
        return a.name.localeCompare(b.name);
      });

      setVoices(scored);

      // Pick best default voice: preferred natural male/female or Google US
      if (!voiceRef.current) {
        const preferred =
          scored.find(
            (v) =>
              v.isNatural &&
              (v.voice.name.includes('Christopher') ||
                v.voice.name.includes('Guy') ||
                v.voice.name.includes('Roger') ||
                v.voice.name.includes('David') ||
                v.voice.name.includes('Daniel') ||
                v.voice.name.includes('Jenny') ||
                v.voice.name.includes('US English'))
          ) ||
          scored.find((v) => v.isNatural) ||
          scored[0];

        if (preferred) {
          setSelectedVoiceState(preferred.voice);
          voiceRef.current = preferred.voice;
        }
      }
    };

    updateVoices();
    window.speechSynthesis.onvoiceschanged = updateVoices;

    return () => {
      if (window.speechSynthesis) {
        window.speechSynthesis.onvoiceschanged = null;
      }
    };
  }, [isSupported]);

  // Clean stop helper
  const cancelSpeech = useCallback(() => {
    if (!isSupported) return;
    try {
      window.speechSynthesis.cancel();
    } catch {
      // ignore
    }
  }, [isSupported]);

  // Stop when unmounting or when paragraphs change
  useEffect(() => {
    return () => {
      cancelSpeech();
    };
  }, [cancelSpeech]);

  // Reset when article paragraphs change
  useEffect(() => {
    cancelSpeech();
    setIsPlaying(false);
    setIsPaused(false);
    setActiveParagraphIndex(0);
    activeIndexRef.current = 0;
    isPlayingRef.current = false;
    isPausedRef.current = false;
  }, [paragraphs, cancelSpeech]);

  const speakCurrentParagraph = useCallback(() => {
    if (!isSupported) return;
    const currentList = paragraphsRef.current;
    const index = activeIndexRef.current;

    if (index >= currentList.length) {
      // Finished entire article
      setIsPlaying(false);
      setIsPaused(false);
      isPlayingRef.current = false;
      isPausedRef.current = false;
      setActiveParagraphIndex(0);
      activeIndexRef.current = 0;
      return;
    }

    cancelSpeech();

    const textToSpeak = currentList[index];
    if (!textToSpeak || !textToSpeak.trim()) {
      // Skip empty paragraph
      activeIndexRef.current = index + 1;
      setActiveParagraphIndex(index + 1);
      speakCurrentParagraph();
      return;
    }

    const utterance = new SpeechSynthesisUtterance(textToSpeak);
    utterance.rate = rateRef.current;
    if (voiceRef.current) {
      utterance.voice = voiceRef.current;
    }

    utterance.onstart = () => {
      setIsPlaying(true);
      setIsPaused(false);
      isPlayingRef.current = true;
      isPausedRef.current = false;
    };

    utterance.onend = () => {
      if (!isPlayingRef.current || isPausedRef.current) return;
      const nextIdx = activeIndexRef.current + 1;
      if (nextIdx < currentList.length) {
        activeIndexRef.current = nextIdx;
        setActiveParagraphIndex(nextIdx);
        // Small 300ms pause between paragraphs for natural cadence
        setTimeout(() => {
          if (isPlayingRef.current && !isPausedRef.current) {
            speakCurrentParagraph();
          }
        }, 300);
      } else {
        // Complete
        setIsPlaying(false);
        setIsPaused(false);
        isPlayingRef.current = false;
        isPausedRef.current = false;
        setActiveParagraphIndex(0);
        activeIndexRef.current = 0;
      }
    };

    utterance.onerror = (e) => {
      if (e.error !== 'canceled' && e.error !== 'interrupted') {
        console.warn('Speech synthesis error:', e);
      }
    };

    window.speechSynthesis.speak(utterance);
  }, [isSupported, cancelSpeech]);

  const play = useCallback(
    (startIndex?: number) => {
      if (!isSupported) return;
      const idx = typeof startIndex === 'number' ? startIndex : activeIndexRef.current;
      activeIndexRef.current = idx;
      setActiveParagraphIndex(idx);
      isPlayingRef.current = true;
      isPausedRef.current = false;
      setIsPlaying(true);
      setIsPaused(false);
      speakCurrentParagraph();
    },
    [isSupported, speakCurrentParagraph]
  );

  const pause = useCallback(() => {
    if (!isSupported) return;
    try {
      window.speechSynthesis.pause();
      setIsPaused(true);
      isPausedRef.current = true;
    } catch {
      cancelSpeech();
      setIsPaused(true);
      isPausedRef.current = true;
    }
  }, [isSupported, cancelSpeech]);

  const resume = useCallback(() => {
    if (!isSupported) return;
    if (window.speechSynthesis.paused) {
      window.speechSynthesis.resume();
      setIsPaused(false);
      isPausedRef.current = false;
    } else {
      play(activeIndexRef.current);
    }
  }, [isSupported, play]);

  const stop = useCallback(() => {
    cancelSpeech();
    setIsPlaying(false);
    setIsPaused(false);
    isPlayingRef.current = false;
    isPausedRef.current = false;
    setActiveParagraphIndex(0);
    activeIndexRef.current = 0;
  }, [cancelSpeech]);

  const nextParagraph = useCallback(() => {
    const nextIdx = Math.min(paragraphsRef.current.length - 1, activeIndexRef.current + 1);
    play(nextIdx);
  }, [play]);

  const prevParagraph = useCallback(() => {
    const prevIdx = Math.max(0, activeIndexRef.current - 1);
    play(prevIdx);
  }, [play]);

  const speakParagraph = useCallback(
    (index: number) => {
      play(index);
    },
    [play]
  );

  const setRate = useCallback(
    (newRate: number) => {
      setRateState(newRate);
      rateRef.current = newRate;
      try {
        localStorage.setItem('wftw_speech_rate', newRate.toString());
      } catch {
        // ignore
      }
      if (isPlayingRef.current && !isPausedRef.current) {
        // Re-trigger current paragraph with new speed
        speakCurrentParagraph();
      }
    },
    [speakCurrentParagraph]
  );

  const setSelectedVoice = useCallback(
    (voice: SpeechSynthesisVoice | null) => {
      setSelectedVoiceState(voice);
      voiceRef.current = voice;
      if (isPlayingRef.current && !isPausedRef.current) {
        speakCurrentParagraph();
      }
    },
    [speakCurrentParagraph]
  );

  return {
    isPlaying,
    isPaused,
    activeParagraphIndex,
    rate,
    setRate,
    voices,
    selectedVoice,
    setSelectedVoice,
    play,
    pause,
    resume,
    stop,
    nextParagraph,
    prevParagraph,
    speakParagraph,
    isSupported,
  };
};
