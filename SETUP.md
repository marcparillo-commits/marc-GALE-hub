# Marc's GALE Hub - Complete Setup Guide

Follow these steps **exactly** to get your dashboard live in 15 minutes.

---

## Phase 1: Get Your API Keys (5 minutes)

### NewsAPI
1. Open https://newsapi.org/ in your browser
2. Click "Get API Key" (top right)
3. Sign up with your email
4. You'll see your API key - **copy it**
5. Save it somewhere (you'll need it soon)

### Finnhub
1. Open https://finnhub.io/ in your browser
2. Click "Sign up" (top right)
3. Create account with email
4. Go to "Dashboard" → Copy your API key
5. Save it

---

## Phase 2: Create GitHub Repo (3 minutes)

1. Go to https://github.com/new
2. Repository name: `marcs-gale-hub`
3. Description: "Business intelligence dashboard for marketing agency clients"
4. Select "Public"
5. Check "Add a README file"
6. Click "Create repository"

---

## Phase 3: Add Files to GitHub (2 minutes)

You have 6 files to upload:

1. **package.json** - Dependencies list
2. **server.js** - Backend server (the brain)
3. **index.html** - Frontend dashboard (what you see)
4. **.env.example** - API key template
5. **.gitignore** - Files to ignore
6. **netlify.toml** - Netlify config
7. **README.md** - Documentation

### Upload Process:
1. Go to your new repo on GitHub
2. Click "Add file" → "Create new file"
3. Name it `package.json`
4. Copy the entire content from the file I gave you
5. Click "Commit changes"
6. Repeat for remaining files

**OR** Use GitHub Desktop:
1. Download GitHub Desktop (https://desktop.github.com/)
2. Clone your new repo
3. Copy all 6 files into the folder
4. Commit & Push

---

## Phase 4: Deploy to Netlify (5 minutes)

1. Go to https://netlify.com
2. Sign up with GitHub account (or create new account)
3. After signing in, click "Add new site" → "Import an existing project"
4. Select "GitHub" → Choose `marcs-gale-hub` repo
5. **Build Settings:**
   - Build command: `npm install`
   - Publish directory: `.` (current directory)
6. Click "Deploy site"

### Add Environment Variables:
1. Wait for Netlify build to complete (should say "Deploy failed" - that's normal, we'll fix it)
2. Go to "Site settings" → "Environment"
3. Click "Edit variables"
4. Add two variables:
   - Key: `NEWSAPI_KEY` | Value: (paste your NewsAPI key)
   - Key: `FINNHUB_KEY` | Value: (paste your Finnhub key)
5. Click "Save"
6. Go back to "Deployments" → Trigger a redeploy (click the latest deploy)

Wait 2-3 minutes for deployment to complete.

---

## Phase 5: Test Your Dashboard

1. Once Netlify says "Published", click the site URL (e.g., `marcs-gale-hub.netlify.app`)
2. You should see:
   - Purple header with "Marc's GALE Hub"
   - Status showing "Loading data..."
   - Navigation tabs (Dashboard, Client Portfolio, Industry Trends, etc.)

**First load may take 30 seconds** - the backend is aggregating news from APIs.

If you see your clients listed and news articles, **you're done!** 🎉

---

## Phase 6: Customize Your Dashboard (Optional)

Edit `server.js` to:

### Add your logo or branding
- Edit the header HTML in `index.html` (line ~80)

### Change which competitors are tracked
- Edit the `CLIENTS` array in `server.js` (line ~16)

### Add more news sources
- Edit `MARKETING_SOURCES` in `server.js` (line ~26)

### Change aggregation frequency
- Edit the cron schedule in `server.js` (line ~234)

After editing:
1. Commit changes to GitHub
2. Netlify will auto-redeploy
3. Refresh your dashboard in 2-3 minutes

---

## 🆘 Troubleshooting

### "No news appearing on dashboard"
**Solution:** 
- Wait 30 seconds on first load
- Check browser console (F12 → Console tab) for errors
- Verify API keys are correct in Netlify environment settings
- Check https://yoursite.netlify.app/api/health in a new tab - should say `{"status":"ok"}`

### "Stock prices showing as empty"
**Solution:**
- Finnhub free tier has limits
- Public clients: ATHA, HQY, IHG, CAVA, SHAK
- If still blank, API key may be invalid

### "Netlify deploy keeps failing"
**Solution:**
- Check Netlify build logs (go to Deployments → click failed deploy)
- Look for error messages
- Verify all files are in repo (use `git status` to check)
- Make sure `.env.example` exists (not `.env`)

### "Dashboard loads but all news sections are empty"
**Solution:**
- This is normal for first 1-2 minutes while data loads
- Check `/api/dashboard` endpoint directly
- Verify NewsAPI key is correct
- Wait 30 seconds and refresh

---

## ✨ Your Dashboard is Now Live!

**What you can do with it:**

1. **Daily standup**: Check dashboard in morning to see what broke/launched at your clients
2. **Competitive intel**: Monitor what Shake Shack's competitors are doing
3. **Opportunity radar**: Spot CMO hires or earnings calls mentioning marketing budgets
4. **Industry pulse**: Know what's trending in marketing world
5. **Share with team**: Send Netlify link to your team

---

## 📊 Data Refresh Schedule

- Client news: Every 6 hours
- Industry trends: Every 6 hours
- Stock prices: Every 6 hours
- Frontend auto-refreshes: Every 10 minutes

---

## 🎯 Next Upgrades (Future)

Once you're comfortable:
1. Add Slack integration for daily digests
2. Add email alerts for major client news
3. Add user authentication for team access
4. Store data in database (PostgreSQL) instead of in-memory
5. Add more verticals or clients

---

## Questions?

Check the README.md file in your repo for full documentation.

Good luck! 🚀
