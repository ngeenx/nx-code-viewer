<script lang="ts">
  import CodeViewer from './organisms/CodeViewer.svelte';
  import {
    DEFAULT_CODE_VIEWER_CONFIG,
    type CodeViewerBorderStyle,
    type CodeViewerLanguage,
    type CodeViewerTheme,
    type CollapsedLinesInput,
    type CollapsedRangeToggleEvent,
    type FocusedLinesInput,
    type HighlightedLinesInput,
    type ProcessedReference,
    type ReferenceConfig,
    type ReferenceHoverEvent,
    type ShikiThemeName,
  } from '@ngeenx/nx-code-viewer-utils';
  import type { SvelteLineWidgetsInput, SvelteLineWidgetClickEvent } from './types/svelte-code-viewer.types';

  interface Props {
    code: string | string[];
    language?: CodeViewerLanguage;
    theme?: CodeViewerTheme;
    shikiTheme?: ShikiThemeName;
    title?: string;
    showLineNumbers?: boolean;
    enableLineHover?: boolean;
    showCopyButton?: boolean;
    showHeader?: boolean;
    maxHeight?: string;
    wordWrap?: boolean;
    fileExtension?: string;
    highlightedLines?: HighlightedLinesInput;
    focusedLines?: FocusedLinesInput;
    collapsedLines?: CollapsedLinesInput;
    borderStyle?: CodeViewerBorderStyle;
    references?: readonly ReferenceConfig[];
    maxCodeLength?: number;
    lineWidgets?: SvelteLineWidgetsInput;
    onCodeCopied?: () => void;
    onReferenceClick?: (reference: ProcessedReference) => void;
    onReferenceHover?: (event: ReferenceHoverEvent) => void;
    onCollapsedRangeToggle?: (event: CollapsedRangeToggleEvent) => void;
    onLineWidgetClick?: (event: SvelteLineWidgetClickEvent) => void;
  }

  let {
    code,
    language = DEFAULT_CODE_VIEWER_CONFIG.language,
    theme = DEFAULT_CODE_VIEWER_CONFIG.theme,
    shikiTheme = undefined,
    title = DEFAULT_CODE_VIEWER_CONFIG.title,
    showLineNumbers = DEFAULT_CODE_VIEWER_CONFIG.showLineNumbers,
    enableLineHover = DEFAULT_CODE_VIEWER_CONFIG.enableLineHover,
    showCopyButton = DEFAULT_CODE_VIEWER_CONFIG.showCopyButton,
    showHeader = DEFAULT_CODE_VIEWER_CONFIG.showHeader,
    maxHeight = DEFAULT_CODE_VIEWER_CONFIG.maxHeight,
    wordWrap = DEFAULT_CODE_VIEWER_CONFIG.wordWrap,
    fileExtension = '',
    highlightedLines = undefined,
    focusedLines = undefined,
    collapsedLines = undefined,
    borderStyle = 'classic' as CodeViewerBorderStyle,
    references = [] as readonly ReferenceConfig[],
    maxCodeLength = 500_000,
    lineWidgets = [] as SvelteLineWidgetsInput,
    onCodeCopied = () => {},
    onReferenceClick = () => {},
    onReferenceHover = () => {},
    onCollapsedRangeToggle = () => {},
    onLineWidgetClick = () => {},
  }: Props = $props();
</script>

<CodeViewer
  {code}
  {language}
  {theme}
  {shikiTheme}
  {title}
  {showLineNumbers}
  {enableLineHover}
  {showCopyButton}
  {showHeader}
  {maxHeight}
  {wordWrap}
  {fileExtension}
  {highlightedLines}
  {focusedLines}
  {collapsedLines}
  {borderStyle}
  {references}
  {maxCodeLength}
  {lineWidgets}
  {onCodeCopied}
  {onReferenceClick}
  {onReferenceHover}
  {onCollapsedRangeToggle}
  {onLineWidgetClick}
/>
