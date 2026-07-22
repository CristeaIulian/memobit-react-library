#!/usr/bin/env node
/**
 * check-npm-auth.mjs
 *
 * Ship preflight: verify we're actually authenticated to the npm registry
 * BEFORE `npm version` bumps + commits + tags. A stale/missing token makes
 * `npm publish` fail with a misleading 404 — but only after the version commit
 * and tag already exist, leaving a bumped version with nothing published.
 * Running this first turns that into a clean, early failure with a fix hint.
 *
 * Passes when `npm whoami` resolves to a username; fails (exit 1) otherwise.
 */

import { execSync } from 'node:child_process';

// execSync (shell) so Windows resolves npm.cmd; whoami validates the token.
try {
  const user = execSync('npm whoami', { encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] }).trim();
  console.log(`✓ npm: authenticated as ${user}`);
} catch {
  console.error(
    '✗ npm auth check failed — not logged in to the registry.\n' +
    '  The token in ~/.npmrc is missing or invalid, so `npm publish` would\n' +
    '  fail with a misleading 404 AFTER the version bump. Aborting before that.\n\n' +
    '  Fix: create a token at https://www.npmjs.com/settings/~/tokens and run\n' +
    '    npm config set //registry.npmjs.org/:_authToken=<TOKEN>\n' +
    '  then verify with `npm whoami` and re-run the ship.'
  );
  process.exit(1);
}
