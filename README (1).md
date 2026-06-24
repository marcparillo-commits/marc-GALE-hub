# Marc's GALE Hub

Real-time business intelligence dashboard for your marketing agency portfolio. Track client news, stock prices, competitive intelligence, industry trends, sector insights, and opportunity signals.

## 📊 Features

### 1. Client Portfolio Dashboard
- Monitor all 8 clients in one view
- Real-time stock prices (public companies)
- Recent client news & competitor activity
- Quick client metadata (industry, location)

### 2. Marketing Industry Trends
- Curated news from Ad Age, Digiday, Marketing Dive, The Drum
- Topic clustering by marketing themes
- Weekly trending topics

### 3. Sector Intelligence
- Filter news by vertical (Healthcare, Hospitality, Autonomous Vehicles, F&B)
- Track regulatory changes by sector

### 4. Opportunity Radar
- RFP/pitch signals (new product launches, market expansion)
- Budget signals (earnings mentions, marketing spend)
- Leadership changes (CMO hires, marketing roles)

## 🚀 Quick Start

### Step 1: Get API Keys (Free Tiers)

1. **NewsAPI** (free tier = 100 requests/day)
   - Go to https://newsapi.org/
   - Sign up → Copy your API key

2. **Finnhub** (free tier = stocks + company news)
   - Go to https://finnhub.io/
   - Sign up → Copy your API key

### Step 2: Clone & Setup Locally

```bash
# Clone the repo
git clone https://github.com/yourusername/marcs-gale-hub.git
cd marcs-gale-hub

# Install dependencies
npm install

# Create .env file
cp .env.example .env

# Add your API keys to .env
# NEWSAPI_KEY=your_key_here
# FINNHUB_KEY=your_key_here

# Start server
npm start
```

Visit `http://localhost:3001` in your browser.

### Step 3: Deploy to Netlify

1. **Push to GitHub**
   ```bash
   git add .
   git commit -m "Initial commit"
   git push origin main
   ```

2. **Connect to Netlify**
   - Go to https://netlify.com
   - Click "Add new site" → "Import an existing project"
   - Select your GitHub repo
   - Set Build Command: `npm install && npm start`
   - Set Publish Directory: `.`
   - Add Environment Variables:
     - `NEWSAPI_KEY` = your key
     - `FINNHUB_KEY` = your key
     - `NODE_ENV` = production
   - Deploy!

3. **Your site is live!** 
   - Netlify will give you a URL like `marcs-gale-hub.netlify.app`

## 📁 Project Structure

```
marcs-gale-hub/
├── server.js              # Backend API (Node.js + Express)
├── index.html             # Frontend dashboard (single page app)
├── package.json           # Dependencies
├── .env.example          # Environment variables template
├── .gitignore            # Git ignore rules
├── netlify.toml          # Netlify configuration
└── README.md             # This file
```

## 🔄 How It Works

### Backend (server.js)
- Runs on Node.js + Express
- Aggregates news from NewsAPI + RSS feeds
- Fetches stock prices from Finnhub
- Runs aggregation job every 6 hours (using cron)
- Exposes REST API endpoints

### Frontend (index.html)
- Pure HTML/CSS/JavaScript (no build required)
- Calls backend API endpoints
- Auto-refreshes data every 10 minutes
- Fully responsive design

### API Endpoints
- `GET /api/health` - Health check
- `GET /api/dashboard` - All dashboard data
- `GET /api/clients` - List of clients
- `GET /api/news/clients` - Client + competitor news
- `GET /api/news/industry` - Marketing industry news
- `GET /api/news/opportunities` - Opportunity signals
- `GET /api/stocks` - All stock prices
- `GET /api/stocks/:ticker` - Single stock price
- `GET /api/news/vertical/:vertical` - News filtered by sector

## ⚙️ Configuration

Edit `server.js` to customize:

### Add/Remove Clients
```javascript
const CLIENTS = [
  { name: 'Your Client', ticker: 'TICK', industry: 'Your Industry', competitors: ['Competitor 1', 'Competitor 2'] },
  // ...
];
```

### Add/Remove News Sources
```javascript
const MARKETING_SOURCES = [
  { name: 'Your Source', url: 'https://your-rss-feed.com' },
  // ...
];
```

### Change Aggregation Schedule
```javascript
// Change from every 6 hours to daily at 8am
cron.schedule('0 8 * * *', runAggregation);
```

## 🛠️ Troubleshooting

### No news appearing?
- Check that NEWSAPI_KEY is set correctly
- Check `/api/health` endpoint to verify backend is running
- Check browser console for CORS errors

### Stock prices not showing?
- Verify FINNHUB_KEY is valid
- Some tickers may not be available on free tier
- Check `/api/stocks` endpoint directly

### Site won't deploy on Netlify?
- Make sure environment variables are set in Netlify settings
- Verify package.json has correct start script
- Check Netlify build logs for errors

## 📈 Next Steps

1. **Customize client list** with your actual portfolio
2. **Add competitor data** - edit the competitors array for each client
3. **Integrate with Slack** - post daily digest to #marketing-intel channel
4. **Add email alerts** - notify team when major client news breaks
5. **Add user authentication** - restrict access to team members

## 🔐 Security Notes

- Never commit `.env` file with real API keys
- Use Netlify's environment variables for secrets
- Rotate API keys periodically
- Monitor API usage to avoid hitting free tier limits

## 📝 License

MIT

## 👤 Author

Marc Parillo - Gale Partners

---

**Need help?** Check the troubleshooting section or review the inline code comments in `server.js` and `index.html`.
