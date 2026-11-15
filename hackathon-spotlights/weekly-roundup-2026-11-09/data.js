const AI = "Artificial Intelligence (AI)", DX = "Developer Tools / DX", HW = "Hardware & Embedded Systems", ROB = "Robotics & Autonomous Systems", GAME = "Gaming & Game Development", SOC = "Social Impact", API = "API & Platform Engineering", SPACE = "SpaceTech / Aerospace", MAR = "MarTech / AdTech", DS = "Data Science & Analytics", DEVOPS = "DevOps & Cloud Computing", LS = "Life Sciences & Biotechnology";
const ev = (name, loc, date, tags, price) => price ? { name, loc, date, price, tags } : { name, loc, date, tags };

module.exports = {
  week: "SINCE 9 NOV 2026",
  regions: [
    { name: "DACH", codes: ["at", "de", "ch"], countries: [
      { code: "at", name: "Austria", events: [
        ev("Make It Happen Challenge #2", "Vienna", "21 Nov", [SOC, "Digital Humanities"]),
        ev("Cursor Hackathon Vienna", "Vienna", "18 Dec", [AI, DX, LS]),
      ]},
      { code: "de", name: "Germany", events: [
        ev("Game Garage: Give(a)Go x Base44", "Heilbronn", "21 Nov", [GAME, AI, DX]),
        ev("THE €5K BUILD & LAUNCH HACKATHON", "Berlin", "21-22 Nov", [AI, DX], "€5,000"),
        ev("START Berlin x IBM x ICEYE Hackathon", "Berlin", "28 Nov", [AI, SPACE, DS]),
        ev("Accel AI Innovate: Berlin", "Berlin", "2 Dec", [AI, DX, "FinTech"]),
      ]},
      { code: "ch", name: "Switzerland", events: [
        ev("Intel Physical AI Challenge | European Robotics House", "Zurich", "4-6 Dec", [ROB, AI, HW], "€10,000"),
      ]},
    ]},
    { name: "Western Europe", codes: ["fr", "ie", "nl", "gb"], countries: [
      { code: "fr", name: "France", events: [
        ev("Ahead of Time: A Hackathon by Mistral and ClickHouse", "Paris", "5 Dec", [AI, DS, "Open Source", DX]),
        ev("Hypersphère Hackathon: Building for Good", "Toulouse", "12 Dec", [SOC, DX]),
      ]},
      { code: "ie", name: "Ireland", events: [
        ev("Trinity Entrepreneurial Society's StartUp Weekend: Hackathon", "Dublin", "28-29 Nov", [AI, DX]),
      ]},
      { code: "nl", name: "Netherlands", events: [
        ev("Benelux Robotics Hackathon", "Eindhoven", "3-4 Dec", [ROB, AI, HW, "Industry 4.0 / Smart Manufacturing", "Edge Computing"]),
        ev("Vibe Coding Café: Build & Share", "Utrecht", "8 Dec", [AI, DX]),
      ]},
      { code: "gb", name: "United Kingdom", events: [
        ev("Jev Mini Hackathon", "London", "18 Nov", [AI, DX, API]),
        ev("Build Something Lovable - Buildathon", "Reading", "19 Nov", [AI, DX]),
        ev("The 30-Minute AI Game Jam: Flappy Bird Edition", "Portsmouth", "19 Nov", [AI, GAME]),
        ev("Hack The Trent", "Nottingham", "20 Nov", [DEVOPS, DX]),
        ev("Le Chonk in London - Mistral Vibe Hackathon", "London", "21 Nov", [AI, DX], "US$6,000"),
        ev("Open Court Hackathon with Wonder Studios", "London", "22 Nov", [AI, GAME, "AR / VR / XR"], "£700"),
        ev("Bayes × Fotor - Product Launch Hackathon: Build a Campaign with AI Agents", "London", "25 Nov", [AI, MAR]),
        ev("The Revenue Engine Hackathon: London", "London", "25 Nov", [MAR, AI, API]),
        ev("Mobile App Hackathon", "London", "28 Nov", [DX]),
        ev("Reality Check - Robotics Hackathon", "London", "28-29 Nov", [ROB, AI, HW]),
        ev("merry vibe-mas: festive hackathon w/ tiiny.host + plugged", "London", "1 Dec", [DX, API]),
        ev("Hack the Heck Hackathon", "London", "11 Dec", [AI, DX, DEVOPS]),
        ev("London Aerospace Hackathon", "London", "12-13 Dec", [AI, SPACE, "Mobility & Transportation"]),
      ]},
    ]},
    { name: "Northern Europe", codes: ["dk", "fi", "se"], countries: [
      { code: "dk", name: "Denmark", events: [
        ev("Techno Hacks #1", "Lundtofte", "21 Nov", [HW, DX]),
      ]},
      { code: "fi", name: "Finland", events: [
        ev("Rocket Design Hackathon", "Espoo", "15 Nov", [SPACE, HW]),
      ]},
      { code: "se", name: "Sweden", events: [
        ev("Lovable Buildathon", "Kristianstad", "25 Nov", [DX, AI]),
        ev("Hack for the Dog / Dogathon", "Stockholm", "2 Dec", [SOC, "EdTech / Education Technology"]),
        ev("Cancer Pulse Hackathon", "Stockholm", "21-22 Jan", ["HealthTech / Digital Health", LS, "Bioinformatics", SOC]),
      ]},
    ]},
    { name: "Southern Europe", codes: ["gr", "it", "pt", "es"], countries: [
      { code: "gr", name: "Greece", events: [
        ev("Commit Athens 2: A Free Evening Hackathon", "Athens", "4 Dec", [AI, DX]),
      ]},
      { code: "it", name: "Italy", events: [
        ev("Space Cyber Mission", "Rome", "26 Nov", ["Cybersecurity", SPACE, "Defense & Security Tech"], "€5,000"),
      ]},
      { code: "pt", name: "Portugal", events: [
        ev("AI Hackathon @ Nova Startup Club", "Lisbon", "21 Nov", [AI]),
      ]},
      { code: "es", name: "Spain", events: [
        ev("GeeksCAT Hackday", "Caldes de Malavella", "12 Dec", [AI, DX, "Open Source"]),
        ev("Tech Riders League | Hackathon Final", "Madrid", "8 May", [DEVOPS, DS, "Cybersecurity"]),
      ]},
    ]},
    { name: "Central & Eastern Europe", codes: ["cz", "hu", "tr"], countries: [
      { code: "cz", name: "Czechia", events: [
        ev("Cursor Brno Hackathon: Spooky but Impactful", "Brno", "26 Nov", [AI, DX, "Energy Systems", "Sustainability", "CleanTech"]),
      ]},
      { code: "hu", name: "Hungary", events: [
        ev("AI Builders Hackathon", "Budapest", "4-6 Dec", [AI, "FinTech"], "€10,000"),
      ]},
      { code: "tr", name: "Türkiye", events: [
        ev("Codex Community: #Hackathon", "Istanbul", "28-29 Nov", [AI, DX, API], "US$1,750"),
      ]},
    ]},
  ],
  extraFlags: {},
};
