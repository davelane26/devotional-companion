import React, { useRef, useState, useEffect } from 'react';
import { Play, Pause, Square, Gauge, Volume2, Music } from 'lucide-react';

interface AudioPlayerProps {
  src?: string | null;
  text?: string | null;
  title?: string;
}

export const AudioPlayer: React.FC<AudioPlayerProps> = ({ src, text, title }) => {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [playbackRate, setPlaybackRate] = useState<number>(1);

  // State for Web Speech API TTS
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [hasSpeechSupport, setHasSpeechSupport] = useState(false);

  const hasMp3 = Boolean(src && src.trim());
  const cleanText = text?.trim() || '';

  useEffect(() => {
    setHasSpeechSupport(typeof window !== 'undefined' && 'speechSynthesis' in window);
    return () => {
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  // Cancel TTS when switching readings/chapters
  useEffect(() => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      setIsPaused(false);
    }
  }, [src, text]);

  // If no MP3 and no text to read aloud, hide
  if (!hasMp3 && !cleanText) {
    return null;
  }

  // Handle Playback Rate
  const handleRateChange = (rate: number) => {
    setPlaybackRate(rate);
    if (hasMp3 && audioRef.current) {
      audioRef.current.playbackRate = rate;
    }
    // If currently speaking TTS, restart with new rate from current position
    if (!hasMp3 && isSpeaking) {
      window.speechSynthesis.cancel();
      startSpeech(rate);
    }
  };

  const rates = [1, 1.25, 1.5, 2];

  // TTS Controls
  const startSpeech = (rate = playbackRate) => {
    if (!hasSpeechSupport || !cleanText) return;

    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.rate = rate;
    utterance.pitch = 1.0;
    utterance.lang = 'en-US';

    utterance.onstart = () => {
      setIsSpeaking(true);
      setIsPaused(false);
    };

    utterance.onend = () => {
      setIsSpeaking(false);
      setIsPaused(false);
    };

    utterance.onerror = (e) => {
      console.warn('TTS error:', e);
      setIsSpeaking(false);
      setIsPaused(false);
    };

    window.speechSynthesis.speak(utterance);
  };

  const handleTogglePlayPauseTTS = () => {
    if (!isSpeaking) {
      startSpeech();
    } else if (isPaused) {
      window.speechSynthesis.resume();
      setIsPaused(false);
    } else {
      window.speechSynthesis.pause();
      setIsPaused(true);
    }
  };

  const handleStopTTS = () => {
    if (hasSpeechSupport) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      setIsPaused(false);
    }
  };

  return (
    <div className="my-4 p-3.5 sm:p-4 rounded-2xl bg-indigo-50/80 dark:bg-indigo-950/40 border border-indigo-200/80 dark:border-indigo-800/60 shadow-sm space-y-3 transition-colors">
      {/* Header Info Bar */}
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2 text-indigo-900 dark:text-indigo-200 min-w-0">
          <div className="p-2 rounded-xl bg-indigo-100 dark:bg-indigo-900/70 text-indigo-600 dark:text-indigo-400 shrink-0">
            {hasMp3 ? <Music className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="text-xs font-bold uppercase tracking-wider text-indigo-700 dark:text-indigo-400">
                {hasMp3 ? 'Audio MP3' : 'Audio Narration'}
              </span>
              {!hasMp3 && (
                <span className="text-[10px] px-2 py-0.2 rounded-full font-medium bg-amber-100 dark:bg-amber-950/70 text-amber-800 dark:text-amber-300">
                  Text-to-Speech
                </span>
              )}
            </div>
            {title && (
              <p className="text-xs text-slate-600 dark:text-slate-400 truncate mt-0.5">
                {title}
              </p>
            )}
          </div>
        </div>

        {/* Playback speed selector */}
        <div className="flex items-center gap-1 shrink-0 bg-white dark:bg-slate-900 p-1 rounded-xl border border-indigo-100 dark:border-indigo-900/60 text-[11px] font-semibold shadow-xs">
          <Gauge className="w-3 h-3 text-indigo-500 ml-1 mr-0.5 opacity-70 hidden xs:inline" />
          {rates.map((rate) => (
            <button
              key={rate}
              onClick={() => handleRateChange(rate)}
              className={`px-1.5 py-0.5 rounded-md transition-all ${
                playbackRate === rate
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-300'
              }`}
              title={`Set playback speed to ${rate}x`}
            >
              {rate}x
            </button>
          ))}
        </div>
      </div>

      {/* MP3 Audio Player Mode */}
      {hasMp3 ? (
        <div className="w-full">
          <audio
            ref={audioRef}
            src={src?.trim()}
            controls
            preload="metadata"
            className="w-full h-10 rounded-xl focus:outline-none"
            onRateChange={() => {
              if (audioRef.current) {
                setPlaybackRate(audioRef.current.playbackRate);
              }
            }}
          >
            Your browser does not support the audio element.
          </audio>
        </div>
      ) : (
        /* TTS Speech Player Mode */
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 pt-1">
          <div className="flex items-center gap-2">
            <button
              onClick={handleTogglePlayPauseTTS}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold bg-indigo-600 hover:bg-indigo-700 active:scale-95 text-white transition-all shadow-sm"
            >
              {isSpeaking && !isPaused ? (
                <>
                  <Pause className="w-3.5 h-3.5 fill-current" />
                  <span>Pause Narration</span>
                </>
              ) : (
                <>
                  <Play className="w-3.5 h-3.5 fill-current" />
                  <span>{isPaused ? 'Resume Narration' : 'Listen Aloud'}</span>
                </>
              )}
            </button>

            {isSpeaking && (
              <button
                onClick={handleStopTTS}
                className="p-2 rounded-xl text-xs font-semibold bg-slate-200 dark:bg-slate-800 hover:bg-rose-100 hover:text-rose-600 dark:hover:bg-rose-950 dark:hover:text-rose-300 text-slate-700 dark:text-slate-300 transition-all active:scale-95"
                title="Stop Narration"
              >
                <Square className="w-3.5 h-3.5 fill-current" />
              </button>
            )}
          </div>

          <p className="text-[11px] text-slate-500 dark:text-slate-400 italic">
            {isSpeaking
              ? isPaused
                ? 'Narration paused.'
                : 'Reading aloud with built-in voice...'
              : 'Tap to have this reading narrated aloud.'}
          </p>
        </div>
      )}
    </div>
  );
};
