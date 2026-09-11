import React, { useState } from 'react';
import { SlidersHorizontal, WifiOff, RotateCw, QrCode } from 'lucide-react';
import { ReaderControls } from './ReaderControls';
import { ReaderSettings, ReaderTheme, ReaderFontSize, BibleTranslation } from '../types/devotional';
import { formatReadableDate, isToday } from '../utils/dateUtils';

interface HeaderProps {
  currentDateStr: string;
  isOffline: boolean;
  isLoading: boolean;
  onRefresh: () => void;
  settings: ReaderSettings;
  onThemeChange: (theme: ReaderTheme) => void;
  onFontSizeChange: (size: ReaderFontSize) => void;
  onFontFamilyChange: (font: 'serif' | 'sans') => void;
  onBibleTranslationChange: (translation: BibleTranslation) => void;
  onShowQrCode: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentDateStr,
  isOffline,
  isLoading,
  onRefresh,
  settings,
  onThemeChange,
  onFontSizeChange,
  onFontFamilyChange,
  onBibleTranslationChange,
  onShowQrCode,
}) => {
  const [showControls, setShowControls] = useState(false);
  const viewingToday = isToday(currentDateStr);

  return (
    <header className="sticky top-0 z-30 w-full border-b transition-colors duration-200 backdrop-blur-md bg-white/90 dark:bg-slate-900/90 border-slate-200/80 dark:border-slate-800">
      <div className="max-w-3xl mx-auto px-4 py-2.5 flex items-center justify-between gap-2">
        {/* Title & Date */}
        <div className="flex flex-col min-w-0">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
            <h1 className="text-sm sm:text-base font-bold tracking-tight truncate">
              Daily Companion
            </h1>
            {viewingToday ? (
              <span className="px-2 py-0.5 text-[11px] font-semibold bg-amber-100 text-amber-800 dark:bg-amber-950/70 dark:text-amber-300 rounded-full">
                Today
              </span>
            ) : null}
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
            {formatReadableDate(currentDateStr)}
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-1.5 shrink-0">
          {isOffline && (
            <div
              className="flex items-center gap-1 px-2 py-1 rounded-lg bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300 text-xs font-medium"
              title="You are offline. Showing cached readings."
            >
              <WifiOff className="w-3.5 h-3.5" />
              <span className="hidden xs:inline">Offline</span>
            </div>
          )}

          {/* QR Code Button for Phone */}
          <button
            onClick={onShowQrCode}
            className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all active:scale-95 border border-transparent hover:border-slate-200 dark:hover:border-slate-700"
            title="Scan QR code on phone"
          >
            <QrCode className="w-4 h-4 text-amber-600 dark:text-amber-400" />
          </button>

          <button
            onClick={onRefresh}
            disabled={isLoading}
            className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all active:scale-95 disabled:opacity-50"
            title="Refresh latest data"
          >
            <RotateCw className={`w-4 h-4 ${isLoading ? 'animate-spin text-amber-500' : ''}`} />
          </button>

          <button
            onClick={() => setShowControls(!showControls)}
            className={`p-2 rounded-xl border transition-all active:scale-95 flex items-center gap-1.5 text-xs font-medium ${
              showControls
                ? 'bg-amber-500 text-white border-amber-600 shadow-sm'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-200 dark:hover:bg-slate-700'
            }`}
            title="Reading settings (font size, theme, Bible translation)"
          >
            <SlidersHorizontal className="w-4 h-4" />
            <span className="hidden sm:inline">Appearance</span>
          </button>
        </div>
      </div>

      {/* Reader Controls Popdown */}
      {showControls && (
        <div className="max-w-3xl mx-auto px-4 pb-4 animate-in fade-in slide-in-from-top-2 duration-150">
          <ReaderControls
            settings={settings}
            onThemeChange={onThemeChange}
            onFontSizeChange={onFontSizeChange}
            onFontFamilyChange={onFontFamilyChange}
            onBibleTranslationChange={onBibleTranslationChange}
            onShowQrCode={onShowQrCode}
          />
        </div>
      )}
    </header>
  );
};
