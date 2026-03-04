<template>
  <div class="page-container playground-container" :class="globalTheme">
    <div class="page-header">
      <h1 class="page-title">Playground</h1>
      <p class="page-description">
        Experiment with all configuration options in real-time.
      </p>
    </div>

    <div class="tab-navigation">
      <button
        class="tab-button"
        :class="{ active: activeTab === 'code' }"
        @click="activeTab = 'code'"
      >
        Code Viewer
      </button>
      <button
        class="tab-button"
        :class="{ active: activeTab === 'diff' }"
        @click="activeTab = 'diff'"
      >
        Diff Viewer
      </button>
    </div>

    <!-- CODE VIEWER PLAYGROUND -->
    <div v-if="activeTab === 'code'" class="playground-layout">
      <div class="config-panel">
        <h3 class="config-title">Configuration</h3>

        <div class="config-section">
          <div class="config-section-title">Content</div>
          <div class="config-row">
            <label class="config-label">Code</label>
            <textarea v-model="codeConfig.code" class="config-textarea" rows="8" />
          </div>
          <div class="config-row">
            <label class="config-label">Title</label>
            <input v-model="codeConfig.title" class="config-input" type="text" />
          </div>
          <div class="config-row">
            <label class="config-label">File Extension</label>
            <input v-model="codeConfig.fileExtension" class="config-input" type="text" />
          </div>
        </div>

        <div class="config-section">
          <div class="config-section-title">Language & Theme</div>
          <div class="config-row">
            <label class="config-label">Language</label>
            <select v-model="codeConfig.language" class="config-select">
              <option v-for="opt in languageOptions" :key="opt.value" :value="opt.value">{{ opt.label }}</option>
            </select>
          </div>
          <div class="config-row">
            <label class="config-label">Theme</label>
            <select v-model="codeConfig.theme" class="config-select">
              <option value="dark">Dark</option>
              <option value="light">Light</option>
            </select>
          </div>
          <div class="config-row">
            <label class="config-label">Shiki Theme</label>
            <select v-model="codeConfig.shikiTheme" class="config-select">
              <option v-for="opt in shikiThemeOptions" :key="opt.value" :value="opt.value">{{ opt.label }}</option>
            </select>
          </div>
          <div class="config-row">
            <label class="config-label">Custom Theme</label>
            <select v-model="codeConfig.customTheme" class="config-select">
              <option v-for="opt in customThemeOptions" :key="opt.value" :value="opt.value">{{ opt.label }}</option>
            </select>
          </div>
        </div>

        <div class="config-section">
          <div class="config-section-title">Border & Layout</div>
          <div class="config-row">
            <label class="config-label">Border Style</label>
            <select v-model="codeConfig.borderStyle" class="config-select">
              <option v-for="opt in borderStyleOptions" :key="opt.value" :value="opt.value">{{ opt.label }}</option>
            </select>
          </div>
          <div class="config-row">
            <label class="config-label">Max Height</label>
            <input v-model="codeConfig.maxHeight" class="config-input" type="text" placeholder="e.g. 400px" />
          </div>
        </div>

        <div class="config-section">
          <div class="config-section-title">Line Features</div>
          <div class="config-row">
            <label class="config-label">Highlighted Lines</label>
            <input v-model="codeConfig.highlightedLines" class="config-input" type="text" placeholder="e.g. 1,3,5-8" />
          </div>
          <div class="config-row">
            <label class="config-label">Focused Lines</label>
            <input v-model="codeConfig.focusedLines" class="config-input" type="text" placeholder="e.g. 2-5,10" />
          </div>
        </div>

        <div class="config-section">
          <div class="config-section-title">Display Options</div>
          <div class="checkbox-row">
            <label class="config-checkbox">
              <input type="checkbox" v-model="codeConfig.showLineNumbers" />
              <span>Show Line Numbers</span>
            </label>
          </div>
          <div class="checkbox-row">
            <label class="config-checkbox">
              <input type="checkbox" v-model="codeConfig.showCopyButton" />
              <span>Show Copy Button</span>
            </label>
          </div>
          <div class="checkbox-row">
            <label class="config-checkbox">
              <input type="checkbox" v-model="codeConfig.showHeader" />
              <span>Show Header</span>
            </label>
          </div>
          <div class="checkbox-row">
            <label class="config-checkbox">
              <input type="checkbox" v-model="codeConfig.wordWrap" />
              <span>Word Wrap</span>
            </label>
          </div>
        </div>
      </div>

      <div class="preview-panel">
        <div class="preview-title">Preview</div>
        <div class="preview-content" :class="codeCustomThemeClass">
          <CodeViewer
            :code="codeConfig.code"
            :language="codeConfig.language"
            :theme="codeConfig.theme"
            :shikiTheme="codeResolvedShikiTheme"
            :borderStyle="codeConfig.borderStyle"
            :showLineNumbers="codeConfig.showLineNumbers"
            :showCopyButton="codeConfig.showCopyButton"
            :showHeader="codeConfig.showHeader"
            :wordWrap="codeConfig.wordWrap"
            :title="codeConfig.title"
            :fileExtension="codeConfig.fileExtension"
            :maxHeight="codeConfig.maxHeight"
            :highlightedLines="codeParsedHighlightedLines"
            :focusedLines="codeParsedFocusedLines"
            @code-copied="onCodeCopied"
          />
        </div>
      </div>
    </div>

    <!-- DIFF VIEWER PLAYGROUND -->
    <div v-if="activeTab === 'diff'" class="playground-layout">
      <div class="config-panel">
        <h3 class="config-title">Configuration</h3>

        <div class="config-section">
          <div class="config-section-title">Content</div>
          <div class="config-row">
            <label class="config-label">Old Code</label>
            <textarea v-model="diffConfig.oldCode" class="config-textarea" rows="6" />
          </div>
          <div class="config-row">
            <label class="config-label">New Code</label>
            <textarea v-model="diffConfig.newCode" class="config-textarea" rows="6" />
          </div>
          <div class="config-row">
            <label class="config-label">Old File Name</label>
            <input v-model="diffConfig.oldFileName" class="config-input" type="text" />
          </div>
          <div class="config-row">
            <label class="config-label">New File Name</label>
            <input v-model="diffConfig.newFileName" class="config-input" type="text" />
          </div>
        </div>

        <div class="config-section">
          <div class="config-section-title">Language & Theme</div>
          <div class="config-row">
            <label class="config-label">Language</label>
            <select v-model="diffConfig.language" class="config-select">
              <option v-for="opt in languageOptions" :key="opt.value" :value="opt.value">{{ opt.label }}</option>
            </select>
          </div>
          <div class="config-row">
            <label class="config-label">Theme</label>
            <select v-model="diffConfig.theme" class="config-select">
              <option value="dark">Dark</option>
              <option value="light">Light</option>
            </select>
          </div>
          <div class="config-row">
            <label class="config-label">Shiki Theme</label>
            <select v-model="diffConfig.shikiTheme" class="config-select">
              <option v-for="opt in shikiThemeOptions" :key="opt.value" :value="opt.value">{{ opt.label }}</option>
            </select>
          </div>
          <div class="config-row">
            <label class="config-label">Custom Theme</label>
            <select v-model="diffConfig.customTheme" class="config-select">
              <option v-for="opt in customThemeOptions" :key="opt.value" :value="opt.value">{{ opt.label }}</option>
            </select>
          </div>
        </div>

        <div class="config-section">
          <div class="config-section-title">View Options</div>
          <div class="config-row">
            <label class="config-label">View Mode</label>
            <select v-model="diffConfig.viewMode" class="config-select">
              <option value="unified">Unified</option>
              <option value="split">Split</option>
            </select>
          </div>
          <div class="config-row">
            <label class="config-label">Border Style</label>
            <select v-model="diffConfig.borderStyle" class="config-select">
              <option v-for="opt in borderStyleOptions" :key="opt.value" :value="opt.value">{{ opt.label }}</option>
            </select>
          </div>
          <div class="config-row">
            <label class="config-label">Max Height</label>
            <input v-model="diffConfig.maxHeight" class="config-input" type="text" placeholder="e.g. 400px" />
          </div>
          <div class="checkbox-row">
            <label class="config-checkbox">
              <input type="checkbox" v-model="diffConfig.showLineNumbers" />
              <span>Show Line Numbers</span>
            </label>
          </div>
          <div class="checkbox-row">
            <label class="config-checkbox">
              <input type="checkbox" v-model="diffConfig.showHeader" />
              <span>Show Header</span>
            </label>
          </div>
        </div>
      </div>

      <div class="preview-panel">
        <div class="preview-title">Preview</div>
        <div class="preview-content" :class="diffCustomThemeClass">
          <DiffViewer
            :oldCode="diffConfig.oldCode"
            :newCode="diffConfig.newCode"
            :language="diffConfig.language"
            :theme="diffConfig.theme"
            :shikiTheme="diffResolvedShikiTheme"
            :borderStyle="diffConfig.borderStyle"
            :viewMode="diffConfig.viewMode"
            :showLineNumbers="diffConfig.showLineNumbers"
            :showHeader="diffConfig.showHeader"
            :oldFileName="diffConfig.oldFileName"
            :newFileName="diffConfig.newFileName"
            :maxHeight="diffConfig.maxHeight"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { CodeViewer, DiffViewer } from '@ngeenx/nx-vue-code-viewer';
