import { CodeViewer } from '@ngeenx/nx-react-code-viewer';
import { useDemoOptions } from './_shared/useDemoOptions';

const sample = `interface User {
  id: string;
  name: string;
  email: string;
  createdAt: Date;
}

function createUser(name: string, email: string): User {
  return {
    id: crypto.randomUUID(),
    name,
    email,
    createdAt: new Date(),
  };
}

function describe(user: User): string {
  return \`\${user.name} <\${user.email}> joined on \${user.createdAt.toISOString()}\`;
}

const alice = createUser('Alice', 'alice@example.com');
const bob = createUser('Bob', 'bob@example.com');

console.log(describe(alice));
console.log(describe(bob));
`;

export default function CodeViewerScrollableDemo() {
  const { theme, shikiTheme, codeViewerThemeClass } = useDemoOptions();
  return (
    <div className={`crylith-demo-stage ${codeViewerThemeClass}`} style={{ width: 500 }}>
      <CodeViewer
        code={sample}
        language="typescript"
        theme={theme}
        shikiTheme={shikiTheme}
        title="long-sample.ts"
        maxHeight="180px"
      />
    </div>
  );
}
