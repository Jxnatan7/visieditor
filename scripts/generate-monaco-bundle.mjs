#!/usr/bin/env node
// Monaco bundle generator — requires: pnpm add -D esbuild monaco-editor
// Usage: pnpm run generate-monaco
import { existsSync, mkdirSync } from 'fs';

console.log('[Monaco] Bundle generation placeholder.');
console.log('[Monaco] To generate a real Monaco bundle:');
console.log('  1. pnpm add -D monaco-editor shiki');
console.log('  2. Create src/editor/web-bundle/entry.ts');
console.log('  3. Run: node scripts/generate-monaco-bundle.mjs');
console.log('[Monaco] The current editor uses a lightweight HTML textarea fallback.');

if (!existsSync('assets/monaco')) {
  mkdirSync('assets/monaco', { recursive: true });
}

console.log('[Monaco] ✓ Assets directory ready');
