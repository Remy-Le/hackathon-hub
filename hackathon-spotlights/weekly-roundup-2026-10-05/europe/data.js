// Pan-Europe roundup (published since 5 Oct 2026): DACH, Western, Northern and Southern Europe are reused
// from the already-cleaned per-region data.js files; CEE and Online/Remote are parsed from the raw paste.
const AI = "Artificial Intelligence (AI)", DS = "Data Science & Analytics", DX = "Developer Tools / DX", SI = "Social Impact", OS = "Open Source", CY = "Cybersecurity", FT = "FinTech", HT = "HealthTech / Digital Health", GM = "Gaming & Game Development";
const on = (name, date, tags, price) => ({name, loc:"Online", date, ...(price ? {price} : {}), perks:["🖥️ Online"], tags});

const cee = {name:"Central & Eastern Europe", codes:["bg","cz","hu","pl","ro","tr"], countries:[
  {code:"bg", name:"Bulgaria", events:[
    {name:"12th CASSINI Hackathon – EU Space for Peace and Resilience", loc:"Sofia", date:"27-28 Nov", price:"€9,000", tags:[AI,CY,DS,SI]},
  ]},
  {code:"cz", name:"Czechia", events:[
    {name:"Hack jak Brno — National Healthcare Hackathon", loc:"Brno", date:"27-29 Nov", price:"CZK 25,000", tags:[HT,AI,DS,SI]},
  ]},
  {code:"hu", name:"Hungary", events:[
    {name:"Everester Hedge Fund Hackathon", loc:"Budapest", date:"19 Oct", price:"US$1,000", tags:[AI,FT]},
    {name:"Filmathon · AI Filmmaking Hackathon with a Cinema Premiere", loc:"Budapest", date:"5-6 Nov", tags:[AI,GM,OS]},
    {name:"BizHack AI Marketing Hackathon Budapest", loc:"Budapest", date:"24-26 Nov", tags:[AI,"MarTech / AdTech",FT]},
  ]},
  {code:"pl", name:"Poland", events:[
    {name:"START Warsaw x Poland Tech Week Hackathon", loc:"Warsaw", date:"30-31 Oct", tags:[AI]},
    {name:"Hackathon 2026 — GrowUp", loc:"Krakow", date:"1 Nov - 31 Jan", tags:[SI,"EdTech / Education Technology",FT]},
    {name:"NEXT26 Hackathon", loc:"Olkusz", date:"21-22 Dec", tags:[AI,DX,OS]},
  ]},
  {code:"ro", name:"Romania", events:[
    {name:"Startup Weekend Iasi", loc:"Iași", date:"16-18 Oct", tags:[FT,DX,SI]},
    {name:"WaterWise Hub Hackathon: Co-creating Solutions for Water Circularity in Bucharest", loc:"Bucharest", date:"23-31 Oct", tags:["Sustainability","Smart Cities",SI]},
    {name:"BreaQ 2026 – Hackathon & Conference on Quantum Technologies", loc:"Bucharest", date:"24-25 Oct", tags:["Quantum Computing",AI,DX,CY,OS]},
    {name:"Craiova Hackathon", loc:"Craiova", date:"30 Oct - 1 Nov", tags:[AI,"Smart Cities",HT,OS,"Sustainability"]},
    {name:"SmartHack", loc:"Bucharest", date:"7-8 Nov", price:"€7,750", perks:["🏨 Stay"], tags:[DX,SI,"Web3"]},
    {name:"Cybersecurity Grand Prix", loc:"Bucharest", date:"12 & 26 Nov", price:"RON 5,000", tags:[CY]},
    {name:"Hack Ton: AI Agent Hackathon and Conference", loc:"Mamaia", date:"13-15 Nov", price:"€1,000", tags:[AI,DX,GM,FT]},
    {name:"UiPath Future Forward Hackathon 2026", loc:"Bucharest", date:"13-14 Nov", price:"RON 1,000", tags:[AI,DX]},
    {name:"EESTEC Olympics — 14th Edition", loc:"Bucharest", date:"14-15 Nov", price:"€1,500", tags:[DX,OS]},
    {name:"Cybersecurity Grand Prix", loc:"Cluj-Napoca", date:"16 Nov", price:"€3,000", tags:[]},
  ]},
  {code:"tr", name:"Türkiye", events:[
    {name:"Boğaziçi Game Jam", loc:"Istanbul", date:"23-25 Oct", tags:[GM]},
  ]},
]};

const online = {name:"Online / Remote", codes:["online"], countries:[
  {code:"online", name:"Online", events:[
    on("Yamaha TRANSPOSE Innovation Challenge 2026", "7-31 Oct", [GM,"Accessibility & Assistive Tech","Hardware & Embedded Systems","HCI / UX Innovation"]),
    on("Hafnia Hackathon 2026", "8-30 Oct", [AI,"API & Platform Engineering","Smart Cities"], "€10,000"),
    on("Build Something Real", "11-12 Oct", [DX,AI,OS], "US$20,000"),
    on("Build Something Real", "12-13 Oct", [DX,"API & Platform Engineering",OS], "US$20,000"),
    on("Build Something Real", "13-14 Oct", [DX,AI], "US$20,000"),
    on("Build Something Real", "14 Oct", [DX,AI,OS], "US$20,000"),
    on("2026 international Actuarial competition", "16-30 Oct", [AI,DS]),
    on("More Than a Hack 2027", "20 Oct - 16 Nov", [DS,AI,"SportsTech"]),
    on("Databricks Hackathon", "12 Nov", [DS,AI,DX]),
    on("PowerUp Drenthe Hackathon", "12-13 Nov", ["Energy Systems","Sustainability","Smart Cities",SI], "€3,250"),
    on("i-DEMO European Tourism Gamification Hackathon 2026", "27-29 Nov", [GM,"Sustainability","Digital Twins",SI]),
  ]},
]};

module.exports = {
  week: "SINCE 5 OCT 2026",
  regions: [
    ...require("../dach/data.js").regions,
    ...require("../western-europe/data.js").regions,
    ...require("../northern-europe/data.js").regions,
    ...require("../southern-europe/data.js").regions,
    cee,
    online,
  ],
  extraFlags: { bg:"flags/bg.svg", ee:"flags/ee.svg", mt:"flags/mt.svg" },
};
