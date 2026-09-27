const { test } = require('node:test');
const assert = require('node:assert/strict');
const path = require('path');
const fs = require('fs');
const os = require('os');
const { chromium } = require('playwright');

const { buildRoundupHtml } = require('../build-new-roundup.js');
const { neutralizeZoomAndChrome } = require('../render-pngs.js');

const ROOT = path.join(__dirname, '..');
const FIXTURES = path.join(__dirname, 'fixtures');
const layoutsHtml = fs.readFileSync(path.join(ROOT, 'weekly-roundup-layouts.html'), 'utf-8');

function makeRegion(name, codes, eventCount) {
  return {
    name,
    codes,
    countries: [
      {
        code: codes[0],
        name: `${name} Country`,
        events: Array.from({ length: eventCount }, (_, i) => ({
          name: `Synthetic Hack ${i + 1}`,
          loc: 'Testville',
          date: '1-2 Oct',
          tags: [],
        })),
      },
    ],
  };
}

async function renderCards(html) {
  const stripped = neutralizeZoomAndChrome(html);
  const browser = await chromium.launch();
  try {
    const page = await browser.newPage({ viewport: { width: 12500, height: 2300 }, deviceScaleFactor: 1 });
    await page.setContent(stripped, { waitUntil: 'load' });
    await page.evaluate(() => document.fonts && document.fonts.ready);
    const cards = await page.$$('#slidesA .card');
    const rect = cards.length ? await cards[0].boundingBox() : null;
    const names = await page.evaluate(() => window.__slideNames);
    return { cardCount: cards.length, rect, names };
  } finally {
    await browser.close();
  }
}

test('DACH fixture: card count, 1350px cards, and __slideNames match the published pattern', async () => {
  const data = require(path.join(FIXTURES, 'dach-data.js'));
  const html = buildRoundupHtml({
    regions: data.regions,
    week: data.week,
    extraFlags: data.extraFlags,
    layoutsHtml,
    baseDir: ROOT,
  });
  const { cardCount, rect, names } = await renderCards(html);

  assert.equal(cardCount, 8); // 1 cover + 7 region pages (17 events / 4 per slide)
  assert.equal(Math.round(rect.width), 1350);
  assert.equal(Math.round(rect.height), 1350);
  assert.deepEqual(names, [
    '00-cover',
    '01-dach-1', '02-dach-2', '03-dach-3', '04-dach-4',
    '05-dach-5', '06-dach-6', '07-dach-7',
  ]);
});

test('DACH fixture: tags render in carousel short form, not the long form stored in data.js', async () => {
  const data = require(path.join(FIXTURES, 'dach-data.js'));
  const html = buildRoundupHtml({
    regions: data.regions,
    week: data.week,
    extraFlags: data.extraFlags,
    layoutsHtml,
    baseDir: ROOT,
  });
  const stripped = neutralizeZoomAndChrome(html);
  const browser = await chromium.launch();
  try {
    const page = await browser.newPage({ viewport: { width: 12500, height: 2300 }, deviceScaleFactor: 1 });
    await page.setContent(stripped, { waitUntil: 'load' });
    const firstRegionPage = (await page.$$('#slidesA .card'))[1];
    const text = await firstRegionPage.innerText();
    assert.match(text, /\bAI\b/); // short form rendered
    assert.match(text, /\bData Science\b/);
    assert.doesNotMatch(text, /Artificial Intelligence \(AI\)/); // long form from data.js never rendered verbatim
    assert.doesNotMatch(text, /Data Science & Analytics/);
  } finally {
    await browser.close();
  }
});

test('pagination boundary: 4/5/9 events produce 1/2/3 pages with no orphaned country header', async () => {
  for (const [eventCount, expectedPages] of [[4, 1], [5, 2], [9, 3]]) {
    const region = makeRegion('Boundary Region', ['xx'], eventCount);
    const html = buildRoundupHtml({
      regions: [region],
      week: 'SINCE 1 OCT 2026',
      extraFlags: {},
      layoutsHtml,
      baseDir: ROOT,
    });
    const { cardCount, names } = await renderCards(html);
    assert.equal(cardCount, 1 + expectedPages, `event count ${eventCount}`);
    assert.equal(names.length, cardCount, `event count ${eventCount}`);
  }
});
