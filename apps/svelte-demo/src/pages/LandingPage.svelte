<script lang="ts">
  import { useTheme } from '../stores/theme.svelte';
  import { CodeViewer } from '@ngeenx/nx-svelte-code-viewer';
  import {
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
  } from '@lucide/svelte';
  import type { Component } from 'svelte';

  const { theme, getResolvedShikiTheme } = useTheme();

  interface Feature {
    icon: Component;
    title: string;
    description: string;
    route: string;
    gradient: string;
  }

  const features: Feature[] = [
    {
      icon: BookOpen,
      title: 'Syntax Highlighting',
      description: 'Beautiful code rendering with 30+ Shiki themes and 100+ language support.',
      route: '#/basic-examples',
      gradient: 'from-blue-500',
    },
    {
      icon: Palette,
      title: 'Custom Theming',
      description: 'Create unique themes with CSS variables. Cyberpunk, minimal, GitHub-inspired and more.',
      route: '#/theming',
      gradient: 'from-purple-500',
    },
    {
      icon: Zap,
      title: 'Interactive Features',
      description: 'Line widgets, reference links, popovers, and custom annotations for rich code documentation.',
      route: '#/interactive-features',
      gradient: 'from-amber-500',
    },
    {
      icon: GitCompare,
      title: 'Diff Viewer',
      description: 'Side-by-side and unified diff views with syntax highlighting and line-level changes.',
      route: '#/diff-viewer',
      gradient: 'from-green-500',
    },
    {
      icon: Layers,
      title: 'Multi-Code Viewer',
      description: 'Tabbed interface for displaying multiple files, code snippets, and diff comparisons.',
      route: '#/multi-code-viewer',
      gradient: 'from-rose-500',
    },
    {
      icon: Play,
      title: 'Playground',
      description: 'Interactive configuration editor to experiment with all features in real-time.',
      route: '#/playground',
      gradient: 'from-indigo-500',
    },
  ];

  const codeExamples = [
    {
      label: 'Code Viewer',
      language: 'typescript' as const,
      code: `import { CodeViewer } from '@ngeenx/nx-svelte-code-viewer';

// Use in your Svelte component
<CodeViewer
  code={sourceCode}
  language="typescript"
  showLineNumbers={true}
  showHeader={true}
/>`,
    },
    {
      label: 'Diff Viewer',
      language: 'html' as const,
      code: `<!-- Compare code changes side-by-side -->
<DiffViewer
  oldCode={oldCode}
  newCode={newCode}
  language="typescript"
  viewMode="split"
/>`,
    },
    {
      label: 'Multi-Code',
      language: 'html' as const,
      code: `<!-- Tabbed interface for multiple files -->
<MultiCodeViewer
  tabs={tabs}
  theme="dark"
  borderStyle="classic"
/>`,
    },
  ];

  let activeCodeIndex = $state(0);
</script>

<div class="landing-container">
  <!-- Hero Section -->
  <section class="hero-section">
    <div class="hero-content">
      <div class="hero-badge">
        <Sparkles size={14} />
        <span>Built for Svelte 5</span>
      </div>

      <h1 class="hero-title">
        <span class="hero-title-line">Beautiful Code</span>
        <span class="hero-title-line gradient-text">Visualization</span>
      </h1>

      <p class="hero-description">
        A powerful, customizable code viewer component for Svelte applications.
        Syntax highlighting, diff views, themes, and interactive features —
        everything you need to display code beautifully.
      </p>

      <div class="hero-actions">
        <a href="#/basic-examples" class="btn-primary">
          <span>Get Started</span>
          <ArrowRight size={18} />
        </a>
        <a href="#/playground" class="btn-secondary">
          <Code2 size={18} />
          <span>Try Playground</span>
        </a>
      </div>

      <div class="hero-stats">
        <div class="stat-item">
          <span class="stat-value">30+</span>
          <span class="stat-label">Themes</span>
        </div>
        <div class="stat-divider"></div>
        <div class="stat-item">
          <span class="stat-value">100+</span>
          <span class="stat-label">Languages</span>
        </div>
        <div class="stat-divider"></div>
        <div class="stat-item">
          <span class="stat-value">6</span>
          <span class="stat-label">Border Styles</span>
        </div>
      </div>
    </div>

    <div class="hero-preview">
      <div class="code-preview-wrapper">
        <div class="code-preview-header">
          <div class="preview-tabs">
            {#each codeExamples as example, i}
              <button
                class="preview-tab"
                class:active={activeCodeIndex === i}
                onclick={() => activeCodeIndex = i}
              >
                <span class="tab-dot" class:active={activeCodeIndex === i}></span>
                <span>{example.label}</span>
              </button>
            {/each}
          </div>
        </div>

        <div class="code-preview-content">
          <CodeViewer
            code={codeExamples[activeCodeIndex].code}
            language={codeExamples[activeCodeIndex].language}
            {theme}
            shikiTheme={getResolvedShikiTheme()}
            showLineNumbers={true}
            showHeader={false}
            borderStyle="none"
          />
        </div>
      </div>

      <div class="floating-decoration decoration-1"></div>
      <div class="floating-decoration decoration-2"></div>
      <div class="floating-decoration decoration-3"></div>
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
      {#each features as feature}
        <a href={feature.route} class="feature-card">
          <div class="feature-icon-wrapper gradient-{feature.gradient}">
            <svelte:component this={feature.icon} size={24} />
          </div>
          <h3 class="feature-title">{feature.title}</h3>
          <p class="feature-description">{feature.description}</p>
          <div class="feature-link">
            <span>Explore</span>
            <ChevronRight size={16} />
          </div>
        </a>
      {/each}
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
        <a href="#/playground" class="btn-primary large">
          <Code2 size={20} />
          <span>Open Playground</span>
        </a>
      </div>
    </div>
  </section>
</div>
