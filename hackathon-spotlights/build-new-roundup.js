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
<meta name="description" content="Carousel graphic: new hackathons published in Europe since 31 Aug, in the Hackathon Spotlight visual language.">
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
    hackathons published since 31 Aug across DACH, Western, Northern and Southern Europe.</p>
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
    <h2><span>Option A</span> Carousel — one slide per region</h2>
    <p class="desc">Cover + region slides, each a native 1350×1350 LinkedIn square.</p>
    <div class="stage"><div class="slides" id="slidesA"></div></div>
  </section>
</div>

<script>
const REGIONS = [
  {name:"DACH", codes:["at","de"], countries:[
    {code:"at", name:"Austria", events:[
      {name:"Vibecoding Hackathon: Build Your MVP in One Evening", loc:"Vienna", date:"22 Sep", tags:[]},
      {name:"HACK_002: 24h AI Hackathon", loc:"Vienna", date:"26–27 Sep", tags:["AI"]},
    ]},
    {code:"de", name:"Germany", events:[
      {name:"Agents Everywhere: Bots, Channels & More Global Hackathon", loc:"Nuremberg", date:"12 Sep", tags:["AI","Dev Tools"]},
      {name:"Eclipse SDV Hackathon Chapter Four", loc:"Friedrichshafen", date:"6–8 Oct", tags:["IoT","Dev Tools","Open Source","Mobility"]},
      {name:"Accessibility Hackathon Hamburg", loc:"Hamburg", date:"10–11 Oct", tags:["Accessibility","Social Impact"]},
      {name:"LangChain x Data Reply Hackathon: Building with Agent Harnesses", loc:"Munich", date:"27 Oct", tags:["AI","Dev Tools"]},
      {name:"Miro Meetup Berlin: AI Buildathon", loc:"Berlin", date:"12 Nov", tags:["AI"]},
    ]},
  ]},
  {name:"Western Europe", codes:["be","ie","nl","gb"], countries:[
    {code:"be", name:"Belgium", events:[
      {name:"Care & Code (Clinical Build Day)", loc:"Antwerp", date:"3 Oct", tags:["AI","HealthTech","Social Impact"]},
    ]},
    {code:"ie", name:"Ireland", events:[
      {name:"UCD Student Hackathon", loc:"Dublin", date:"27 Oct", tags:[]},
    ]},
    {code:"nl", name:"Netherlands", events:[
      {name:"Maastricht Policy Hackathon", loc:"Maastricht", date:"26 Sep", tags:["Accessibility","Social Impact"]},
      {name:"Hackathon for Good #8", loc:"The Hague", date:"6–8 Nov", tags:["Social Impact","AI","Data Science","Open Source"]},
    ]},
    {code:"gb", name:"United Kingdom", events:[
      {name:"From Spreadsheet Chaos to One Source of Truth", loc:"Birmingham", date:"9 Sep", tags:["AI","Data Science"]},
      {name:"Energy Research Hackathon 2026", loc:"Birmingham", date:"11 Sep", tags:["Energy Systems","Sustainability","Data Science","Open Source"]},
      {name:"London Builder HQ - Build with AI powered by Stellar", loc:"London", date:"12 Sep", tags:["AI","Dev Tools","Web3"]},
      {name:"WORLDS | LONDON Hackathon", loc:"London", date:"12 Sep", tags:["AI","Dev Tools","Gaming"]},
      {name:"Liverpool City Region Innovation Hackathon", loc:"Liverpool", date:"24–25 Sep", tags:["HealthTech","Social Impact"]},
      {name:"Get that Vibe Hackathon", loc:"Leeds", date:"25 Sep", tags:["AI","Dev Tools","Cybersecurity"]},
      {name:"AI Agents and Robotics Student Hackathon", loc:"Leeds", date:"28 Sep", price:"£1,000", tags:["AI","Robotics"]},
      {name:"Monad Metropolis Hacker House: London", loc:"London", date:"2 Oct", price:"\\$250,000", tags:["Blockchain","FinTech","AI","Dev Tools"]},
      {name:"Stripe x Briefcase: AI FinTech London Hackathon", loc:"London", date:"15 Oct", price:"£2,000", tags:["AI","FinTech"]},
      {name:"Green Circles Manchester | AI Hackathon | Supported by Barclays", loc:"Manchester", date:"16 Oct", tags:["AI","Social Impact","Smart Cities"]},
      {name:"The QuantMinds Hackathon: Mitigating Cognitive Biases in AI", loc:"London", date:"17 Nov", tags:["AI","FinTech"]},
    ]},
  ]},
  {name:"Northern Europe", codes:["fi","no","se"], countries:[
    {code:"fi", name:"Finland", events:[
      {name:"AaltoAI Hackathon: Data Sovereignty & Responsible AI", loc:"Espoo", date:"18–20 Sep", price:"€10,000", tags:["AI","Data Science","Cybersecurity","FinTech","Social Impact"]},
    ]},
    {code:"no", name:"Norway", events:[
      {name:"Unimicro Hackathon", loc:"Bergen", date:"5–15 Sep", price:"NOK 20,000", tags:["API & Platform Eng","FinTech","Open Source"]},
    ]},
    {code:"se", name:"Sweden", events:[
      {name:"Accel AI Innovate: Stockholm", loc:"Stockholm", date:"16 Sep", tags:["AI","Dev Tools","FinTech","Social Impact"]},
      {name:"Uniplay Hackathon", loc:"Stockholm", date:"28 Sep", tags:["Gaming"]},
    ]},
  ]},
  {name:"Southern Europe", codes:["it","pt","es"], countries:[
    {code:"it", name:"Italy", events:[
      {name:"Agentic Dollars on Bitcoin Hackathon", loc:"Turin", date:"17–18 Oct", price:"€6,000", tags:["FinTech","AI","Blockchain","Dev Tools","Web3"]},
    ]},
    {code:"pt", name:"Portugal", events:[
      {name:"Lisbon AI Week Vibe Coding Hackathon", loc:"Carcavelos", date:"25–26 Sep", tags:["AI"]},
    ]},
    {code:"es", name:"Spain", events:[
      {name:"Madrid Open - Vol.1", loc:"Madrid", date:"3 Oct", tags:["Data Science","AI","Dev Tools"]},
      {name:"THE SIGN 2.0 Hackathon: CASCADE Critical Infrastructure CTF", loc:"Madrid", date:"29 Oct", tags:["Cybersecurity"]},
    ]},
  ]},
];
const TOTAL = REGIONS.reduce((n,r)=>n+r.countries.reduce((m,c)=>m+c.events.length,0),0);
const NCOUNTRIES = REGIONS.reduce((n,r)=>n+r.countries.length,0);
const NREGIONS = REGIONS.length;
const WEEK = "SINCE 31 AUG 2026";

const esc = s => s.replace(/&/g,"&amp;").replace(/</g,"&lt;");
const deco = \`<div class="grain"></div><div class="stars"></div>\`;
${flagsLine}
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
function tags(list, sz, price){
  const items = [];
  if(price) items.push(priceTag(price));
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
      <div style="font-size:118px;line-height:.98;font-weight:900;letter-spacing:-.03em;margin:18px 0 0">New hackathons<br>in Europe<br><span style="color:#1e96f0">this week</span></div>
      <div style="font-size:30px;font-weight:600;color:#c7cad0;margin-top:34px;max-width:900px;line-height:1.4">
        \${TOTAL} freshly published hackathons across \${NCOUNTRIES} countries and \${NREGIONS} regions. Swipe through by region →</div>
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
        \${tags(e.tags,17,e.price)}
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
