<script lang="ts">
  import { CodeViewer } from '@ngeenx/nx-svelte-code-viewer';
  import type { CodeViewerLanguage, CodeViewerBorderStyle, CodeViewerTheme, ShikiThemeName } from '@ngeenx/nx-code-viewer-utils';
  import { useTheme, shikiThemeOptions, customThemeOptions, type CustomTheme } from '../stores/theme.svelte';

  const { theme: globalTheme } = useTheme();

  let code = $state(`import { writable, derived } from 'svelte/store';

const count = writable(0);
const doubled = derived(count, $count => $count * 2);

function increment(): void {
  count.update(n => n + 1);
}

function decrement(): void {
  count.update(n => n - 1);
}

export { count, doubled, increment, decrement };`);

  let language = $state<CodeViewerLanguage>('typescript');
  let codeTheme = $state<CodeViewerTheme>('dark');
  let shikiTheme = $state<ShikiThemeName | 'auto'>('auto');
  let customTheme = $state<CustomTheme>('default');
  let borderStyle = $state<CodeViewerBorderStyle>('classic');
  let showLineNumbers = $state(true);
  let showCopyButton = $state(true);
  let showHeader = $state(true);
  let wordWrap = $state(false);
  let title = $state('counter.ts');
  let fileExtension = $state('.ts');
  let maxHeight = $state('');
  let highlightedLinesInput = $state('');
  let focusedLinesInput = $state('');

  const languageOptions: { value: CodeViewerLanguage; label: string }[] = [
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

  const borderStyleOptions: { value: CodeViewerBorderStyle; label: string }[] = [
    { value: 'classic', label: 'Classic' },
    { value: 'grid-cross', label: 'Grid Cross' },
    { value: 'corner-intersection', label: 'Corner Intersection' },
    { value: 'none', label: 'None' },
  ];

  const customThemeClass = $derived(
    customTheme === 'default' ? '' : `theme-${customTheme}`
  );

  const resolvedShikiTheme = $derived(
    shikiTheme === 'auto' ? undefined : shikiTheme as ShikiThemeName
  );

  const parsedHighlightedLines = $derived(parseLineInput(highlightedLinesInput));
  const parsedFocusedLines = $derived(parseLineInput(focusedLinesInput));

  function parseLineInput(
    input: string
  ): number | readonly (number | readonly [number, number])[] | undefined {
    if (!input.trim()) return undefined;

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
        if (!isNaN(num)) result.push(num);
      }
    }

    if (result.length === 0) return undefined;
    if (result.length === 1 && typeof result[0] === 'number') return result[0];
    return result;
  }
</script>

<div class="page-container playground-container {globalTheme}">
  <div class="page-header">
    <h1 class="page-title">Playground</h1>
    <p class="page-description">
      Experiment with all configuration options in real-time.
    </p>
  </div>

  <div class="playground-layout">
    <div class="config-panel">
      <h3 class="config-title">Configuration</h3>

      <div class="config-section">
        <div class="config-section-title">Content</div>
        <div class="config-row">
          <label class="config-label">Code</label>
          <textarea bind:value={code} class="config-textarea" rows="8"></textarea>
        </div>
        <div class="config-row">
          <label class="config-label">Title</label>
          <input bind:value={title} class="config-input" type="text" />
        </div>
        <div class="config-row">
          <label class="config-label">File Extension</label>
          <input bind:value={fileExtension} class="config-input" type="text" />
        </div>
      </div>

      <div class="config-section">
        <div class="config-section-title">Language & Theme</div>
        <div class="config-row">
          <label class="config-label">Language</label>
          <select bind:value={language} class="config-select">
            {#each languageOptions as opt}
              <option value={opt.value}>{opt.label}</option>
            {/each}
          </select>
        </div>
        <div class="config-row">
          <label class="config-label">Theme</label>
          <select bind:value={codeTheme} class="config-select">
            <option value="dark">Dark</option>
            <option value="light">Light</option>
          </select>
        </div>
        <div class="config-row">
          <label class="config-label">Shiki Theme</label>
          <select bind:value={shikiTheme} class="config-select">
            {#each shikiThemeOptions as opt}
              <option value={opt.value}>{opt.label}</option>
            {/each}
          </select>
        </div>
        <div class="config-row">
          <label class="config-label">Custom Theme</label>
          <select bind:value={customTheme} class="config-select">
            {#each customThemeOptions as opt}
              <option value={opt.value}>{opt.label}</option>
            {/each}
          </select>
        </div>
      </div>

      <div class="config-section">
        <div class="config-section-title">Border & Layout</div>
        <div class="config-row">
          <label class="config-label">Border Style</label>
          <select bind:value={borderStyle} class="config-select">
            {#each borderStyleOptions as opt}
              <option value={opt.value}>{opt.label}</option>
            {/each}
          </select>
        </div>
        <div class="config-row">
          <label class="config-label">Max Height</label>
          <input bind:value={maxHeight} class="config-input" type="text" placeholder="e.g. 400px" />
        </div>
      </div>

      <div class="config-section">
        <div class="config-section-title">Line Features</div>
        <div class="config-row">
          <label class="config-label">Highlighted Lines</label>
          <input bind:value={highlightedLinesInput} class="config-input" type="text" placeholder="e.g. 1,3,5-8" />
        </div>
        <div class="config-row">
          <label class="config-label">Focused Lines</label>
          <input bind:value={focusedLinesInput} class="config-input" type="text" placeholder="e.g. 2-5,10" />
        </div>
      </div>

      <div class="config-section">
        <div class="config-section-title">Display Options</div>
        <div class="checkbox-row">
          <label class="config-checkbox">
            <input type="checkbox" bind:checked={showLineNumbers} />
            <span>Show Line Numbers</span>
          </label>
        </div>
        <div class="checkbox-row">
          <label class="config-checkbox">
            <input type="checkbox" bind:checked={showCopyButton} />
            <span>Show Copy Button</span>
          </label>
        </div>
        <div class="checkbox-row">
          <label class="config-checkbox">
            <input type="checkbox" bind:checked={showHeader} />
            <span>Show Header</span>
          </label>
        </div>
        <div class="checkbox-row">
          <label class="config-checkbox">
            <input type="checkbox" bind:checked={wordWrap} />
            <span>Word Wrap</span>
          </label>
        </div>
      </div>
    </div>

    <div class="preview-panel">
      <div class="preview-title">Preview</div>
      <div class="preview-content {customThemeClass}">
        <CodeViewer
          {code}
          {language}
          theme={codeTheme}
          shikiTheme={resolvedShikiTheme}
          {borderStyle}
          {showLineNumbers}
          {showCopyButton}
          {showHeader}
          {wordWrap}
          {title}
          {fileExtension}
          {maxHeight}
          highlightedLines={parsedHighlightedLines}
          focusedLines={parsedFocusedLines}
        />
      </div>
    </div>
  </div>
</div>
