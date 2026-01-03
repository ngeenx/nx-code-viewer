# nx-code-viewer-theme

This library was generated with `nx g @ngeenx/nx-plugin:tailwindcss-config` generator.

It provides a shared Tailwind CSS v4 configuration for the **nx-code-viewer-theme** theme.

## Usage

To use this configuration in your project, import it in your main CSS file:

```css
@reference '@ngeenx/nx-code-viewer-theme';
```

## Symlink Setup

This library includes a `symlink` target that creates a symlink in `node_modules/@ngeenx/nx-code-viewer-theme` pointing to the source CSS file. This enables proper resolution of `@reference` imports.

### Running the symlink target manually

```bash
nx run nx-code-viewer-theme:symlink
```

### Adding as a dependency to your app

To ensure the symlink is created automatically before serving your application, add the symlink target as a dependency in your app's `project.json`:

```json
{
  "targets": {
    "serve": {
      "executor": "@nx/angular:dev-server",
      "dependsOn": ["nx-code-viewer-theme:symlink"]
      // ... rest of config
    }
  }
}
```

You can also add it to the `build` target if needed:

```json
{
  "targets": {
    "build": {
      "executor": "@nx/angular:application",
      "dependsOn": ["nx-code-viewer-theme:symlink"]
      // ... rest of config
    }
  }
}
```

### Platform Compatibility

The symlink target uses a cross-platform Node.js script (`tools/scripts/create-symlink.mjs`) that works on:

- **macOS**
- **Linux**
- **Windows** (requires Developer Mode enabled or running terminal as Administrator)

## Theme Colors

This configuration includes the **nx-code-viewer-theme** color palette with shades from 50 to 950:

| Variable | CSS Variable                                                 | Tailwind Class                     |
| -------- | ------------------------------------------------------------ | ---------------------------------- |
| Lightest | `--nx-code-viewer-theme-50`                                  | `bg-nx-code-viewer-theme-50`       |
| Light    | `--nx-code-viewer-theme-100` to `--nx-code-viewer-theme-300` | `bg-nx-code-viewer-theme-100` etc. |
| Medium   | `--nx-code-viewer-theme-400` to `--nx-code-viewer-theme-600` | `bg-nx-code-viewer-theme-500` etc. |
| Dark     | `--nx-code-viewer-theme-700` to `--nx-code-viewer-theme-900` | `bg-nx-code-viewer-theme-800` etc. |
| Darkest  | `--nx-code-viewer-theme-950`                                 | `bg-nx-code-viewer-theme-950`      |

## Examples

### Using with @apply directive

```css
.btn-nx-code-viewer-theme {
  @apply bg-nx-code-viewer-theme-500 text-white hover:bg-nx-code-viewer-theme-600 active:bg-nx-code-viewer-theme-700;
}

.btn-nx-code-viewer-theme-outline {
  @apply border-2 border-nx-code-viewer-theme-500 text-nx-code-viewer-theme-600 hover:bg-nx-code-viewer-theme-50;
}

.card-nx-code-viewer-theme {
  @apply border border-nx-code-viewer-theme-200 bg-nx-code-viewer-theme-50 shadow-sm;
}

.text-nx-code-viewer-theme-gradient {
  @apply bg-gradient-to-r from-nx-code-viewer-theme-400 to-nx-code-viewer-theme-600 bg-clip-text text-transparent;
}
```

### Using CSS variables directly

```css
.custom-element {
  background-color: var(--nx-code-viewer-theme-500);
  border-color: var(--nx-code-viewer-theme-300);
  color: var(--nx-code-viewer-theme-900);
}

.custom-element:hover {
  background-color: var(--nx-code-viewer-theme-600);
}
```
