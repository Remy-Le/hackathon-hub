const AI = "Artificial Intelligence (AI)", DS = "Data Science & Analytics", DX = "Developer Tools / DX", SI = "Social Impact", OS = "Open Source", FT = "FinTech", GM = "Gaming & Game Development", SU = "Sustainability", CT = "ClimateTech";
module.exports = {
  week: "SINCE 12 OCT 2026",
  regions: [
    {name:"Western Europe", codes:["be","fr","ie","nl","gb"], countries:[
      {code:"be", name:"Belgium", events:[
        {name:"THE BOLDHOUSE HACKATHON", loc:"Ghent", date:"7 Nov", tags:[AI]},
      ]},
      {code:"fr", name:"France", events:[
        {name:"Earth Breathing | Hackathon", loc:"Cergy", date:"22 Oct", tags:[AI,DS,CT]},
        {name:"The Revenue Engine Hackathon: Paris Edition", loc:"Paris", date:"27 Oct", tags:[AI,DX,FT]},
        {name:"Bordeaux Climate Hackathon 2026: 48 Hours to Innovate with the La Ruche® Method", loc:"Bordeaux", date:"4-6 Nov", tags:[CT,SU,"Smart Cities",OS,SI]},
        {name:"Game of Phones: The Cold-Calling Hackathon by swanbase and GROF", loc:"Paris", date:"6 Nov", tags:[]},
        {name:"Bioeco Camp", loc:"Bezannes", date:"20-22 Nov", perks:["🏨 Stay"], tags:[SU,"Energy Systems","FoodTech / AgriTech",SI]},
        {name:"Hackathon HEC IA x APRIL x Bain & Company", loc:"Lyon", date:"21-22 Nov", perks:["✈️ Travel","🏨 Stay"], tags:[AI,FT]},
        {name:"A51 BioxAI Hackathon · Paris Bioweek.", loc:"Paris", date:"1-2 Dec", tags:[AI,"Bioinformatics","Life Sciences & Biotechnology"]},
      ]},
      {code:"ie", name:"Ireland", events:[
        {name:"MPP Hackathon Dublin: Build Something AI Agents Can Pay For", loc:"Dublin", date:"10 Nov", tags:[AI,DX]},
      ]},
      {code:"nl", name:"Netherlands", events:[
        {name:"WTC BUILDATHON", loc:"Amsterdam", date:"26-27 Nov", tags:[AI,DX]},
      ]},
      {code:"gb", name:"United Kingdom", events:[
        {name:"PaperJam Game Jam: Don't Look Up", loc:"London", date:"20 Oct", tags:[GM]},
        {name:"Company Brain Buildathon", loc:"London", date:"24 Oct", tags:[AI]},
        {name:"Decode & Detect: The XRPL AI Hack", loc:"London", date:"24 Oct", price:"£10,000", tags:[AI,"Blockchain",FT]},
        {name:"Noetic X Nebius One Day Hackathon", loc:"London", date:"24 Oct", tags:[AI]},
        {name:"The Big AI Hack", loc:"London", date:"30 Oct - 1 Nov", tags:[AI,SU,FT,"HealthTech / Digital Health","EdTech / Education Technology"]},
        {name:"DMC Hacknight", loc:"Barnsley", date:"31 Oct", tags:[]},
        {name:"TS26 x Whimsi x Lovable: Haunted Hack", loc:"London", date:"31 Oct", tags:[GM,DX,AI]},
        {name:"Build A Business: Co-Creative Hackathon", loc:"Manchester", date:"18 Nov", tags:[SI,FT]},
        {name:"Mobile App Hackathon Night by Bilt.me", loc:"London", date:"18 Nov", tags:[AI,DX]},
        {name:"SoTA Scientific Parallelism Hackathon | With Callosum, Inherent, ARIA + Fractile", loc:"London", date:"21-22 Nov", price:"£5,000", perks:["✈️ Travel"], tags:["High Performance Computing (HPC)",AI,OS]},
        {name:"One-Prompt Hackathon with Lovable and YFL", loc:"London", date:"25 Nov", tags:[AI]},
      ]},
    ]},
  ],
  extraFlags: {},
};
