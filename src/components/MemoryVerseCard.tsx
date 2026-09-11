import React, { useState, useRef } from 'react';
import { BookMarked, Headphones, ExternalLink, Gauge, Play, ChevronDown, ChevronUp } from 'lucide-react';
import { BibleTranslation } from '../types/devotional';
import { ScriptureLink } from './ScriptureLink';
import { getZacPoonenVerseByVerseTrack } from '../utils/verseByVerseUtils';

interface MemoryVerseCardProps {
  memoryVerse: string;
  bibleTranslation?: BibleTranslation;
}

export const MemoryVerseCard: React.FC<MemoryVerseCardProps> = ({
  memoryVerse,
  bibleTranslation = 'NASB1995',
}) => {
  const [showAudio, setShowAudio] = useState(false);
  const [playbackRate, setPlaybackRate] = useState(1);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const track = getZacPoonenVerseByVerseTrack(memoryVerse);

  const handleRateChange = (rate: number) => {
    setPlaybackRate(rate);
    if (audioRef.current) {
      audioRef.current.playbackRate = rate;
    }
  };

  const rates = [1, 1.25, 1.5, 2];

  // Extract reference like "Colossians 3:2" from string
  const refMatch = memoryVerse.match(/—\s*([^,]+)/);
  const passageRef = refMatch ? refMatch[1].trim() : 'Colossians 3:2';

  return (
    <div className="p-4 sm:p-5 rounded-3xl bg-gradient-to-br from-amber-500/15 via-amber-500/5 to-transparent border border-amber-500/30 shadow-sm space-y-3.5 transition-colors">
      {/* Header Bar */}
      <div className="flex items-center justify-between gap-2">
        <span className="text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 text-amber-800 dark:text-amber-300">
          <BookMarked className="w-4 h-4 text-amber-600" />
          <span>Weekly Memory Verse</span>
        </span>

        {/* Translation Link */}
        <ScriptureLink
          passage={passageRef}
          translation={bibleTranslation}
          variant="inline"
          className="text-xs"
        />
      </div>

      {/* Memory Verse Text */}
      <blockquote className="font-serif italic text-base sm:text-lg leading-relaxed text-slate-900 dark:text-slate-100 border-l-2 border-amber-500/60 pl-3.5 my-1">
        {memoryVerse}
      </blockquote>

      {/* Zac Poonen Verse by Verse Section */}
      {track && (
        <div className="mt-3 pt-3 border-t border-amber-300/40 dark:border-amber-800/40 space-y-2.5">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2 min-w-0">
              <div className="p-1.5 rounded-lg bg-amber-200/60 dark:bg-amber-900/60 text-amber-800 dark:text-amber-300 shrink-0">
                <Headphones className="w-3.5 h-3.5" />
              </div>
              <div className="min-w-0">
                <span className="text-[11px] font-bold uppercase tracking-wider text-amber-900 dark:text-amber-300 block">
                  Zac Poonen • Verse by Verse
                </span>
                <p className="text-xs text-slate-600 dark:text-slate-400 truncate">
                  {track.title}
                </p>
              </div>
            </div>

            {/* Listen Toggle Button */}
            {track.audioUrl && (
              <button
                onClick={() => setShowAudio(!showAudio)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-amber-500 hover:bg-amber-600 text-white transition-all active:scale-95 shadow-sm shrink-0"
              >
                {showAudio ? (
                  <>
                    <span>Hide</span>
                    <ChevronUp className="w-3.5 h-3.5" />
                  </>
                ) : (
                  <>
                    <Play className="w-3.5 h-3.5 fill-current" />
                    <span>Listen</span>
                    <ChevronDown className="w-3.5 h-3.5" />
                  </>
                )}
              </button>
            )}
          </div>

          {/* Collapsible Audio Player */}
          {showAudio && track.audioUrl && (
            <div className="p-3 rounded-2xl bg-white/90 dark:bg-slate-900/90 border border-amber-200 dark:border-amber-800/60 shadow-sm space-y-2 animate-in fade-in slide-in-from-top-1 duration-150">
              <div className="flex items-center justify-between gap-2 text-xs">
                <span className="font-semibold text-slate-700 dark:text-slate-300 truncate">
                  Exposition: {track.passageRange}
                </span>

                {/* Speed Controls */}
                <div className="flex items-center gap-1 shrink-0 bg-slate-100 dark:bg-slate-800 p-0.5 rounded-lg text-[10px] font-bold">
                  <Gauge className="w-3 h-3 text-amber-600 ml-1 opacity-70 hidden xs:inline" />
                  {rates.map((rate) => (
                    <button
                      key={rate}
                      onClick={() => handleRateChange(rate)}
                      className={`px-1.5 py-0.5 rounded transition-all ${
                        playbackRate === rate
                          ? 'bg-amber-500 text-white shadow-xs'
                          : 'text-slate-600 dark:text-slate-400 hover:text-amber-600'
                      }`}
                    >
                      {rate}x
                    </button>
                  ))}
                </div>
              </div>

              {/* HTML5 Audio Player */}
              <audio
                ref={audioRef}
                src={track.audioUrl}
                controls
                preload="auto"
                playsInline
                className="w-full h-10 rounded-xl focus:outline-none"
                onRateChange={() => {
                  if (audioRef.current) {
                    setPlaybackRate(audioRef.current.playbackRate);
                  }
                }}
              >
                Your browser does not support the audio element.
              </audio>

              {/* CFC India Study Link */}
              {track.studyUrl && (
                <div className="flex justify-end pt-1">
                  <a
                    href={track.studyUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-[11px] font-medium text-amber-700 dark:text-amber-400 hover:underline"
                  >
                    <span>View full study on CFC India</span>
                    <ExternalLink className="w-3 h-3 opacity-70" />
                  </a>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

