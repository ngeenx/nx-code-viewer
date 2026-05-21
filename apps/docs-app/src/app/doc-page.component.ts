import { Component, computed, signal, inject, effect } from '@angular/core';
import { CommonModule, DOCUMENT } from '@angular/common';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { parseMarkdown, RootNode } from '@crylith/markdown';
import { MarkdownContentComponent } from '@crylith/ui-angular';
import { ShellService } from '@crylith/shell-angular';
import { $tocItems, scrollToAnchor } from '@crylith/shell-core';

import contentConfig from '../../crylith.config';
import { findEntryByUrl } from './content-index.generated';
import { HeadingsService } from './services/headings.service';

const DEFAULT_VERSION = contentConfig.versions?.current ?? 'v1';

@Component({
  selector: 'app-doc-page',
  imports: [CommonModule, MarkdownContentComponent],
  template: `
    <article class="doc-page">
      @if (loading()) {
        <p>Loading...</p>
      } @else if (currentDoc().ast) {
        <crylith-markdown-content
          [ast]="currentDoc().ast!"
          [sidebarSelectValues]="shell.sidebarSelectValues()"
          [useLiveDemos]="true" />
      } @else {
        <h1>Page Not Found</h1>
        <p>
          The requested documentation page could not be found in version
          <code>{{ shell.currentVersion() ?? '(unknown)' }}</code>.
        </p>
      }
    </article>
  `,
  styles: [
    `
      .doc-page {
        max-width: 800px;
      }
      .doc-page h1 {
        margin-top: 0;
        margin-bottom: var(--crylith-spacing-6);
      }
    `,
  ],
})
export class DocPageComponent {
  private readonly router = inject(Router);
  private readonly headingsService = inject(HeadingsService);
  private readonly document = inject(DOCUMENT);
  readonly shell = inject(ShellService);

  readonly loading = signal(true);
  readonly markdownContent = signal<string | null>(null);

  readonly currentDoc = computed(() => {
    const markdown = this.markdownContent();
    if (!markdown) {
      return {
        title: 'Page Not Found',
        ast: null as RootNode | null,
        headings: [],
      };
    }
    const result = parseMarkdown(markdown);
    return {
      title: (result.frontmatter['title'] as string) || 'Untitled',
      ast: result.ast as RootNode | null,
      headings: result.headings.map(h => ({
        id: h.id || '',
        text: h.text || '',
        depth: h.depth,
      })),
    };
  });

  constructor() {
    this.loadContent(this.router.url);

    this.router.events
      .pipe(filter((e): e is NavigationEnd => e instanceof NavigationEnd))
      .subscribe(e => this.loadContent(e.urlAfterRedirects));

    effect(() => {
      const doc = this.currentDoc();
      this.headingsService.setHeadings(doc.headings);
      $tocItems.set(doc.headings);
    });

    effect(() => {
      const doc = this.currentDoc();
      if (!doc.ast) return;
      const hash = this.router.url.split('#')[1];
      if (!hash) return;
      setTimeout(() => {
        const scrollOffset = this.shell.activeLayout().toc.scrollOffset;
        scrollToAnchor(hash, scrollOffset, 10, 'smooth', this.document);
      }, 50);
    });
  }

  private loadContent(url: string): void {
    this.loading.set(true);
    const activeVersion = this.shell.currentVersion() ?? DEFAULT_VERSION;
    const entry = findEntryByUrl(url, activeVersion);
    this.markdownContent.set(
      entry ? serializeEntry(entry.frontmatter, entry.body) : null
    );
    this.loading.set(false);
  }
}

function serializeEntry(
  frontmatter: Record<string, unknown>,
  body: string
): string {
  const keys = Object.keys(frontmatter);
  if (keys.length === 0) return body;
  const lines = keys.map(k => `${k}: ${yamlPrimitive(frontmatter[k])}`);
  return ['---', ...lines, '---', '', body].join('\n');
}

function yamlPrimitive(value: unknown): string {
  if (value === null || value === undefined) return '';
  if (typeof value === 'string') return JSON.stringify(value);
  if (typeof value === 'number' || typeof value === 'boolean') return String(value);
  return JSON.stringify(value);
}
