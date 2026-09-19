import React, { useState, useEffect } from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';
import { useDevotionalData } from './hooks/useDevotionalData';
import { useReaderSettings } from './hooks/useReaderSettings';
import { Header } from './components/Header';
import { NavigationTabs, MobileBottomBar } from './components/NavigationTabs';
import { SermonView } from './components/SermonView';
import { BookStudyView } from './components/BookStudyView';
import { WordOfTheWeekView } from './components/WordOfTheWeekView';
import { JournalView } from './components/JournalView';
import { QrCodeModal } from './components/QrCodeModal';
import { ActiveTab } from './types/devotional';
import { getTodayDateString } from './utils/dateUtils';

const STORAGE_INDEX_KEY = 'all_devotional_reflection_notes_index';

export const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<ActiveTab>('sermon');
  const [notesCount, setNotesCount] = useState<number>(0);
  const [showQrModal, setShowQrModal] = useState<boolean>(false);
  const currentDateStr = getTodayDateString();

  const {
    sermonPlan,
    bookStudy,
    loading,
    error,
    isOffline,
    refetch,
  } = useDevotionalData();

  const {
    settings,
    setTheme,
    setFontSize,
    setFontFamily,
    setBibleTranslation,
  } = useReaderSettings();

  // Update notes count
  useEffect(() => {
    const updateCount = () => {
      try {
        const raw = localStorage.getItem(STORAGE_INDEX_KEY);
        const index = raw ? JSON.parse(raw) : [];
        setNotesCount(Array.isArray(index) ? index.length : 0);
      } catch {
        setNotesCount(0);
      }
    };
    updateCount();
    window.addEventListener('storage', updateCount);
    // Periodic check for local edits
    const interval = setInterval(updateCount, 2000);
    return () => {
      window.removeEventListener('storage', updateCount);
      clearInterval(interval);
    };
  }, []);

  const handleSelectReadingFromJournal = (type: 'sermon' | 'book' | 'wftw') => {
    setActiveTab(type);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Today's companion Book Study chapter (for guided flow from sermon reading)
  const todayBookItem = bookStudy?.schedule[currentDateStr];
  const todayBookChapter = todayBookItem?.chapters?.[0]
    ? { number: todayBookItem.chapters[0].number, title: todayBookItem.chapters[0].title }
    : undefined;

  return (
    <div className="min-h-screen flex flex-col selection:bg-amber-200 dark:selection:bg-amber-900 transition-colors duration-200">
      {/* App Header */}
      <Header
        currentDateStr={currentDateStr}
        isOffline={isOffline}
        isLoading={loading}
        onRefresh={refetch}
        settings={settings}
        onThemeChange={setTheme}
        onFontSizeChange={setFontSize}
        onFontFamilyChange={setFontFamily}
        onBibleTranslationChange={setBibleTranslation}
        onShowQrCode={() => setShowQrModal(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-3xl w-full mx-auto px-4 py-4 sm:py-6 space-y-5 pb-24 sm:pb-12">
        {/* Navigation Tabs (Top) */}
        <NavigationTabs
          activeTab={activeTab}
          onTabChange={setActiveTab}
          notesCount={notesCount}
        />

        {/* Loading State */}
        {loading && !sermonPlan && !bookStudy && (
          <div className="py-20 text-center space-y-4">
            <div className="w-12 h-12 mx-auto rounded-full border-4 border-amber-200 border-t-amber-500 animate-spin" />
            <p className="text-sm font-medium text-slate-600 dark:text-slate-400">
              Loading today's devotional readings...
            </p>
          </div>
        )}

        {/* Error State */}
        {error && !sermonPlan && !bookStudy && (
          <div className="p-6 rounded-3xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 text-center space-y-3">
            <AlertCircle className="w-8 h-8 text-rose-500 mx-auto" />
            <h3 className="text-base font-bold text-rose-900 dark:text-rose-200">
              Unable to load readings
            </h3>
            <p className="text-xs text-rose-700 dark:text-rose-300 max-w-md mx-auto">
              {error}. Please check your connection and try again.
            </p>
            <button
              onClick={refetch}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold bg-rose-600 text-white hover:bg-rose-700 transition-all"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Retry</span>
            </button>
          </div>
        )}

        {/* Sermon Plan View */}
        {activeTab === 'sermon' && sermonPlan && (
          <SermonView
            plan={sermonPlan}
            settings={settings}
            todayBookChapter={todayBookChapter}
            onNavigateToBookStudy={() => {
              setActiveTab('book');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />
        )}

        {/* Book Study View */}
        {activeTab === 'book' && bookStudy && (
          <BookStudyView bookData={bookStudy} settings={settings} />
        )}

        {/* Word of the Week View */}
        {activeTab === 'wftw' && (
          <WordOfTheWeekView settings={settings} />
        )}

        {/* Journal View */}
        {activeTab === 'journal' && (
          <JournalView onSelectReading={handleSelectReadingFromJournal} />
        )}
      </main>

      {/* Mobile Bottom Navigation Bar */}
      <MobileBottomBar
        activeTab={activeTab}
        onTabChange={setActiveTab}
        notesCount={notesCount}
      />

      {/* QR Code Scan Modal */}
      <QrCodeModal
        isOpen={showQrModal}
        onClose={() => setShowQrModal(false)}
      />
    </div>
  );
};

