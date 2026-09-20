const fs = require('fs');
const path = require('path');

const src = fs.readFileSync(path.join(__dirname, 'weekly-roundup-layouts.html'), 'utf-8');
const lines = src.split('\n');

// Extract the card CSS block (lines index 43..62 in 0-based, i.e. ".card{...}" through ".foot-mono{...}")
const cssStart = lines.findIndex(l => l.includes('/* ---- shared card'));
const cssEnd = lines.findIndex(l => l.includes('.foot-mono{'));
const cardCss = lines.slice(cssStart, cssEnd + 1).join('\n');

// Extract logo line (the brand() function line with <img class="logo" ...)
const logoLineIdx = lines.findIndex(l => l.includes('<img class="logo"'));
const logoLine = lines[logoLineIdx];

// Extract FLAGS object line
const flagsLineIdx = lines.findIndex(l => l.startsWith('const FLAGS ='));
const flagsLine = lines[flagsLineIdx];

const out = `<title>New Hackathons in Europe — Weekly Roundup</title>
<meta name="description" content="Carousel graphic: new hackathons published in Europe since 14 Sep, in the Hackathon Spotlight visual language.">
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
    <h1>New hackathons in Europe — weekly roundup</h1>
    <p>Cover + region slides in the Hackathon Spotlight visual language (Option A carousel), covering
    hackathons published since 14 Sep across DACH, Western, Northern, Southern, and Central &amp; Eastern Europe, plus online/remote events.</p>
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
const REGIONS = [
  {name:"DACH", codes:["at","de","ch"], countries:[
    {code:"at", name:"Austria", events:[
      {name:"KIDU × FAFGA | AI Buildathon", loc:"Innsbruck", date:"20 Sep", price:"€1,000", tags:["AI","FinTech","Retail","Social Impact"]},
      {name:"Clinical AI Hackathon Vienna 2026", loc:"Vienna", date:"29-30 Oct", tags:["AI","HealthTech","Data Science","Social Impact"]},
      {name:"Hackathon 2026 of the Tourism Technology Festival", loc:"Salzburg", date:"7-8 Nov", tags:["Sustainability"]},
    ]},
    {code:"de", name:"Germany", events:[
      {name:"Mini GTM Hackathon", loc:"Berlin", date:"15 Sep", tags:["AI","Dev Tools","Data Science","FinTech"]},
      {name:"#NeoIndustrial Company Foundry Hackathon", loc:"Berlin", date:"17-18 Sep", tags:["Industry 4.0","FinTech","Sustainability"]},
      {name:"Cursor Hackathon Berlin @taxfix", loc:"Berlin", date:"17 Sep", price:"€4,000", tags:["AI","Dev Tools"]},
      {name:"Monad Blitz Berlin", loc:"Berlin", date:"26 Sep", price:"US\\$3,000", tags:["AI","Blockchain","Web3"]},
      {name:"EIT Water Hackathon Munich 2026", loc:"Munich", date:"28 Sep", tags:["Sustainability","Energy Systems","CleanTech","Smart Cities","Data Science"]},
      {name:"Nebius Build Week Hackathon in Partnership with NVIDIA", loc:"Berlin", date:"18 Oct", tags:["AI"]},
      {name:"robo.innovate Hackathon 2026", loc:"Munich", date:"23-28 Oct", price:"€10,000", tags:["Robotics","AI","IoT","Hardware","Dev Tools"]},
      {name:"thws Hackathon InclusivAI: Empowering Diversity and Reducing Barriers with AI", loc:"Würzburg", date:"29 Oct", tags:["AI","Social Impact","Accessibility","EdTech","Mobility"]},
      {name:"HACK THE MITTELSTAND – Agentic AI in Action", loc:"Augsburg", date:"10 Nov", price:"€3,500", tags:["AI"]},
      {name:"MagdeHack", loc:"Magdeburg", date:"13-14 Nov", tags:["Dev Tools","Social Impact","Open Source"]},
      {name:"PushQuantum Conference & Hackathon 2026", loc:"Munich", date:"20-22 Nov", tags:["Quantum Computing","Dev Tools","Open Source"]},
      {name:"Hack the Mittelstand – Agentic AI in Action", loc:"Munich", date:"26 Nov", price:"€2,000", tags:["AI","Social Impact","Dev Tools"]},
      {name:"MAKEATHON - Innovating Without Borders", loc:"Karlsruhe", date:"9-10 Dec", perks:["✈️ Travel","🏨 Stay"], tags:["AI","Industry 4.0","Social Impact","Dev Tools"]},
    ]},
    {code:"ch", name:"Switzerland", events:[
      {name:"Legal Hackathon", loc:"Kloten", date:"23 Sep", tags:["AI","Data Science","Dev Tools","Open Source","Social Impact"]},
      {name:"Geneva AI Hackathon", loc:"Geneva", date:"25-27 Sep", tags:["AI","Open Source","HealthTech","Social Impact"]},
    ]},
  ]},
  {name:"Western Europe", codes:["be","fr","ie","nl","gb"], countries:[
    {code:"be", name:"Belgium", events:[
      {name:"Malt x Antasphere AI Hackathon", loc:"Brussels", date:"2 Oct", price:"€10,000", tags:["AI","Dev Tools"]},
      {name:"Hacking for Good 2026", loc:"Ghent", date:"29 Oct", tags:["AI","HealthTech","Social Impact"]},
    ]},
    {code:"fr", name:"France", events:[
      {name:"{Tech: Europe} AI Gaming Hack", loc:"Paris", date:"26 Sep", tags:["AI","Gaming"]},
      {name:"Secure Horizons", loc:"Cergy", date:"10-11 Oct", price:"€15,000", tags:["AI","Cybersecurity","Blockchain"]},
      {name:"Ocean Hackathon®: Data, an Event and an International Community", loc:"Brest", date:"16-18 Oct", tags:["Sustainability","Data Science","AI","Social Impact"]},
    ]},
    {code:"ie", name:"Ireland", events:[
      {name:"Build for Ireland: OpenAI x Give(a)Go x Dogpatch Labs", loc:"Dublin", date:"4 Oct", tags:["AI","Social Impact","Smart Cities"]},
    ]},
    {code:"nl", name:"Netherlands", events:[
      {name:"GitHub Copilot Hackathon", loc:"Utrecht", date:"22 Sep", tags:["AI","Dev Tools"]},
      {name:"La Machine: Robotics Hackathon by Tech Makers", loc:"Amsterdam", date:"2-4 Oct", tags:["Robotics"]},
    ]},
    {code:"gb", name:"United Kingdom", events:[
      {name:"Tenzo's AI Buildathon", loc:"London", date:"23 Sep", tags:["AI","Data Science"]},
      {name:"Claude x Softr: AI Build Day Hackathon", loc:"London", date:"30 Sep", tags:["AI","Dev Tools"]},
      {name:"AI Hackathon", loc:"Saint Helier", date:"2-4 Oct", price:"£10,000", tags:["AI","Social Impact","Smart Cities","FinTech","HealthTech"]},
      {name:"EAT_HACK - the world's first AI & eating hackathon", loc:"London", date:"3 Oct", price:"£1,000", tags:["AI","Retail","Data Science","Social Impact"]},
      {name:"One-Shot Vibecoding Penthouse Game Jam", loc:"London", date:"3 Oct", tags:["Gaming"]},
      {name:"IBM Z Datathon 2026", loc:"London", date:"17-18 Oct", price:"US\\$50,000", tags:["AI","Dev Tools","Open Source","Social Impact","Data Science"]},
      {name:"IKU Womxn in STEM Hackathon", loc:"London", date:"17-18 Oct", tags:["Open Source","Dev Tools","Women in Tech","Social Impact"]},
      {name:"Green Economies Youth Hack - Young Manchester", loc:"Manchester", date:"21 Oct", perks:["✈️ Travel"], tags:["Sustainability","ClimateTech","Social Impact"]},
    ]},
  ]},
  {name:"Northern Europe", codes:["dk","fi","lt"], countries:[
    {code:"dk", name:"Denmark", events:[
      {name:"Danish BIO-RED Hackathon", loc:"Copenhagen", date:"5-6 Oct", price:"€9,000", perks:["✈️ Travel"], tags:["Life Sciences","HealthTech","Sustainability","Open Source"]},
    ]},
    {code:"fi", name:"Finland", events:[
      {name:"EPICENTER AI CAMPFIRE: Vibe Coding Session", loc:"Helsinki", date:"14 Sep", tags:["AI","Dev Tools"]},
    ]},
    {code:"lt", name:"Lithuania", events:[
      {name:"BIO-RED Cross-Regional Kaunas Hackathon 2026: AI & health data for personalised medicine", loc:"Kaunas", date:"2-3 Oct", perks:["✈️ Travel"], tags:["AI","HealthTech","Data Science","Life Sciences"]},
    ]},
  ]},
  {name:"Southern Europe", codes:["it","pt","es"], countries:[
    {code:"it", name:"Italy", events:[
      {name:"Hackathon Future Lab 2026", loc:"Reggio Emilia", date:"17 Sep", tags:["Sustainability","IoT","AI","Industry 4.0"]},
    ]},
    {code:"pt", name:"Portugal", events:[
      {name:"Portugal Centro Region BIO-RED Cross-Regional Hackathon", loc:"Cantanhede", date:"29 Sep", perks:["✈️ Travel","🏨 Stay"], tags:["Life Sciences","HealthTech"]},
    ]},
    {code:"es", name:"Spain", events:[
      {name:"The FIRST Running Hackathon in Barcelona", loc:"Barcelona", date:"24 Sep", tags:["AI"]},
      {name:"PATIO AI & Creativity Summit: Hackathon", loc:"Madrid", date:"7 Oct", tags:["AI"]},
    ]},
  ]},
  {name:"Central & Eastern Europe", codes:["cz","pl","ro"], countries:[
    {code:"cz", name:"Czechia", events:[
      {name:"Zero to Hero: From Idea to Hackathon // Ostrava", loc:"Ostrava", date:"23 Sep", price:"US\\$150", tags:["AI","Blockchain"]},
    ]},
    {code:"pl", name:"Poland", events:[
      {name:"BLOCKCHAIN HACK KRAKOW", loc:"Krakow", date:"19-20 Sep", price:"US\\$3,000", tags:["Blockchain"]},
    ]},
    {code:"ro", name:"Romania", events:[
      {name:"Hackathon AI Iași 2026", loc:"Iași", date:"16-18 Oct", price:"RON 7,500", tags:["AI","Smart Cities","Sustainability","Social Impact"]},
      {name:"UniHack 2026", loc:"Timișoara", date:"13-15 Nov", perks:["🏨 Stay"], tags:["Social Impact","Smart Cities","Cybersecurity","Open Source","Sustainability"]},
    ]},
  ]},
  {name:"Online / Remote", codes:["online"], countries:[
    {code:"online", name:"Online", events:[
      {name:"Nordic AI Cup 2026", loc:"Online", date:"17-20 Sep", perks:["✈️ Travel","🏨 Stay","🖥️ Online"], tags:["AI","Data Science","Open Source"]},
      {name:"4th Annual Veeam Community Hackathon", loc:"Online", date:"12-16 Oct", perks:["🖥️ Online"], tags:["Open Source","AI","Dev Tools"]},
      {name:"SchubKI Hackathon", loc:"Online", date:"16-21 Oct", perks:["🖥️ Online"], tags:["AI","Data Science","IoT","Mobility","Life Sciences"]},
    ]},
  ]},
];
const TOTAL = REGIONS.reduce((n,r)=>n+r.countries.reduce((m,c)=>m+c.events.length,0),0);
const NCOUNTRIES = REGIONS.reduce((n,r)=>n+r.countries.length,0);
const NREGIONS = REGIONS.length;
const WEEK = "SINCE 14 SEP 2026";

const esc = s => s.replace(/&/g,"&amp;").replace(/</g,"&lt;");
const deco = \`<div class="grain"></div><div class="stars"></div>\`;
${flagsLine}
FLAGS.online = '<rect width="3" height="2" fill="#0f2942"/><circle cx="1.5" cy="1" r="0.75" fill="none" stroke="#8ad4ff" stroke-width="0.06"/><ellipse cx="1.5" cy="1" rx="0.3" ry="0.75" fill="none" stroke="#8ad4ff" stroke-width="0.05"/><line x1="0.75" y1="1" x2="2.25" y2="1" stroke="#8ad4ff" stroke-width="0.05"/>';
function flag(code,h){const w=(h*1.5).toFixed(1);return \`<svg viewBox="0 0 3 2" width="\${w}" height="\${h}" preserveAspectRatio="none" style="border-radius:2px;box-shadow:0 0 0 1px rgba(255,255,255,.22);display:inline-block;vertical-align:middle">\${FLAGS[code]||''}</svg>\`;}
function flagRow(codes,h){return \`<span style="display:inline-flex;gap:6px;vertical-align:middle">\`+codes.map(c=>flag(c,h)).join('')+\`</span>\`;}

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
  (list||[]).forEach(t=>items.push(\`<span class="tag" style="font-size:\${sz}px;padding:\${sz<14?'3px 8px':'4px 10px'}">\${esc(t)}</span>\`));
  if(!items.length) return "";
  return \`<div style="display:flex;flex-wrap:wrap;gap:8px;margin-top:10px">\${items.join("")}</div>\`;
}

/* ---------- Option A : carousel ---------- */
function slideCover(){
  return \`<div class="card" style="height:1350px;padding:92px 96px">\${deco}<div class="inner">
    \${brand(\`NEW HACKATHONS · EUROPE\`)}
    <div style="flex:1;display:flex;flex-direction:column;justify-content:center">
      <div class="foot-mono" style="font-size:22px">PUBLISHED · \${WEEK}</div>
      <div style="font-size:112px;line-height:1.0;font-weight:900;letter-spacing:-.03em;margin:18px 0 0"><span style="color:#1e96f0">\${TOTAL}</span> new hackathons<br>in Europe <span style="color:#1e96f0">this week</span></div>
      <div style="font-size:30px;font-weight:600;color:#c7cad0;margin-top:34px;max-width:900px;line-height:1.4">
        Across \${NCOUNTRIES} countries and \${NREGIONS} regions. Swipe through by region →</div>
    </div>
    <div style="display:flex;gap:34px;flex-wrap:wrap">
      \${REGIONS.map(r=>\`<div><div style="font-size:34px">\${flagRow(r.countries.filter(c=>c.events.length).map(c=>c.code),30)}</div>
        <div style="font-size:24px;font-weight:700;margin-top:6px">\${esc(r.name)}</div>
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
  const part = pageCount>1 ? \` · \${pageNo}/\${pageCount}\` : "";
  return \`<div class="card" style="height:1350px;padding:88px 92px">\${deco}<div class="inner">
    \${brand(\`EUROPE · \${WEEK}\`)}
    <div style="margin-top:40px">
      <div class="foot-mono" style="font-size:20px">REGION \${regionNo} / \${NREGIONS}\${part}</div>
      <div style="display:flex;align-items:baseline;gap:20px;margin-top:8px">
        <div style="font-size:76px;font-weight:900;letter-spacing:-.03em">\${esc(r.name)}</div>
        <div style="font-size:30px;font-weight:800;color:#1e96f0">\${n} new</div>
      </div>
      <div class="flags" style="margin-top:12px">\${flagRow(r.codes,26)}</div>
    </div>
    <div class="rbody" style="flex:1;overflow:hidden"><div class="rbody-in">\${body}</div></div>
    <div class="foot-mono" style="font-size:15px;margin-top:24px">→ ALL EVENTS + FILTER · LINK IN COMMENTS</div>
  </div></div>\`;
}
document.getElementById("slidesA").innerHTML =
  \`<div class="scaler">\${slideCover()}</div>\` +
  REGIONS.map((r,i)=>{
    const pages = regionPages(r);
    return pages.map((chunk,pi)=>\`<div class="scaler">\${slideRegionPage(r,i+1,chunk,pi+1,pages.length)}</div>\`).join("");
  }).join("");

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

fs.writeFileSync(path.join(__dirname, 'weekly-roundup-new.html'), out, 'utf-8');
console.log('done', out.length);
