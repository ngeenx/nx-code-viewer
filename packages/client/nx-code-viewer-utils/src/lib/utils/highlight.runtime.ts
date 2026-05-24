import {
  createBundledHighlighter,
  createSingletonShorthands,
} from 'shiki/core';
import { bundledLanguages } from 'shiki/langs';
import { bundledThemes } from 'shiki/themes';
import { createJavaScriptRegexEngine } from 'shiki/engine/javascript';

/**
 * Shared Shiki shorthands wired to the JavaScript regex engine.
 *
 * Importing `codeToHtml` from `'shiki'` pulls in the Oniguruma engine
 * (a ~600KB inlined-WASM blob) because the package's main entry has a
 * static `import "@shikijs/engine-oniguruma"` whose dependency
 * `wasm-inlined.mjs` has top-level side effects, so bundlers cannot
 * tree-shake it away even when only the JS engine is used at runtime.
 *
 * Building shorthands directly on top of `shiki/core` skips that static
 * import entirely and keeps the WASM payload out of client bundles.
 * The trade-off: grammars relying on Oniguruma-only regex features
 * (`\G` anchors, possessive quantifiers, etc.) highlight slightly less
 * accurately. Every grammar the code viewer currently ships with works
 * correctly under the JS engine.
 *
 * `forgiving: true` follows Shiki's performance guide for the JS engine
 * https://shiki.style/guide/regex-engines#javascript-regex-engine
 * If a grammar contains a regex pattern the JS engine cannot translate,
 * the engine logs a warning and continues rather than throwing, so an
 * unsupported pattern degrades to a small highlighting glitch instead
 * of breaking the whole code block.
 *
 * `createSingletonShorthands` returns a `codeToHtml` that lazily creates
 * a single shared highlighter on first call and reuses it for every
 * subsequent call. This matches Shiki's recommendation to cache the
 * highlighter rather than rebuilding it per `codeToHtml` invocation.
 */
const createHighlighter = createBundledHighlighter({
  langs: bundledLanguages,
  themes: bundledThemes,
  engine: () => createJavaScriptRegexEngine({ forgiving: true }),
});

const shorthands = createSingletonShorthands(createHighlighter);

export const codeToHtml = shorthands.codeToHtml;
