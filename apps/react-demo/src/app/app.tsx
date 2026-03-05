import { Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './hooks/useTheme';
import { Layout } from './layout/Layout';
import LandingPage from './pages/LandingPage';
import BasicExamplesPage from './pages/BasicExamplesPage';
import DisplayOptionsPage from './pages/DisplayOptionsPage';
import LineHighlightingPage from './pages/LineHighlightingPage';
import InteractiveFeaturesPage from './pages/InteractiveFeaturesPage';
import BorderStylesPage from './pages/BorderStylesPage';
import ThemingPage from './pages/ThemingPage';
import DiffViewerPage from './pages/DiffViewerPage';
import MultiCodeViewerPage from './pages/MultiCodeViewerPage';
import PlaygroundPage from './pages/PlaygroundPage';

export function App() {
  return (
    <ThemeProvider>
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
    </ThemeProvider>
  );
}

export default App;
