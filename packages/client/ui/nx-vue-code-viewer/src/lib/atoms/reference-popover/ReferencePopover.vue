<template>
  <div
    v-if="visible"
    class="popover-container"
    :class="theme"
    :style="{ top: positionStyles.top, left: positionStyles.left }"
    @mouseenter="onMouseEnter"
    @mouseleave="onMouseLeave"
  >
    <div
      class="popover-arrow"
      :class="{
        'arrow-up': positionStyles.arrowDirection === 'up',
        'arrow-down': positionStyles.arrowDirection === 'down',
      }"
      :style="{ left: positionStyles.arrowLeft }"
    />
    <div class="popover-content">
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
import { computed, ref, watch, nextTick, type Component } from 'vue';
import type { CodeViewerTheme } from '@ngeenx/nx-code-viewer-utils';

interface PopoverStyles {
  top: string;
  left: string;
  arrowLeft?: string;
  arrowDirection: 'up' | 'down';
}

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

const positionStyles = ref<PopoverStyles>({ top: '0px', left: '0px', arrowDirection: 'down' });

const isStringContent = computed(() => typeof props.content === 'string');
const stringContent = computed(() => (typeof props.content === 'string' ? props.content : ''));
const componentContent = computed(() => (typeof props.content !== 'string' ? props.content : null));

watch([() => props.anchorElement, () => props.visible], async ([, isVisible]) => {
  if (isVisible && props.anchorElement) {
    await nextTick();
    updatePosition();
  }
});

function updatePosition(): void {
  const anchor = props.anchorElement;
  if (!anchor) return;

  const popover = document.querySelector('.popover-container') as HTMLElement | null;
  if (!popover) return;

  const anchorRect = anchor.getBoundingClientRect();
  const popoverRect = popover.getBoundingClientRect();
  const viewportHeight = window.innerHeight;
  const viewportWidth = window.innerWidth;

  const spaceBelow = viewportHeight - anchorRect.bottom;
  const position = anchorRect.top > spaceBelow && spaceBelow < popoverRect.height + 8 ? 'above' : 'below';

  let top = position === 'above' ? anchorRect.top - popoverRect.height - 8 : anchorRect.bottom + 8;
  let left = anchorRect.left + anchorRect.width / 2 - popoverRect.width / 2;

  const padding = 8;
  left = Math.max(padding, Math.min(left, viewportWidth - popoverRect.width - padding));
  top = Math.max(padding, top);

  const arrowLeft = anchorRect.left + anchorRect.width / 2 - left;

  positionStyles.value = {
    top: `${top}px`,
    left: `${left}px`,
    arrowLeft: `${arrowLeft}px`,
    arrowDirection: position === 'above' ? 'down' : 'up',
  };
}

function onMouseEnter(): void {
  emit('mouseEnter');
}

function onMouseLeave(): void {
  emit('mouseLeave');
}
</script>
