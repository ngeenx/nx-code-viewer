import { memo, useMemo, type ComponentType } from 'react';
import type {
  CodeViewerTheme,
  LineWidgetContext,
  LineWidgetPosition,
} from '@ngeenx/nx-code-viewer-utils';

interface LineWidgetHostProps {
  component: ComponentType<any>;
  context: LineWidgetContext;
  position: LineWidgetPosition;
  theme?: CodeViewerTheme;
  onWidgetClick?: () => void;
}

export const LineWidgetHost = memo(function LineWidgetHost({
  component: WidgetComponent,
  context,
  position,
  theme = 'dark',
  onWidgetClick,
}: LineWidgetHostProps) {
  const hostClasses = `line-widget-host ${position} ${theme}`;

  const handleClick = (event: React.MouseEvent) => {
    event.stopPropagation();
    onWidgetClick?.();
  };

  const handleKeydown = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      event.stopPropagation();
      onWidgetClick?.();
    }
  };

  return (
    <div className="nx-line-widget-host">
      <div
        className={hostClasses}
        role="button"
        tabIndex={0}
        onClick={handleClick}
        onKeyDown={handleKeydown}
      >
        <WidgetComponent {...context} />
      </div>
    </div>
  );
});
