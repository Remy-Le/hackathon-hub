const fs = require('fs');
const path = require('path');

function parseArgs(argv) {
  const out = {};
  for (const a of argv) {
    const m = a.match(/^--([^=]+)=(.*)$/);
    if (m) out[m[1]] = m[2];
  }
  return out;
}

function regionLabel(regions) {
  return regions.length === 1 ? regions[0].name : 'Europe';
}

// True for a region made up of one pseudo-"country" that isn't a real place
// (currently just the Online/Remote block, code "online" -- see FLAGS.online,
// the one hand-drawn non-flag pictogram). The cover slide phrases its
// headline/subline differently for this case: no "N countries" claim, since
// there are none.
function isNonCountryRegion(regions) {
  return regions.length === 1 && regions[0].countries.length === 1 && regions[0].countries[0].code === 'online';
}

// A themed multi-region post (e.g. "NASA Space Apps Challenge", "Hacktoberfest
// Hack Day") replaces the generic "hackathons" word in the cover headline with
// "<theme> events", matching the wording pattern the text-post skills' title
// line already uses for the same case.
function headlineWords(theme) {
  return theme ? `${theme} events` : 'hackathons';
}

const escNode = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;');

// data.js holds long-form tags verbatim from the raw source (the shared
// representation the text-post skills also consume); the carousel is the
// only consumer that needs the short form, so the mapping is applied here at
// render time rather than baked into data.js. Add a row when a new tag
// appears in a raw paste with no entry here yet.
const LONG_TO_SHORT_TAGS = {
  'Artificial Intelligence (AI)': 'AI',
  'Developer Tools / DX': 'Dev Tools',
  'Internet of Things (IoT)': 'IoT',
  'Data Science & Analytics': 'Data Science',
  'Robotics & Autonomous Systems': 'Robotics',
  'HealthTech / Digital Health': 'HealthTech',
  'Industry 4.0 / Smart Manufacturing': 'Industry 4.0',
  'API & Platform Engineering': 'API & Platform Eng',
  'DevOps & Cloud Computing': 'DevOps & Cloud',
  'SpaceTech / Aerospace': 'SpaceTech',
  'NeuroTech / Neuroinformatics': 'NeuroTech',
  'Accessibility & Assistive Tech': 'Accessibility',
  'GovTech / Public Sector': 'GovTech',
  'MarTech / AdTech': 'MarTech',
  'Mobility & Transportation': 'Mobility',
  'Digital Identity & Privacy': 'Digital Identity',
  'Gaming & Game Development': 'Gaming',
  'Life Sciences & Biotechnology': 'Life Sciences',
  'Hardware & Embedded Systems': 'Hardware',
  'HCI / UX Innovation': 'HCI',
  'Supply Chain & Logistics': 'Supply Chain',
  'LegalTech / Legal AI': 'LegalTech',
  'Women in Tech / Diversity': 'Women in Tech',
  'Retail & E-Commerce': 'Retail',
  'EdTech / Education Technology': 'EdTech',
};

function shortTag(tag) {
  return LONG_TO_SHORT_TAGS[tag] || tag;
}

function bareLen(s) {
  return s.replace(/[^A-Za-z]/g, '').length;
}

