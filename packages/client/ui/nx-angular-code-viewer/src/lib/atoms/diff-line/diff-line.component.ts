import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
  output,
} from '@angular/core';
import { DomSanitizer, type SafeHtml } from '@angular/platform-browser';
import type { CodeViewerTheme, DiffLine } from '../../types';
import { getDiffLinePrefix } from '../../utils';

/**
 * DiffLine Atom Component
 *
 * Displays a single line of a diff with appropriate styling based on the line type.
 *
 * @example
 * ```html
 * <ngn-diff-line
 *   [line]="diffLine"
 *   [theme]="'dark'"
 *   [showLineNumbers]="true"
 *   [showPrefix]="true"
 * />
 * ```
 */
@Component({
  selector: 'ngn-diff-line',
  standalone: true,
  imports: [],
  templateUrl: './diff-line.component.html',
  styleUrl: './diff-line.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DiffLineComponent {
  private readonly sanitizer = inject(DomSanitizer);

  /**
   * The diff line to display
   */
  readonly line = input.required<DiffLine>();

  /**
   * Theme for styling
   */
  readonly theme = input<CodeViewerTheme>('dark');

  /**
   * Whether to show line numbers
   */
  readonly showLineNumbers = input<boolean>(true);

  /**
   * Whether to show the +/- prefix
   */
  readonly showPrefix = input<boolean>(true);

  /**
   * Whether this line is highlighted (hovered)
   */
  readonly isHighlighted = input<boolean>(false);

  /**
   * Unique index for this line (used for hover tracking)
   */
  readonly lineIndex = input<number>(0);

  /**
   * Emits when mouse enters/leaves this line
   */
  readonly lineHover = output<number>();

  /**
   * Computed CSS classes for the line container
   */
  protected readonly lineClasses = computed(() => {
    const lineType = this.line().type;
    const themeValue = this.theme();
    const highlighted = this.isHighlighted() ? 'highlighted' : '';
    return `diff-line ${lineType} ${themeValue} ${highlighted}`.trim();
  });

  /**
   * Computed prefix character (+, -, or space)
   */
  protected readonly prefix = computed(() => {
    return getDiffLinePrefix(this.line().type);
  });

  /**
   * Computed old line number display
   */
  protected readonly oldLineNum = computed(() => {
    const num = this.line().oldLineNumber;
    return num !== undefined ? String(num) : '';
  });

  /**
   * Computed new line number display
   */
  protected readonly newLineNum = computed(() => {
    const num = this.line().newLineNumber;
    return num !== undefined ? String(num) : '';
  });

  /**
   * Plain text content (for fallback)
   */
  protected readonly content = computed(() => this.line().content);

  /**
   * Whether this line has highlighted content
   */
  protected readonly hasHighlightedContent = computed(
    () => !!this.line().highlightedContent
  );

  /**
   * Highlighted HTML content (sanitized for safe rendering)
   */
  protected readonly highlightedContent = computed<SafeHtml>(() => {
    const content = this.line().highlightedContent ?? '';
    return this.sanitizer.bypassSecurityTrustHtml(content);
  });

  /**
   * Handle mouse enter event
   */
  protected onMouseEnter(): void {
    this.lineHover.emit(this.lineIndex());
  }
}
