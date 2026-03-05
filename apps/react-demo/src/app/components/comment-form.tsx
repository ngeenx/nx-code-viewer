import { useState } from 'react';
import type { LineWidgetContext } from '@ngeenx/nx-react-code-viewer';

interface CommentFormProps extends LineWidgetContext {
  onClose: () => void;
}

export function CommentForm({ lineNumber, line, theme, onClose }: CommentFormProps) {
  const [comment, setComment] = useState('');

  const truncatedLine = (() => {
    const trimmed = line.trim();
    return trimmed.length > 50 ? trimmed.substring(0, 50) + '...' : trimmed;
  })();

  const cancel = () => onClose();

  const submit = () => {
    console.log(`Comment on line ${lineNumber}:`, comment);
    setComment('');
    onClose();
  };

  return (
    <div
      className={`comment-form ${theme}`}
      style={{
        padding: '12px 16px',
        display: 'flex',
        flexDirection: 'column',
        gap: 8,
        background: theme === 'dark' ? '#1f2937' : '#f9fafb',
        color: theme === 'dark' ? '#e5e7eb' : '#1f2937',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, fontSize: 12 }}>
        <span style={{ fontWeight: 600 }}>Comment on line {lineNumber}</span>
        <span
          style={{
            opacity: 0.6,
            fontFamily: 'monospace',
            fontSize: 11,
            maxWidth: 300,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          }}
        >
          {truncatedLine}
        </span>
      </div>
      <textarea
        className="comment-input"
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        placeholder="Add a comment..."
        rows={2}
        style={{
          width: '97%',
          padding: '8px 12px',
          borderRadius: 6,
          fontSize: 13,
          resize: 'vertical',
          minHeight: 60,
          background: theme === 'dark' ? '#374151' : 'white',
          border: `1px solid ${theme === 'dark' ? '#4b5563' : '#d1d5db'}`,
          color: theme === 'dark' ? '#e5e7eb' : '#1f2937',
        }}
      />
      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
        <button
          type="button"
          onClick={cancel}
          style={{
            padding: '6px 12px',
            borderRadius: 6,
            fontSize: 13,
            fontWeight: 500,
            cursor: 'pointer',
            transition: 'all 0.15s ease',
            background: 'transparent',
            border: '1px solid #6b7280',
            color: '#6b7280',
          }}
        >
          Cancel
        </button>
        <button
          type="button"
          onClick={submit}
          style={{
            padding: '6px 12px',
            borderRadius: 6,
            fontSize: 13,
            fontWeight: 500,
            cursor: 'pointer',
            transition: 'all 0.15s ease',
            background: '#6366f1',
            border: '1px solid #6366f1',
            color: 'white',
          }}
        >
          Add Comment
        </button>
      </div>
    </div>
  );
}
