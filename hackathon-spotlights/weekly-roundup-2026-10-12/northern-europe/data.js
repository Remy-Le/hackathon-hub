const AI = "Artificial Intelligence (AI)", DX = "Developer Tools / DX", SU = "Sustainability";
module.exports = {
  week: "SINCE 12 OCT 2026",
  regions: [
    {name:"Northern Europe", codes:["dk","ee","fi","no","se"], countries:[
      {code:"dk", name:"Denmark", events:[
        {name:"n8n Hardware Automation Hackathon with Atech - Copenhagen", loc:"Copenhagen", date:"4 Nov", tags:["Internet of Things (IoT)",DX,"Open Source",AI]},
      ]},
      {code:"ee", name:"Estonia", events:[
        {name:"Cursor Hackathon Tallinn", loc:"Tallinn", date:"19 Nov", tags:[AI,DX]},
        {name:"Hack the Future of Food 2026", loc:"Tartu", date:"27-28 Nov", price:"€1,500", tags:["FoodTech / AgriTech",SU,"Data Science & Analytics",AI,"Supply Chain & Logistics"]},
      ]},
      {code:"fi", name:"Finland", events:[
        {name:"Make It Make Sense – Vibe Coding Mini-Hackathon", loc:"Helsinki", date:"9 Nov", tags:[AI]},
      ]},
      {code:"no", name:"Norway", events:[
        {name:"Store Lungegårdsvann Hackathon", loc:"Bergen", date:"31 Oct", price:"NOK 10,000", tags:[SU,"ClimateTech",AI]},
      ]},
      {code:"se", name:"Sweden", events:[
        {name:"BLING Builds: Hackathon", loc:"Malmö", date:"24 Oct", price:"SEK 10,000", tags:[]},
        {name:"Hackathon: Build Night for HR People! (w/ The AI Collective)", loc:"Malmö", date:"5 Nov", tags:[AI,"HRTech"]},
      ]},
    ]},
  ],
  extraFlags: { ee: "flags/ee.svg" },
};
