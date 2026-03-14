<script lang="ts">
  import { useTheme, type CustomTheme } from '../stores/theme.svelte';
  import type { ShikiThemeName } from '@ngeenx/nx-code-viewer-utils';
  import active from 'svelte-spa-router/active';
  import type { Snippet, Component } from 'svelte';
  import {
    Home,
    BookOpen,
    Settings2,
    Highlighter,
    MousePointer2,
    Frame,
    Palette,
    GitCompare,
    Layers,
    Play,
    Sun,
    Moon,
  } from 'lucide-svelte';

  interface Props {
    children: Snippet;
  }

  let { children }: Props = $props();

  const themeStore = useTheme();

  interface NavItem {
    label: string;
    route: string;
    icon: Component;
  }

  interface NavSection {
    title: string;
    items: NavItem[];
  }

  const navSections: NavSection[] = [
    {
      title: 'Overview',
      items: [{ label: 'Home', route: '/', icon: Home }],
    },
    {
      title: 'Getting Started',
      items: [{ label: 'Basic Examples', route: '/basic-examples', icon: BookOpen }],
    },
    {
      title: 'Code Viewer',
      items: [
        { label: 'Display Options', route: '/display-options', icon: Settings2 },
        { label: 'Line Highlighting', route: '/line-highlighting', icon: Highlighter },
        { label: 'Interactive Features', route: '/interactive-features', icon: MousePointer2 },
        { label: 'Border Styles', route: '/border-styles', icon: Frame },
        { label: 'Theming', route: '/theming', icon: Palette },
      ],
    },
    {
      title: 'Advanced',
      items: [
        { label: 'Diff Viewer', route: '/diff-viewer', icon: GitCompare },
        { label: 'Multi-Code Viewer', route: '/multi-code-viewer', icon: Layers },
      ],
    },
    {
      title: 'Tools',
      items: [{ label: 'Playground', route: '/playground', icon: Play }],
    },
  ];

  function onCustomThemeChange(event: Event) {
    const select = event.target as HTMLSelectElement;
    themeStore.setCustomTheme(select.value as CustomTheme);
  }

  function onShikiThemeChange(event: Event) {
    const select = event.target as HTMLSelectElement;
    themeStore.setShikiTheme(select.value as ShikiThemeName | 'auto');
  }
</script>

<div class="layout" class:dark={themeStore.theme === 'dark'} class:light={themeStore.theme === 'light'}>
  <aside class="sidebar">
    <div class="sidebar-header">
      <span class="logo">Code Viewer</span>
    </div>

    <nav class="sidebar-nav">
      {#each navSections as section}
        <div class="nav-section">
          <h3 class="nav-section-title">{section.title}</h3>
          <ul class="nav-list">
            {#each section.items as item}
              <li>
                <a
                  href={`#${item.route}`}
                  class="nav-item"
                  use:active={{ path: item.route, className: 'active', inactiveClassName: '' }}
                >
                  <svelte:component this={item.icon} size={16} />
                  {item.label}
                </a>
              </li>
            {/each}
          </ul>
        </div>
      {/each}
    </nav>

    <div class="sidebar-footer">
      <div class="theme-selector">
        <label class="theme-label">Theme Style</label>
        <select class="theme-select" value={themeStore.customTheme} onchange={onCustomThemeChange}>
          {#each themeStore.customThemeOptions as option}
            <option value={option.value}>{option.label}</option>
          {/each}
        </select>
      </div>

      <div class="theme-selector">
        <label class="theme-label">Syntax Theme</label>
        <select class="theme-select" value={themeStore.shikiTheme} onchange={onShikiThemeChange}>
          {#each themeStore.shikiThemeOptions as option}
            <option value={option.value}>{option.label}</option>
          {/each}
        </select>
      </div>

      <button class="theme-toggle" onclick={themeStore.toggleTheme}>
        {#if themeStore.theme === 'dark'}
          <Sun size={14} />
          Light Mode
        {:else}
          <Moon size={14} />
          Dark Mode
        {/if}
      </button>
    </div>
  </aside>

  <main
    class="main-content"
    class:theme-cyberpunk={themeStore.customTheme === 'cyberpunk'}
    class:theme-minimal={themeStore.customTheme === 'minimal'}
    class:theme-high-contrast={themeStore.customTheme === 'high-contrast'}
    class:theme-github={themeStore.customTheme === 'github'}
    class:theme-dracula={themeStore.customTheme === 'dracula'}
    class:theme-handwritten={themeStore.customTheme === 'handwritten'}
  >
    {@render children()}
  </main>
</div>
