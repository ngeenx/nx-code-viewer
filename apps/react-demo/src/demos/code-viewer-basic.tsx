import { CodeViewer } from '@ngeenx/nx-react-code-viewer';

const sample = `interface User {
  id: number;
  name: string;
  email: string;
}

const greet = (user: User) => \`Hello, \${user.name}!\`;`;

export default function CodeViewerBasicDemo() {
  return (
    <CodeViewer
      code={sample}
      language="typescript"
      fileExtension=".ts"
    />
  );
}
