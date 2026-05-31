'use client';

import Link from 'next/link';
import type { ReactNode } from 'react';
import { useChromeTheme } from '../theme-provider';

export function SiteShell({ children }: { children: ReactNode }) {
  const { theme, toggle } = useChromeTheme();
  return (
    <div className="shell">
      <header className="topbar">
        <Link href="/" className="brand">
          nx-react-code-viewer · Next.js
        </Link>
        <nav className="nav">
          <Link href="/" className="nav-link">
            Home
          </Link>
          <Link href="/ssg" className="nav-link">
            SSG
          </Link>
        </nav>
        <button className="theme-toggle" type="button" onClick={toggle}>
          {theme === 'dark' ? '☀ Light' : '☾ Dark'}
        </button>
      </header>

      <main className="content">{children}</main>

      <footer className="footer">
        Statically generated with Next.js · the code viewer is prerendered then
        hydrated.
      </footer>
    </div>
  );
}
