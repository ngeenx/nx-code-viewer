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
import type { CodeViewerTheme, LineWidgetContext } from '../../types';
import { LINE_WIDGET_CONTEXT, LINE_WIDGET_CLOSE } from '../../types';

/**
 * InsertWidgetContainer Atom Component
 *
 * Container for insert components shown between lines.
 * Dynamically renders a component with context injection.
 *
 * @example
 * ```html
 * <nx-insert-widget-container
 *   [component]="CommentFormComponent"
 *   [context]="{ line: 'const x = 1;', lineNumber: 5, theme: 'dark' }"
 *   [theme]="'dark'"
 *   (close)="onClose()"
 * />
 * ```
 */
@Component({
  selector: 'nx-insert-widget-container',
  standalone: true,
  imports: [],
  templateUrl: './insert-widget-container.component.html',
  styleUrl: './insert-widget-container.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InsertWidgetContainerComponent {
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
   * Theme for styling
   */
  readonly theme = input<CodeViewerTheme>('dark');

  /**
   * Emitted when the container requests to be closed
   */
  readonly close = output<void>();

  /**
   * Computed CSS classes for the container
   */
  protected readonly containerClasses = computed(() => {
    const themeValue = this.theme();
    return `insert-widget-container ${themeValue}`;
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

      // Create injector with context and close callback
      const componentInjector = Injector.create({
        providers: [
          {
            provide: LINE_WIDGET_CONTEXT,
            useValue: contextValue,
          },
          {
            provide: LINE_WIDGET_CLOSE,
            useValue: () => this.close.emit(),
          },
        ],
        parent: this.parentInjector,
      });

      // Create the component inside our container
      this.widgetContainerRef.createComponent(componentType, { injector: componentInjector });
    });
  }

  /**
   * Handles close action
   */
  protected onClose(): void {
    this.close.emit();
  }
}
