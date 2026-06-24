const axios = require('axios');
const Parser = require('rss-parser');

// Mock data - will be enhanced with real APIs
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

const VERTICALS = {
  'Healthcare/Fintech': ['Athenahealth Inc.', 'HealthEquity', 'Embrace Pet Insurance', 'Pets Best Insurance'],
  'Hospitality': ['InterContinental Hotels Group'],
  'Autonomous Vehicles': ['Waymo'],
  'Food & Beverage': ['Cava', 'Shake Shack']
};

const MARKETING_SOURCES = [
  { name: 'Ad Age', url: 'https://www.adage.com/feed' },
  { name: 'Digiday', url: 'https://digiday.com/feed/' },
  { name: 'Marketing Dive', url: 'https://www.marketingdive.com/feeds/news/' },
  { name: 'The Drum', url: 'https://www.thedrum.com/feeds/latest.rss' }
];

// Cache data
let cachedData = {
  clientNews: [],
  industryNews: [],
  opportunityNews: [],
  stocks: {},
  lastUpdated: new Date()
};

async function fetchNewsAPI(query) {
  try {
    const params = {
      q: query,
      sortBy: 'publishedAt',
      apiKey: process.env.NEWSAPI_KEY,
      pageSize: 20
    };
    
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

async function aggregateAllNews() {
  console.log('Aggregating news...');
  
  // Client news
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
  
  // Competitor news
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
  
  // Industry news from RSS
  let industryNews = [];
  for (const source of MARKETING_SOURCES) {
    const articles = await fetchRSSFeed(source.url);
    industryNews.push(...articles.map(a => ({ 
      ...a, 
      source: source.name, 
      type: 'industry',
      link: a.link || a.url,
      pubDate: a.pubDate || a.isoDate,
      title: a.title || ''
    })));
  }
  
  // Opportunity signals
  const keywords = ['new product launch', 'earnings call', 'leadership change', 'CMO'];
  let opportunityNews = [];
  for (const keyword of keywords) {
    const articles = await fetchNewsAPI(keyword);
    opportunityNews.push(...articles.map(a => ({ 
      ...a, 
      source: 'NewsAPI', 
      type: 'opportunity', 
      keyword 
    })));
  }
  
  // Stock prices
  const publicTickers = ['ATHA', 'HQY', 'IHG', 'CAVA', 'SHAK'];
  let stocks = {};
  for (const ticker of publicTickers) {
    const data = await fetchStockPrice(ticker);
    if (data) stocks[ticker] = data;
  }
  
  cachedData = {
    clientNews: clientNews.slice(0, 100),
    industryNews: industryNews.slice(0, 50),
    opportunityNews: opportunityNews.slice(0, 30),
    stocks,
    lastUpdated: new Date()
  };
  
  console.log('✅ News aggregation complete');
}

// Aggregate on startup
aggregateAllNews().catch(console.error);

// Re-aggregate every 6 hours
setInterval(aggregateAllNews, 6 * 60 * 60 * 1000);

// Handler for Netlify Functions
exports.handler = async (event, context) => {
  const path = event.path;
  
  // Enable CORS
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Content-Type': 'application/json'
  };
  
  // Handle CORS preflight
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }
  
  try {
    // Dashboard endpoint
    if (path === '/.netlify/functions/api/dashboard' || path === '/api/dashboard') {
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
    
    // Clients endpoint
    if (path === '/.netlify/functions/api/clients' || path === '/api/clients') {
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify(CLIENTS)
      };
    }
    
    // Client news endpoint
    if (path === '/.netlify/functions/api/news/clients' || path === '/api/news/clients') {
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify(cachedData.clientNews)
      };
    }
    
    // Industry news endpoint
    if (path === '/.netlify/functions/api/news/industry' || path === '/api/news/industry') {
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify(cachedData.industryNews)
      };
    }
    
    // Opportunities endpoint
    if (path === '/.netlify/functions/api/news/opportunities' || path === '/api/news/opportunities') {
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify(cachedData.opportunityNews)
      };
    }
    
    // Stocks endpoint
    if (path === '/.netlify/functions/api/stocks' || path === '/api/stocks') {
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify(cachedData.stocks)
      };
    }
    
    // Health check
    if (path === '/.netlify/functions/api/health' || path === '/api/health') {
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({ status: 'ok', timestamp: new Date() })
      };
    }
    
    return {
      statusCode: 404,
      headers,
      body: JSON.stringify({ error: 'Not found' })
    };
  } catch (error) {
    console.error('Error:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: error.message })
    };
  }
};
