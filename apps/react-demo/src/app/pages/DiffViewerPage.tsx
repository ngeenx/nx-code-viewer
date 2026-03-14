import { useState } from 'react';
import { DiffViewer, type DiffViewMode, type CodeViewerBorderStyle, type CodeViewerLanguage, type DiffCollapsedLinesInput } from '@ngeenx/nx-react-code-viewer';
import { useTheme } from '../hooks/useTheme';

const borderStyles: CodeViewerBorderStyle[] = ['classic', 'grid-cross', 'corner-intersection', 'none'];

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

const diffCollapsedLinesExample: {
  oldCode: string;
  newCode: string;
  language: CodeViewerLanguage;
  collapsedLines: DiffCollapsedLinesInput;
} = {
  language: 'typescript',
  collapsedLines: [
    { startIndex: 2, endIndex: 5 },
    { startIndex: 10, endIndex: 13 },
  ],
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

export default function DiffViewerPage() {
  const { theme, getResolvedShikiTheme } = useTheme();
  const [diffViewMode, setDiffViewMode] = useState<DiffViewMode>('unified');

  const toggleDiffViewMode = () => {
    setDiffViewMode((current) => (current === 'unified' ? 'split' : 'unified'));
  };

  return (
    <div className={`page-container ${theme}`}>
      <header className="page-header">
        <h1 className="page-title">Diff Viewer</h1>
        <p className="page-description">
          Compare code changes with the diff viewer. Supports unified and split view modes,
          different languages, and collapsible sections.
        </p>
      </header>

      <section className="demo-section">
        <h2 className="demo-section-title">Basic Diff Examples</h2>
        <div className="demo-controls">
          <button className="demo-toggle-btn" onClick={toggleDiffViewMode}>
            {diffViewMode === 'unified' ? 'Switch to Split View' : 'Switch to Unified View'}
          </button>
        </div>
        {diffExamples.map((diffExample) => (
          <div key={diffExample.title} className="demo-item">
            <h3 className="demo-item-title">{diffExample.title}</h3>
            <DiffViewer
              oldCode={diffExample.oldCode}
              newCode={diffExample.newCode}
              theme={theme}
              shikiTheme={getResolvedShikiTheme()}
              viewMode={diffViewMode}
              showLineNumbers={diffExample.showLineNumbers}
              showHeader={true}
              language={diffExample.language}
              fileExtension={diffExample.fileExtension}
              oldFileName={diffExample.oldFileName}
              newFileName={diffExample.newFileName}
            />
          </div>
        ))}
      </section>

      <section className="demo-section">
        <h2 className="demo-section-title">Diff with Collapsed Lines</h2>
        <p className="demo-section-description">
          Lines 2-5 and 10-13 (0-based global indices) are collapsed. Click to expand and see the hidden diff lines.
        </p>
        <div className="demo-controls">
          <button className="demo-toggle-btn" onClick={toggleDiffViewMode}>
            {diffViewMode === 'unified' ? 'Switch to Split View' : 'Switch to Unified View'}
          </button>
        </div>
        <DiffViewer
          oldCode={diffCollapsedLinesExample.oldCode}
          newCode={diffCollapsedLinesExample.newCode}
          theme={theme}
          shikiTheme={getResolvedShikiTheme()}
          viewMode={diffViewMode}
          showLineNumbers={true}
          showHeader={true}
          language={diffCollapsedLinesExample.language}
          collapsedLines={diffCollapsedLinesExample.collapsedLines}
          fileExtension=".ts"
          oldFileName="user.component.ts"
          newFileName="user.component.ts"
        />
      </section>

      <section className="demo-section">
        <h2 className="demo-section-title">Diff Viewer Border Styles</h2>
        <p className="demo-section-description">
          Different border style variants for diff viewer.
        </p>
        {borderStyles.map((borderStyle) => (
          <div key={borderStyle} className="demo-item">
            <h3 className="demo-item-subtitle">{borderStyle}</h3>
            <DiffViewer
              oldCode={diffExamples[0].oldCode}
              newCode={diffExamples[0].newCode}
              theme={theme}
              shikiTheme={getResolvedShikiTheme()}
              viewMode="unified"
              showLineNumbers={true}
              showHeader={false}
              language={diffExamples[0].language}
              borderStyle={borderStyle}
            />
          </div>
        ))}
      </section>
    </div>
  );
}
