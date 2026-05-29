<template>
  <div class="shell">
    <header class="topbar">
      <NuxtLink to="/" class="brand">nx-vue-code-viewer · Nuxt</NuxtLink>
      <nav class="nav">
        <NuxtLink to="/" class="nav-link">Home</NuxtLink>
        <NuxtLink to="/ssr" class="nav-link">SSR</NuxtLink>
        <NuxtLink to="/ssg" class="nav-link">SSG</NuxtLink>
      </nav>
      <button class="theme-toggle" type="button" @click="toggle">
        {{ theme === 'dark' ? '☀ Light' : '☾ Dark' }}
      </button>
    </header>

    <main class="content">
      <slot />
    </main>

    <footer class="footer">
      Rendered with Nuxt · the code viewer is server-rendered then hydrated.
    </footer>
  </div>
</template>

<script setup lang="ts">
import { useChromeTheme } from '../composables/useChromeTheme';

const { theme, toggle } = useChromeTheme();
</script>

<style scoped>
.shell {
  min-height: 100dvh;
  display: flex;
  flex-direction: column;
}
.topbar {
  display: flex;
  align-items: center;
  gap: 1.5rem;
  padding: 1rem 1.5rem;
  border-bottom: 1px solid color-mix(in oklab, currentColor 12%, transparent);
}
.brand {
  font-weight: 700;
  text-decoration: none;
  color: inherit;
}
.nav {
  display: flex;
  gap: 1rem;
  margin-right: auto;
}
.nav-link {
  text-decoration: none;
  color: inherit;
  opacity: 0.7;
}
.nav-link:hover {
  opacity: 1;
}
.router-link-exact-active.nav-link {
  opacity: 1;
  font-weight: 600;
}
.theme-toggle {
  padding: 0.4rem 0.8rem;
  border: 1px solid color-mix(in oklab, currentColor 30%, transparent);
  border-radius: 6px;
  background: transparent;
  color: inherit;
  cursor: pointer;
  font: inherit;
}
.content {
  width: 100%;
  max-width: 880px;
  margin: 0 auto;
  padding: 2.5rem 1.5rem;
  flex: 1;
}
.footer {
  padding: 1.5rem;
  text-align: center;
  font-size: 0.8rem;
  opacity: 0.55;
  border-top: 1px solid color-mix(in oklab, currentColor 12%, transparent);
}
</style>
