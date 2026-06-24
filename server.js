require('dotenv').config();
const express = require('express');
const cors = require('cors');
const axios = require('axios');
const Parser = require('rss-parser');
const cron = require('node-cron');

const app = express();
app.use(cors());
app.use(express.json());

// ===== CONFIG =====
const CLIENTS = [
  { name: 'Athenahealth Inc.', ticker: 'ATHA', industry: 'Healthcare Tech', competitors: ['Epic Systems', 'Cerner', 'Allscripts'] },
  { name: 'Embrace Pet Insurance', industry: 'Pet Insurance', competitors: ['Trupanion', 'Healthy Paws', 'Spot'] },
  { name: 'Pets Best Insurance', industry: 'Pet Insurance', competitors: ['Trupanion', 'Healthy Paws', 'Embrace'] },
  { name: 'HealthEquity', ticker: 'HQY', industry: 'Healthcare/Fintech', competitors: ['HSA Bank', 'Lively', 'Fidelity'] },
  { name: 'InterContinental Hotels Group', ticker: 'IHG', industry: 'Hospitality', competitors: ['Marriott', 'Hilton', 'Hyatt'] },
  { name: 'Waymo', industry: 'Autonomous Vehicles', competitors: ['Cruise', 'Aurora', 'Zoox'] },
  { name: 'Cava', ticker: 'CAVA', industry: 'Food & Beverage', competitors: ['Zoes Kitchen', 'Pita Pit', 'Naf Naf Grill'] },
  { name: 'Shake Shack', ticker: 'SHAK', industry: 'Food & Beverage', competitors: ['Five Guys', 'In-N-Out', 'BurgerFi'] }
];

const MARKETING_SOURCES = [
  { name: 'Ad Age', url: 'https://www.adage.com/feed' },
  { name: 'Digiday', url: 'https://digiday.com/feed/' },
  { name: 'Marketing Dive', url: 'https://www.marketingdive.com/feeds/news/' },
  { name: 'The Drum', url: 'https://www.thedrum.com/feeds/latest.rss' }
];

const VERTICALS = {
  'Healthcare/Fintech': ['Athenahealth Inc.', 'HealthEquity', 'Embrace Pet Insurance', 'Pets Best Insurance'],
  'Hospitality': ['InterContinental Hotels Group'],
  'Autonomous Vehicles': ['Waymo'],
  'Food & Beverage': ['Cava', 'Shake Shack']
};

// ===== IN-MEMORY STORAGE =====
let cachedNews = {
  clientNews: [],
  industryNews: [],
  opportunityNews: [],
  stocks: {}
};

// ===== API FUNCTIONS =====

async function fetchNewsAPI(query, category = null) {
  try {
    const params = {
      q: query,
      sortBy: 'publishedAt',
      apiKey: process.env.NEWSAPI_KEY,
      pageSize: 20
    };
    if (category) params.category = category;
    
    const response = await axios.get('https://newsapi.org/v2/everything', { params });
    return response.data.articles || [];
  } catch (error) {
    console.error(`NewsAPI error for "${query}":`, error.message);
    return [];
  }
}

async function fetchStockPrice(ticker) {
  try {
    const response = await axios.get(`https://finnhub.io/api/v1/quote?symbol=${ticker}&token=${process.env.FINNHUB_KEY}`);
    return response.data;
  } catch (error) {
    console.error(`Stock error for ${ticker}:`, error.message);
    return null;
  }
}

async function fetchRSSFeed(url) {
  try {
    const parser = new Parser();
    const feed = await parser.parseURL(url);
    return feed.items || [];
  } catch (error) {
    console.error(`RSS error for ${url}:`, error.message);
    return [];
  }
}

// ===== DATA AGGREGATION =====

async function aggregateClientNews() {
  console.log('Fetching client news...');
  let news = [];
  
  for (const client of CLIENTS) {
    const articles = await fetchNewsAPI(client.name, 'business');
    news.push(...articles.map(a => ({ ...a, source: 'NewsAPI', type: 'client', client: client.name })));
  }
  
  cachedNews.clientNews = news.slice(0, 50);
}

