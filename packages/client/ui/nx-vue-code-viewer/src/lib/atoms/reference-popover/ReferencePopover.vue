<template>
  <div ref="hostRef" class="nx-reference-popover">
    <div class="nx-popover-content">
      <span v-if="isStringContent">{{ stringContent }}</span>
      <component
        v-else-if="componentContent"
        :is="componentContent"
        :matchedText="matchedText"
        :captureGroups="captureGroups"
        :lineNumber="lineNumber"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, watch, onUnmounted, ref, type Component } from 'vue';
import type { CodeViewerTheme } from '@ngeenx/nx-code-viewer-utils';
import tippy, { type Instance } from 'tippy.js';

interface Props {
  content: string | Component;
  anchorElement: HTMLElement;
  theme?: CodeViewerTheme;
  visible?: boolean;
  matchedText?: string;
  captureGroups?: readonly string[];
  lineNumber?: number;
}

const props = withDefaults(defineProps<Props>(), {
  theme: 'dark',
  visible: false,
  matchedText: '',
  captureGroups: () => [],
  lineNumber: 0,
});

const emit = defineEmits<{
  mouseEnter: [];
  mouseLeave: [];
}>();

const hostRef = ref<HTMLElement | null>(null);
let tippyInstance: Instance | null = null;

const isStringContent = computed(() => typeof props.content === 'string');
const stringContent = computed(() => (typeof props.content === 'string' ? props.content : ''));
const componentContent = computed(() => (typeof props.content !== 'string' ? props.content : null));

watch(
  [() => props.anchorElement, () => props.visible],
  async ([anchor, isVisible]) => {
    if (isVisible && anchor) {
      // Wait for the next tick so the nx-popover-content DOM is rendered
      await new Promise((resolve) => requestAnimationFrame(resolve));
      createTippy(anchor);
    } else {
      destroyTippy();
    }
  },
  { immediate: true },
);

onUnmounted(() => {
  destroyTippy();
});

function createTippy(anchor: HTMLElement): void {
  const contentEl = hostRef.value?.querySelector('.nx-popover-content') as HTMLElement | null;
  if (!contentEl) return;

  destroyTippy();

  tippyInstance = tippy(anchor, {
    content: contentEl,
    placement: 'top',
    interactive: true,
    trigger: 'manual',
    showOnCreate: true,
    arrow: true,
    appendTo: document.body,
    theme: props.theme === 'dark' ? 'nx-dark' : 'nx-light',
    animation: 'fade',
    offset: [0, 8],
    popperOptions: {
      modifiers: [
        {
          name: 'flip',
          options: {
            fallbackPlacements: ['bottom'],
          },
        },
      ],
    },
    onMount: (instance) => {
      const box = instance.popper.querySelector('.tippy-box');
      if (box) {
        box.addEventListener('mouseenter', () => emit('mouseEnter'));
        box.addEventListener('mouseleave', () => emit('mouseLeave'));
      }
    },
  });
}

function destroyTippy(): void {
  if (tippyInstance) {
    tippyInstance.destroy();
    tippyInstance = null;
  }
}
</script>
