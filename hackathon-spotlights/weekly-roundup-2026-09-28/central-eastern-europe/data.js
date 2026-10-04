module.exports = {
  week: "SINCE 28 SEP 2026",
  regions: [
    {name:"Central & Eastern Europe", codes:["cz","pl","ro","sk","tr","ua"], countries:[
      {code:"cz", name:"Czechia", events:[
        {name:"From Dusk Till Dawn Hackathon #01 by Agents 0.0.7. Community", loc:"Prague", date:"8-9 Oct", tags:["Artificial Intelligence (AI)"]},
      ]},
      {code:"pl", name:"Poland", events:[
        {name:"Industry Day · Gdańsk Cocktail Week", loc:"Gdańsk", date:"7 Oct", price:"PLN 5,000", tags:["Developer Tools / DX","FinTech","Social Impact","FoodTech / AgriTech","Retail & E-Commerce"]},
        {name:"Future Smart City Hackathon 2026", loc:"Łódź", date:"9 Oct - 6 Nov", tags:["Smart Cities","Sustainability","Energy Systems","HealthTech / Digital Health","Social Impact"]},
        {name:"Warsaw Open Data Hackathon 2026", loc:"Warsaw", date:"17-18 Oct", price:"PLN 18,000", tags:["Data Science & Analytics","Smart Cities","Open Source","GovTech / Public Sector","Social Impact"]},
      ]},
      {code:"ro", name:"Romania", events:[
        {name:"Bucharest Startup Weekend", loc:"Bucharest", date:"9-11 Oct", tags:["FinTech","Social Impact"]},
        {name:"European Defense Tech Hackathon - Bucharest", loc:"Bucharest", date:"9-11 Oct", tags:["Defense & Security Tech"]},
      ]},
      {code:"sk", name:"Slovakia", events:[
        {name:"Global Quantum Hackathon 2026", loc:"Bratislava", date:"9-11 Oct", price:"10,000", tags:["Quantum Computing","Developer Tools / DX","Open Source","Artificial Intelligence (AI)","High Performance Computing (HPC)"]},
        {name:"European Defense Tech Hackathon - Bratislava", loc:"Bratislava", date:"19-21 Mar", tags:["Developer Tools / DX","Artificial Intelligence (AI)","Cybersecurity","Internet of Things (IoT)"]},
      ]},
      {code:"tr", name:"Türkiye", events:[
        {name:"Women Game Jam Turkey 2026", loc:"Istanbul & Ankara", date:"16-18 Oct", tags:["Gaming & Game Development","Developer Tools / DX","Women in Tech / Diversity"]},
        {name:"Women Game Jam - Halloween Party", loc:"Sarıyer", date:"17 Oct", tags:["Gaming & Game Development","Women in Tech / Diversity"]},
      ]},
      {code:"ua", name:"Ukraine", events:[
        {name:"Hacktoberfest Hack Day Lviv", loc:"Lviv", date:"24 Oct", tags:["Artificial Intelligence (AI)","Open Source","Developer Tools / DX"]},
      ]},
    ]},
  ],
  extraFlags: { ua: "flags/ua.svg" },
};
