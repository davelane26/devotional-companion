import React, { useRef, useState, useEffect, useMemo } from 'react';
import { Play, Pause, Square, Gauge, Volume2, Music, SkipBack, SkipForward, ExternalLink } from 'lucide-react';
import {
  splitTextIntoChunks,
  isSpeechSynthesisSupported,
  getBestEnglishVoice,
} from '../utils/speechUtils';

interface AudioPlayerProps {
  src?: string | null;
  text?: string | null;
  title?: string;
  studyUrl?: string | null;
}

export const AudioPlayer: React.FC<AudioPlayerProps> = ({ src, text, title, studyUrl }) => {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [playbackRate, setPlaybackRate] = useState<number>(1);

  const hasMp3 = Boolean(src && src.trim());
  const cleanText = text?.trim() || '';

  // Mode: 'mp3' or 'tts'. Default to 'mp3' if available, otherwise 'tts'
  const [activeMode, setActiveMode] = useState<'mp3' | 'tts'>(() => (hasMp3 ? 'mp3' : 'tts'));

  // Sync mode if props change
  useEffect(() => {
    if (!hasMp3 && cleanText) {
      setActiveMode('tts');
    }
  }, [hasMp3, cleanText]);

  // TTS State
  const [hasSpeechSupport, setHasSpeechSupport] = useState(() => isSpeechSynthesisSupported());
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [currentChunkIndex, setCurrentChunkIndex] = useState(0);

  // References to handle Chrome/Safari speech bugs & garbage collection
  const activeUtteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
  const isCancelledRef = useRef<boolean>(false);
  const currentChunkRef = useRef<number>(0);
  const playbackRateRef = useRef<number>(playbackRate);
  playbackRateRef.current = playbackRate;

  // Split text into small sentence chunks (max ~180 chars) to prevent browser cutoff
  const chunks = useMemo(() => splitTextIntoChunks(cleanText), [cleanText]);

  // Check speech synthesis support and load voices
  useEffect(() => {
    const supported = isSpeechSynthesisSupported();
    setHasSpeechSupport(supported);

    if (supported && typeof window !== 'undefined' && 'speechSynthesis' in window) {
      // Chrome/Safari asynchronously loads voices
      const handleVoicesChanged = () => {
        window.speechSynthesis.getVoices();
      };
      window.speechSynthesis.addEventListener('voiceschanged', handleVoicesChanged);
      return () => {
        window.speechSynthesis.removeEventListener('voiceschanged', handleVoicesChanged);
        window.speechSynthesis.cancel();
      };
    }
  }, []);

  // Cancel speech synthesis when reading changes or unmounts
  useEffect(() => {
    handleStopTTS();
    setCurrentChunkIndex(0);
    currentChunkRef.current = 0;
  }, [cleanText, src]);

  // Chrome 14-second cutoff keepalive timer
  useEffect(() => {
    if (!isSpeaking || isPaused) return;

    const interval = setInterval(() => {
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        if (window.speechSynthesis.speaking && !window.speechSynthesis.paused) {
          window.speechSynthesis.pause();
          window.speechSynthesis.resume();
        }
      }
    }, 10000);

    return () => clearInterval(interval);
  }, [isSpeaking, isPaused]);

  if (!hasMp3 && !cleanText) {
    return null;
  }

  // Handle Playback Rate
  const handleRateChange = (rate: number) => {
    setPlaybackRate(rate);
    if (activeMode === 'mp3' && audioRef.current) {
      audioRef.current.playbackRate = rate;
    } else if (activeMode === 'tts' && isSpeaking) {
      // Re-play current chunk with new speed
      playChunk(currentChunkRef.current, rate);
    }
  };

  const rates = [1, 1.25, 1.5, 2];

  // Core TTS Playback for a specific chunk index
  const playChunk = (index: number, rate = playbackRateRef.current) => {
    if (!isSpeechSynthesisSupported() || chunks.length === 0) return;

    if (index >= chunks.length) {
      setIsSpeaking(false);
      setIsPaused(false);
      setCurrentChunkIndex(0);
      currentChunkRef.current = 0;
      return;
    }

    isCancelledRef.current = false;
    currentChunkRef.current = index;
    setCurrentChunkIndex(index);

    // Cancel previous utterance
    window.speechSynthesis.cancel();

    const chunkText = chunks[index];
    const utterance = new SpeechSynthesisUtterance(chunkText);
    utterance.rate = rate;
    utterance.pitch = 1.0;
    utterance.lang = 'en-US';

    const voice = getBestEnglishVoice();
    if (voice) {
      utterance.voice = voice;
    }

    utterance.onstart = () => {
      setIsSpeaking(true);
      setIsPaused(false);
    };

    utterance.onend = () => {
      if (!isCancelledRef.current) {
        setTimeout(() => {
          if (!isCancelledRef.current) {
            playChunk(index + 1, rate);
          }
        }, 40);
      }
    };

    utterance.onerror = (e) => {
      if (e.error === 'interrupted' || e.error === 'canceled') return;
      console.warn('Speech synthesis chunk error:', e);
      if (!isCancelledRef.current && index + 1 < chunks.length) {
        setTimeout(() => playChunk(index + 1, rate), 40);
      } else {
        setIsSpeaking(false);
        setIsPaused(false);
      }
    };

    // Store in window/ref to prevent garbage collection killing audio in Chrome/WebKit
    activeUtteranceRef.current = utterance;
    (window as any).__currentUtterance = utterance;

    window.speechSynthesis.speak(utterance);

    // iOS Safari / Chrome resume kick
    if (window.speechSynthesis.paused) {
      window.speechSynthesis.resume();
    }
  };

  // Toggle Play / Pause for TTS
  const handleTogglePlayPauseTTS = () => {
    if (!hasSpeechSupport) {
      alert('Text-to-speech is not supported or permitted by your browser.');
      return;
    }

    if (!isSpeaking) {
      const startIdx = currentChunkRef.current >= chunks.length ? 0 : currentChunkRef.current;
      playChunk(startIdx);
    } else if (isPaused) {
      window.speechSynthesis.resume();
      setIsPaused(false);
      setTimeout(() => {
        if (typeof window !== 'undefined' && 'speechSynthesis' in window && !window.speechSynthesis.speaking) {
          playChunk(currentChunkRef.current);
        }
      }, 150);
    } else {
      window.speechSynthesis.pause();
      setIsPaused(true);
    }
  };

  // Stop TTS
  const handleStopTTS = () => {
    isCancelledRef.current = true;
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    setIsSpeaking(false);
    setIsPaused(false);
  };

  // Skip to next chunk
  const handleNextChunk = () => {
    if (currentChunkRef.current + 1 < chunks.length) {
      playChunk(currentChunkRef.current + 1);
    }
  };

  // Skip to previous chunk
  const handlePrevChunk = () => {
    if (currentChunkRef.current > 0) {
      playChunk(currentChunkRef.current - 1);
    } else {
      playChunk(0);
    }
  };

  const progressPercent = chunks.length > 0 ? Math.round(((currentChunkIndex + 1) / chunks.length) * 100) : 0;

  return (
    <div className="my-4 p-3.5 sm:p-4 rounded-3xl bg-indigo-50/80 dark:bg-indigo-950/40 border border-indigo-200/80 dark:border-indigo-800/60 shadow-sm space-y-3 transition-colors">
      {/* Header Bar */}
      <div className="flex items-center justify-between gap-2">
        {/* Dual Mode Switcher or Header Label */}
        {hasMp3 && cleanText ? (
          <div className="inline-flex p-1 rounded-2xl bg-indigo-100/70 dark:bg-indigo-900/60 border border-indigo-200/60 dark:border-indigo-800/50 text-xs font-semibold">
            <button
              onClick={() => {
                handleStopTTS();
                setActiveMode('mp3');
              }}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl transition-all ${
                activeMode === 'mp3'
                  ? 'bg-white dark:bg-slate-800 text-indigo-700 dark:text-indigo-300 shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-indigo-600'
              }`}
            >
              <Music className="w-3.5 h-3.5" />
              <span>Zac Poonen Audio</span>
            </button>

            <button
              onClick={() => {
                if (audioRef.current) audioRef.current.pause();
                setActiveMode('tts');
              }}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl transition-all ${
                activeMode === 'tts'
                  ? 'bg-white dark:bg-slate-800 text-indigo-700 dark:text-indigo-300 shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-indigo-600'
              }`}
            >
              <Volume2 className="w-3.5 h-3.5" />
              <span>Listen Aloud (TTS)</span>
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-2 text-indigo-900 dark:text-indigo-200 min-w-0">
            <div className="p-2 rounded-xl bg-indigo-100 dark:bg-indigo-900/70 text-indigo-600 dark:text-indigo-400 shrink-0">
              {activeMode === 'mp3' ? <Music className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
            </div>
            <div className="min-w-0">
              <span className="text-xs font-bold uppercase tracking-wider text-indigo-700 dark:text-indigo-400 block truncate">
                {activeMode === 'mp3' ? 'Zac Poonen Audio Message' : 'Listen Aloud • Text-to-Speech'}
              </span>
              {title && (
                <p className="text-xs text-slate-600 dark:text-slate-400 truncate mt-0.5">
                  {title}
                </p>
              )}
            </div>
          </div>
        )}

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

      {/* MP3 Player Mode */}
      {activeMode === 'mp3' && hasMp3 && (
        <div className="space-y-2.5 pt-1">
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

          <div className="flex flex-wrap items-center justify-between gap-2 pt-0.5">
            {cleanText && (
              <button
                onClick={() => {
                  if (audioRef.current) audioRef.current.pause();
                  setActiveMode('tts');
                  playChunk(0);
                }}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-indigo-100 hover:bg-indigo-200 dark:bg-indigo-900/60 dark:hover:bg-indigo-900 text-indigo-700 dark:text-indigo-300 transition-all active:scale-95"
              >
                <Volume2 className="w-3.5 h-3.5" />
                <span>Listen Aloud (Read Text)</span>
              </button>
            )}

            {studyUrl && (
              <a
                href={studyUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-[11px] font-medium text-indigo-700 dark:text-indigo-400 hover:underline ml-auto"
              >
                <span>CFC India Study Notes</span>
                <ExternalLink className="w-3 h-3 opacity-70" />
              </a>
            )}
          </div>
        </div>
      )}

      {/* TTS Speech Player Mode */}
      {activeMode === 'tts' && (
        <div className="space-y-3 pt-1">
          {/* Main Controls */}
          <div className="flex flex-wrap items-center justify-between gap-2.5">
            <div className="flex items-center gap-2">
              {/* Listen / Pause Button */}
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

              {/* Stop Button */}
              {isSpeaking && (
                <button
                  onClick={handleStopTTS}
                  className="p-2 rounded-xl text-xs font-semibold bg-slate-200 dark:bg-slate-800 hover:bg-rose-100 hover:text-rose-600 dark:hover:bg-rose-950 dark:hover:text-rose-300 text-slate-700 dark:text-slate-300 transition-all active:scale-95"
                  title="Stop Narration"
                >
                  <Square className="w-3.5 h-3.5 fill-current" />
                </button>
              )}

              {/* Skip Prev/Next buttons while speaking */}
              {isSpeaking && chunks.length > 1 && (
                <div className="flex items-center gap-1">
                  <button
                    onClick={handlePrevChunk}
                    disabled={currentChunkIndex === 0}
                    className="p-2 rounded-xl text-xs font-semibold bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 disabled:opacity-40 transition-all"
                    title="Previous sentence"
                  >
                    <SkipBack className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={handleNextChunk}
                    disabled={currentChunkIndex >= chunks.length - 1}
                    className="p-2 rounded-xl text-xs font-semibold bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 disabled:opacity-40 transition-all"
                    title="Next sentence"
                  >
                    <SkipForward className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}
            </div>

            {/* Status text */}
            <p className="text-[11px] text-slate-500 dark:text-slate-400 italic">
              {isSpeaking
                ? isPaused
                  ? 'Narration paused.'
                  : `Reading section ${currentChunkIndex + 1} of ${chunks.length} (${progressPercent}%)`
                : 'Tap to have this reading narrated aloud with built-in voice.'}
            </p>
          </div>

          {/* Reading Progress Bar & Snippet when active */}
          {isSpeaking && (
            <div className="space-y-2 pt-1 border-t border-indigo-200/60 dark:border-indigo-900/60">
              <div className="w-full h-1.5 bg-indigo-200/70 dark:bg-indigo-950 rounded-full overflow-hidden">
                <div
                  className="h-full bg-indigo-600 dark:bg-indigo-400 transition-all duration-300 rounded-full"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>

              {chunks[currentChunkIndex] && (
                <p className="text-xs text-slate-700 dark:text-slate-300 bg-white/70 dark:bg-slate-900/70 p-2.5 rounded-xl border border-indigo-100 dark:border-indigo-900/40 line-clamp-2 italic font-serif">
                  "{chunks[currentChunkIndex]}"
                </p>
              )}
            </div>
          )}

          {/* Switch back to MP3 if available */}
          {hasMp3 && (
            <div className="pt-1 flex justify-end">
              <button
                onClick={() => {
                  handleStopTTS();
                  setActiveMode('mp3');
                }}
                className="inline-flex items-center gap-1.5 text-xs text-indigo-700 dark:text-indigo-400 hover:underline"
              >
                <Music className="w-3.5 h-3.5" />
                <span>Switch to Zac Poonen MP3 Recording</span>
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
