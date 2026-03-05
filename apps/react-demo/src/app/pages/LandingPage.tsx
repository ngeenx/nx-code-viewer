import { useState } from 'react';
import { Link } from 'react-router-dom';
import { CodeViewer } from '@ngeenx/nx-react-code-viewer';
import { useTheme } from '../hooks/useTheme';
import {
  BookOpen,
  Palette,
  Zap,
  GitCompare,
  Layers,
  Play,
  ArrowRight,
  Code2,
  Sparkles,
  ChevronRight,
  type LucideIcon,
} from 'lucide-react';

interface Feature {
  icon: LucideIcon;
  title: string;
  description: string;
  route: string;
  gradient: string;
}

const features: Feature[] = [
  {
    icon: BookOpen,
    title: 'Syntax Highlighting',
    description: 'Beautiful code rendering with 30+ Shiki themes and 100+ language support.',
    route: '/basic-examples',
    gradient: 'from-blue-500 to-cyan-500',
  },
  {
    icon: Palette,
    title: 'Custom Theming',
    description: 'Create unique themes with CSS variables. Cyberpunk, minimal, GitHub-inspired and more.',
    route: '/theming',
    gradient: 'from-purple-500 to-pink-500',
  },
  {
    icon: Zap,
    title: 'Interactive Features',
    description: 'Line widgets, reference links, popovers, and custom annotations for rich code documentation.',
    route: '/interactive-features',
    gradient: 'from-amber-500 to-orange-500',
  },
  {
    icon: GitCompare,
    title: 'Diff Viewer',
    description: 'Side-by-side and unified diff views with syntax highlighting and line-level changes.',
    route: '/diff-viewer',
    gradient: 'from-green-500 to-emerald-500',
  },
  {
    icon: Layers,
    title: 'Multi-Code Viewer',
    description: 'Tabbed interface for displaying multiple files, code snippets, and diff comparisons.',
    route: '/multi-code-viewer',
    gradient: 'from-rose-500 to-red-500',
  },
  {
    icon: Play,
    title: 'Playground',
    description: 'Interactive configuration editor to experiment with all features in real-time.',
    route: '/playground',
    gradient: 'from-indigo-500 to-violet-500',
  },
];

const codeExamples = [
  {
    label: 'Code Viewer',
    language: 'typescript' as const,
    code: `import { CodeViewer } from '@ngeenx/nx-react-code-viewer';

function Demo() {
  return (
    <CodeViewer
      code="console.log('Hello, World!');"
      language="typescript"
      showLineNumbers={true}
      showHeader={true}
    />
  );
}

export default Demo;`,
  },
  {
    label: 'Diff Viewer',
    language: 'html' as const,
    code: `<!-- Compare code changes side-by-side -->
<DiffViewer
  oldCode={oldCode}
  newCode={newCode}
  language="typescript"
  viewMode="split"
/>`,
  },
  {
    label: 'Multi-Code',
    language: 'html' as const,
    code: `<!-- Tabbed interface for multiple files -->
<MultiCodeViewer
  tabs={tabs}
  theme="dark"
  borderStyle="classic"
/>`,
  },
];

export default function LandingPage() {
  const { theme, getResolvedShikiTheme } = useTheme();
  const [activeCodeIndex, setActiveCodeIndex] = useState(0);

  return (
    <div className="landing-container">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <div className="hero-badge">
            <Sparkles size={14} />
            <span>Built for React 19+</span>
          </div>

          <h1 className="hero-title">
            <span className="hero-title-line">Beautiful Code</span>
            <span className="hero-title-line gradient-text">Visualization</span>
          </h1>

          <p className="hero-description">
            A powerful, customizable code viewer component for React applications.
            Syntax highlighting, diff views, themes, and interactive features —
            everything you need to display code beautifully.
          </p>

          <div className="hero-actions">
            <Link to="/basic-examples" className="btn-primary">
              <span>Get Started</span>
              <ArrowRight size={18} />
            </Link>
            <Link to="/playground" className="btn-secondary">
              <Code2 size={18} />
              <span>Try Playground</span>
            </Link>
          </div>

          <div className="hero-stats">
            <div className="stat-item">
              <span className="stat-value">30+</span>
              <span className="stat-label">Themes</span>
            </div>
            <div className="stat-divider"></div>
            <div className="stat-item">
              <span className="stat-value">100+</span>
              <span className="stat-label">Languages</span>
            </div>
            <div className="stat-divider"></div>
            <div className="stat-item">
              <span className="stat-value">6</span>
              <span className="stat-label">Border Styles</span>
            </div>
          </div>
        </div>

        <div className="hero-preview">
          <div className="code-preview-wrapper">
            <div className="code-preview-header">
              <div className="preview-tabs">
                {codeExamples.map((example, index) => (
                  <button
                    key={index}
                    className={`preview-tab${activeCodeIndex === index ? ' active' : ''}`}
                    onClick={() => setActiveCodeIndex(index)}
                  >
                    <span className={`tab-dot${activeCodeIndex === index ? ' active' : ''}`}></span>
                    <span>{example.label}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="code-preview-content">
              <CodeViewer
                code={codeExamples[activeCodeIndex].code}
                language={codeExamples[activeCodeIndex].language}
                shikiTheme={getResolvedShikiTheme()}
                showLineNumbers={true}
                showHeader={false}
                borderStyle="none"
              />
            </div>
          </div>

          <div className="floating-decoration decoration-1"></div>
          <div className="floating-decoration decoration-2"></div>
          <div className="floating-decoration decoration-3"></div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <div className="section-header">
          <h2 className="section-title">Everything You Need</h2>
          <p className="section-description">
            Powerful features to make your code shine in documentation, tutorials, and applications.
          </p>
        </div>

        <div className="features-grid">
          {features.map((feature) => (
            <Link key={feature.title} to={feature.route} className="feature-card">
              <div className={`feature-icon-wrapper gradient-${feature.gradient}`}>
                <feature.icon size={24} />
              </div>
              <h3 className="feature-title">{feature.title}</h3>
              <p className="feature-description">{feature.description}</p>
              <div className="feature-link">
                <span>Explore</span>
                <ChevronRight size={16} />
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="cta-content">
          <h2 className="cta-title">Ready to Get Started?</h2>
          <p className="cta-description">
            Explore the playground to see all features in action, or dive into the examples to learn how to use each component.
          </p>
          <div className="cta-actions">
            <Link to="/playground" className="btn-primary large">
              <Code2 size={20} />
              <span>Open Playground</span>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
