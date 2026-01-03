import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  inject,
  Injector,
  input,
  output,
  Type,
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
  styleUrl: './line-widget-host.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LineWidgetHostComponent {
  private readonly viewContainerRef = inject(ViewContainerRef);
  private readonly parentInjector = inject(Injector);

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

  constructor() {
    // Effect to create/update the component when inputs change
    effect(() => {
      const componentType = this.component();
      const contextValue = this.context();

      // Clear existing component
      this.viewContainerRef.clear();

      // Create injector with context
      const injector = Injector.create({
        providers: [
          {
            provide: LINE_WIDGET_CONTEXT,
            useValue: contextValue,
          },
        ],
        parent: this.parentInjector,
      });

      // Create the component
      this.viewContainerRef.createComponent(componentType, { injector });
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
