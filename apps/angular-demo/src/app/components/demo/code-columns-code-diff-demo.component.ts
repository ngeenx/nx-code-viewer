import {
  ChangeDetectionStrategy,
  Component,
  computed,
  signal,
} from '@angular/core';
import {
  ColumnCodeViewerComponent,
  type ColumnItem,
} from '@ngeenx/nx-angular-code-viewer';
import type { BundledTheme } from 'shiki';
import {
  bindDemoOptions,
  readDemoOption,
  readInitialChromeTheme,
} from '../../utils/demo-options';

@Component({
  selector: 'app-code-columns-code-diff-demo',
  standalone: true,
  imports: [ColumnCodeViewerComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <nx-column-code-viewer
      [class]="codeViewerThemeClass()"
      [columns]="columns"
      [theme]="theme()"
      [shikiTheme]="shikiTheme()"
      borderStyle="classic" />
  `,
  styles: `
    nx-column-code-viewer {
      width: 900px;
    }
  `,
})
export default class CodeColumnsCodeDiffDemoComponent {
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

  protected readonly columns: ColumnItem[] = [
    {
      id: 'code',
      type: 'code',
      title: 'api.service.ts',
      fileExtension: '.ts',
      language: 'typescript',
      code: `@Injectable({ providedIn: 'root' })
export class ApiService {
  constructor(private http: HttpClient) {}

  get<T>(url: string) {
    return this.http.get<T>(url);
  }
}`,
    },
    {
      id: 'diff',
      type: 'diff',
      title: 'Proposed Changes',
      fileExtension: '.ts',
      language: 'typescript',
      oldCode: `@Injectable({ providedIn: 'root' })
export class ApiService {
  constructor(private http: HttpClient) {}

  get<T>(url: string) {
    return this.http.get<T>(url);
  }
}`,
      newCode: `@Injectable({ providedIn: 'root' })
export class ApiService {
  constructor(private http: HttpClient) {}

  get<T>(url: string) {
    return this.http.get<T>(url).pipe(
      retry(3),
      catchError(this.handleError)
    );
  }

  private handleError(error: unknown) {
    console.error('API error:', error);
    throw error;
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
