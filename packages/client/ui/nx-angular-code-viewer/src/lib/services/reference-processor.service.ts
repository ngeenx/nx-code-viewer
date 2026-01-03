import { Injectable } from '@angular/core';
import type {
  ReferenceConfig,
  ProcessedReference,
  ReferenceType,
  ReferenceLinkTarget,
} from '../types';

/**
 * Result from processing references in HTML content
 */
export interface ReferenceProcessingResult {
  /** Modified HTML with reference elements injected */
  readonly html: string;
  /** Map of reference ID to processed reference data */
  readonly processedReferences: Map<string, ProcessedReference>;
}

/**
 * Internal match representation during processing
 */
interface TextMatch {
  readonly start: number;
  readonly end: number;
  readonly text: string;
  readonly config: ReferenceConfig;
}

/**
 * Token extracted from a line of HTML
 */
interface HtmlToken {
  /** HTML for this token (may include span wrappers) */
  readonly html: string;
  /** Plain text content of this token */
  readonly text: string;
  /** Start position in the line's plain text */
  readonly textStart: number;
  /** End position in the line's plain text */
  readonly textEnd: number;
}

/**
 * Service for processing reference configurations against highlighted HTML content
 *
 * This service handles the complex task of matching regex patterns against code
 * while preserving Shiki's HTML structure for syntax highlighting.
 *
 * @example
 * ```typescript
 * const result = referenceProcessor.processReferences(highlightedHtml, [
 *   {
 *     textMatch: /@angular\/\w+/g,
 *     linkMatch: /@angular\/(\w+)/g,
 *     type: 'link',
 *     link: 'https://angular.io/api/$1'
 *   }
 * ]);
 * ```
 */
@Injectable({
  providedIn: 'root',
})
export class ReferenceProcessorService {
  /**
   * Counter for generating unique reference IDs
   */
  private referenceIdCounter = 0;

  /**
   * Process HTML content with reference configurations
   *
   * @param html - Shiki-highlighted HTML (inner content without pre/code wrapper)
   * @param references - Array of reference configurations
   * @returns Object containing modified HTML and processed reference metadata
   */
  processReferences(
    html: string,
    references: readonly ReferenceConfig[]
  ): ReferenceProcessingResult {
    if (!html || references.length === 0) {
      return { html, processedReferences: new Map() };
    }

    const processedReferences = new Map<string, ProcessedReference>();
    const lines = this.extractLines(html);
    const processedLines: string[] = [];

    for (let lineIndex = 0; lineIndex < lines.length; lineIndex++) {
      const lineHtml = lines[lineIndex];
      const lineNumber = lineIndex + 1;
      const processedLine = this.processLine(
        lineHtml,
        references,
        lineNumber,
        processedReferences
      );
      processedLines.push(processedLine);
    }

    // Reconstruct HTML with processed lines
    const resultHtml = processedLines
      .map(line => `<span class="line">${line}</span>`)
      .join('');

    return { html: resultHtml, processedReferences };
  }

  /**
   * Extracts individual line content from the HTML
   * Assumes HTML structure: <span class="line">content</span>...
   */
  private extractLines(html: string): string[] {
    const lines: string[] = [];
    const lineStartMarker = '<span class="line">';
    const lineEndMarker = '</span>';

    let currentPos = 0;
    while (currentPos < html.length) {
      const lineStart = html.indexOf(lineStartMarker, currentPos);
      if (lineStart === -1) break;

      const contentStart = lineStart + lineStartMarker.length;

      // Find the matching closing </span> by counting nested spans
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
          if (depth === 0) {
            contentEnd = nextClose;
          }
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

    // If no lines found, treat entire content as single line
    if (lines.length === 0 && html.trim()) {
      lines.push(html);
    }

    return lines;
  }

  /**
   * Process a single line of HTML content
   */
  private processLine(
    lineHtml: string,
    references: readonly ReferenceConfig[],
    lineNumber: number,
    processedReferences: Map<string, ProcessedReference>
  ): string {
    // Extract plain text and token positions from the line
    const tokens = this.tokenizeLine(lineHtml);
    const plainText = tokens.map(t => t.text).join('');

    if (!plainText.trim()) {
      return lineHtml; // Empty line, no processing needed
    }

    // Find all matches across all reference configurations
    const matches = this.findMatches(plainText, references);

    if (matches.length === 0) {
      return lineHtml; // No matches, return original
    }

    // Process matches and inject reference elements
    return this.injectReferences(
      tokens,
      matches,
      lineNumber,
      processedReferences
    );
  }

  /**
   * Tokenizes a line of HTML into individual tokens with text positions
   */
  private tokenizeLine(lineHtml: string): HtmlToken[] {
    const tokens: HtmlToken[] = [];
    let textPosition = 0;

    // Use a simple state machine to parse HTML
    let pos = 0;
    while (pos < lineHtml.length) {
      if (lineHtml[pos] === '<') {
        // Find end of tag
        const tagEnd = lineHtml.indexOf('>', pos);
        if (tagEnd === -1) break;

        const tag = lineHtml.slice(pos, tagEnd + 1);
        const isClosingTag = tag.startsWith('</');
        const isSelfClosing = tag.endsWith('/>');

        if (!isClosingTag && !isSelfClosing && tag.startsWith('<span')) {
          // Opening span tag - find content and closing tag
          const contentStart = tagEnd + 1;
          const closingTag = '</span>';

          // Find matching closing span (handle nested spans)
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
              if (depth === 0) {
                contentEnd = nextClose;
              }
              searchPos = nextClose + closingTag.length;
            }
          }

          if (contentEnd !== -1) {
            const innerContent = lineHtml.slice(contentStart, contentEnd);
            const fullHtml = lineHtml.slice(
              pos,
              contentEnd + closingTag.length
            );

            // Recursively tokenize if there are nested spans
            if (innerContent.includes('<span')) {
              const nestedTokens = this.tokenizeLine(innerContent);
              for (const nested of nestedTokens) {
                tokens.push({
                  html: nested.html,
                  text: nested.text,
                  textStart: textPosition + nested.textStart,
                  textEnd: textPosition + nested.textEnd,
                });
              }
              textPosition += nestedTokens.reduce(
                (sum, t) => sum + t.text.length,
                0
              );
            } else {
              // Leaf span with text content
              const text = this.decodeHtmlEntities(innerContent);
              tokens.push({
                html: fullHtml,
                text,
                textStart: textPosition,
                textEnd: textPosition + text.length,
              });
              textPosition += text.length;
            }

            pos = contentEnd + closingTag.length;
            continue;
          }
        }

        pos = tagEnd + 1;
      } else {
        // Text node outside of spans
        let textEnd = lineHtml.indexOf('<', pos);
        if (textEnd === -1) textEnd = lineHtml.length;

        if (textEnd > pos) {
          const rawText = lineHtml.slice(pos, textEnd);
          const text = this.decodeHtmlEntities(rawText);
          tokens.push({
            html: rawText,
            text,
            textStart: textPosition,
            textEnd: textPosition + text.length,
          });
          textPosition += text.length;
        }
        pos = textEnd;
      }
    }

