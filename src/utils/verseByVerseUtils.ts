/**
 * Zac Poonen "Verse by Verse" Bible study mapping and helper utilities.
 */
import { VERSE_BY_VERSE_DATA, VerseByVerseTrack } from '../data/verseByVerseData';

export type { VerseByVerseTrack };

const BOOK_ALIASES: Record<string, string> = {
  '1cor': '1 Corinthians',
  '1corinthians': '1 Corinthians',
  '1 cor': '1 Corinthians',
  '2cor': '2 Corinthians',
  '2corinthians': '2 Corinthians',
  '2 cor': '2 Corinthians',
  '1thess': '1 Thessalonians',
  '1thessalonians': '1 Thessalonians',
  '1 thess': '1 Thessalonians',
  '2thess': '2 Thessalonians',
  '2thessalonians': '2 Thessalonians',
  '2 thess': '2 Thessalonians',
  '1tim': '1 Timothy',
  '1timothy': '1 Timothy',
  '1 tim': '1 Timothy',
  '2tim': '2 Timothy',
  '2timothy': '2 Timothy',
  '2 tim': '2 Timothy',
  '1pet': '1 Peter',
  '1peter': '1 Peter',
  '1 pet': '1 Peter',
  '2pet': '2 Peter',
  '2peter': '2 Peter',
  '2 pet': '2 Peter',
  '1jn': '1 John',
  '1john': '1 John',
  '1 jn': '1 John',
  '1 john': '1 John',
  '2jn': '2 John',
  '2john': '2 John',
  '2 jn': '2 John',
  '2 john': '2 John',
  '3jn': '3 John',
  '3john': '3 John',
  '3 jn': '3 John',
  '3 john': '3 John',
  'phil': 'Philippians',
  'philippians': 'Philippians',
  'col': 'Colossians',
  'colossians': 'Colossians',
  'rom': 'Romans',
  'romans': 'Romans',
  'heb': 'Hebrews',
  'hebrews': 'Hebrews',
  'jas': 'James',
  'james': 'James',
  'gal': 'Galatians',
  'galatians': 'Galatians',
  'eph': 'Ephesians',
  'ephesians': 'Ephesians',
  'rev': 'Revelation',
  'revelation': 'Revelation',
  'gen': 'Genesis',
  'genesis': 'Genesis',
  'matt': 'Matthew',
  'matthew': 'Matthew',
  'mt': 'Matthew',
  'mk': 'Mark',
  'mark': 'Mark',
  'lk': 'Luke',
  'luke': 'Luke',
  'jn': 'John',
  'john': 'John',
  'acts': 'Acts',
  'act': 'Acts',
  'titus': 'Titus',
  'tit': 'Titus',
  'phlm': 'Philemon',
  'philemon': 'Philemon',
  'jude': 'Jude',
};

export function normalizeBookName(bookName: string): string {
  const clean = bookName.trim();
  const key = clean.toLowerCase();
  if (BOOK_ALIASES[key]) return BOOK_ALIASES[key];

  const compact = key.replace(/[\s\-_]+/g, '');
  if (BOOK_ALIASES[compact]) return BOOK_ALIASES[compact];

  for (const k of Object.keys(VERSE_BY_VERSE_DATA)) {
    if (k.toLowerCase() === key) return k;
  }
  return clean;
}

/**
 * Extract book name, chapter, and verse from a memory verse or scripture citation string.
 * e.g., '"The Kingdom of God..." —Romans 14:17, NASB' -> { book: "Romans", chapter: 14, verse: 17 }
 */
export function extractBookAndChapter(text: string): { book: string; chapter: number; verse?: number } | null {
  if (!text) return null;

  // If there's an em-dash, en-dash, or hyphen attributing the reference at the end, isolate that portion
  const dashParts = text.split(/[—–-]/);
  const citationCandidate = dashParts.length > 1 ? dashParts[dashParts.length - 1] : text;

  // Matches citations like "Romans 14:17", "1 Corinthians 9:24", "Colossians 3:2"
  const regex = /(?:[123]\s+)?[A-Za-z]+\s+\d+(?::\d+)?/g;
  const matches = citationCandidate.match(regex) || text.match(regex);
  if (!matches || matches.length === 0) return null;

  const ref = matches[matches.length - 1].trim();
  const parts = ref.split(/\s+/);
  const chapterVerse = parts.pop() || '';
  const rawBook = parts.join(' ');
  const book = normalizeBookName(rawBook);

  if (chapterVerse.includes(':')) {
    const [ch, v] = chapterVerse.split(':').map(Number);
    return { book, chapter: ch, verse: isNaN(v) ? undefined : v };
  } else {
    const ch = parseInt(chapterVerse, 10);
    return { book, chapter: isNaN(ch) ? 1 : ch, verse: undefined };
  }
}

/**
 * Find the matching Zac Poonen Verse-by-Verse track for a given passage or memory verse.
 */
export function getZacPoonenVerseByVerseTrack(memoryVerseText: string): VerseByVerseTrack | null {
  const parsed = extractBookAndChapter(memoryVerseText);
  if (!parsed) return null;

  const tracks = VERSE_BY_VERSE_DATA[parsed.book];
  if (!tracks || tracks.length === 0) {
    return null;
  }

  const targetCh = parsed.chapter;
  const targetV = parsed.verse ?? 1;

  // 1. Precise range matching: check if (targetCh, targetV) falls in passageRange (sCh:sV - eCh:eV)
  for (const track of tracks) {
    const pr = track.passageRange;
    if (!pr || !pr.includes('-')) continue;

    const [startStr, endStr] = pr.split('-').map((s) => s.trim());
    if (!startStr.includes(':') || !endStr.includes(':')) continue;

    const [sCh, sV] = startStr.split(':').map(Number);
    const [eCh, eV] = endStr.split(':').map(Number);

    const afterStart = targetCh > sCh || (targetCh === sCh && targetV >= sV);
    const beforeEnd = targetCh < eCh || (targetCh === eCh && targetV <= eV);

    if (afterStart && beforeEnd) {
      return track;
    }
  }

  // 2. Fallback: match by chapter boundaries if verse fell slightly outside or wasn't specified
  for (const track of tracks) {
    const pr = track.passageRange;
    if (!pr || !pr.includes('-')) continue;

    const [startStr, endStr] = pr.split('-').map((s) => s.trim());
    const sCh = parseInt(startStr.split(':')[0], 10);
    const eCh = parseInt(endStr.split(':')[0], 10);

    if (!isNaN(sCh) && !isNaN(eCh) && sCh <= targetCh && targetCh <= eCh) {
      return track;
    }
  }

  // 3. If single track exists for the book, or fallback to first track
  return tracks[0] || null;
}

