import {
  ChangeDetectionStrategy,
  Component,
  computed,
  signal,
} from '@angular/core';
import {
  MultiCodeViewerComponent,
  type MultiCodeViewerTabItem,
} from '@ngeenx/nx-angular-code-viewer';
import type { BundledTheme } from 'shiki';
import {
  bindDemoOptions,
  readDemoOption,
  readInitialChromeTheme,
} from '../../utils/demo-options';

@Component({
  selector: 'app-code-multi-viewer-demo',
  standalone: true,
  imports: [MultiCodeViewerComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <nx-multi-code-viewer
      [class]="codeViewerThemeClass()"
      [tabs]="tabs"
      [theme]="theme()"
      [shikiTheme]="shikiTheme()"
      borderStyle="classic" />
  `,
  styles: `
    nx-multi-code-viewer {
      width: 720px;
    }
  `,
})
export default class CodeMultiViewerDemoComponent {
  protected readonly theme = signal<'light' | 'dark'>(readInitialChromeTheme());
  protected readonly shikiTheme = signal<BundledTheme>(
    readDemoOption('shikiTheme', 'github-light')
  );
  protected readonly codeViewerTheme = signal<string>(
    readDemoOption('codeViewerTheme', 'default')
  );
  protected readonly codeViewerThemeClass = computed(() => {
    const t = this.codeViewerTheme();
    return t === 'default' ? '' : `theme-${t}`;
  });

  protected readonly tabs: MultiCodeViewerTabItem[] = [
    {
      id: 'component',
      type: 'code',
      fileName: 'user.component.ts',
      fileExtension: '.ts',
      language: 'typescript',
      code: `import { Component, signal } from '@angular/core';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrl: './user.component.css',
})
export class UserComponent {
  readonly name = signal('John Doe');
  readonly email = signal('john@example.com');
}`,
    },
    {
      id: 'template',
      type: 'code',
      fileName: 'user.component.html',
      fileExtension: '.html',
      language: 'html',
      code: `<div class="user-card">
  <h2>{{ name() }}</h2>
  <p>{{ email() }}</p>
  <button (click)="edit()">Edit Profile</button>
</div>`,
    },
    {
      id: 'styles',
      type: 'code',
      fileName: 'user.component.css',
      fileExtension: '.css',
      language: 'css',
      code: `.user-card {
  padding: 1rem;
  border-radius: 0.5rem;
  background: var(--card-bg);
}

.user-card h2 {
  margin: 0 0 0.5rem;
  font-size: 1.25rem;
}`,
    },
    {
      id: 'changes',
      type: 'diff',
      fileName: 'user.service.ts',
      fileExtension: '.ts',
      language: 'typescript',
      oldCode: `export class UserService {
  getUser(id: number) {
    return this.http.get('/api/users/' + id);
  }
}`,
      newCode: `export class UserService {
  getUser(id: number) {
    return this.http.get<User>(\`/api/users/\${id}\`);
  }

  updateUser(id: number, data: Partial<User>) {
    return this.http.patch<User>(\`/api/users/\${id}\`, data);
  }
}`,
    },
  ];

  constructor() {
    bindDemoOptions({
      onTheme: v => this.theme.set(v),
      onShikiTheme: v => this.shikiTheme.set(v),
      onCodeViewerTheme: v => this.codeViewerTheme.set(v),
    });
  }
}
