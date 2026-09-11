import React, { useRef, useState } from 'react';
import { Headphones, Gauge } from 'lucide-react';

interface AudioPlayerProps {
  src?: string | null;
  title?: string;
}

export const AudioPlayer: React.FC<AudioPlayerProps> = ({ src, title }) => {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [playbackRate, setPlaybackRate] = useState<number>(1);

  if (!src || !src.trim()) {
    return null;
  }

  const handleRateChange = (rate: number) => {
    setPlaybackRate(rate);
    if (audioRef.current) {
      audioRef.current.playbackRate = rate;
    }
  };

  const rates = [1, 1.25, 1.5, 2];

  return (
    <div className="my-4 p-3.5 sm:p-4 rounded-2xl bg-indigo-50/70 dark:bg-indigo-950/30 border border-indigo-200/80 dark:border-indigo-800/60 shadow-sm space-y-2.5 transition-colors">
      {/* Header with Title & Playback Rate Selector */}
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2 text-indigo-900 dark:text-indigo-200 min-w-0">
          <div className="p-1.5 rounded-lg bg-indigo-100 dark:bg-indigo-900/60 text-indigo-600 dark:text-indigo-400 shrink-0">
            <Headphones className="w-4 h-4" />
          </div>
          <div className="min-w-0">
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-700 dark:text-indigo-400 block">
              Audio Reading
            </span>
            {title && (
              <p className="text-xs text-slate-600 dark:text-slate-400 truncate">
                {title}
              </p>
            )}
          </div>
        </div>

        {/* Speed presets */}
        <div className="flex items-center gap-1 shrink-0 bg-white dark:bg-slate-900 p-1 rounded-xl border border-indigo-100 dark:border-indigo-900/60 text-[11px] font-semibold">
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

      {/* HTML5 Audio Player */}
      <div className="w-full">
        <audio
          ref={audioRef}
          src={src.trim()}
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
    </div>
  );
};
