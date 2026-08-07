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

// Lazy-imported so that consumers who never use the references /
// popover features don't pay tippy.js's bundle cost. The import is
// cached on first call so subsequent popovers reuse the same module
// chunk. tippy.js is declared as an OPTIONAL peer dependency - users
// who hit this path see a clear runtime error if it's not installed.
// Type-only imports are erased at compile time so they don't pull
// the package into the runtime bundle.
import type { Instance as TippyInstance } from 'tippy.js';
type TippyModule = typeof import('tippy.js');
let tippyPromise: Promise<TippyModule['default']> | null = null;
function loadTippy(): Promise<TippyModule['default']> {
  if (!tippyPromise) {
    tippyPromise = import('tippy.js')
      .then(m => m.default)
      .catch(err => {
        tippyPromise = null;
        throw new Error(
          'nx-code-viewer: references require `tippy.js`. ' +
            'Install it with `pnpm add tippy.js` and import its CSS ' +
            "(`import 'tippy.js/dist/tippy.css';`) in your app styles.\n" +
            `Underlying error: ${err instanceof Error ? err.message : String(err)}`
        );
      });
  }
  return tippyPromise;
}

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

  private tippyInstance: TippyInstance | null = null;

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
            this.createTippy(anchor).catch(err => {
              // Optional peer not installed (or another runtime
              // failure) - log and degrade gracefully so the rest
              // of the code viewer keeps working.
              console.error(
                '[nx-code-viewer] failed to mount reference popover',
                err
              );
            });
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

  private async createTippy(anchor: HTMLElement): Promise<void> {
    const contentEl = this.elementRef.nativeElement.querySelector(
      '.nx-popover-content'
    ) as HTMLElement | null;
    if (!contentEl) return;

    this.destroyTippy();

    const tippy = await loadTippy();

    // Re-check anchor visibility after the async hop. If the popover
    // was hidden or the component destroyed while tippy was loading,
    // skip creating a stale instance.
    if (!this.visible() || this.anchorElement() !== anchor) return;

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
