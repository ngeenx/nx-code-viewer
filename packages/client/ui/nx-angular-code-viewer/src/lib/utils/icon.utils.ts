/**
 * File icon configuration
 */
export interface FileIconConfig {
  readonly slug: string;
  readonly hex: string;
}

/**
 * Simple Icons CDN base URL
 */
const SIMPLE_ICONS_CDN = 'https://cdn.simpleicons.org';

/**
 * Language to file extension mapping for fallback icon detection
 */
export const LANGUAGE_TO_EXTENSION_MAP: Readonly<Record<string, string>> = {
  javascript: '.js',
  typescript: '.ts',
  python: '.py',
  html: '.html',
  css: '.css',
  scss: '.scss',
  sass: '.sass',
  less: '.less',
  json: '.json',
  xml: '.xml',
  yaml: '.yaml',
  toml: '.toml',
  markdown: '.md',
  mdx: '.mdx',
  php: '.php',
  ruby: '.rb',
  go: '.go',
  rust: '.rs',
  java: '.java',
  kotlin: '.kt',
  scala: '.scala',
  swift: '.swift',
  dart: '.dart',
  c: '.c',
  cpp: '.cpp',
  csharp: '.cs',
  bash: '.sh',
  shell: '.sh',
  zsh: '.zsh',
  powershell: '.ps1',
  dockerfile: '.dockerfile',
  graphql: '.graphql',
  sql: '.sql',
  vue: '.vue',
  svelte: '.svelte',
  jsx: '.jsx',
  tsx: '.tsx',
} as const;

/**
 * Gets file extension from language
 * @param language - Programming language name
 * @returns File extension or null
 */
export function getExtensionFromLanguage(language: string): string | null {
  if (!language) {
    return null;
  }
  return LANGUAGE_TO_EXTENSION_MAP[language.toLowerCase()] ?? null;
}

/**
 * File extension to Simple Icons mapping
 */
export const FILE_EXTENSION_ICON_MAP: Readonly<Record<string, FileIconConfig>> =
  {
    // JavaScript
    '.js': { slug: 'javascript', hex: 'F7DF1E' },
    '.mjs': { slug: 'javascript', hex: 'F7DF1E' },
    '.cjs': { slug: 'javascript', hex: 'F7DF1E' },

    // TypeScript
    '.ts': { slug: 'typescript', hex: '3178C6' },
    '.mts': { slug: 'typescript', hex: '3178C6' },
    '.cts': { slug: 'typescript', hex: '3178C6' },

    // React
    '.jsx': { slug: 'react', hex: '61DAFB' },
    '.tsx': { slug: 'react', hex: '61DAFB' },

    // Vue
    '.vue': { slug: 'vuedotjs', hex: '4FC08D' },

    // Angular
    '.component.ts': { slug: 'angular', hex: 'DD0031' },
    '.module.ts': { slug: 'angular', hex: 'DD0031' },
    '.service.ts': { slug: 'angular', hex: 'DD0031' },

    // Python
    '.py': { slug: 'python', hex: '3776AB' },
    '.pyw': { slug: 'python', hex: '3776AB' },
    '.pyx': { slug: 'python', hex: '3776AB' },

    // Web
    '.html': { slug: 'html5', hex: 'E34F26' },
    '.htm': { slug: 'html5', hex: 'E34F26' },
    '.css': { slug: 'css', hex: '1572B6' },
    '.scss': { slug: 'sass', hex: 'CC6699' },
    '.sass': { slug: 'sass', hex: 'CC6699' },
    '.less': { slug: 'less', hex: '1D365D' },

    // Data formats
    '.json': { slug: 'json', hex: 'CBCB41' },
    '.xml': { slug: 'xml', hex: '005FAD' },
    '.yaml': { slug: 'yaml', hex: 'CB171E' },
    '.yml': { slug: 'yaml', hex: 'CB171E' },
    '.toml': { slug: 'toml', hex: '9C4121' },

    // Documentation
    '.md': { slug: 'markdown', hex: '000000' },
    '.mdx': { slug: 'mdx', hex: '1B1F24' },

    // Backend languages
    '.php': { slug: 'php', hex: '777BB4' },
    '.rb': { slug: 'ruby', hex: 'CC342D' },
    '.go': { slug: 'go', hex: '00ADD8' },
    '.rs': { slug: 'rust', hex: '000000' },
    '.java': { slug: 'openjdk', hex: '437291' },
    '.kt': { slug: 'kotlin', hex: '7F52FF' },
    '.kts': { slug: 'kotlin', hex: '7F52FF' },
    '.scala': { slug: 'scala', hex: 'DC322F' },
    '.swift': { slug: 'swift', hex: 'F05138' },
    '.dart': { slug: 'dart', hex: '0175C2' },

    // C family
    '.c': { slug: 'c', hex: 'A8B9CC' },
    '.h': { slug: 'c', hex: 'A8B9CC' },
    '.cpp': { slug: 'cplusplus', hex: '00599C' },
    '.cc': { slug: 'cplusplus', hex: '00599C' },
    '.cxx': { slug: 'cplusplus', hex: '00599C' },
    '.hpp': { slug: 'cplusplus', hex: '00599C' },
    '.cs': { slug: 'csharp', hex: '512BD4' },

    // Shell
    '.sh': { slug: 'gnubash', hex: '4EAA25' },
    '.bash': { slug: 'gnubash', hex: '4EAA25' },
    '.zsh': { slug: 'zsh', hex: 'F15A24' },
    '.ps1': { slug: 'powershell', hex: '5391FE' },

    // DevOps
    '.dockerfile': { slug: 'docker', hex: '2496ED' },
    '.dockerignore': { slug: 'docker', hex: '2496ED' },

    // GraphQL
    '.graphql': { slug: 'graphql', hex: 'E10098' },
    '.gql': { slug: 'graphql', hex: 'E10098' },

    // SQL
    '.sql': { slug: 'mysql', hex: '4479A1' },

    // Config files
    '.env': { slug: 'dotenv', hex: 'ECD53F' },
    '.gitignore': { slug: 'git', hex: 'F05032' },
    '.npmrc': { slug: 'npm', hex: 'CB3837' },

    // Svelte
    '.svelte': { slug: 'svelte', hex: 'FF3E00' },
  } as const;

