import { useEffect } from 'react';
import { useLocalStorage } from './useLocalStorage';
import { ReaderSettings, ReaderTheme, ReaderFontSize, BibleTranslation } from '../types/devotional';

const DEFAULT_SETTINGS: ReaderSettings = {
  theme: 'light',
  fontSize: 'base',
  fontFamily: 'serif',
  bibleTranslation: 'NASB1995',
};

export function useReaderSettings() {
  const [settings, setSettings] = useLocalStorage<ReaderSettings>('devotional_reader_settings', DEFAULT_SETTINGS);

  const setTheme = (theme: ReaderTheme) => {
    setSettings((prev) => ({ ...prev, theme }));
  };

  const setFontSize = (fontSize: ReaderFontSize) => {
    setSettings((prev) => ({ ...prev, fontSize }));
  };

  const setFontFamily = (fontFamily: 'serif' | 'sans') => {
    setSettings((prev) => ({ ...prev, fontFamily }));
  };

  const setBibleTranslation = (bibleTranslation: BibleTranslation) => {
    setSettings((prev) => ({ ...prev, bibleTranslation }));
  };

  // Sync theme classes on document and body
  useEffect(() => {
    const root = document.documentElement;
    const body = document.body;

    if (settings.theme === 'dark') {
      root.classList.add('dark');
      body.classList.remove('theme-sepia');
    } else if (settings.theme === 'sepia') {
      root.classList.remove('dark');
      body.classList.add('theme-sepia');
    } else {
      root.classList.remove('dark');
      body.classList.remove('theme-sepia');
    }
  }, [settings.theme]);

  // Ensure bibleTranslation exists if migrating from older local storage
  const effectiveSettings: ReaderSettings = {
    ...settings,
    bibleTranslation: settings.bibleTranslation || 'NASB1995',
  };

  return {
    settings: effectiveSettings,
    setTheme,
    setFontSize,
    setFontFamily,
    setBibleTranslation,
  };
}

