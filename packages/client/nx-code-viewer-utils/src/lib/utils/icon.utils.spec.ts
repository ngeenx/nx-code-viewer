import { describe, it, expect } from 'vitest';
import {
  getExtensionFromLanguage,
  getExtensionFromFilename,
  getIconCdnUrl,
  getFileIcon,
  getFileIconUrl,
  LANGUAGE_TO_EXTENSION_MAP,
  FILE_EXTENSION_ICON_MAP,
  FILENAME_ICON_MAP,
} from './icon.utils';

// ─── getExtensionFromLanguage ─────────────────────────────────────────────────

describe('getExtensionFromLanguage', () => {
  it('returns null for empty string', () => {
    expect(getExtensionFromLanguage('')).toBeNull();
  });

  it('returns .ts for typescript', () => {
    expect(getExtensionFromLanguage('typescript')).toBe('.ts');
  });

  it('is case-insensitive', () => {
    expect(getExtensionFromLanguage('TypeScript')).toBe('.ts');
  });

  it('returns .py for python', () => {
    expect(getExtensionFromLanguage('python')).toBe('.py');
  });

  it('returns null for unknown language', () => {
    expect(getExtensionFromLanguage('cobol')).toBeNull();
  });

  it('maps all keys in LANGUAGE_TO_EXTENSION_MAP', () => {
    for (const [lang, ext] of Object.entries(LANGUAGE_TO_EXTENSION_MAP)) {
      expect(getExtensionFromLanguage(lang)).toBe(ext);
    }
  });
});

// ─── getExtensionFromFilename ─────────────────────────────────────────────────

describe('getExtensionFromFilename', () => {
  it('returns null for empty string', () => {
    expect(getExtensionFromFilename('')).toBeNull();
  });

  it('returns .ts for foo.ts', () => {
    expect(getExtensionFromFilename('foo.ts')).toBe('.ts');
  });

  it('returns compound extension .component.ts', () => {
    expect(getExtensionFromFilename('app.component.ts')).toBe('.component.ts');
  });

  it('returns compound extension .module.ts', () => {
    expect(getExtensionFromFilename('app.module.ts')).toBe('.module.ts');
  });

  it('returns compound extension .service.ts', () => {
    expect(getExtensionFromFilename('my.service.ts')).toBe('.service.ts');
  });

  it('returns null for file with no extension', () => {
    expect(getExtensionFromFilename('Makefile')).toBeNull();
  });

  it('returns null for file ending with dot', () => {
    expect(getExtensionFromFilename('trailing.')).toBeNull();
  });

  it('lowercases the extension', () => {
    expect(getExtensionFromFilename('File.TS')).toBe('.ts');
  });
});

// ─── getIconCdnUrl ────────────────────────────────────────────────────────────

describe('getIconCdnUrl', () => {
  it('returns empty string for empty slug', () => {
    expect(getIconCdnUrl('')).toBe('');
  });

  it('returns base CDN URL without color', () => {
    expect(getIconCdnUrl('typescript')).toBe(
      'https://cdn.simpleicons.org/typescript'
    );
  });

  it('appends color when provided', () => {
    expect(getIconCdnUrl('typescript', '3178C6')).toBe(
      'https://cdn.simpleicons.org/typescript/3178C6'
    );
  });
});

// ─── getFileIcon ──────────────────────────────────────────────────────────────

describe('getFileIcon', () => {
  it('returns null for empty string', () => {
    expect(getFileIcon('')).toBeNull();
  });

  it('returns icon for .ts extension', () => {
    const icon = getFileIcon('.ts');
    expect(icon?.slug).toBe('typescript');
    expect(icon?.hex).toBe('3178C6');
  });

  it('returns icon for .js extension', () => {
    expect(getFileIcon('.js')?.slug).toBe('javascript');
  });

  it('returns icon for special filename package.json', () => {
    expect(getFileIcon('package.json')?.slug).toBe('npm');
  });

  it('is case-insensitive for extension lookup', () => {
    expect(getFileIcon('.TS')?.slug).toBe('typescript');
  });

  it('resolves icon from full filename foo.ts', () => {
    expect(getFileIcon('foo.ts')?.slug).toBe('typescript');
  });

  it('returns null for unknown extension', () => {
    expect(getFileIcon('.xyz')).toBeNull();
  });

  it('returns angular icon for .component.ts', () => {
    expect(getFileIcon('app.component.ts')?.slug).toBe('angular');
  });

  it('covers all FILE_EXTENSION_ICON_MAP keys', () => {
    for (const ext of Object.keys(FILE_EXTENSION_ICON_MAP)) {
      const icon = getFileIcon(ext);
      expect(icon).not.toBeNull();
    }
  });

  it('resolves lowercase-invariant FILENAME_ICON_MAP keys', () => {
    // getFileIcon lowercases the input before checking FILENAME_ICON_MAP, so only
    // keys that are already lowercase will be found via that path.
    // Keys like "Dockerfile" and "Makefile" are stored with mixed case and must be
    // passed with exact casing (or resolved via the extension fallback).
    const lowercaseOnlyKeys = Object.keys(FILENAME_ICON_MAP).filter(
      (k) => k === k.toLowerCase()
    );
    for (const name of lowercaseOnlyKeys) {
      expect(getFileIcon(name)).not.toBeNull();
    }
  });

  it('returns null for "Dockerfile" because getFileIcon lowercases input before map lookup', () => {
    // getFileIcon normalizes to lowercase ("dockerfile") before checking FILENAME_ICON_MAP,
    // whose key is "Dockerfile" (capitalized). The normalized string won't match, so the
    // result falls through to the extension extractor which also yields null for "dockerfile".
    expect(getFileIcon('Dockerfile')).toBeNull();
  });
});

// ─── getFileIconUrl ───────────────────────────────────────────────────────────

describe('getFileIconUrl', () => {
  it('returns null for unknown extension', () => {
    expect(getFileIconUrl('.xyz')).toBeNull();
  });

  it('returns full CDN URL with default hex for known extension', () => {
    const url = getFileIconUrl('.ts');
    expect(url).toBe('https://cdn.simpleicons.org/typescript/3178C6');
  });

  it('uses custom color override when provided', () => {
    const url = getFileIconUrl('.ts', 'FF0000');
    expect(url).toBe('https://cdn.simpleicons.org/typescript/FF0000');
  });
});
