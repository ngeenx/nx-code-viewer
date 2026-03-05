import { lazy, Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './hooks/useTheme';
import { Layout } from './layout/Layout';

const LandingPage = lazy(() => import('./pages/LandingPage'));
const BasicExamplesPage = lazy(() => import('./pages/BasicExamplesPage'));
const DisplayOptionsPage = lazy(() => import('./pages/DisplayOptionsPage'));
const LineHighlightingPage = lazy(() => import('./pages/LineHighlightingPage'));
const InteractiveFeaturesPage = lazy(() => import('./pages/InteractiveFeaturesPage'));
const BorderStylesPage = lazy(() => import('./pages/BorderStylesPage'));
const ThemingPage = lazy(() => import('./pages/ThemingPage'));
const DiffViewerPage = lazy(() => import('./pages/DiffViewerPage'));
const MultiCodeViewerPage = lazy(() => import('./pages/MultiCodeViewerPage'));
const PlaygroundPage = lazy(() => import('./pages/PlaygroundPage'));

export function App() {
  return (
    <ThemeProvider>
      <Suspense fallback={null}>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<LandingPage />} />
            <Route path="basic-examples" element={<BasicExamplesPage />} />
            <Route path="display-options" element={<DisplayOptionsPage />} />
            <Route path="line-highlighting" element={<LineHighlightingPage />} />
            <Route path="interactive-features" element={<InteractiveFeaturesPage />} />
            <Route path="border-styles" element={<BorderStylesPage />} />
            <Route path="theming" element={<ThemingPage />} />
            <Route path="diff-viewer" element={<DiffViewerPage />} />
            <Route path="multi-code-viewer" element={<MultiCodeViewerPage />} />
            <Route path="playground" element={<PlaygroundPage />} />
          </Route>
        </Routes>
      </Suspense>
    </ThemeProvider>
  );
}

export default App;
