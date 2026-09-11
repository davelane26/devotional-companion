import React, { useState, useEffect } from 'react';
import { ExternalLink, Headphones, Quote, Sparkles, BookMarked } from 'lucide-react';
import { SermonPlanResponse, SermonDay, ReaderSettings } from '../types/devotional';
import { DateScrubber, ScrubberItem } from './DateScrubber';
import { ScriptureLink } from './ScriptureLink';
import { ReflectionNotes } from './ReflectionNotes';
import { SundayRestView } from './SundayRestView';
import { getSermonDayDate, getTodayDateString, isDateInWeek } from '../utils/dateUtils';

interface SermonViewProps {
  plan: SermonPlanResponse;
  settings: ReaderSettings;
}

export const SermonView: React.FC<SermonViewProps> = ({ plan, settings }) => {
  const [selectedDayIndex, setSelectedDayIndex] = useState<number>(0);
  const [isSundayView, setIsSundayView] = useState<boolean>(false);
  const [showMemoryVerse, setShowMemoryVerse] = useState<boolean>(true);

  // Determine initial selected day based on today's date
  useEffect(() => {
    const todayStr = getTodayDateString();
    const todayDate = new Date();
    const isTodaySunday = todayDate.getDay() === 0;

    if (isDateInWeek(todayStr, plan.week_of)) {
      if (isTodaySunday) {
        setIsSundayView(true);
        // Default to Saturday or keep Sunday view
        setSelectedDayIndex(5);
      } else {
        setIsSundayView(false);
        // Find day index corresponding to today's date
        const matchIndex = plan.days.findIndex((d) => {
          const dayDate = getSermonDayDate(plan.week_of, d.day);
          return dayDate === todayStr;
        });
        if (matchIndex !== -1) {
          setSelectedDayIndex(matchIndex);
        }
      }
    } else {
      // If outside current week, default to Monday
      setSelectedDayIndex(0);
    }
  }, [plan.week_of, plan.days]);

  const currentDay: SermonDay | undefined = plan.days[selectedDayIndex];
  const currentDayDate = currentDay ? getSermonDayDate(plan.week_of, currentDay.day) : '';

  // Prepare scrubber items
  const scrubberItems: ScrubberItem[] = plan.days.map((d, index) => {
    const dateStr = getSermonDayDate(plan.week_of, d.day);
    const noteId = `sermon_${plan.week_of}_${d.day}`;
    const hasNote = Boolean(localStorage.getItem(`note_${noteId}`));
    return {
      key: String(index),
      dateStr,
      label: d.day.slice(0, 3),
      subLabel: `Day ${index + 1}`,
      hasNote,
    };
  });

  // Jump to today
  const handleJumpToday = () => {
    const todayStr = getTodayDateString();
    const todayDate = new Date();
    if (todayDate.getDay() === 0) {
      setIsSundayView(true);
      return;
    }
    setIsSundayView(false);
    const matchIndex = plan.days.findIndex((d) => {
      const dayDate = getSermonDayDate(plan.week_of, d.day);
      return dayDate === todayStr;
    });
    if (matchIndex !== -1) {
      setSelectedDayIndex(matchIndex);
    }
  };

  // Reading font size class map
  const fontSizeClasses = {
    sm: 'text-sm leading-relaxed',
    base: 'text-base leading-relaxed sm:text-lg sm:leading-relaxed',
    lg: 'text-lg leading-relaxed sm:text-xl sm:leading-relaxed',
    xl: 'text-xl leading-relaxed sm:text-2xl sm:leading-relaxed',
  };

  const fontFamilyClass = settings.fontFamily === 'serif' ? 'font-serif' : 'font-sans';

  return (
    <div className="space-y-6">
      {/* Sermon Info & Memory Verse Header Card */}
      <div className="p-4 sm:p-5 rounded-3xl bg-gradient-to-br from-amber-500/10 via-amber-500/5 to-transparent border border-amber-500/20 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
          <div>
            <span className="text-[11px] font-semibold uppercase tracking-wider text-amber-700 dark:text-amber-400">
              Weekly Sermon Series • Week of {plan.week_of}
            </span>
            <h2 className="text-lg sm:text-xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
              {plan.sermon_title}
            </h2>
          </div>

          {plan.sermon_url && (
            <a
              href={plan.sermon_url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold bg-amber-500 text-white hover:bg-amber-600 active:scale-95 transition-all shadow-sm shrink-0 self-start sm:self-auto"
            >
              <Headphones className="w-4 h-4" />
              <span>Listen to Sermon</span>
              <ExternalLink className="w-3 h-3 opacity-80" />
            </a>
          )}
        </div>

        {/* Memory Verse Box */}
        {plan.memory_verse && (
          <div className="mt-3 p-3.5 rounded-2xl bg-amber-100/60 dark:bg-amber-950/40 border border-amber-300/60 dark:border-amber-800/40 text-amber-950 dark:text-amber-100">
            <div className="flex items-center justify-between gap-2 mb-1.5">
              <span className="text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 text-amber-800 dark:text-amber-300">
                <BookMarked className="w-3.5 h-3.5" /> Memory Verse for the Week
              </span>
              <button
                onClick={() => setShowMemoryVerse(!showMemoryVerse)}
                className="text-[11px] font-medium opacity-70 hover:opacity-100 underline"
              >
                {showMemoryVerse ? 'Collapse' : 'Show'}
              </button>
            </div>
            {showMemoryVerse && (
              <p className="text-sm sm:text-base font-serif italic leading-relaxed pt-1">
                {plan.memory_verse}
              </p>
            )}
          </div>
        )}
      </div>

      {/* Date Scrubber */}
      <DateScrubber
        title="Weekly Devotional Schedule"
        items={scrubberItems}
        selectedKey={String(selectedDayIndex)}
        onSelectKey={(key) => {
          setIsSundayView(false);
          setSelectedDayIndex(Number(key));
        }}
        onJumpToday={handleJumpToday}
      />

      {/* Sunday Rest Screen or Day Reading Content */}
      {isSundayView ? (
        <SundayRestView
          sermonTitle={plan.sermon_title}
          sermonUrl={plan.sermon_url}
          memoryVerse={plan.memory_verse}
          onSwitchToReading={() => setIsSundayView(false)}
        />
      ) : currentDay ? (
        <article className="space-y-6 pt-2 animate-in fade-in duration-200">
          {/* Day Header */}
          <div className="border-b pb-4 border-slate-200/80 dark:border-slate-800">
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wide bg-amber-100 text-amber-800 dark:bg-amber-950/80 dark:text-amber-300">
                {currentDay.day}
              </span>
              <span className="text-xs text-slate-400">
                Day {selectedDayIndex + 1} of 6
              </span>
            </div>

            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-white mt-2">
              {currentDay.focus}
            </h2>
          </div>

          {/* Key Passages */}
          {currentDay.passages && currentDay.passages.length > 0 && (
            <div className="space-y-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 block">
                Passages to Read Today:
              </span>
              <div className="flex flex-wrap gap-2">
                {currentDay.passages.map((passage, idx) => (
                  <ScriptureLink key={idx} passage={passage} />
                ))}
              </div>
            </div>
          )}

          {/* Message Recap */}
          <div className="space-y-2">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Message Recap
            </h3>
            <div className={`${fontFamilyClass} ${fontSizeClasses[settings.fontSize]} text-slate-800 dark:text-slate-200`}>
              <p>{currentDay.message_recap}</p>
            </div>
          </div>

          {/* Pull Quote */}
          {currentDay.message_quote && (
            <div className="my-6 p-4 sm:p-5 rounded-2xl bg-amber-50 dark:bg-amber-950/25 border-l-4 border-amber-500 text-amber-950 dark:text-amber-200 shadow-sm">
              <div className="flex items-start gap-3">
                <Quote className="w-6 h-6 text-amber-500 shrink-0 mt-0.5" />
                <blockquote className="font-serif italic text-base sm:text-lg leading-relaxed">
                  "{currentDay.message_quote.replace(/^["']|["']$/g, '')}"
                </blockquote>
              </div>
            </div>
          )}

          {/* Related Scripture & Verse Reflection */}
          {(currentDay.related_scripture || currentDay.verse_reflection) && (
            <div className="p-4 sm:p-5 rounded-2xl bg-slate-100/80 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80 space-y-3">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-500" />
                <span className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                  Scripture Reflection
                </span>
                {currentDay.related_scripture && (
                  <ScriptureLink passage={currentDay.related_scripture} className="ml-auto" />
                )}
              </div>
              <p className={`${fontFamilyClass} ${fontSizeClasses[settings.fontSize]} text-slate-700 dark:text-slate-300 font-medium`}>
                {currentDay.verse_reflection}
              </p>
            </div>
          )}

          {/* Reflection Notes Auto-saving */}
          <ReflectionNotes
            noteId={`sermon_${plan.week_of}_${currentDay.day}`}
            type="sermon"
            dateStr={currentDayDate}
            title={`${currentDay.day}: ${currentDay.focus}`}
            subtitle={`Sermon: ${plan.sermon_title}`}
            placeholder="Write your reflections on this message and scripture, or personal prayer points..."
          />
        </article>
      ) : null}
    </div>
  );
};

