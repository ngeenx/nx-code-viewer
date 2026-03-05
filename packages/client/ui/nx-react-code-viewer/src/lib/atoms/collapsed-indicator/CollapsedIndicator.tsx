import { memo, useMemo } from 'react';
import type { CodeViewerTheme, LineRange } from '@ngeenx/nx-code-viewer-utils';

interface CollapsedIndicatorProps {
  theme?: CodeViewerTheme;
  range: LineRange;
  hiddenCount: number;
  isExpanded?: boolean;
  onToggle?: () => void;
}

export const CollapsedIndicator = memo(function CollapsedIndicator({
  theme = 'dark',
  range,
  hiddenCount,
  isExpanded = false,
  onToggle,
}: CollapsedIndicatorProps) {
  const displayText = useMemo(() => {
    return hiddenCount === 1 ? '1 line' : `${hiddenCount} lines`;
  }, [hiddenCount]);

  const ariaLabel = useMemo(() => {
    const lines = hiddenCount === 1 ? 'line' : 'lines';
    return isExpanded
      ? `Collapse ${hiddenCount} ${lines}`
      : `Expand ${hiddenCount} hidden ${lines}`;
  }, [hiddenCount, isExpanded]);

  const handleKeydown = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      onToggle?.();
    }
  };

  return (
    <div className="nx-collapsed-indicator">
      <div
        className={`collapsed-indicator ${theme} ${isExpanded ? 'expanded' : ''}`}
        role="button"
        tabIndex={0}
        aria-expanded={isExpanded}
        aria-label={ariaLabel}
        onClick={onToggle}
        onKeyDown={handleKeydown}
      >
        <span className="expand-icon">
          <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="m7 15 5 5 5-5" />
            <path d="m7 9 5-5 5 5" />
          </svg>
        </span>
        <span className="collapse-text"> ... {displayText} </span>
      </div>
    </div>
  );
});
