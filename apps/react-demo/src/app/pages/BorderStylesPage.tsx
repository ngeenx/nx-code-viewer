import { CodeViewer, type CodeViewerBorderStyle } from '@ngeenx/nx-react-code-viewer';
import { useTheme } from '../hooks/useTheme';

const borderStyles: CodeViewerBorderStyle[] = [
  'classic',
  'grid-cross',
  'corner-intersection',
  'none',
];

const borderStyleCode = `function greet(name: string): string {
  return \`Hello, \${name}!\`;
}

console.log(greet('World'));`;

export default function BorderStylesPage() {
  const { theme, getResolvedShikiTheme } = useTheme();

  return (
    <div className={`page-container ${theme}`}>
      <header className="page-header">
        <h1 className="page-title">Border Styles</h1>
        <p className="page-description">
          Choose from different border style variants to match your design aesthetic:
          classic, grid-cross, corner-intersection, and none.
        </p>
      </header>

      <section className="demo-section">
        <h2 className="demo-section-title">Available Border Styles</h2>
        {borderStyles.map((borderStyle) => (
          <div key={borderStyle} className="demo-item">
            <h3 className="demo-item-subtitle">{borderStyle}</h3>
            <CodeViewer
              code={borderStyleCode}
              language="typescript"
              theme={theme}
              shikiTheme={getResolvedShikiTheme()}
              borderStyle={borderStyle}
              showHeader={false}
              showLineNumbers={false}
            />
          </div>
        ))}
      </section>
    </div>
  );
}