/**
 * Special filename to icon mapping (for files without extensions)
 */
export const FILENAME_ICON_MAP: Readonly<Record<string, FileIconConfig>> = {
  Dockerfile: { slug: 'docker', hex: '2496ED' },
  Makefile: { slug: 'gnu', hex: 'A42E2B' },
  'package.json': { slug: 'npm', hex: 'CB3837' },
  'tsconfig.json': { slug: 'typescript', hex: '3178C6' },
  'angular.json': { slug: 'angular', hex: 'DD0031' },
  '.gitignore': { slug: 'git', hex: 'F05032' },
  '.env': { slug: 'dotenv', hex: 'ECD53F' },
  '.prettierrc': { slug: 'prettier', hex: 'F7B93E' },
  '.eslintrc': { slug: 'eslint', hex: '4B32C3' },
} as const;

/**
 * Gets the file icon configuration for a given file extension or filename
 * @param fileExtensionOrName - File extension (e.g., '.ts') or filename (e.g., 'Dockerfile')
 * @returns FileIconConfig or null if no icon is found
 */
export function getFileIcon(
  fileExtensionOrName: string
): FileIconConfig | null {
  if (!fileExtensionOrName) {
    return null;
  }

  const normalized = fileExtensionOrName.toLowerCase();

  // Check special filenames first
  if (FILENAME_ICON_MAP[normalized]) {
    return FILENAME_ICON_MAP[normalized];
  }

  // Check file extensions
  if (FILE_EXTENSION_ICON_MAP[normalized]) {
    return FILE_EXTENSION_ICON_MAP[normalized];
  }

  // Try to extract extension if a full filename was provided
  if (!normalized.startsWith('.')) {
    const ext = getExtensionFromFilename(normalized);
    if (ext && FILE_EXTENSION_ICON_MAP[ext]) {
      return FILE_EXTENSION_ICON_MAP[ext];
    }
  }

  return null;
}

/**
 * Extracts file extension from a filename
 * @param filename - Full filename
 * @returns Extension with dot (e.g., '.ts') or null
 */
export function getExtensionFromFilename(filename: string): string | null {
  if (!filename) {
    return null;
  }

  // Handle compound extensions like .component.ts
  const compoundExtensions = ['.component.ts', '.module.ts', '.service.ts'];
  for (const ext of compoundExtensions) {
    if (filename.toLowerCase().endsWith(ext)) {
      return ext;
    }
  }

  const lastDotIndex = filename.lastIndexOf('.');
  if (lastDotIndex === -1 || lastDotIndex === filename.length - 1) {
    return null;
  }

  return filename.slice(lastDotIndex).toLowerCase();
}

/**
 * Generates a CDN URL for a Simple Icons icon
 * @param slug - Simple Icons slug (e.g., 'typescript')
 * @param color - Optional hex color (without #)
 * @returns CDN URL for the icon
 */
export function getIconCdnUrl(slug: string, color?: string): string {
  if (!slug) {
    return '';
  }

  const baseUrl = `${SIMPLE_ICONS_CDN}/${slug}`;
  return color ? `${baseUrl}/${color}` : baseUrl;
}

/**
 * Gets the CDN URL for a file icon based on extension
 * @param fileExtensionOrName - File extension or filename
 * @param customColor - Optional custom color override
 * @returns CDN URL or null if no icon found
 */
export function getFileIconUrl(
  fileExtensionOrName: string,
  customColor?: string
): string | null {
  const iconConfig = getFileIcon(fileExtensionOrName);
  if (!iconConfig) {
    return null;
  }

  return getIconCdnUrl(iconConfig.slug, customColor ?? iconConfig.hex);
}
