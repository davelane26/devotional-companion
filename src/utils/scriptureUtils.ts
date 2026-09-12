/**
 * Helper utilities for formatting and linking scripture references.
 */

import { BibleTranslation } from '../types/devotional';

export interface TranslationOption {
  code: BibleTranslation;
  label: string;
  name: string;
  subtitle: string;
}

export const BIBLE_TRANSLATIONS: TranslationOption[] = [
  { code: 'NASB1995', label: 'NASB 95', name: 'New American Standard 1995', subtitle: 'Standard' },
  { code: 'ESV', label: 'ESV', name: 'English Standard Version', subtitle: 'English' },
  { code: 'NIV', label: 'NIV', name: 'New International Version', subtitle: 'International' },
  { code: 'NKJV', label: 'NKJV', name: 'New King James Version', subtitle: 'New King' },
  { code: 'KJV', label: 'KJV', name: 'King James Version', subtitle: 'King James' },
  { code: 'CSB', label: 'CSB', name: 'Christian Standard Bible', subtitle: 'Christian' },
  { code: 'NLT', label: 'NLT', name: 'New Living Translation', subtitle: 'Living' },
];

/**
 * Generate a BibleGateway URL for a scripture reference.
 */
export function getBibleGatewayUrl(passage: string, version: string = 'NASB1995'): string {
  const cleanRef = passage.trim();
  const encoded = encodeURIComponent(cleanRef);
  return `https://www.biblegateway.com/passage/?search=${encoded}&version=${version}`;
}

/**
 * Extract or clean scripture references from text
 */
export function cleanPassageName(passage: string): string {
  return passage.trim().replace(/^["']|["']$/g, '');
}
