<template>
  <div class="wrapper">
    <button class="toggle" type="button" @click="toggleViewMode">
      Switch to {{ viewMode === 'unified' ? 'Split' : 'Unified' }} View
    </button>
    <DiffViewer
      :class="codeViewerThemeClass"
      :oldCode="oldCode"
      :newCode="newCode"
      :language="language"
      :theme="theme"
      :shikiTheme="shikiTheme"
      :viewMode="viewMode"
      :showLineNumbers="true"
      :showHeader="true"
      maxHeight="400px"
      fileExtension="ts"
      oldFileName="user.service.ts"
      newFileName="user.service.ts"
    />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import {
  DiffViewer,
  type CodeViewerLanguage,
  type DiffViewMode,
} from '@ngeenx/nx-vue-code-viewer';
import { useDemoOptions } from './_shared/useDemoOptions';

const { theme, shikiTheme, codeViewerThemeClass } = useDemoOptions();

const language: CodeViewerLanguage = 'typescript';
const viewMode = ref<DiffViewMode>('unified');

function toggleViewMode(): void {
  viewMode.value = viewMode.value === 'unified' ? 'split' : 'unified';
}

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
</script>

<style scoped>
.wrapper {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  width: 720px;
}
.wrapper > :deep(*:not(.toggle)) {
  width: 100%;
}
.toggle {
  align-self: flex-start;
  padding: 0.4rem 0.8rem;
  border: 1px solid currentColor;
  border-radius: 6px;
  background: transparent;
  color: inherit;
  cursor: pointer;
  font: inherit;
  opacity: 0.85;
}
.toggle:hover {
  opacity: 1;
}
</style>
