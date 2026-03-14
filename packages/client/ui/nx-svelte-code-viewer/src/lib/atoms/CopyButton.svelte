<script lang="ts">
  import type { CopyButtonState, CodeViewerTheme } from '@ngeenx/nx-code-viewer-utils';

  interface Props {
    state?: CopyButtonState;
    theme?: CodeViewerTheme;
    disabled?: boolean;
    onCopyClick?: () => void;
  }

  let {
    state = 'idle',
    theme = 'dark',
    disabled = false,
    onCopyClick = () => {},
  }: Props = $props();

  const ariaLabel = $derived(
    state === 'copied' ? 'Copied!' : state === 'error' ? 'Copy failed' : 'Copy code'
  );

  const buttonClasses = $derived(
    `nx-copy-button ${theme} ${state}`
  );
</script>

<button
  type="button"
  class={buttonClasses}
  {disabled}
  aria-label={ariaLabel}
  onclick={onCopyClick}
>
  {#if state === 'copied'}
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
  {:else if state === 'error'}
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
  {:else}
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>
  {/if}
</button>
