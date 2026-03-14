<script lang="ts">
  import Router from 'svelte-spa-router';
  import Layout from './layout/Layout.svelte';
  import LandingPage from './pages/LandingPage.svelte';
  import BasicExamplesPage from './pages/BasicExamplesPage.svelte';
  import DisplayOptionsPage from './pages/DisplayOptionsPage.svelte';
  import LineHighlightingPage from './pages/LineHighlightingPage.svelte';
  import InteractiveFeaturesPage from './pages/InteractiveFeaturesPage.svelte';
  import BorderStylesPage from './pages/BorderStylesPage.svelte';
  import ThemingPage from './pages/ThemingPage.svelte';
  import DiffViewerPage from './pages/DiffViewerPage.svelte';
  import MultiCodeViewerPage from './pages/MultiCodeViewerPage.svelte';
  import PlaygroundPage from './pages/PlaygroundPage.svelte';
  import { wrap } from 'svelte-spa-router/wrap';

  const routes = {
    '/': wrap({ component: LandingPage }),
    '/basic-examples': wrap({ component: BasicExamplesPage }),
    '/display-options': wrap({ component: DisplayOptionsPage }),
    '/line-highlighting': wrap({ component: LineHighlightingPage }),
    '/interactive-features': wrap({ component: InteractiveFeaturesPage }),
    '/border-styles': wrap({ component: BorderStylesPage }),
    '/theming': wrap({ component: ThemingPage }),
    '/diff-viewer': wrap({ component: DiffViewerPage }),
    '/multi-code-viewer': wrap({ component: MultiCodeViewerPage }),
    '/playground': wrap({ component: PlaygroundPage }),
  };
</script>

<Layout>
  <Router {routes} />
</Layout>
