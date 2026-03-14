<script lang="ts">
  import { useTheme } from '../stores/theme.svelte';
  import { CodeViewer } from '@ngeenx/nx-svelte-code-viewer';

  const { theme, getResolvedShikiTheme } = useTheme();

  const features = [
    { title: 'Syntax Highlighting', description: 'Support for 100+ languages with customizable Shiki themes.', route: '#/basic-examples' },
    { title: 'Display Options', description: 'Control headers, line numbers, max height, and word wrapping.', route: '#/display-options' },
    { title: 'Line Highlighting', description: 'Highlight, focus, and collapse lines to draw attention.', route: '#/line-highlighting' },
    { title: 'Border Styles', description: 'Four unique border styles to match your design.', route: '#/border-styles' },
  ];

  const sampleCode = `import { CodeViewer } from '@ngeenx/nx-svelte-code-viewer';

<CodeViewer
  code={sourceCode}
  language="typescript"
  showLineNumbers={true}
  showHeader={true}
/>`;
</script>

<div class="page-container {theme}">
  <div class="hero-section">
    <span class="hero-badge">Built for Svelte 5</span>
    <h1 class="hero-title">Beautiful Code <span class="gradient-text">Visualization</span></h1>
    <p class="hero-description">
      A powerful, themeable code viewer component for Svelte applications with syntax highlighting,
      line features, and interactive capabilities.
    </p>
    <div class="hero-stats">
      <div class="stat-item"><span class="stat-value">30+</span><span class="stat-label">Themes</span></div>
      <div class="stat-item"><span class="stat-value">100+</span><span class="stat-label">Languages</span></div>
      <div class="stat-item"><span class="stat-value">6</span><span class="stat-label">Border Styles</span></div>
    </div>
  </div>

  <div class="code-preview-wrapper">
    <CodeViewer
      code={sampleCode}
      language="html"
      {theme}
      shikiTheme={getResolvedShikiTheme()}
      showLineNumbers={true}
      showHeader={false}
      borderStyle="none"
    />
  </div>

  <div class="features-grid">
    {#each features as feature}
      <a href={feature.route} class="feature-card">
        <h3 class="feature-title">{feature.title}</h3>
        <p class="feature-description">{feature.description}</p>
      </a>
    {/each}
  </div>
</div>
