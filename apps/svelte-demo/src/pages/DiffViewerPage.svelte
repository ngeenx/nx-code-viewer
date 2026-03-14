<script lang="ts">
  import { useTheme } from '../stores/theme.svelte';

  const { theme } = useTheme();
</script>

<div class="page-container {theme}">
  <div class="page-header">
    <h1 class="page-title">Diff Viewer</h1>
    <p class="page-description">
      Compare code changes with unified or split diff views.
    </p>
  </div>

  <section class="demo-section">
    <div class="coming-soon-notice">
      <h2 class="demo-section-title">Coming Soon</h2>
      <p class="demo-section-description">
        The Diff Viewer component is not yet ported to Svelte.
        Check back soon for unified and split diff comparison views.
      </p>
    </div>
  </section>
</div>