    return tokens;
  }

  /**
   * Decodes HTML entities in a string
   */
  private decodeHtmlEntities(html: string): string {
    return html
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&amp;/g, '&')
      .replace(/&quot;/g, '"')
      .replace(/&#39;/g, "'")
      .replace(/&nbsp;/g, ' ');
  }

  /**
   * Encodes special characters to HTML entities
   */
  private encodeHtmlEntities(text: string): string {
    return text
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  /**
   * Find all pattern matches in the plain text
   * Uses "first match wins" for overlapping matches
   */
  private findMatches(
    plainText: string,
    references: readonly ReferenceConfig[]
  ): TextMatch[] {
    const allMatches: TextMatch[] = [];

    for (const config of references) {
      // Clone regex to reset lastIndex
      const regex = new RegExp(config.textMatch.source, config.textMatch.flags);

      let match: RegExpExecArray | null;
      while ((match = regex.exec(plainText)) !== null) {
        allMatches.push({
          start: match.index,
          end: match.index + match[0].length,
          text: match[0],
          config,
        });

        // Prevent infinite loop for zero-length matches
        if (match[0].length === 0) {
          regex.lastIndex++;
        }
      }
    }

    // Sort by start position
    allMatches.sort((a, b) => a.start - b.start);

    // Filter overlapping matches (first match wins)
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

  /**
   * Inject reference elements into the tokenized HTML
   */
  private injectReferences(
    tokens: HtmlToken[],
    matches: TextMatch[],
    lineNumber: number,
    processedReferences: Map<string, ProcessedReference>
  ): string {
    if (tokens.length === 0 || matches.length === 0) {
      return tokens.map(t => t.html).join('');
    }

    // Pre-create ProcessedReferences for all matches so we can reuse them
    // when a match spans multiple tokens
    const matchToProcessed = new Map<number, ProcessedReference>();
    for (let i = 0; i < matches.length; i++) {
      const processed = this.createProcessedReference(
        matches[i],
        lineNumber,
        processedReferences
      );
      matchToProcessed.set(i, processed);
    }

    const result: string[] = [];
    let matchIndex = 0;
    let currentMatch = matches[matchIndex];

    for (const token of tokens) {
      // Check if this token is affected by any match
      if (!currentMatch || token.textEnd <= currentMatch.start) {
        // Token is before the next match
        result.push(token.html);
        continue;
      }

      if (token.textStart >= currentMatch.end) {
        // Token is after current match, advance to next match
        while (currentMatch && token.textStart >= currentMatch.end) {
          matchIndex++;
          currentMatch = matches[matchIndex];
        }
        if (!currentMatch || token.textEnd <= currentMatch.start) {
          result.push(token.html);
          continue;
        }
      }

      // Token overlaps with one or more matches
      result.push(
        this.processTokenWithMatches(
          token,
          matches,
          matchIndex,
          lineNumber,
          matchToProcessed
        )
      );

      // Advance match index past this token
      while (currentMatch && currentMatch.end <= token.textEnd) {
        matchIndex++;
        currentMatch = matches[matchIndex];
      }
    }

    return result.join('');
  }

  /**
   * Process a single token that overlaps with matches
   */
  private processTokenWithMatches(
    token: HtmlToken,
    matches: TextMatch[],
    startMatchIndex: number,
    lineNumber: number,
    matchToProcessed: Map<number, ProcessedReference>
  ): string {
    // If this is a span token, we need to handle it specially
    const spanMatch = token.html.match(/^<span[^>]*>([\s\S]*)<\/span>$/);

    if (!spanMatch) {
      // Plain text token - process directly
      return this.wrapTextWithReferences(
        token.text,
        token.textStart,
        matches,
        startMatchIndex,
        matchToProcessed,
        text => this.encodeHtmlEntities(text)
      );
    }

    // Extract span opening tag and process inner content
    const openTagMatch = token.html.match(/^(<span[^>]*>)/);
    const openTag = openTagMatch ? openTagMatch[1] : '<span>';

    const wrappedContent = this.wrapTextWithReferences(
      token.text,
      token.textStart,
      matches,
      startMatchIndex,
      matchToProcessed,
      text => this.encodeHtmlEntities(text)
    );

    return `${openTag}${wrappedContent}</span>`;
  }

  /**
   * Wrap text segments with reference elements where matches occur
   */
  private wrapTextWithReferences(
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

      // Skip if match is before this text segment
      if (relativeEnd <= 0) continue;
      // Stop if match is after this text segment
      if (relativeStart >= text.length) break;

      // Add text before match (only if match starts within or after this segment)
      if (relativeStart > pos) {
        result.push(encodeText(text.slice(pos, Math.max(pos, relativeStart))));
      }

      // Calculate actual match bounds within this text
      const matchStart = Math.max(0, relativeStart);
      const matchEnd = Math.min(text.length, relativeEnd);
      const matchedText = text.slice(matchStart, matchEnd);

      // Get the pre-created ProcessedReference for this match
      const processed = matchToProcessed.get(i);
      if (processed && matchedText) {
        // Wrap this portion of the match (works for both start and continuation)
        result.push(this.createReferenceElement(matchedText, processed));
      } else if (matchedText) {
        // Fallback: just encode the text
        result.push(encodeText(matchedText));
      }

      pos = matchEnd;
    }

    // Add remaining text
    if (pos < text.length) {
      result.push(encodeText(text.slice(pos)));
    }

    return result.join('');
  }

  /**
   * Create a ProcessedReference from a match
   */
  private createProcessedReference(
    match: TextMatch,
    lineNumber: number,
    processedReferences: Map<string, ProcessedReference>
  ): ProcessedReference {
    const id = this.generateReferenceId();
    const config = match.config;

    // Extract capture groups using linkMatch or textMatch
    const captureRegex = config.linkMatch ?? config.textMatch;
    const captureMatch = new RegExp(
      captureRegex.source,
      captureRegex.flags.replace('g', '')
    ).exec(match.text);
    const captureGroups = captureMatch ? captureMatch.slice(1) : [];

    // Resolve link if type includes 'link'
    const types = this.normalizeTypes(config.type);
    let resolvedLink: string | undefined;
    if (types.includes('link') && config.link) {
      resolvedLink = this.resolveLink(config.link, captureGroups);
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

  /**
   * Create the HTML element for a reference
   */
  private createReferenceElement(
    displayText: string,
    ref: ProcessedReference
  ): string {
    const cssClasses = ['nx-ref'];

    if (ref.types.includes('link')) {
      cssClasses.push('nx-ref-link');
    }
    if (ref.types.includes('info')) {
      cssClasses.push('nx-ref-info');
    }
    if (ref.cssClass) {
      cssClasses.push(ref.cssClass);
    }

    const classAttr = cssClasses.join(' ');
    const dataAttrs = `data-ref-id="${ref.id}" data-ref-types="${ref.types.join(',')}"`;
    const encodedText = this.encodeHtmlEntities(displayText);

    if (ref.types.includes('link') && ref.resolvedLink) {
      const href = this.encodeHtmlEntities(ref.resolvedLink);
      const target = ref.target;
      return `<a class="${classAttr}" href="${href}" target="${target}" ${dataAttrs}>${encodedText}</a>`;
    }

    return `<span class="${classAttr}" ${dataAttrs}>${encodedText}</span>`;
  }

  /**
   * Generate a unique reference ID
   */
  private generateReferenceId(): string {
    return `ref-${++this.referenceIdCounter}`;
  }

  /**
   * Resolve link template with capture groups
   * Replaces $1, $2, etc. with capture group values
   */
  private resolveLink(template: string, captureGroups: string[]): string {
    let result = template;
    for (let i = 0; i < captureGroups.length; i++) {
      result = result.replace(new RegExp(`\\$${i + 1}`, 'g'), captureGroups[i]);
    }
    return result;
  }

  /**
   * Normalize reference type to array format
   */
  private normalizeTypes(
    type: ReferenceConfig['type']
  ): readonly ReferenceType[] {
    if (Array.isArray(type)) {
      return type as readonly ReferenceType[];
    }
    return [type] as readonly ReferenceType[];
  }
}
