import { memo, useMemo } from 'react';
import type { CopyButtonState, CodeViewerTheme } from '@ngeenx/nx-code-viewer-utils';

interface CopyButtonProps {
  state?: CopyButtonState;
  theme?: CodeViewerTheme;
  disabled?: boolean;
  onCopyClick?: () => void;
}

const CopyIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect width="14" height="14" x="8" y="8" rx="2" ry="2" />
    <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
  </svg>
);

const CheckIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 6 9 17l-5-5" />
  </svg>
);

const XIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 6 6 18" />
    <path d="m6 6 12 12" />
  </svg>
);

export const CopyButton = memo(function CopyButton({
  state = 'idle',
  theme = 'dark',
  disabled = false,
  onCopyClick,
}: CopyButtonProps) {
  const icon = useMemo(() => {
    switch (state) {
      case 'copied': return <CheckIcon />;
      case 'error': return <XIcon />;
      default: return <CopyIcon />;
    }
  }, [state]);

  const buttonClasses = useMemo(() => {
    const classes = [theme];
    if (state !== 'idle') classes.push(state);
    return classes.join(' ');
  }, [theme, state]);

  const ariaLabel = useMemo(() => {
    switch (state) {
      case 'copied': return 'Copied to clipboard';
      case 'error': return 'Failed to copy';
      default: return 'Copy to clipboard';
    }
  }, [state]);

  return (
    <button
      type="button"
      className={buttonClasses}
      disabled={disabled}
      aria-label={ariaLabel}
      onClick={() => !disabled && onCopyClick?.()}
    >
      {icon}
    </button>
  );
});
