import { cpSync, existsSync, mkdirSync, rmSync } from 'fs';
import { resolve } from 'path';

/**
 * Stage a source-distributed package into its dist output.
 *
 * Some workspace libraries (the Svelte code viewer, for one) ship as raw
 * source rather than a compiled bundle: their `package.json` `exports`
 * point straight at `./src/index.ts` and consumers compile the `.svelte`
 * / `.ts` files themselves. The Crylith live-demo Svelte adapter builds
 * each demo with bare Node resolution (no tsconfig path aliases), so it
 * resolves `@ngeenx/nx-svelte-code-viewer` through the
 * `node_modules/@ngeenx/...` -> `dist/...` symlink. That only works when
 * the dist actually contains the package, so this script copies `src/`
 * and `package.json` into the dist output.
 *
 * Usage: node copy-source-package.mjs <projectRoot> <distRoot>
 */
const [, , projectRoot, distRoot] = process.argv;

if (!projectRoot || !distRoot) {
  console.error(
    'Usage: node copy-source-package.mjs <projectRoot> <distRoot>'
  );
  process.exit(1);
}

const src = resolve(process.cwd(), projectRoot);
const out = resolve(process.cwd(), distRoot);

const pkgJson = resolve(src, 'package.json');
const srcDir = resolve(src, 'src');

if (!existsSync(pkgJson)) {
  console.error(`Source package.json not found: ${pkgJson}`);
  process.exit(1);
}
if (!existsSync(srcDir)) {
  console.error(`Source directory not found: ${srcDir}`);
  process.exit(1);
}

rmSync(out, { recursive: true, force: true });
mkdirSync(out, { recursive: true });
cpSync(srcDir, resolve(out, 'src'), { recursive: true });
cpSync(pkgJson, resolve(out, 'package.json'));

console.log(`Staged source package: ${projectRoot} -> ${distRoot}`);
