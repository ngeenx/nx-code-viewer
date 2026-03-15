import React, { memo, useMemo, useCallback } from 'react';
import {
  DEFAULT_COLUMN_CODE_VIEWER_CONFIG,
  isColumnCodeItem,
  isColumnDiffItem,
  type CodeViewerBorderStyle,
  type CodeViewerTheme,
  type ColumnItem,
  type ShikiThemeName,
} from '@ngeenx/nx-code-viewer-utils';
import { CodeViewer } from '../code-viewer';
import { DiffViewer } from '../diff-viewer';

interface ColumnCodeViewerProps {
  columns: readonly ColumnItem[];
  theme?: CodeViewerTheme;
  shikiTheme?: ShikiThemeName;
  borderStyle?: CodeViewerBorderStyle;
  showColumnHeaders?: boolean;
  maxHeight?: string;
  enableLineHover?: boolean;
  onCodeCopied?: (columnId: string) => void;
}

export const ColumnCodeViewer = memo(function ColumnCodeViewer({
  columns,
  theme = DEFAULT_COLUMN_CODE_VIEWER_CONFIG.theme,
  shikiTheme,
  borderStyle = DEFAULT_COLUMN_CODE_VIEWER_CONFIG.borderStyle,
  showColumnHeaders = DEFAULT_COLUMN_CODE_VIEWER_CONFIG.showColumnHeaders,
  maxHeight = '',
  enableLineHover = true,
  onCodeCopied,
}: ColumnCodeViewerProps) {
  const handleCodeCopied = useCallback((columnId: string) => {
    onCodeCopied?.(columnId);
  }, [onCodeCopied]);

  const borderOverlay = useMemo(() => {
    if (borderStyle === 'grid-cross') {
      return (
        <div className="border-overlay">
          <div className="border-top" />
          <div className="border-bottom" />
          <div className="border-left" />
          <div className="border-right" />
          <div className="corner-cross corner-top-left-h" />
          <div className="corner-cross corner-top-left-v" />
          <div className="corner-cross corner-top-right-h" />
          <div className="corner-cross corner-top-right-v" />
          <div className="corner-cross corner-bottom-left-h" />
          <div className="corner-cross corner-bottom-left-v" />
          <div className="corner-cross corner-bottom-right-h" />
          <div className="corner-cross corner-bottom-right-v" />
        </div>
      );
    }
    if (borderStyle === 'corner-intersection') {
      return (
        <div className="border-overlay">
          <div className="border-top-extended" />
          <div className="border-bottom-extended" />
          <div className="border-left-extended" />
          <div className="border-right-extended" />
        </div>
      );
    }
    return null;
  }, [borderStyle]);

  return (
    <div className="nx-column-code-viewer">
      <article className={`${theme} border-${borderStyle}`}>
        {borderOverlay}

        <div className="columns-container">
          {columns.map((column, index) => (
            <div
              key={column.id}
              className={`column${index < columns.length - 1 ? ' column-divider' : ''}`}
            >
              {isColumnCodeItem(column) && (
                <CodeViewer
                  code={column.code}
                  language={column.language || 'plaintext'}
                  theme={theme}
                  shikiTheme={shikiTheme}
                  showHeader={showColumnHeaders}
                  title={column.title || ''}
                  fileExtension={column.fileExtension || ''}
                  showLineNumbers={column.showLineNumbers ?? true}
                  showCopyButton={column.showCopyButton ?? true}
                  maxHeight={maxHeight}
                  wordWrap={column.wordWrap ?? false}
                  enableLineHover={enableLineHover}
                  highlightedLines={column.highlightedLines}
                  borderStyle="none"
                  onCodeCopied={() => handleCodeCopied(column.id)}
                />
              )}

              {isColumnDiffItem(column) && (
                <DiffViewer
                  diff={column.diff || ''}
                  oldCode={column.oldCode || ''}
                  newCode={column.newCode || ''}
                  language={column.language || 'plaintext'}
                  theme={theme}
                  shikiTheme={shikiTheme}
                  showHeader={showColumnHeaders}
                  showLineNumbers={column.showLineNumbers ?? true}
                  viewMode={column.viewMode || 'unified'}
                  maxHeight={maxHeight}
                  oldFileName={column.oldFileName || ''}
                  newFileName={column.newFileName || ''}
                  fileExtension={column.fileExtension || ''}
                  borderStyle="none"
                />
              )}
            </div>
          ))}
        </div>
      </article>
    </div>
  );
});
