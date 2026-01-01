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
import type { SafeHtml } from '@angular/platform-browser';
import type {
  CodeViewerLanguage,
  CodeViewerTheme,
  HighlightedCodeState,
  HighlightedLinesInput,
} from '../../types';
import { DEFAULT_CODE_VIEWER_CONFIG } from '../../types';
import { countLines, parseHighlightedLines } from '../../utils';
import { ClipboardService, CodeHighlighterService } from '../../services';
import { CodeHeaderComponent } from '../../atoms/code-header';
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
  imports: [CodeHeaderComponent, CodeBlockComponent],
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

  // ═══════════════════════════════════════════════════════════════════════════
  // OUTPUTS
  // ═══════════════════════════════════════════════════════════════════════════

  /**
   * Emitted when code is copied to clipboard
   */
  readonly codeCopied = output<void>();

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

  // ═══════════════════════════════════════════════════════════════════════════
  // COMPUTED SIGNALS
  // ═══════════════════════════════════════════════════════════════════════════

  /**
   * Normalized code string (handles both string and string[] inputs)
   */
  private readonly normalizedCode = computed(() => {
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
   * Highlighted HTML content or fallback
   */
  protected readonly highlightedContent = computed<SafeHtml | null>(() => {
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
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // LIFECYCLE
  // ═══════════════════════════════════════════════════════════════════════════

  ngOnDestroy(): void {
    this.abortPendingHighlight();
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
}
