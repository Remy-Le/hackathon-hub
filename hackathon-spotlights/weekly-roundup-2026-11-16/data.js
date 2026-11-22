const AI = "Artificial Intelligence (AI)", DX = "Developer Tools / DX", HW = "Hardware & Embedded Systems", ROB = "Robotics & Autonomous Systems", GAME = "Gaming & Game Development", SOC = "Social Impact", API = "API & Platform Engineering", DS = "Data Science & Analytics", DEVOPS = "DevOps & Cloud Computing", LS = "Life Sciences & Biotechnology", IOT = "Internet of Things (IoT)", OSS = "Open Source", CYBER = "Cybersecurity", BIO = "Bioinformatics", DEF = "Defense & Security Tech";
const ev = (name, loc, date, tags, price, perks) => {
  const e = { name, loc, date };
  if (price) e.price = price;
  if (perks) e.perks = perks;
  e.tags = tags;
  return e;
};

module.exports = {
  week: "SINCE 16 NOV 2026",
  regions: [
    { name: "DACH", codes: ["at", "de", "ch"], countries: [
      { code: "at", name: "Austria", events: [
        ev("AAU AI Hackathon", "Klagenfurt am Wörthersee", "27-29 Nov", [AI, HW]),
        ev("Codex Community Build: Linz", "Linz", "18 Dec", [AI, DX, API]),
      ]},
      { code: "de", name: "Germany", events: [
        ev("Community Hackathon: Ship It. For Real.", "Nuremberg", "25 Nov", [AI, DX, DEVOPS]),
        ev("Blueprint Hack: Langfuse × Kuro", "Berlin", "1 Dec", [AI, DX, "Construction & Architecture"], "€2,000"),
        ev("The Next Experiment Hackathon", "Munich", "1 Dec", [AI, LS, BIO, "Energy Systems"]),
        ev("KA:IGNITE 2026 Hardware Hackathon", "Karlsruhe", "4-6 Dec", [HW, IOT, ROB, DX]),
        ev("AI Hackathon", "Munich", "7 Dec", [AI, DS]),
        ev("TU Berlin Hackathon: Cloud Classification with Sky Images", "Berlin", "12 Dec", [AI, DS, "ClimateTech"]),
        ev("offscript(berlin) x Buena - Hackathon_01", "Berlin", "16 Jan", [DX]),
        ev("Hackathon 2027 (CODEBURG)", "Rödental", "23-24 Apr", [DX, OSS], "€6,000"),
      ]},
      { code: "ch", name: "Switzerland", events: [
        ev("ETHERLAKEN Sprints · AI Edition", "Matten bei Interlaken", "22-24 Jan", [AI, DS], "CHF 2,000"),
      ]},
    ]},
    { name: "Western Europe", codes: ["be", "fr", "ie", "nl", "gb"], countries: [
      { code: "be", name: "Belgium", events: [
        ev("How Much Do You Bench? AI Hackathon for Data Engineers – Xmas Edition", "Leuven", "17 Dec", [AI, DS, DX]),
      ]},
      { code: "fr", name: "France", events: [
        ev("Deezer Hackathon", "Paris", "28-29 Nov", [AI, DS]),
        ev("CentraleSupélec Paris-Saclay Hackathon", "Gif-sur-Yvette", "9 Jan", [AI, DX, OSS]),
        ev("CentraleSupélec Rennes Hackathon", "Cesson-Sévigné", "9 Jan", [AI, DX]),
      ]},
      { code: "ie", name: "Ireland", events: [
        ev("Manus Fellow Event | Build It with Manus: The Dublin AI Hackathon", "Dublin", "1 Dec", [AI]),
      ]},
      { code: "nl", name: "Netherlands", events: [
        ev("Longevity AI Hackathon", "Utrecht", "5-7 Mar", [AI, LS, "HealthTech / Digital Health", BIO]),
      ]},
      { code: "gb", name: "United Kingdom", events: [
        ev("AI Hacking London", "London", "26 Nov", [AI, CYBER, DX]),
        ev("Mosque & Madrassah Hackathon 2026", "London", "27-29 Nov", [SOC, "EdTech / Education Technology", "Accessibility & Assistive Tech"]),
        ev("VirWave × Lovable Friendsgiving Hackathon", "London", "27 Nov", [AI, DX, SOC]),
        ev("Accelerate ME Hackathon", "Manchester", "5 Dec", [DX]),
        ev("Gaming Hack: Play with Purposes", "London", "6 Dec", [GAME, AI]),
        ev("Tiny Game Jam: Sound, Sensors and Surveillance", "Winchester", "8 Dec", [GAME, SOC, "Digital Humanities"]),
        ev("Disrupt the Ordinary Hackathon", "London", "10 Dec", [AI, DX]),
        ev("SpyHack 2026", "Manchester", "12 Dec", [CYBER, DEF, DS]),
        ev("BloomHack 2027", "Southampton", "6-7 Feb", ["Women in Tech / Diversity", DS, OSS]),
      ]},
    ]},
    { name: "Northern Europe", codes: ["dk", "ee", "se"], countries: [
      { code: "dk", name: "Denmark", events: [
        ev("SICK X ATech Buildathon", "Copenhagen", "12 Dec", [AI, HW, ROB, IOT]),
      ]},
      { code: "ee", name: "Estonia", events: [
        ev("EESTISTARTUP - Vibe Coding Hackathon", "Tallinn", "13 Dec", [AI, DX]),
      ]},
      { code: "se", name: "Sweden", events: [
        ev("Hack4good Stockholm", "Stockholm", "5 Dec", [AI, SOC, DX]),
      ]},
    ]},
    { name: "Southern Europe", codes: ["gr", "it", "pt", "es"], countries: [
      { code: "gr", name: "Greece", events: [
        ev("Lovable x Side Quest Hackathon: AI for Human Connection", "Athens", "6 Dec", [AI, SOC, DX]),
      ]},
      { code: "it", name: "Italy", events: [
        ev("Hack The Transaction", "Milan", "5 Dec", ["FinTech", AI, CYBER, API]),
      ]},
      { code: "pt", name: "Portugal", events: [
        ev("AI Hackday Lisbon - Jan 22", "Lisbon", "22 Jan", [AI, DX]),
      ]},
      { code: "es", name: "Spain", events: [
        ev("Claude Community × HappyRobot Hackathon — Agents coaching agents", "Madrid", "28 Nov", [AI, DX, API]),
        ev("Hackathon: Hack the Map", "Barcelona", "28 Nov", [SOC, DS]),
        ev("AI Builders Hacksprint Barcelona", "Barcelona", "4 Dec", [AI, "Smart Cities", DX, OSS]),
        ev("HackUDC 2027", "A Coruña", "26-28 Feb", [OSS, DX, AI]),
      ]},
    ]},
    { name: "Central & Eastern Europe", codes: ["cz", "mk", "tr"], countries: [
      { code: "cz", name: "Czechia", events: [
        ev("Cursor Hackathon: Build Something Merry", "Prague", "9 Dec", [AI, DX]),
      ]},
      { code: "mk", name: "North Macedonia", events: [
        ev("Automate Something: Skopje Hackathon", "Skopje", "4-6 Dec", [AI, DX, API]),
      ]},
      { code: "tr", name: "Türkiye", events: [
        ev("Team1 Hackhane #01: AI Hack Night", "Bursa", "25 Nov", [AI, CYBER, "Blockchain", OSS]),
        ev("Ants Jam 4.0", "Istanbul", "1-2 Dec", [GAME]),
        ev("AyazJAM’26", "Ankara", "4-6 Dec", [GAME]),
        ev("Bursa Game Jam", "Bursa", "8-13 Dec", [GAME]),
      ]},
    ]},
    { name: "Online / Remote", codes: ["online"], countries: [
      { code: "online", name: "Online", events: [
        ev("SMU 13th Lee Kuan Yew Global Business Plan Competition (LKYGBPC)", "Online", "18 Nov - 31 Mar", ["Sustainability", DEF, IOT, "Mobility & Transportation", "FoodTech / AgriTech"], null, ["🖥️ Online"]),
        ev("DS2 Hackathon: Make the Pilot Data Make Sense", "Online", "3 Dec", [], "€2,400", ["🖥️ Online"]),
      ]},
    ]},
  ],
  extraFlags: { ee: "flags/ee.svg" },
};
