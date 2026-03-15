import { NavLink, Outlet } from 'react-router-dom';
import { useTheme, type CustomTheme } from '../hooks/useTheme';
import type { ShikiThemeName } from '@ngeenx/nx-react-code-viewer';
import {
  Home,
  BookOpen,
  Settings2,
  Highlighter,
  MousePointer2,
  Frame,
  Palette,
  GitCompare,
  Layers,
  Columns3,
  Play,
  Sun,
  Moon,
  type LucideIcon,
} from 'lucide-react';

interface NavSection {
  title: string;
  items: NavItem[];
}

interface NavItem {
  label: string;
  route: string;
  icon: LucideIcon;
}

const navSections: NavSection[] = [
  {
    title: 'Overview',
    items: [{ label: 'Home', route: '/', icon: Home }],
  },
  {
    title: 'Getting Started',
    items: [{ label: 'Basic Examples', route: '/basic-examples', icon: BookOpen }],
  },
  {
    title: 'Code Viewer',
    items: [
      { label: 'Display Options', route: '/display-options', icon: Settings2 },
      { label: 'Line Highlighting', route: '/line-highlighting', icon: Highlighter },
      { label: 'Interactive Features', route: '/interactive-features', icon: MousePointer2 },
      { label: 'Border Styles', route: '/border-styles', icon: Frame },
      { label: 'Theming', route: '/theming', icon: Palette },
    ],
  },
  {
    title: 'Advanced',
    items: [
      { label: 'Diff Viewer', route: '/diff-viewer', icon: GitCompare },
      { label: 'Multi-Code Viewer', route: '/multi-code-viewer', icon: Layers },
      { label: 'Column Code Viewer', route: '/column-code-viewer', icon: Columns3 },
    ],
  },
  {
    title: 'Tools',
    items: [{ label: 'Playground', route: '/playground', icon: Play }],
  },
];

export function Layout() {
  const {
    theme,
    customTheme,
    customThemeOptions,
    shikiTheme,
    shikiThemeOptions,
    toggleTheme,
    setCustomTheme,
    setShikiTheme,
  } = useTheme();

  const onCustomThemeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setCustomTheme(e.target.value as CustomTheme);
  };

  const onShikiThemeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setShikiTheme(e.target.value as ShikiThemeName | 'auto');
  };

  return (
    <div className={`layout ${theme}`}>
      <aside className="sidebar">
        <div className="sidebar-header">
          <span className="logo">Code Viewer</span>
        </div>

        <nav className="sidebar-nav">
          {navSections.map((section) => (
            <div key={section.title} className="nav-section">
              <h3 className="nav-section-title">{section.title}</h3>
              <ul className="nav-list">
                {section.items.map((item) => (
                  <li key={item.route}>
                    <NavLink
                      to={item.route}
                      end={item.route === '/'}
                      className={({ isActive }) =>
                        `nav-item${isActive ? ' active' : ''}`
                      }
                    >
                      <item.icon size={16} />
                      {item.label}
                    </NavLink>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </nav>

        <div className="sidebar-footer">
          <div className="theme-selector">
            <label className="theme-label">Theme Style</label>
            <select
              className="theme-select"
              value={customTheme}
              onChange={onCustomThemeChange}
            >
              {customThemeOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          <div className="theme-selector">
            <label className="theme-label">Syntax Theme</label>
            <select
              className="theme-select"
              value={shikiTheme}
              onChange={onShikiThemeChange}
            >
              {shikiThemeOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          <button className="theme-toggle" onClick={toggleTheme}>
            {theme === 'dark' ? <Sun size={14} /> : <Moon size={14} />}
            {theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
          </button>
        </div>
      </aside>

      <main
        className={`main-content${
          customTheme !== 'default' ? ` theme-${customTheme}` : ''
        }`}
      >
        <Outlet />
      </main>
    </div>
  );
}
