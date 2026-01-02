import {
  afterNextRender,
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  ElementRef,
  inject,
  Injector,
  input,
  output,
} from '@angular/core';
import type { SafeHtml } from '@angular/platform-browser';
import type {
  CodeViewerTheme,
  CollapsedRangeState,
  LineRange,
  ProcessedReference,
  ReferenceHoverEvent,
} from '../../types';
import { isLineInCollapsedRange } from '../../utils';

/**
 * CodeContent Atom Component
 *
 * Displays syntax-highlighted code content.
 * Accepts SafeHtml for pre-sanitized highlighted content.
 *
 * @example
 * ```html
 * <nx-code-content
 *   [content]="highlightedHtml()"
 *   [theme]="'dark'"
 *   [wordWrap]="false"
 * />
 * ```
 */
@Component({
  selector: 'nx-code-content',
  standalone: true,
  imports: [],
  templateUrl: './code-content.component.html',
  styleUrl: './code-content.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CodeContentComponent {
  private readonly elementRef = inject(ElementRef<HTMLElement>);
  private readonly injector = inject(Injector);

  constructor() {
    effect(() => {
      // Track all dependencies that should trigger re-highlighting
      const lineIndex = this.hoveredLine();
      const highlightedSet = this.highlightedLinesSet();
      const focusedSet = this.focusedLinesSet();
      const collapsedStates = this.collapsedRangesState();
      const currentTheme = this.theme();
      this.content(); // Track content changes to re-run effect

      // Schedule DOM update after Angular renders the new content
      afterNextRender(
        () => {
          this.updateLineStyles(
            lineIndex,
            highlightedSet,
            focusedSet,
            collapsedStates,
            currentTheme
          );
        },
        { injector: this.injector }
      );
    });
  }

  /**
   * Highlighted HTML content (must be sanitized)
   */
  readonly content = input.required<SafeHtml | null>();

  /**
   * Theme for styling
   */
  readonly theme = input<CodeViewerTheme>('dark');

  /**
   * Whether to wrap long lines
   */
  readonly wordWrap = input<boolean>(false);

  /**
   * Whether content is loading
   */
  readonly isLoading = input<boolean>(false);

  /**
   * Currently hovered line (1-based, 0 means no line hovered)
   */
  readonly hoveredLine = input<number>(0);

  /**
   * Set of pre-configured highlighted line numbers
   */
  readonly highlightedLinesSet = input<Set<number>>(new Set());

  /**
   * Set of focused line numbers (lines NOT in this set will be blurred)
   */
  readonly focusedLinesSet = input<Set<number>>(new Set());

  /**
   * Map of collapsed range states
   */
  readonly collapsedRangesState = input<Map<string, CollapsedRangeState>>(
    new Map()
  );

  /**
   * Map of processed reference IDs to their data
   */
  readonly processedReferences = input<Map<string, ProcessedReference>>(
    new Map()
  );

  /**
   * Emitted when a line is hovered
   */
  readonly lineHover = output<number>();

  /**
   * Emitted when a reference is clicked
   */
  readonly referenceClick = output<ProcessedReference>();

  /**
   * Emitted when a reference is hovered
   */
  readonly referenceHover = output<ReferenceHoverEvent>();

  /**
   * Emitted when a collapsed range indicator is clicked
   */
  readonly collapsedRangeToggle = output<LineRange>();

  /**
   * Computed CSS classes for the code container
   */
  protected readonly containerClasses = computed(() => {
    const currentTheme = this.theme();
    const shouldWrap = this.wordWrap();

    return `${currentTheme} ${shouldWrap ? 'wrap' : 'nowrap'}`;
  });

  /**
   * Handles mousemove over the code content to detect hovered line
   */
  protected onMouseMove(event: MouseEvent): void {
    const target = event.target as HTMLElement;
    const lineElement = target.closest('.line');

    if (lineElement) {
      const codeElement = this.elementRef.nativeElement.querySelector('code');
      if (codeElement) {
        const lines = Array.from(codeElement.querySelectorAll('.line'));
        const lineIndex = lines.indexOf(lineElement);
        if (lineIndex !== -1) {
          this.lineHover.emit(lineIndex + 1);
        }
      }
    }
  }

  /**
   * Handles click events on the code content
   * Detects clicks on reference elements
   */
  protected onClick(event: MouseEvent): void {
    const target = event.target as HTMLElement;
    const refElement = target.closest('.nx-ref');

    if (refElement) {
      const refId = refElement.getAttribute('data-ref-id');
      if (refId) {
        const reference = this.processedReferences().get(refId);
        if (reference) {
          // Only emit click event if it's a link type without href
          // (links with href will navigate naturally)
          if (
            reference.types.includes('link') &&
            !refElement.hasAttribute('href')
          ) {
            this.referenceClick.emit(reference);
          } else if (!reference.types.includes('link')) {
            // For info-only references, emit click event
            this.referenceClick.emit(reference);
          }
        }
      }
    }
  }

  /**
   * Handles mouseover events on reference elements
   */
  protected onMouseOver(event: MouseEvent): void {
    const target = event.target as HTMLElement;
    const refElement = target.closest('.nx-ref') as HTMLElement | null;

    if (refElement) {
      const refId = refElement.getAttribute('data-ref-id');
      if (refId) {
        const reference = this.processedReferences().get(refId);
        if (reference) {
          this.referenceHover.emit({
            reference,
            element: refElement,
            show: true,
          });
        }
      }
    }
  }

  /**
   * Handles mouseout events on reference elements
   */
  protected onMouseOut(event: MouseEvent): void {
    const target = event.target as HTMLElement;
    const relatedTarget = event.relatedTarget as HTMLElement | null;
    const refElement = target.closest('.nx-ref') as HTMLElement | null;

    if (refElement) {
      // Check if we're still within the same reference element
      if (relatedTarget && refElement.contains(relatedTarget)) {
        return;
      }

      const refId = refElement.getAttribute('data-ref-id');
      if (refId) {
        const reference = this.processedReferences().get(refId);
        if (reference) {
          this.referenceHover.emit({
            reference,
            element: refElement,
            show: false,
          });
        }
      }
    }
  }

  /**
   * Updates the highlighted, unfocused, and collapsed classes on line elements
   * @param hoveredLineIndex - Currently hovered line (1-based)
   * @param highlightedSet - Set of pre-configured highlighted lines
   * @param focusedSet - Set of focused lines (lines not in this set will be blurred)
   * @param collapsedStates - Map of collapsed range states
   * @param theme - Current theme for indicator styling
   */
  private updateLineStyles(
    hoveredLineIndex: number,
    highlightedSet: Set<number>,
    focusedSet: Set<number>,
    collapsedStates: Map<string, CollapsedRangeState>,
    theme: CodeViewerTheme
  ): void {
    const codeElement = this.elementRef.nativeElement.querySelector('code');
    if (!codeElement) return;

    const hasFocusedLines = focusedSet.size > 0;
    const hasCollapsedRanges = collapsedStates.size > 0;

    // Remove any existing collapse indicators
    codeElement
      .querySelectorAll('.nx-collapse-indicator')
      .forEach((el: Element) => el.remove());

    const lines = codeElement.querySelectorAll('.line:not(.nx-collapse-indicator)');

    lines.forEach((line: Element, index: number) => {
      const lineNumber = index + 1;

      // Handle collapsed state
      if (hasCollapsedRanges) {
        const collapseInfo = isLineInCollapsedRange(lineNumber, collapsedStates);

        if (collapseInfo.isCollapsed && !collapseInfo.isFirstLine) {
          // Hide lines within collapsed range (except first)
          line.classList.add('collapsed-hidden');
          return; // Skip other styling for hidden lines
        } else {
          line.classList.remove('collapsed-hidden');
        }

        if (collapseInfo.isFirstLine && collapseInfo.range) {
          // Insert collapse indicator after this line
          this.insertCollapseIndicator(
            line,
            collapseInfo.range,
            collapseInfo.hiddenCount,
            theme
          );
        }
      } else {
        line.classList.remove('collapsed-hidden');
      }

      // Handle highlighting
      const isHighlighted =
        lineNumber === hoveredLineIndex || highlightedSet.has(lineNumber);
      const isUnfocused = hasFocusedLines && !focusedSet.has(lineNumber);

      if (isHighlighted) {
        line.classList.add('highlighted');
      } else {
        line.classList.remove('highlighted');
      }

      if (isUnfocused) {
        line.classList.add('unfocused');
      } else {
        line.classList.remove('unfocused');
      }
    });
  }

  /**
   * Creates and inserts a collapse indicator element after a line
   */
  private insertCollapseIndicator(
    afterLine: Element,
    range: LineRange,
    hiddenCount: number,
    theme: CodeViewerTheme
  ): void {
    const indicator = document.createElement('div');
    indicator.className = `line nx-collapse-indicator ${theme}`;

    // Create expand icon
    const iconSpan = document.createElement('span');
    iconSpan.className = 'expand-icon';
    iconSpan.innerHTML = `
      <svg viewBox="0 0 16 16" width="12" height="12" fill="none"
           stroke="currentColor" stroke-width="1.5"
           stroke-linecap="round" stroke-linejoin="round">
        <path d="M6 4l4 4-4 4" />
      </svg>
    `;

    // Create text span
    const textSpan = document.createElement('span');
    textSpan.className = 'collapse-text';
    const linesText = hiddenCount === 1 ? 'line' : 'lines';
    textSpan.textContent = `... ${hiddenCount} ${linesText}`;

    indicator.appendChild(iconSpan);
    indicator.appendChild(textSpan);

    // Add click handler
    indicator.addEventListener('click', () => {
      this.collapsedRangeToggle.emit(range);
    });

    // Add keyboard handler for accessibility
    indicator.setAttribute('role', 'button');
    indicator.setAttribute('tabindex', '0');
    indicator.setAttribute(
      'aria-label',
      `Expand ${hiddenCount} hidden ${linesText}`
    );
    indicator.addEventListener('keydown', (event: KeyboardEvent) => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        this.collapsedRangeToggle.emit(range);
      }
    });

    afterLine.insertAdjacentElement('afterend', indicator);
  }
}
