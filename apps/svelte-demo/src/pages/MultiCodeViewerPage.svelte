<script lang="ts">
  import { useTheme } from '../stores/theme.svelte';

  const { theme } = useTheme();
</script>

<div class="page-container {theme}">
  <header class="page-header">
    <h1 class="page-title">Multi-Code Viewer</h1>
    <p class="page-description">
      Tabbed interface for viewing multiple files including code and diff views.
    </p>
  </header>

  <section class="demo-section">
    <div class="coming-soon-notice">
      <h2 class="demo-section-title">Coming Soon</h2>
      <p class="demo-section-description">
        The Multi-Code Viewer component is not yet ported to Svelte.
        Check back soon for the tabbed multi-file viewing interface.
      </p>
    </div>
  </section>
</div>
