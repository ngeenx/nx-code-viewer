<script lang="ts">
  import { DiffViewer } from '@ngeenx/nx-svelte-code-viewer';
  import type { CodeViewerLanguage, DiffViewMode, DiffCollapsedLinesInput } from '@ngeenx/nx-code-viewer-utils';
  import { useTheme } from '../stores/theme.svelte';

  const { theme, getResolvedShikiTheme } = useTheme();

  let diffViewMode = $state<DiffViewMode>('unified');

  const diffExamples: {
    title: string;
    oldCode: string;
    newCode: string;
    language: CodeViewerLanguage;
    fileExtension: string;
    oldFileName: string;
    newFileName: string;
    showLineNumbers: boolean;
  }[] = [
    {
      title: 'TypeScript',
      language: 'typescript',
      fileExtension: '.ts',
      oldFileName: 'user.ts',
      newFileName: 'user.ts',
      showLineNumbers: true,
      oldCode: `interface User {
  id: number;
  name: string;
}

function getUser(id: number): User {
  return { id, name: 'John' };
}`,
      newCode: `interface User {
  id: number;
  name: string;
  email: string;
  createdAt: Date;
}

function getUser(id: number): User | null {
  if (id <= 0) return null;
  return {
    id,
    name: 'John',
    email: 'john@example.com',
    createdAt: new Date()
  };
}`,
    },
    {
      title: 'HTML',
      language: 'html',
      fileExtension: '.html',
      oldFileName: 'index.html',
      newFileName: 'index.html',
      showLineNumbers: true,
      oldCode: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>My App</title>
</head>
<body>
  <header>
    <h1>Welcome</h1>
  </header>
  <main>
    <p>Hello, World!</p>
  </main>
</body>
</html>`,
      newCode: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>My App - Enhanced</title>
  <link rel="stylesheet" href="styles.css">
</head>
<body>
  <header class="site-header">
    <nav>
      <a href="/">Home</a>
      <a href="/about">About</a>
    </nav>
    <h1>Welcome</h1>
  </header>
  <main class="content">
    <section>
      <p>Hello, World!</p>
      <button id="cta">Get Started</button>
    </section>
  </main>
  <footer>
    <p>&copy; 2024 My App</p>
  </footer>
</body>
</html>`,
    },
    {
      title: 'Plaintext',
      language: 'plaintext',
      fileExtension: '.txt',
      oldFileName: 'notes.txt',
      newFileName: 'notes.txt',
      showLineNumbers: false,
      oldCode: `Project Notes
=============

Current Status:
- Basic implementation complete
- Testing in progress

TODO:
- Fix bug in login module
- Update documentation

Team Members:
- Alice (Lead)
- Bob (Developer)`,
      newCode: `Project Notes
=============

Current Status:
- Basic implementation complete
- Testing completed successfully
- Ready for code review

TODO:
- Update documentation
- Prepare release notes
- Schedule deployment

Team Members:
- Alice (Lead)
- Bob (Developer)
- Charlie (QA)`,
    },
  ];

  const diffCollapsedLinesExample = {
    language: 'typescript' as CodeViewerLanguage,
    collapsedLines: [
      { startIndex: 2, endIndex: 5 },
      { startIndex: 10, endIndex: 13 },
    ] as DiffCollapsedLinesInput,
    oldCode: `import { Component } from '@angular/core';

/**
 * UserComponent displays user information.
 * This is a multi-line comment block.
 */
@Component({
  selector: 'app-user',
  template: '<div>{{ name }}</div>',
})
export class UserComponent {
  name = 'John Doe';
  email = 'john@example.com';
}`,
    newCode: `import { Component, signal } from '@angular/core';

/**
 * UserComponent displays user information.
 * This is a multi-line comment block.
 * Updated with signals support.
 */
@Component({
  selector: 'app-user',
  template: '<div>{{ name() }}</div>',
})
export class UserComponent {
  readonly name = signal('John Doe');
  readonly email = signal('john@example.com');
  readonly isActive = signal(true);
}`,
  };
</script>

<div class="page-container {theme}">
  <div class="page-header">
    <h1 class="page-title">Diff Viewer</h1>
    <p class="page-description">
      Compare code changes with unified or split diff views.
    </p>
  </div>

  <section class="demo-section">
    <h2 class="demo-section-title">View Mode</h2>
    <p class="demo-section-description">Toggle between unified and split view modes.</p>
    <div class="demo-controls">
      <button
        class="demo-toggle-btn"
        class:active={diffViewMode === 'unified'}
        onclick={() => diffViewMode = 'unified'}
      >Unified</button>
      <button
        class="demo-toggle-btn"
        class:active={diffViewMode === 'split'}
        onclick={() => diffViewMode = 'split'}
      >Split</button>
    </div>
  </section>

  {#each diffExamples as example}
    <section class="demo-section">
      <h2 class="demo-section-title">{example.title}</h2>
      <DiffViewer
        oldCode={example.oldCode}
        newCode={example.newCode}
        language={example.language}
        {theme}
        shikiTheme={getResolvedShikiTheme()}
        viewMode={diffViewMode}
        showLineNumbers={example.showLineNumbers}
        showHeader={true}
        oldFileName={example.oldFileName}
        newFileName={example.newFileName}
        fileExtension={example.fileExtension}
      />
    </section>
  {/each}

  <section class="demo-section">
    <h2 class="demo-section-title">Collapsed Lines in Diff</h2>
    <p class="demo-section-description">
      Collapse unchanged regions in diffs to focus on the changes.
    </p>
    <DiffViewer
      oldCode={diffCollapsedLinesExample.oldCode}
      newCode={diffCollapsedLinesExample.newCode}
      language={diffCollapsedLinesExample.language}
      {theme}
      shikiTheme={getResolvedShikiTheme()}
      collapsedLines={diffCollapsedLinesExample.collapsedLines}
      showLineNumbers={true}
      showHeader={false}
      viewMode="unified"
    />
  </section>
</div>
