import {
  ChangeDetectionStrategy,
  Component,
  computed,
  DestroyRef,
  DOCUMENT,
  effect,
  inject,
  signal,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  CodeViewerComponent,
  DiffViewerComponent,
} from '@ngeenx/nx-angular-code-viewer';
import { LucideDownload, LucideDynamicIcon } from '@lucide/angular';
import { ExportModalComponent } from './export-modal.component';

interface ColorVar {
  key: 'color';
  name: string;
  label: string;
  defaultLight: string;
  defaultDark: string;
}

interface RangeVar {
  key: 'range';
  name: string;
  label: string;
  default: number;
  min: number;
  max: number;
  step: number;
  unit: string;
}

type ThemeVar = ColorVar | RangeVar;

interface VarGroup {
  id: string;
  label: string;
  vars: ThemeVar[];
}

const GROUPS: VarGroup[] = [
  {
    id: 'surfaces',
    label: 'Surfaces',
    vars: [
  {
    key: 'color',
    name: '--nx-light-bg',
    label: 'Background',
    defaultLight: '#ffffff',
    defaultDark: '#171717',
  },
  {
    key: 'color',
    name: '--nx-light-bg-secondary',
    label: 'Background secondary',
    defaultLight: '#f5f5f5',
    defaultDark: '#262626',
  },
  {
    key: 'color',
    name: '--nx-light-border-color',
    label: 'Border',
    defaultLight: '#d4d4d4',
    defaultDark: '#404040',
  },
    ],
  },
  {
    id: 'header',
    label: 'Header',
    vars: [
  {
    key: 'color',
    name: '--nx-light-header-bg',
    label: 'Header background',
    defaultLight: '#f5f5f5',
    defaultDark: '#262626',
  },
  {
    key: 'color',
    name: '--nx-light-header-text',
    label: 'Header text',
    defaultLight: '#404040',
    defaultDark: '#d4d4d4',
  },
  {
    key: 'color',
    name: '--nx-light-header-border',
    label: 'Header border',
    defaultLight: '#e5e5e5',
    defaultDark: '#404040',
  },
    ],
  },
  {
    id: 'code',
    label: 'Code & diff',
    vars: [
  {
    key: 'color',
    name: '--nx-light-line-number-bg',
    label: 'Line number background',
    defaultLight: '#ffffff',
    defaultDark: '#171717',
  },
  {
    key: 'color',
    name: '--nx-light-diff-added-border',
    label: 'Diff added border',
    defaultLight: '#16a34a',
    defaultDark: '#22c55e',
  },
  {
    key: 'color',
    name: '--nx-light-diff-removed-border',
    label: 'Diff removed border',
    defaultLight: '#dc2626',
    defaultDark: '#ef4444',
  },
    ],
  },
  {
    id: 'shape',
    label: 'Shape & borders',
    vars: [
  {
    key: 'range',
    name: '--nx-border-inset',
    label: 'Border inset',
    default: 0,
    min: 0,
    max: 1,
    step: 0.05,
    unit: 'rem',
  },
  {
    key: 'range',
    name: '--nx-corner-cross-size',
    label: 'Corner cross size',
    default: 0.8,
    min: 0,
    max: 2,
    step: 0.1,
    unit: 'rem',
  },
  {
    key: 'range',
    name: '--nx-corner-cross-offset',
    label: 'Corner cross offset',
    default: 0.8,
    min: 0,
    max: 2,
    step: 0.1,
    unit: 'rem',
  },
  {
    key: 'range',
    name: '--nx-extended-border-length',
    label: 'Extended border length',
    default: 1,
    min: 0,
    max: 3,
    step: 0.1,
    unit: 'rem',
  },
    ],
  },
  {
    id: 'motion',
    label: 'Motion & scrollbar',
    vars: [
  {
    key: 'range',
    name: '--nx-transition-duration',
    label: 'Transition duration',
    default: 0.15,
    min: 0,
    max: 1,
    step: 0.05,
    unit: 's',
  },
  {
    key: 'range',
    name: '--nx-scrollbar-thumb-size',
    label: 'Scrollbar thumb size',
    default: 4,
    min: 1,
    max: 14,
    step: 1,
    unit: 'px',
  },
  {
    key: 'range',
    name: '--nx-widget-padding',
    label: 'Widget padding',
    default: 4,
    min: 0,
    max: 16,
    step: 1,
    unit: 'px',
  },
    ],
  },
];

const VARS: ThemeVar[] = GROUPS.flatMap(g => g.vars);

const SAMPLE_CODE = `import { Component, signal } from '@angular/core';

@Component({
  selector: 'app-counter',
  template: \`
    <button (click)="increment()">
      Count: {{ count() }}
    </button>
  \`,
})
export class CounterComponent {
  protected readonly count = signal(0);

  protected increment(): void {
    this.count.update(n => n + 1);
  }
}
`;

const SAMPLE_OLD = `function greet(name) {
  console.log('Hello, ' + name);
}

greet('World');
`;

const SAMPLE_NEW = `function greet(name: string): void {
  console.log(\`Hello, \${name}!\`);
}

greet('World');
greet('Crylith');
`;

@Component({
  selector: 'app-theme-builder-page',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    FormsModule,
    LucideDynamicIcon,
    CodeViewerComponent,
    DiffViewerComponent,
    ExportModalComponent,
  ],
  templateUrl: './theme-builder-page.component.html',
  styleUrl: './theme-builder-page.component.css',
})
export class ThemeBuilderPageComponent {
  private readonly document = inject(DOCUMENT);
  private readonly destroyRef = inject(DestroyRef);

