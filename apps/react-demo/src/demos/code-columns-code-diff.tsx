import { ColumnCodeViewer, type ColumnItem } from '@ngeenx/nx-react-code-viewer';
import { useDemoOptions } from './_shared/useDemoOptions';

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

export default function CodeColumnsCodeDiffDemo() {
  const { theme, shikiTheme, codeViewerThemeClass } = useDemoOptions();
  return (
    <div className={`crylith-demo-stage ${codeViewerThemeClass}`} style={{ width: 900 }}>
      <ColumnCodeViewer
        columns={columns}
        theme={theme}
        shikiTheme={shikiTheme}
        borderStyle="classic"
      />
    </div>
  );
}
