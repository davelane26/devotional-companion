import React from 'react';
import { ChevronLeft, ChevronRight, CalendarDays } from 'lucide-react';
import { formatDayDisplay, isToday } from '../utils/dateUtils';

export interface ScrubberItem {
  key: string; // identifier, e.g. "Monday" or "2026-09-10"
  dateStr: string; // YYYY-MM-DD
  label: string; // e.g. "Mon" or "Monday"
  subLabel?: string; // e.g. "Ch. 4" or "Day 4"
  badge?: string;
  hasNote?: boolean;
}

interface DateScrubberProps {
  items: ScrubberItem[];
  selectedKey: string;
  onSelectKey: (key: string) => void;
  onJumpToday?: () => void;
  title?: string;
}

export const DateScrubber: React.FC<DateScrubberProps> = ({
  items,
  selectedKey,
  onSelectKey,
  onJumpToday,
  title,
}) => {
  const currentIndex = items.findIndex((i) => i.key === selectedKey);
  const canGoPrev = currentIndex > 0;
  const canGoNext = currentIndex < items.length - 1 && currentIndex !== -1;

  const handlePrev = () => {
    if (canGoPrev) {
      onSelectKey(items[currentIndex - 1].key);
    }
  };

  const handleNext = () => {
    if (canGoNext) {
      onSelectKey(items[currentIndex + 1].key);
    }
  };

  return (
    <div className="w-full space-y-2">
      {/* Scrubber Header / Controls */}
      <div className="flex items-center justify-between gap-2 px-1">
        <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 dark:text-slate-400">
          <CalendarDays className="w-3.5 h-3.5 text-amber-500" />
          <span>{title || 'Daily Schedule'}</span>
        </div>

        <div className="flex items-center gap-1">
          {onJumpToday && (
            <button
              onClick={onJumpToday}
              className="px-2 py-1 text-xs font-medium rounded-lg text-amber-700 bg-amber-100 hover:bg-amber-200 dark:bg-amber-950 dark:text-amber-300 dark:hover:bg-amber-900 transition-colors"
            >
              Today
            </button>
          )}

          <button
            onClick={handlePrev}
            disabled={!canGoPrev}
            className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 disabled:opacity-30 disabled:pointer-events-none hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            title="Previous reading"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          <button
            onClick={handleNext}
            disabled={!canGoNext}
            className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 disabled:opacity-30 disabled:pointer-events-none hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            title="Next reading"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Horizontal Day Tiles */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1.5 pt-0.5 no-scrollbar scroll-smooth">
        {items.map((item) => {
          const isSelected = item.key === selectedKey;
          const isCurrentDay = isToday(item.dateStr);
          const { dayName, dayNum } = formatDayDisplay(item.dateStr);

          return (
            <button
              key={item.key}
              onClick={() => onSelectKey(item.key)}
              className={`flex flex-col items-center justify-center min-w-[56px] sm:min-w-[64px] py-2 px-1.5 rounded-2xl border transition-all duration-150 active:scale-95 relative ${
                isSelected
                  ? 'bg-amber-500 text-white border-amber-600 shadow-md font-semibold'
                  : isCurrentDay
                  ? 'bg-amber-50 dark:bg-amber-950/30 text-amber-900 dark:text-amber-200 border-amber-300 dark:border-amber-800/80 hover:bg-amber-100'
                  : 'bg-white dark:bg-slate-800/70 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800'
              }`}
            >
              <span
                className={`text-[11px] uppercase tracking-wider ${
                  isSelected ? 'text-amber-100' : 'text-slate-400 dark:text-slate-500'
                }`}
              >
                {item.label || dayName}
              </span>
              <span className="text-base sm:text-lg font-bold leading-tight my-0.5">
                {dayNum}
              </span>
              {item.subLabel ? (
                <span
                  className={`text-[9px] truncate max-w-[50px] ${
                    isSelected ? 'text-amber-100' : 'text-slate-400 dark:text-slate-500'
                  }`}
                >
                  {item.subLabel}
                </span>
              ) : null}

              {/* Indicator dot if note exists */}
              {item.hasNote && (
                <span
                  className={`absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full ${
                    isSelected ? 'bg-white' : 'bg-amber-500'
                  }`}
                  title="Has reflection notes"
                />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};