// Heuristic bucket, not a pixel-perfect fit -- glance at the published
// artifact to confirm the headline still fits on one/two lines as intended.
function headlineFontSize(label) {
  const n = bareLen(label);
  if (n <= 6) return 112;
  if (n <= 12) return 104;
  if (n <= 20) return 100;
  return 92;
}
function headlineLabelHtml(label) {
  if (bareLen(label) <= 12) return escNode(label);
  const idx = label.lastIndexOf(' ');
  if (idx === -1) return escNode(label);
  return `${escNode(label.slice(0, idx))}<br>${escNode(label.slice(idx + 1))}`;
}
function joinWithAnd(list) {
  if (list.length === 0) return '';
  if (list.length === 1) return list[0];
  if (list.length === 2) return `${list[0]} and ${list[1]}`;
  return `${list.slice(0, -1).join(', ')}, and ${list[list.length - 1]}`;
}
function sinceDateFromWeek(week) {
  const m = week.match(/SINCE\s+(\d{1,2})\s+([A-Za-z]+)/i);
  if (!m) return week;
  const month = m[2][0].toUpperCase() + m[2].slice(1, 3).toLowerCase();
  return `${m[1]} ${month}`;
}
function buildExtraFlagsScript(extraFlags, baseDir) {
  return Object.entries(extraFlags).map(([code, svgPath]) => {
    const resolved = path.isAbsolute(svgPath) ? svgPath : path.join(baseDir, svgPath);
    const svg = fs.readFileSync(resolved, 'utf-8');
    const b64 = Buffer.from(svg, 'utf-8').toString('base64');
    return `FLAGS.${code} = '<image x="0" y="0" width="3" height="2" preserveAspectRatio="none" href="data:image/svg+xml;base64,${b64}"/>';`;
  }).join('\n');
}

function extractLayoutParts(src) {
  const lines = src.split('\n');

  // Extract the card CSS block (".card{...}" through ".foot-mono{...}")
  const cssStart = lines.findIndex(l => l.includes('/* ---- shared card'));
  const cssEnd = lines.findIndex(l => l.includes('.foot-mono{'));
  const cardCss = lines.slice(cssStart, cssEnd + 1).join('\n');

  // Extract logo line (the brand() function line with <img class="logo" ...)
  const logoLineIdx = lines.findIndex(l => l.includes('<img class="logo"'));
  const logoLine = lines[logoLineIdx];

  // Extract FLAGS object line
  const flagsLineIdx = lines.findIndex(l => l.startsWith('const FLAGS ='));
  const flagsLine = lines[flagsLineIdx];

  return { cardCss, logoLine, flagsLine };
}

