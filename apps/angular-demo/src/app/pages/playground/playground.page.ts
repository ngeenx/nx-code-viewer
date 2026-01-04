import { Component, inject, signal, computed } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  CodeViewerComponent,
  DiffViewerComponent,
  CodeViewerLanguage,
  CodeViewerBorderStyle,
  DiffViewMode,
  ShikiThemeName,
  CodeViewerTheme,
} from '@ngeenx/nx-angular-code-viewer';
import { ThemeService, CustomTheme } from '../../services/theme.service';

interface SelectOption<T> {
  value: T;
  label: string;
}

@Component({
  selector: 'app-playground',
  standalone: true,
  imports: [FormsModule, CodeViewerComponent, DiffViewerComponent],
  templateUrl: './playground.page.html',
  styleUrls: ['./playground.page.css', '../page.css'],
})
export class PlaygroundPage {
  protected readonly themeService = inject(ThemeService);
  protected readonly globalTheme = this.themeService.theme;

  // ═══════════════════════════════════════════════════════════════════════════
  // TAB STATE
  // ═══════════════════════════════════════════════════════════════════════════

  protected readonly activeTab = signal<'code' | 'diff'>('code');

  // ═══════════════════════════════════════════════════════════════════════════
  // CODE VIEWER CONFIGURATION
  // ═══════════════════════════════════════════════════════════════════════════

  protected readonly codeConfig = {
    code: signal<string>(`import { Component, signal } from '@angular/core';

@Component({
  selector: 'app-counter',
  standalone: true,
  template: \`
    <div class="counter">
      <h2>Counter: {{ count() }}</h2>
      <button (click)="increment()">+</button>
      <button (click)="decrement()">-</button>
    </div>
  \`,
})
export class CounterComponent {
  readonly count = signal(0);

  increment() {
    this.count.update(n => n + 1);
  }

  decrement() {
    this.count.update(n => n - 1);
  }
}`),
    language: signal<CodeViewerLanguage>('typescript'),
    theme: signal<CodeViewerTheme>('dark'),
    shikiTheme: signal<ShikiThemeName | 'auto'>('auto'),
    customTheme: signal<CustomTheme>('default'),
    borderStyle: signal<CodeViewerBorderStyle>('classic'),
    showLineNumbers: signal<boolean>(true),
    showCopyButton: signal<boolean>(true),
    showHeader: signal<boolean>(true),
    wordWrap: signal<boolean>(false),
    title: signal<string>('counter.component.ts'),
    fileExtension: signal<string>('.ts'),
    maxHeight: signal<string>(''),
    highlightedLines: signal<string>(''),
    focusedLines: signal<string>(''),
  };

  // ═══════════════════════════════════════════════════════════════════════════
  // DIFF VIEWER CONFIGURATION
  // ═══════════════════════════════════════════════════════════════════════════

  protected readonly diffConfig = {
    oldCode: signal<string>(`interface User {
  id: number;
  name: string;
}

function getUser(id: number): User {
  return {
    id,
    name: 'John Doe',
  };
}

const user = getUser(1);
console.log(user.name);`),
    newCode: signal<string>(`interface User {
  id: number;
  name: string;
  email: string;
  createdAt: Date;
}

function getUser(id: number): User | null {
  if (id <= 0) {
    return null;
  }
  return {
    id,
    name: 'John Doe',
    email: 'john@example.com',
    createdAt: new Date(),
  };
}

const user = getUser(1);
if (user) {
  console.log(\`\${user.name} <\${user.email}>\`);
}`),
    language: signal<CodeViewerLanguage>('typescript'),
    theme: signal<CodeViewerTheme>('dark'),
    shikiTheme: signal<ShikiThemeName | 'auto'>('auto'),
    customTheme: signal<CustomTheme>('default'),
    borderStyle: signal<CodeViewerBorderStyle>('classic'),
    viewMode: signal<DiffViewMode>('unified'),
    showLineNumbers: signal<boolean>(true),
    showHeader: signal<boolean>(true),
    oldFileName: signal<string>('user.ts'),
    newFileName: signal<string>('user.ts'),
    fileExtension: signal<string>('.ts'),
    maxHeight: signal<string>(''),
  };

  // ═══════════════════════════════════════════════════════════════════════════
  // OPTIONS
  // ═══════════════════════════════════════════════════════════════════════════

