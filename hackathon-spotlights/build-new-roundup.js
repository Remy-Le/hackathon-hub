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
    hackathons published since 31 Aug across DACH, Western, Northern, Southern, Central &amp; Eastern, and Southeast Europe.</p>
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
  {name:"DACH", codes:["at","de","ch"], countries:[
    {code:"at", name:"Austria", events:[
      {name:"Vibecoding Hackathon: Build Your MVP in One Evening", loc:"Vienna", date:"22 Sep", tags:[]},
      {name:"HACK_002: 24h AI Hackathon", loc:"Vienna", date:"26-27 Sep", tags:["AI"]},
      {name:"BR41N.IO Designers’ Hackathon during IEEE SMC 2026", loc:"Online", date:"4-5 Oct", price:"\\$1,000", tags:["AI","IoT","Gaming","Bioinformatics","NeuroTech"]},
    ]},
    {code:"de", name:"Germany", events:[
      {name:"Agents Everywhere: Bots, Channels & More Global Hackathon", loc:"Nuremberg", date:"12 Sep", tags:["AI","Dev Tools"]},
      {name:"Social Hackathon Bonn", loc:"Bonn", date:"25-27 Sep", tags:["Social Impact","Accessibility","GovTech"]},
      {name:"Eclipse SDV Hackathon Chapter Four", loc:"Friedrichshafen", date:"6-8 Oct", tags:["IoT","Dev Tools","Open Source","Mobility"]},
      {name:"Accessibility Hackathon Hamburg", loc:"Hamburg", date:"10-11 Oct", tags:["Accessibility","Social Impact"]},
      {name:"medianet CreativeTech AI Hackathon", loc:"Berlin", date:"15 Oct - 7 Dec", tags:["AI","Dev Tools","MarTech","Data Science","Gaming"]},
      {name:"Robotics and AI Hackathon 2026", loc:"Erlangen", date:"22-25 Oct", tags:["AI","Robotics","HealthTech","Industry 4.0"]},
      {name:"LangChain x Data Reply Hackathon: Building with Agent Harnesses", loc:"Munich", date:"27 Oct", tags:["AI","Dev Tools"]},
      {name:"Miro Meetup Berlin: AI Buildathon", loc:"Berlin", date:"12 Nov", tags:["AI"]},
      {name:"AI Coding Hackathon November 2026", loc:"Cologne", date:"20-22 Nov", tags:["AI","Dev Tools","Open Source","Sustainability","FinTech"]},
    ]},
    {code:"ch", name:"Switzerland", events:[
      {name:"ETHack 2026: Hack for Good.", loc:"Zurich", date:"12-13 Sep", tags:["Sustainability","Social Impact","Open Source"]},
      {name:"sprintd Zurich", loc:"Zurich", date:"9-11 Oct", price:"CHF 2,000", tags:["AI","Data Science","API & Platform Eng"]},
      {name:"«Hack Apertus» Zurich", loc:"Zurich", date:"27-28 Nov", price:"CHF 7,000", perks:["✈️ Travel","🏨 Stay"], tags:["Open Source","AI","Data Science"]},
      {name:"«Hack Apertus» Basel", loc:"Arlesheim", date:"4-5 Dec", price:"CHF 7,000", perks:["✈️ Travel","🏨 Stay"], tags:["Open Source","AI"]},
    ]},
  ]},
  {name:"Western Europe", codes:["be","fr","ie","nl","gb"], countries:[
    {code:"be", name:"Belgium", events:[
      {name:"Belgium's Biggest Hackathon", loc:"Ghent", date:"30 Sep - 20 Oct", price:"€10,000", tags:["FinTech","HRTech","Industry 4.0","Social Impact"]},
      {name:"Care & Code (Clinical Build Day)", loc:"Antwerp", date:"3 Oct", tags:["AI","HealthTech","Social Impact"]},
    ]},
    {code:"fr", name:"France", events:[
      {name:"XRPL Lending Protocol Hackathon", loc:"Nanterre", date:"12-13 Sep", price:"\\$5,000", tags:["Blockchain","FinTech"]},
      {name:"HABS Neuro-AI Hackathon 2026", loc:"Orsay-Gif", date:"2-30 Nov", tags:["AI","Data Science","NeuroTech","HealthTech"]},
    ]},
    {code:"ie", name:"Ireland", events:[
      {name:"UCD Student Hackathon", loc:"Dublin", date:"27 Oct", tags:[]},
    ]},
    {code:"nl", name:"Netherlands", events:[
      {name:"Accel AI Innovate: Amsterdam", loc:"Amsterdam", date:"23 Sep", tags:["AI","Dev Tools","Open Source","FinTech","Social Impact"]},
      {name:"Maastricht Policy Hackathon", loc:"Maastricht", date:"26 Sep", tags:["Accessibility","Social Impact"]},
      {name:"Recharge Eindhoven Hackathon", loc:"Eindhoven", date:"3-4 Oct", tags:["Energy Systems","Smart Cities","AI","Data Science","Mobility"]},
      {name:"Hackathon for Good #8", loc:"The Hague", date:"6-8 Nov", tags:["Social Impact","AI","Data Science","Open Source"]},
    ]},
    {code:"gb", name:"United Kingdom", events:[
      {name:"AI Hackathon (Birmingham)", loc:"Birmingham", date:"9 Sep", tags:["AI"]},
      {name:"From Spreadsheet Chaos to One Source of Truth", loc:"Birmingham", date:"9 Sep", tags:["AI","Data Science"]},
      {name:"Energy Research Hackathon 2026", loc:"Birmingham", date:"11 Sep", tags:["Energy Systems","Sustainability","Data Science","Open Source"]},
      {name:"London Builder HQ - Build with AI powered by Stellar", loc:"London", date:"12 Sep", tags:["AI","Dev Tools","Web3"]},
      {name:"WORLDS | LONDON Hackathon", loc:"London", date:"12 Sep", tags:["AI","Dev Tools","Gaming"]},
      {name:"Liverpool City Region Innovation Hackathon", loc:"Liverpool", date:"24-25 Sep", tags:["HealthTech","Social Impact"]},
      {name:"Get that Vibe Hackathon", loc:"Leeds", date:"25 Sep", tags:["AI","Dev Tools","Cybersecurity"]},
      {name:"AI Agents and Robotics Student Hackathon", loc:"Leeds", date:"28 Sep", price:"£1,000", tags:["AI","Robotics"]},
      {name:"Monad Metropolis Hacker House: London", loc:"London", date:"2 Oct", price:"\\$250,000", tags:["Blockchain","FinTech","AI","Dev Tools"]},
      {name:"Stripe x Briefcase: AI FinTech London Hackathon", loc:"London", date:"15 Oct", price:"£2,000", tags:["AI","FinTech"]},
      {name:"Green Circles Manchester | AI Hackathon | Supported by Barclays", loc:"Manchester", date:"16 Oct", tags:["AI","Social Impact","Smart Cities"]},
      {name:"The QuantMinds Hackathon: Mitigating Cognitive Biases in AI", loc:"London", date:"17 Nov", tags:["AI","FinTech"]},
    ]},
  ]},
  {name:"Northern Europe", codes:["dk","fi","no","se"], countries:[
    {code:"dk", name:"Denmark", events:[
      {name:"Build For Impact Hackathon: Build Mobile Apps for Good.", loc:"Copenhagen", date:"26 Sep", tags:["Social Impact","Dev Tools","AI","Sustainability"]},
      {name:"Matrix Hackathon", loc:"Copenhagen", date:"23 Oct", tags:["Open Source","Digital Identity","Web3","Dev Tools"]},
    ]},
    {code:"fi", name:"Finland", events:[
      {name:"HR AI Hackathon, Presented by Luo", loc:"Helsinki", date:"16 Sep", tags:["AI","HRTech"]},
      {name:"AaltoAI Hackathon: Data Sovereignty & Responsible AI", loc:"Espoo", date:"18-20 Sep", price:"€10,000", tags:["AI","Data Science","Cybersecurity","FinTech","Social Impact"]},
    ]},
    {code:"no", name:"Norway", events:[
      {name:"Unimicro Hackathon", loc:"Bergen", date:"5-15 Sep", price:"NOK 20,000", tags:["API & Platform Eng","FinTech","Open Source"]},
    ]},
    {code:"se", name:"Sweden", events:[
      {name:"Lovable & Drivhuset Impact Buildathon", loc:"Stockholm", date:"8 Sep", tags:["Social Impact","Dev Tools"]},
      {name:"Accel AI Innovate: Stockholm", loc:"Stockholm", date:"16 Sep", tags:["AI","Dev Tools","FinTech","Social Impact"]},
      {name:"Uniplay Hackathon", loc:"Stockholm", date:"28 Sep", tags:["Gaming"]},
    ]},
  ]},
  {name:"Southern Europe", codes:["it","pt","es"], countries:[
    {code:"it", name:"Italy", events:[
      {name:"GDG Napoli Hackathon 2026: From Code to Stage", loc:"Naples", date:"16 Oct", tags:["Dev Tools","Open Source"]},
      {name:"Agentic Dollars on Bitcoin Hackathon", loc:"Turin", date:"17-18 Oct", price:"€6,000", tags:["FinTech","AI","Blockchain","Dev Tools","Web3"]},
    ]},
    {code:"pt", name:"Portugal", events:[
      {name:"Lisbon AI Week Vibe Coding Hackathon", loc:"Carcavelos", date:"25-26 Sep", tags:["AI"]},
      {name:"Hackathon Portugal 2026", loc:"Lisbon", date:"20 Nov", tags:["AI","IoT","DevOps & Cloud","Cybersecurity","Open Source"]},
    ]},
    {code:"es", name:"Spain", events:[
      {name:"Hackathon Media Party Barcelona 2026", loc:"Barcelona", date:"9 Sep", tags:["AI","Dev Tools","Open Source","Digital Humanities","Social Impact"]},
      {name:"Shipaton Valencia Meetup", loc:"Valencia", date:"10 Sep", tags:["Dev Tools","Social Impact","Open Source"]},
      {name:"Local Phase Telefonica Hackathon", loc:"Valencia", date:"1 Oct", price:"€23,000", tags:["Smart Cities","AI","Social Impact"]},
      {name:"Madrid Open - Vol.1", loc:"Madrid", date:"3 Oct", tags:["Data Science","AI","Dev Tools"]},
      {name:"THE SIGN 2.0 Hackathon: CASCADE Critical Infrastructure CTF", loc:"Madrid", date:"29 Oct", tags:["Cybersecurity"]},
      {name:"ESA Datalabs Euclid Hackathon 2026", loc:"Madrid", date:"23-26 Nov", tags:["Data Science","AI","SpaceTech","Reproducible Research"]},
      {name:"Hackathon “Bring Back Nature in Third Places”", loc:"Barcelona", date:"2-4 Dec", perks:["✈️ Travel"], tags:["Sustainability","Smart Cities","Social Impact","ClimateTech"]},
    ]},
  ]},
  {name:"Central & Eastern Europe", codes:["hu","pl"], countries:[
    {code:"hu", name:"Hungary", events:[
      {name:"Devin Hackathon Budapest | Cognition.ai", loc:"Budapest", date:"19 Sep", tags:["AI","Dev Tools"]},
    ]},
    {code:"pl", name:"Poland", events:[
      {name:"Warsaw Model Trainers Hackathon", loc:"Warsaw", date:"25 Sep", tags:["AI"]},
    ]},
  ]},
  {name:"Southeast Europe", codes:["mk","tr"], countries:[
    {code:"mk", name:"North Macedonia", events:[
      {name:"The AI Student Hackathon powered by OpenAI", loc:"Skopje", date:"18-23 Sep", tags:["AI","Dev Tools","Open Source"]},
    ]},
    {code:"tr", name:"Türkiye", events:[
      {name:"How to Win a Hackathon: Blockchain 101 and Product Development", loc:"Istanbul", date:"16 Sep", tags:["AI","Blockchain"]},
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
FLAGS.mk = '<image x="0" y="0" width="3" height="2" preserveAspectRatio="none" href="data:image/png;base64,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"/>';
FLAGS.tr = '<image x="0" y="0" width="3" height="2" preserveAspectRatio="none" href="data:image/png;base64,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"/>';
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
