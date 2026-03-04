import { describe, it, expect } from 'vitest';
import {
  escapeHtml,
  extractCodeContent,
  countLines,
  generateLineNumbers,
  formatLineNumber,
} from './html.utils';

describe('escapeHtml', () => {
  it('escapes ampersand', () => {
    expect(escapeHtml('a&b')).toBe('a&amp;b');
  });

  it('escapes less-than', () => {
    expect(escapeHtml('a<b')).toBe('a&lt;b');
  });

  it('escapes greater-than', () => {
    expect(escapeHtml('a>b')).toBe('a&gt;b');
  });

  it('escapes double quote', () => {
    expect(escapeHtml('say "hello"')).toBe('say &quot;hello&quot;');
  });

  it('escapes single quote', () => {
    expect(escapeHtml("it's fine")).toBe('it&#039;s fine');
  });

  it('escapes all special characters together', () => {
    expect(escapeHtml(`<script>alert('xss'&"test")</script>`)).toBe(
      '&lt;script&gt;alert(&#039;xss&#039;&amp;&quot;test&quot;)&lt;/script&gt;'
    );
  });

  it('returns empty string for empty input', () => {
    expect(escapeHtml('')).toBe('');
  });

  it('returns empty string for falsy input (null-like)', () => {
    expect(escapeHtml(undefined as unknown as string)).toBe('');
  });

  it('returns plain text unchanged when no special characters present', () => {
    expect(escapeHtml('hello world')).toBe('hello world');
  });

  it('handles string with only special characters', () => {
    expect(escapeHtml('<>&"\'')).toBe('&lt;&gt;&amp;&quot;&#039;');
  });
});

describe('extractCodeContent', () => {
  it('extracts inner content from Shiki pre/code wrapper', () => {
    const html =
      '<pre class="shiki"><code><span class="line">const x = 1;</span></code></pre>';
    expect(extractCodeContent(html)).toBe('<span class="line">const x = 1;</span>');
  });

  it('returns original HTML when no pre/code wrapper found', () => {
    const html = '<span class="line">plain content</span>';
    expect(extractCodeContent(html)).toBe(html);
  });

  it('returns empty string for empty input', () => {
    expect(extractCodeContent('')).toBe('');
  });

  it('returns empty string for falsy input', () => {
    expect(extractCodeContent(undefined as unknown as string)).toBe('');
  });

  it('handles pre/code wrapper with additional attributes', () => {
    const inner = '<span class="line">let a = 1;</span>';
    const html = `<pre class="shiki github-dark" style="color:#fff"><code class="language-ts">${inner}</code></pre>`;
    expect(extractCodeContent(html)).toBe(inner);
  });

  it('handles multiline code content inside wrapper', () => {
    const inner =
      '<span class="line">line1</span><span class="line">line2</span>';
    const html = `<pre><code>${inner}</code></pre>`;
    expect(extractCodeContent(html)).toBe(inner);
  });
});

describe('countLines', () => {
  it('counts a single line with no newlines', () => {
    expect(countLines('hello')).toBe(1);
  });

  it('counts multiple lines separated by newlines', () => {
    expect(countLines('line1\nline2\nline3')).toBe(3);
  });

  it('returns 0 for empty string', () => {
    expect(countLines('')).toBe(0);
  });

  it('returns 0 for falsy input', () => {
    expect(countLines(undefined as unknown as string)).toBe(0);
  });

  it('counts trailing newline as an extra line', () => {
    expect(countLines('line1\nline2\n')).toBe(3);
  });

  it('counts a single newline as two lines', () => {
    expect(countLines('\n')).toBe(2);
  });
});

describe('generateLineNumbers', () => {
  it('generates array from 1 to lineCount', () => {
    expect(generateLineNumbers(5)).toEqual([1, 2, 3, 4, 5]);
  });

  it('returns empty array for zero', () => {
    expect(generateLineNumbers(0)).toEqual([]);
  });

  it('returns empty array for negative value', () => {
    expect(generateLineNumbers(-3)).toEqual([]);
  });

  it('returns [1] for lineCount of 1', () => {
    expect(generateLineNumbers(1)).toEqual([1]);
  });

  it('generates correct array for large lineCount', () => {
    const result = generateLineNumbers(100);
    expect(result).toHaveLength(100);
    expect(result[0]).toBe(1);
    expect(result[99]).toBe(100);
  });

  it('returns readonly array', () => {
    const result = generateLineNumbers(3);
    expect(Array.isArray(result)).toBe(true);
  });
});

describe('formatLineNumber', () => {
  it('pads single-digit number to match max width', () => {
    expect(formatLineNumber(1, 100)).toBe('  1');
  });

  it('pads two-digit number to match max width', () => {
    expect(formatLineNumber(10, 100)).toBe(' 10');
  });

  it('does not pad when lineNumber equals maxLineNumber', () => {
    expect(formatLineNumber(100, 100)).toBe('100');
  });

  it('returns single character when max is single digit', () => {
    expect(formatLineNumber(5, 9)).toBe('5');
  });

  it('pads lineNumber 1 to width of maxLineNumber', () => {
    expect(formatLineNumber(1, 9999)).toBe('   1');
  });

  it('handles equal single-digit lineNumber and maxLineNumber', () => {
    expect(formatLineNumber(5, 5)).toBe('5');
  });

  it('pads with spaces not zeros', () => {
    const result = formatLineNumber(1, 10);
    expect(result).toBe(' 1');
    expect(result.startsWith('0')).toBe(false);
  });
});
