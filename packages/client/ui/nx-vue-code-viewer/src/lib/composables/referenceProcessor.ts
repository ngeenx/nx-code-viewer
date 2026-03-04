import type {
  ReferenceConfig,
  ProcessedReference,
  ReferenceType,
  ReferenceLinkTarget,
} from '@ngeenx/nx-code-viewer-utils';

export interface ReferenceProcessingResult {
  readonly html: string;
  readonly processedReferences: Map<string, ProcessedReference>;
}

interface TextMatch {
  readonly start: number;
  readonly end: number;
  readonly text: string;
  readonly config: ReferenceConfig;
}

interface HtmlToken {
  readonly html: string;
  readonly text: string;
  readonly textStart: number;
  readonly textEnd: number;
}

const MAX_MATCHES_PER_LINE = 1000;

export function processReferences(
  html: string,
  references: readonly ReferenceConfig[]
): ReferenceProcessingResult {
  if (!html || references.length === 0) {
    return { html, processedReferences: new Map() };
  }

  const processedReferences = new Map<string, ProcessedReference>();
  const lines = extractLines(html);
  const processedLines: string[] = [];

  for (let lineIndex = 0; lineIndex < lines.length; lineIndex++) {
    const lineHtml = lines[lineIndex];
    const lineNumber = lineIndex + 1;
    const processedLine = processLine(lineHtml, references, lineNumber, processedReferences);
    processedLines.push(processedLine);
  }

  const resultHtml = processedLines
    .map(line => `<span class="line">${line}</span>`)
    .join('');

  return { html: resultHtml, processedReferences };
}

function extractLines(html: string): string[] {
  const lines: string[] = [];
  const lineStartMarker = '<span class="line">';
  const lineEndMarker = '</span>';
  let currentPos = 0;

  while (currentPos < html.length) {
    const lineStart = html.indexOf(lineStartMarker, currentPos);
    if (lineStart === -1) break;

    const contentStart = lineStart + lineStartMarker.length;
    let depth = 1;
    let searchPos = contentStart;
    let contentEnd = -1;

    while (searchPos < html.length && depth > 0) {
      const nextOpen = html.indexOf('<span', searchPos);
      const nextClose = html.indexOf('</span>', searchPos);
      if (nextClose === -1) break;

      if (nextOpen !== -1 && nextOpen < nextClose) {
        depth++;
        searchPos = nextOpen + 5;
      } else {
        depth--;
        if (depth === 0) contentEnd = nextClose;
        searchPos = nextClose + 7;
      }
    }

    if (contentEnd !== -1) {
      lines.push(html.slice(contentStart, contentEnd));
      currentPos = contentEnd + lineEndMarker.length;
    } else {
      break;
    }
  }

  if (lines.length === 0 && html.trim()) {
    lines.push(html);
  }

  return lines;
}

function processLine(
  lineHtml: string,
  references: readonly ReferenceConfig[],
  lineNumber: number,
  processedReferences: Map<string, ProcessedReference>
): string {
  const tokens = tokenizeLine(lineHtml);
  const plainText = tokens.map(t => t.text).join('');

  if (!plainText.trim()) return lineHtml;

  const matches = findMatches(plainText, references);
  if (matches.length === 0) return lineHtml;

  return injectReferences(tokens, matches, lineNumber, processedReferences);
}

