#!/usr/bin/env node
import { readFileSync, readdirSync, statSync } from 'fs';
import { join, relative } from 'path';

const ROOT = process.cwd();
let violations = 0;

function walk(dir, cb) {
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) {
      walk(full, cb);
    } else if (full.endsWith('.ts') || full.endsWith('.tsx')) {
      cb(full);
    }
  }
}

function check(file, content, rules) {
  for (const { pattern, message } of rules) {
    if (pattern.test(content)) {
      const rel = relative(ROOT, file);
      console.error(`[ARCH] ${rel}: ${message}`);
      violations++;
    }
  }
}

// core/* must not import from features/* or app/*
walk(join(ROOT, 'src/core'), (file) => {
  const content = readFileSync(file, 'utf8');
  check(file, content, [
    { pattern: /from ['"]@features\//, message: 'core/ must not import from features/' },
    { pattern: /from ['"]@app\//, message: 'core/ must not import from app/' },
  ]);
});

// ui/* may import @core/design-system (theme tokens are the foundation for primitives)
// but must not import from features/ or other core/ sub-paths
walk(join(ROOT, 'src/ui'), (file) => {
  const content = readFileSync(file, 'utf8');
  // Strip allowed @core/design-system imports before checking
  const stripped = content.replace(/from ['"]@core\/design-system[^'"]*['"]/g, '/* allowed */');
  check(file, stripped, [
    { pattern: /from ['"]@features\//, message: 'ui/ must not import from features/' },
    { pattern: /from ['"]@core\/(?!design-system)/, message: 'ui/ must not import from core/ (except core/design-system)' },
  ]);
});

// features/* must not directly import from other features' internals
walk(join(ROOT, 'src/features'), (file) => {
  const content = readFileSync(file, 'utf8');
  const featureDir = relative(join(ROOT, 'src/features'), file).split('/')[0];
  const importPattern = new RegExp(`from ['"]@features/(?!${featureDir}/index|${featureDir}')`);
  if (importPattern.test(content)) {
    // Allow importing from other features' index only
    const strictPattern = /from ['"]@features\/[^'"]+\/(?!index)[^'"]+['"]/;
    check(file, content, [
      { pattern: strictPattern, message: 'features must only import other features via their index.ts' },
    ]);
  }
});

if (violations === 0) {
  console.log('[ARCH] ✓ Architecture check passed');
  process.exit(0);
} else {
  console.error(`[ARCH] ✗ ${violations} violation(s) found`);
  process.exit(1);
}
