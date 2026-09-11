import React, { useRef, useState, useEffect } from 'react';
import {
  Play,
  Pause,
  RotateCcw,
  RotateCw,
  Gauge,
  Music,
  ExternalLink,
  Loader2,
  BookOpen,
} from 'lucide-react';
import { formatTime } from '../utils/bookAudioUtils';

interface AudioPlayerProps {
  src?: string | null;
  title?: string;
  studyUrl?: string | null;
  activeParagraphIndex?: number;
  totalParagraphs?: number;
  onTimeUpdate?: (currentTime: number, duration: number) => void;
  onPlayingChange?: (isPlaying: boolean) => void;
  seekTarget?: { time: number; timestamp: number } | null;
  onJumpToActiveParagraph?: () => void;
  autoScroll?: boolean;
  onToggleAutoScroll?: () => void;
}

export const AudioPlayer: React.FC<AudioPlayerProps> = ({
  src,
  title,
  studyUrl,
  activeParagraphIndex = 0,
  totalParagraphs = 0,
  onTimeUpdate,
  onPlayingChange,
  seekTarget,
  onJumpToActiveParagraph,
  autoScroll = true,
  onToggleAutoScroll,
}) => {
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [isBuffering, setIsBuffering] = useState(false);

  // Handle external seek requests (e.g. user clicked a paragraph to jump)
  useEffect(() => {
    if (seekTarget && audioRef.current) {
      audioRef.current.currentTime = seekTarget.time;
      if (audioRef.current.paused) {
        audioRef.current.play().catch((e) => console.warn('Play error:', e));
      }
    }
  }, [seekTarget]);

  // Mobile Media Session API for background / lock screen playback
  useEffect(() => {
    if (typeof navigator !== 'undefined' && 'mediaSession' in navigator && src) {
      navigator.mediaSession.metadata = new MediaMetadata({
        title: title || 'Basic Christian Teachings',
        artist: 'Zac Poonen',
        album: 'Basic Christian Teachings',
      });

      navigator.mediaSession.setActionHandler('play', () => audioRef.current?.play());
      navigator.mediaSession.setActionHandler('pause', () => audioRef.current?.pause());
      navigator.mediaSession.setActionHandler('seekbackward', (details) => {
        handleSkip(-(details.seekOffset || 15));
      });
      navigator.mediaSession.setActionHandler('seekforward', (details) => {
        handleSkip(details.seekOffset || 15);
      });
      navigator.mediaSession.setActionHandler('seekto', (details) => {
        if (details.seekTime !== undefined && audioRef.current) {
          audioRef.current.currentTime = details.seekTime;
        }
      });
    }
  }, [src, title]);

  if (!src || !src.trim()) {
    return null;
  }

  // Play / Pause toggle
  const handleTogglePlay = () => {
    if (!audioRef.current) return;
    if (audioRef.current.paused) {
      audioRef.current.play().catch((e) => console.warn('Audio play error:', e));
    } else {
      audioRef.current.pause();
    }
  };

  // Skip forward or backward by seconds
  const handleSkip = (seconds: number) => {
    if (!audioRef.current) return;
    const newTime = Math.max(0, Math.min(audioRef.current.duration || 0, audioRef.current.currentTime + seconds));
    audioRef.current.currentTime = newTime;
    setCurrentTime(newTime);
  };

  // Handle slider scrub seek
  const handleScrub = (e: React.ChangeEvent<HTMLInputElement>) => {
    const targetTime = Number(e.target.value);
    setCurrentTime(targetTime);
    if (audioRef.current) {
      audioRef.current.currentTime = targetTime;
    }
  };

  // Handle playback rate change
  const handleRateChange = (rate: number) => {
    setPlaybackRate(rate);
    if (audioRef.current) {
      audioRef.current.playbackRate = rate;
    }
  };

  const rates = [1, 1.25, 1.5, 2];

  return (
    <div className="my-4 p-3.5 sm:p-5 rounded-3xl bg-indigo-50/90 dark:bg-indigo-950/50 border border-indigo-200/80 dark:border-indigo-800/70 shadow-sm space-y-3.5 transition-colors">
      {/* Hidden native audio element */}
      <audio
        ref={audioRef}
        src={src.trim()}
        preload="auto"
        playsInline
        onTimeUpdate={() => {
          if (audioRef.current) {
            const cur = audioRef.current.currentTime;
            const dur = audioRef.current.duration || 0;
            setCurrentTime(cur);
            setDuration(dur);
            if (onTimeUpdate) onTimeUpdate(cur, dur);
          }
        }}
        onDurationChange={() => {
          if (audioRef.current) {
            setDuration(audioRef.current.duration || 0);
          }
        }}
        onPlay={() => {
          setIsPlaying(true);
          if (onPlayingChange) onPlayingChange(true);
        }}
        onPause={() => {
          setIsPlaying(false);
          if (onPlayingChange) onPlayingChange(false);
        }}
        onEnded={() => {
          setIsPlaying(false);
          if (onPlayingChange) onPlayingChange(false);
        }}
        onWaiting={() => setIsBuffering(true)}
        onPlaying={() => setIsBuffering(false)}
        onCanPlay={() => setIsBuffering(false)}
        onError={(e) => {
          console.warn('MP3 playback error:', e);
          setIsBuffering(false);
        }}
      />

      {/* Header Bar */}
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2.5 text-indigo-950 dark:text-indigo-200 min-w-0">
          <div className="p-2 rounded-xl bg-indigo-600 text-white shadow-xs shrink-0">
            <Music className="w-4 h-4" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-indigo-700 dark:text-indigo-400">
                Zac Poonen Audio
              </span>
              {isBuffering && (
                <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-amber-700 dark:text-amber-400 bg-amber-100 dark:bg-amber-950/80 px-2 py-0.2 rounded-full">
                  <Loader2 className="w-2.5 h-2.5 animate-spin" />
                  <span>Buffering</span>
                </span>
              )}
            </div>
            {title && (
              <p className="text-xs font-medium text-slate-700 dark:text-slate-300 truncate mt-0.5">
                {title}
              </p>
            )}
          </div>
        </div>

        {/* Speed Controls */}
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

      {/* Scrub Bar & Timestamps */}
      <div className="space-y-1">
        <input
          type="range"
          min={0}
          max={duration || 100}
          step={0.5}
          value={currentTime}
          onChange={handleScrub}
          className="w-full h-2 bg-indigo-200/80 dark:bg-indigo-900/80 rounded-lg appearance-none cursor-pointer accent-indigo-600 dark:accent-indigo-400 focus:outline-none"
          title="Scrub audio progress"
        />
        <div className="flex items-center justify-between text-[11px] font-medium text-slate-500 dark:text-slate-400 tabular-nums px-0.5">
          <span>{formatTime(currentTime)}</span>
          <span>{duration > 0 ? formatTime(duration) : '--:--'}</span>
        </div>
      </div>

      {/* Follow-Along & Main Controls Row */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
        {/* Playback Buttons */}
        <div className="flex items-center gap-2">
          {/* Rewind 15s */}
          <button
            onClick={() => handleSkip(-15)}
            className="p-2 rounded-xl text-xs font-semibold bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 active:scale-95 transition-all shadow-xs flex items-center gap-1"
            title="Rewind 15 seconds"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span className="text-[10px]">15s</span>
          </button>

          {/* Big Play / Pause */}
          <button
            onClick={handleTogglePlay}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold bg-indigo-600 hover:bg-indigo-700 active:scale-95 text-white transition-all shadow-sm"
          >
            {isPlaying ? (
              <>
                <Pause className="w-4 h-4 fill-current" />
                <span>Pause</span>
              </>
            ) : (
              <>
                <Play className="w-4 h-4 fill-current ml-0.5" />
                <span>Listen to Zac</span>
              </>
            )}
          </button>

          {/* Forward 15s */}
          <button
            onClick={() => handleSkip(15)}
            className="p-2 rounded-xl text-xs font-semibold bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 active:scale-95 transition-all shadow-xs flex items-center gap-1"
            title="Skip forward 15 seconds"
          >
            <span className="text-[10px]">15s</span>
            <RotateCw className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Follow Along Status & Auto-scroll Toggle */}
        {totalParagraphs > 0 && (
          <div className="flex items-center gap-2">
            <button
              onClick={onJumpToActiveParagraph}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium bg-white dark:bg-slate-900 border border-indigo-100 dark:border-indigo-900/60 text-indigo-700 dark:text-indigo-300 hover:bg-indigo-50 dark:hover:bg-indigo-950/60 transition-all shadow-xs"
              title="Jump to the paragraph Zac is currently speaking"
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>Para {activeParagraphIndex + 1} of {totalParagraphs}</span>
            </button>

            {onToggleAutoScroll && (
              <button
                onClick={onToggleAutoScroll}
                className={`text-[11px] px-2.5 py-1 rounded-lg border font-medium transition-all ${
                  autoScroll
                    ? 'bg-indigo-100/80 dark:bg-indigo-900/60 border-indigo-300 text-indigo-800 dark:text-indigo-200'
                    : 'bg-transparent border-slate-300 dark:border-slate-700 text-slate-500'
                }`}
                title="Toggle automatic scrolling as Zac speaks"
              >
                Auto-scroll {autoScroll ? 'ON' : 'OFF'}
              </button>
            )}
          </div>
        )}
      </div>

      {/* CFC India link */}
      {studyUrl && (
        <div className="flex justify-end pt-1 border-t border-indigo-200/50 dark:border-indigo-900/50">
          <a
            href={studyUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-[11px] font-medium text-indigo-700 dark:text-indigo-400 hover:underline"
          >
            <span>View complete chapter notes on CFC India</span>
            <ExternalLink className="w-3 h-3 opacity-70" />
          </a>
        </div>
      )}
    </div>
  );
};