function tokenizeLine(lineHtml: string): HtmlToken[] {
  const tokens: HtmlToken[] = [];
  let textPosition = 0;
  let pos = 0;

  while (pos < lineHtml.length) {
    if (lineHtml[pos] === '<') {
      const tagEnd = lineHtml.indexOf('>', pos);
      if (tagEnd === -1) break;

      const tag = lineHtml.slice(pos, tagEnd + 1);
      const isClosingTag = tag.startsWith('</');
      const isSelfClosing = tag.endsWith('/>');

      if (!isClosingTag && !isSelfClosing && tag.startsWith('<span')) {
        const contentStart = tagEnd + 1;
        const closingTag = '</span>';
        let depth = 1;
        let searchPos = contentStart;
        let contentEnd = -1;

        while (searchPos < lineHtml.length && depth > 0) {
          const nextOpen = lineHtml.indexOf('<span', searchPos);
          const nextClose = lineHtml.indexOf(closingTag, searchPos);
          if (nextClose === -1) break;

          if (nextOpen !== -1 && nextOpen < nextClose) {
            depth++;
            searchPos = nextOpen + 5;
          } else {
            depth--;
            if (depth === 0) contentEnd = nextClose;
            searchPos = nextClose + closingTag.length;
          }
        }

        if (contentEnd !== -1) {
          const innerContent = lineHtml.slice(contentStart, contentEnd);
          const fullHtml = lineHtml.slice(pos, contentEnd + closingTag.length);

          if (innerContent.includes('<span')) {
            const nestedTokens = tokenizeLine(innerContent);
            for (const nested of nestedTokens) {
              tokens.push({
                html: nested.html,
                text: nested.text,
                textStart: textPosition + nested.textStart,
                textEnd: textPosition + nested.textEnd,
              });
            }
            textPosition += nestedTokens.reduce((sum, t) => sum + t.text.length, 0);
          } else {
            const text = decodeHtmlEntities(innerContent);
            tokens.push({ html: fullHtml, text, textStart: textPosition, textEnd: textPosition + text.length });
            textPosition += text.length;
          }

          pos = contentEnd + closingTag.length;
          continue;
        }
      }

      pos = tagEnd + 1;
    } else {
      let textEnd = lineHtml.indexOf('<', pos);
      if (textEnd === -1) textEnd = lineHtml.length;

      if (textEnd > pos) {
        const rawText = lineHtml.slice(pos, textEnd);
        const text = decodeHtmlEntities(rawText);
        tokens.push({ html: rawText, text, textStart: textPosition, textEnd: textPosition + text.length });
        textPosition += text.length;
      }
      pos = textEnd;
    }
  }

  return tokens;
}

function decodeHtmlEntities(html: string): string {
  return html
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&nbsp;/g, ' ');
}

