/// <reference types="vitest/globals" />

import '@angular/compiler';
import '@analogjs/vitest-angular/setup-snapshots';

import { setupTestBed } from '@analogjs/vitest-angular/setup-testbed';
import { vi } from 'vitest';

// Mock window.matchMedia for components that use media queries
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

// Mock clipboard API
Object.defineProperty(navigator, 'clipboard', {
  value: {
    writeText: vi.fn().mockResolvedValue(undefined),
    readText: vi.fn().mockResolvedValue(''),
  },
  writable: true,
});

// Mock document.queryCommandSupported
document.queryCommandSupported = vi.fn().mockReturnValue(false);

setupTestBed();
