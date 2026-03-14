<script lang="ts">
  import type { CodeViewerTheme } from '@ngeenx/nx-code-viewer-utils';

  interface Props {
    line?: string;
    lineNumber?: number;
    theme?: CodeViewerTheme;
    onClose?: () => void;
  }

  let {
    line = '',
    lineNumber = 0,
    theme = 'dark',
    onClose = () => {},
  }: Props = $props();

  let comment = $state('');

  const truncatedLine = $derived(
    line.trim().length > 50 ? line.trim().substring(0, 50) + '...' : line.trim()
  );

  function cancel(): void {
    onClose();
  }

  function submit(): void {
    console.log(`Comment on line ${lineNumber}:`, comment);
    comment = '';
    onClose();
  }
</script>

<div class="comment-form {theme}">
  <div class="comment-header">
    <span class="comment-label">Comment on line {lineNumber}</span>
    <span class="line-preview">{truncatedLine}</span>
  </div>
  <textarea
    class="comment-input"
    bind:value={comment}
    placeholder="Add a comment..."
    rows="2"
  ></textarea>
  <div class="comment-actions">
    <button class="btn btn-cancel" type="button" onclick={cancel}>Cancel</button>
    <button class="btn btn-submit" type="button" onclick={submit}>Add Comment</button>
  </div>
</div>

<style>
  .comment-form { padding: 12px 16px; display: flex; flex-direction: column; gap: 8px; }
  .comment-form.dark { background: #1f2937; color: #e5e7eb; }
  .comment-form.light { background: #f9fafb; color: #1f2937; }
  .comment-header { display: flex; align-items: center; gap: 12px; font-size: 12px; }
  .comment-label { font-weight: 600; }
  .line-preview { opacity: 0.6; font-family: monospace; font-size: 11px; max-width: 300px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
  .comment-input { width: 97%; padding: 8px 12px; border-radius: 6px; font-size: 13px; resize: vertical; min-height: 60px; }
  .comment-form.dark .comment-input { background: #374151; border: 1px solid #4b5563; color: #e5e7eb; }
  .comment-form.light .comment-input { background: white; border: 1px solid #d1d5db; color: #1f2937; }
  .comment-input:focus { outline: none; border-color: #6366f1; box-shadow: 0 0 0 2px rgba(99, 102, 241, 0.2); }
  .comment-actions { display: flex; justify-content: flex-end; gap: 8px; }
  .btn { padding: 6px 12px; border-radius: 6px; font-size: 13px; font-weight: 500; cursor: pointer; transition: all 0.15s ease; }
  .btn-cancel { background: transparent; border: 1px solid #6b7280; color: #6b7280; }
  .btn-cancel:hover { background: rgba(107, 114, 128, 0.1); }
  .btn-submit { background: #6366f1; border: 1px solid #6366f1; color: white; }
  .btn-submit:hover { background: #4f46e5; border-color: #4f46e5; }
</style>
