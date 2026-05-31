import { useState } from 'react';
import { DiffViewer, type DiffViewMode } from '@ngeenx/nx-react-code-viewer';
import { useDemoOptions } from './_shared/useDemoOptions';

const oldCode = `import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface User {
  id: number;
  name: string;
  email: string;
}

export interface CreateUserDto {
  name: string;
  email: string;
}

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private readonly apiUrl = '/api/users';

  constructor(private http: HttpClient) {}

  getUsers(): Observable<User[]> {
    return this.http.get<User[]>(this.apiUrl);
  }

  getUser(id: number): Observable<User> {
    return this.http.get<User>(\`\${this.apiUrl}/\${id}\`);
  }

  createUser(dto: CreateUserDto): Observable<User> {
    return this.http.post<User>(this.apiUrl, dto);
  }

  deleteUser(id: number): Observable<void> {
    return this.http.delete<void>(\`\${this.apiUrl}/\${id}\`);
  }
}`;

const newCode = `import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, map, of } from 'rxjs';

export interface User {
  id: number;
  name: string;
  email: string;
  role: 'admin' | 'user' | 'guest';
  createdAt: Date;
  isActive: boolean;
}

export interface CreateUserDto {
  name: string;
  email: string;
  role?: 'admin' | 'user' | 'guest';
}

export interface UpdateUserDto {
  name?: string;
  email?: string;
  role?: 'admin' | 'user' | 'guest';
  isActive?: boolean;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
}

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private readonly apiUrl = '/api/users';
  private readonly http = inject(HttpClient);

  getUsers(page = 1, pageSize = 20): Observable<PaginatedResponse<User>> {
    return this.http.get<PaginatedResponse<User>>(this.apiUrl, {
      params: { page: page.toString(), pageSize: pageSize.toString() },
    });
  }

  getUser(id: number): Observable<User | null> {
    return this.http.get<User>(\`\${this.apiUrl}/\${id}\`).pipe(
      catchError(() => of(null))
    );
  }

  createUser(dto: CreateUserDto): Observable<User> {
    return this.http.post<User>(this.apiUrl, {
      ...dto,
      role: dto.role ?? 'user',
    });
  }

  updateUser(id: number, dto: UpdateUserDto): Observable<User> {
    return this.http.patch<User>(\`\${this.apiUrl}/\${id}\`, dto);
  }

  deleteUser(id: number): Observable<boolean> {
    return this.http.delete(\`\${this.apiUrl}/\${id}\`).pipe(
      map(() => true),
      catchError(() => of(false))
    );
  }

  searchUsers(query: string): Observable<User[]> {
    return this.http.get<User[]>(\`\${this.apiUrl}/search\`, {
      params: { q: query },
    });
  }
}`;

const toggleStyle: React.CSSProperties = {
  alignSelf: 'flex-start',
  padding: '0.4rem 0.8rem',
  border: '1px solid currentColor',
  borderRadius: 6,
  background: 'transparent',
  color: 'inherit',
  cursor: 'pointer',
  font: 'inherit',
};

export default function CodeDiffScrollableDemo() {
  const { theme, shikiTheme, codeViewerThemeClass } = useDemoOptions();
  const [viewMode, setViewMode] = useState<DiffViewMode>('unified');

  return (
    <div
      className={`crylith-demo-stage ${codeViewerThemeClass}`}
      style={{ width: 720, display: 'flex', flexDirection: 'column', gap: '0.75rem' }}
    >
      <button
        type="button"
        style={toggleStyle}
        onClick={() => setViewMode((m) => (m === 'unified' ? 'split' : 'unified'))}
      >
        Switch to {viewMode === 'unified' ? 'Split' : 'Unified'} View
      </button>
      <DiffViewer
        oldCode={oldCode}
        newCode={newCode}
        language="typescript"
        theme={theme}
        shikiTheme={shikiTheme}
        viewMode={viewMode}
        showLineNumbers={true}
        showHeader={true}
        maxHeight="400px"
        fileExtension="ts"
        oldFileName="user.service.ts"
        newFileName="user.service.ts"
      />
    </div>
  );
}
