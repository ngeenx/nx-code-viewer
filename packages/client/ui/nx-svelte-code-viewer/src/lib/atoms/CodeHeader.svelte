<script lang="ts">
  import {
    getLanguageDisplayName,
    getFileIconUrl,
    getExtensionFromLanguage,
    type CodeViewerLanguage,
    type CodeViewerTheme,
  } from '@ngeenx/nx-code-viewer-utils';

  interface Props {
    language?: CodeViewerLanguage;
    title?: string;
    theme?: CodeViewerTheme;
    fileExtension?: string;
  }

  let {
    language = 'plaintext',
    title = '',
    theme = 'dark',
    fileExtension = '',
  }: Props = $props();

  const displayText = $derived(title || getLanguageDisplayName(language));

  const iconUrl = $derived.by(() => {
    const ext = fileExtension || getExtensionFromLanguage(language);
    return ext ? getFileIconUrl(ext) : null;
  });
</script>

<div class="nx-code-header">
  <header class={theme}>
    <div class="title-container">
      {#if iconUrl}
        <img src={iconUrl} class="file-icon" alt={title} />
      {/if}
      <span class="title">{displayText}</span>
    </div>
  </header>
</div>
