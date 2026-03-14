import { CodeViewer, type CodeViewerLanguage } from '@ngeenx/nx-react-code-viewer';
import { useTheme } from '../hooks/useTheme';

const examples: {
  title: string;
  code: string;
  language: CodeViewerLanguage;
  fileExtension: string;
}[] = [
  {
    title: 'TypeScript',
    language: 'typescript',
    fileExtension: '.ts',
    code: `interface User {
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

console.log(greetUser(user));`,
  },
  {
    title: 'JavaScript',
    language: 'javascript',
    fileExtension: '.js',
    code: `const fetchData = async (url) => {
  try {
    const response = await fetch(url);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
};

fetchData('https://api.example.com/users')
  .then(users => console.log(users));`,
  },
  {
    title: 'HTML',
    language: 'html',
    fileExtension: '.html',
    code: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Demo Page</title>
</head>
<body>
  <header>
    <h1>Welcome</h1>
  </header>
  <main>
    <p>Hello, World!</p>
  </main>
</body>
</html>`,
  },
  {
    title: 'CSS',
    language: 'css',
    fileExtension: '.css',
    code: `.container {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  padding: 2rem;
}

.button {
  background-color: #3b82f6;
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 0.375rem;
  border: none;
  cursor: pointer;
  transition: background-color 0.2s;
}

.button:hover {
  background-color: #2563eb;
}`,
  },
  {
    title: 'JSON',
    language: 'json',
    fileExtension: '.json',
    code: `{
  "name": "nx-code-viewer",
  "version": "1.0.0",
  "description": "A syntax highlighting code viewer component",
  "keywords": ["react", "code", "viewer", "syntax-highlighting"],
  "dependencies": {
    "react": "^19.0.0",
    "shiki": "^1.0.0"
  }
}`,
  },
];

const handwrittenExample = `// A simple note-taking app
interface Note {
  id: number;
  title: string;
  content: string;
  createdAt: Date;
}

function createNote(title: string, content: string): Note {
  return {
    id: Date.now(),
    title,
    content,
    createdAt: new Date(),
  };
}

const myNote = createNote(
  'Shopping List',
  'Milk, Eggs, Bread, Coffee'
);`;

export default function BasicExamplesPage() {
  const { theme, getResolvedShikiTheme } = useTheme();

  return (
    <div className={`page-container ${theme}`}>
      <header className="page-header">
        <h1 className="page-title">Basic Examples</h1>
        <p className="page-description">
          Code viewer supports multiple programming languages with syntax
          highlighting. Each example showcases a different language configuration.
        </p>
      </header>

      {examples.map((example) => (
        <section key={example.title} className="demo-section">
          <h2 className="demo-section-title">{example.title}</h2>
          <CodeViewer
            code={example.code}
            language={example.language}
            theme={theme}
            shikiTheme={getResolvedShikiTheme()}
            title={example.title}
            fileExtension={example.fileExtension}
            showLineNumbers={true}
            showCopyButton={true}
            showHeader={true}
            onCodeCopied={() => console.log(`Code copied from: ${example.title}`)}
          />
        </section>
      ))}

      <section className="demo-section">
        <h2 className="demo-section-title">Custom Font (Handwritten)</h2>
        <p className="demo-section-description">
          The code viewer supports custom fonts via the{' '}
          <code>--nx-font-mono</code> CSS variable. This example uses the Delius
          Swash Caps handwritten font with a warm paper-like theme.
        </p>
        <div className="theme-handwritten">
          <CodeViewer
            code={handwrittenExample}
            language="typescript"
            theme={theme}
            title="notes.ts"
            fileExtension=".ts"
            showLineNumbers={true}
            showCopyButton={true}
            showHeader={true}
          />
        </div>
      </section>

      <section className="demo-section">
        <h2 className="demo-section-title">Line Hover Disabled</h2>
        <p className="demo-section-description">
          Line hover highlighting can be disabled with{' '}
          <code>enableLineHover={'{false}'}</code>. Hover over the lines below —
          no highlight effect will appear.
        </p>
        <CodeViewer
          code={examples[0].code}
          language={examples[0].language}
          theme={theme}
          shikiTheme={getResolvedShikiTheme()}
          title="no-hover.ts"
          fileExtension=".ts"
          enableLineHover={false}
          showLineNumbers={true}
          showHeader={true}
        />
      </section>
    </div>
  );
}
