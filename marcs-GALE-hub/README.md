# Marc's GALE Hub

Real-time business intelligence dashboard for your marketing agency clients.

## Features

✨ **Client Portfolio Dashboard** - News and stock tracking for your key clients
📊 **Stock Performance** - Real-time pricing for public companies
📰 **Industry Trends** - Aggregated marketing news from Ad Age, Digiday, Axios, Marketing Dive, The Drum
🎯 **Opportunity Radar** - Earnings calls, product launches, leadership changes
🏢 **Sector Intelligence** - Vertical-specific news filtering

## Your Clients

- Athenahealth Inc. (Healthcare Tech)
- Embrace Pet Insurance (Pet Insurance)
- Pets Best Insurance (Pet Insurance)
- HealthEquity (Healthcare/Fintech)
- InterContinental Hotels Group (Hospitality)
- Waymo (Autonomous Vehicles)
- Cava (Food & Beverage)
- Shake Shack (Food & Beverage)

## Data Sources

- **NewsAPI** - Client and competitor news
- **Finnhub** - Stock prices (free tier)
- **RSS Feeds** - Marketing industry publications

## Quick Start

### 1. Get API Keys (Free)

**NewsAPI:**
- Go to https://newsapi.org/register
- Sign up (free account)
- Copy your API key

**Finnhub:**
- Go to https://finnhub.io/register
- Sign up (free account)
- Copy your API key

### 2. Deploy to Netlify

1. Push this repo to GitHub
2. Go to https://netlify.com
3. Click "Add new site" → "Import an existing project"
4. Select this GitHub repo
5. Set Build command: `npm install`
6. Set Publish directory: `.`
7. Add Environment Variables:
   - `NEWSAPI_KEY` = your key
   - `FINNHUB_KEY` = your key
8. Deploy!

### 3. Done!

Your dashboard will be live in 2-3 minutes. Netlify automatically runs the API function.

## Project Structure

```
marcs-gale-hub/
├── index.html                    # Frontend dashboard
├── netlify/
│   └── functions/
│       └── api.js               # Netlify Function (backend)
├── netlify.toml                 # Netlify config
├── package.json                 # Dependencies
├── .env.example                 # Example env vars
├── .gitignore                   # Git ignore
└── README.md                    # This file
```

## How It Works

1. **Frontend** (`index.html`) loads in the browser
2. **JavaScript** calls `/.netlify/functions/api/dashboard`
3. **Backend** (`api.js`) runs as a Netlify Function
4. **Backend** fetches data from NewsAPI, Finnhub, and RSS feeds
5. **Data** is cached and returned to the frontend
6. **Dashboard** renders in real-time

## Updating News Feeds

To add more clients or competitors, edit `api.js`:

```javascript
const CLIENTS = [
  { name: 'Your Client', ticker: 'TICK', industry: 'Industry', competitors: ['Competitor1', 'Competitor2'] },
  // Add more...
];
```

## Customization

Edit these in `api.js` to customize:

- `CLIENTS` - Your client list
- `MARKETING_SOURCES` - Industry publication feeds
- `VERTICALS` - Industry sectors

## Free Tier Limits

- **NewsAPI**: 100 requests/day (free tier)
- **Finnhub**: 60 requests/minute (free tier)
- **Netlify**: Unlimited function calls (free tier)

If you hit limits, upgrade your API keys for more requests.

## Support

For issues:
1. Check browser console (F12)
2. Check Netlify function logs: Dashboard → Logs
3. Verify API keys are set in Netlify environment variables

## License

MIT
