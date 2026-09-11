import React, { useState, useEffect } from 'react';
import { ExternalLink, Headphones, Quote, ArrowRight, BookOpen } from 'lucide-react';
import { SermonPlanResponse, SermonDay, ReaderSettings } from '../types/devotional';
import { DateScrubber, ScrubberItem } from './DateScrubber';
import { ScriptureLink } from './ScriptureLink';
import { ReflectionNotes } from './ReflectionNotes';
import { SundayRestView } from './SundayRestView';
import { MemoryVerseCard } from './MemoryVerseCard';
import { getSermonDayDate, getTodayDateString, isDateInWeek } from '../utils/dateUtils';

interface SermonViewProps {
  plan: SermonPlanResponse;
  settings: ReaderSettings;
  onNavigateToBookStudy?: () => void;
  todayBookChapter?: { number: number; title: string };
}

export const SermonView: React.FC<SermonViewProps> = ({
  plan,
  settings,
  onNavigateToBookStudy,
  todayBookChapter,
}) => {
  const [selectedDayIndex, setSelectedDayIndex] = useState<number>(0);
  const [isSundayView, setIsSundayView] = useState<boolean>(false);

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
      {/* Sermon Info Header Card */}
      <div className="p-4 sm:p-5 rounded-3xl bg-slate-100/70 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
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

      {/* Memory Verse Box with Zac Poonen Verse-by-Verse Exposition */}
      {plan.memory_verse && (
        <MemoryVerseCard
          memoryVerse={plan.memory_verse}
          bibleTranslation={settings.bibleTranslation}
        />
      )}

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
                Passages to Read Today ({settings.bibleTranslation}):
              </span>
              <div className="flex flex-wrap gap-2">
                {currentDay.passages.map((passage, idx) => (
                  <ScriptureLink
                    key={idx}
                    passage={passage}
                    translation={settings.bibleTranslation}
                  />
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

          {/* Personal Reflection Notes Auto-saving */}
          <ReflectionNotes
            noteId={`sermon_${plan.week_of}_${currentDay.day}`}
            type="sermon"
            dateStr={currentDayDate}
            title={`${currentDay.day}: ${currentDay.focus}`}
            subtitle={`Sermon: ${plan.sermon_title}`}
            placeholder="Write your reflections on this message and scripture, or personal prayer points..."
          />

          {/* Guided Next Step: Book Study */}
          {onNavigateToBookStudy && (
            <div className="pt-2">
              <button
                onClick={onNavigateToBookStudy}
                className="w-full p-4 rounded-2xl bg-gradient-to-r from-indigo-500/10 via-amber-500/10 to-indigo-500/10 border border-indigo-500/20 hover:border-indigo-500/40 dark:border-indigo-500/30 dark:hover:border-indigo-500/50 transition-all flex items-center justify-between group text-left shadow-xs hover:shadow-sm"
              >
                <div className="flex items-center gap-3.5">
                  <div className="w-10 h-10 rounded-xl bg-indigo-500/20 text-indigo-700 dark:text-indigo-300 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                    <BookOpen className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-700 dark:text-indigo-400 block">
                      Next in Today's Flow
                    </span>
                    <div className="text-sm sm:text-base font-bold text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
                      <span>Continue to Book Study</span>
                      {todayBookChapter && (
                        <span className="text-xs font-semibold text-indigo-600 dark:text-indigo-400">
                          (Ch. {todayBookChapter.number})
                        </span>
                      )}
                    </div>
                    {todayBookChapter?.title && (
                      <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-1">
                        {todayBookChapter.title}
                      </p>
                    )}
                  </div>
                </div>
                <div className="p-2 rounded-xl bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 shadow-xs group-hover:translate-x-1 transition-transform shrink-0 ml-2">
                  <ArrowRight className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                </div>
              </button>
            </div>
          )}
        </article>
      ) : null}
    </div>
  );
};
