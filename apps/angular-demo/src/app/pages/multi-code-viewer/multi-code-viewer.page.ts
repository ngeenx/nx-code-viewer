import { Component, inject } from '@angular/core';
import {
  MultiCodeViewerComponent,
  MultiCodeViewerTabItem,
} from '@ngeenx/nx-angular-code-viewer';
import { ThemeService } from '../../services/theme.service';

@Component({
  selector: 'app-multi-code-viewer',
  standalone: true,
  imports: [MultiCodeViewerComponent],
  templateUrl: './multi-code-viewer.page.html',
  styleUrls: ['../page.css'],
})
export class MultiCodeViewerPage {
  protected readonly themeService = inject(ThemeService);
  protected readonly theme = this.themeService.theme;

  protected readonly multiCodeViewerTabs: MultiCodeViewerTabItem[] = [
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
}
