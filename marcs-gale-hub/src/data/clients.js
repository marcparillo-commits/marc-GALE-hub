export const clients = [
  {
    id: 1,
    name: "Athenahealth",
    industry: "Healthcare Tech",
    vertical: "healthcare",
    ticker: null,
    logo: "AH",
    color: "#4f9cf9",
    competitors: ["Epic Systems", "Oracle Cerner", "Allscripts", "Meditech"],
    newsQuery: "Athenahealth health technology EHR",
    competitorQuery: "Epic Systems Cerner healthcare EHR"
  },
  {
    id: 2,
    name: "Embrace Pet Insurance",
    industry: "Pet Insurance",
    vertical: "insurance",
    ticker: null,
    logo: "EP",
    color: "#f97316",
    competitors: ["Trupanion", "Healthy Paws", "Spot Pet Insurance", "Figo"],
    newsQuery: "Embrace Pet Insurance",
    competitorQuery: "Trupanion pet insurance Healthy Paws"
  },
  {
    id: 3,
    name: "Pets Best Insurance",
    industry: "Pet Insurance",
    vertical: "insurance",
    ticker: null,
    logo: "PB",
    color: "#22c55e",
    competitors: ["Trupanion", "Healthy Paws", "Embrace", "Lemonade Pet"],
    newsQuery: "Pets Best Insurance",
    competitorQuery: "pet insurance Trupanion Lemonade"
  },
  {
    id: 4,
    name: "HealthEquity",
    industry: "Healthcare Fintech",
    vertical: "healthcare",
    ticker: "HQY",
    logo: "HE",
    color: "#a78bfa",
    competitors: ["HSA Bank", "Lively", "Fidelity HSA", "Optum Bank"],
    newsQuery: "HealthEquity HSA benefits",
    competitorQuery: "HSA Bank Lively health savings account"
  },
  {
    id: 5,
    name: "IHG Hotels & Resorts",
    industry: "Hospitality",
    vertical: "hospitality",
    ticker: "IHG",
    logo: "IH",
    color: "#ec4899",
    competitors: ["Marriott", "Hilton", "Hyatt", "AccorHotels"],
    newsQuery: "InterContinental Hotels IHG hospitality",
    competitorQuery: "Marriott Hilton Hyatt hotel industry"
  },
  {
    id: 6,
    name: "Waymo",
    industry: "Autonomous Vehicles",
    vertical: "automotive",
    ticker: null,
    logo: "WM",
    color: "#06b6d4",
    competitors: ["Cruise", "Aurora Innovation", "Zoox", "Tesla FSD"],
    newsQuery: "Waymo autonomous vehicle self-driving",
    competitorQuery: "Cruise Aurora autonomous vehicle Tesla FSD"
  },
  {
    id: 7,
    name: "Cava",
    industry: "Food & Beverage",
    vertical: "food",
    ticker: "CAVA",
    logo: "CV",
    color: "#f43f5e",
    competitors: ["Chipotle", "Sweetgreen", "Naf Naf Grill", "Zoes Kitchen"],
    newsQuery: "Cava restaurant fast casual",
    competitorQuery: "Chipotle Sweetgreen fast casual Mediterranean"
  },
  {
    id: 8,
    name: "Shake Shack",
    industry: "Food & Beverage",
    vertical: "food",
    ticker: "SHAK",
    logo: "SS",
    color: "#84cc16",
    competitors: ["Five Guys", "Smashburger", "BurgerFi", "In-N-Out"],
    newsQuery: "Shake Shack restaurant burger",
    competitorQuery: "Five Guys Smashburger BurgerFi premium burger"
  }
];

export const verticals = [
  { id: "all", label: "All Verticals" },
  { id: "healthcare", label: "Healthcare / Fintech" },
  { id: "insurance", label: "Pet Insurance" },
  { id: "hospitality", label: "Hospitality" },
  { id: "automotive", label: "Autonomous Vehicles" },
  { id: "food", label: "Food & Beverage" }
];

export const industryFeeds = [
  { name: "Ad Age", rssUrl: "https://adage.com/rss/feed" },
  { name: "Digiday", rssUrl: "https://digiday.com/feed/" },
  { name: "Marketing Dive", rssUrl: "https://www.marketingdive.com/feeds/news/" },
  { name: "The Drum", rssUrl: "https://www.thedrum.com/rss" },
  { name: "Axios", rssUrl: "https://api.axios.com/feed/" }
];

export const opportunityKeywords = [
  "new CMO", "chief marketing officer appointed", "marketing budget increase",
  "new product launch", "market expansion", "rebranding", "new campaign",
  "advertising spend", "digital transformation", "agency review"
];
