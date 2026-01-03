import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  inject,
  input,
  OnDestroy,
  output,
  signal,
  untracked,
} from '@angular/core';
import { DomSanitizer, type SafeHtml } from '@angular/platform-browser';
import type {
  CodeViewerBorderStyle,
  CodeViewerLanguage,
  CodeViewerTheme,
  CollapsedLinesInput,
  CollapsedRangeState,
  CollapsedRangeToggleEvent,
  FocusedLinesInput,
  HighlightedCodeState,
  HighlightedLinesInput,
  LineRange,
  LineWidgetClickEvent,
  LineWidgetsInput,
  ProcessedReference,
  ReferenceConfig,
  ReferenceHoverEvent,
} from '../../types';
import { DEFAULT_CODE_VIEWER_CONFIG } from '../../types';
import {
  countLines,
  parseHighlightedLines,
  parseCollapsedRanges,
  createCollapsedRangesState,
  rangeToKey,
} from '../../utils';
import {
  ClipboardService,
  CodeHighlighterService,
  ReferenceProcessorService,
} from '../../services';
import { CodeHeaderComponent } from '../../atoms/code-header';
import { ReferencePopoverComponent } from '../../atoms/reference-popover';
import { CodeBlockComponent } from '../../molecules/code-block';

/**
 * Unique ID generator for component instances
 */
let instanceCounter = 0;

/**
 * CodeViewer Organism Component
 *
 * Main component that provides syntax-highlighted code display with
 * line numbers, copy functionality, and theme support.
 *
 * Follows SOLID principles:
 * - Single Responsibility: Orchestrates sub-components
 * - Open/Closed: Extended through configuration, not modification
 * - Liskov Substitution: Uses typed interfaces
 * - Interface Segregation: Minimal required inputs
 * - Dependency Inversion: Depends on abstractions (services)
 *
 * @example
 * ```html
 * <nx-code-viewer
 *   [code]="sourceCode"
 *   [language]="'typescript'"
 *   [theme]="'dark'"
 *   [showLineNumbers]="true"
 *   [showCopyButton]="true"
 *   [title]="'Example'"
 *   (codeCopied)="onCodeCopied()"
 * />
 * ```
 */
