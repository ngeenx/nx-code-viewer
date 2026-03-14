<script lang="ts">
  import type { CodeViewerTheme } from '@ngeenx/nx-code-viewer-utils';

  interface Props {
    line?: string;
    lineNumber?: number;
    theme?: CodeViewerTheme;
  }

  let { line = '', lineNumber = 0, theme = 'dark' }: Props = $props();

  let isBookmarked = $state(false);

  function toggle(event: Event): void {
    event.stopPropagation();
    isBookmarked = !isBookmarked;
    console.log(`Line ${lineNumber} ${isBookmarked ? 'bookmarked' : 'unbookmarked'}:`, line);
  }
</script>

<button
  class="bookmark-btn"
  class:bookmarked={isBookmarked}
  title={isBookmarked ? 'Remove bookmark' : `Bookmark line ${lineNumber}`}
  onclick={toggle}
>
  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24"
    fill={isBookmarked ? 'currentColor' : 'none'} stroke="currentColor" stroke-width="2"
    stroke-linecap="round" stroke-linejoin="round">
    <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
  </svg>
</button>

<style>
  .bookmark-btn {
    display: flex; align-items: center; justify-content: center;
    width: 24px; height: 24px; padding: 0; border: none;
    background: transparent; color: #6b7280; cursor: pointer;
    border-radius: 4px; transition: all 0.15s ease;
  }
  .bookmark-btn:hover { background: rgba(99, 102, 241, 0.1); color: #6366f1; }
  .bookmark-btn.bookmarked { color: #eab308; }
  .bookmark-btn.bookmarked:hover { color: #ca8a04; background: rgba(234, 179, 8, 0.1); }
</style>
