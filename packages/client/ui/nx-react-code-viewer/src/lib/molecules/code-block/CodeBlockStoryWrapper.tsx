import React, { useState, useEffect } from 'react';
import { CodeBlock } from './CodeBlock';
import { countLines, type CodeViewerTheme, type CopyButtonState } from '@ngeenx/nx-code-viewer-utils';
import { useCodeHighlighter } from '../../hooks';

interface Props {
  code?: string;
  theme?: CodeViewerTheme;
  showLineNumbers?: boolean;
  wordWrap?: boolean;
  maxHeight?: string;
  isLoading?: boolean;
  showCopyButton?: boolean;
  copyState?: CopyButtonState;
  highlightedLinesSet?: Set<number>;
}

export function CodeBlockStoryWrapper({
  code = '',
  theme = 'dark',
  showLineNumbers = true,
  wordWrap = false,
  maxHeight = '',
  isLoading = false,
  showCopyButton = true,
  copyState = 'idle',
  highlightedLinesSet = new Set<number>(),
}: Props) {
  const highlighter = useCodeHighlighter();
  const [highlightedHtml, setHighlightedHtml] = useState<string | null>(null);
  const lineCount = countLines(code);

  useEffect(() => {
    if (!code) { setHighlightedHtml(null); return; }
    highlighter.highlightToHtml({ code, language: 'typescript', theme }).then(result => {
      setHighlightedHtml(result.html);
    });
  }, [code, theme]);

  return (
    <CodeBlock
      content={highlightedHtml}
      lineCount={lineCount}
      theme={theme}
      showLineNumbers={showLineNumbers}
      wordWrap={wordWrap}
      maxHeight={maxHeight}
      isLoading={isLoading}
      showCopyButton={showCopyButton}
      copyState={copyState}
      onCopyClick={() => console.log('Copy clicked')}
      highlightedLinesSet={highlightedLinesSet}
    />
  );
}
