const { test } = require('node:test');
const assert = require('node:assert/strict');
const path = require('path');
const fs = require('fs');
const { execFileSync } = require('child_process');

const { neutralizeZoomAndChrome } = require('../render-pngs.js');

const ROOT = path.join(__dirname, '..');
const SCRIPT = path.join(ROOT, 'render-pngs.js');
const FIXTURES = path.join(__dirname, 'fixtures');

test('CLI: missing --html/--outdir exits non-zero with a usage message', () => {
  assert.throws(() => execFileSync('node', [SCRIPT], { encoding: 'utf-8' }), (err) => {
    assert.equal(err.status, 1);
    assert.match(err.stderr, /Usage: node render-pngs.js/);
    return true;
  });
});

test('neutralizeZoomAndChrome strips the .scaler zoom rule and review chrome', () => {
  const html = '<style>.scaler{zoom:var(--z,.42)}</style><div class="wrap"></div>';
  const out = neutralizeZoomAndChrome(html);
  assert.doesNotMatch(out, /zoom:var\(--z,\.42\)/);
  assert.match(out, /\.wrap\{max-width:none!important/);
});

test('neutralizeZoomAndChrome throws when the .scaler zoom rule is missing (documented Playwright gotcha)', () => {
  const html = fs.readFileSync(path.join(FIXTURES, 'no-scaler.html'), 'utf-8');
  assert.throws(() => neutralizeZoomAndChrome(html), /could not neutralize \.scaler zoom/);
});