function buildRoundupHtml({ regions, week, theme = null, extraFlags = {}, layoutsHtml, baseDir }) {
  const REGIONS = regions;
  const WEEK = week;
  const LABEL = regionLabel(REGIONS);

  const SINCE_DATE = sinceDateFromWeek(WEEK);
  const COUNTRY_LIST = joinWithAnd(REGIONS.flatMap(r => r.countries.map(c => c.name)));
  const NON_COUNTRY = isNonCountryRegion(REGIONS);
  const NON_COUNTRY_WORD = NON_COUNTRY ? REGIONS[0].countries[0].name : '';
  const DISPLAY_LABEL = NON_COUNTRY ? NON_COUNTRY_WORD : LABEL;
  const HEADLINE_SIZE = headlineFontSize(NON_COUNTRY ? NON_COUNTRY_WORD : (theme || DISPLAY_LABEL));
  const HEADLINE_LABEL_HTML = headlineLabelHtml(LABEL);
  const HEADLINE_HTML = NON_COUNTRY
    ? `<span style="color:#1e96f0">\${TOTAL}</span> new ${escNode(NON_COUNTRY_WORD)} hackathons<br><span style="color:#1e96f0">this week</span>`
    : `<span style="color:#1e96f0">\${TOTAL}</span> new ${escNode(headlineWords(theme))}<br>in ${HEADLINE_LABEL_HTML} <span style="color:#1e96f0">this week</span>`;
  const SUBLINE_HTML = NON_COUNTRY
    ? `Swipe through the cards →`
    : (REGIONS.flatMap(r => r.countries).length <= 4
      ? `Across ${escNode(COUNTRY_LIST)}. Swipe for the full list →`
      : `Across \${NCOUNTRIES} countries in ${escNode(LABEL)}. Swipe for the full list →`);

  const extraFlagsScript = buildExtraFlagsScript(extraFlags, baseDir);
  const { cardCss, logoLine, flagsLine } = extractLayoutParts(layoutsHtml);

  const out = `<title>New Hackathons in ${DISPLAY_LABEL}: Weekly Roundup</title>
<meta name="description" content="Carousel graphic: new hackathons published in ${DISPLAY_LABEL} since ${SINCE_DATE}, in the Hackathon Spotlight visual language.">
<style>
  :root{
    --page-bg:#f3f4f7; --page-panel:#ffffff; --ink:#1b1d21; --ink-soft:#565a63;
    --hair:#e2e4ea; --accent:#0f7bd4;
  }
  @media (prefers-color-scheme:dark){
    :root:not([data-theme="light"]){
      --page-bg:#0e1013; --page-panel:#16191e; --ink:#e7e8ec; --ink-soft:#9aa0aa;
      --hair:#262a31; --accent:#3a9ae0;
    }
  }
  :root[data-theme="dark"]{
    --page-bg:#0e1013; --page-panel:#16191e; --ink:#e7e8ec; --ink-soft:#9aa0aa;
    --hair:#262a31; --accent:#3a9ae0;
  }
  *{box-sizing:border-box}
  body{margin:0;background:var(--page-bg);color:var(--ink);
    font-family:'Inter',-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;}
  .wrap{max-width:1180px;margin:0 auto;padding:40px 24px 100px}
  header.intro h1{font-size:26px;font-weight:800;letter-spacing:-.02em;margin:0 0 8px}
  header.intro p{margin:0;max-width:60ch;color:var(--ink-soft);font-size:15px;line-height:1.55}
  .controls{position:sticky;top:0;z-index:20;display:flex;gap:8px;flex-wrap:wrap;align-items:center;
    background:var(--page-bg);padding:14px 0;margin:22px 0 6px;border-bottom:1px solid var(--hair)}
  .controls button{font:600 13px/1 'Inter',sans-serif;color:var(--ink);background:var(--page-panel);
    border:1px solid var(--hair);border-radius:7px;padding:9px 13px;cursor:pointer}
  .controls button.on{background:var(--accent);border-color:var(--accent);color:#fff}
  .controls .sep{flex:1}
  .controls .note{font-size:12px;color:var(--ink-soft)}
  section.variant{margin-top:40px}
  .variant h2{font-size:15px;font-weight:700;margin:0 0 4px;display:flex;align-items:baseline;gap:10px}
  .variant h2 span{font:600 11px/1 'IBM Plex Mono',monospace;letter-spacing:.08em;text-transform:uppercase;
    color:#fff;background:var(--accent);padding:4px 7px;border-radius:5px}
  .variant .desc{margin:0 0 16px;color:var(--ink-soft);font-size:13.5px;line-height:1.5;max-width:70ch}
  .stage{overflow:auto;border:1px solid var(--hair);border-radius:12px;background:
    repeating-conic-gradient(#0000 0% 25%, color-mix(in srgb,var(--hair) 45%, transparent) 0% 50%) 0 0/22px 22px;
    padding:22px}
  .slides{display:flex;gap:22px;align-items:flex-start;width:max-content}
  .scaler{zoom:var(--z,.42)}
  @supports not (zoom:1){.scaler{transform:scale(var(--z,.42));transform-origin:top left}}

  ${cardCss}
</style>

<div class="wrap">
  <header class="intro">
    <h1>New hackathons in ${DISPLAY_LABEL}: weekly roundup</h1>
    <p>Cover + region slides in the Hackathon Spotlight visual language (Option A carousel), covering
    hackathons published since ${SINCE_DATE} across ${COUNTRY_LIST}.</p>
  </header>

  <div class="controls">
    <button data-z=".30" class="on">Fit</button>
    <button data-z=".5">50%</button>
    <button data-z="1">100%</button>
    <span class="sep"></span>
    <button id="theme">Toggle page theme</button>
    <span class="note">Cards are intentionally dark (they're image assets).</span>
  </div>

  <section class="variant">
    <h2><span>Option A</span> Carousel: one slide per region</h2>
    <p class="desc">Cover + region slides, each a native 1350×1350 LinkedIn square.</p>
    <div class="stage"><div class="slides" id="slidesA"></div></div>
  </section>
</div>

<script>
const REGIONS = ${JSON.stringify(REGIONS)};
const WEEK = ${JSON.stringify(WEEK)};
const LABEL = ${JSON.stringify(LABEL)};
const NON_COUNTRY = ${JSON.stringify(NON_COUNTRY)};
const NON_COUNTRY_WORD = ${JSON.stringify(NON_COUNTRY_WORD)};
const SHORT_TAGS = ${JSON.stringify(LONG_TO_SHORT_TAGS)};
const TOTAL = REGIONS.reduce((n,r)=>n+r.countries.reduce((m,c)=>m+c.events.length,0),0);
const NCOUNTRIES = REGIONS.reduce((n,r)=>n+r.countries.length,0);
const NREGIONS = REGIONS.length;

const esc = s => s.replace(/&/g,"&amp;").replace(/</g,"&lt;");
const deco = \`<div class="grain"></div><div class="stars"></div>\`;
${flagsLine}
FLAGS.online = '<rect width="3" height="2" fill="#0f2942"/><circle cx="1.5" cy="1" r="0.75" fill="none" stroke="#8ad4ff" stroke-width="0.06"/><ellipse cx="1.5" cy="1" rx="0.3" ry="0.75" fill="none" stroke="#8ad4ff" stroke-width="0.05"/><line x1="0.75" y1="1" x2="2.25" y2="1" stroke="#8ad4ff" stroke-width="0.05"/>';
${extraFlagsScript}
function flag(code,h){const w=(h*1.5).toFixed(1);return \`<svg viewBox="0 0 3 2" width="\${w}" height="\${h}" preserveAspectRatio="none" style="border-radius:2px;box-shadow:0 0 0 1px rgba(255,255,255,.22);display:inline-block;vertical-align:middle">\${FLAGS[code]||''}</svg>\`;}
function flagRow(codes,h){return \`<span style="display:inline-flex;gap:6px;vertical-align:middle">\`+codes.map(c=>flag(c,h)).join('')+\`</span>\`;}
function regionDisplayName(r){return (r.countries.length===1 && r.countries[0].code==='online') ? r.countries[0].name : r.name;}

function brand(right){
  return \`<div class="brand">
${logoLine}
    <div class="kicker">\${right}</div>
  </div>\`;
}
function priceTag(price){
  if(!price) return "";
  return \`<span class="tag" style="font-size:17px;padding:4px 10px;color:#ffd76a;border-color:rgba(255,215,106,.35);background:rgba(255,215,106,.06)">💰 \${esc(price)}</span>\`;
}
function perkTag(perk){
  return \`<span class="tag" style="font-size:17px;padding:4px 10px;color:#9ad9ff;border-color:rgba(154,217,255,.35);background:rgba(154,217,255,.06)">\${esc(perk)}</span>\`;
}
function tags(list, sz, price, perks){
  const items = [];
  if(price) items.push(priceTag(price));
  (perks||[]).forEach(p=>items.push(perkTag(p)));
  (list||[]).forEach(t=>items.push(\`<span class="tag" style="font-size:\${sz}px;padding:\${sz<14?'3px 8px':'4px 10px'}">\${esc(SHORT_TAGS[t]||t)}</span>\`));
  if(!items.length) return "";
  return \`<div style="display:flex;flex-wrap:wrap;gap:8px;margin-top:10px">\${items.join("")}</div>\`;
}

/* ---------- Option A : carousel ---------- */
function slideCover(){
  return \`<div class="card" style="height:1350px;padding:92px 96px">\${deco}<div class="inner">
    \${brand(\`NEW HACKATHONS · ${DISPLAY_LABEL.toUpperCase()}\`)}
    <div style="flex:1;display:flex;flex-direction:column;justify-content:center">
      <div class="foot-mono" style="font-size:22px">PUBLISHED · \${WEEK}</div>
      <div style="font-size:${HEADLINE_SIZE}px;line-height:1.0;font-weight:900;letter-spacing:-.03em;margin:18px 0 0">${HEADLINE_HTML}</div>
      <div style="font-size:30px;font-weight:600;color:#c7cad0;margin-top:34px;max-width:900px;line-height:1.4">
        ${SUBLINE_HTML}</div>
    </div>
    <div style="display:flex;gap:34px;flex-wrap:wrap">
      \${REGIONS.map(r=>\`<div><div style="font-size:34px">\${flagRow(r.countries.filter(c=>c.events.length).map(c=>c.code),30)}</div>
        <div style="font-size:24px;font-weight:700;margin-top:6px">\${esc(regionDisplayName(r))}</div>
        <div class="foot-mono" style="font-size:16px;margin-top:2px">\${(x=>x+(x===1?" event":" events"))(r.countries.reduce((m,c)=>m+c.events.length,0))}</div></div>\`).join("")}
    </div>
    <div class="foot-mono" style="font-size:16px;margin-top:40px">→ ALL EVENTS + FILTER · LINK IN COMMENTS</div>
  </div></div>\`;
}
const MAX_EVENTS_PER_SLIDE = 4;

function regionPages(r){
  const pages = [];
  let cur = [], count = 0, curCode = null;
  r.countries.forEach(c=>{
    c.events.forEach((e, ei)=>{
      if(count >= MAX_EVENTS_PER_SLIDE){ pages.push(cur); cur = []; count = 0; curCode = null; }
      if(curCode !== c.code){
        cur.push({ code:c.code, name:c.name, cont: ei > 0, events:[] });
        curCode = c.code;
      }
      cur[cur.length-1].events.push(e);
      count++;
    });
  });
  if(cur.length) pages.push(cur);
  return pages;
}

function slideRegionPage(r, regionNo, chunk, pageNo, pageCount){
  const n = r.countries.reduce((m,c)=>m+c.events.length,0);
  const body = chunk.map(c=>\`
    <div style="margin-top:26px">
      <div style="display:flex;align-items:center;gap:12px;padding-bottom:12px;border-bottom:1px solid rgba(255,255,255,.14)">
        \${flag(c.code,30)}
        <span style="font-size:26px;font-weight:800;letter-spacing:.01em">\${esc(c.name)}\${c.cont?\` <span style="color:#8a8f98;font-weight:600;font-size:20px">cont.</span>\`:""}</span>
      </div>
      \${c.events.map(e=>\`<div style="padding:18px 0;border-bottom:1px solid rgba(255,255,255,.07)">
        <div class="ev-name" style="font-size:30px">\${esc(e.name)}</div>
        <div class="ev-meta" style="font-size:21px;margin-top:6px">\${esc(e.loc)} · <b>\${esc(e.date)}</b></div>
        \${tags(e.tags,17,e.price,e.perks)}
      </div>\`).join("")}
    </div>\`).join("");
  return \`<div class="card" style="height:1350px;padding:88px 92px">\${deco}<div class="inner">
    \${brand(\`\${WEEK}\`)}
    <div style="margin-top:40px">
      \${NREGIONS>1?\`<div class="foot-mono" style="font-size:20px">REGION \${regionNo} / \${NREGIONS}</div>\`:""}
      <div style="display:flex;align-items:baseline;gap:20px;margin-top:8px">
        <div style="font-size:76px;font-weight:900;letter-spacing:-.03em">\${esc(regionDisplayName(r))}</div>
        <div style="font-size:30px;font-weight:800;color:#1e96f0">\${n} new</div>
      </div>
      \${NON_COUNTRY?"":\`<div class="flags" style="margin-top:12px">\${flagRow(r.codes,26)}</div>\`}
    </div>
    <div class="rbody" style="flex:1;overflow:hidden"><div class="rbody-in">\${body}</div></div>
    <div style="display:flex;justify-content:space-between;align-items:baseline;margin-top:24px">
      <div class="foot-mono" style="font-size:15px">→ ALL EVENTS + FILTER · LINK IN COMMENTS</div>
      \${pageCount>1?\`<div class="foot-mono" style="font-size:15px">\${pageNo}/\${pageCount}</div>\`:""}
    </div>
  </div></div>\`;
}
document.getElementById("slidesA").innerHTML =
  \`<div class="scaler">\${slideCover()}</div>\` +
  REGIONS.map((r,i)=>{
    const pages = regionPages(r);
    return pages.map((chunk,pi)=>\`<div class="scaler">\${slideRegionPage(r,i+1,chunk,pi+1,pages.length)}</div>\`).join("");
  }).join("");

function slugify(name){
  return name.toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/(^-|-$)/g,'');
}
(function(){
  const names = ['00-cover'];
  let counter = 0;
  REGIONS.forEach(r=>{
    const pages = regionPages(r);
    const slug = slugify(r.name);
    pages.forEach((_,pi)=>{
      counter++;
      const nn = String(counter).padStart(2,'0');
      names.push(pages.length>1 ? \`\${nn}-\${slug}-\${pi+1}\` : \`\${nn}-\${slug}\`);
    });
  });
  window.__slideNames = names;
})();

function fitRegionBodies(){
  document.querySelectorAll("#slidesA .card .rbody").forEach(box=>{
    const inner = box.querySelector(".rbody-in");
    inner.style.zoom = "1";
    const avail = box.clientHeight, need = inner.scrollHeight;
    if(need > avail + 1){
      inner.style.zoom = String(Math.max(0.7, (avail / need) - 0.01));
    }
  });
}
fitRegionBodies();
if(document.fonts && document.fonts.ready) document.fonts.ready.then(fitRegionBodies);
addEventListener("load", fitRegionBodies);

document.querySelectorAll(".controls button[data-z]").forEach(b=>{
  b.addEventListener("click", ()=>{
    document.querySelectorAll(".controls button[data-z]").forEach(x=>x.classList.remove("on"));
    b.classList.add("on");
    document.documentElement.style.setProperty("--z", b.dataset.z);
  });
});
document.getElementById("theme").addEventListener("click", ()=>{
  const r = document.documentElement;
  r.setAttribute("data-theme", r.getAttribute("data-theme")==="dark" ? "light" : "dark");
});
</script>
`;

  return out;
}

module.exports = {
  parseArgs,
  regionLabel,
  isNonCountryRegion,
  headlineWords,
  bareLen,
  headlineFontSize,
  headlineLabelHtml,
  joinWithAnd,
  sinceDateFromWeek,
  escNode,
  LONG_TO_SHORT_TAGS,
  shortTag,
  buildExtraFlagsScript,
  extractLayoutParts,
  buildRoundupHtml,
};

if (require.main === module) {
  const args = parseArgs(process.argv.slice(2));
  if (!args.data || !args.out) {
    console.error('Usage: node build-new-roundup.js --data=<path> --out=<path>');
    process.exit(1);
  }

  const data = require(path.resolve(args.data));
  const layoutsHtml = fs.readFileSync(path.join(__dirname, 'weekly-roundup-layouts.html'), 'utf-8');
  const out = buildRoundupHtml({
    regions: data.regions,
    week: data.week,
    theme: data.theme || null,
    extraFlags: data.extraFlags || {},
    layoutsHtml,
    baseDir: __dirname,
  });

  fs.mkdirSync(path.dirname(path.resolve(args.out)), { recursive: true });
  fs.writeFileSync(path.resolve(args.out), out, 'utf-8');
  console.log('done', out.length);
}
