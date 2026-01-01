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
import type { CodeViewerTheme } from '../../types';

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
      this.content(); // Track content changes to re-run effect

      // Schedule DOM update after Angular renders the new content
      afterNextRender(
        () => {
          this.updateHighlightedLines(lineIndex, highlightedSet);
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
   * Emitted when a line is hovered
   */
  readonly lineHover = output<number>();

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
   * Updates the highlighted class on line elements
   * @param hoveredLineIndex - Currently hovered line (1-based)
   * @param highlightedSet - Set of pre-configured highlighted lines
   */
  private updateHighlightedLines(hoveredLineIndex: number, highlightedSet: Set<number>): void {
    const codeElement = this.elementRef.nativeElement.querySelector('code');
    if (!codeElement) return;

    const lines = codeElement.querySelectorAll('.line');
    lines.forEach((line: Element, index: number) => {
      const lineNumber = index + 1;
      const isHighlighted = lineNumber === hoveredLineIndex || highlightedSet.has(lineNumber);

      if (isHighlighted) {
        line.classList.add('highlighted');
      } else {
        line.classList.remove('highlighted');
      }
    });
  }
}
