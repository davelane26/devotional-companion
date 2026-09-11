/**
 * Helper utilities for formatting and linking scripture references.
 */

/**
 * Generate a BibleGateway URL for a scripture reference.
 * Defaults to NASB (New American Standard Bible) which matches the sermon memory verse translation.
 */
export function getBibleGatewayUrl(passage: string, version: string = 'NASB'): string {
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

