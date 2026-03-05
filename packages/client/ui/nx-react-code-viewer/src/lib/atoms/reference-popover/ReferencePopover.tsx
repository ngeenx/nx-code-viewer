import { memo, useEffect, useRef, type ComponentType } from 'react';
import type { CodeViewerTheme } from '@ngeenx/nx-code-viewer-utils';
import tippy, { type Instance } from 'tippy.js';

interface ReferencePopoverProps {
  content: string | ComponentType<any>;
  anchorElement: HTMLElement;
  theme?: CodeViewerTheme;
  visible?: boolean;
  matchedText?: string;
  captureGroups?: readonly string[];
  lineNumber?: number;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
}

export const ReferencePopover = memo(function ReferencePopover({
  content,
  anchorElement,
  theme = 'dark',
  visible = false,
  matchedText = '',
  captureGroups = [],
  lineNumber = 0,
  onMouseEnter,
  onMouseLeave,
}: ReferencePopoverProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const tippyRef = useRef<Instance | null>(null);

  const isStringContent = typeof content === 'string';
  const ContentComponent = !isStringContent ? content as ComponentType<any> : null;

  useEffect(() => {
    if (!visible || !anchorElement || !containerRef.current) {
      if (tippyRef.current) {
        tippyRef.current.destroy();
        tippyRef.current = null;
      }
      return;
    }

    const contentEl = containerRef.current.querySelector('.popover-content') as HTMLElement | null;
    if (!contentEl) return;

    if (tippyRef.current) {
      tippyRef.current.destroy();
    }

    tippyRef.current = tippy(anchorElement, {
      content: contentEl,
      placement: 'top',
      interactive: true,
      trigger: 'manual',
      showOnCreate: true,
      arrow: true,
      appendTo: document.body,
      theme: theme === 'dark' ? 'nx-dark' : 'nx-light',
      animation: 'fade',
      offset: [0, 8],
      popperOptions: {
        modifiers: [
          {
            name: 'flip',
            options: {
              fallbackPlacements: ['bottom'],
            },
          },
        ],
      },
      onMount: (instance) => {
        const box = instance.popper.querySelector('.tippy-box');
        if (box) {
          box.addEventListener('mouseenter', () => onMouseEnter?.());
          box.addEventListener('mouseleave', () => onMouseLeave?.());
        }
      },
    });

    return () => {
      if (tippyRef.current) {
        tippyRef.current.destroy();
        tippyRef.current = null;
      }
    };
  }, [visible, anchorElement, theme, onMouseEnter, onMouseLeave]);

  return (
    <div className="nx-reference-popover" ref={containerRef}>
      <div className="popover-content">
        {isStringContent ? (
          <span>{content as string}</span>
        ) : ContentComponent ? (
          <ContentComponent
            matchedText={matchedText}
            captureGroups={captureGroups}
            lineNumber={lineNumber}
          />
        ) : null}
      </div>
    </div>
  );
});
