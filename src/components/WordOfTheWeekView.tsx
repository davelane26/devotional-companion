import React, { useState, useEffect, useRef } from 'react';
import {
  Sparkles,
  Play,
  Pause,
  Square,
  SkipBack,
  SkipForward,
  Volume2,
  ExternalLink,
  BookOpen,
  Calendar,
  CheckCircle2,
  Sliders,
} from 'lucide-react';
import { ReaderSettings } from '../types/devotional';
import { WFTW_ARTICLES } from '../data/wftwData';
import { useNaturalSpeech } from '../hooks/useNaturalSpeech';
import { getBibleGatewayUrl } from '../utils/scriptureUtils';
import { ReflectionNotes } from './ReflectionNotes';

interface WordOfTheWeekViewProps {
  settings: ReaderSettings;
}

export const WordOfTheWeekView: React.FC<WordOfTheWeekViewProps> = ({ settings }) => {
  // Articles: sorted latest first (index 0 = newest)
  const articles = WFTW_ARTICLES;
  const [selectedArticleId, setSelectedArticleId] = useState<string>(() => articles[0]?.id || '');
  const [autoScroll, setAutoScroll] = useState(true);
  const [showVoicePicker, setShowVoicePicker] = useState(false);
  const [completedArticles, setCompletedArticles] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('completed_wftw_articles');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const activeArticle = articles.find((a) => a.id === selectedArticleId) || articles[0];
  const paragraphs = activeArticle ? activeArticle.paragraphs : [];

  const paragraphRefs = useRef<(HTMLDivElement | null)[]>([]);

  const {
    isPlaying,
    isPaused,
    activeParagraphIndex,
    rate,
    setRate,
    voices,
    selectedVoice,
    setSelectedVoice,
    play,
    pause,
    resume,
    stop,
    nextParagraph,
    prevParagraph,
    speakParagraph,
    isSupported,
  } = useNaturalSpeech(paragraphs);

  // Auto-scroll to active paragraph
  useEffect(() => {
    if (isPlaying && autoScroll && paragraphRefs.current[activeParagraphIndex]) {
      paragraphRefs.current[activeParagraphIndex]?.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
      });
    }
  }, [activeParagraphIndex, isPlaying, autoScroll]);

  // Reset paragraph refs array when article changes
  useEffect(() => {
    paragraphRefs.current = [];
  }, [selectedArticleId]);

  const toggleCompleted = (id: string) => {
    setCompletedArticles((prev) => {
      const next = prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id];
      try {
        localStorage.setItem('completed_wftw_articles', JSON.stringify(next));
      } catch (e) {
        console.error('Failed to save completed WFTW articles', e);
      }
      return next;
    });
  };

  const isCurrentCompleted = completedArticles.includes(activeArticle.id);

  return (
    <div className="space-y-6">
      {/* Top Banner / Hero */}
      <div className="bg-gradient-to-r from-amber-500/10 via-amber-500/5 to-transparent border border-amber-300/40 dark:border-amber-600/30 rounded-2xl p-4 sm:p-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 dark:bg-amber-500/30 flex items-center justify-center text-amber-600 dark:text-amber-400 shrink-0">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h1 className="text-base sm:text-lg font-bold text-slate-800 dark:text-slate-100">
                  Word for the Week
                </h1>
                <span className="text-[11px] font-semibold uppercase tracking-wider bg-amber-500/15 text-amber-700 dark:text-amber-300 px-2 py-0.5 rounded-full">
                  Friday CFC Devotional
                </span>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">
                Weekly message by Zac Poonen • Listen with follow-along natural speech
              </p>
            </div>
          </div>

          <button
            onClick={() => toggleCompleted(activeArticle.id)}
            className={`self-start sm:self-auto inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
              isCurrentCompleted
                ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-300/50'
                : 'bg-white/70 dark:bg-slate-800/70 text-slate-600 dark:text-slate-300 border border-slate-300/50 dark:border-slate-700/50 hover:bg-slate-100'
            }`}
          >
            <CheckCircle2 className={`w-3.5 h-3.5 ${isCurrentCompleted ? 'text-emerald-600' : 'text-slate-400'}`} />
            <span>{isCurrentCompleted ? 'Completed' : 'Mark Complete'}</span>
          </button>
        </div>
      </div>

      {/* 5-Edition Selector Pills */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            Last 5 Editions
          </span>
          <span className="text-xs text-slate-400 dark:text-slate-500">
            {articles.length} available
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-5 gap-2">
          {articles.map((art, index) => {
            const isSelected = art.id === activeArticle.id;
            const isDone = completedArticles.includes(art.id);
            return (
              <button
                key={art.id}
                onClick={() => {
                  setSelectedArticleId(art.id);
                  stop();
                }}
                className={`p-3 rounded-xl text-left transition-all border ${
                  isSelected
                    ? 'bg-amber-50 dark:bg-amber-950/40 border-amber-400 dark:border-amber-500 shadow-sm ring-1 ring-amber-400/50'
                    : 'bg-white dark:bg-slate-800/80 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between gap-1 mb-1">
                  <span
                    className={`text-[11px] font-bold ${
                      isSelected
                        ? 'text-amber-700 dark:text-amber-400'
                        : 'text-slate-500 dark:text-slate-400'
                    }`}
                  >
                    {index === 0 ? 'Latest' : art.displayDate}
                  </span>
                  {isDone && <CheckCircle2 className="w-3 h-3 text-emerald-500 shrink-0" />}
                </div>
                <div
                  className={`text-xs font-semibold line-clamp-1 ${
                    isSelected
                      ? 'text-slate-900 dark:text-white'
                      : 'text-slate-700 dark:text-slate-300'
                  }`}
                >
                  {art.title}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Natural Voice Audio Player Bar */}
      <div className="sticky top-16 z-20 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border border-amber-300/60 dark:border-amber-500/30 rounded-2xl shadow-lg p-4 transition-all">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          {/* Status & Paragraph progress */}
          <div className="flex items-center space-x-3">
            <div
              className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 ${
                isPlaying
                  ? 'bg-amber-500 text-white animate-pulse'
                  : 'bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300'
              }`}
            >
              <Volume2 className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center space-x-2">
                <span>Natural Speech Audio</span>
                {!isSupported && (
                  <span className="text-[10px] bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300 px-1.5 py-0.5 rounded font-medium">
                    Browser unsupported
                  </span>
                )}
                {selectedVoice && isSupported && (
                  <span className="text-[10px] bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 px-1.5 py-0.5 rounded font-medium">
                    {selectedVoice.name.slice(0, 18)}
                  </span>
                )}
              </div>
              <div className="text-[11px] text-slate-500 dark:text-slate-400">
                Paragraph {activeParagraphIndex + 1} of {paragraphs.length}
                {isPlaying && ' • Reading along...'}
                {isPaused && ' • Paused'}
              </div>
            </div>
          </div>

          {/* Player controls */}
          <div className="flex items-center space-x-2 self-center">
            <button
              onClick={prevParagraph}
              disabled={activeParagraphIndex <= 0}
              title="Previous paragraph"
              className="p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-40 transition-colors"
            >
              <SkipBack className="w-4 h-4" />
            </button>

            {isPlaying && !isPaused ? (
              <button
                onClick={pause}
                title="Pause"
                className="w-10 h-10 rounded-full bg-amber-500 hover:bg-amber-600 text-white flex items-center justify-center shadow-md hover:scale-105 active:scale-95 transition-all"
              >
                <Pause className="w-5 h-5 fill-current" />
              </button>
            ) : isPaused ? (
              <button
                onClick={resume}
                title="Resume"
                className="w-10 h-10 rounded-full bg-amber-500 hover:bg-amber-600 text-white flex items-center justify-center shadow-md hover:scale-105 active:scale-95 transition-all"
              >
                <Play className="w-5 h-5 fill-current ml-0.5" />
              </button>
            ) : (
              <button
                onClick={() => play(0)}
                title="Play from beginning"
                className="w-10 h-10 rounded-full bg-amber-500 hover:bg-amber-600 text-white flex items-center justify-center shadow-md hover:scale-105 active:scale-95 transition-all"
              >
                <Play className="w-5 h-5 fill-current ml-0.5" />
              </button>
            )}

            <button
              onClick={nextParagraph}
              disabled={activeParagraphIndex >= paragraphs.length - 1}
              title="Next paragraph"
              className="p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-40 transition-colors"
            >
              <SkipForward className="w-4 h-4" />
            </button>

            {(isPlaying || isPaused) && (
              <button
                onClick={stop}
                title="Stop reading"
                className="p-2 rounded-lg text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
              >
                <Square className="w-4 h-4 fill-current" />
              </button>
            )}

            {/* Speed selector */}
            <div className="relative inline-flex items-center ml-1">
              <select
                value={rate}
                onChange={(e) => setRate(parseFloat(e.target.value))}
                aria-label="Speech speed"
                className="text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-lg px-2 py-1.5 border border-slate-300/60 dark:border-slate-700 cursor-pointer focus:outline-none focus:ring-1 focus:ring-amber-500"
              >
                <option value="0.8">0.8x</option>
                <option value="1.0">1.0x</option>
                <option value="1.15">1.15x</option>
                <option value="1.25">1.25x</option>
              </select>
            </div>

            {/* Voice picker button */}
            {voices.length > 0 && (
              <button
                onClick={() => setShowVoicePicker(!showVoicePicker)}
                title="Choose voice"
                className="p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                <Sliders className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Voice selection popover */}
        {showVoicePicker && voices.length > 0 && (
          <div className="mt-3 pt-3 border-t border-slate-200 dark:border-slate-800">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center space-x-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                <span>Select Voice</span>
              </span>
              <button
                onClick={() => setShowVoicePicker(false)}
                className="text-xs text-slate-400 hover:text-slate-600"
              >
                Done
              </button>
            </div>
            <div className="max-h-40 overflow-y-auto space-y-1 pr-1">
              {voices.slice(0, 10).map((v, i) => {
                const isSelected = selectedVoice?.name === v.voice.name;
                return (
                  <button
                    key={i}
                    onClick={() => {
                      setSelectedVoice(v.voice);
                      setShowVoicePicker(false);
                    }}
                    className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs flex items-center justify-between transition-colors ${
                      isSelected
                        ? 'bg-amber-500 text-white font-semibold'
                        : 'hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    <span className="truncate">{v.name}</span>
                    {v.isNatural && (
                      <span
                        className={`text-[10px] px-1.5 py-0.2 rounded font-medium ${
                          isSelected ? 'bg-amber-600 text-white' : 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                        }`}
                      >
                        Natural
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Progress bar */}
        <div className="mt-3 w-full bg-slate-100 dark:bg-slate-800 h-1 rounded-full overflow-hidden">
          <div
            className="bg-amber-500 h-full transition-all duration-300"
            style={{
              width: `${((activeParagraphIndex + 1) / Math.max(1, paragraphs.length)) * 100}%`,
            }}
          />
        </div>

        {/* Auto-scroll helper */}
        <div className="flex items-center justify-between text-[11px] text-slate-400 dark:text-slate-500 mt-2">
          <span>Tap any paragraph below to jump speech there</span>
          <button
            onClick={() => setAutoScroll(!autoScroll)}
            className="hover:text-amber-600 dark:hover:text-amber-400 transition-colors"
          >
            Auto-scroll: {autoScroll ? 'ON' : 'OFF'}
          </button>
        </div>
      </div>

      {/* Main Article Content */}
      <article className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800/80 rounded-2xl p-5 sm:p-8 shadow-sm">
        {/* Article Meta Header */}
        <header className="border-b border-slate-100 dark:border-slate-800 pb-5 mb-6">
          <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500 dark:text-slate-400 mb-2">
            <span className="inline-flex items-center space-x-1">
              <Calendar className="w-3.5 h-3.5" />
              <span>{activeArticle.displayDate}</span>
            </span>
            <span>•</span>
            <span className="font-semibold text-slate-700 dark:text-slate-300">
              {activeArticle.author}
            </span>
          </div>

          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            {activeArticle.title}
          </h2>

          {/* Scripture Badges */}
          {activeArticle.scriptures && activeArticle.scriptures.length > 0 && (
            <div className="mt-4 flex flex-wrap items-center gap-1.5">
              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 flex items-center space-x-1 mr-1">
                <BookOpen className="w-3.5 h-3.5" />
                <span>Scriptures:</span>
              </span>
              {activeArticle.scriptures.map((ref, idx) => (
                <a
                  key={idx}
                  href={getBibleGatewayUrl(ref, settings.bibleTranslation)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-md text-xs font-medium bg-amber-50 hover:bg-amber-100 dark:bg-amber-950/40 dark:hover:bg-amber-900/60 text-amber-800 dark:text-amber-300 border border-amber-200/60 dark:border-amber-800/40 transition-colors"
                >
                  <span>{ref}</span>
                  <ExternalLink className="w-2.5 h-2.5 opacity-60" />
                </a>
              ))}
            </div>
          )}
        </header>

        {/* Paragraphs with Interactive Highlight & Click-to-Speak */}
        <div
          className={`space-y-5 leading-relaxed ${
            settings.fontFamily === 'serif' ? 'font-serif' : 'font-sans'
          } ${
            settings.fontSize === 'sm'
              ? 'text-sm'
              : settings.fontSize === 'lg'
              ? 'text-lg'
              : settings.fontSize === 'xl'
              ? 'text-xl'
              : 'text-base'
          } text-slate-800 dark:text-slate-200`}
        >
          {paragraphs.map((para, index) => {
            const isActive = isPlaying && activeParagraphIndex === index;
            return (
              <div
                key={index}
                ref={(el) => {
                  paragraphRefs.current[index] = el;
                }}
                onClick={() => speakParagraph(index)}
                className={`p-3.5 rounded-xl transition-all cursor-pointer select-text relative group ${
                  isActive
                    ? 'bg-amber-50 dark:bg-amber-950/40 border-l-4 border-amber-500 shadow-sm ring-1 ring-amber-400/30'
                    : 'hover:bg-slate-50 dark:hover:bg-slate-800/50 border-l-4 border-transparent'
                }`}
              >
                {/* Playing badge on active paragraph */}
                {isActive && (
                  <div className="absolute -left-2 top-3 w-4 h-4 rounded-full bg-amber-500 text-white flex items-center justify-center animate-bounce">
                    <Volume2 className="w-2.5 h-2.5" />
                  </div>
                )}

                <p>{para}</p>

                {/* Hover indicator to speak */}
                <span className="hidden group-hover:inline-flex items-center space-x-1 text-[11px] text-amber-600 dark:text-amber-400 mt-1.5 font-sans font-medium">
                  <Play className="w-2.5 h-2.5 fill-current" />
                  <span>Tap to listen from here</span>
                </span>
              </div>
            );
          })}
        </div>

        {/* Article Footer */}
        <footer className="mt-8 pt-6 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="text-xs text-slate-500 dark:text-slate-400">
            Copyright © Zac Poonen • Christian Fellowship Church, Bangalore
          </div>
          {activeArticle.sourceUrl && (
            <a
              href={activeArticle.sourceUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center space-x-1 text-xs text-amber-600 dark:text-amber-400 hover:underline"
            >
              <span>View original on cfcindia.com</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          )}
        </footer>
      </article>

      {/* Reflection Journal Section for Word of the Week */}
      <ReflectionNotes
        noteId={`wftw-${activeArticle.date}`}
        type="wftw"
        dateStr={activeArticle.date}
        title={`Word for the Week: ${activeArticle.title}`}
        subtitle={`${activeArticle.displayDate} • Zac Poonen`}
      />
    </div>
  );
};
