/**
 * HTML character escape mapping
 */
const HTML_ESCAPE_MAP: Readonly<Record<string, string>> = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&#039;',
} as const;

/**
 * Regex pattern for HTML special characters
 */
const HTML_ESCAPE_PATTERN = /[&<>"']/g;

/**
 * Regex pattern to extract inner content from Shiki pre/code wrapper
 */
const SHIKI_WRAPPER_PATTERN = /<pre[^>]*><code[^>]*>([\s\S]*?)<\/code><\/pre>/;

/**
 * Escapes HTML special characters to prevent XSS
 * @param text - Raw text to escape
 * @returns HTML-safe escaped string
 */
export function escapeHtml(text: string): string {
  if (!text) {
    return '';
  }

  return text.replace(
    HTML_ESCAPE_PATTERN,
    char => HTML_ESCAPE_MAP[char] ?? char
  );
}

/**
 * Extracts the inner HTML content from Shiki's pre/code wrapper
 * @param html - Full HTML output from Shiki
 * @returns Inner code content without wrapper, or original if no match
 */
export function extractCodeContent(html: string): string {
  if (!html) {
    return '';
  }

  const match = html.match(SHIKI_WRAPPER_PATTERN);
  return match?.[1] ?? html;
}

/**
 * Counts the number of lines in a code string
 * @param code - Source code string
 * @returns Number of lines
 */
export function countLines(code: string): number {
  if (!code) {
    return 0;
  }

  return code.split('\n').length;
}

/**
 * Generates an array of line numbers for display
 * @param lineCount - Total number of lines
 * @returns Array of line numbers starting from 1
 */
export function generateLineNumbers(lineCount: number): readonly number[] {
  if (lineCount <= 0) {
    return [];
  }

  return Array.from({ length: lineCount }, (_, index) => index + 1);
}

/**
 * Creates a formatted line number string with consistent width
 * @param lineNumber - Current line number
 * @param maxLineNumber - Maximum line number (for padding calculation)
 * @returns Padded line number string
 */
export function formatLineNumber(
  lineNumber: number,
  maxLineNumber: number
): string {
  const maxWidth = String(maxLineNumber).length;
  return String(lineNumber).padStart(maxWidth, ' ');
}
