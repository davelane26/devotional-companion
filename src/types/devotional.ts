// Types for Sermon Study Plan API
export interface SermonDay {
  day: 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday';
  focus: string;
  passages: string[];
  message_recap: string;
  message_quote: string;
  related_scripture: string;
  verse_reflection: string;
  // Computed fields
  date?: string; // YYYY-MM-DD
}

export interface CitedScripture {
  reference: string;
  context?: string;
  position?: number;
}

export interface SermonPlanResponse {
  week_of: string; // e.g. "2026-09-07"
  memory_verse: string;
  sermon_title: string;
  sermon_url: string;
  days: SermonDay[];
  cited_scriptures_detected?: CitedScripture[];
}

// Types for Book Study Plan API
export interface BookChapter {
  number: number;
  title: string;
  audio_url?: string;
  audio?: string;
  mp3?: string;
  url?: string;
}

export interface BookDailyScheduleItem {
  text: string;
  chapters: BookChapter[];
  audio_url?: string;
  audio?: string;
  mp3?: string;
  url?: string;
}

export interface BookStudyResponse {
  book_title: string;
  book_author: string;
  source_url: string;
  generated_on: string;
  attribution_footer?: string;
  schedule: Record<string, BookDailyScheduleItem>; // Keyed by "YYYY-MM-DD"
}

// Reader & Navigation State
export type ActiveTab = 'sermon' | 'book' | 'journal';

export type ReaderTheme = 'light' | 'sepia' | 'dark';

export type ReaderFontSize = 'sm' | 'base' | 'lg' | 'xl';

export type BibleTranslation = 'NASB1995' | 'ESV' | 'NIV' | 'KJV' | 'CSB' | 'NLT';

export interface ReaderSettings {
  theme: ReaderTheme;
  fontSize: ReaderFontSize;
  fontFamily: 'serif' | 'sans';
  bibleTranslation: BibleTranslation;
}

// Journal Note
export interface ReflectionNote {
  id: string; // e.g., "sermon-2026-09-10" or "book-2026-09-10"
  type: 'sermon' | 'book';
  date: string; // YYYY-MM-DD
  title: string;
  subtitle?: string;
  content: string;
  updatedAt: string; // ISO string
}

