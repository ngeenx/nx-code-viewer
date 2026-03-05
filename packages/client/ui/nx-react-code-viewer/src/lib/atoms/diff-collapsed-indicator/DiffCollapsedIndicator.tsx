import { memo, useMemo } from 'react';
import type { CodeViewerTheme, DiffCollapsedRange } from '@ngeenx/nx-code-viewer-utils';

interface DiffCollapsedIndicatorProps {
  theme?: CodeViewerTheme;
  range: DiffCollapsedRange;
  hiddenCount: number;
  showLineNumbers?: boolean;
  showPrefix?: boolean;
  isExpanded?: boolean;
  onToggle?: () => void;
}

export const DiffCollapsedIndicator = memo(function DiffCollapsedIndicator({
  theme = 'dark',
  range,
  hiddenCount,
  showLineNumbers = true,
  showPrefix = true,
  isExpanded = false,
  onToggle,
}: DiffCollapsedIndicatorProps) {
  const indicatorClasses = `diff-collapsed-indicator ${theme}`;

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
    <div className="nx-diff-collapsed-indicator">
      <div
        className={indicatorClasses}
        role="button"
        tabIndex={0}
        aria-expanded={isExpanded}
        aria-label={ariaLabel}
        onClick={onToggle}
        onKeyDown={handleKeydown}
      >
        {showLineNumbers && (
          <>
            <span className="line-number old" />
            <span className="line-number new" />
          </>
        )}
        {showPrefix && (
          <span className="prefix">
            <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="m7 15 5 5 5-5" />
              <path d="m7 9 5-5 5 5" />
            </svg>
          </span>
        )}
        <span className="content"> ... {displayText} </span>
      </div>
    </div>
  );
});
