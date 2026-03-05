import { CodeViewer, DiffViewer } from '@ngeenx/nx-react-code-viewer';
import { useTheme } from '../hooks/useTheme';

interface ThemeExample {
  name: string;
  cssClass: string;
  description: string;
}

const themes: ThemeExample[] = [
  {
    name: 'Cyberpunk',
    cssClass: 'theme-cyberpunk',
    description: 'A neon-inspired theme with cyan/magenta accents',
  },
  {
    name: 'Minimal',
    cssClass: 'theme-minimal',
    description: 'A clean, subtle theme with reduced visual noise',
  },
  {
    name: 'High Contrast',
    cssClass: 'theme-high-contrast',
    description: 'Enhanced visibility with bolder colors',
  },
  {
    name: 'GitHub',
    cssClass: 'theme-github',
    description: "Inspired by GitHub's code viewing interface",
  },
  {
    name: 'Dracula',
    cssClass: 'theme-dracula',
    description: 'A dark theme with vibrant purple and pink accents',
  },
  {
    name: 'Handwritten',
    cssClass: 'theme-handwritten',
    description: 'A playful theme with the Delius Swash Caps handwritten font',
  },
];

const codeExample = `interface User {
  id: number;
  name: string;
  email: string;
}

function greetUser(user: User): string {
  return \`Hello, \${user.name}!\`;
}

const user: User = {
  id: 1,
  name: 'John Doe',
  email: 'john@example.com',
};

console.log(greetUser(user));`;

const diffExample = {
  language: 'typescript' as const,
  oldCode: `interface User {
  id: number;
  name: string;
}

function getUser(id: number): User {
  return { id, name: 'John' };
}`,
  newCode: `interface User {
  id: number;
  name: string;
  email: string;
}

function getUser(id: number): User | null {
  if (id <= 0) return null;
  return {
    id,
    name: 'John',
    email: 'john@example.com'
  };
}`,
};

export default function ThemingPage() {
  const { theme, getResolvedShikiTheme } = useTheme();

  return (
    <div className={`page-container ${theme}`}>
      <header className="page-header">
        <h1 className="page-title">Custom Theming</h1>
        <p className="page-description">
          Customize the appearance of code and diff viewers using CSS variables.
          Apply a theme class to the component or its container to override default styles.
        </p>
      </header>

      {themes.map((themeItem) => (
        <section key={themeItem.name} className="demo-section">
          <h2 className="demo-section-title">{themeItem.name}</h2>
          <p className="demo-section-description">{themeItem.description}</p>
          <code className="demo-section-code">class="{themeItem.cssClass}"</code>

          <div className={`demo-grid ${themeItem.cssClass}`}>
            <div className="demo-item">
              <h3 className="demo-item-subtitle">Code Viewer</h3>
              <CodeViewer
                code={codeExample}
                language="typescript"
                theme={theme}
                shikiTheme={getResolvedShikiTheme()}
                title="example.ts"
                fileExtension=".ts"
                showLineNumbers={true}
                showCopyButton={true}
                showHeader={true}
              />
            </div>

            <div className="demo-item">
              <h3 className="demo-item-subtitle">Diff Viewer</h3>
              <DiffViewer
                oldCode={diffExample.oldCode}
                newCode={diffExample.newCode}
                language={diffExample.language}
                theme={theme}
                shikiTheme={getResolvedShikiTheme()}
                viewMode="unified"
                showLineNumbers={true}
                showHeader={true}
                oldFileName="user.ts"
                newFileName="user.ts"
              />
            </div>
          </div>
        </section>
      ))}
    </div>
  );
}
