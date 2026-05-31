import type { Metadata } from 'next';
import './globals.css';
import { ThemeProvider } from './theme-provider';
import { SiteShell } from './components/site-shell';

export const metadata: Metadata = {
  title: 'nx-react-code-viewer · Next.js showcase',
  description:
    'Standalone Next.js App Router SSG showcase for @ngeenx/nx-react-code-viewer.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <ThemeProvider>
          <SiteShell>{children}</SiteShell>
        </ThemeProvider>
      </body>
    </html>
  );
}
