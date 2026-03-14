<script lang="ts">
  import { onDestroy, type Component } from 'svelte';
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
    onMouseEnter?: () => void;
    onMouseLeave?: () => void;
  }

  let {
    content,
    anchorElement,
    theme = 'dark',
    visible = false,
    matchedText = '',
    captureGroups = [],
    lineNumber = 0,
    onMouseEnter = () => {},
    onMouseLeave = () => {},
  }: Props = $props();

  let hostRef: HTMLElement | null = $state(null);
  let tippyInstance: Instance | null = null;

  const isStringContent = $derived(typeof content === 'string');

  $effect(() => {
    if (visible && anchorElement) {
      requestAnimationFrame(() => {
        createTippy(anchorElement);
      });
    } else {
      destroyTippy();
    }
  });

  function createTippy(anchor: HTMLElement): void {
    const contentEl = hostRef?.querySelector('.popover-content') as HTMLElement | null;
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
      theme: theme === 'dark' ? 'nx-dark' : 'nx-light',
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
          box.addEventListener('mouseenter', () => onMouseEnter());
          box.addEventListener('mouseleave', () => onMouseLeave());
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

  onDestroy(() => {
    destroyTippy();
  });
</script>

<div bind:this={hostRef} class="nx-reference-popover">
  <div class="popover-content">
    {#if isStringContent}
      <span>{content}</span>
    {:else}
      <svelte:component this={content} {matchedText} {captureGroups} {lineNumber} />
    {/if}
  </div>
</div>
