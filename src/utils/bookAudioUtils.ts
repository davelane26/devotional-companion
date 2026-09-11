import {
  BOOK_AUDIO_SCHEDULE_MAP,
  DayAudioSchedule,
  ChapterAudioTrack,
} from '../data/bookAudioScheduleMap';

export type { DayAudioSchedule, ChapterAudioTrack };

/**
 * Returns the precomputed audio schedule metadata for a given date.
 */
export function getDayAudioSchedule(dateStr: string): DayAudioSchedule | null {
  return BOOK_AUDIO_SCHEDULE_MAP[dateStr] || null;
}

/**
 * Resolves which paragraph is currently being spoken based on the track's precomputed timestamps.
 */
export function getActiveParagraphForTrack(
  currentTime: number,
  track: ChapterAudioTrack
): number {
  if (!track || !track.paragraphStartTimes || track.paragraphStartTimes.length === 0) {
    return -1;
  }

  const { paragraphIndices, paragraphStartTimes } = track;
  
  if (currentTime < paragraphStartTimes[0]) {
    return paragraphIndices[0];
  }

  for (let i = paragraphStartTimes.length - 1; i >= 0; i--) {
    if (currentTime >= paragraphStartTimes[i]) {
      return paragraphIndices[i];
    }
  }

  return paragraphIndices[0];
}

/**
 * Given a paragraph index tapped by the user, returns the matching track index and seek time.
 */
export function getParagraphAudioSeek(
  paragraphIndex: number,
  daySchedule: DayAudioSchedule | null
): { trackIndex: number; seekTime: number; chapterTitle: string } | null {
  if (!daySchedule || !daySchedule.tracks || daySchedule.tracks.length === 0) {
    return null;
  }

  for (let tIdx = 0; tIdx < daySchedule.tracks.length; tIdx++) {
    const track = daySchedule.tracks[tIdx];
    const pos = track.paragraphIndices.indexOf(paragraphIndex);
    if (pos !== -1) {
      const seekTime = track.paragraphStartTimes[pos] ?? track.startOffsetSec;
      return {
        trackIndex: tIdx,
        seekTime,
        chapterTitle: track.chapterTitle,
      };
    }
  }

  return null;
}

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
