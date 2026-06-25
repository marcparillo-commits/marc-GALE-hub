# Marc's GALE Hub

A personal business intelligence dashboard for your book of business at GALE.

## 🚀 Quick Deploy (5 Steps)

### Step 1 — Get Your API Keys (Free)
1. **NewsAPI**: Go to https://newsapi.org/register → sign up → copy your API key
2. **Finnhub**: Go to https://finnhub.io/register → sign up → copy your API key

### Step 2 — Push to GitHub
1. Go to https://github.com/new
2. Name the repo: `marcs-gale-hub`
3. Keep it Private
4. Click **Create repository**
5. Upload this entire folder (drag & drop all files onto the GitHub page)

### Step 3 — Connect to Netlify
1. Go to https://app.netlify.com
2. Click **Add new site → Import an existing project**
3. Choose **GitHub** → select `marcs-gale-hub`
4. Build settings will auto-detect from `netlify.toml`
5. Click **Deploy site**

### Step 4 — Add Environment Variables
1. In Netlify, go to **Site settings → Environment variables**
2. Add: `NEWS_API_KEY` = your NewsAPI key
3. Add: `FINNHUB_API_KEY` = your Finnhub key
4. Click **Save**, then **Trigger deploy**

### Step 5 — Done! 🎉
Your site is live. Netlify gives you a URL like `https://marcs-gale-hub.netlify.app`

## Adding or Editing Clients
Edit `src/data/clients.js` — add/remove clients, tickers, competitors, news queries.

## Tech Stack
- **Frontend**: React + Vite
- **Hosting**: Netlify (free tier)
- **API Proxy**: Netlify Functions (serverless)
- **News**: NewsAPI.org
- **Stocks**: Finnhub.io
- **Industry RSS**: RSS2JSON (free, no key needed)
