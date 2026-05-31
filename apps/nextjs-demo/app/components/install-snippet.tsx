'use client';

import {
  CodeViewer,
  type CodeViewerLanguage,
} from '@ngeenx/nx-react-code-viewer';
import { useChromeTheme } from '../theme-provider';

const language: CodeViewerLanguage = 'bash';
const install = `pnpm add @ngeenx/nx-react-code-viewer`;

export function InstallSnippet() {
  const { theme, shikiTheme } = useChromeTheme();
  return (
    <CodeViewer
      code={install}
      language={language}
      theme={theme}
      shikiTheme={shikiTheme}
      showLineNumbers={false}
    />
  );
}
