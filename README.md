# NX Code Viewer

A feature-rich, multi-framework code viewer component library for displaying source code with syntax highlighting, theming, interactive references, diff viewing, and line widget capabilities. Supports Angular, Vue, React, and Svelte.

## TODOs

- [x] Split styles into separate package
- [x] Add Angular package
  - [x] Add storybook examples
  - [x] Create readme
  - [x] Write unit tests
- [x] Add Vue component
  - [x] Add storybook examples
  - [x] Create readme
  - [x] Write unit tests
- [x] Add React component
  - [x] Add storybook examples
  - [x] Create readme
  - [x] Write unit tests
- [x] Add Svelte component
  - [x] Add storybook examples
  - [x] Create readme
  - [x] Write unit tests
- [ ] Publish first versions
- [ ] Complete documentation
- [ ] Set up CI/CD

## Features

- **Syntax Highlighting** - Powered by Shiki with support for 100+ languages and 30+ themes
- **Theme Support** - Light and dark theme variants with 7 custom CSS themes
- **Line Numbers** - With highlighting, focus, and sticky positioning
- **Copy to Clipboard** - Built-in copy button with visual feedback
- **Diff Viewer** - Unified or split diff comparison with syntax highlighting
- **Multi-Code Viewer** - Tabbed interface for multiple code and diff views
- **Reference Links** - Interactive annotations with URL linking, info popovers, and custom components
- **Line Widgets** - Hover and always-visible widgets with insert components
- **Border Styles** - 6 styling options (classic, grid-cross, corner-intersection, none + custom themes)
- **Collapsed Lines** - Collapsible line ranges with expand/collapse indicators
- **Focused Lines** - Blur unfocused lines with group hover effects
- **Enable/Disable Line Hover** - Configurable line hover highlighting

## Project Structure

```txt
packages/
├── client/
│   ├── ui/nx-angular-code-viewer/     # Angular component library
│   ├── ui/nx-vue-code-viewer/         # Vue 3 component library
│   ├── ui/nx-react-code-viewer/       # React component library
│   ├── ui/nx-svelte-code-viewer/      # Svelte 5 component library
│   └── nx-code-viewer-utils/          # Shared types and utilities
└── styles/
    ├── nx-code-viewer-theme/          # Shared theme CSS
    ├── nx-demo-app-theme/             # Demo app shared theme
    └── nx-base-tailwincss-config/     # Shared Tailwind CSS v4 config

apps/
├── angular-demo/                      # Angular demo application
├── vue-demo/                          # Vue demo application
├── react-demo/                        # React demo application
├── svelte-demo/                       # Svelte demo application
└── *-e2e/                             # E2E tests (Playwright)
```

## Tech Stack

- Angular 19+, Vue 3, React 19, Svelte 5
- Nx monorepo
- Vite
- Tailwind CSS v4
- Shiki 4 (syntax highlighting)
- Tippy.js (popovers)
- Storybook (Angular, Vue, React, Svelte)

## Development

```sh
# Install dependencies
pnpm install

# Run demo apps
pnpm nx serve angular-demo     # port 4222
pnpm nx serve vue-demo          # port 4223
pnpm nx serve svelte-demo       # port 4224
pnpm nx serve react-demo        # port 4200

# Run Storybook
pnpm nx storybook nx-angular-code-viewer  # port 4442
pnpm nx storybook nx-vue-code-viewer      # port 4443
pnpm nx storybook nx-svelte-code-viewer   # port 4444
pnpm nx storybook nx-react-code-viewer    # port 4445

# Build libraries
pnpm nx build nx-angular-code-viewer
pnpm nx build nx-vue-code-viewer
pnpm nx build nx-react-code-viewer

# Run tests
pnpm nx test nx-angular-code-viewer
pnpm nx test nx-vue-code-viewer
pnpm nx test nx-react-code-viewer
pnpm nx test nx-svelte-code-viewer
pnpm nx test nx-code-viewer-utils
```

## License

MIT