async function aggregateCompetitorNews() {
  console.log('Fetching competitor news...');
  let news = [];
  
  for (const client of CLIENTS) {
    for (const competitor of client.competitors) {
      const articles = await fetchNewsAPI(competitor);
      news.push(...articles.map(a => ({ ...a, source: 'NewsAPI', type: 'competitor', competitor, client: client.name })));
    }
  }
  
  cachedNews.clientNews = cachedNews.clientNews.concat(news).slice(0, 100);
}

async function aggregateIndustryNews() {
  console.log('Fetching marketing industry news...');
  let news = [];
  
  for (const source of MARKETING_SOURCES) {
    const articles = await fetchRSSFeed(source.url);
    news.push(...articles.map(a => ({ 
      ...a, 
      source: source.name, 
      type: 'industry',
      link: a.link || a.url,
      pubDate: a.pubDate || a.isoDate
    })));
  }
  
  cachedNews.industryNews = news.slice(0, 50);
}

async function aggregateOpportunityNews() {
  console.log('Fetching opportunity signals...');
  const keywords = ['new product launch', 'earnings call', 'leadership change', 'CMO', 'Chief Marketing Officer', 'market expansion'];
  let news = [];
  
  for (const keyword of keywords) {
    const articles = await fetchNewsAPI(keyword);
    news.push(...articles.map(a => ({ ...a, source: 'NewsAPI', type: 'opportunity', keyword })));
  }
  
  cachedNews.opportunityNews = news.slice(0, 50);
}

async function aggregateStocks() {
  console.log('Fetching stock prices...');
  const publicTickers = ['ATHA', 'HQY', 'IHG', 'CAVA', 'SHAK'];
  
  for (const ticker of publicTickers) {
    const data = await fetchStockPrice(ticker);
    if (data) {
      cachedNews.stocks[ticker] = data;
    }
  }
}

// ===== AGGREGATION SCHEDULER =====
async function runAggregation() {
  console.log('🔄 Starting news aggregation...');
  await aggregateClientNews();
  await aggregateCompetitorNews();
  await aggregateIndustryNews();
  await aggregateOpportunityNews();
  await aggregateStocks();
  console.log('✅ Aggregation complete');
}

// Run every 6 hours
cron.schedule('0 */6 * * *', runAggregation);
// Run on startup
runAggregation();

// ===== API ENDPOINTS =====

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date() });
});

app.get('/api/clients', (req, res) => {
  res.json(CLIENTS);
});

app.get('/api/news/clients', (req, res) => {
  res.json(cachedNews.clientNews);
});

app.get('/api/news/industry', (req, res) => {
  res.json(cachedNews.industryNews);
});

app.get('/api/news/opportunities', (req, res) => {
  res.json(cachedNews.opportunityNews);
});

app.get('/api/news/vertical/:vertical', (req, res) => {
  const vertical = req.params.vertical;
  const clientsInVertical = VERTICALS[vertical] || [];
  
  const verticalNews = cachedNews.clientNews.filter(
    article => clientsInVertical.some(client => article.description?.includes(client) || article.title?.includes(client))
  );
  
  res.json({ vertical, news: verticalNews });
});

app.get('/api/stocks', (req, res) => {
  res.json(cachedNews.stocks);
});

app.get('/api/stocks/:ticker', (req, res) => {
  const ticker = req.params.ticker.toUpperCase();
  res.json(cachedNews.stocks[ticker] || {});
});

app.get('/api/dashboard', (req, res) => {
  res.json({
    clients: CLIENTS,
    clientNews: cachedNews.clientNews.slice(0, 20),
    industryNews: cachedNews.industryNews.slice(0, 15),
    opportunities: cachedNews.opportunityNews.slice(0, 10),
    stocks: cachedNews.stocks,
    verticals: VERTICALS,
    lastUpdated: new Date()
  });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`🚀 Marc's GALE Hub running on port ${PORT}`);
});
