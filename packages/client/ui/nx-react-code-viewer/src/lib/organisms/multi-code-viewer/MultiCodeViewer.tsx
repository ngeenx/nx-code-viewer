import React, { memo, useState, useMemo, useEffect, useCallback } from 'react';
import {
  DEFAULT_MULTI_CODE_VIEWER_CONFIG,
  isCodeTabItem,
  isDiffTabItem,
  type CodeViewerBorderStyle,
  type CodeViewerTheme,
  type MultiCodeViewerTabItem,
  type ShikiThemeName,
  type TabChangeEvent,
} from '@ngeenx/nx-code-viewer-utils';
import { TabBar } from '../../molecules/tab-bar';
import { CodeViewer } from '../code-viewer';
import { DiffViewer } from '../diff-viewer';

interface MultiCodeViewerProps {
  tabs: readonly MultiCodeViewerTabItem[];
  theme?: CodeViewerTheme;
  shikiTheme?: ShikiThemeName;
  borderStyle?: CodeViewerBorderStyle;
  showContentHeader?: boolean;
  initialActiveTabId?: string;
  onActiveTabChange?: (event: TabChangeEvent) => void;
  onCodeCopied?: (tabId: string) => void;
}

export const MultiCodeViewer = memo(function MultiCodeViewer({
  tabs,
  theme = DEFAULT_MULTI_CODE_VIEWER_CONFIG.theme,
  shikiTheme,
  borderStyle = DEFAULT_MULTI_CODE_VIEWER_CONFIG.borderStyle,
  showContentHeader = DEFAULT_MULTI_CODE_VIEWER_CONFIG.showContentHeader,
  initialActiveTabId = '',
  onActiveTabChange,
  onCodeCopied,
}: MultiCodeViewerProps) {
  const [activeTabIdInternal, setActiveTabIdInternal] = useState('');

  useEffect(() => {
    if (initialActiveTabId) {
      setActiveTabIdInternal(initialActiveTabId);
    }
  }, [initialActiveTabId]);

  const activeTabId = useMemo(() => {
    if (activeTabIdInternal) return activeTabIdInternal;
    if (initialActiveTabId) return initialActiveTabId;
    return tabs.length > 0 ? tabs[0].id : '';
  }, [activeTabIdInternal, initialActiveTabId, tabs]);

  const _activeTab = useMemo(() => {
    return tabs.find(tab => tab.id === activeTabId) ?? null;
  }, [tabs, activeTabId]);

  const handleTabChange = useCallback((tabId: string) => {
    const previousId = activeTabId;
    const newIndex = tabs.findIndex(tab => tab.id === tabId);

    if (newIndex >= 0 && tabId !== previousId) {
      setActiveTabIdInternal(tabId);
      onActiveTabChange?.({
        previousTabId: previousId || null,
        currentTabId: tabId,
        currentIndex: newIndex,
      });
    }
  }, [activeTabId, tabs, onActiveTabChange]);

  const handleCodeCopied = useCallback((tabId: string) => {
    onCodeCopied?.(tabId);
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
    <div className="nx-multi-code-viewer">
      <article className={`${theme} border-${borderStyle}`}>
        {borderOverlay}

        <TabBar
          tabs={tabs}
          activeTabId={activeTabId}
          theme={theme}
          onTabChange={handleTabChange}
        />

        <div className="tab-panels">
          {tabs.map(tab => (
            <div
              key={tab.id}
              role="tabpanel"
              id={`panel-${tab.id}`}
              aria-labelledby={`tab-${tab.id}`}
              className={tab.id !== activeTabId ? 'hidden' : 'active'}
            >
              {isCodeTabItem(tab) && (
                <CodeViewer
                  code={tab.code}
                  language={tab.language || 'plaintext'}
                  theme={theme}
                  shikiTheme={shikiTheme}
                  showHeader={showContentHeader}
                  title={tab.fileName}
                  fileExtension={tab.fileExtension || ''}
                  showLineNumbers={tab.showLineNumbers ?? true}
                  showCopyButton={tab.showCopyButton ?? true}
                  maxHeight={tab.maxHeight || ''}
                  wordWrap={tab.wordWrap ?? false}
                  highlightedLines={tab.highlightedLines}
                  borderStyle="none"
                  onCodeCopied={() => handleCodeCopied(tab.id)}
                />
              )}

              {isDiffTabItem(tab) && (
                <DiffViewer
                  diff={tab.diff || ''}
                  oldCode={tab.oldCode || ''}
                  newCode={tab.newCode || ''}
                  language={tab.language || 'plaintext'}
                  theme={theme}
                  shikiTheme={shikiTheme}
                  showHeader={showContentHeader}
                  showLineNumbers={tab.showLineNumbers ?? true}
                  viewMode={tab.viewMode || 'unified'}
                  maxHeight={tab.maxHeight || ''}
                  oldFileName={tab.oldFileName || ''}
                  newFileName={tab.newFileName || ''}
                  fileExtension={tab.fileExtension || ''}
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
