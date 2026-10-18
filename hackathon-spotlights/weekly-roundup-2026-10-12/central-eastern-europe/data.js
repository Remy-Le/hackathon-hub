const AI = "Artificial Intelligence (AI)", DX = "Developer Tools / DX", OS = "Open Source", SP = "SpaceTech / Aerospace", HPC = "High Performance Computing (HPC)";
module.exports = {
  week: "SINCE 12 OCT 2026",
  regions: [
    {name:"Central & Eastern Europe", codes:["cz","hu","pl","ro","rs","tr","ua"], countries:[
      {code:"cz", name:"Czechia", events:[
        {name:"Apify's Hack for Humanity", loc:"Prague", date:"9 Nov", price:"US$1,000", tags:[]},
      ]},
      {code:"hu", name:"Hungary", events:[
        {name:"Simonyi International Hackathon", loc:"Pécs", date:"11-12 Nov", tags:[]},
      ]},
      {code:"pl", name:"Poland", events:[
        {name:"Build, Show & Tell @ Hacker Bloc", loc:"Warsaw", date:"31 Oct", tags:[AI,"Robotics & Autonomous Systems","Hardware & Embedded Systems"]},
      ]},
      {code:"ro", name:"Romania", events:[
        {name:"Timișoara HPC & Quantum Days: Compute the Future", loc:"Timișoara", date:"26-27 Oct", tags:[HPC,AI,"Quantum Computing",OS]},
        {name:"AWS GameDay Hackathon", loc:"Bucharest", date:"31 Oct", tags:[DX,OS,"Internet of Things (IoT)"]},
      ]},
      {code:"rs", name:"Serbia", events:[
        {name:"Adapty Hackathon", loc:"Belgrade", date:"24-26 Oct", tags:[DX]},
      ]},
      {code:"tr", name:"Turkey", events:[
        {name:"RevenueCat x Third Room x Neon Apps AI Hackathon", loc:"Istanbul", date:"7 Nov", tags:[AI,DX]},
      ]},
      {code:"ua", name:"Ukraine", events:[
        {name:"NASA Space Apps Challenge Drohobych 2026", loc:"Drohobych", date:"14-15 Nov", tags:[SP,OS]},
      ]},
    ]},
  ],
  extraFlags: { rs:"flags/rs.svg", ua:"flags/ua.svg" },
};
