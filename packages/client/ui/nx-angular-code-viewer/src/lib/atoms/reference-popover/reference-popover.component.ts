import {
  ChangeDetectionStrategy,
  Component,
  computed,
  DestroyRef,
  effect,
  ElementRef,
  inject,
  Injector,
  input,
  output,
  Type,
  afterNextRender,
} from '@angular/core';
import { NgComponentOutlet } from '@angular/common';
import type { CodeViewerTheme } from '@ngeenx/nx-code-viewer-utils';
import tippy, { type Instance } from 'tippy.js';

/**
 * ReferencePopover Atom Component
 *
 * Displays a floating popover with content when hovering over reference elements.
 * Uses tippy.js for positioning and interaction management.
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
  imports: [NgComponentOutlet],
  templateUrl: './reference-popover.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'nx-reference-popover' },
})
export class ReferencePopoverComponent {
  private readonly elementRef = inject(ElementRef<HTMLElement>);
  private readonly injector = inject(Injector);
  private readonly destroyRef = inject(DestroyRef);

  private tippyInstance: Instance | null = null;

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
    effect(() => {
      const anchor = this.anchorElement();
      const isVisible = this.visible();

      if (isVisible && anchor) {
        afterNextRender(
          () => {
            this.createTippy(anchor);
          },
          { injector: this.injector }
        );
      } else {
        this.destroyTippy();
      }
    });

    this.destroyRef.onDestroy(() => {
      this.destroyTippy();
    });
  }

  private createTippy(anchor: HTMLElement): void {
    const contentEl = this.elementRef.nativeElement.querySelector(
      '.popover-content'
    ) as HTMLElement | null;
    if (!contentEl) return;

    this.destroyTippy();

    this.tippyInstance = tippy(anchor, {
      content: contentEl,
      placement: 'top',
      interactive: true,
      trigger: 'manual',
      showOnCreate: true,
      arrow: true,
      appendTo: document.body,
      theme: this.theme() === 'dark' ? 'nx-dark' : 'nx-light',
      animation: 'fade',
      offset: [0, 8],
      popperOptions: {
        modifiers: [
          {
            name: 'flip',
            options: {
              fallbackPlacements: ['bottom'],
            },
          },
        ],
      },
      onMount: (instance) => {
        const box = instance.popper.querySelector('.tippy-box');
        if (box) {
          box.addEventListener('mouseenter', () => this.mouseEnter.emit());
          box.addEventListener('mouseleave', () => this.mouseLeave.emit());
        }
      },
    });
  }

  private destroyTippy(): void {
    if (this.tippyInstance) {
      this.tippyInstance.destroy();
      this.tippyInstance = null;
    }
  }
}
