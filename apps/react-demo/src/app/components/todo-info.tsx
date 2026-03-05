interface TodoInfoProps {
  matchedText?: string;
  captureGroups?: readonly string[];
  lineNumber?: number;
}

export function TodoInfo({ matchedText = '', lineNumber = 0 }: TodoInfoProps) {
  return (
    <div style={{ minWidth: 200 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
        <span style={{ fontSize: '1.25rem' }}>📝</span>
        <strong>TODO Item</strong>
      </div>
      <p
        style={{
          fontFamily: 'monospace',
          background: 'rgba(255, 255, 255, 0.1)',
          padding: '0.25rem 0.5rem',
          borderRadius: '0.25rem',
          margin: '0.5rem 0',
        }}
      >
        {matchedText}
      </p>
      <p style={{ fontSize: '0.875rem', opacity: 0.8, margin: '0.5rem 0' }}>
        This task needs to be completed. Found on line {lineNumber}.
      </p>
      <div style={{ marginTop: '0.5rem' }}>
        <span
          style={{
            fontSize: '0.75rem',
            padding: '0.125rem 0.5rem',
            borderRadius: 9999,
            background: '#f59e0b',
            color: '#000',
          }}
        >
          Priority: Medium
        </span>
      </div>
    </div>
  );
}
