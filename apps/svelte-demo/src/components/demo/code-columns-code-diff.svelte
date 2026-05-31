<script lang="ts">
  import { ColumnCodeViewer } from '@ngeenx/nx-svelte-code-viewer';
  import type { ColumnItem } from '@ngeenx/nx-code-viewer-utils';
  import { useDemoOptions } from './_shared/useDemoOptions.svelte';

  const options = useDemoOptions();

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

<div class="stage {options.codeViewerThemeClass}">
  <ColumnCodeViewer
    {columns}
    theme={options.theme}
    shikiTheme={options.shikiTheme}
    borderStyle="classic"
  />
</div>

<style>
  .stage {
    width: 900px;
  }
  .stage :global(.nx-column-code-viewer) {
    width: 100%;
  }
</style>