  protected readonly languageOptions: SelectOption<CodeViewerLanguage>[] = [
    { value: 'typescript', label: 'TypeScript' },
    { value: 'javascript', label: 'JavaScript' },
    { value: 'html', label: 'HTML' },
    { value: 'css', label: 'CSS' },
    { value: 'scss', label: 'SCSS' },
    { value: 'json', label: 'JSON' },
    { value: 'python', label: 'Python' },
    { value: 'java', label: 'Java' },
    { value: 'go', label: 'Go' },
    { value: 'rust', label: 'Rust' },
    { value: 'php', label: 'PHP' },
    { value: 'ruby', label: 'Ruby' },
    { value: 'swift', label: 'Swift' },
    { value: 'kotlin', label: 'Kotlin' },
    { value: 'c', label: 'C' },
    { value: 'cpp', label: 'C++' },
    { value: 'csharp', label: 'C#' },
    { value: 'sql', label: 'SQL' },
    { value: 'bash', label: 'Bash' },
    { value: 'yaml', label: 'YAML' },
    { value: 'markdown', label: 'Markdown' },
    { value: 'plaintext', label: 'Plain Text' },
  ];

  protected readonly themeOptions: SelectOption<CodeViewerTheme>[] = [
    { value: 'dark', label: 'Dark' },
    { value: 'light', label: 'Light' },
  ];

  protected readonly shikiThemeOptions = this.themeService.shikiThemeOptions;
  protected readonly customThemeOptions = [
    ...this.themeService.customThemeOptions,
    { value: 'handwritten' as CustomTheme, label: 'Handwritten' },
  ];

  protected readonly borderStyleOptions: SelectOption<CodeViewerBorderStyle>[] =
    [
      { value: 'classic', label: 'Classic' },
      { value: 'grid-cross', label: 'Grid Cross' },
      { value: 'corner-intersection', label: 'Corner Intersection' },
      { value: 'none', label: 'None' },
    ];

  protected readonly viewModeOptions: SelectOption<DiffViewMode>[] = [
    { value: 'unified', label: 'Unified' },
    { value: 'split', label: 'Split' },
  ];

  // ═══════════════════════════════════════════════════════════════════════════
  // COMPUTED VALUES
  // ═══════════════════════════════════════════════════════════════════════════

  protected readonly codeCustomThemeClass = computed(() => {
    const theme = this.codeConfig.customTheme();
    return theme === 'default' ? '' : `theme-${theme}`;
  });

  protected readonly diffCustomThemeClass = computed(() => {
    const theme = this.diffConfig.customTheme();
    return theme === 'default' ? '' : `theme-${theme}`;
  });

  protected readonly codeResolvedShikiTheme = computed(() => {
    const theme = this.codeConfig.shikiTheme();
    return theme === 'auto' ? undefined : theme;
  });

  protected readonly diffResolvedShikiTheme = computed(() => {
    const theme = this.diffConfig.shikiTheme();
    return theme === 'auto' ? undefined : theme;
  });

  protected readonly codeParsedHighlightedLines = computed(() => {
    return this.parseLineInput(this.codeConfig.highlightedLines());
  });

  protected readonly codeParsedFocusedLines = computed(() => {
    return this.parseLineInput(this.codeConfig.focusedLines());
  });

  // ═══════════════════════════════════════════════════════════════════════════
  // METHODS
  // ═══════════════════════════════════════════════════════════════════════════

  protected setActiveTab(tab: 'code' | 'diff'): void {
    this.activeTab.set(tab);
  }

  protected onCodeCopied(): void {
    console.log('Code copied to clipboard');
  }

  protected onCodeBorderStyleChange(value: CodeViewerBorderStyle): void {
    console.log('Border style changed to:', value);
    this.codeConfig.borderStyle.set(value);
  }

  protected onDiffBorderStyleChange(value: CodeViewerBorderStyle): void {
    console.log('Diff border style changed to:', value);
    this.diffConfig.borderStyle.set(value);
  }

  private parseLineInput(
    input: string
  ): number | readonly (number | readonly [number, number])[] | undefined {
    if (!input.trim()) {
      return undefined;
    }

    const parts = input.split(',').map(p => p.trim());
    const result: (number | readonly [number, number])[] = [];

    for (const part of parts) {
      if (part.includes('-')) {
        const [start, end] = part.split('-').map(n => parseInt(n.trim(), 10));
        if (!isNaN(start) && !isNaN(end)) {
          result.push([start, end] as const);
        }
      } else {
        const num = parseInt(part, 10);
        if (!isNaN(num)) {
          result.push(num);
        }
      }
    }

    if (result.length === 0) {
      return undefined;
    }
    if (result.length === 1 && typeof result[0] === 'number') {
      return result[0];
    }
    return result;
  }
}
