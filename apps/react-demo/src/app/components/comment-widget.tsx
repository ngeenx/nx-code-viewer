import type { LineWidgetContext } from '@ngeenx/nx-react-code-viewer';

export function CommentWidget({ lineNumber }: LineWidgetContext) {
  return (
    <button
      className="comment-btn"
      title={`Add comment to line ${lineNumber}`}
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: 24,
        height: 24,
        padding: 0,
        border: 'none',
        background: 'transparent',
        color: '#6b7280',
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
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
        <line x1="9" y1="9" x2="15" y2="9" />
        <line x1="12" y1="12" x2="15" y2="12" />
      </svg>
    </button>
  );
}
