import React, { useState, useEffect, useMemo, useRef } from 'react';
import {
  BookOpen,
  ExternalLink,
  CheckCircle2,
  ChevronDown,
  ListFilter,
  Headphones,
  Volume2,
  Play,
} from 'lucide-react';
import { BookStudyResponse, ReaderSettings } from '../types/devotional';
import { DateScrubber, ScrubberItem } from './DateScrubber';
import { ReflectionNotes } from './ReflectionNotes';
import { AudioPlayer } from './AudioPlayer';
import { getTodayDateString, formatReadableDate } from '../utils/dateUtils';
import {
  getDayAudioSchedule,
  getActiveParagraphForTrack,
  getParagraphAudioSeek,
} from '../utils/bookAudioUtils';

interface BookStudyViewProps {
  bookData: BookStudyResponse;
  settings: ReaderSettings;
}

export const BookStudyView: React.FC<BookStudyViewProps> = ({ bookData, settings }) => {
  const dates = useMemo(() => Object.keys(bookData.schedule).sort(), [bookData.schedule]);

  // Selected date
  const [selectedDate, setSelectedDate] = useState<string>(() => {
    const today = getTodayDateString();
    return bookData.schedule[today] ? today : dates[0] || '';
  });

  const [showChapterPicker, setShowChapterPicker] = useState(false);
  const [completedDates, setCompletedDates] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('completed_book_study_dates');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Audio & Follow-along state
  const [activeTrackIndex, setActiveTrackIndex] = useState(0);
  const [audioCurrentTime, setAudioCurrentTime] = useState(0);
  const [isAudioPlaying, setIsAudioPlaying] = useState(false);
  const [autoScroll, setAutoScroll] = useState(true);
  const [seekTarget, setSeekTarget] = useState<{ time: number; timestamp: number } | null>(null);

  const paragraphRefs = useRef<(HTMLDivElement | null)[]>([]);

  // Reset all audio state and active track when date changes
  useEffect(() => {
    setActiveTrackIndex(0);
    setAudioCurrentTime(0);
    setIsAudioPlaying(false);
    setSeekTarget(null);
  }, [selectedDate]);

  // Check if today matches or when dates change
  useEffect(() => {
    const today = getTodayDateString();
    if (bookData.schedule[today]) {
      setSelectedDate(today);
    } else if (dates.length > 0 && !bookData.schedule[selectedDate]) {
      setSelectedDate(dates[0]);
    }
  }, [dates]);

  const toggleCompleted = (dateStr: string) => {
    setCompletedDates((prev) => {
      const isCompleted = prev.includes(dateStr);
      const next = isCompleted ? prev.filter((d) => d !== dateStr) : [...prev, dateStr];
      try {
        localStorage.setItem('completed_book_study_dates', JSON.stringify(next));
      } catch (e) {
        console.error('Failed to save completed dates', e);
      }
      return next;
    });
  };

  const isCurrentCompleted = completedDates.includes(selectedDate);
  const currentReading = bookData.schedule[selectedDate];

  // Prepare scrubber items
  const scrubberItems: ScrubberItem[] = useMemo(() => {
    const currentIndex = dates.indexOf(selectedDate);
    const windowSize = 7;
    let startIndex = Math.max(0, currentIndex - Math.floor(windowSize / 2));
    let endIndex = Math.min(dates.length, startIndex + windowSize);

    if (endIndex - startIndex < windowSize) {
      startIndex = Math.max(0, endIndex - windowSize);
    }

    const windowDates = dates.slice(startIndex, endIndex);

    return windowDates.map((dateStr) => {
      const item = bookData.schedule[dateStr];
      const chNum = item?.chapters?.[0]?.number;
      const noteId = `book_${dateStr}`;
      const hasNote = Boolean(localStorage.getItem(`note_${noteId}`));

      return {
        key: dateStr,
        dateStr,
        label: '',
        subLabel: chNum ? `Ch. ${chNum}` : undefined,
        hasNote,
      };
    });
  }, [dates, selectedDate, bookData.schedule]);

  // Jump to today
  const handleJumpToday = () => {
    const today = getTodayDateString();
    if (bookData.schedule[today]) {
      setSelectedDate(today);
    } else {
      setSelectedDate(dates[0]);
    }
  };

  // Font styling
  const fontSizeClasses = {
    sm: 'text-sm leading-relaxed',
    base: 'text-base leading-relaxed sm:text-lg sm:leading-relaxed',
    lg: 'text-lg leading-relaxed sm:text-xl sm:leading-relaxed',
    xl: 'text-xl leading-relaxed sm:text-2xl sm:leading-relaxed',
  };

  const fontFamilyClass = settings.fontFamily === 'serif' ? 'font-serif' : 'font-sans';

  // Split content into clean paragraphs
  const paragraphs = useMemo(() => {
    if (!currentReading?.text) return [];
    return currentReading.text
      .split(/\n\s*\n/)
      .map((p) => p.trim())
      .filter((p) => p.length > 0);
  }, [currentReading?.text]);

  // Schedule metadata for audio tracks and paragraph timestamps
  const daySchedule = useMemo(() => getDayAudioSchedule(selectedDate), [selectedDate]);

  // Current active chapter track
  const currentTrack = useMemo(() => {
    if (!daySchedule || !daySchedule.tracks || daySchedule.tracks.length === 0) return null;
    return daySchedule.tracks[activeTrackIndex] || daySchedule.tracks[0];
  }, [daySchedule, activeTrackIndex]);

  const chapterTitle = currentTrack?.chapterTitle || currentReading?.chapters?.[0]?.title;
  const chapterNumber = currentTrack?.chapterNumber || currentReading?.chapters?.[0]?.number;

  // Active paragraph index matching current audio time
  const activeParagraphIndex = useMemo(() => {
    if (currentTrack) {
      return getActiveParagraphForTrack(audioCurrentTime, currentTrack);
    }
    return -1;
  }, [audioCurrentTime, currentTrack]);

  // Auto-scroll to active paragraph if enabled
  useEffect(() => {
    if (autoScroll && isAudioPlaying && activeParagraphIndex >= 0) {
      const el = paragraphRefs.current[activeParagraphIndex];
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }
  }, [activeParagraphIndex, autoScroll, isAudioPlaying]);

  // Jump Zac audio to specific paragraph
  const handleJumpToParagraph = (index: number) => {
    const seekInfo = getParagraphAudioSeek(index, daySchedule);
    if (seekInfo) {
      if (seekInfo.trackIndex !== activeTrackIndex) {
        setActiveTrackIndex(seekInfo.trackIndex);
      }
      setSeekTarget({ time: seekInfo.seekTime, timestamp: Date.now() });
    }
  };

  // Scroll to active paragraph manually
  const handleScrollToActiveParagraph = () => {
    if (activeParagraphIndex >= 0) {
      const el = paragraphRefs.current[activeParagraphIndex];
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }
  };

  return (
    <div className="space-y-5">
      {/* Chapter Picker Modal / Dropdown */}
      {showChapterPicker && (
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl space-y-3 animate-in fade-in zoom-in-95 duration-150 max-h-80 overflow-y-auto">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                Select Chapter ({dates.length} Days)
              </h3>
              <p className="text-[11px] text-slate-400">
                {bookData.book_title} by {bookData.book_author}
              </p>
            </div>
            <div className="flex items-center gap-2">
              {bookData.source_url && (
                <a
                  href={bookData.source_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-xs text-indigo-600 dark:text-indigo-400 hover:underline"
                >
                  <BookOpen className="w-3 h-3" />
                  <span>Original Book</span>
                  <ExternalLink className="w-2.5 h-2.5 opacity-70" />
                </a>
              )}
              <button
                onClick={() => setShowChapterPicker(false)}
                className="text-xs font-semibold text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 px-2 py-1"
              >
                Close
              </button>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {dates.map((dateStr) => {
              const item = bookData.schedule[dateStr];
              const isSelected = dateStr === selectedDate;
              const isDone = completedDates.includes(dateStr);
              return (
                <button
                  key={dateStr}
                  onClick={() => {
                    setSelectedDate(dateStr);
                    setShowChapterPicker(false);
                  }}
                  className={`text-left p-2.5 rounded-xl border text-xs transition-all flex items-start justify-between gap-2 ${
                    isSelected
                      ? 'bg-indigo-50 dark:bg-indigo-950/60 border-indigo-400 text-indigo-950 dark:text-indigo-200 font-medium'
                      : 'border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/60'
                  }`}
                >
                  <div className="min-w-0">
                    <div className="font-semibold truncate">
                      {item?.chapters?.[0] ? `Ch. ${item.chapters[0].number}: ${item.chapters[0].title}` : 'Daily Reading'}
                    </div>
                    <div className="text-[10px] text-slate-400 mt-0.5">
                      {dateStr}
                    </div>
                  </div>
                  {isDone && <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Date Scrubber */}
      <DateScrubber
        title="Study Reading Schedule"
        items={scrubberItems}
        selectedKey={selectedDate}
        onSelectKey={(key) => setSelectedDate(key)}
        onJumpToday={handleJumpToday}
      />

      {/* Reading Article */}
      {currentReading ? (
        <article className="space-y-6 pt-2 animate-in fade-in duration-200">
          {/* Unified Chapter Banner */}
          <div className="border-b pb-4 border-slate-200/80 dark:border-slate-800 flex flex-col sm:flex-row sm:items-start justify-between gap-3">
            <div>
              <div className="flex flex-wrap items-center gap-2 mb-1.5">
                {chapterNumber && (
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wide bg-indigo-100 text-indigo-800 dark:bg-indigo-950/80 dark:text-indigo-300">
                    Chapter {chapterNumber}
                  </span>
                )}
                <span className="text-xs text-slate-500 dark:text-slate-400">
                  {bookData.book_title} • {bookData.book_author} • {formatReadableDate(selectedDate)}
                </span>
              </div>
              <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
                {chapterTitle || 'Daily Reading'}
              </h2>
            </div>

            <div className="flex items-center gap-2 self-start shrink-0">
              <button
                onClick={() => setShowChapterPicker(!showChapterPicker)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800 text-indigo-700 dark:text-indigo-300 hover:bg-indigo-100 dark:hover:bg-indigo-900 transition-all active:scale-95"
                title="Select from all 72 chapters"
              >
                <ListFilter className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
                <span>All Chapters</span>
                <ChevronDown className="w-3 h-3" />
              </button>

              <button
                onClick={() => toggleCompleted(selectedDate)}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all active:scale-95 shrink-0 ${
                  isCurrentCompleted
                    ? 'bg-emerald-50 dark:bg-emerald-950/60 border-emerald-300 text-emerald-700 dark:text-emerald-300'
                    : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-50'
                }`}
              >
                <CheckCircle2 className={`w-3.5 h-3.5 ${isCurrentCompleted ? 'text-emerald-600' : 'opacity-40'}`} />
                <span>{isCurrentCompleted ? 'Completed' : 'Mark Read'}</span>
              </button>
            </div>
          </div>

          {/* Zac Poonen Follow-Along Audio Player */}
          {currentTrack?.audioUrl && (
            <AudioPlayer
              key={`${selectedDate}-${currentTrack.audioUrl}-${activeTrackIndex}`}
              src={currentTrack.audioUrl}
              title={`Chapter ${currentTrack.chapterNumber}: ${currentTrack.chapterTitle}`}
              studyUrl={currentTrack.studyUrl}
              initialTime={currentTrack.startOffsetSec}
              tracks={daySchedule?.tracks}
              activeTrackIndex={activeTrackIndex}
              onSelectTrack={(tIdx) => {
                setActiveTrackIndex(tIdx);
                const target = daySchedule?.tracks[tIdx];
                const start = target?.startOffsetSec || 0;
                setAudioCurrentTime(start);
                setSeekTarget({ time: start, timestamp: Date.now() });
              }}
              activeParagraphIndex={activeParagraphIndex}
              totalParagraphs={paragraphs.length}
              onTimeUpdate={(cur) => {
                setAudioCurrentTime(cur);
              }}
              onPlayingChange={setIsAudioPlaying}
              seekTarget={seekTarget}
              onJumpToActiveParagraph={handleScrollToActiveParagraph}
              autoScroll={autoScroll}
              onToggleAutoScroll={() => setAutoScroll(!autoScroll)}
            />
          )}

          {/* Follow-Along Reading Text Content with Paragraph Highlighting */}
          <div className={`space-y-4 text-slate-800 dark:text-slate-200 ${fontFamilyClass} ${fontSizeClasses[settings.fontSize]}`}>
            {paragraphs.map((p, idx) => {
              const isActive = isAudioPlaying && activeParagraphIndex === idx;
              // Check if a chapter section header should be rendered before this paragraph
              const sectionTrack = daySchedule?.tracks && daySchedule.tracks.length > 1
                ? daySchedule.tracks.find((t) => t.paragraphIndices[0] === idx)
                : null;

              return (
                <React.Fragment key={idx}>
                  {sectionTrack && (
                    <div className="pt-4 pb-2 border-b border-indigo-200/60 dark:border-indigo-800/60 flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 rounded-md text-[11px] font-bold uppercase tracking-wide bg-indigo-100 text-indigo-800 dark:bg-indigo-950 dark:text-indigo-300">
                          Chapter {sectionTrack.chapterNumber}
                        </span>
                        <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-slate-100">
                          {sectionTrack.chapterTitle}
                        </h3>
                      </div>
                      <button
                        onClick={() => {
                          const tIdx = daySchedule ? daySchedule.tracks.indexOf(sectionTrack) : -1;
                          if (tIdx !== -1) {
                            setActiveTrackIndex(tIdx);
                            setSeekTarget({ time: sectionTrack.startOffsetSec, timestamp: Date.now() });
                          }
                        }}
                        className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-xl text-xs font-semibold border transition-all active:scale-95 ${
                          currentTrack?.chapterNumber === sectionTrack.chapterNumber
                            ? 'bg-indigo-600 text-white border-indigo-700 shadow-2xs'
                            : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50'
                        }`}
                      >
                        <Play className="w-3 h-3 fill-current" />
                        <span>Listen to Ch. {sectionTrack.chapterNumber}</span>
                      </button>
                    </div>
                  )}

                  <div
                    ref={(el) => {
                      paragraphRefs.current[idx] = el;
                    }}
                    onClick={() => handleJumpToParagraph(idx)}
                    className={`relative group p-3.5 sm:p-4 rounded-2xl transition-all duration-300 cursor-pointer ${
                      isActive
                        ? 'border-l-4 border-indigo-600 bg-indigo-50/80 dark:bg-indigo-950/40 shadow-xs'
                        : 'hover:bg-slate-100/60 dark:hover:bg-slate-800/40 border-l-4 border-transparent'
                    }`}
                    title="Click to jump Zac's audio to this paragraph"
                  >
                    {/* Active Speaking Indicator */}
                    {isActive && (
                      <div className="flex items-center justify-between gap-2 pb-2 mb-2 border-b border-indigo-200/60 dark:border-indigo-900/60 animate-in fade-in duration-200">
                        <span className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-indigo-700 dark:text-indigo-400">
                          <Volume2 className="w-3.5 h-3.5 text-indigo-600 animate-pulse" />
                          <span>Zac is speaking here • Paragraph {idx + 1} of {paragraphs.length}</span>
                        </span>
                        <span className="text-[10px] font-semibold text-indigo-600 dark:text-indigo-400 bg-indigo-100 dark:bg-indigo-900/60 px-2 py-0.5 rounded-full">
                          Reading Sync Active
                        </span>
                      </div>
                    )}

                    <p className="leading-relaxed">
                      {p}
                    </p>

                    {/* Hover / Tap Hint */}
                    {!isActive && (
                      <div className="opacity-0 group-hover:opacity-100 transition-opacity mt-2 flex justify-end">
                        <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-indigo-600 dark:text-indigo-400 bg-indigo-100/80 dark:bg-indigo-900/60 px-2.5 py-0.5 rounded-full">
                          <Play className="w-2.5 h-2.5 fill-current" />
                          <span>Listen to this section</span>
                        </span>
                      </div>
                    )}
                  </div>
                </React.Fragment>
              );
            })}
          </div>

          {/* Floating "Follow Zac" button if scrolled away while playing */}
          {isAudioPlaying && activeParagraphIndex >= 0 && (
            <button
              onClick={handleScrollToActiveParagraph}
              className="fixed bottom-20 right-4 sm:right-8 z-30 inline-flex items-center gap-2 px-4 py-2.5 rounded-full text-xs font-semibold bg-indigo-600 hover:bg-indigo-700 text-white shadow-xl active:scale-95 transition-all animate-in fade-in slide-in-from-bottom-2"
              title="Jump to where Zac is currently speaking"
            >
              <Headphones className="w-4 h-4 animate-pulse" />
              <span>Follow Zac (Para {activeParagraphIndex + 1})</span>
            </button>
          )}

          {/* Attribution Footer */}
          {bookData.attribution_footer && (
            <div className="pt-6 border-t border-slate-200/60 dark:border-slate-800/80 text-xs text-slate-400 dark:text-slate-500 italic">
              <p>{bookData.attribution_footer.replace(/^[-\s]+/, '')}</p>
            </div>
          )}

          {/* Reflection Notes Auto-saving */}
          <ReflectionNotes
            noteId={`book_${selectedDate}`}
            type="book"
            dateStr={selectedDate}
            title={chapterTitle ? `Ch. ${chapterNumber}: ${chapterTitle}` : `Reading for ${selectedDate}`}
            subtitle={`Book: ${bookData.book_title}`}
            placeholder="Write your reflections on this chapter, insights, or key takeaways..."
          />
        </article>
      ) : (
        <div className="p-8 text-center text-slate-500">
          No reading found for {selectedDate}. Please pick another date.
        </div>
      )}
    </div>
  );
};
