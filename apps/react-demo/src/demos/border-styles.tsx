import {
  CodeViewer,
  type CodeViewerBorderStyle,
} from '@ngeenx/nx-react-code-viewer';
import { useDemoOptions } from './_shared/useDemoOptions';

const borderStyles: CodeViewerBorderStyle[] = [
  'classic',
  'grid-cross',
  'corner-intersection',
  'none',
];

const sample = `function greet(name: string): string {
  return \`Hello, \${name}!\`;
}

console.log(greet('World'));`;

const captionStyle: React.CSSProperties = {
  marginBottom: '0.5rem',
  fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, monospace',
  fontSize: '1rem',
  textAlign: 'center',
  fontWeight: 600,
  textTransform: 'uppercase',
  lineHeight: 1,
  letterSpacing: '0.04em',
  textDecoration: 'underline',
  textDecorationThickness: '1px',
  color: 'color-mix(in oklab, currentColor 65%, transparent)',
};

export default function BorderStylesDemo() {
  const { theme, shikiTheme, codeViewerThemeClass } = useDemoOptions();
  return (
    <div
      className={codeViewerThemeClass}
      style={{ margin: '5rem', display: 'grid', gap: '1.25rem' }}
      data-theme={theme}
    >
      {borderStyles.map((borderStyle) => (
        <figure key={borderStyle} style={{ margin: 0 }}>
          <figcaption style={captionStyle}>{borderStyle}</figcaption>
          <CodeViewer
            code={sample}
            language="typescript"
            theme={theme}
            shikiTheme={shikiTheme}
            borderStyle={borderStyle}
            showHeader={false}
            showLineNumbers={false}
          />
        </figure>
      ))}
    </div>
  );
}
