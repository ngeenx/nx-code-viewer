# nx-base-tailwincss-config

This library was generated with `nx g @ngeenx/nx-plugin:tailwindcss-config` generator.

It provides a shared Tailwind CSS v4 configuration.

## Usage

To use this configuration in your project, import it in your main CSS file:

```css
@reference '@ngeenx/base-tailwincss-config';
```

## Symlink Setup

This library includes a `symlink` target that creates a symlink in `node_modules/@ngeenx/base-tailwincss-config` pointing to the source CSS file. This enables proper resolution of `@reference` imports.

### Running the symlink target manually

```bash
nx run nx-base-tailwincss-config:symlink
```

### Adding as a dependency to your app

To ensure the symlink is created automatically before serving your application, add the symlink target as a dependency in your app's `project.json`:

```json
{
  "targets": {
    "serve": {
      "executor": "@nx/angular:dev-server",
      "dependsOn": ["nx-base-tailwincss-config:symlink"]
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
      "dependsOn": ["nx-base-tailwincss-config:symlink"]
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
