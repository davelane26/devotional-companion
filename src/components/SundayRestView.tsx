import React from 'react';
import { Church, Headphones, BookOpen, ExternalLink } from 'lucide-react';

interface SundayRestViewProps {
  sermonTitle: string;
  sermonUrl?: string;
  memoryVerse?: string;
  onSwitchToReading: () => void;
}

export const SundayRestView: React.FC<SundayRestViewProps> = ({
  sermonTitle,
  sermonUrl,
  memoryVerse,
  onSwitchToReading,
}) => {
  return (
    <div className="p-6 sm:p-8 rounded-3xl bg-amber-50/70 dark:bg-slate-800/80 border border-amber-200/80 dark:border-slate-700 text-center space-y-5 animate-in fade-in duration-200">
      <div className="w-14 h-14 mx-auto rounded-2xl bg-amber-100 dark:bg-amber-950/80 text-amber-600 dark:text-amber-400 flex items-center justify-center shadow-inner">
        <Church className="w-7 h-7" />
      </div>

      <div className="space-y-1 max-w-md mx-auto">
        <span className="text-xs font-bold uppercase tracking-wider text-amber-700 dark:text-amber-400">
          The Lord's Day • Worship & Sabbath
        </span>
        <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
          Sunday Worship & Rest
        </h2>
        <p className="text-xs sm:text-sm font-medium text-amber-800 dark:text-amber-300">
          {sermonTitle}
        </p>
        <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed pt-1">
          Today is church fellowship and worship. Take time to gather with believers, reflect on God's goodness, and prepare for the upcoming week.
        </p>
      </div>

      {memoryVerse && (
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-amber-200/60 dark:border-amber-900/60 max-w-lg mx-auto text-left shadow-sm">
          <span className="text-xs font-bold uppercase tracking-wider text-amber-700 dark:text-amber-400 block mb-1">
            Weekly Memory Verse Recitation:
          </span>
          <p className="font-serif italic text-sm sm:text-base text-slate-800 dark:text-slate-200">
            {memoryVerse}
          </p>
        </div>
      )}

      <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2 max-w-md mx-auto">
        {sermonUrl && (
          <a
            href={sermonUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm bg-amber-500 text-white hover:bg-amber-600 shadow-md transition-all active:scale-95"
          >
            <Headphones className="w-4 h-4" />
            <span>Listen to Sermon</span>
            <ExternalLink className="w-3.5 h-3.5 opacity-80" />
          </a>
        )}

        <button
          onClick={onSwitchToReading}
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all active:scale-95"
        >
          <BookOpen className="w-4 h-4" />
          <span>Review Readings</span>
        </button>
      </div>
    </div>
  );
};

