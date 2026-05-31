import { CodeViewer } from '@ngeenx/nx-react-code-viewer';
import { useDemoOptions } from './_shared/useDemoOptions';

const sample = `export const greet = (name: string): string =>
  \`Hello, \${name}!\`;
`;

export default function CodeViewerWithTitleDemo() {
  const { theme, shikiTheme, codeViewerThemeClass } = useDemoOptions();
  return (
    <div className={`crylith-demo-stage ${codeViewerThemeClass}`} style={{ width: 500 }}>
      <CodeViewer
        code={sample}
        language="typescript"
        theme={theme}
        shikiTheme={shikiTheme}
        title="greet.ts"
        fileExtension="ts"
      />
    </div>
  );
}
