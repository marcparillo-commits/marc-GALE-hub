# Setup Guide: Marc's GALE Hub

Complete step-by-step instructions to get your dashboard live.

## Prerequisites

- GitHub account
- Netlify account (free, sign up with GitHub)
- 15 minutes

## Step 1: Delete Old Files in GitHub (2 min)

1. Go to your GitHub repo: `https://github.com/marcparillo-commits/marcs-gale-hub`
2. Delete these old files (if present):
   - `index (1).html`
   - `package (1).json`
   - `README (1).md`
   - `server.js`
   - `index_updated.html`

How to delete:
- Click the filename
- Click trash icon (🗑️) in the top right
- Click "Commit changes"

## Step 2: Upload New Files to GitHub (3 min)

Upload these files to your repo root:

1. `index.html`
2. `netlify.toml`
3. `package.json`
4. `.env.example`
5. `.gitignore`
6. `README.md`
7. `SETUP.md`

Create folder structure:
8. Create folder: `netlify/functions/`
9. Inside that folder, create: `api.js`

How to upload:
- Click "Add file" → "Upload files"
- Drag and drop files
- Click "Commit changes"

## Step 3: Get Your API Keys (5 min)

### NewsAPI Key

1. Go to https://newsapi.org/register
2. Sign up (free)
3. Verify your email
4. Go to https://newsapi.org/account
5. Copy your API Key

### Finnhub Key

1. Go to https://finnhub.io/register
2. Sign up (free)
3. Go to https://finnhub.io/dashboard/api-token
4. Copy your API Key

Save these keys somewhere safe!

## Step 4: Configure Netlify (5 min)

1. Go to https://netlify.com
2. Sign in with GitHub
3. Go to your `marcs-gale-hub` project
4. Click "Site settings"
5. Go to "Build & deploy" → "Environment"
6. Click "Add environment variable"

Add two variables:

**Variable 1:**
- Key: `NEWSAPI_KEY`
- Value: `[paste your NewsAPI key]`
- Click "Save"

**Variable 2:**
- Key: `FINNHUB_KEY`
- Value: `[paste your Finnhub key]`
- Click "Save"

## Step 5: Trigger Redeploy (2 min)

1. Go back to Netlify dashboard
2. Go to "Deploys"
3. Click "Trigger deploy" → "Deploy site"
4. Wait 2-3 minutes for build to complete

## Step 6: View Your Live Site (1 min)

1. In Netlify, copy your site URL (looks like: `https://marcs-gale-hub.netlify.app`)
2. Paste in browser
3. You should see: **"Marc's GALE Hub"** with your clients loaded!

## Troubleshooting

### Getting 404 error?
- Check Netlify function logs: Dashboard → "Logs & metrics" → "Functions"
- Make sure `api.js` is in `netlify/functions/` folder
- Verify environment variables are set

### No data showing?
- Check browser console (F12 → Console tab)
- Verify API keys are correct
- Check Netlify function logs

### Build failed?
- Go to Netlify Dashboard → "Deploy log"
- Look for errors
- Most common: Missing `netlify.toml` or `api.js` in wrong folder

## File Checklist

After setup, your repo should have:

```
✅ index.html
✅ netlify.toml
✅ package.json
✅ .env.example
✅ .gitignore
✅ README.md
✅ SETUP.md
✅ netlify/functions/api.js
```

Old files deleted:
```
❌ index (1).html
❌ package (1).json
❌ README (1).md
❌ server.js
❌ index_updated.html
```

## What's Happening Behind the Scenes

1. **Frontend** (`index.html`) - Your dashboard UI
2. **Netlify Function** (`api.js`) - Backend that fetches news & stocks
3. **Environment Variables** - Your API keys (secure)
4. **Netlify** - Automatically runs everything

## Data Refresh

- Dashboard loads data on page load
- Refreshes automatically every 10 minutes
- You can click "Dashboard" tab to manually refresh

## Next Steps

After it's live:

1. Customize clients in `api.js` (line 8-15)
2. Add more news sources (line 17-22)
3. Share your dashboard with your team!

## Questions?

Check the logs:
- Netlify: Dashboard → "Logs & metrics"
- Browser: F12 → Console tab

Both will show any errors.

Good luck! 🚀
