import React, { useState, useEffect, useMemo } from 'react';
import { BookOpen, ExternalLink, CheckCircle2, ChevronDown, ListFilter } from 'lucide-react';
import { BookStudyResponse, ReaderSettings } from '../types/devotional';
import { DateScrubber, ScrubberItem } from './DateScrubber';
import { ReflectionNotes } from './ReflectionNotes';
import { AudioPlayer } from './AudioPlayer';
import { getTodayDateString, formatReadableDate } from '../utils/dateUtils';

interface BookStudyViewProps {
  bookData: BookStudyResponse;
  settings: ReaderSettings;
}

export const BookStudyView: React.FC<BookStudyViewProps> = ({ bookData, settings }) => {
  const dates = useMemo(() => Object.keys(bookData.schedule).sort(), [bookData.schedule]);

  // Determine initial selected date: Today if available, otherwise first date
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

  // Prepare a sliding window of dates for the scrubber around the selected date
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
        label: '', // will be populated from date display
        subLabel: chNum ? `Ch. ${chNum}` : undefined,
        hasNote,
      };
    });
  }, [dates, selectedDate, bookData.schedule]);

  // Handle jump to today
  const handleJumpToday = () => {
    const today = getTodayDateString();
    if (bookData.schedule[today]) {
      setSelectedDate(today);
    } else {
      // Find closest date
      setSelectedDate(dates[0]);
    }
  };

  // Font size and family styling
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

  const chapterTitle = currentReading?.chapters?.[0]?.title;
  const chapterNumber = currentReading?.chapters?.[0]?.number;

  // Resolve audio tracks for current reading
  const audioTracks = useMemo(() => {
    if (!currentReading) return [];
    const tracks: { title?: string; src: string }[] = [];

    // 1. Check chapter level fields
    if (currentReading.chapters && currentReading.chapters.length > 0) {
      currentReading.chapters.forEach((ch) => {
        const src =
          ch.audio_url ||
          ch.mp3 ||
          ch.audio ||
          (ch.url && (ch.url.endsWith('.mp3') || ch.url.includes('/audio/')) ? ch.url : undefined);
        if (src && src.trim()) {
          tracks.push({
            title: `Chapter ${ch.number}: ${ch.title}`,
            src: src.trim(),
          });
        }
      });
    }

    // 2. If no chapter-level audio, check schedule item-level fields
    if (tracks.length === 0) {
      const src =
        currentReading.audio_url ||
        currentReading.mp3 ||
        currentReading.audio ||
        (currentReading.url && (currentReading.url.endsWith('.mp3') || currentReading.url.includes('/audio/'))
          ? currentReading.url
          : undefined);
      if (src && src.trim()) {
        tracks.push({
          title: chapterTitle ? `Chapter ${chapterNumber}: ${chapterTitle}` : undefined,
          src: src.trim(),
        });
      }
    }

    return tracks;
  }, [currentReading, chapterTitle, chapterNumber]);

  return (
    <div className="space-y-6">
      {/* Book Study Header Card */}
      <div className="p-4 sm:p-5 rounded-3xl bg-gradient-to-br from-indigo-500/10 via-amber-500/5 to-transparent border border-indigo-500/20 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-2">
          <div>
            <span className="text-[11px] font-semibold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
              Book Study Plan • By {bookData.book_author}
            </span>
            <h2 className="text-lg sm:text-xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
              {bookData.book_title}
            </h2>
          </div>

          <div className="flex items-center gap-2">
            {bookData.source_url && (
              <a
                href={bookData.source_url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition-all active:scale-95 shadow-sm"
              >
                <BookOpen className="w-3.5 h-3.5 text-indigo-500" />
                <span>Book Info</span>
                <ExternalLink className="w-3 h-3 opacity-60" />
              </a>
            )}

            <button
              onClick={() => setShowChapterPicker(!showChapterPicker)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800 text-indigo-700 dark:text-indigo-300 hover:bg-indigo-100 transition-all active:scale-95"
            >
              <ListFilter className="w-3.5 h-3.5" />
              <span>All Chapters</span>
              <ChevronDown className="w-3 h-3" />
            </button>
          </div>
        </div>

        <p className="text-xs text-slate-500 dark:text-slate-400">
          Reading for {formatReadableDate(selectedDate)}
        </p>
      </div>

      {/* Chapter Picker Modal / Dropdown */}
      {showChapterPicker && (
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl space-y-3 animate-in fade-in zoom-in-95 duration-150 max-h-80 overflow-y-auto">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Select Reading Date or Chapter ({dates.length} Days)
            </h3>
            <button
              onClick={() => setShowChapterPicker(false)}
              className="text-xs text-indigo-600 font-semibold"
            >
              Close
            </button>
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
          {/* Chapter Banner & Mark as Read */}
          <div className="border-b pb-4 border-slate-200/80 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              {chapterNumber && (
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wide bg-indigo-100 text-indigo-800 dark:bg-indigo-950/80 dark:text-indigo-300">
                  Chapter {chapterNumber}
                </span>
              )}
              <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-white mt-1.5">
                {chapterTitle || 'Daily Reading'}
              </h2>
            </div>

            {/* Completed status button */}
            <button
              onClick={() => toggleCompleted(selectedDate)}
              className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold border transition-all active:scale-95 shrink-0 ${
                isCurrentCompleted
                  ? 'bg-emerald-50 dark:bg-emerald-950/60 border-emerald-300 text-emerald-700 dark:text-emerald-300'
                  : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-50'
              }`}
            >
              <CheckCircle2 className={`w-4 h-4 ${isCurrentCompleted ? 'text-emerald-600' : 'opacity-40'}`} />
              <span>{isCurrentCompleted ? 'Completed' : 'Mark as Read'}</span>
            </button>
          </div>

          {/* Audio Player (beneath chapter title) */}
          {audioTracks.length > 0 ? (
            <div className="space-y-3">
              {audioTracks.map((track, idx) => (
                <AudioPlayer key={idx} src={track.src} title={track.title} />
              ))}
            </div>
          ) : (
            <AudioPlayer
              text={currentReading.text}
              title={chapterTitle ? `Chapter ${chapterNumber}: ${chapterTitle}` : undefined}
            />
          )}

          {/* Reading Text Content */}
          <div className={`space-y-5 text-slate-800 dark:text-slate-200 ${fontFamilyClass} ${fontSizeClasses[settings.fontSize]}`}>
            {paragraphs.map((p, idx) => (
              <p key={idx} className="leading-relaxed">
                {p}
              </p>
            ))}
          </div>

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

