/**
 * Speech Synthesis (TTS) and Book Audio utilities.
 */

/**
 * Splits long text into small, natural sentence-based chunks suitable for
 * browser Web Speech API (which crashes or truncates on long text >200 chars).
 */
export function splitTextIntoChunks(text: string, maxChunkLength = 180): string[] {
  if (!text || !text.trim()) return [];

  // Split into raw paragraphs first
  const rawParagraphs = text.split(/\n+/).map((p) => p.trim()).filter(Boolean);
  const chunks: string[] = [];

  for (const para of rawParagraphs) {
    if (para.length <= maxChunkLength) {
      chunks.push(para);
      continue;
    }

    // Split paragraph by sentence boundary punctuation
    const sentences = para.match(/[^.!?]+[.!?]+|[^.!?]+$/g) || [para];
    let current = '';

    for (const s of sentences) {
      const trimmed = s.trim();
      if (!trimmed) continue;

      if ((current ? current + ' ' + trimmed : trimmed).length <= maxChunkLength) {
        current = current ? current + ' ' + trimmed : trimmed;
      } else {
        if (current) chunks.push(current);

        // If a single sentence exceeds maxChunkLength, split by punctuation clauses
        if (trimmed.length > maxChunkLength) {
          const subClauses = trimmed.match(/[^,;:]+[,;:]+|[^,;:]+$/g) || [trimmed];
          let subCurrent = '';
          for (const sub of subClauses) {
            const subTrimmed = sub.trim();
            if (!subTrimmed) continue;

            if ((subCurrent ? subCurrent + ' ' + subTrimmed : subTrimmed).length <= maxChunkLength) {
              subCurrent = subCurrent ? subCurrent + ' ' + subTrimmed : subTrimmed;
            } else {
              if (subCurrent) chunks.push(subCurrent);
              subCurrent = subTrimmed;
            }
          }
          if (subCurrent) current = subCurrent;
          else current = '';
        } else {
          current = trimmed;
        }
      }
    }

    if (current) {
      chunks.push(current);
    }
  }

  return chunks;
}

/**
 * Check if Web Speech API is supported in the current environment
 */
export function isSpeechSynthesisSupported(): boolean {
  return typeof window !== 'undefined' && 'speechSynthesis' in window && 'SpeechSynthesisUtterance' in window;
}

/**
 * Get preferred English voice from available synthesis voices
 */
export function getBestEnglishVoice(): SpeechSynthesisVoice | null {
  if (!isSpeechSynthesisSupported()) return null;

  const voices = window.speechSynthesis.getVoices();
  if (!voices || voices.length === 0) return null;

  // 1. Natural / Google / Apple enhanced English voices
  const premiumEnglish = voices.find(
    (v) =>
      v.lang.startsWith('en') &&
      (v.name.includes('Natural') || v.name.includes('Google') || v.name.includes('Premium') || v.name.includes('Samantha'))
  );
  if (premiumEnglish) return premiumEnglish;

  // 2. Any en-US voice
  const usEnglish = voices.find((v) => v.lang === 'en-US' || v.lang === 'en_US');
  if (usEnglish) return usEnglish;

  // 3. Any English voice
  const anyEnglish = voices.find((v) => v.lang.startsWith('en'));
  if (anyEnglish) return anyEnglish;

  return voices[0] || null;
}

/**
 * Resolve CFC India MP3 and study URL for Basic Christian Teachings chapter
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
