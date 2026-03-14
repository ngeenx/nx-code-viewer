<template>
  <div class="page-container" :class="theme">
    <header class="page-header">
      <h1 class="page-title">Line Highlighting</h1>
      <p class="page-description">
        Draw attention to specific lines of code using highlighting, focus, and collapse features.
      </p>
    </header>

    <section class="demo-section">
      <h2 class="demo-section-title">Highlighted Lines</h2>
      <p class="demo-section-description">
        Lines 3, 7-9, and 12 are pre-configured to be highlighted with a background color.
      </p>
      <CodeViewer
        :code="highlightedLinesExample.code"
        :language="highlightedLinesExample.language"
        :theme="theme"
        :shikiTheme="getResolvedShikiTheme()"
        title="Highlighted Lines Demo"
        fileExtension=".ts"
        :highlightedLines="highlightedLinesExample.highlightedLines"
      />
    </section>

    <section class="demo-section">
      <h2 class="demo-section-title">Focused Lines</h2>
      <p class="demo-section-description">
        Lines 3-6 and 12 are focused. All other lines are blurred to draw attention to the focused area.
      </p>
      <CodeViewer
        :code="focusedLinesExample.code"
        :language="focusedLinesExample.language"
        :theme="theme"
        :shikiTheme="getResolvedShikiTheme()"
        title="Focused Lines Demo"
        fileExtension=".ts"
        :focusedLines="focusedLinesExample.focusedLines"
      />
    </section>

    <section class="demo-section">
      <h2 class="demo-section-title">Focused and Highlighted Lines Combined</h2>
      <p class="demo-section-description">
        Lines 3-13 are focused (rest blurred). Lines 4, 5, and 11 are highlighted within the focused area.
      </p>
      <CodeViewer
        :code="focusedAndHighlightedExample.code"
        :language="focusedAndHighlightedExample.language"
        :theme="theme"
        :shikiTheme="getResolvedShikiTheme()"
        title="Combined Demo"
        fileExtension=".ts"
        :focusedLines="focusedAndHighlightedExample.focusedLines"
        :highlightedLines="focusedAndHighlightedExample.highlightedLines"
      />
    </section>

    <section class="demo-section">
      <h2 class="demo-section-title">Collapsed Lines</h2>
      <p class="demo-section-description">
        Lines 4-8 and 15-20 are collapsed. Click the expand icon in the line number column or the "... N lines" indicator to expand.
      </p>
      <CodeViewer
        :code="collapsedLinesExample.code"
        :language="collapsedLinesExample.language"
        :theme="theme"
        :shikiTheme="getResolvedShikiTheme()"
        title="Collapsed Lines Demo"
        fileExtension=".ts"
        :collapsedLines="collapsedLinesExample.collapsedLines"
      />
    </section>

    <section class="demo-section">
      <h2 class="demo-section-title">Collapsed Lines with Highlights</h2>
      <p class="demo-section-description">
        Lines 4-8 are collapsed. Lines 10, 11, 22, and 23 are highlighted. Collapsed lines can be combined with other line features.
      </p>
      <CodeViewer
        :code="collapsedWithHighlightsExample.code"
        :language="collapsedWithHighlightsExample.language"
        :theme="theme"
        :shikiTheme="getResolvedShikiTheme()"
        title="Collapsed with Highlights"
        fileExtension=".ts"
        :collapsedLines="collapsedWithHighlightsExample.collapsedLines"
        :highlightedLines="collapsedWithHighlightsExample.highlightedLines"
      />
    </section>
  </div>
</template>

<script setup lang="ts">
import { CodeViewer } from '@ngeenx/nx-vue-code-viewer';
import type { CodeViewerLanguage, HighlightedLinesInput, FocusedLinesInput, CollapsedLinesInput } from '@ngeenx/nx-vue-code-viewer';
import { useTheme } from '../composables/useTheme';

const { theme, getResolvedShikiTheme } = useTheme();

const highlightedLinesExample: {
  code: string;
  language: CodeViewerLanguage;
  highlightedLines: HighlightedLinesInput;
} = {
  language: 'typescript',
  highlightedLines: [3, [7, 9], 12],
  code: `import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  template: '<h1>Hello World</h1>',
})
export class AppComponent {
  title = 'my-app';
  count = 0;

  increment() {
    this.count++;
  }
}`,
};

const focusedLinesExample: {
  code: string;
  language: CodeViewerLanguage;
  focusedLines: FocusedLinesInput;
} = {
  language: 'typescript',
  focusedLines: [[3, 6], 12],
  code: `import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  template: '<h1>Hello World</h1>',
})
export class AppComponent {
  title = 'my-app';
  count = 0;

  increment() {
    this.count++;
  }
}`,
};

const focusedAndHighlightedExample: {
  code: string;
  language: CodeViewerLanguage;
  focusedLines: FocusedLinesInput;
  highlightedLines: HighlightedLinesInput;
} = {
  language: 'typescript',
  focusedLines: [[3, 13]],
  highlightedLines: [4, 5, 11],
  code: `import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  template: '<h1>Hello World</h1>',
})
export class AppComponent {
  title = 'my-app';
  count = 0;

  increment() {
    this.count++;
  }
}`,
};

const collapsedLinesExample: {
  code: string;
  language: CodeViewerLanguage;
  collapsedLines: CollapsedLinesInput;
} = {
  language: 'typescript',
  collapsedLines: [
    [4, 8],
    [15, 20],
  ],
  code: `import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

/**
 * ExampleComponent demonstrates the collapsed lines feature.
 * This comment block is initially collapsed.
 * Click the expand icon to reveal it.
 */
@Component({
  selector: 'app-example',
  template: '<h1>{{ title() }}</h1>',
  imports: [CommonModule],
})
export class ExampleComponent {
  /**
   * The title signal holds the display text.
   * This is another collapsed block.
   * Expand to see the full documentation.
   */
  readonly title = signal('Hello, World!');
  readonly count = signal(0);

  increment(): void {
    this.count.update(n => n + 1);
  }
}`,
};

const collapsedWithHighlightsExample: {
  code: string;
  language: CodeViewerLanguage;
  collapsedLines: CollapsedLinesInput;
  highlightedLines: HighlightedLinesInput;
} = {
  language: 'typescript',
  collapsedLines: [[4, 8]],
  highlightedLines: [10, 11, 22, 23],
  code: `import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

/**
 * ExampleComponent demonstrates the collapsed lines feature.
 * This comment block is initially collapsed.
 * Click the expand icon to reveal it.
 */
@Component({
  selector: 'app-example',
  template: '<h1>{{ title() }}</h1>',
  imports: [CommonModule],
})
export class ExampleComponent {
  readonly title = signal('Hello, World!');
  readonly count = signal(0);

  increment(): void {
    this.count.update(n => n + 1);
  }

  decrement(): void {
    this.count.update(n => n - 1);
  }
}`,
};
</script>
