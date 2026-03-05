import { useState } from 'react';
import type { LineWidgetContext } from '@ngeenx/nx-react-code-viewer';

export function BookmarkWidget({ lineNumber, line }: LineWidgetContext) {
  const [isBookmarked, setIsBookmarked] = useState(false);

  const toggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    const next = !isBookmarked;
    setIsBookmarked(next);
    console.log(`Line ${lineNumber} ${next ? 'bookmarked' : 'unbookmarked'}:`, line);
  };

  return (
    <button
      className={`bookmark-btn${isBookmarked ? ' bookmarked' : ''}`}
      title={isBookmarked ? 'Remove bookmark' : `Bookmark line ${lineNumber}`}
      onClick={toggle}
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: 24,
        height: 24,
        padding: 0,
        border: 'none',
        background: 'transparent',
        color: isBookmarked ? '#eab308' : '#6b7280',
        cursor: 'pointer',
        borderRadius: 4,
        transition: 'all 0.15s ease',
      }}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="14"
        height="14"
        viewBox="0 0 24 24"
        fill={isBookmarked ? 'currentColor' : 'none'}
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
      </svg>
    </button>
  );
}
