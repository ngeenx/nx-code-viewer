import { memo, useEffect, useRef, type ComponentType } from 'react';
import { createRoot, type Root } from 'react-dom/client';
import React from 'react';
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
  const tippyRef = useRef<Instance | null>(null);
  const rootRef = useRef<Root | null>(null);

  const isStringContent = typeof content === 'string';

  useEffect(() => {
    if (!visible || !anchorElement) {
      if (tippyRef.current) {
        tippyRef.current.destroy();
        tippyRef.current = null;
      }
      if (rootRef.current) {
        rootRef.current.unmount();
        rootRef.current = null;
      }
      return;
    }

    // Create a detached container for tippy content
    const contentContainer = document.createElement('div');
    contentContainer.className = 'nx-popover-content';

    if (isStringContent) {
      contentContainer.textContent = content as string;
    } else {
      const ContentComponent = content as ComponentType<any>;
      rootRef.current = createRoot(contentContainer);
      rootRef.current.render(
        React.createElement(ContentComponent, {
          matchedText,
          captureGroups,
          lineNumber,
        })
      );
    }

    if (tippyRef.current) {
      tippyRef.current.destroy();
    }

    tippyRef.current = tippy(anchorElement, {
      content: contentContainer,
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
      if (rootRef.current) {
        rootRef.current.unmount();
        rootRef.current = null;
      }
    };
  }, [visible, anchorElement, theme, content, matchedText, captureGroups, lineNumber, isStringContent, onMouseEnter, onMouseLeave]);

  // No visible DOM needed - tippy manages its own DOM
  return <div className="nx-reference-popover" />;
});
