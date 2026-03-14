<script lang="ts">
  import type { CodeViewerTheme, DiffCollapsedRange } from '@ngeenx/nx-code-viewer-utils';

  interface Props {
    theme?: CodeViewerTheme;
    range: DiffCollapsedRange;
    hiddenCount: number;
    showLineNumbers?: boolean;
    showPrefix?: boolean;
    isExpanded?: boolean;
    onToggle?: () => void;
  }

  let {
    theme = 'dark',
    range,
    hiddenCount,
    showLineNumbers = true,
    showPrefix = true,
    isExpanded = false,
    onToggle = () => {},
  }: Props = $props();

  const indicatorClasses = $derived(`diff-collapsed-indicator ${theme}`);
  const displayText = $derived(hiddenCount === 1 ? '1 line' : `${hiddenCount} lines`);
  const ariaLabel = $derived(
    isExpanded
      ? `Collapse ${hiddenCount} ${hiddenCount === 1 ? 'line' : 'lines'}`
      : `Expand ${hiddenCount} hidden ${hiddenCount === 1 ? 'line' : 'lines'}`
  );
</script>

<div class="nx-diff-collapsed-indicator">
  <div
    class={indicatorClasses}
    role="button"
    tabindex="0"
    aria-label={ariaLabel}
    onclick={onToggle}
    onkeydown={(e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        onToggle();
      }
    }}
  >
    {#if showLineNumbers}
      <span class="line-number old"></span>
      <span class="line-number new"></span>
    {/if}
    {#if showPrefix}
      <span class="prefix">
        <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m7 15 5 5 5-5" /><path d="m7 9 5-5 5 5" /></svg>
      </span>
    {/if}
    <span class="content">... {displayText}</span>
  </div>
</div>
