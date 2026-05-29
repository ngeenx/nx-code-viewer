<template>
  <div class="page">
    <header class="page-head">
      <span class="badge">Universal rendering</span>
      <h1 class="page-title">Server-side rendered</h1>
      <p class="page-lead">
        These viewers are rendered on the server on every request and
        hydrated in the browser. The highlighted HTML is in the initial
        response.
      </p>
    </header>

    <CodeShowcase />
  </div>
</template>

<script setup lang="ts">
useHead({ title: 'SSR · nx-vue-code-viewer' });
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
