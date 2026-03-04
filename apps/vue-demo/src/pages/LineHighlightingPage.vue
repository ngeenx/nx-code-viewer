<template>
  <div class="page-container" :class="theme">
    <div class="page-header">
      <h1 class="page-title">Line Highlighting</h1>
      <p class="page-description">
        Highlight, focus, and collapse specific lines to draw attention to important code.
      </p>
    </div>

    <div class="demo-section">
      <h2 class="demo-section-title">Highlighted Lines</h2>
      <p class="demo-section-description">
        Highlight specific lines or ranges. Lines 3, 7-9, and 12 are highlighted.
      </p>
      <CodeViewer
        :code="highlightedLinesExample.code"
        :language="highlightedLinesExample.language"
        :theme="theme"
        :shikiTheme="getResolvedShikiTheme()"
        :highlightedLines="highlightedLinesExample.highlightedLines"
        :showLineNumbers="true"
        :showHeader="false"
      />
    </div>

    <div class="demo-section">
      <h2 class="demo-section-title">Focused Lines</h2>
      <p class="demo-section-description">
        Focus on specific lines, dimming the rest. Lines 3-6 and 12 are focused.
      </p>
      <CodeViewer
        :code="focusedLinesExample.code"
        :language="focusedLinesExample.language"
        :theme="theme"
        :shikiTheme="getResolvedShikiTheme()"
        :focusedLines="focusedLinesExample.focusedLines"
        :showLineNumbers="true"
        :showHeader="false"
      />
    </div>

    <div class="demo-section">
      <h2 class="demo-section-title">Focused + Highlighted</h2>
      <p class="demo-section-description">
        Combine focus and highlight for precise code annotation.
      </p>
      <CodeViewer
        :code="focusedAndHighlightedExample.code"
        :language="focusedAndHighlightedExample.language"
        :theme="theme"
        :shikiTheme="getResolvedShikiTheme()"
        :focusedLines="focusedAndHighlightedExample.focusedLines"
        :highlightedLines="focusedAndHighlightedExample.highlightedLines"
        :showLineNumbers="true"
        :showHeader="false"
      />
    </div>

    <div class="demo-section">
      <h2 class="demo-section-title">Collapsed Lines</h2>
      <p class="demo-section-description">
        Collapse line ranges to hide implementation details. Lines 4-8 and 15-20 are collapsed.
      </p>
      <CodeViewer
        :code="collapsedLinesExample.code"
        :language="collapsedLinesExample.language"
        :theme="theme"
        :shikiTheme="getResolvedShikiTheme()"
        :collapsedLines="collapsedLinesExample.collapsedLines"
        :showLineNumbers="true"
        :showHeader="false"
      />
    </div>

    <div class="demo-section">
      <h2 class="demo-section-title">Collapsed + Highlighted</h2>
      <p class="demo-section-description">
        Combine collapsed and highlighted lines for complex annotations.
      </p>
      <CodeViewer
        :code="collapsedWithHighlightsExample.code"
        :language="collapsedWithHighlightsExample.language"
        :theme="theme"
        :shikiTheme="getResolvedShikiTheme()"
        :collapsedLines="collapsedWithHighlightsExample.collapsedLines"
        :highlightedLines="collapsedWithHighlightsExample.highlightedLines"
        :showLineNumbers="true"
        :showHeader="false"
      />
    </div>
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
  standalone: true,
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
  standalone: true,
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
