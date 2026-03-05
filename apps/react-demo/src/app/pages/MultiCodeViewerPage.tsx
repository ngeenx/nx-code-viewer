import { MultiCodeViewer, type MultiCodeViewerTabItem } from '@ngeenx/nx-react-code-viewer';
import { useTheme } from '../hooks/useTheme';

const multiCodeViewerTabs: MultiCodeViewerTabItem[] = [
  {
    id: 'component',
    type: 'code',
    fileName: 'user.component.ts',
    fileExtension: '.ts',
    language: 'typescript',
    code: `import { Component, signal } from '@angular/core';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrl: './user.component.css',
})
export class UserComponent {
  readonly name = signal('John Doe');
  readonly email = signal('john@example.com');
}`,
  },
  {
    id: 'template',
    type: 'code',
    fileName: 'user.component.html',
    fileExtension: '.html',
    language: 'html',
    code: `<div class="user-card">
  <h2>{{ name() }}</h2>
  <p>{{ email() }}</p>
  <button (click)="edit()">Edit Profile</button>
</div>`,
  },
  {
    id: 'styles',
    type: 'code',
    fileName: 'user.component.css',
    fileExtension: '.css',
    language: 'css',
    code: `.user-card {
  padding: 1rem;
  border-radius: 0.5rem;
  background: var(--card-bg);
}

.user-card h2 {
  margin: 0 0 0.5rem;
  font-size: 1.25rem;
}`,
  },
  {
    id: 'changes',
    type: 'diff',
    fileName: 'user.service.ts',
    fileExtension: '.ts',
    language: 'typescript',
    oldCode: `export class UserService {
  getUser(id: number) {
    return this.http.get('/api/users/' + id);
  }
}`,
    newCode: `export class UserService {
  getUser(id: number) {
    return this.http.get<User>(\`/api/users/\${id}\`);
  }

  updateUser(id: number, data: Partial<User>) {
    return this.http.patch<User>(\`/api/users/\${id}\`, data);
  }
}`,
  },
];

export default function MultiCodeViewerPage() {
  const { theme, getResolvedShikiTheme } = useTheme();

  return (
    <div className={`page-container ${theme}`}>
      <header className="page-header">
        <h1 className="page-title">Multi-Code Viewer</h1>
        <p className="page-description">
          Tabbed interface for viewing multiple files including code and diff views.
          Click tabs to switch between files.
        </p>
      </header>

      <section className="demo-section">
        <h2 className="demo-section-title">Classic Border Style</h2>
        <p className="demo-section-description">
          Multi-code viewer with classic border styling showing component files and a diff tab.
        </p>
        <MultiCodeViewer
          tabs={multiCodeViewerTabs}
          theme={theme}
          shikiTheme={getResolvedShikiTheme()}
          borderStyle="classic"
        />
      </section>

      <section className="demo-section">
        <h2 className="demo-section-title">Corner-Intersection Border Style</h2>
        <p className="demo-section-description">
          Same content with corner-intersection border styling for a different visual appearance.
        </p>
        <MultiCodeViewer
          tabs={multiCodeViewerTabs}
          theme={theme}
          shikiTheme={getResolvedShikiTheme()}
          borderStyle="corner-intersection"
        />
      </section>
    </div>
  );
}
