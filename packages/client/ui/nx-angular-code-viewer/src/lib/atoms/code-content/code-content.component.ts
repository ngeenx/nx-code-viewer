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
  signal,
} from '@angular/core';
import type { SafeHtml } from '@angular/platform-browser';
import type {
  ActiveInsertWidget,
  CodeViewerTheme,
  CollapsedRangeState,
  LineRange,
  LineWidgetClickEvent,
  LineWidgetConfig,
  LineWidgetContext,
  LineWidgetsInput,
  ProcessedReference,
  ReferenceHoverEvent,
} from '../../types';
import { isLineInCollapsedRange, getMatchingWidgets } from '../../utils';
import { LineWidgetHostComponent } from '../line-widget-host';
import { InsertWidgetContainerComponent } from '../insert-widget-container';

/**
 * Widget rendering data for a specific line
 */
interface LineWidgetRenderData {
  readonly lineNumber: number;
  readonly lineText: string;
  readonly lineElement: Element;
  readonly widgets: LineWidgetConfig[];
  readonly context: LineWidgetContext;
  readonly top: number;
  readonly height: number;
}

/**
 * CodeContent Atom Component
 *
 * Displays syntax-highlighted code content with support for line widgets.
 * Accepts SafeHtml for pre-sanitized highlighted content.
 *
 * @example
 * ```html
 * <nx-code-content
 *   [content]="highlightedHtml()"
 *   [theme]="'dark'"
 *   [wordWrap]="false"
 *   [lineWidgets]="widgets"
 * />
 * ```
 */