  protected readonly vars = VARS;
  protected readonly groups = GROUPS;
  protected readonly downloadIcon = LucideDownload;

  protected readonly mode = signal<'light' | 'dark'>(
    this.document.documentElement.classList.contains('dark') ? 'dark' : 'light'
  );

  protected readonly colors = signal<{
    light: Record<string, string>;
    dark: Record<string, string>;
  }>(this.computeColorDefaults());

  protected readonly ranges = signal<Record<string, number>>(
    this.computeRangeDefaults()
  );

  protected readonly previewTheme = signal<'light' | 'dark'>(this.mode());

  protected readonly exportOpen = signal(false);

  protected readonly exportSnippet = computed(() => {
    const colors = this.colors();
    const ranges = this.ranges();
    const lines: string[] = [':root {'];

    lines.push('  /* Shape & motion */');
    for (const v of VARS) {
      if (v.key !== 'range') continue;
      const raw = ranges[v.name];
      if (raw === undefined) continue;
      lines.push(`  ${v.name}: ${raw}${v.unit};`);
    }

    lines.push('');
    lines.push('  /* Light theme */');
    for (const v of VARS) {
      if (v.key !== 'color') continue;
      const raw = colors.light[v.name];
      if (!raw) continue;
      lines.push(`  ${v.name}: ${raw};`);
    }

    lines.push('');
    lines.push('  /* Dark theme */');
    for (const v of VARS) {
      if (v.key !== 'color') continue;
      const darkName = v.name.replace('--nx-light-', '--nx-dark-');
      const raw = colors.dark[v.name];
      if (!raw) continue;
      lines.push(`  ${darkName}: ${raw};`);
    }

    lines.push('}');
    return lines.join('\n');
  });

  protected readonly sampleCode = SAMPLE_CODE;
  protected readonly sampleOld = SAMPLE_OLD;
  protected readonly sampleNew = SAMPLE_NEW;

  constructor() {
    const observer = new MutationObserver(() => {
      const m = this.document.documentElement.classList.contains('dark')
        ? 'dark'
        : 'light';
      this.mode.set(m);
      this.previewTheme.set(m);
    });
    observer.observe(this.document.documentElement, {
      attributes: true,
      attributeFilter: ['class'],
    });
    this.destroyRef.onDestroy(() => {
      observer.disconnect();
      this.clearVars();
    });

    effect(() => {
      const colors = this.colors();
      const ranges = this.ranges();
      const mode = this.mode();
      const root = this.document.documentElement;
      for (const v of VARS) {
        if (v.key === 'color') {
          const cssName = this.resolveColorVar(v, mode);
          const raw = colors[mode][v.name];
          if (!raw) {
            root.style.removeProperty(cssName);
            continue;
          }
          root.style.setProperty(cssName, raw);
        } else {
          const raw = ranges[v.name];
          if (raw === undefined) {
            root.style.removeProperty(v.name);
            continue;
          }
          root.style.setProperty(v.name, `${raw}${v.unit}`);
        }
      }
    });
  }

  protected onColorChange(name: string, event: Event): void {
    const target = event.target as HTMLInputElement;
    const mode = this.mode();
    this.colors.update(c => ({
      ...c,
      [mode]: { ...c[mode], [name]: target.value },
    }));
  }

  protected onRangeChange(name: string, event: Event): void {
    const target = event.target as HTMLInputElement;
    this.ranges.update(r => ({ ...r, [name]: Number(target.value) }));
  }

  protected reset(): void {
    this.colors.set(this.computeColorDefaults());
    this.ranges.set(this.computeRangeDefaults());
  }

  protected openExport(): void {
    this.exportOpen.set(true);
  }

  protected closeExport(): void {
    this.exportOpen.set(false);
  }

  protected isColor(v: ThemeVar): v is ColorVar {
    return v.key === 'color';
  }

  protected isRange(v: ThemeVar): v is RangeVar {
    return v.key === 'range';
  }

  protected colorValue(v: ColorVar): string {
    return this.colors()[this.mode()][v.name] ?? '';
  }

  protected rangeValue(v: RangeVar): number {
    return this.ranges()[v.name] ?? v.default;
  }

  protected rangeProgress(v: RangeVar): string {
    const value = this.rangeValue(v);
    const pct = ((value - v.min) / (v.max - v.min)) * 100;
    return `${Math.max(0, Math.min(100, pct))}%`;
  }

  private computeColorDefaults(): {
    light: Record<string, string>;
    dark: Record<string, string>;
  } {
    const light: Record<string, string> = {};
    const dark: Record<string, string> = {};
    for (const v of VARS) {
      if (v.key !== 'color') continue;
      light[v.name] = v.defaultLight;
      dark[v.name] = v.defaultDark;
    }
    return { light, dark };
  }

  private computeRangeDefaults(): Record<string, number> {
    const out: Record<string, number> = {};
    for (const v of VARS) {
      if (v.key !== 'range') continue;
      out[v.name] = v.default;
    }
    return out;
  }

  private resolveColorVar(v: ColorVar, mode: 'light' | 'dark'): string {
    return mode === 'dark'
      ? v.name.replace('--nx-light-', '--nx-dark-')
      : v.name;
  }

  private clearVars(): void {
    const root = this.document.documentElement;
    for (const v of VARS) {
      if (v.key === 'color') {
        root.style.removeProperty(v.name);
        root.style.removeProperty(v.name.replace('--nx-light-', '--nx-dark-'));
      } else {
        root.style.removeProperty(v.name);
      }
    }
  }
}
