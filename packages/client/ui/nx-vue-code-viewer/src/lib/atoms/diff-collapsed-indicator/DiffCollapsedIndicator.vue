<template>
  <div
    :class="indicatorClasses"
    role="button"
    tabindex="0"
    :aria-label="ariaLabel"
    @click="onToggle"
    @keydown="onKeydown"
  >
    <template v-if="showLineNumbers">
      <span class="line-number old" />
      <span class="line-number new" />
    </template>
    <span v-if="showPrefix" class="prefix" />
    <span class="collapse-content">
      <svg
        viewBox="0 0 24 24"
        width="14"
        height="14"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
        aria-hidden="true"
      >
        <path d="m7 15 5 5 5-5" />
        <path d="m7 9 5-5 5 5" />
      </svg>
      <span class="collapse-text">... {{ displayText }}</span>
    </span>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import type { CodeViewerTheme, DiffCollapsedRange } from '@ngeenx/nx-code-viewer-utils';

interface Props {
  theme?: CodeViewerTheme;
  range: DiffCollapsedRange;
  hiddenCount: number;
  showLineNumbers?: boolean;
  showPrefix?: boolean;
  isExpanded?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  theme: 'dark',
  showLineNumbers: true,
  showPrefix: true,
  isExpanded: false,
});

const emit = defineEmits<{
  toggle: [];
}>();

const indicatorClasses = computed(() => `diff-collapsed-indicator ${props.theme}`);

const displayText = computed(() => {
  const count = props.hiddenCount;
  return count === 1 ? '1 line' : `${count} lines`;
});

const ariaLabel = computed(() => {
  const count = props.hiddenCount;
  const lines = count === 1 ? 'line' : 'lines';
  return props.isExpanded ? `Collapse ${count} ${lines}` : `Expand ${count} hidden ${lines}`;
});

function onToggle(): void {
  emit('toggle');
}

function onKeydown(event: KeyboardEvent): void {
  if (event.key === 'Enter' || event.key === ' ') {
    event.preventDefault();
    emit('toggle');
  }
}
</script>
