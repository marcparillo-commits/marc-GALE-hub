const axios = require('axios');
const Parser = require('rss-parser');

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

// ===== IN-MEMORY CACHE =====
let cachedData = {
  clientNews: [],
  industryNews: [],
  opportunityNews: [],
  stocks: {},
  lastUpdated: new Date()
};

// ===== API FUNCTIONS =====
async function fetchNewsAPI(query) {
  try {
    const response = await axios.get('https://newsapi.org/v2/everything', {
      params: {
        q: query,
        sortBy: 'publishedAt',
        apiKey: process.env.NEWSAPI_KEY,
        pageSize: 10,
        language: 'en'
      },
      timeout: 5000
    });
    return response.data.articles || [];
  } catch (error) {
    console.error(`NewsAPI error for "${query}":`, error.message);
    return [];
  }
}

async function fetchStockPrice(ticker) {
  try {
    const response = await axios.get(`https://finnhub.io/api/v1/quote?symbol=${ticker}&token=${process.env.FINNHUB_KEY}`, {
      timeout: 5000
    });
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
async function aggregateAllData() {
  console.log('Starting data aggregation...');
  
  try {
    // Client News
    let clientNews = [];
    for (const client of CLIENTS) {
      const articles = await fetchNewsAPI(client.name);
      clientNews.push(...articles.map(a => ({ 
        ...a, 
        source: 'NewsAPI', 
        type: 'client', 
        client: client.name 
      })));
    }

    // Competitor News
    for (const client of CLIENTS) {
      for (const competitor of client.competitors) {
        const articles = await fetchNewsAPI(competitor);
        clientNews.push(...articles.map(a => ({ 
          ...a, 
          source: 'NewsAPI', 
          type: 'competitor', 
          competitor, 
          client: client.name 
        })));
      }
    }

    // Industry News
    let industryNews = [];
    for (const source of MARKETING_SOURCES) {
      const articles = await fetchRSSFeed(source.url);
      industryNews.push(...articles.map(a => ({ 
        ...a, 
        source: source.name, 
        type: 'industry',
        link: a.link || a.url,
        pubDate: a.pubDate || a.isoDate
      })));
    }

    // Opportunity News
    let opportunityNews = [];
    const keywords = ['new product launch', 'earnings call', 'leadership change CMO'];
    for (const keyword of keywords) {
      const articles = await fetchNewsAPI(keyword);
      opportunityNews.push(...articles.map(a => ({ 
        ...a, 
        source: 'NewsAPI', 
        type: 'opportunity', 
        keyword 
      })));
    }

    // Stocks
    let stocks = {};
    const publicTickers = ['ATHA', 'HQY', 'IHG', 'CAVA', 'SHAK'];
    for (const ticker of publicTickers) {
      const data = await fetchStockPrice(ticker);
      if (data && data.c) {
        stocks[ticker] = data;
      }
    }

    cachedData = {
      clientNews: clientNews.slice(0, 100),
      industryNews: industryNews.slice(0, 50),
      opportunityNews: opportunityNews.slice(0, 30),
      stocks,
      lastUpdated: new Date()
    };

    console.log('Data aggregation complete');
  } catch (error) {
    console.error('Aggregation error:', error);
  }
}

// Initial load on startup
aggregateAllData();

// ===== NETLIFY FUNCTION =====
exports.handler = async (event) => {
  // CORS headers
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Content-Type': 'application/json'
  };

  // Handle preflight
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers };
  }

  try {
    const path = event.path.replace('/.netlify/functions/api', '');

    // ===== ROUTES =====
    if (path === '/dashboard' || path === '') {
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({
          clients: CLIENTS,
          clientNews: cachedData.clientNews.slice(0, 20),
          industryNews: cachedData.industryNews.slice(0, 15),
          opportunities: cachedData.opportunityNews.slice(0, 10),
          stocks: cachedData.stocks,
          verticals: VERTICALS,
          lastUpdated: cachedData.lastUpdated
        })
      };
    }

    if (path === '/clients') {
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify(CLIENTS)
      };
    }

    if (path === '/news/clients') {
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify(cachedData.clientNews)
      };
    }

    if (path === '/news/industry') {
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify(cachedData.industryNews)
      };
    }

    if (path === '/news/opportunities') {
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify(cachedData.opportunityNews)
      };
    }

    if (path === '/stocks') {
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify(cachedData.stocks)
      };
    }

    if (path === '/health') {
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({ status: 'ok', timestamp: new Date() })
      };
    }

    // 404
    return {
      statusCode: 404,
      headers,
      body: JSON.stringify({ error: 'Not found' })
    };
  } catch (error) {
    console.error('Function error:', error);
    return {
      statusCode: 500,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ error: 'Internal server error', message: error.message })
    };
  }
};
