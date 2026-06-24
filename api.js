const axios = require('axios');
const Parser = require('rss-parser');

// CONFIG
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

// HELPER FUNCTIONS
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
    console.error(`NewsAPI error: ${error.message}`);
    return [];
  }
}

async function fetchStockPrice(ticker) {
  try {
    const response = await axios.get(`https://finnhub.io/api/v1/quote?symbol=${ticker}&token=${process.env.FINNHUB_KEY}`);
    return response.data;
  } catch (error) {
    console.error(`Stock error for ${ticker}: ${error.message}`);
    return null;
  }
}

async function fetchRSSFeed(url) {
  try {
    const parser = new Parser();
    const feed = await parser.parseURL(url);
    return feed.items || [];
  } catch (error) {
    console.error(`RSS error: ${error.message}`);
    return [];
  }
}

// MAIN HANDLER
exports.handler = async (event, context) => {
  const path = event.path;

  // CORS headers
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Content-Type': 'application/json'
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers };
  }

  try {
    // ROUTES
    if (path === '/api/health') {
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({ status: 'ok', timestamp: new Date() })
      };
    }

    if (path === '/api/clients') {
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify(CLIENTS)
      };
    }

    if (path === '/api/dashboard') {
      let clientNews = [];
      let industryNews = [];
      let opportunityNews = [];
      let stocks = {};

      // Fetch client news
      for (const client of CLIENTS) {
        const articles = await fetchNewsAPI(client.name, 'business');
        clientNews.push(...articles.map(a => ({ ...a, type: 'client', client: client.name })));
      }

      // Fetch competitor news
      for (const client of CLIENTS) {
        for (const competitor of client.competitors) {
          const articles = await fetchNewsAPI(competitor);
          clientNews.push(...articles.map(a => ({ ...a, type: 'competitor', competitor, client: client.name })));
        }
      }

      // Fetch industry news
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

      // Fetch opportunity signals
      const keywords = ['new product launch', 'earnings call', 'CMO hired', 'Chief Marketing Officer'];
      for (const keyword of keywords) {
        const articles = await fetchNewsAPI(keyword);
        opportunityNews.push(...articles.map(a => ({ ...a, type: 'opportunity', keyword })));
      }

      // Fetch stock prices
      const publicTickers = ['ATHA', 'HQY', 'IHG', 'CAVA', 'SHAK'];
      for (const ticker of publicTickers) {
        const data = await fetchStockPrice(ticker);
        if (data) stocks[ticker] = data;
      }

      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({
          clients: CLIENTS,
          clientNews: clientNews.slice(0, 50),
          industryNews: industryNews.slice(0, 50),
          opportunities: opportunityNews.slice(0, 50),
          stocks,
          verticals: VERTICALS,
          lastUpdated: new Date()
        })
      };
    }

    return {
      statusCode: 404,
      headers,
      body: JSON.stringify({ error: 'Not found' })
    };

  } catch (error) {
    console.error('Handler error:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: error.message })
    };
  }
};
