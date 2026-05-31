import { CodeViewer } from '@ngeenx/nx-react-code-viewer';
import { useDemoOptions } from './_shared/useDemoOptions';

const sample = `pnpm install @ngeenx/nx-react-code-viewer`;

export default function CodeViewerCompactDemo() {
  const { theme, shikiTheme, codeViewerThemeClass } = useDemoOptions();
  return (
    <div className={`crylith-demo-stage ${codeViewerThemeClass}`} style={{ width: 500 }}>
      <CodeViewer
        code={sample}
        language="bash"
        theme={theme}
        shikiTheme={shikiTheme}
        showHeader={false}
        showLineNumbers={false}
      />
    </div>
  );
}
