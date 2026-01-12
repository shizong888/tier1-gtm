/**
 * Utility functions for converting between filenames, slugs, and titles
 */

/**
 * Convert filename to slug
 * Example: "01-executive-summary.md" → "executive-summary"
 */
export function filenameToSlug(filename: string): string {
  return filename
    .replace(/^\d+-/, '') // Remove number prefix
    .replace(/\.md$/, ''); // Remove .md extension
}

/**
 * Convert slug to title
 * Example: "executive-summary" → "Executive Summary"
 */
export function slugToTitle(slug: string): string {
  return slug
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

/**
 * Extract order number from filename
 * Example: "01-executive-summary.md" → 1
 */
export function extractOrder(filename: string): number {
  const match = filename.match(/^(\d+)-/);
  return match ? parseInt(match[1], 10) : 999;
}

/**
 * Check if a filename is a markdown file
 */
export function isMarkdownFile(filename: string): boolean {
  return filename.endsWith('.md');
}
