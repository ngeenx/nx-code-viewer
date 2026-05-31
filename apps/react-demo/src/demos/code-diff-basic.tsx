import { useState } from 'react';
import { DiffViewer, type DiffViewMode } from '@ngeenx/nx-react-code-viewer';
import { useDemoOptions } from './_shared/useDemoOptions';

const oldCode = `interface User {
  id: number;
  name: string;
}

function getUser(id: number): User {
  return { id, name: 'John' };
}`;

const newCode = `interface User {
  id: number;
  name: string;
  email: string;
  createdAt: Date;
}

function getUser(id: number): User | null {
  if (id <= 0) return null;
  return {
    id,
    name: 'John',
    email: 'john@example.com',
    createdAt: new Date()
  };
}`;

const toggleStyle: React.CSSProperties = {
  alignSelf: 'flex-start',
  padding: '0.4rem 0.8rem',
  border: '1px solid currentColor',
  borderRadius: 6,
  background: 'transparent',
  color: 'inherit',
  cursor: 'pointer',
  font: 'inherit',
};

export default function CodeDiffBasicDemo() {
  const { theme, shikiTheme, codeViewerThemeClass } = useDemoOptions();
  const [viewMode, setViewMode] = useState<DiffViewMode>('unified');

  return (
    <div
      className={`crylith-demo-stage ${codeViewerThemeClass}`}
      style={{ width: 720, display: 'flex', flexDirection: 'column', gap: '0.75rem' }}
    >
      <button
        type="button"
        style={toggleStyle}
        onClick={() => setViewMode((m) => (m === 'unified' ? 'split' : 'unified'))}
      >
        Switch to {viewMode === 'unified' ? 'Split' : 'Unified'} View
      </button>
      <DiffViewer
        oldCode={oldCode}
        newCode={newCode}
        language="typescript"
        theme={theme}
        shikiTheme={shikiTheme}
        viewMode={viewMode}
        showLineNumbers={true}
        showHeader={true}
        fileExtension="ts"
        oldFileName="user.ts"
        newFileName="user.ts"
      />
    </div>
  );
}