import type { CodeViewerLanguage, CodeViewerBorderStyle, CodeViewerTheme, DiffViewMode, ShikiThemeName } from '@ngeenx/nx-vue-code-viewer';
import { useTheme } from '../composables/useTheme';
import type { CustomTheme } from '../composables/useTheme';
import '../styles/playground.css';

const { theme: globalTheme, shikiThemeOptions, customThemeOptions } = useTheme();

const activeTab = ref<'code' | 'diff'>('code');

const codeConfig = ref({
  code: `import { ref, computed } from 'vue';

const count = ref(0);
const doubled = computed(() => count.value * 2);

function increment(): void {
  count.value++;
}

function decrement(): void {
  count.value--;
}

export { count, doubled, increment, decrement };`,
  language: 'typescript' as CodeViewerLanguage,
  theme: 'dark' as CodeViewerTheme,
  shikiTheme: 'auto' as ShikiThemeName | 'auto',
  customTheme: 'default' as CustomTheme,
  borderStyle: 'classic' as CodeViewerBorderStyle,
  showLineNumbers: true,
  showCopyButton: true,
  showHeader: true,
  wordWrap: false,
  title: 'counter.ts',
  fileExtension: '.ts',
  maxHeight: '',
  highlightedLines: '',
  focusedLines: '',
});

