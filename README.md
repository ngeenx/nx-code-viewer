# NX Angular Code Viewer

A feature-rich Angular component library for displaying source code with syntax highlighting, theming, interactive references, and diff viewing capabilities.

## TODOs

- [ ] Split styles into separate package
- [ ] Add Angular package
  - [x] Add storybook examples
  - [x] Create readme
  - [ ] Write unit tests
- [ ] Add Vue component
  - [ ] Add storybook examples
  - [ ] Create readme
  - [ ] Write unit tests
- [ ] Add React component
  - [ ] Add storybook examples
  - [ ] Create readme
  - [ ] Write unit tests
- [ ] Publish first versions
- [ ] Complete documentation
- [ ] Set up CI/CD

## Features

- **Syntax Highlighting** - Powered by Shiki with support for 100+ languages
- **Theme Support** - Light and dark theme variants
- **Line Numbers** - With highlighting and focus capabilities
- **Copy to Clipboard** - Built-in copy button with visual feedback
- **Diff Viewer** - Side-by-side or inline diff comparison
- **Multi-Code Viewer** - Tabbed interface for multiple code blocks
- **Reference Links** - Interactive annotations with URL linking and info popovers
- **Border Styles** - Multiple styling options (classic, grid-cross, corner-intersection)

## Project Structure

```txt
packages/
├── client/ui/nx-angular-code-viewer/   # Main component library
└── styles/nx-base-tailwincss-config/   # Shared Tailwind CSS v4 config

apps/
├── angular-demo/                        # Demo application
└── angular-demo-e2e/                    # E2E tests
```

## Tech Stack

- Angular 21 (standalone components)
- Nx monorepo
- Vite + Analog
- Tailwind CSS v4
- Shiki (syntax highlighting)
- Storybook 10

## Development

```sh
# Install dependencies
pnpm install

# Run demo app
pnpm nx serve angular-demo

# Run Storybook
pnpm nx storybook nx-angular-code-viewer

# Build library
pnpm nx build nx-angular-code-viewer

# Run tests
pnpm nx test nx-angular-code-viewer
```

## License

MIT
