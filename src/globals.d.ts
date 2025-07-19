/**
 * Global Type Declarations
 *
 * This file provides TypeScript declarations for global variables and functions
 * that are available in the testing environment through Vitest globals.
 *
 * Vue equivalent: Similar global type declarations would be in a types/ directory
 */

import type {
  vi,
  describe,
  it,
  test,
  expect,
  beforeAll,
  beforeEach,
  afterAll,
  afterEach,
} from 'vitest';
import type * as React from 'react';

// Declare Vitest globals for TypeScript
declare global {
  const vi: typeof import('vitest').vi;
  const describe: typeof import('vitest').describe;
  const it: typeof import('vitest').it;
  const test: typeof import('vitest').test;
  const expect: typeof import('vitest').expect;
  const beforeAll: typeof import('vitest').beforeAll;
  const beforeEach: typeof import('vitest').beforeEach;
  const afterAll: typeof import('vitest').afterAll;
  const afterEach: typeof import('vitest').afterEach;

  // JSX namespace for React 19 compatibility
  namespace JSX {
    interface Element extends React.ReactElement<any, any> {}
  }
}

export {};
