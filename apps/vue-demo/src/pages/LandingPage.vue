<template>
  <div class="landing-container" :class="theme">
    <!-- Hero Section -->
    <section class="hero-section">
      <div class="hero-content">
        <div class="hero-badge">
          <span>✨</span>
          <span>Built for Vue 3+</span>
        </div>

        <h1 class="hero-title">
          <span class="hero-title-line">Beautiful Code</span>
          <span class="hero-title-line gradient-text">Visualization</span>
        </h1>

        <p class="hero-description">
          A powerful, customizable code viewer component for Vue applications.
          Syntax highlighting, diff views, themes, and interactive features —
          everything you need to display code beautifully.
        </p>

        <div class="hero-actions">
          <RouterLink to="/basic-examples" class="btn-primary">
            <span>Get Started</span>
            <span>→</span>
          </RouterLink>
          <RouterLink to="/playground" class="btn-secondary">
            <span>&lt;/&gt;</span>
            <span>Try Playground</span>
          </RouterLink>
        </div>

        <div class="hero-stats">
          <div class="stat-item">
            <span class="stat-value">30+</span>
            <span class="stat-label">Themes</span>
          </div>
          <div class="stat-divider" />
          <div class="stat-item">
            <span class="stat-value">100+</span>
            <span class="stat-label">Languages</span>
          </div>
          <div class="stat-divider" />
          <div class="stat-item">
            <span class="stat-value">4</span>
            <span class="stat-label">Border Styles</span>
          </div>
        </div>
      </div>

      <div class="hero-preview">
        <div class="code-preview-wrapper">
          <div class="code-preview-header">
            <div class="preview-tabs">
              <button
                v-for="(example, i) in codeExamples"
                :key="i"
                class="preview-tab"
                :class="{ active: activeCodeIndex === i }"
                @click="activeCodeIndex = i"
              >
                <span class="tab-dot" :class="{ active: activeCodeIndex === i }" />
                <span>{{ example.label }}</span>
              </button>
            </div>
          </div>

          <div class="code-preview-content">
            <CodeViewer
              :code="codeExamples[activeCodeIndex].code"
              :language="codeExamples[activeCodeIndex].language"
              :shikiTheme="getResolvedShikiTheme()"
              :showLineNumbers="true"
              :showHeader="false"
              borderStyle="none"
            />
          </div>
        </div>

        <div class="floating-decoration decoration-1" />
        <div class="floating-decoration decoration-2" />
        <div class="floating-decoration decoration-3" />
      </div>
    </section>

    <!-- Features Section -->
    <section class="features-section">
      <div class="section-header">
        <h2 class="section-title">Everything You Need</h2>
        <p class="section-description">
          Powerful features to make your code shine in documentation, tutorials, and applications.
        </p>
      </div>

      <div class="features-grid">
        <RouterLink
          v-for="feature in features"
          :key="feature.title"
          :to="feature.route"
          class="feature-card"
        >
          <div class="feature-icon-wrapper" :class="feature.gradient">
            <span>{{ feature.icon }}</span>
          </div>
          <h3 class="feature-title">{{ feature.title }}</h3>
          <p class="feature-description">{{ feature.description }}</p>
          <div class="feature-link">
            <span>Explore</span>
            <span>›</span>
          </div>
        </RouterLink>
      </div>
    </section>

    <!-- CTA Section -->
    <section class="cta-section">
      <div class="cta-content">
        <h2 class="cta-title">Ready to Get Started?</h2>
        <p class="cta-description">
          Explore the playground to see all features in action, or dive into the examples to learn how to use each component.
        </p>
        <div class="cta-actions">
          <RouterLink to="/playground" class="btn-primary large">
            <span>&lt;/&gt;</span>
            <span>Open Playground</span>
          </RouterLink>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { RouterLink } from 'vue-router';
import { CodeViewer } from '@ngeenx/nx-vue-code-viewer';
import { useTheme } from '../composables/useTheme';
import '../styles/landing.css';

const { theme, getResolvedShikiTheme } = useTheme();

interface Feature {
  icon: string;
  title: string;
  description: string;
  route: string;
  gradient: string;
}

const features: Feature[] = [
  {
    icon: '📖',
    title: 'Syntax Highlighting',
    description: 'Beautiful code rendering with 30+ Shiki themes and 100+ language support.',
    route: '/basic-examples',
    gradient: 'gradient-blue',
  },
  {
    icon: '🎨',
    title: 'Custom Theming',
    description: 'Create unique themes with CSS variables. Cyberpunk, minimal, GitHub-inspired and more.',
    route: '/theming',
    gradient: 'gradient-purple',
  },
  {
    icon: '⚡',
    title: 'Interactive Features',
    description: 'Line widgets, reference links, popovers, and custom annotations for rich code documentation.',
    route: '/interactive-features',
    gradient: 'gradient-amber',
  },
  {
    icon: '🔀',
    title: 'Diff Viewer',
    description: 'Side-by-side and unified diff views with syntax highlighting and line-level changes.',
    route: '/diff-viewer',
    gradient: 'gradient-green',
  },
  {
    icon: '📂',
    title: 'Multi-Code Viewer',
    description: 'Tabbed interface for displaying multiple files, code snippets, and diff comparisons.',
    route: '/multi-code-viewer',
    gradient: 'gradient-rose',
  },
  {
    icon: '▶',
    title: 'Playground',
    description: 'Interactive configuration editor to experiment with all features in real-time.',
    route: '/playground',
    gradient: 'gradient-indigo',
  },
];

const codeExamples = [
  {
    label: 'Code Viewer',
    language: 'typescript' as const,
    code: `import { CodeViewer } from '@ngeenx/nx-vue-code-viewer';

// In your Vue component template:
// <CodeViewer
//   :code="code"
//   language="typescript"
//   :showLineNumbers="true"
//   :showHeader="true"
// />

const code = 'console.log("Hello, World!");';`,
  },
  {
    label: 'Diff Viewer',
    language: 'html' as const,
    code: `<!-- Compare code changes side-by-side -->
<DiffViewer
  :oldCode="oldCode"
  :newCode="newCode"
  language="typescript"
  viewMode="split"
/>`,
  },
  {
    label: 'Multi-Code',
    language: 'typescript' as const,
    code: `import { MultiCodeViewer } from '@ngeenx/nx-vue-code-viewer';

// Tabbed interface for multiple files
const tabs = [
  { id: '1', type: 'code', fileName: 'app.ts', language: 'typescript', code: '...' },
  { id: '2', type: 'code', fileName: 'index.html', language: 'html', code: '...' },
];`,
  },
];

const activeCodeIndex = ref(0);
</script>
