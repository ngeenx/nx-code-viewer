<template>
  <div class="page">
    <header class="page-head">
      <span class="badge">Prerendered (static)</span>
      <h1 class="page-title">Statically generated</h1>
      <p class="page-lead">
        This page is generated to static HTML at build time (no server at
        runtime). The code viewer is fully highlighted in the prerendered
        markup and hydrates on load.
      </p>
    </header>

    <CodeShowcase />
  </div>
</template>

<script setup lang="ts">
// This route is prerendered to static HTML at build time via the
// `routeRules: { '/ssg/**': { prerender: true } }` entry in nuxt.config.
useHead({ title: 'SSG · nx-vue-code-viewer' });
</script>

<style scoped>
.page {
  display: grid;
  gap: 2rem;
}
.page-head {
  display: grid;
  gap: 0.5rem;
}
.badge {
  justify-self: start;
  padding: 0.2rem 0.6rem;
  border-radius: 999px;
  font-size: 0.7rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  background: color-mix(in oklab, currentColor 12%, transparent);
}
.page-title {
  margin: 0;
  font-size: 1.6rem;
  font-weight: 700;
}
.page-lead {
  margin: 0;
  opacity: 0.8;
  line-height: 1.6;
}
</style>
