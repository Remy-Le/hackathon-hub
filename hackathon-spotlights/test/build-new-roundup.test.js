const { test } = require('node:test');
const assert = require('node:assert/strict');
const path = require('path');
const fs = require('fs');
const os = require('os');
const { execFileSync } = require('child_process');

const {
  regionLabel,
  isNonCountryRegion,
  headlineWords,
  bareLen,
  headlineFontSize,
  headlineLabelHtml,
  joinWithAnd,
  sinceDateFromWeek,
  LONG_TO_SHORT_TAGS,
  shortTag,
  buildExtraFlagsScript,
  extractLayoutParts,
  buildRoundupHtml,
} = require('../build-new-roundup.js');

const ROOT = path.join(__dirname, '..');
const SCRIPT = path.join(ROOT, 'build-new-roundup.js');
const FIXTURES = path.join(__dirname, 'fixtures');
const layoutsHtml = fs.readFileSync(path.join(ROOT, 'weekly-roundup-layouts.html'), 'utf-8');

function tmpFile(name) {
  return path.join(fs.mkdtempSync(path.join(os.tmpdir(), 'roundup-test-')), name);
}

test('regionLabel: single region returns its own name', () => {
  assert.equal(regionLabel([{ name: 'DACH' }]), 'DACH');
});

test('regionLabel: multiple regions fall back to Europe', () => {
  assert.equal(regionLabel([{ name: 'DACH' }, { name: 'Western Europe' }]), 'Europe');
});

test('isNonCountryRegion: true only for a single online-only pseudo-region', () => {
  assert.equal(isNonCountryRegion([{ countries: [{ code: 'online' }] }]), true);
  assert.equal(isNonCountryRegion([{ countries: [{ code: 'at' }] }]), false);
  assert.equal(isNonCountryRegion([{ countries: [{ code: 'online' }, { code: 'at' }] }]), false);
  assert.equal(isNonCountryRegion([{ countries: [{ code: 'online' }] }, { countries: [{ code: 'at' }] }]), false);
});

test('headlineWords: no theme falls back to "hackathons"', () => {
  assert.equal(headlineWords(null), 'hackathons');
});

test('headlineWords: theme becomes "<theme> events"', () => {
  assert.equal(headlineWords('NASA Space Apps Challenge'), 'NASA Space Apps Challenge events');
});

test('bareLen strips non-letters (spaces, ampersands, digits)', () => {
  assert.equal(bareLen('DACH'), 4);
  assert.equal(bareLen('Central & Eastern Europe'), 20);
  assert.equal(bareLen('Europe'), 6);
});

test('headlineFontSize buckets at 6/12/20 bare-letter chars', () => {
  assert.equal(headlineFontSize('DACH'), 112); // bareLen 4 <= 6
  assert.equal(headlineFontSize('Europe'), 112); // bareLen 6 <= 6
  assert.equal(headlineFontSize('Benelux'), 104); // bareLen 7, 6 < 7 <= 12
  assert.equal(headlineFontSize('Western Europe'), 100); // bareLen 13, 12 < 13 <= 20
  assert.equal(headlineFontSize('Central & Eastern Europe'), 100); // bareLen 20 <= 20, hand-tuned this session
  assert.equal(headlineFontSize('A Very Long Region Name Indeed'), 92); // bareLen > 20
});

test('headlineLabelHtml: short label passes through escaped, no <br>', () => {
  assert.equal(headlineLabelHtml('DACH'), 'DACH');
});

test('headlineLabelHtml: long label splits at the last space', () => {
  assert.equal(headlineLabelHtml('Central & Eastern Europe'), 'Central &amp; Eastern<br>Europe');
});

test('headlineLabelHtml: long label with no space does not throw', () => {
  assert.doesNotThrow(() => headlineLabelHtml('Supercalifragilisticexpialidocious'));
});

test('joinWithAnd: 0/1/2/3+ items', () => {
  assert.equal(joinWithAnd([]), '');
  assert.equal(joinWithAnd(['Austria']), 'Austria');
  assert.equal(joinWithAnd(['Austria', 'Germany']), 'Austria and Germany');
  assert.equal(joinWithAnd(['Austria', 'Germany', 'Switzerland']), 'Austria, Germany, and Switzerland');
});

test('sinceDateFromWeek parses "SINCE <day> <MON> <year>"', () => {
  assert.equal(sinceDateFromWeek('SINCE 21 SEP 2026'), '21 Sep');
  assert.equal(sinceDateFromWeek('SINCE 3 OCT 2026'), '3 Oct');
});

test('sinceDateFromWeek falls back to the raw string on unrecognized input', () => {
  assert.equal(sinceDateFromWeek('garbage'), 'garbage');
});

