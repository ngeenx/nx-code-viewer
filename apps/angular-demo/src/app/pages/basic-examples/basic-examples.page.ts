import { Component, inject } from '@angular/core';
import {
  CodeViewerComponent,
  CodeViewerLanguage,
} from '@ngeenx/nx-angular-code-viewer';
import { ThemeService } from '../../services/theme.service';

@Component({
  selector: 'app-basic-examples',
  standalone: true,
  imports: [CodeViewerComponent],
  templateUrl: './basic-examples.page.html',
  styleUrls: ['../page.css'],
})
export class BasicExamplesPage {
  protected readonly themeService = inject(ThemeService);
  protected readonly theme = this.themeService.theme;

  protected readonly examples: {
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
  "keywords": ["angular", "code", "viewer", "syntax-highlighting"],
  "dependencies": {
    "@angular/core": "^19.0.0",
    "shiki": "^1.0.0"
  }
}`,
    },
  ];

  protected onCodeCopied(title: string): void {
    console.log(`Code copied from: ${title}`);
  }
}
