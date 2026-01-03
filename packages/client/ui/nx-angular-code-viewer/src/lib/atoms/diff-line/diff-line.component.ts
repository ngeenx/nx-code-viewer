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
import type {
  LineWidgetClickEvent,
  LineWidgetConfig,
  LineWidgetContext,
  LineWidgetsInput,
} from '../../types/line-widget.types';
import { getDiffLinePrefix } from '../../utils';
import { getMatchingWidgets } from '../../utils/line-widget.utils';
import { LineWidgetHostComponent } from '../line-widget-host';

/**
 * DiffLine Atom Component
 *
 * Displays a single line of a diff with appropriate styling based on the line type.
 *
 * @example
 * ```html
 * <nx-diff-line
 *   [line]="diffLine"
 *   [theme]="'dark'"
 *   [showLineNumbers]="true"
 *   [showPrefix]="true"
 * />
 * ```
 */
@Component({
  selector: 'nx-diff-line',
  standalone: true,
  imports: [LineWidgetHostComponent],
  templateUrl: './diff-line.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'nx-diff-line' },
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
   * Line widget configurations
   */
  readonly lineWidgets = input<LineWidgetsInput>();

  /**
   * Whether to show widgets (for hover display mode)
   */
  readonly showWidgets = input<boolean>(false);

  /**
   * Emits when a line widget is clicked
   */
  readonly lineWidgetClick = output<LineWidgetClickEvent>();

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

  /**
   * Get line number for context (prefer new line number, fallback to old)
   */
  protected readonly lineNumber = computed(() => {
    return this.line().newLineNumber ?? this.line().oldLineNumber ?? 0;
  });

  /**
   * Matching widgets for 'always' display
   */
  protected readonly alwaysWidgets = computed(() => {
    const widgets = this.lineWidgets();
    if (!widgets) return [];
    return getMatchingWidgets(widgets, this.content(), this.lineNumber()).filter(
      w => w.display === 'always'
    );
  });

  /**
   * Matching widgets for 'hover' display
   */
  protected readonly hoverWidgets = computed(() => {
    const widgets = this.lineWidgets();
    if (!widgets) return [];
    return getMatchingWidgets(widgets, this.content(), this.lineNumber()).filter(
      w => w.display === 'hover'
    );
  });

  /**
   * Widgets positioned on the left
   */
  protected readonly leftWidgets = computed(() => {
    const always = this.alwaysWidgets().filter(w => w.position === 'left');
    const hover =
      this.showWidgets() || this.isHighlighted()
        ? this.hoverWidgets().filter(w => w.position === 'left')
        : [];
    return [...always, ...hover];
  });

  /**
   * Widgets positioned on the right
   */
  protected readonly rightWidgets = computed(() => {
    const always = this.alwaysWidgets().filter(w => w.position === 'right');
    const hover =
      this.showWidgets() || this.isHighlighted()
        ? this.hoverWidgets().filter(w => w.position === 'right')
        : [];
    return [...always, ...hover];
  });

  /**
   * Context object for widget components
   */
  protected readonly widgetContext = computed<LineWidgetContext>(() => ({
    line: this.content(),
    lineNumber: this.lineNumber(),
    theme: this.theme(),
  }));

  /**
   * Handle widget click
   */
  protected onWidgetClick(widget: LineWidgetConfig): void {
    this.lineWidgetClick.emit({
      lineNumber: this.lineNumber(),
      line: this.content(),
      widget,
    });
  }
}
