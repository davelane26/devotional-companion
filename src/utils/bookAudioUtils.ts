/**
 * Audio and Follow-Along utilities for Zac Poonen's Book Study teachings.
 */

/**
 * Resolves the official CFC India MP3 and study URL for a given Basic Christian Teachings chapter.
 */
export function getBasicChristianTeachingsAudio(
  chapterNumber?: number,
  chapterTitle?: string
): { audioUrl: string; studyUrl: string } | null {
  if (!chapterNumber || !chapterTitle) return null;

  const padNum = String(chapterNumber).padStart(2, '0');
  const slug = chapterTitle
    .toLowerCase()
    .replace(/['’]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');

  return {
    audioUrl: `https://www.cfcindia.org/resources/en/study-series/basic-christian-teachings/${padNum}-${slug}.mp3`,
    studyUrl: `https://cfcindia.com/basic-christian-teachings/${padNum}-${slug}`,
  };
}

/**
 * Calculates proportional character weights for an array of paragraphs.
 */
export function calculateParagraphWeights(paragraphs: string[]): number[] {
  if (!paragraphs || paragraphs.length === 0) return [];
  const totalChars = paragraphs.reduce((sum, p) => sum + p.length, 0);
  if (totalChars === 0) return paragraphs.map(() => 1 / paragraphs.length);
  return paragraphs.map((p) => p.length / totalChars);
}

/**
 * Calculates which paragraph corresponds to the current audio time.
 */
export function getActiveParagraphIndex(
  currentTime: number,
  duration: number,
  weights: number[]
): number {
  if (!duration || duration <= 0 || weights.length === 0) return -1;
  const progress = Math.max(0, Math.min(1, currentTime / duration));
  let cum = 0;
  for (let i = 0; i < weights.length; i++) {
    cum += weights[i];
    if (progress <= cum) {
      return i;
    }
  }
  return weights.length - 1;
}

/**
 * Calculates target seek time in seconds when tapping a paragraph.
 */
export function getParagraphStartTime(
  index: number,
  duration: number,
  weights: number[]
): number {
  if (!duration || duration <= 0 || index <= 0) return 0;
  let cum = 0;
  for (let j = 0; j < index; j++) {
    cum += weights[j];
  }
  return cum * duration;
}

/**
 * Format seconds into mm:ss
 */
export function formatTime(seconds: number): string {
  if (isNaN(seconds) || seconds < 0) return '0:00';
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}