@Component({
  selector: 'nx-code-content',
  standalone: true,
  imports: [LineWidgetHostComponent, InsertWidgetContainerComponent],
  templateUrl: './code-content.component.html',
  styleUrl: './code-content.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CodeContentComponent {
  private readonly elementRef = inject(ElementRef<HTMLElement>);
  private readonly injector = inject(Injector);

  constructor() {
    // Effect for line styles (existing)
    effect(() => {
      const lineIndex = this.hoveredLine();
      const highlightedSet = this.highlightedLinesSet();
      const focusedSet = this.focusedLinesSet();
      const collapsedStates = this.collapsedRangesState();
      const currentTheme = this.theme();
      this.content();

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

    // Effect for hover widgets
    effect(() => {
      const lineNumber = this.hoveredLine();
      const widgets = this.lineWidgets();
      const rawCode = this.rawCode();
      const theme = this.theme();
      this.content(); // Track content changes

      afterNextRender(
        () => {
          this.updateHoverWidgets(lineNumber, widgets, rawCode, theme);
        },
        { injector: this.injector }
      );
    });

    // Effect for always-visible widgets
    effect(() => {
      const widgets = this.lineWidgets();
      const rawCode = this.rawCode();
      const theme = this.theme();
      this.content();

      afterNextRender(
        () => {
          this.updateAlwaysWidgets(widgets, rawCode, theme);
        },
        { injector: this.injector }
      );
    });

    // Effect for insert widget positioning
    effect(() => {
      const insertWidget = this.activeInsertWidget();
      const theme = this.theme();
      this.content();

      if (!insertWidget) {
        this.insertWidgetData.set(null);
        return;
      }

      afterNextRender(
        () => {
          this.updateInsertWidgetPosition(insertWidget, theme);
        },
        { injector: this.injector }
      );
    });
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // INPUTS
  // ═══════════════════════════════════════════════════════════════════════════

  /**
   * Highlighted HTML content (must be sanitized)
   */
  readonly content = input.required<SafeHtml | null>();

  /**
   * Raw code string for extracting line text
   */
  readonly rawCode = input<string>('');

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
   * Line widget configurations
   */
  readonly lineWidgets = input<LineWidgetsInput>([]);

  /**
   * Currently active insert widget
   */
  readonly activeInsertWidget = input<ActiveInsertWidget | null>(null);

  // ═══════════════════════════════════════════════════════════════════════════
  // OUTPUTS
  // ═══════════════════════════════════════════════════════════════════════════

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
   * Emitted when a line widget is clicked
   */
  readonly lineWidgetClick = output<LineWidgetClickEvent>();

  /**
   * Emitted when an insert widget requests to be closed
   */
  readonly insertWidgetClose = output<void>();

  // ═══════════════════════════════════════════════════════════════════════════
  // STATE
  // ═══════════════════════════════════════════════════════════════════════════

  /**
   * Data for rendering hover widgets
   */
  protected readonly hoverWidgetData = signal<LineWidgetRenderData | null>(null);

  /**
   * Data for rendering always-visible widgets
   */
  protected readonly alwaysWidgetData = signal<LineWidgetRenderData[]>([]);

  /**
   * Data for rendering insert widget
   */
  protected readonly insertWidgetData = signal<{
    context: LineWidgetContext;
    top: number;
  } | null>(null);

  // ═══════════════════════════════════════════════════════════════════════════
  // COMPUTED
  // ═══════════════════════════════════════════════════════════════════════════

  /**
   * Computed CSS classes for the code container
   */
  protected readonly containerClasses = computed(() => {
    const currentTheme = this.theme();
    const shouldWrap = this.wordWrap();
    return `${currentTheme} ${shouldWrap ? 'wrap' : 'nowrap'}`;
  });

  /**
   * Left hover widgets for current line
   */
  protected readonly leftHoverWidgets = computed(() => {
    const data = this.hoverWidgetData();
    if (!data) return [];
    return data.widgets.filter(w => w.position === 'left' && w.display === 'hover');
  });

  /**
   * Right hover widgets for current line
   */
  protected readonly rightHoverWidgets = computed(() => {
    const data = this.hoverWidgetData();
    if (!data) return [];
    return data.widgets.filter(w => w.position === 'right' && w.display === 'hover');
  });

  // ═══════════════════════════════════════════════════════════════════════════
  // EVENT HANDLERS
  // ═══════════════════════════════════════════════════════════════════════════

  /**
   * Handles mousemove over the code content to detect hovered line
   */
  protected onMouseMove(event: MouseEvent): void {
    const target = event.target as HTMLElement;
    const lineElement = target.closest('.line');

    if (lineElement) {
      const codeElement = this.elementRef.nativeElement.querySelector('code');
      if (codeElement) {
        const lines = Array.from(
          codeElement.querySelectorAll('.line:not(.nx-collapse-indicator)')
        );
        const lineIndex = lines.indexOf(lineElement);
        if (lineIndex !== -1) {
          this.lineHover.emit(lineIndex + 1);
        }
      }
    }
  }

  /**
   * Handles click events on the code content
   */
  protected onClick(event: MouseEvent): void {
    const target = event.target as HTMLElement;
    const refElement = target.closest('.nx-ref');

    if (refElement) {
      const refId = refElement.getAttribute('data-ref-id');
      if (refId) {
        const reference = this.processedReferences().get(refId);
        if (reference) {
          if (
            reference.types.includes('link') &&
            !refElement.hasAttribute('href')
          ) {
            this.referenceClick.emit(reference);
          } else if (!reference.types.includes('link')) {
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
   * Handles widget click
   */
  protected onWidgetClick(widget: LineWidgetConfig, data: LineWidgetRenderData): void {
    this.lineWidgetClick.emit({
      lineNumber: data.lineNumber,
      line: data.lineText,
      widget,
    });
  }

  /**
   * Handles insert widget close
   */
  protected onInsertWidgetClose(): void {
    this.insertWidgetClose.emit();
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // PRIVATE METHODS
  // ═══════════════════════════════════════════════════════════════════════════

  /**
   * Updates hover widget data for the hovered line
   */
  private updateHoverWidgets(
    lineNumber: number,
    widgets: LineWidgetsInput | undefined,
    rawCode: string,
    theme: CodeViewerTheme
  ): void {
    if (!lineNumber || !widgets || widgets.length === 0) {
      this.hoverWidgetData.set(null);
      return;
    }

    const wrapperElement = this.elementRef.nativeElement.querySelector('.code-content-wrapper');
    const codeElement = this.elementRef.nativeElement.querySelector('code');
    if (!wrapperElement || !codeElement) {
      this.hoverWidgetData.set(null);
      return;
    }

    const lines: Element[] = Array.from(
      codeElement.querySelectorAll('.line:not(.nx-collapse-indicator)')
    );
    const lineElement: Element | undefined = lines[lineNumber - 1];
    if (!lineElement) {
      this.hoverWidgetData.set(null);
      return;
    }

    const codeLines = rawCode.split('\n');
    const lineText = codeLines[lineNumber - 1] || '';

    const matchingWidgets = getMatchingWidgets(widgets, lineText, lineNumber);
    const hoverWidgets = matchingWidgets.filter(w => w.display === 'hover');

    if (hoverWidgets.length === 0) {
      this.hoverWidgetData.set(null);
      return;
    }

    const rect = lineElement.getBoundingClientRect();
    const wrapperRect = wrapperElement.getBoundingClientRect();

    this.hoverWidgetData.set({
      lineNumber,
      lineText,
      lineElement,
      widgets: hoverWidgets,
      context: { line: lineText, lineNumber, theme },
      top: rect.top - wrapperRect.top,
      height: rect.height,
    });
  }

  /**
   * Updates always-visible widgets data
   */
  private updateAlwaysWidgets(
    widgets: LineWidgetsInput | undefined,
    rawCode: string,
    theme: CodeViewerTheme
  ): void {
    if (!widgets || widgets.length === 0) {
      this.alwaysWidgetData.set([]);
      return;
    }

    const alwaysWidgets = widgets.filter(w => w.display === 'always');
    if (alwaysWidgets.length === 0) {
      this.alwaysWidgetData.set([]);
      return;
    }

    const wrapperElement = this.elementRef.nativeElement.querySelector('.code-content-wrapper');
    const codeElement = this.elementRef.nativeElement.querySelector('code');
    if (!wrapperElement || !codeElement) {
      this.alwaysWidgetData.set([]);
      return;
    }

    const lines: Element[] = Array.from(
      codeElement.querySelectorAll('.line:not(.nx-collapse-indicator)')
    );
    const codeLines = rawCode.split('\n');
    const wrapperRect = wrapperElement.getBoundingClientRect();

    const renderData: LineWidgetRenderData[] = [];

    lines.forEach((lineElement: Element, index: number) => {
      const lineNumber = index + 1;
      const lineText = codeLines[index] || '';

      const matchingWidgets = getMatchingWidgets(alwaysWidgets, lineText, lineNumber);
      if (matchingWidgets.length === 0) return;

      const rect = lineElement.getBoundingClientRect();

      renderData.push({
        lineNumber,
        lineText,
        lineElement,
        widgets: matchingWidgets,
        context: { line: lineText, lineNumber, theme },
        top: rect.top - wrapperRect.top,
        height: rect.height,
      });
    });

    this.alwaysWidgetData.set(renderData);
  }

  /**
   * Updates insert widget position data
   */
  private updateInsertWidgetPosition(
    insertWidget: ActiveInsertWidget,
    theme: CodeViewerTheme
  ): void {
    const wrapperElement = this.elementRef.nativeElement.querySelector('.code-content-wrapper');
    const codeElement = this.elementRef.nativeElement.querySelector('code');
    if (!wrapperElement || !codeElement) {
      this.insertWidgetData.set(null);
      return;
    }

    const lines: Element[] = Array.from(
      codeElement.querySelectorAll('.line:not(.nx-collapse-indicator)')
    );
    const lineElement = lines[insertWidget.lineNumber - 1];
    if (!lineElement) {
      this.insertWidgetData.set(null);
      return;
    }

    const rect = lineElement.getBoundingClientRect();
    const wrapperRect = wrapperElement.getBoundingClientRect();

    // Position the insert widget right below the line
    const top = rect.bottom - wrapperRect.top;

    this.insertWidgetData.set({
      context: {
        line: insertWidget.line,
        lineNumber: insertWidget.lineNumber,
        theme,
      },
      top,
    });
  }

  /**
   * Updates the highlighted, unfocused, and collapsed classes on line elements
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

    const lines = codeElement.querySelectorAll(
      '.line:not(.nx-collapse-indicator)'
    );

    lines.forEach((line: Element, index: number) => {
      const lineNumber = index + 1;

      // Make line relative for widget positioning
      (line as HTMLElement).style.position = 'relative';

      // Handle collapsed state
      if (hasCollapsedRanges) {
        const collapseInfo = isLineInCollapsedRange(lineNumber, collapsedStates);

        if (collapseInfo.isCollapsed && !collapseInfo.isFirstLine) {
          line.classList.add('collapsed-hidden');
          return;
        } else {
          line.classList.remove('collapsed-hidden');
        }

        if (collapseInfo.isFirstLine && collapseInfo.range) {
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

    const iconSpan = document.createElement('span');
    iconSpan.className = 'expand-icon';
    iconSpan.innerHTML = `
      <svg viewBox="0 0 16 16" width="12" height="12" fill="none"
           stroke="currentColor" stroke-width="1.5"
           stroke-linecap="round" stroke-linejoin="round">
        <path d="M6 4l4 4-4 4" />
      </svg>
    `;

    const textSpan = document.createElement('span');
    textSpan.className = 'collapse-text';
    const linesText = hiddenCount === 1 ? 'line' : 'lines';
    textSpan.textContent = `... ${hiddenCount} ${linesText}`;

    indicator.appendChild(iconSpan);
    indicator.appendChild(textSpan);

    indicator.addEventListener('click', () => {
      this.collapsedRangeToggle.emit(range);
    });

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
