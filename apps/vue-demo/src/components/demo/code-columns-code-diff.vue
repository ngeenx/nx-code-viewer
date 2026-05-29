<template>
  <div class="stage">
    <ColumnCodeViewer
      :class="codeViewerThemeClass"
      :columns="columns"
      :theme="theme"
      :shikiTheme="shikiTheme"
      borderStyle="classic"
    />
  </div>
</template>

<script setup lang="ts">
import {
  ColumnCodeViewer,
  type ColumnItem,
} from '@ngeenx/nx-vue-code-viewer';
import { useDemoOptions } from './_shared/useDemoOptions';

const { theme, shikiTheme, codeViewerThemeClass } = useDemoOptions();

const columns: ColumnItem[] = [
  {
    id: 'code',
    type: 'code',
    title: 'api.service.ts',
    fileExtension: '.ts',
    language: 'typescript',
    code: `@Injectable({ providedIn: 'root' })
export class ApiService {
  constructor(private http: HttpClient) {}

  get<T>(url: string) {
    return this.http.get<T>(url);
  }
}`,
  },
  {
    id: 'diff',
    type: 'diff',
    title: 'Proposed Changes',
    fileExtension: '.ts',
    language: 'typescript',
    oldCode: `@Injectable({ providedIn: 'root' })
export class ApiService {
  constructor(private http: HttpClient) {}

  get<T>(url: string) {
    return this.http.get<T>(url);
  }
}`,
    newCode: `@Injectable({ providedIn: 'root' })
export class ApiService {
  constructor(private http: HttpClient) {}

  get<T>(url: string) {
    return this.http.get<T>(url).pipe(
      retry(3),
      catchError(this.handleError)
    );
  }

  private handleError(error: unknown) {
    console.error('API error:', error);
    throw error;
  }
}`,
  },
];
</script>

<style scoped>
.stage {
  width: 900px;
}
.stage > :deep(*) {
  width: 100%;
}
</style>
