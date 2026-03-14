import { useState, useMemo } from 'react';
import {
  CodeViewer,
  DiffViewer,
  type CodeViewerLanguage,
  type CodeViewerBorderStyle,
  type CodeViewerTheme,
  type DiffViewMode,
  type ShikiThemeName,
} from '@ngeenx/nx-react-code-viewer';
import { useTheme, type CustomTheme } from '../hooks/useTheme';

interface SelectOption<T> {
  value: T;
  label: string;
}

const languageOptions: SelectOption<CodeViewerLanguage>[] = [
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

const themeOptions: SelectOption<CodeViewerTheme>[] = [
  { value: 'dark', label: 'Dark' },
  { value: 'light', label: 'Light' },
];

const borderStyleOptions: SelectOption<CodeViewerBorderStyle>[] = [
  { value: 'classic', label: 'Classic' },
  { value: 'grid-cross', label: 'Grid Cross' },
  { value: 'corner-intersection', label: 'Corner Intersection' },
  { value: 'none', label: 'None' },
];

const viewModeOptions: SelectOption<DiffViewMode>[] = [
  { value: 'unified', label: 'Unified' },
  { value: 'split', label: 'Split' },
];

function parseLineInput(
  input: string
): number | readonly (number | readonly [number, number])[] | undefined {
  if (!input.trim()) return undefined;

  const parts = input.split(',').map((p) => p.trim());
  const result: (number | readonly [number, number])[] = [];

  for (const part of parts) {
    if (part.includes('-')) {
      const [start, end] = part.split('-').map((n) => parseInt(n.trim(), 10));
      if (!isNaN(start) && !isNaN(end)) {
        result.push([start, end] as const);
      }
    } else {
      const num = parseInt(part, 10);
      if (!isNaN(num)) result.push(num);
    }
  }

  if (result.length === 0) return undefined;
  if (result.length === 1 && typeof result[0] === 'number') return result[0];
  return result;
}

const defaultCode = `import { Component, signal } from '@angular/core';

@Component({
  selector: 'app-counter',
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
}`;

const defaultOldCode = `interface User {
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
console.log(user.name);`;

const defaultNewCode = `interface User {
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
}`;

export default function PlaygroundPage() {
  const { theme: globalTheme, shikiThemeOptions, customThemeOptions } = useTheme();

  const [activeTab, setActiveTab] = useState<'code' | 'diff'>('code');

  // Code config
  const [code, setCode] = useState(defaultCode);
  const [codeLanguage, setCodeLanguage] = useState<CodeViewerLanguage>('typescript');
  const [codeTheme, setCodeTheme] = useState<CodeViewerTheme>('dark');
  const [codeShikiTheme, setCodeShikiTheme] = useState<ShikiThemeName | 'auto'>('auto');
  const [codeCustomTheme, setCodeCustomTheme] = useState<CustomTheme>('default');
  const [codeBorderStyle, setCodeBorderStyle] = useState<CodeViewerBorderStyle>('classic');
  const [showLineNumbers, setShowLineNumbers] = useState(true);
  const [showCopyButton, setShowCopyButton] = useState(true);
  const [showHeader, setShowHeader] = useState(true);
  const [wordWrap, setWordWrap] = useState(false);
  const [title, setTitle] = useState('counter.component.ts');
  const [fileExtension, setFileExtension] = useState('.ts');
  const [maxHeight, setMaxHeight] = useState('');
  const [highlightedLinesInput, setHighlightedLinesInput] = useState('');
  const [focusedLinesInput, setFocusedLinesInput] = useState('');

  // Diff config
  const [oldCode, setOldCode] = useState(defaultOldCode);
  const [newCode, setNewCode] = useState(defaultNewCode);
  const [diffLanguage, setDiffLanguage] = useState<CodeViewerLanguage>('typescript');
  const [diffTheme, setDiffTheme] = useState<CodeViewerTheme>('dark');
  const [diffShikiTheme, setDiffShikiTheme] = useState<ShikiThemeName | 'auto'>('auto');
  const [diffCustomTheme, setDiffCustomTheme] = useState<CustomTheme>('default');
  const [diffBorderStyle, setDiffBorderStyle] = useState<CodeViewerBorderStyle>('classic');
  const [diffViewMode, setDiffViewMode] = useState<DiffViewMode>('unified');
  const [diffShowLineNumbers, setDiffShowLineNumbers] = useState(true);
  const [diffShowHeader, setDiffShowHeader] = useState(true);
  const [oldFileName, setOldFileName] = useState('user.ts');
  const [newFileName, setNewFileName] = useState('user.ts');
  const [diffFileExtension, setDiffFileExtension] = useState('.ts');
  const [diffMaxHeight, setDiffMaxHeight] = useState('');

  const codeCustomThemeClass = codeCustomTheme === 'default' ? '' : `theme-${codeCustomTheme}`;
  const diffCustomThemeClass = diffCustomTheme === 'default' ? '' : `theme-${diffCustomTheme}`;
  const codeResolvedShikiTheme = codeShikiTheme === 'auto' ? undefined : codeShikiTheme;
  const diffResolvedShikiTheme = diffShikiTheme === 'auto' ? undefined : diffShikiTheme;

  const parsedHighlightedLines = useMemo(() => parseLineInput(highlightedLinesInput), [highlightedLinesInput]);
  const parsedFocusedLines = useMemo(() => parseLineInput(focusedLinesInput), [focusedLinesInput]);

  const allCustomThemeOptions = useMemo(
    () => [...customThemeOptions, { value: 'handwritten' as CustomTheme, label: 'Handwritten' }],
    [customThemeOptions]
  );

  return (
    <div className={`page-container playground-container ${globalTheme}`}>
      <header className="page-header">
        <h1 className="page-title">Playground</h1>
        <p className="page-description">
          Design and customize your own code viewer and diff viewer configurations.
          Adjust settings in real-time to see how they affect the output.
        </p>
      </header>

      {/* Tab Navigation */}
      <div className="tab-navigation">
        <button
          className={`tab-button${activeTab === 'code' ? ' active' : ''}`}
          onClick={() => setActiveTab('code')}
        >
          Code Viewer
        </button>
        <button
          className={`tab-button${activeTab === 'diff' ? ' active' : ''}`}
          onClick={() => setActiveTab('diff')}
        >
          Diff Viewer
        </button>
      </div>

      {/* Code Viewer Playground */}
      {activeTab === 'code' && (
        <div className="playground-layout">
          <aside className="config-panel">
            <h3 className="config-title">Configuration</h3>

            <section className="config-section">
              <h4 className="config-section-title">Appearance</h4>
              <div className="config-row">
                <label className="config-label">Theme</label>
                <select className="config-select" value={codeTheme} onChange={(e) => setCodeTheme(e.target.value as CodeViewerTheme)}>
                  {themeOptions.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
                </select>
              </div>
              <div className="config-row">
                <label className="config-label">Shiki Theme</label>
                <select className="config-select" value={codeShikiTheme} onChange={(e) => setCodeShikiTheme(e.target.value as ShikiThemeName | 'auto')}>
                  {shikiThemeOptions.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
                </select>
              </div>
              <div className="config-row">
                <label className="config-label">CSS Theme</label>
                <select className="config-select" value={codeCustomTheme} onChange={(e) => setCodeCustomTheme(e.target.value as CustomTheme)}>
                  {allCustomThemeOptions.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
                </select>
              </div>
              <div className="config-row">
                <label className="config-label">Border Style</label>
                <select className="config-select" value={codeBorderStyle} onChange={(e) => setCodeBorderStyle(e.target.value as CodeViewerBorderStyle)}>
                  {borderStyleOptions.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
                </select>
              </div>
            </section>

            <section className="config-section">
              <h4 className="config-section-title">Display Options</h4>
              <div className="config-row checkbox-row">
                <label className="config-checkbox">
                  <input type="checkbox" checked={showHeader} onChange={(e) => setShowHeader(e.target.checked)} />
                  <span>Show Header</span>
                </label>
              </div>
              <div className="config-row checkbox-row">
                <label className="config-checkbox">
                  <input type="checkbox" checked={showLineNumbers} onChange={(e) => setShowLineNumbers(e.target.checked)} />
                  <span>Show Line Numbers</span>
                </label>
              </div>
              <div className="config-row checkbox-row">
                <label className="config-checkbox">
                  <input type="checkbox" checked={showCopyButton} onChange={(e) => setShowCopyButton(e.target.checked)} />
                  <span>Show Copy Button</span>
                </label>
              </div>
              <div className="config-row checkbox-row">
                <label className="config-checkbox">
                  <input type="checkbox" checked={wordWrap} onChange={(e) => setWordWrap(e.target.checked)} />
                  <span>Word Wrap</span>
                </label>
              </div>
            </section>

            <section className="config-section">
              <h4 className="config-section-title">Header Options</h4>
              <div className="config-row">
                <label className="config-label">Title</label>
                <input type="text" className="config-input" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g., app.component.ts" />
              </div>
              <div className="config-row">
                <label className="config-label">File Extension</label>
                <input type="text" className="config-input" value={fileExtension} onChange={(e) => setFileExtension(e.target.value)} placeholder="e.g., .ts" />
              </div>
            </section>

            <section className="config-section">
              <h4 className="config-section-title">Code Options</h4>
              <div className="config-row">
                <label className="config-label">Language</label>
                <select className="config-select" value={codeLanguage} onChange={(e) => setCodeLanguage(e.target.value as CodeViewerLanguage)}>
                  {languageOptions.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
                </select>
              </div>
              <div className="config-row">
                <label className="config-label">Max Height</label>
                <input type="text" className="config-input" value={maxHeight} onChange={(e) => setMaxHeight(e.target.value)} placeholder="e.g., 400px or empty" />
              </div>
            </section>

            <section className="config-section">
              <h4 className="config-section-title">Line Highlighting</h4>
              <div className="config-row">
                <label className="config-label">Highlighted Lines</label>
                <input type="text" className="config-input" value={highlightedLinesInput} onChange={(e) => setHighlightedLinesInput(e.target.value)} placeholder="e.g., 1, 3-5, 10" />
              </div>
              <div className="config-row">
                <label className="config-label">Focused Lines</label>
                <input type="text" className="config-input" value={focusedLinesInput} onChange={(e) => setFocusedLinesInput(e.target.value)} placeholder="e.g., 5-15" />
              </div>
            </section>

            <section className="config-section">
              <h4 className="config-section-title">Code</h4>
              <textarea className="config-textarea" value={code} onChange={(e) => setCode(e.target.value)} rows={10} placeholder="Enter your code here..." />
            </section>
          </aside>

          <main className="preview-panel">
            <h3 className="preview-title">Preview</h3>
            <div className={`preview-content ${codeCustomThemeClass}`}>
              <CodeViewer
                code={code}
                language={codeLanguage}
                theme={codeTheme}
                shikiTheme={codeResolvedShikiTheme}
                borderStyle={codeBorderStyle}
                showLineNumbers={showLineNumbers}
                showCopyButton={showCopyButton}
                showHeader={showHeader}
                wordWrap={wordWrap}
                title={title}
                fileExtension={fileExtension}
                maxHeight={maxHeight || undefined}
                highlightedLines={parsedHighlightedLines}
                focusedLines={parsedFocusedLines}
                onCodeCopied={() => console.log('Code copied to clipboard')}
              />
            </div>
          </main>
        </div>
      )}

      {/* Diff Viewer Playground */}
      {activeTab === 'diff' && (
        <div className="playground-layout">
          <aside className="config-panel">
            <h3 className="config-title">Configuration</h3>

            <section className="config-section">
              <h4 className="config-section-title">Appearance</h4>
              <div className="config-row">
                <label className="config-label">Theme</label>
                <select className="config-select" value={diffTheme} onChange={(e) => setDiffTheme(e.target.value as CodeViewerTheme)}>
                  {themeOptions.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
                </select>
              </div>
              <div className="config-row">
                <label className="config-label">Shiki Theme</label>
                <select className="config-select" value={diffShikiTheme} onChange={(e) => setDiffShikiTheme(e.target.value as ShikiThemeName | 'auto')}>
                  {shikiThemeOptions.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
                </select>
              </div>
              <div className="config-row">
                <label className="config-label">CSS Theme</label>
                <select className="config-select" value={diffCustomTheme} onChange={(e) => setDiffCustomTheme(e.target.value as CustomTheme)}>
                  {allCustomThemeOptions.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
                </select>
              </div>
              <div className="config-row">
                <label className="config-label">Border Style</label>
                <select className="config-select" value={diffBorderStyle} onChange={(e) => setDiffBorderStyle(e.target.value as CodeViewerBorderStyle)}>
                  {borderStyleOptions.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
                </select>
              </div>
              <div className="config-row">
                <label className="config-label">View Mode</label>
                <select className="config-select" value={diffViewMode} onChange={(e) => setDiffViewMode(e.target.value as DiffViewMode)}>
                  {viewModeOptions.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
                </select>
              </div>
            </section>

            <section className="config-section">
              <h4 className="config-section-title">Display Options</h4>
              <div className="config-row checkbox-row">
                <label className="config-checkbox">
                  <input type="checkbox" checked={diffShowHeader} onChange={(e) => setDiffShowHeader(e.target.checked)} />
                  <span>Show Header</span>
                </label>
              </div>
              <div className="config-row checkbox-row">
                <label className="config-checkbox">
                  <input type="checkbox" checked={diffShowLineNumbers} onChange={(e) => setDiffShowLineNumbers(e.target.checked)} />
                  <span>Show Line Numbers</span>
                </label>
              </div>
            </section>

            <section className="config-section">
              <h4 className="config-section-title">Header Options</h4>
              <div className="config-row">
                <label className="config-label">Old File Name</label>
                <input type="text" className="config-input" value={oldFileName} onChange={(e) => setOldFileName(e.target.value)} placeholder="e.g., user.ts" />
              </div>
              <div className="config-row">
                <label className="config-label">New File Name</label>
                <input type="text" className="config-input" value={newFileName} onChange={(e) => setNewFileName(e.target.value)} placeholder="e.g., user.ts" />
              </div>
              <div className="config-row">
                <label className="config-label">File Extension</label>
                <input type="text" className="config-input" value={diffFileExtension} onChange={(e) => setDiffFileExtension(e.target.value)} placeholder="e.g., .ts" />
              </div>
            </section>

            <section className="config-section">
              <h4 className="config-section-title">Code Options</h4>
              <div className="config-row">
                <label className="config-label">Language</label>
                <select className="config-select" value={diffLanguage} onChange={(e) => setDiffLanguage(e.target.value as CodeViewerLanguage)}>
                  {languageOptions.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
                </select>
              </div>
              <div className="config-row">
                <label className="config-label">Max Height</label>
                <input type="text" className="config-input" value={diffMaxHeight} onChange={(e) => setDiffMaxHeight(e.target.value)} placeholder="e.g., 400px or empty" />
              </div>
            </section>

            <section className="config-section">
              <h4 className="config-section-title">Old Code</h4>
              <textarea className="config-textarea" value={oldCode} onChange={(e) => setOldCode(e.target.value)} rows={8} placeholder="Enter the original code..." />
            </section>

            <section className="config-section">
              <h4 className="config-section-title">New Code</h4>
              <textarea className="config-textarea" value={newCode} onChange={(e) => setNewCode(e.target.value)} rows={8} placeholder="Enter the modified code..." />
            </section>
          </aside>

          <main className="preview-panel">
            <h3 className="preview-title">Preview</h3>
            <div className={`preview-content ${diffCustomThemeClass}`}>
              <DiffViewer
                oldCode={oldCode}
                newCode={newCode}
                language={diffLanguage}
                theme={diffTheme}
                shikiTheme={diffResolvedShikiTheme}
                borderStyle={diffBorderStyle}
                viewMode={diffViewMode}
                showLineNumbers={diffShowLineNumbers}
                showHeader={diffShowHeader}
                oldFileName={oldFileName}
                newFileName={newFileName}
                fileExtension={diffFileExtension}
                maxHeight={diffMaxHeight || undefined}
              />
            </div>
          </main>
        </div>
      )}
    </div>
  );
}