const diffConfig = ref({
  oldCode: `interface User {
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
console.log(user.name);`,
  newCode: `interface User {
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
}`,
  language: 'typescript' as CodeViewerLanguage,
  theme: 'dark' as CodeViewerTheme,
  shikiTheme: 'auto' as ShikiThemeName | 'auto',
  customTheme: 'default' as CustomTheme,
  borderStyle: 'classic' as CodeViewerBorderStyle,
  viewMode: 'unified' as DiffViewMode,
  showLineNumbers: true,
  showHeader: true,
  oldFileName: 'user.ts',
  newFileName: 'user.ts',
  fileExtension: '.ts',
  maxHeight: '',
});

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

const borderStyleOptions: SelectOption<CodeViewerBorderStyle>[] = [
  { value: 'classic', label: 'Classic' },
  { value: 'grid-cross', label: 'Grid Cross' },
  { value: 'corner-intersection', label: 'Corner Intersection' },
  { value: 'none', label: 'None' },
];

const codeCustomThemeClass = computed(() => {
  const t = codeConfig.value.customTheme;
  return t === 'default' ? '' : `theme-${t}`;
});

const diffCustomThemeClass = computed(() => {
  const t = diffConfig.value.customTheme;
  return t === 'default' ? '' : `theme-${t}`;
});

const codeResolvedShikiTheme = computed(() => {
  const t = codeConfig.value.shikiTheme;
  return t === 'auto' ? undefined : t as ShikiThemeName;
});

const diffResolvedShikiTheme = computed(() => {
  const t = diffConfig.value.shikiTheme;
  return t === 'auto' ? undefined : t as ShikiThemeName;
});

const codeParsedHighlightedLines = computed(() => parseLineInput(codeConfig.value.highlightedLines));
const codeParsedFocusedLines = computed(() => parseLineInput(codeConfig.value.focusedLines));

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

function onCodeCopied(): void {
  console.log('Code copied to clipboard');
}
</script>
