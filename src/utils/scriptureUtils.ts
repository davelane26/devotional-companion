/**
 * Helper utilities for formatting and linking scripture references.
 */

export interface TranslationOption {
  code: 'NASB1995' | 'ESV' | 'NIV' | 'KJV' | 'CSB' | 'NLT';
  label: string;
  name: string;
}

export const BIBLE_TRANSLATIONS: TranslationOption[] = [
  { code: 'NASB1995', label: 'NASB 95', name: 'New American Standard 1995' },
  { code: 'ESV', label: 'ESV', name: 'English Standard Version' },
  { code: 'NIV', label: 'NIV', name: 'New International Version' },
  { code: 'KJV', label: 'KJV', name: 'King James Version' },
  { code: 'CSB', label: 'CSB', name: 'Christian Standard Bible' },
  { code: 'NLT', label: 'NLT', name: 'New Living Translation' },
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
