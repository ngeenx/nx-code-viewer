import {
  afterNextRender,
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  inject,
  Injector,
  input,
  output,
  signal,
  Type,
  ViewChild,
  ViewContainerRef,
} from '@angular/core';
import type {
  CodeViewerTheme,
  LineWidgetContext,
  LineWidgetPosition,
} from '../../types';
import { LINE_WIDGET_CONTEXT } from '../../types';

/**
 * LineWidgetHost Atom Component
 *
 * Dynamically renders a widget component with context injection.
 * Positions itself absolutely based on the position input.
 *
 * @example
 * ```html
 * <nx-line-widget-host
 *   [component]="BookmarkButtonComponent"
 *   [context]="{ line: 'const x = 1;', lineNumber: 5, theme: 'dark' }"
 *   [position]="'left'"
 *   (widgetClick)="onWidgetClick()"
 * />
 * ```
 */
@Component({
  selector: 'nx-line-widget-host',
  standalone: true,
  imports: [],
  templateUrl: './line-widget-host.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'nx-line-widget-host' },
})
export class LineWidgetHostComponent {
  private readonly parentInjector = inject(Injector);
  private readonly injector = inject(Injector);

  /**
   * Container for dynamic component insertion
   */
  @ViewChild('widgetContainer', { read: ViewContainerRef, static: true })
  private widgetContainerRef!: ViewContainerRef;

  /**
   * The component type to render
   */
  readonly component = input.required<Type<unknown>>();

  /**
   * Context to inject into the component
   */
  readonly context = input.required<LineWidgetContext>();

  /**
   * Position of the widget ('left' or 'right')
   */
  readonly position = input.required<LineWidgetPosition>();

  /**
   * Theme for styling
   */
  readonly theme = input<CodeViewerTheme>('dark');

  /**
   * Emitted when the widget container is clicked
   */
  readonly widgetClick = output<void>();

  /**
   * Computed CSS classes for the host container
   */
  protected readonly hostClasses = computed(() => {
    const pos = this.position();
    const themeValue = this.theme();
    return `line-widget-host ${pos} ${themeValue}`;
  });

  /**
   * Track if container is ready for component creation
   */
  private readonly containerReady = signal(false);

  constructor() {
    // Wait for view to be initialized
    afterNextRender(() => {
      this.containerReady.set(true);
    }, { injector: this.injector });

    // Effect to create/update the component when inputs change
    effect(() => {
      const componentType = this.component();
      const contextValue = this.context();
      const isReady = this.containerReady();

      if (!isReady || !this.widgetContainerRef) return;

      // Clear existing component
      this.widgetContainerRef.clear();

      // Create injector with context
      const componentInjector = Injector.create({
        providers: [
          {
            provide: LINE_WIDGET_CONTEXT,
            useValue: contextValue,
          },
        ],
        parent: this.parentInjector,
      });

      // Create the component inside our container
      this.widgetContainerRef.createComponent(componentType, { injector: componentInjector });
    });
  }

  /**
   * Handles click on the widget container
   */
  protected onClick(event: MouseEvent): void {
    event.stopPropagation();
    this.widgetClick.emit();
  }

  /**
   * Handles keyboard activation
   */
  protected onKeydown(event: KeyboardEvent): void {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      event.stopPropagation();
      this.widgetClick.emit();
    }
  }
}
