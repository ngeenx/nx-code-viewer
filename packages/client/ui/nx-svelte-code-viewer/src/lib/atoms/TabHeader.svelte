<script lang="ts">
  import { getFileIconUrl, type CodeViewerTheme } from '@ngeenx/nx-code-viewer-utils';

  interface Props {
    tabId: string;
    fileName: string;
    fileExtension?: string;
    isActive?: boolean;
    theme?: CodeViewerTheme;
    onTabClick?: (tabId: string) => void;
    onTabKeydown?: (event: KeyboardEvent) => void;
  }

  let {
    tabId,
    fileName,
    fileExtension = '',
    isActive = false,
    theme = 'dark',
    onTabClick = () => {},
    onTabKeydown = () => {},
  }: Props = $props();

  const iconUrl = $derived(fileExtension ? getFileIconUrl(fileExtension) : null);
</script>

<div class="nx-tab-header">
  <button
    type="button"
    role="tab"
    aria-selected={isActive}
    aria-controls="panel-{tabId}"
    id="tab-{tabId}"
    tabindex={isActive ? 0 : -1}
    class="{theme} {isActive ? 'active' : ''}"
    onclick={() => onTabClick(tabId)}
    onkeydown={onTabKeydown}
  >
    {#if iconUrl}
      <img src={iconUrl} class="file-icon" alt={fileName} />
    {/if}
    <span class="file-name">{fileName}</span>
  </button>
</div>
