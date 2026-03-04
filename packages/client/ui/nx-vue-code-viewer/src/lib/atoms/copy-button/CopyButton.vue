<template>
  <span class="nx-copy-button">
  <button
    type="button"
    :class="buttonClasses"
    :disabled="disabled"
    :aria-label="ariaLabel"
    @click="onClick"
  >
    <svg
      v-if="state === 'copied'"
      viewBox="0 0 24 24"
      width="16"
      height="16"
      fill="none"
      stroke="currentColor"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
      aria-hidden="true"
    >
      <polyline points="20 6 9 17 4 12" />
    </svg>
    <svg
      v-else-if="state === 'error'"
      viewBox="0 0 24 24"
      width="16"
      height="16"
      fill="none"
      stroke="currentColor"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
      aria-hidden="true"
    >
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
    <svg
      v-else
      viewBox="0 0 24 24"
      width="16"
      height="16"
      fill="none"
      stroke="currentColor"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
      aria-hidden="true"
    >
      <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
    </svg>
  </button>
  </span>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import type { CopyButtonState, CodeViewerTheme } from '@ngeenx/nx-code-viewer-utils';

interface Props {
  state?: CopyButtonState;
  theme?: CodeViewerTheme;
  disabled?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  state: 'idle',
  theme: 'dark',
  disabled: false,
});

const emit = defineEmits<{
  copyClick: [];
}>();

const buttonClasses = computed(() => {
  const classes = [props.theme];
  if (props.state !== 'idle') classes.push(props.state);
  return classes.join(' ');
});

const ariaLabel = computed(() => {
  switch (props.state) {
    case 'copied': return 'Copied to clipboard';
    case 'error': return 'Failed to copy';
    default: return 'Copy to clipboard';
  }
});

function onClick(): void {
  if (!props.disabled) {
    emit('copyClick');
  }
}
</script>
