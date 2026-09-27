const path = require('path');
const fs = require('fs');

function parseArgs(argv) {
  const out = {};
  for (const a of argv) {
    const m = a.match(/^--([^=]+)=(.*)$/);
    if (m) out[m[1]] = m[2];
  }
  return out;
}

// The page ships zoomed to 0.42 for on-screen review. Force zoom to 1 in the
// source *before* the first paint by string-replacing the CSS, then load via
// setContent -- Chromium doesn't reliably repaint backgrounds on a *runtime*
// `zoom` change (via the `--z` var or an injected stylesheet), which leaves
// stale page-background pixels behind the card's right/bottom edges.
function neutralizeZoomAndChrome(html) {
  const before = html;
  let out = html.replace('.scaler{zoom:var(--z,.42)}', '.scaler{}');
  if (out === before) {
    throw new Error('could not neutralize .scaler zoom -- rule not found');
  }
  // Strip the on-screen review chrome so each 1350px card lays out at full size
  // with nothing clipping it. Without this the `.wrap` max-width + `.stage`
  // horizontal scroll box clip the right of every card in the screenshot.
  out = out.replace('</style>', `
    header.intro,.controls,section.variant h2,section.variant .desc{display:none!important}
    .wrap{max-width:none!important;margin:0!important;padding:0!important}
    .stage{overflow:visible!important;border:0!important;border-radius:0!important;padding:0!important;background:#000!important}
  </style>`);
  return out;
}

module.exports = { parseArgs, neutralizeZoomAndChrome };

if (require.main === module) {
(async () => {
  const { chromium } = require('playwright');
  const args = parseArgs(process.argv.slice(2));
  if (!args.html || !args.outdir) {
    console.error('Usage: node render-pngs.js --html=<path> --outdir=<path>');
    process.exit(1);
  }
  const htmlPath = path.resolve(args.html);
  const outDir = path.resolve(args.outdir);
  fs.mkdirSync(outDir, { recursive: true });

  let html = fs.readFileSync(htmlPath, 'utf8');
  html = neutralizeZoomAndChrome(html);

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

  const names = await page.evaluate(() => window.__slideNames);

  for (let i = 0; i < cards.length; i++) {
    const name = (names && names[i]) || `slide-${String(i).padStart(2, '0')}`;
    const outPath = path.join(outDir, `${name}.png`);
    await cards[i].screenshot({ path: outPath });
    console.log('saved', outPath);
  }

  await browser.close();
})().catch(e => { console.error(e); process.exit(1); });
}
