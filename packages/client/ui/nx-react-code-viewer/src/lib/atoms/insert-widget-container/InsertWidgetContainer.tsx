import { memo, type ComponentType } from 'react';
import type { CodeViewerTheme, LineWidgetContext } from '@ngeenx/nx-code-viewer-utils';

interface InsertWidgetContainerProps {
  component: ComponentType<any>;
  context: LineWidgetContext;
  theme?: CodeViewerTheme;
  onClose?: () => void;
}

export const InsertWidgetContainer = memo(function InsertWidgetContainer({
  component: WidgetComponent,
  context,
  theme = 'dark',
  onClose,
}: InsertWidgetContainerProps) {
  const containerClasses = `insert-widget-container ${theme}`;

  return (
    <div className="nx-insert-widget-container">
      <div className={containerClasses}>
        <WidgetComponent {...context} onClose={onClose} />
      </div>
    </div>
  );
});