test('shortTag maps a long-form tag to its carousel short form', () => {
  assert.equal(shortTag('Artificial Intelligence (AI)'), 'AI');
  assert.equal(shortTag('Developer Tools / DX'), 'Dev Tools');
});

test('shortTag passes an already-short/pass-through tag through unchanged', () => {
  assert.equal(shortTag('FinTech'), 'FinTech');
});

test('shortTag passes an unrecognized tag through unchanged', () => {
  assert.equal(shortTag('Some Brand New Category'), 'Some Brand New Category');
});

test('LONG_TO_SHORT_TAGS has no entry that maps to itself unnecessarily', () => {
  for (const [long, short] of Object.entries(LONG_TO_SHORT_TAGS)) {
    assert.notEqual(long, short);
  }
});

test('buildExtraFlagsScript embeds a base64 data URI that round-trips to the source SVG', () => {
  const svgPath = path.join(ROOT, 'flags', 'mt.svg');
  const originalSvg = fs.readFileSync(svgPath, 'utf-8');
  const script = buildExtraFlagsScript({ mt: 'flags/mt.svg' }, ROOT);
  assert.match(script, /^FLAGS\.mt = '<image /);
  const b64 = script.match(/base64,([^"']+)/)[1];
  assert.equal(Buffer.from(b64, 'base64').toString('utf-8'), originalSvg);
});

test('buildExtraFlagsScript returns empty string for no extra flags', () => {
  assert.equal(buildExtraFlagsScript({}, ROOT), '');
});

test('extractLayoutParts pulls cardCss/logoLine/flagsLine out of the shared layout file', () => {
  const { cardCss, logoLine, flagsLine } = extractLayoutParts(layoutsHtml);
  assert.match(cardCss, /\.foot-mono\{/);
  assert.match(logoLine, /<img class="logo"/);
  assert.match(flagsLine, /^const FLAGS =/);
});

test('CLI: missing --data/--out exits non-zero with a usage message', () => {
  assert.throws(() => execFileSync('node', [SCRIPT], { encoding: 'utf-8' }), (err) => {
    assert.equal(err.status, 1);
    assert.match(err.stderr, /Usage: node build-new-roundup.js/);
    return true;
  });
});

test('full-run regression: DACH fixture produces the right title, headline size, and no cross-region leakage', () => {
  const out = tmpFile('dach.html');
  execFileSync('node', [SCRIPT, `--data=${path.join(FIXTURES, 'dach-data.js')}`, `--out=${out}`]);
  const html = fs.readFileSync(out, 'utf-8');
  assert.match(html, /<title>New Hackathons in DACH — Weekly Roundup<\/title>/);
  assert.match(html, /font-size:112px;line-height:1\.0/);
  assert.doesNotMatch(html, /Southeast Europe/);
  // data.js holds long-form tags (the shared representation with the text-post
  // skills); the carousel renders the short form via SHORT_TAGS at runtime.
  assert.match(html, /"Artificial Intelligence \(AI\)":"AI"/); // SHORT_TAGS embedded in the page script
});

test('concurrency regression: two overlapping builds against different data files never cross-contaminate', async () => {
  const outA = tmpFile('a.html');
  const outB = tmpFile('b.html');
  const before = fs.readFileSync(SCRIPT, 'utf-8');

  await Promise.all([
    new Promise((resolve, reject) => {
      execFileSync('node', [SCRIPT, `--data=${path.join(FIXTURES, 'dach-data.js')}`, `--out=${outA}`]);
      resolve();
    }),
    new Promise((resolve, reject) => {
      execFileSync('node', [SCRIPT, `--data=${path.join(FIXTURES, 'synth-data.js')}`, `--out=${outB}`]);
      resolve();
    }),
  ]);

  const htmlA = fs.readFileSync(outA, 'utf-8');
  const htmlB = fs.readFileSync(outB, 'utf-8');
  assert.match(htmlA, /New Hackathons in DACH/);
  assert.doesNotMatch(htmlA, /Southeast Europe/);
  assert.match(htmlB, /New Hackathons in Southeast Europe/);
  assert.doesNotMatch(htmlB, /DACH/);

  // The script itself must never be touched by a run -- that's the whole point of the refactor.
  assert.equal(fs.readFileSync(SCRIPT, 'utf-8'), before);
});

test('buildRoundupHtml (in-process, no subprocess): matches the DACH fixture data', () => {
  const data = require(path.join(FIXTURES, 'dach-data.js'));
  const html = buildRoundupHtml({
    regions: data.regions,
    week: data.week,
    extraFlags: data.extraFlags,
    layoutsHtml,
    baseDir: ROOT,
  });
  assert.match(html, /New Hackathons in DACH/);
  assert.match(html, /in DACH <span/);
});
