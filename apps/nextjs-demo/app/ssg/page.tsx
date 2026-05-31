import type { Metadata } from 'next';
import { CodeShowcase } from '../components/code-showcase';

export const metadata: Metadata = {
  title: 'SSG · nx-react-code-viewer',
};

export default function SsgPage() {
  return (
    <div className="page">
      <header className="page-head">
        <span className="badge">Prerendered (static)</span>
        <h1 className="page-title">Statically generated</h1>
        <p className="page-lead">
          This route is exported to static HTML at build time (no server at
          runtime). The viewers render in the prerendered markup and hydrate on
          load, flipping their Shiki theme with the chrome toggle.
        </p>
      </header>

      <CodeShowcase />
    </div>
  );
}
