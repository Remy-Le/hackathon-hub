const path = require('path');
const fs = require('fs');
const { chromium } = require('playwright');

(async () => {
  const outDir = path.join(__dirname, 'weekly-roundup-new-pngs');
  fs.mkdirSync(outDir, { recursive: true });

  const filePath = 'file:///' + path.join(__dirname, 'weekly-roundup-new.html').replace(/\\/g, '/');

  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 12500, height: 2300 } });
  // Force zoom to 1 from the very first paint (Chromium's `zoom` CSS property
  // doesn't reliably repaint backgrounds when the value changes at runtime,
  // so toggling the "100%" button after load leaves stale page-background
  // pixels behind the card's right/bottom edges).
  await page.addInitScript(() => {
    document.documentElement.style.setProperty('--z', '1');
  });
  await page.goto(filePath, { waitUntil: 'load' });
  await page.evaluate(() => document.fonts && document.fonts.ready);
  await page.waitForTimeout(300);

  const cards = await page.$$('#slidesA .card');
  console.log('found cards:', cards.length);

  const names = [
    '00-cover',
    '01-dach-1',
    '02-dach-2',
    '03-western-europe-1',
    '04-western-europe-2',
    '05-western-europe-3',
    '06-western-europe-4',
    '07-northern-europe',
    '08-southern-europe',
  ];

  for (let i = 0; i < cards.length; i++) {
    const name = names[i] || `slide-${String(i).padStart(2, '0')}`;
    const outPath = path.join(outDir, `${name}.png`);
    await cards[i].screenshot({ path: outPath });
    console.log('saved', outPath);
  }

  await browser.close();
})().catch(e => { console.error(e); process.exit(1); });
