/**
 * Zac Poonen "Verse by Verse" Bible study mapping and helper utilities.
 */

export interface VerseByVerseTrack {
  book: string;
  passageRange: string;
  title: string;
  audioUrl: string;
  studyUrl: string;
}

// Known mappings for Verse-by-Verse audio tracks
const VERSE_BY_VERSE_MAP: Record<string, VerseByVerseTrack[]> = {
  Colossians: [
    {
      book: 'Colossians',
      passageRange: '1:1 - 1:25',
      title: 'Colossians Chapter 1:1 to 1:25',
      audioUrl: 'https://www.cfcindia.org/resources/en/study-series/verse-by-verse/nt12-colossians-chapter-1-1-to-chapter-1-25.mp3',
      studyUrl: 'https://www.cfcindia.com/verse-by-verse/01colossians-chapter-11-to-chapter-125',
    },
    {
      book: 'Colossians',
      passageRange: '1:25 - 2:18',
      title: 'Colossians Chapter 1:25 to 2:18',
      audioUrl: 'https://www.cfcindia.org/resources/en/study-series/verse-by-verse/nt12-colossians-chapter-1-25-to-chapter-2-18.mp3',
      studyUrl: 'https://www.cfcindia.com/verse-by-verse/02colossians-chapter-125-to-chapter-218',
    },
    {
      book: 'Colossians',
      passageRange: '2:18 - 3:13',
      title: 'Colossians Chapter 2:18 to 3:13',
      audioUrl: 'https://www.cfcindia.org/resources/en/study-series/verse-by-verse/nt12-colossians-chapter-2-18-to-chapter-3-13.mp3',
      studyUrl: 'https://www.cfcindia.com/verse-by-verse/03colossians-chapter-218-to-chapter-313',
    },
    {
      book: 'Colossians',
      passageRange: '3:14 - 4:18',
      title: 'Colossians Chapter 3:14 to 4:18',
      audioUrl: 'https://www.cfcindia.org/resources/en/study-series/verse-by-verse/nt12-colossians-chapter-3-14-to-chapter-4-18.mp3',
      studyUrl: 'https://www.cfcindia.com/verse-by-verse/04colossians-chapter-314-to-chapter-418',
    },
  ],
  Romans: [
    {
      book: 'Romans',
      passageRange: '8:1 - 8:39',
      title: 'Romans Chapter 8:1 to 8:39',
      audioUrl: 'https://www.cfcindia.org/resources/en/study-series/verse-by-verse/nt06-romans-chapter-7-14-to-chapter-8-17.mp3',
      studyUrl: 'https://www.cfcindia.com/verse-by-verse/Romans',
    },
  ],
  James: [
    {
      book: 'James',
      passageRange: '1:1 - 1:27',
      title: 'James Chapter 1:1 to 1:25',
      audioUrl: 'https://www.cfcindia.org/resources/en/study-series/verse-by-verse/nt20-james-chapter-1-1-to-chapter-1-25.mp3',
      studyUrl: 'https://www.cfcindia.com/verse-by-verse/James',
    },
  ],
};

/**
 * Extract book name from a memory verse or scripture citation string.
 * e.g., "Colossians 3:2" -> "Colossians"
 */
export function extractBookAndChapter(text: string): { book: string; chapter: number; verse?: number } | null {
  // Matches e.g. "Colossians 3:2" or "1 Corinthians 9:24" or "Romans 8:11"
  const regex = /(?:[123]\s+)?[A-Za-z]+\s+\d+(?::\d+)?/g;
  const matches = text.match(regex);
  if (!matches || matches.length === 0) return null;

  const ref = matches[0].trim();
  const parts = ref.split(/\s+/);
  const chapterVerse = parts.pop() || '';
  const book = parts.join(' ');

  const [ch, v] = chapterVerse.split(':').map(Number);
  return { book, chapter: ch, verse: v };
}

/**
 * Find the matching Zac Poonen Verse-by-Verse track for a given passage/memory verse.
 */
export function getZacPoonenVerseByVerseTrack(memoryVerseText: string): VerseByVerseTrack | null {
  const parsed = extractBookAndChapter(memoryVerseText);
  if (!parsed) return null;

  const tracks = VERSE_BY_VERSE_MAP[parsed.book];
  if (!tracks || tracks.length === 0) {
    // Return generic study URL for the book
    return {
      book: parsed.book,
      passageRange: `${parsed.book} ${parsed.chapter}`,
      title: `${parsed.book} Verse-by-Verse Study`,
      audioUrl: '',
      studyUrl: `https://www.cfcindia.com/verse-by-verse/${parsed.book.replace(/\s+/g, '-')}`,
    };
  }

  // Specifically match Colossians 3:2 to track 3 (2:18 - 3:13)
  if (parsed.book === 'Colossians') {
    if (parsed.chapter === 1) return tracks[0];
    if (parsed.chapter === 2 && (parsed.verse || 0) < 18) return tracks[1];
    if (parsed.chapter === 2 || (parsed.chapter === 3 && (parsed.verse || 0) <= 13)) return tracks[2];
    return tracks[3];
  }

  return tracks[0];
}
