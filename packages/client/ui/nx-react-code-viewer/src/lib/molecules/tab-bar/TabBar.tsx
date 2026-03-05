import { memo, useCallback } from 'react';
import type { CodeViewerTheme, MultiCodeViewerTabItem } from '@ngeenx/nx-code-viewer-utils';
import { TabHeader } from '../../atoms/tab-header';

interface TabBarProps {
  tabs: readonly MultiCodeViewerTabItem[];
  activeTabId: string;
  theme?: CodeViewerTheme;
  onTabChange?: (tabId: string) => void;
}

export const TabBar = memo(function TabBar({
  tabs,
  activeTabId,
  theme = 'dark',
  onTabChange,
}: TabBarProps) {
  const handleTabClick = useCallback((tabId: string) => {
    if (tabId !== activeTabId) {
      onTabChange?.(tabId);
    }
  }, [activeTabId, onTabChange]);

  const handleTabKeydown = useCallback((event: React.KeyboardEvent, currentIndex: number) => {
    let newIndex: number | null = null;

    switch (event.key) {
      case 'ArrowLeft':
        newIndex = currentIndex > 0 ? currentIndex - 1 : tabs.length - 1;
        break;
      case 'ArrowRight':
        newIndex = currentIndex < tabs.length - 1 ? currentIndex + 1 : 0;
        break;
      case 'Home':
        newIndex = 0;
        break;
      case 'End':
        newIndex = tabs.length - 1;
        break;
    }

    if (newIndex !== null) {
      event.preventDefault();
      onTabChange?.(tabs[newIndex].id);
    }
  }, [tabs, onTabChange]);

  return (
    <div className="nx-tab-bar">
      <div role="tablist" className={`tab-list ${theme}`}>
        {tabs.map((tab, i) => (
          <TabHeader
            key={tab.id}
            tabId={tab.id}
            fileName={tab.fileName}
            fileExtension={tab.fileExtension || ''}
            isActive={tab.id === activeTabId}
            theme={theme}
            onTabClick={handleTabClick}
            onTabKeydown={(e) => handleTabKeydown(e, i)}
          />
        ))}
      </div>
    </div>
  );
});
