import {
  CodeViewer,
  type ReferenceConfig,
} from '@ngeenx/nx-react-code-viewer';
import { useDemoOptions } from './_shared/useDemoOptions';
import { TodoInfo } from '../app/components/todo-info';

const sample = `import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-example',
  template: '<h1>{{ title() }}</h1>',
  imports: [CommonModule, RouterModule],
})
export class ExampleComponent {
  // TODO: Add more features here
  readonly title = signal('Hello, World!');
}`;

const references: ReferenceConfig[] = [
  {
    textMatch: /@angular\/core/g,
    type: ['link', 'info'],
    link: 'https://angular.dev/api#angular_core',
    target: '_blank',
    content: 'Core Angular library - Component, signal, and more',
  },
  {
    textMatch: /@angular\/common/g,
    type: ['link', 'info'],
    link: 'https://angular.dev/api#angular_common',
    target: '_blank',
    content: 'Common Angular directives like @if, @for etc',
  },
  {
    textMatch: /@angular\/router/g,
    type: ['link', 'info'],
    link: 'https://angular.dev/api#angular_router',
    target: '_blank',
    content: 'Angular Router for navigation and routing',
  },
  {
    textMatch: /TODO:.*/g,
    type: 'info',
    content: TodoInfo,
  },
  {
    textMatch: /@Component/g,
    type: 'info',
    content:
      'Decorator that marks a class as an Angular component and provides configuration metadata.',
  },
  {
    textMatch: /signal\(/g,
    type: 'info',
    content: 'Creates a reactive signal that can be read and updated',
  },
];

export default function CodeViewerReferenceLinksDemo() {
  const { theme, shikiTheme, codeViewerThemeClass } = useDemoOptions();
  return (
    <div className={`crylith-demo-stage ${codeViewerThemeClass}`} style={{ width: 600 }}>
      <CodeViewer
        code={sample}
        language="typescript"
        theme={theme}
        shikiTheme={shikiTheme}
        references={references}
        title="reference-links.ts"
        fileExtension="ts"
      />
    </div>
  );
}
