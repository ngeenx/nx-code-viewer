import { Component, inject } from '@angular/core';
import {
  CodeViewerComponent,
  CodeViewerLanguage,
  LineWidgetsInput,
  LineWidgetClickEvent,
  ReferenceConfig,
} from '@ngeenx/nx-angular-code-viewer';
import { ThemeService } from '../../services/theme.service';
import { TodoInfoComponent } from '../../components/todo-info.component';
import { BookmarkWidgetComponent } from '../../components/bookmark-widget.component';
import { CommentWidgetComponent } from '../../components/comment-widget.component';
import { CommentFormComponent } from '../../components/comment-form.component';

@Component({
  selector: 'app-interactive-features',
  standalone: true,
  imports: [CodeViewerComponent],
  templateUrl: './interactive-features.page.html',
  styleUrls: ['../page.css'],
})
export class InteractiveFeaturesPage {
  protected readonly themeService = inject(ThemeService);
  protected readonly theme = this.themeService.theme;

  protected readonly referenceLinksExample = {
    code: `import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-example',
  template: '<h1>{{ title() }}</h1>',
  standalone: true,
  imports: [CommonModule, RouterModule],
})
export class ExampleComponent {
  // TODO: Add more features here
  readonly title = signal('Hello, World!');
}`,
    language: 'typescript' as CodeViewerLanguage,
    references: [
      {
        textMatch: /@angular\/core/g,
        type: ['link', 'info'] as const,
        link: 'https://angular.dev/api#angular_core',
        target: '_blank',
        content: 'Core Angular library - Component, signal, and more',
      },
      {
        textMatch: /@angular\/common/g,
        type: ['link', 'info'] as const,
        link: 'https://angular.dev/api#angular_common',
        target: '_blank',
        content: 'Common Angular directives like @if, @for etc',
      },
      {
        textMatch: /@angular\/router/g,
        type: ['link', 'info'] as const,
        link: 'https://angular.dev/api#angular_router',
        target: '_blank',
        content: 'Angular Router for navigation and routing',
      },
      {
        textMatch: /TODO:.*/g,
        type: 'info',
        content: TodoInfoComponent,
      },
      {
        textMatch: /@Component/g,
        type: 'info',
        content:
          'Decorator that marks a class as an Angular component and provides configuration metadata that determines how the component should be processed, instantiated, and used at runtime.',
      },
      {
        textMatch: /signal\(/g,
        type: 'info',
        content: 'Creates a reactive signal that can be read and updated',
        handle: (line: string) => {
          alert('Signal reference clicked! Line: ' + line);
        },
      },
    ] as ReferenceConfig[],
  };

  protected readonly lineWidgetsExample: {
    code: string;
    language: CodeViewerLanguage;
    lineWidgets: LineWidgetsInput;
  } = {
    language: 'typescript',
    lineWidgets: [
      {
        position: 'left',
        display: 'hover',
        lineComponent: BookmarkWidgetComponent,
      },
      {
        position: 'right',
        display: 'hover',
        lineComponent: CommentWidgetComponent,
        insertComponent: CommentFormComponent,
      },
    ],
    code: `import { Component, signal } from '@angular/core';

@Component({
  selector: 'app-counter',
  template: \`
    <div class="counter">
      <h1>Count: {{ count() }}</h1>
      <button (click)="increment()">+</button>
      <button (click)="decrement()">-</button>
    </div>
  \`,
})
export class CounterComponent {
  readonly count = signal(0);

  increment(): void {
    this.count.update(n => n + 1);
  }

  decrement(): void {
    this.count.update(n => n - 1);
  }
}`,
  };

  protected onLineWidgetClick(event: LineWidgetClickEvent): void {
    console.log('Line widget clicked:', event);
  }
}
