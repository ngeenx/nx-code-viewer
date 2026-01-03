import {
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
  Type,
  afterNextRender,
} from '@angular/core';
import { NgComponentOutlet } from '@angular/common';
import type { CodeViewerTheme } from '../../types';

/**
 * Position for the popover relative to anchor
 */
type PopoverPosition = 'above' | 'below';

/**
 * Computed position styles for the popover
 */
interface PopoverStyles {
  readonly top: string;
  readonly left: string;
  readonly arrowTop?: string;
  readonly arrowLeft?: string;
  readonly arrowDirection: 'up' | 'down';
}

/**
 * ReferencePopover Atom Component
 *
 * Displays a floating popover with content when hovering over reference elements.
 * Supports both string content and dynamic Angular components.
 *
 * @example
 * ```html
 * <nx-reference-popover
 *   [content]="'This is a tooltip'"
 *   [anchorElement]="refElement"
 *   [theme]="'dark'"
 *   [visible]="true"
 *   (mouseEnter)="onPopoverMouseEnter()"
 *   (mouseLeave)="onPopoverMouseLeave()" />
 * ```
 */
@Component({
  selector: 'nx-reference-popover',
  standalone: true,
  imports: [NgComponentOutlet],
  templateUrl: './reference-popover.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'nx-reference-popover' },
})
export class ReferencePopoverComponent {
  private readonly elementRef = inject(ElementRef<HTMLElement>);
  private readonly injector = inject(Injector);

  /**
   * Content to display - string or Angular component type
   */
  readonly content = input.required<string | Type<unknown>>();

  /**
   * The DOM element to position the popover relative to
   */
  readonly anchorElement = input.required<HTMLElement>();

  /**
   * Theme for styling
   */
  readonly theme = input<CodeViewerTheme>('dark');

  /**
   * Whether the popover is visible
   */
  readonly visible = input<boolean>(false);

  /**
   * Matched text from the reference (for component content)
   */
  readonly matchedText = input<string>('');

  /**
   * Capture groups from the reference (for component content)
   */
  readonly captureGroups = input<readonly string[]>([]);

  /**
   * Line number where the reference was found (for component content)
   */
  readonly lineNumber = input<number>(0);

  /**
   * Emitted when mouse enters the popover
   */
  readonly mouseEnter = output<void>();

  /**
   * Emitted when mouse leaves the popover
   */
  readonly mouseLeave = output<void>();

  /**
   * Internal position state
   */
  protected readonly positionStyles = signal<PopoverStyles>({
    top: '0px',
    left: '0px',
    arrowDirection: 'down',
  });

  /**
   * Whether content is a string
   */
  protected readonly isStringContent = computed(() => {
    return typeof this.content() === 'string';
  });

  /**
   * String content (when content is a string)
   */
  protected readonly stringContent = computed(() => {
    const content = this.content();
    return typeof content === 'string' ? content : '';
  });

  /**
   * Component type (when content is a component)
   */
  protected readonly componentType = computed(() => {
    const content = this.content();
    return typeof content !== 'string' ? content : null;
  });

  /**
   * Inputs to pass to dynamic component
   */
  protected readonly componentInputs = computed(() => ({
    matchedText: this.matchedText(),
    captureGroups: this.captureGroups(),
    lineNumber: this.lineNumber(),
  }));

  constructor() {
    // Update position when anchor or visibility changes
    effect(() => {
      const anchor = this.anchorElement();
      const isVisible = this.visible();

      if (isVisible && anchor) {
        afterNextRender(
          () => {
            this.updatePosition();
          },
          { injector: this.injector }
        );
      }
    });
  }

  /**
   * Updates the popover position based on anchor element
   */
  private updatePosition(): void {
    const anchor = this.anchorElement();
    if (!anchor) return;

    const popover = this.elementRef.nativeElement.querySelector(
      '.popover-container'
    ) as HTMLElement | null;
    if (!popover) return;

    const anchorRect = anchor.getBoundingClientRect();
    const popoverRect = popover.getBoundingClientRect();
    const viewportHeight = window.innerHeight;
    const viewportWidth = window.innerWidth;

    // Determine if popover should be above or below
    const spaceAbove = anchorRect.top;
    const spaceBelow = viewportHeight - anchorRect.bottom;
    const position: PopoverPosition =
      spaceAbove > spaceBelow && spaceBelow < popoverRect.height + 8
        ? 'above'
        : 'below';

    // Calculate top position
    let top: number;
    if (position === 'above') {
      top = anchorRect.top - popoverRect.height - 8;
    } else {
      top = anchorRect.bottom + 8;
    }

    // Calculate left position (center on anchor)
    let left = anchorRect.left + anchorRect.width / 2 - popoverRect.width / 2;

    // Clamp to viewport bounds
    const padding = 8;
    left = Math.max(
      padding,
      Math.min(left, viewportWidth - popoverRect.width - padding)
    );
    top = Math.max(padding, top);

    // Calculate arrow position
    const arrowLeft = anchorRect.left + anchorRect.width / 2 - left;

    this.positionStyles.set({
      top: `${top}px`,
      left: `${left}px`,
      arrowLeft: `${arrowLeft}px`,
      arrowDirection: position === 'above' ? 'down' : 'up',
    });
  }

  /**
   * Handle mouse enter event
   */
  protected onMouseEnter(): void {
    this.mouseEnter.emit();
  }

  /**
   * Handle mouse leave event
   */
  protected onMouseLeave(): void {
    this.mouseLeave.emit();
  }
}