function encodeHtmlEntities(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function findMatches(plainText: string, references: readonly ReferenceConfig[]): TextMatch[] {
  const allMatches: TextMatch[] = [];

  for (const config of references) {
    const regex = new RegExp(config.textMatch.source, config.textMatch.flags);
    let match: RegExpExecArray | null;
    let matchCount = 0;

    while ((match = regex.exec(plainText)) !== null && matchCount++ < MAX_MATCHES_PER_LINE) {
      allMatches.push({ start: match.index, end: match.index + match[0].length, text: match[0], config });
      if (match[0].length === 0) regex.lastIndex++;
    }
  }

  allMatches.sort((a, b) => a.start - b.start);

  const nonOverlapping: TextMatch[] = [];
  let lastEnd = -1;

  for (const match of allMatches) {
    if (match.start >= lastEnd) {
      nonOverlapping.push(match);
      lastEnd = match.end;
    }
  }

  return nonOverlapping;
}

function injectReferences(
  tokens: HtmlToken[],
  matches: TextMatch[],
  lineNumber: number,
  processedReferences: Map<string, ProcessedReference>
): string {
  if (tokens.length === 0 || matches.length === 0) {
    return tokens.map(t => t.html).join('');
  }

  const matchToProcessed = new Map<number, ProcessedReference>();
  for (let i = 0; i < matches.length; i++) {
    const processed = createProcessedReference(matches[i], lineNumber, processedReferences);
    matchToProcessed.set(i, processed);
  }

  const result: string[] = [];
  let matchIndex = 0;
  let currentMatch = matches[matchIndex];

  for (const token of tokens) {
    if (!currentMatch || token.textEnd <= currentMatch.start) {
      result.push(token.html);
      continue;
    }

    if (token.textStart >= currentMatch.end) {
      while (currentMatch && token.textStart >= currentMatch.end) {
        matchIndex++;
        currentMatch = matches[matchIndex];
      }
      if (!currentMatch || token.textEnd <= currentMatch.start) {
        result.push(token.html);
        continue;
      }
    }

    result.push(processTokenWithMatches(token, matches, matchIndex, lineNumber, matchToProcessed));

    while (currentMatch && currentMatch.end <= token.textEnd) {
      matchIndex++;
      currentMatch = matches[matchIndex];
    }
  }

  return result.join('');
}

function processTokenWithMatches(
  token: HtmlToken,
  matches: TextMatch[],
  startMatchIndex: number,
  lineNumber: number,
  matchToProcessed: Map<number, ProcessedReference>
): string {
  const spanMatch = token.html.match(/^<span[^>]*>([\s\S]*)<\/span>$/);

  if (!spanMatch) {
    return wrapTextWithReferences(token.text, token.textStart, matches, startMatchIndex, matchToProcessed, encodeHtmlEntities);
  }

  const openTagMatch = token.html.match(/^(<span[^>]*>)/);
  const openTag = openTagMatch ? openTagMatch[1] : '<span>';
  const wrappedContent = wrapTextWithReferences(token.text, token.textStart, matches, startMatchIndex, matchToProcessed, encodeHtmlEntities);

  return `${openTag}${wrappedContent}</span>`;
}

function wrapTextWithReferences(
  text: string,
  textOffset: number,
  matches: TextMatch[],
  startMatchIndex: number,
  matchToProcessed: Map<number, ProcessedReference>,
  encodeText: (text: string) => string
): string {
  const result: string[] = [];
  let pos = 0;

  for (let i = startMatchIndex; i < matches.length; i++) {
    const match = matches[i];
    const relativeStart = match.start - textOffset;
    const relativeEnd = match.end - textOffset;

    if (relativeEnd <= 0) continue;
    if (relativeStart >= text.length) break;

    if (relativeStart > pos) {
      result.push(encodeText(text.slice(pos, Math.max(pos, relativeStart))));
    }

    const matchStart = Math.max(0, relativeStart);
    const matchEnd = Math.min(text.length, relativeEnd);
    const matchedText = text.slice(matchStart, matchEnd);

    const processed = matchToProcessed.get(i);
    if (processed && matchedText) {
      result.push(createReferenceElement(matchedText, processed));
    } else if (matchedText) {
      result.push(encodeText(matchedText));
    }

    pos = matchEnd;
  }

  if (pos < text.length) {
    result.push(encodeText(text.slice(pos)));
  }

  return result.join('');
}

function createProcessedReference(
  match: TextMatch,
  lineNumber: number,
  processedReferences: Map<string, ProcessedReference>
): ProcessedReference {
  const id = `ref-${crypto.randomUUID()}`;
  const config = match.config;

  const captureRegex = config.linkMatch ?? config.textMatch;
  const captureMatch = new RegExp(captureRegex.source, captureRegex.flags.replace('g', '')).exec(match.text);
  const captureGroups = captureMatch ? captureMatch.slice(1) : [];

  const types = normalizeTypes(config.type);
  let resolvedLink: string | undefined;

  if (types.includes('link') && config.link) {
    const resolved = resolveLink(config.link, captureGroups);
    resolvedLink = sanitizeUrl(resolved);
  }

  const processed: ProcessedReference = {
    id,
    matchedText: match.text,
    captureGroups,
    resolvedLink,
    target: config.target ?? '_blank',
    types,
    content: config.content,
    cssClass: config.cssClass,
    lineNumber,
    handle: config.handle,
  };

  processedReferences.set(id, processed);
  return processed;
}

function createReferenceElement(displayText: string, ref: ProcessedReference): string {
  const cssClasses = ['nx-ref'];
  if (ref.types.includes('link')) cssClasses.push('nx-ref-link');
  if (ref.types.includes('info')) cssClasses.push('nx-ref-info');
  if (ref.cssClass) cssClasses.push(ref.cssClass);

  const classAttr = cssClasses.join(' ');
  const dataAttrs = `data-ref-id="${ref.id}" data-ref-types="${ref.types.join(',')}"`;
  const encodedText = encodeHtmlEntities(displayText);

  if (ref.types.includes('link') && ref.resolvedLink) {
    const href = encodeHtmlEntities(ref.resolvedLink);
    const target = sanitizeTarget(ref.target);
    return `<a class="${classAttr}" href="${href}" target="${target}" rel="noopener noreferrer" ${dataAttrs}>${encodedText}</a>`;
  }

  return `<span class="${classAttr}" ${dataAttrs}>${encodedText}</span>`;
}

function sanitizeUrl(url: string): string {
  try {
    const parsed = new URL(url);
    if (!['https:', 'http:'].includes(parsed.protocol)) return '#blocked';
  } catch {
    return '#blocked';
  }
  return url;
}

function sanitizeTarget(target: ReferenceLinkTarget): ReferenceLinkTarget {
  const allowed: readonly ReferenceLinkTarget[] = ['_blank', '_self', '_parent', '_top'];
  return allowed.includes(target) ? target : '_blank';
}

function resolveLink(template: string, captureGroups: readonly string[]): string {
  let result = template;
  for (let i = 0; i < captureGroups.length; i++) {
    result = result.replace(new RegExp(`\\$${i + 1}`, 'g'), captureGroups[i]);
  }
  return result;
}

function normalizeTypes(type: ReferenceConfig['type']): readonly ReferenceType[] {
  if (Array.isArray(type)) return type as readonly ReferenceType[];
  return [type] as readonly ReferenceType[];
}
