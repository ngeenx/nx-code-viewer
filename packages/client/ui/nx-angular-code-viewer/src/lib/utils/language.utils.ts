import type { CodeViewerLanguage } from '../types';
import { LANGUAGE_ALIASES } from '../types';

/**
 * Resolves language aliases to their Shiki-compatible equivalents
 * @param language - Input language identifier
 * @returns Resolved language for Shiki
 */
export function resolveLanguageAlias(
  language: CodeViewerLanguage
): CodeViewerLanguage {
  const alias = LANGUAGE_ALIASES[language as keyof typeof LANGUAGE_ALIASES];
  return alias ?? language;
}

/**
 * Gets display name for a programming language
 * @param language - Language identifier
 * @returns Human-readable language name
 */
export function getLanguageDisplayName(language: CodeViewerLanguage): string {
  const displayNames: Readonly<Record<string, string>> = {
    typescript: 'TypeScript',
    javascript: 'JavaScript',
    python: 'Python',
    rust: 'Rust',
    go: 'Go',
    java: 'Java',
    cpp: 'C++',
    c: 'C',
    csharp: 'C#',
    php: 'PHP',
    ruby: 'Ruby',
    swift: 'Swift',
    kotlin: 'Kotlin',
    scala: 'Scala',
    html: 'HTML',
    css: 'CSS',
    scss: 'SCSS',
    sass: 'Sass',
    less: 'Less',
    json: 'JSON',
    yaml: 'YAML',
    xml: 'XML',
    markdown: 'Markdown',
    sql: 'SQL',
    graphql: 'GraphQL',
    bash: 'Bash',
    shell: 'Shell',
    powershell: 'PowerShell',
    dockerfile: 'Dockerfile',
    plaintext: 'Plain Text',
  } as const;

  return displayNames[language] ?? language.toUpperCase();
}
