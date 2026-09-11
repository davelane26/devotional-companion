import React, { useRef, useState, useEffect, useMemo } from 'react';
import {
  Play,
  Pause,
  Square,
  Gauge,
  Volume2,
  Music,
  SkipBack,
  SkipForward,
  ExternalLink,
  Loader2,
} from 'lucide-react';
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

  // Active mode: 'mp3' or 'tts'
  const [activeMode, setActiveMode] = useState<'mp3' | 'tts'>(() => (hasMp3 ? 'mp3' : 'tts'));

  // MP3 state
  const [isMp3Buffering, setIsMp3Buffering] = useState(false);

  // TTS state
  const [hasSpeechSupport, setHasSpeechSupport] = useState(() => isSpeechSynthesisSupported());
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [currentChunkIndex, setCurrentChunkIndex] = useState(0);

  // References
  const utteranceQueueRef = useRef<SpeechSynthesisUtterance[]>([]);
  const currentChunkRef = useRef<number>(0);
  const playbackRateRef = useRef<number>(playbackRate);
  playbackRateRef.current = playbackRate;

  // Split text into natural sentence chunks
  const chunks = useMemo(() => splitTextIntoChunks(cleanText), [cleanText]);

  // Sync mode if props change
  useEffect(() => {
    if (!hasMp3 && cleanText) {
      setActiveMode('tts');
    }
  }, [hasMp3, cleanText]);

  // Voice setup
  useEffect(() => {
    const supported = isSpeechSynthesisSupported();
    setHasSpeechSupport(supported);

    if (supported && typeof window !== 'undefined' && 'speechSynthesis' in window) {
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

  // Stop speech when chapter/reading changes or unmounts
  useEffect(() => {
    handleStopTTS();
    setCurrentChunkIndex(0);
    currentChunkRef.current = 0;
  }, [cleanText, src]);

  // Setup Mobile Media Session for MP3 Background Playback
  useEffect(() => {
    if (typeof navigator !== 'undefined' && 'mediaSession' in navigator && hasMp3) {
      navigator.mediaSession.metadata = new MediaMetadata({
        title: title || 'Basic Christian Teachings',
        artist: 'Zac Poonen',
        album: 'Basic Christian Teachings',
      });

      navigator.mediaSession.setActionHandler('play', () => {
        audioRef.current?.play();
      });
      navigator.mediaSession.setActionHandler('pause', () => {
        audioRef.current?.pause();
      });
      navigator.mediaSession.setActionHandler('seekbackward', (details) => {
        if (audioRef.current) {
          audioRef.current.currentTime = Math.max(0, audioRef.current.currentTime - (details.seekOffset || 10));
        }
      });
      navigator.mediaSession.setActionHandler('seekforward', (details) => {
        if (audioRef.current) {
          audioRef.current.currentTime = Math.min(
            audioRef.current.duration || 0,
            audioRef.current.currentTime + (details.seekOffset || 10)
          );
        }
      });
    }
  }, [title, hasMp3]);

  if (!hasMp3 && !cleanText) {
    return null;
  }

  // Handle Playback Rate
  const handleRateChange = (rate: number) => {
    setPlaybackRate(rate);
    if (activeMode === 'mp3' && audioRef.current) {
      audioRef.current.playbackRate = rate;
    } else if (activeMode === 'tts' && isSpeaking) {
      startSpeechQueue(currentChunkRef.current, rate);
    }
  };

  const rates = [1, 1.25, 1.5, 2];

  /**
   * Synchronous Queueing: Enqueues all utterances upfront in a single user click gesture.
   * This is the official reliable pattern for iOS Safari and mobile Chrome.
   */
  const startSpeechQueue = (startIndex = 0, rate = playbackRateRef.current) => {
    if (!isSpeechSynthesisSupported() || chunks.length === 0) return;

    // Cancel existing speech
    window.speechSynthesis.cancel();
    utteranceQueueRef.current = [];

    const voice = getBestEnglishVoice();
    const queue: SpeechSynthesisUtterance[] = [];

    const targetStart = Math.max(0, Math.min(startIndex, chunks.length - 1));
    currentChunkRef.current = targetStart;
    setCurrentChunkIndex(targetStart);

    for (let i = targetStart; i < chunks.length; i++) {
      const chunkText = chunks[i];
      const utterance = new SpeechSynthesisUtterance(chunkText);
      utterance.rate = rate;
      utterance.pitch = 1.0;
      utterance.lang = 'en-US';
      if (voice) utterance.voice = voice;

      const idx = i;

      utterance.onstart = () => {
        setIsSpeaking(true);
        setIsPaused(false);
        setCurrentChunkIndex(idx);
        currentChunkRef.current = idx;
      };

      utterance.onend = () => {
        if (idx === chunks.length - 1) {
          setIsSpeaking(false);
          setIsPaused(false);
          setCurrentChunkIndex(0);
          currentChunkRef.current = 0;
          utteranceQueueRef.current = [];
        }
      };

      utterance.onerror = (e) => {
        if (e.error === 'interrupted' || e.error === 'canceled') return;
        console.warn('Speech chunk error at index', idx, e);
        if (idx === chunks.length - 1) {
          setIsSpeaking(false);
          setIsPaused(false);
          utteranceQueueRef.current = [];
        }
      };

      queue.push(utterance);
    }

    // Retain references on window & ref to prevent garbage collection destroying speech
    utteranceQueueRef.current = queue;
    (window as any).__utteranceQueue = queue;

    // Enqueue all utterances into native browser queue synchronously in click handler
    for (const u of queue) {
      window.speechSynthesis.speak(u);
    }

    // Kick resume for Safari / mobile browsers
    if (window.speechSynthesis.paused) {
      window.speechSynthesis.resume();
    }
  };

  // Toggle Play / Pause for TTS
  const handleTogglePlayPauseTTS = () => {
    if (!hasSpeechSupport) {
      alert('Text-to-speech is not supported or permitted on this device.');
      return;
    }

    // Stop MP3 if playing
    if (audioRef.current && !audioRef.current.paused) {
      audioRef.current.pause();
    }

    if (!isSpeaking) {
      startSpeechQueue(currentChunkRef.current);
    } else if (isPaused) {
      window.speechSynthesis.resume();
      setIsPaused(false);
      // Fallback resume check
      setTimeout(() => {
        if (typeof window !== 'undefined' && 'speechSynthesis' in window && !window.speechSynthesis.speaking) {
          startSpeechQueue(currentChunkRef.current);
        }
      }, 150);
    } else {
      window.speechSynthesis.pause();
      setIsPaused(true);
    }
  };

  // Stop TTS
  const handleStopTTS = () => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    utteranceQueueRef.current = [];
    (window as any).__utteranceQueue = null;
    setIsSpeaking(false);
    setIsPaused(false);
  };

  // Skip to next chunk
  const handleNextChunk = () => {
    if (currentChunkRef.current + 1 < chunks.length) {
      startSpeechQueue(currentChunkRef.current + 1);
    }
  };

  // Skip to previous chunk
  const handlePrevChunk = () => {
    const prev = Math.max(0, currentChunkRef.current - 1);
    startSpeechQueue(prev);
  };

  const progressPercent = chunks.length > 0 ? Math.round(((currentChunkIndex + 1) / chunks.length) * 100) : 0;

  return (
    <div className="my-4 p-3.5 sm:p-4 rounded-3xl bg-indigo-50/80 dark:bg-indigo-950/40 border border-indigo-200/80 dark:border-indigo-800/60 shadow-sm space-y-3 transition-colors">
      {/* Top Header Bar */}
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
                {activeMode === 'mp3' ? 'Zac Poonen Spoken Audio' : 'Listen Aloud • Text-to-Speech'}
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

      {/* Mode 1: MP3 Audio Recording by Zac Poonen */}
      {activeMode === 'mp3' && hasMp3 && (
        <div className="space-y-2.5 pt-1">
          <div className="relative">
            <audio
              ref={audioRef}
              src={src?.trim()}
              controls
              preload="auto"
              playsInline
              className="w-full h-10 rounded-xl focus:outline-none"
              onPlay={() => {
                handleStopTTS();
              }}
              onWaiting={() => setIsMp3Buffering(true)}
              onPlaying={() => setIsMp3Buffering(false)}
              onCanPlay={() => setIsMp3Buffering(false)}
              onRateChange={() => {
                if (audioRef.current) {
                  setPlaybackRate(audioRef.current.playbackRate);
                }
              }}
            >
              Your browser does not support the audio element.
            </audio>

            {isMp3Buffering && (
              <div className="absolute right-12 top-2.5 flex items-center gap-1 text-[11px] font-semibold text-indigo-600 bg-white/90 dark:bg-slate-900/90 px-2 py-0.5 rounded-md shadow-xs">
                <Loader2 className="w-3 h-3 animate-spin" />
                <span>Buffering...</span>
              </div>
            )}
          </div>

          <div className="flex flex-wrap items-center justify-between gap-2 pt-0.5">
            {cleanText && (
              <button
                onClick={() => {
                  if (audioRef.current) audioRef.current.pause();
                  setActiveMode('tts');
                  startSpeechQueue(0);
                }}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-indigo-100 hover:bg-indigo-200 dark:bg-indigo-900/60 dark:hover:bg-indigo-900 text-indigo-700 dark:text-indigo-300 transition-all active:scale-95"
              >
                <Volume2 className="w-3.5 h-3.5" />
                <span>Listen Aloud (Read Written Text)</span>
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

      {/* Mode 2: Listen Aloud (TTS Text-to-Speech) */}
      {activeMode === 'tts' && (
        <div className="space-y-3 pt-1">
          {/* Controls Bar */}
          <div className="flex flex-wrap items-center justify-between gap-2.5">
            <div className="flex items-center gap-2">
              {/* Play / Pause Button */}
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
                    className="p-2 rounded-xl text-xs font-semibold bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 disabled:opacity-40 transition-all active:scale-95"
                    title="Previous sentence"
                  >
                    <SkipBack className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={handleNextChunk}
                    disabled={currentChunkIndex >= chunks.length - 1}
                    className="p-2 rounded-xl text-xs font-semibold bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 disabled:opacity-40 transition-all active:scale-95"
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
                : 'Tap to narrate this chapter continuously with device voice.'}
            </p>
          </div>

          {/* Progress Bar & Current Sentence Quote */}
          {isSpeaking && (
            <div className="space-y-2 pt-1 border-t border-indigo-200/60 dark:border-indigo-900/60">
              <div className="w-full h-1.5 bg-indigo-200/70 dark:bg-indigo-950 rounded-full overflow-hidden">
                <div
                  className="h-full bg-indigo-600 dark:bg-indigo-400 transition-all duration-300 rounded-full"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>

              {chunks[currentChunkIndex] && (
                <p className="text-xs text-slate-700 dark:text-slate-300 bg-white/80 dark:bg-slate-900/80 p-2.5 rounded-xl border border-indigo-100 dark:border-indigo-900/40 line-clamp-3 italic font-serif leading-relaxed">
                  "{chunks[currentChunkIndex]}"
                </p>
              )}
            </div>
          )}

          {/* Switch back to MP3 Recording */}
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
                <span>Switch to Zac Poonen Audio Recording</span>
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
