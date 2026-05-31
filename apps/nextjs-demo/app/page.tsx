import Link from 'next/link';
import { InstallSnippet } from './components/install-snippet';

export default function HomePage() {
  return (
    <div className="home">
      <h1 className="title">nx-react-code-viewer in Next.js</h1>
      <p className="lead">
        A standalone Next.js App Router app that consumes the built{' '}
        <code>@ngeenx/nx-react-code-viewer</code> package and exports every
        route to static HTML (<code>output: &apos;export&apos;</code>). The{' '}
        <Link href="/ssg">SSG</Link> page is prerendered at build time and
        hydrates on load.
      </p>

      <InstallSnippet />

      <p className="hint">
        Run <code>nx run nextjs-demo:build</code> and inspect{' '}
        <code>out/</code> for the prerendered static HTML.
      </p>
    </div>
  );
}
