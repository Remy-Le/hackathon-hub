const path = require('path');
const fs = require('fs');
const { chromium } = require('playwright');

(async () => {
  const outDir = path.join(__dirname, 'weekly-roundup-new-pngs');
  fs.mkdirSync(outDir, { recursive: true });

  // The page ships zoomed to 0.42 for on-screen review. Force zoom to 1 in the
  // source *before* the first paint by string-replacing the CSS, then load via
  // setContent -- Chromium doesn't reliably repaint backgrounds on a *runtime*
  // `zoom` change (via the `--z` var or an injected stylesheet), which leaves
  // stale page-background pixels behind the card's right/bottom edges.
  let html = fs.readFileSync(path.join(__dirname, 'weekly-roundup-new.html'), 'utf8');
  const before = html;
  html = html.replace('.scaler{zoom:var(--z,.42)}', '.scaler{}');
  if (html === before) {
    throw new Error('could not neutralize .scaler zoom -- rule not found');
  }
  // Strip the on-screen review chrome so each 1350px card lays out at full size
  // with nothing clipping it. Without this the `.wrap` max-width + `.stage`
  // horizontal scroll box clip the right of every card in the screenshot.
  html = html.replace('</style>', `
    header.intro,.controls,section.variant h2,section.variant .desc{display:none!important}
    .wrap{max-width:none!important;margin:0!important;padding:0!important}
    .stage{overflow:visible!important;border:0!important;border-radius:0!important;padding:0!important;background:#000!important}
  </style>`);

  const browser = await chromium.launch();
  const page = await browser.newPage({
    viewport: { width: 12500, height: 2300 },
    deviceScaleFactor: 2, // 1350px card -> 2700px PNG
  });
  await page.setContent(html, { waitUntil: 'load' });
  await page.evaluate(() => document.fonts && document.fonts.ready);
  await page.waitForTimeout(400);

  const cards = await page.$$('#slidesA .card');
  const rect = await cards[0].boundingBox();
  console.log('found cards:', cards.length, '| card size:', rect.width + 'x' + rect.height);
  if (Math.round(rect.width) !== 1350) {
    throw new Error(`expected 1350px cards, got ${rect.width}px -- zoom override failed`);
  }

  const names = [
    '00-cover',
    '01-dach-1',
    '02-dach-2',
    '03-dach-3',
    '04-dach-4',
    '05-western-europe-1',
    '06-western-europe-2',
    '07-western-europe-3',
    '08-western-europe-4',
    '09-western-europe-5',
    '10-western-europe-6',
    '11-northern-europe-1',
    '12-northern-europe-2',
    '13-southern-europe-1',
    '14-southern-europe-2',
    '15-southern-europe-3',
    '16-central-eastern-europe',
    '17-southeast-europe',
  ];

  for (let i = 0; i < cards.length; i++) {
    const name = names[i] || `slide-${String(i).padStart(2, '0')}`;
    const outPath = path.join(outDir, `${name}.png`);
    await cards[i].screenshot({ path: outPath });
    console.log('saved', outPath);
  }

  await browser.close();
})().catch(e => { console.error(e); process.exit(1); });
