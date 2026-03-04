import { describe, it, expect } from 'vitest';
import {
  resolveLanguageAlias,
  getLanguageDisplayName,
} from './language.utils';

// ─── resolveLanguageAlias ─────────────────────────────────────────────────────

describe('resolveLanguageAlias', () => {
  it('resolves "shell" to "bash"', () => {
    expect(resolveLanguageAlias('shell')).toBe('bash');
  });

  it('resolves "sh" to "bash"', () => {
    expect(resolveLanguageAlias('sh')).toBe('bash');
  });

  it('resolves "zsh" to "bash"', () => {
    expect(resolveLanguageAlias('zsh')).toBe('bash');
  });

  it('resolves "console" to "bash"', () => {
    expect(resolveLanguageAlias('console')).toBe('bash');
  });

  it('returns the same language when no alias exists', () => {
    expect(resolveLanguageAlias('typescript')).toBe('typescript');
    expect(resolveLanguageAlias('python')).toBe('python');
    expect(resolveLanguageAlias('rust')).toBe('rust');
  });
});

// ─── getLanguageDisplayName ───────────────────────────────────────────────────

describe('getLanguageDisplayName', () => {
  it('returns "TypeScript" for typescript', () => {
    expect(getLanguageDisplayName('typescript')).toBe('TypeScript');
  });

  it('returns "JavaScript" for javascript', () => {
    expect(getLanguageDisplayName('javascript')).toBe('JavaScript');
  });

  it('returns "Python" for python', () => {
    expect(getLanguageDisplayName('python')).toBe('Python');
  });

  it('returns "C++" for cpp', () => {
    expect(getLanguageDisplayName('cpp')).toBe('C++');
  });

  it('returns "C#" for csharp', () => {
    expect(getLanguageDisplayName('csharp')).toBe('C#');
  });

  it('returns "Plain Text" for plaintext', () => {
    expect(getLanguageDisplayName('plaintext')).toBe('Plain Text');
  });

  it('returns uppercased language for unknown language', () => {
    expect(getLanguageDisplayName('cobol' as any)).toBe('COBOL');
  });

  it('returns "HTML" for html', () => {
    expect(getLanguageDisplayName('html')).toBe('HTML');
  });

  it('returns "YAML" for yaml', () => {
    expect(getLanguageDisplayName('yaml')).toBe('YAML');
  });

  it('returns "GraphQL" for graphql', () => {
    expect(getLanguageDisplayName('graphql')).toBe('GraphQL');
  });

  it('returns "Dockerfile" for dockerfile', () => {
    expect(getLanguageDisplayName('dockerfile')).toBe('Dockerfile');
  });
});
