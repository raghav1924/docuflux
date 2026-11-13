import test from 'node:test';
import assert from 'node:assert';
import { AstParser } from '../core/ast.js';
import { CycleDetector } from '../core/cycles.js';
import { FileNode } from '../core/types.js';

test('AstParser extracts import statements cleanly', () => {
  const code = `
    import React from 'react';
    import { Button } from './components/button';
    import { cn } from '@/lib/utils';
    export * from './types';
    const dyn = import('./dynamic-module');
    const legacy = require('./legacy-util');
  `;

  const imports = AstParser.extractRawImports(code);
  assert.ok(imports.includes('react'));
  assert.ok(imports.includes('./components/button'));
  assert.ok(imports.includes('@/lib/utils'));
  assert.ok(imports.includes('./types'));
  assert.ok(imports.includes('./dynamic-module'));
  assert.ok(imports.includes('./legacy-util'));
});

test('CycleDetector identifies cyclic dependencies correctly', () => {
  const mockNodes: Record<string, FileNode> = {
    'a.ts': {
      id: 'a.ts',
      absolutePath: '/a.ts',
      name: 'a.ts',
      extension: '.ts',
      lineCount: 10,
      sizeBytes: 100,
      dependencies: ['b.ts'],
      dependents: ['c.ts'],
      isEntryPoint: false,
      isOrphan: false,
    },
    'b.ts': {
      id: 'b.ts',
      absolutePath: '/b.ts',
      name: 'b.ts',
      extension: '.ts',
      lineCount: 10,
      sizeBytes: 100,
      dependencies: ['c.ts'],
      dependents: ['a.ts'],
      isEntryPoint: false,
      isOrphan: false,
    },
    'c.ts': {
      id: 'c.ts',
      absolutePath: '/c.ts',
      name: 'c.ts',
      extension: '.ts',
      lineCount: 10,
      sizeBytes: 100,
      dependencies: ['a.ts'], // Cycle: a -> b -> c -> a
      dependents: ['b.ts'],
      isEntryPoint: false,
      isOrphan: false,
    },
    'd.ts': {
      id: 'd.ts',
      absolutePath: '/d.ts',
      name: 'd.ts',
      extension: '.ts',
      lineCount: 10,
      sizeBytes: 100,
      dependencies: [],
      dependents: [],
      isEntryPoint: false,
      isOrphan: true,
    },
  };

  const cycles = CycleDetector.findCycles(mockNodes);
  assert.strictEqual(cycles.length, 1, 'Should find exactly 1 cyclic component');
  assert.strictEqual(cycles[0].length, 3, 'Cycle length should be 3');
});

test('CycleDetector returns empty array for acyclic DAG', () => {
  const dagNodes: Record<string, FileNode> = {
    'root.ts': {
      id: 'root.ts',
      absolutePath: '/root.ts',
      name: 'root.ts',
      extension: '.ts',
      lineCount: 10,
      sizeBytes: 100,
      dependencies: ['leaf.ts'],
      dependents: [],
      isEntryPoint: true,
      isOrphan: false,
    },
    'leaf.ts': {
      id: 'leaf.ts',
      absolutePath: '/leaf.ts',
      name: 'leaf.ts',
      extension: '.ts',
      lineCount: 5,
      sizeBytes: 50,
      dependencies: [],
      dependents: ['root.ts'],
      isEntryPoint: false,
      isOrphan: false,
    },
  };

  const cycles = CycleDetector.findCycles(dagNodes);
  assert.strictEqual(cycles.length, 0, 'DAG should have zero cycles');
});

test('CycleDetector identifies direct self-referencing loops', () => {
  const selfLoopNodes: Record<string, FileNode> = {
    'self.ts': {
      id: 'self.ts',
      absolutePath: '/self.ts',
      name: 'self.ts',
      extension: '.ts',
      lineCount: 15,
      sizeBytes: 150,
      dependencies: ['self.ts'],
      dependents: ['self.ts'],
      isEntryPoint: false,
      isOrphan: false,
    },
  };

  const cycles = CycleDetector.findCycles(selfLoopNodes);
  assert.strictEqual(cycles.length, 1, 'Should detect self loop');
  assert.strictEqual(cycles[0].cycle[0], 'self.ts');
});



