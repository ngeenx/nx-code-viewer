import { Component, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CodeViewerComponent } from '@ngeenx/nx-angular-code-viewer';
import { ThemeService } from '../../services/theme.service';
import {
  LucideAngularModule,
  LucideIconData,
  BookOpen,
  Palette,
  Zap,
  GitCompare,
  Layers,
  Play,
  ArrowRight,
  Code2,
  Sparkles,
  ChevronRight,
} from 'lucide-angular';

interface Feature {
  icon: LucideIconData;
  title: string;
  description: string;
  route: string;
  gradient: string;
}

@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [RouterLink, CodeViewerComponent, LucideAngularModule],
  templateUrl: './landing.page.html',
  styleUrls: ['./landing.page.css'],
})
export class LandingPage {
  protected readonly themeService = inject(ThemeService);
  protected readonly theme = this.themeService.theme;
  protected readonly shikiTheme =
    this.themeService.getResolvedShikiTheme.bind(this.themeService);

  protected readonly icons = {
    ArrowRight,
    Code2,
    Sparkles,
    ChevronRight,
  };

  protected readonly features: Feature[] = [
    {
      icon: BookOpen,
      title: 'Syntax Highlighting',
      description:
        'Beautiful code rendering with 30+ Shiki themes and 100+ language support.',
      route: '/basic-examples',
      gradient: 'from-blue-500 to-cyan-500',
    },
    {
      icon: Palette,
      title: 'Custom Theming',
      description:
        'Create unique themes with CSS variables. Cyberpunk, minimal, GitHub-inspired and more.',
      route: '/theming',
      gradient: 'from-purple-500 to-pink-500',
    },
    {
      icon: Zap,
      title: 'Interactive Features',
      description:
        'Line widgets, reference links, popovers, and custom annotations for rich code documentation.',
      route: '/interactive-features',
      gradient: 'from-amber-500 to-orange-500',
    },
    {
      icon: GitCompare,
      title: 'Diff Viewer',
      description:
        'Side-by-side and unified diff views with syntax highlighting and line-level changes.',
      route: '/diff-viewer',
      gradient: 'from-green-500 to-emerald-500',
    },
    {
      icon: Layers,
      title: 'Multi-Code Viewer',
      description:
        'Tabbed interface for displaying multiple files, code snippets, and diff comparisons.',
      route: '/multi-code-viewer',
      gradient: 'from-rose-500 to-red-500',
    },
    {
      icon: Play,
      title: 'Playground',
      description:
        'Interactive configuration editor to experiment with all features in real-time.',
      route: '/playground',
      gradient: 'from-indigo-500 to-violet-500',
    },
  ];

  protected readonly codeExamples = [
    {
      label: 'Code Viewer',
      language: 'typescript' as const,
      code: `import { CodeViewerComponent } from '@ngeenx/nx-angular-code-viewer';

@Component({
  selector: 'app-demo',
  imports: [CodeViewerComponent],
  template: \`
    <nx-code-viewer
      [code]="code"
      language="typescript"
      [showLineNumbers]="true"
      [showHeader]="true"
    />
  \`
})
export class DemoComponent {
  code = 'console.log("Hello, World!");';
}`,
    },
    {
      label: 'Diff Viewer',
      language: 'html' as const,
      code: `<!-- Compare code changes side-by-side -->
<nx-diff-viewer
  [originalCode]="oldCode"
  [modifiedCode]="newCode"
  language="typescript"
  viewMode="split"
  [highlightChanges]="true"
/>`,
    },
    {
      label: 'Multi-Code',
      language: 'html' as const,
      code: `<!-- Tabbed interface for multiple files -->
<nx-multi-code-viewer [tabs]="tabs">
  <ng-template #tabContent let-tab>
    <nx-code-viewer
      [code]="tab.code"
      [language]="tab.language"
    />
  </ng-template>
</nx-multi-code-viewer>`,
    },
  ];

  protected activeCodeIndex = signal(0);

  protected selectCodeExample(index: number): void {
    this.activeCodeIndex.set(index);
  }
}
