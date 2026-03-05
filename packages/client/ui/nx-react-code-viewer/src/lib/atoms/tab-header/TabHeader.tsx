import { memo, useMemo } from 'react';
import { getFileIconUrl, type CodeViewerTheme } from '@ngeenx/nx-code-viewer-utils';

interface TabHeaderProps {
  tabId: string;
  fileName: string;
  fileExtension?: string;
  isActive?: boolean;
  theme?: CodeViewerTheme;
  onTabClick?: (tabId: string) => void;
  onTabKeydown?: (event: React.KeyboardEvent) => void;
}

export const TabHeader = memo(function TabHeader({
  tabId,
  fileName,
  fileExtension = '',
  isActive = false,
  theme = 'dark',
  onTabClick,
  onTabKeydown,
}: TabHeaderProps) {
  const iconUrl = useMemo(() => {
    return fileExtension ? getFileIconUrl(fileExtension) : null;
  }, [fileExtension]);

  return (
    <div className="nx-tab-header">
      <button
        type="button"
        role="tab"
        aria-selected={isActive}
        aria-controls={`panel-${tabId}`}
        id={`tab-${tabId}`}
        tabIndex={isActive ? 0 : -1}
        className={`${theme} ${isActive ? 'active' : ''}`}
        onClick={() => onTabClick?.(tabId)}
        onKeyDown={onTabKeydown}
      >
        {iconUrl && (
          <img src={iconUrl} className="file-icon" alt={fileName} />
        )}
        <span className="file-name">{fileName}</span>
      </button>
    </div>
  );
});
