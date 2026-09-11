import React from 'react';
import { Sun, Moon, Book, Type, BookOpen, QrCode, ExternalLink } from 'lucide-react';
import { ReaderSettings, ReaderTheme, ReaderFontSize, BibleTranslation } from '../types/devotional';
import { BIBLE_TRANSLATIONS } from '../utils/scriptureUtils';

interface ReaderControlsProps {
  settings: ReaderSettings;
  onThemeChange: (theme: ReaderTheme) => void;
  onFontSizeChange: (size: ReaderFontSize) => void;
  onFontFamilyChange: (font: 'serif' | 'sans') => void;
  onBibleTranslationChange: (translation: BibleTranslation) => void;
  onShowQrCode?: () => void;
  compact?: boolean;
}

export const ReaderControls: React.FC<ReaderControlsProps> = ({
  settings,
  onThemeChange,
  onFontSizeChange,
  onFontFamilyChange,
  onBibleTranslationChange,
  onShowQrCode,
  compact = false,
}) => {
  const fontSizes: { label: string; value: ReaderFontSize; sample: string }[] = [
    { label: 'Small', value: 'sm', sample: 'A' },
    { label: 'Normal', value: 'base', sample: 'A' },
    { label: 'Large', value: 'lg', sample: 'A' },
    { label: 'X-Large', value: 'xl', sample: 'A' },
  ];

  const themes: { label: string; value: ReaderTheme; icon: React.ReactNode; bg: string }[] = [
    {
      label: 'Light',
      value: 'light',
      icon: <Sun className="w-4 h-4" />,
      bg: 'bg-white text-slate-800 border-slate-300',
    },
    {
      label: 'Sepia',
      value: 'sepia',
      icon: <Book className="w-4 h-4 text-amber-900" />,
      bg: 'bg-[#f6f0df] text-[#432d19] border-[#d5b27a]',
    },
    {
      label: 'Dark',
      value: 'dark',
      icon: <Moon className="w-4 h-4 text-amber-300" />,
      bg: 'bg-slate-900 text-slate-100 border-slate-700',
    },
  ];

  if (compact) {
    return (
      <div className="flex items-center gap-1.5 p-1 rounded-xl bg-slate-100/90 dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700 backdrop-blur-sm">
        {/* Quick Theme Switcher */}
        <div className="flex items-center gap-0.5">
          {themes.map((t) => (
            <button
              key={t.value}
              onClick={() => onThemeChange(t.value)}
              className={`p-1.5 rounded-lg transition-all ${
                settings.theme === t.value
                  ? 'bg-white dark:bg-slate-700 shadow-sm ring-1 ring-amber-500/50'
                  : 'opacity-60 hover:opacity-100'
              }`}
              title={`Switch to ${t.label} mode`}
            >
              {t.icon}
            </button>
          ))}
        </div>

        <div className="w-[1px] h-4 bg-slate-300 dark:bg-slate-700 mx-0.5" />

        {/* Quick Font Size Switcher */}
        <button
          onClick={() => {
            const sizes: ReaderFontSize[] = ['sm', 'base', 'lg', 'xl'];
            const currentIndex = sizes.indexOf(settings.fontSize);
            const nextIndex = (currentIndex + 1) % sizes.length;
            onFontSizeChange(sizes[nextIndex]);
          }}
          className="px-2 py-1 rounded-lg text-xs font-semibold hover:bg-white dark:hover:bg-slate-700 transition-all flex items-center gap-1"
          title="Toggle font size"
        >
          <Type className="w-3.5 h-3.5" />
          <span className="uppercase text-[10px] font-mono">{settings.fontSize}</span>
        </button>
      </div>
    );
  }

  return (
    <div className="p-4 space-y-4 rounded-2xl bg-white/95 dark:bg-slate-900/95 border border-slate-200 dark:border-slate-800 shadow-xl backdrop-blur-md">
      {/* Theme Selection */}
      <div>
        <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">
          Reading Theme
        </label>
        <div className="grid grid-cols-3 gap-2">
          {themes.map((t) => (
            <button
              key={t.value}
              onClick={() => onThemeChange(t.value)}
              className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl border text-sm font-medium transition-all ${t.bg} ${
                settings.theme === t.value
                  ? 'ring-2 ring-amber-500 shadow-md font-semibold'
                  : 'opacity-70 hover:opacity-100'
              }`}
            >
              {t.icon}
              <span>{t.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Font Size Selection */}
      <div>
        <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">
          Text Size
        </label>
        <div className="grid grid-cols-4 gap-2">
          {fontSizes.map((f, i) => (
            <button
              key={f.value}
              onClick={() => onFontSizeChange(f.value)}
              className={`flex flex-col items-center justify-center py-2 px-1 rounded-xl border transition-all ${
                settings.fontSize === f.value
                  ? 'bg-amber-500 text-white border-amber-600 shadow-sm font-bold'
                  : 'bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700'
              }`}
            >
              <span className={`leading-none ${i === 0 ? 'text-sm' : i === 1 ? 'text-base' : i === 2 ? 'text-lg' : 'text-xl'}`}>
                {f.sample}
              </span>
              <span className="text-[10px] mt-1 opacity-80">{f.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Font Family Selection */}
      <div>
        <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">
          Typeface
        </label>
        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={() => onFontFamilyChange('serif')}
            className={`py-2 px-3 rounded-xl border text-sm transition-all font-serif ${
              settings.fontFamily === 'serif'
                ? 'bg-amber-100 dark:bg-amber-950/60 text-amber-950 dark:text-amber-200 border-amber-400 font-semibold'
                : 'bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700'
            }`}
          >
            Serif (Book)
          </button>
          <button
            onClick={() => onFontFamilyChange('sans')}
            className={`py-2 px-3 rounded-xl border text-sm transition-all font-sans ${
              settings.fontFamily === 'sans'
                ? 'bg-amber-100 dark:bg-amber-950/60 text-amber-950 dark:text-amber-200 border-amber-400 font-semibold'
                : 'bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700'
            }`}
          >
            Sans (Clean)
          </button>
        </div>
      </div>

      {/* Bible Translation Switcher */}
      <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
        <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2 flex items-center justify-between">
          <span className="flex items-center gap-1.5">
            <BookOpen className="w-3.5 h-3.5 text-amber-500" />
            Bible Translation (Scripture Links)
          </span>
          <span className="text-[10px] font-bold text-amber-600 dark:text-amber-400">
            {settings.bibleTranslation}
          </span>
        </label>
        <div className="grid grid-cols-3 gap-2">
          {BIBLE_TRANSLATIONS.map((t) => {
            const isSelected = settings.bibleTranslation === t.code;
            return (
              <button
                key={t.code}
                onClick={() => onBibleTranslationChange(t.code)}
                className={`py-2 px-2 rounded-xl border text-xs font-medium transition-all text-center ${
                  isSelected
                    ? 'bg-amber-500 text-white border-amber-600 shadow-sm font-bold'
                    : 'bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700'
                }`}
                title={t.name}
              >
                <div className="font-bold">{t.label}</div>
                <div className={`text-[9px] truncate mt-0.5 ${isSelected ? 'text-amber-100' : 'text-slate-400'}`}>
                  {t.code === 'NASB1995' ? 'Standard' : t.name.split(' ')[0]}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Footer Utility Actions: Phone QR Code & PWA Info */}
      <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
        {onShowQrCode ? (
          <button
            onClick={onShowQrCode}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-amber-50 dark:bg-amber-950/50 border border-amber-200 dark:border-amber-800 text-amber-800 dark:text-amber-300 hover:bg-amber-100 dark:hover:bg-amber-900/60 transition-all active:scale-95 shadow-2xs"
          >
            <QrCode className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
            <span>Open on Phone (QR Code)</span>
          </button>
        ) : <div />}

        <a
          href="https://github.com/davelane26/devotional-companion"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 text-[11px] text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
        >
          <span>Companion App v1.0</span>
          <ExternalLink className="w-3 h-3 opacity-60" />
        </a>
      </div>
    </div>
  );
};
