<template>
  <div class="layout" :class="theme">
    <aside class="sidebar">
      <div class="sidebar-header">
        <span class="logo">Code Viewer</span>
      </div>

      <nav class="sidebar-nav">
        <div v-for="section in navSections" :key="section.title" class="nav-section">
          <h3 class="nav-section-title">{{ section.title }}</h3>
          <ul class="nav-list">
            <li v-for="item in section.items" :key="item.route">
              <RouterLink
                :to="item.route"
                class="nav-item"
                :class="{ active: isActive(item.route) }"
              >
                <component :is="item.icon" class="nav-icon" :size="16" />
                {{ item.label }}
              </RouterLink>
            </li>
          </ul>
        </div>
      </nav>

      <div class="sidebar-footer">
        <div class="theme-selector">
          <label class="theme-label">Theme Style</label>
          <select class="theme-select" :value="customTheme" @change="onCustomThemeChange">
            <option v-for="opt in customThemeOptions" :key="opt.value" :value="opt.value">{{ opt.label }}</option>
          </select>
        </div>

        <div class="theme-selector">
          <label class="theme-label">Syntax Theme</label>
          <select class="theme-select" :value="shikiTheme" @change="onShikiThemeChange">
            <option v-for="opt in shikiThemeOptions" :key="opt.value" :value="opt.value">{{ opt.label }}</option>
          </select>
        </div>

        <button class="theme-toggle" @click="toggleTheme">
          <component :is="theme === 'dark' ? Sun : Moon" :size="14" />
          {{ theme === 'dark' ? 'Light Mode' : 'Dark Mode' }}
        </button>
      </div>
    </aside>

    <main
      class="main-content"
      :class="customTheme !== 'default' ? `theme-${customTheme}` : ''"
    >
      <RouterView />
    </main>
  </div>
</template>

<script setup lang="ts">
import { RouterLink, RouterView, useRoute } from 'vue-router';
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
} from 'lucide-vue-next';
import { useTheme, customThemeOptions, shikiThemeOptions, type CustomTheme } from '../composables/useTheme';
import type { ShikiThemeName } from '@ngeenx/nx-vue-code-viewer';
import './layout.css';

const { theme, customTheme, shikiTheme, toggleTheme, setCustomTheme, setShikiTheme } = useTheme();

const route = useRoute();

const navSections = [
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

function isActive(itemRoute: string): boolean {
  if (itemRoute === '/') return route.path === '/';
  return route.path.startsWith(itemRoute);
}

function onCustomThemeChange(event: Event): void {
  const select = event.target as HTMLSelectElement;
  setCustomTheme(select.value as CustomTheme);
}

function onShikiThemeChange(event: Event): void {
  const select = event.target as HTMLSelectElement;
  setShikiTheme(select.value as ShikiThemeName | 'auto');
}
</script>