@Component({
  selector: 'nx-code-viewer',
  standalone: true,
  imports: [CodeHeaderComponent, CodeBlockComponent, ReferencePopoverComponent],
  templateUrl: './code-viewer.component.html',
  styleUrl: './code-viewer.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CodeViewerComponent implements OnDestroy {
  /**
   * Unique instance identifier for clipboard state management
   */
  private readonly instanceId = `code-viewer-${++instanceCounter}`;

  /**
   * Abort controller for canceling pending highlight operations
   */
  private highlightAbortController: AbortController | null = null;

  /**
   * Injected services
   */
  private readonly clipboardService = inject(ClipboardService);
  private readonly highlighterService = inject(CodeHighlighterService);
  private readonly referenceProcessorService = inject(ReferenceProcessorService);
  private readonly sanitizer = inject(DomSanitizer);

  // ═══════════════════════════════════════════════════════════════════════════
  // INPUTS
  // ═══════════════════════════════════════════════════════════════════════════

  /**
   * Source code to display (required)
   * Can be a string or an array of strings (each element becomes a line)
   */
  readonly code = input.required<string | string[]>();

  /**
   * Programming language for syntax highlighting
   */
  readonly language = input<CodeViewerLanguage>(
    DEFAULT_CODE_VIEWER_CONFIG.language
  );

  /**
   * Color theme
   */
  readonly theme = input<CodeViewerTheme>(DEFAULT_CODE_VIEWER_CONFIG.theme);

  /**
   * Optional title displayed in header
   */
  readonly title = input<string>(DEFAULT_CODE_VIEWER_CONFIG.title);

  /**
   * Show line numbers
   */
  readonly showLineNumbers = input<boolean>(
    DEFAULT_CODE_VIEWER_CONFIG.showLineNumbers
  );

  /**
   * Show copy button
   */
  readonly showCopyButton = input<boolean>(
    DEFAULT_CODE_VIEWER_CONFIG.showCopyButton
  );

  /**
   * Show header section
   */
  readonly showHeader = input<boolean>(DEFAULT_CODE_VIEWER_CONFIG.showHeader);

  /**
   * Maximum height with scrolling
   */
  readonly maxHeight = input<string>(DEFAULT_CODE_VIEWER_CONFIG.maxHeight);

  /**
   * Enable word wrapping
   */
  readonly wordWrap = input<boolean>(DEFAULT_CODE_VIEWER_CONFIG.wordWrap);

  /**
   * File extension for displaying file type icon (e.g., '.ts', '.js', 'example.py')
   */
  readonly fileExtension = input<string>('');

  /**
   * Pre-configured lines to highlight
   * Accepts:
   * - Single number: 5
   * - Array of numbers: [1, 3, 5]
   * - Range (tuple): [1, 5] highlights lines 1-5
   * - Array of ranges: [[1, 5], [10, 15]]
   * - Mixed: [1, [3, 5], 8, [10, 12]]
   */
  readonly highlightedLines = input<HighlightedLinesInput>();

  /**
   * Lines to focus on (all other lines will be blurred)
   * Accepts same format as highlightedLines:
   * - Single number: 5
   * - Array of numbers: [1, 3, 5]
   * - Range (tuple): [1, 5] focuses lines 1-5
   * - Array of ranges: [[1, 5], [10, 15]]
   * - Mixed: [1, [3, 5], 8, [10, 12]]
   */
  readonly focusedLines = input<FocusedLinesInput>();

  /**
   * Line ranges to collapse
   * Accepts array of ranges: [[10, 20], [30, 40]] collapses lines 10-20 and 30-40
   * Users can click to expand/collapse ranges
   */
  readonly collapsedLines = input<CollapsedLinesInput>();

  /**
   * Border style variant
   * - 'classic': Standard rounded border (default)
   * - 'grid-cross': Grid borders with corner cross marks
   * - 'corner-intersection': Long grid borders extending beyond corners
   * - 'none': No border styling
   */
  readonly borderStyle = input<CodeViewerBorderStyle>('classic');

  /**
   * Reference configurations for creating interactive links/info elements in code
   *
   * @example
   * ```typescript
   * references = [
   *   {
   *     textMatch: /@angular\/\w+/g,
   *     linkMatch: /@angular\/(\w+)/g,
   *     type: 'link',
   *     link: 'https://angular.io/api/$1',
   *     target: '_blank'
   *   }
   * ];
   * ```
   */
  readonly references = input<readonly ReferenceConfig[]>([]);

  /**
   * Line widget configurations for adding custom widgets to lines
   *
   * @example
   * ```typescript
   * lineWidgets = [
   *   {
   *     position: 'left',
   *     display: 'hover',
   *     lineComponent: BookmarkButtonComponent,
   *   },
   *   {
   *     match: /TODO:/,
   *     position: 'right',
   *     display: 'always',
   *     lineComponent: TodoIndicatorComponent,
   *   }
   * ];
   * ```
   */
  readonly lineWidgets = input<LineWidgetsInput>([]);

  // ═══════════════════════════════════════════════════════════════════════════
  // OUTPUTS
  // ═══════════════════════════════════════════════════════════════════════════

  /**
   * Emitted when code is copied to clipboard
   */
  readonly codeCopied = output<void>();

  /**
   * Emitted when a reference link is clicked
   */
  readonly referenceClick = output<ProcessedReference>();

  /**
   * Emitted when a reference is hovered
   */
  readonly referenceHover = output<ReferenceHoverEvent>();

  /**
   * Emitted when a collapsed range is expanded or collapsed
   */
  readonly collapsedRangeToggle = output<CollapsedRangeToggleEvent>();

  /**
   * Emitted when a line widget is clicked
   */
  readonly lineWidgetClick = output<LineWidgetClickEvent>();

  // ═══════════════════════════════════════════════════════════════════════════
  // STATE
  // ═══════════════════════════════════════════════════════════════════════════

  /**
   * Current highlighted code state
   */
  private readonly highlightState = signal<HighlightedCodeState>(
    this.highlighterService.createInitialState()
  );

  /**
   * Copy button state from clipboard service
   */
  protected readonly copyState = this.clipboardService.getCopyState(
    this.instanceId
  );

  /**
   * Cached result of reference processing
   */
  private readonly processedReferenceResult = computed(() => {
    const rawContent = this.rawHighlightedContent();
    const refs = this.references();

    if (!rawContent || refs.length === 0) {
      return null;
    }

    const htmlString = this.extractHtmlString(rawContent);
    if (!htmlString) {
      return null;
    }

    return this.referenceProcessorService.processReferences(htmlString, refs);
  });

  /**
   * Map of processed reference IDs to their data
   */
  protected readonly processedReferencesMap = computed(() => {
    const result = this.processedReferenceResult();
    return result?.processedReferences ?? new Map<string, ProcessedReference>();
  });

  /**
   * Popover state for info-type references
   */
  protected readonly activePopover = signal<{
    reference: ProcessedReference;
    anchorElement: HTMLElement;
  } | null>(null);

  /**
   * Timeout handle for hover delay
   */
  private hoverTimeout: ReturnType<typeof setTimeout> | null = null;

  /**
   * State for collapsed ranges (tracks which ranges are expanded)
   */
  protected readonly collapsedRangesState = signal<
    Map<string, CollapsedRangeState>
  >(new Map());

  // ═══════════════════════════════════════════════════════════════════════════
  // COMPUTED SIGNALS
  // ═══════════════════════════════════════════════════════════════════════════

  /**
   * Normalized code string (handles both string and string[] inputs)
   */
  protected readonly normalizedCode = computed(() => {
    const codeValue = this.code();
    return Array.isArray(codeValue) ? codeValue.join('\n') : codeValue;
  });

  /**
   * Number of lines in the code
   */
  protected readonly lineCount = computed(() =>
    countLines(this.normalizedCode())
  );

  /**
   * Raw highlighted HTML content (before reference processing)
   */
  private readonly rawHighlightedContent = computed<SafeHtml | null>(() => {
    const state = this.highlightState();

    if (state.html) {
      return state.html;
    }

    // Return fallback escaped HTML while loading or on error
    const codeValue = this.normalizedCode();
    if (codeValue) {
      return this.highlighterService.createFallbackHtml(codeValue);
    }

    return null;
  });

  /**
   * Highlighted HTML content with references processed
   */
  protected readonly highlightedContent = computed<SafeHtml | null>(() => {
    const rawContent = this.rawHighlightedContent();
    const result = this.processedReferenceResult();

    if (!rawContent) {
      return null;
    }

    // If we have processed references, return the processed HTML
    if (result) {
      return this.sanitizer.bypassSecurityTrustHtml(result.html);
    }

    // Otherwise return raw content
    return rawContent;
  });

  /**
   * Whether highlighting is in progress
   */
  protected readonly isLoading = computed(
    () => this.highlightState().isLoading
  );

  /**
   * Parsed set of highlighted line numbers for O(1) lookup
   */
  protected readonly highlightedLinesSet = computed(() =>
    parseHighlightedLines(this.highlightedLines())
  );

  /**
   * Parsed set of focused line numbers for O(1) lookup
   */
  protected readonly focusedLinesSet = computed(() =>
    parseHighlightedLines(this.focusedLines())
  );

  // ═══════════════════════════════════════════════════════════════════════════
  // EFFECTS
  // ═══════════════════════════════════════════════════════════════════════════

  constructor() {
    // Effect to highlight code when inputs change
    effect(() => {
      const codeValue = this.normalizedCode();
      const languageValue = this.language();
      const themeValue = this.theme();

      // Run highlighting outside of effect tracking
      untracked(() => {
        this.highlightCode(codeValue, languageValue, themeValue);
      });
    });

    // Effect to initialize collapsed ranges state when input changes
    effect(() => {
      const collapsedInput = this.collapsedLines();

      untracked(() => {
        const parsedRanges = parseCollapsedRanges(collapsedInput);
        this.collapsedRangesState.set(createCollapsedRangesState(parsedRanges));
      });
    });
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // LIFECYCLE
  // ═══════════════════════════════════════════════════════════════════════════

  ngOnDestroy(): void {
    this.abortPendingHighlight();
    this.clearHoverTimeout();
    this.clipboardService.cleanup(this.instanceId);
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // METHODS
  // ═══════════════════════════════════════════════════════════════════════════

  /**
   * Copies code to clipboard
   */
  protected async copyCode(): Promise<void> {
    const result = await this.clipboardService.copy(
      this.normalizedCode(),
      this.instanceId
    );

    if (result.success) {
      this.codeCopied.emit();
    }
  }

  /**
   * Handler function for copy button click
   */
  protected readonly handleCopyClick = (): void => {
    void this.copyCode();
  };

  /**
   * Highlights code using the highlighter service
   */
  private async highlightCode(
    code: string,
    language: CodeViewerLanguage,
    theme: CodeViewerTheme
  ): Promise<void> {
    // Abort any pending highlight operation
    this.abortPendingHighlight();

    if (!code) {
      this.highlightState.set(this.highlighterService.createInitialState());
      return;
    }

    // Create new abort controller
    this.highlightAbortController = new AbortController();
    const { signal } = this.highlightAbortController;

    // Set loading state
    this.highlightState.set(this.highlighterService.createLoadingState());

    // Perform highlighting
    const result = await this.highlighterService.highlightToSafeHtml({
      code,
      language,
      theme,
      signal,
    });

    // Only update if not aborted
    if (!signal.aborted) {
      this.highlightState.set(result);
    }
  }

  /**
   * Aborts any pending highlight operation
   */
  private abortPendingHighlight(): void {
    if (this.highlightAbortController) {
      this.highlightAbortController.abort();
      this.highlightAbortController = null;
    }
  }

  /**
   * Extracts HTML string from SafeHtml
   * Note: This is a workaround since SafeHtml is opaque
   */
  private extractHtmlString(safeHtml: SafeHtml): string | null {
    // SafeHtml objects have a changingThisBreaksApplicationSecurity property
    // that contains the raw HTML string
    const htmlObj = safeHtml as {
      changingThisBreaksApplicationSecurity?: string;
    };
    return htmlObj.changingThisBreaksApplicationSecurity ?? null;
  }

  /**
   * Handler for reference click events from code content
   */
  protected onReferenceClick(reference: ProcessedReference): void {
    this.referenceClick.emit(reference);
  }

  /**
   * Handler for reference hover events from code content
   * Implements delay to prevent popover flicker
   */
  protected onReferenceHover(event: ReferenceHoverEvent): void {
    // Clear any pending timeout
    if (this.hoverTimeout) {
      clearTimeout(this.hoverTimeout);
      this.hoverTimeout = null;
    }

    // Emit the hover event
    this.referenceHover.emit(event);

    // Only handle info-type references for popover
    if (!event.reference.types.includes('info')) {
      return;
    }

    if (event.show) {
      // Show popover after a small delay
      this.hoverTimeout = setTimeout(() => {
        this.activePopover.set({
          reference: event.reference,
          anchorElement: event.element,
        });
      }, 200);
    } else {
      // Hide popover after a small delay to allow moving to popover
      this.hoverTimeout = setTimeout(() => {
        this.activePopover.set(null);
      }, 100);
    }
  }

  /**
   * Handler for popover mouse enter - keeps popover visible
   */
  protected onPopoverMouseEnter(): void {
    if (this.hoverTimeout) {
      clearTimeout(this.hoverTimeout);
      this.hoverTimeout = null;
    }
  }

  /**
   * Handler for popover mouse leave - hides popover
   */
  protected onPopoverMouseLeave(): void {
    if (this.hoverTimeout) {
      clearTimeout(this.hoverTimeout);
    }
    this.hoverTimeout = setTimeout(() => {
      this.activePopover.set(null);
    }, 100);
  }

  /**
   * Clears hover timeout
   */
  private clearHoverTimeout(): void {
    if (this.hoverTimeout) {
      clearTimeout(this.hoverTimeout);
      this.hoverTimeout = null;
    }
  }

  /**
   * Handler for collapsed range toggle events from code block
   */
  protected onCollapsedRangeToggle(range: LineRange): void {
    const key = rangeToKey(range);
    const currentState = this.collapsedRangesState();
    const rangeState = currentState.get(key);

    if (rangeState) {
      const newIsExpanded = !rangeState.isExpanded;

      // Create new map with updated state
      const newState = new Map(currentState);
      newState.set(key, {
        ...rangeState,
        isExpanded: newIsExpanded,
      });

      this.collapsedRangesState.set(newState);

      // Emit toggle event
      this.collapsedRangeToggle.emit({
        range,
        isExpanded: newIsExpanded,
      });
    }
  }

  /**
   * Handler for line widget click events from code block
   */
  protected onLineWidgetClick(event: LineWidgetClickEvent): void {
    this.lineWidgetClick.emit(event);
  }
}
