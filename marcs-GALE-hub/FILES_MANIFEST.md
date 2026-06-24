# 📦 Marc's GALE Hub - Fresh Start Files

All files are ready to download. **No renaming needed** — just upload them to GitHub as-is.

---

## 📋 Files to Download (8 files)

| # | Filename | Purpose | Size |
|---|----------|---------|------|
| 1 | `index.html` | Frontend dashboard UI | 15 KB |
| 2 | `netlify.toml` | Netlify configuration | 282 B |
| 3 | `api.js` | Backend Netlify Function | 7.3 KB |
| 4 | `package.json` | Node.js dependencies | 451 B |
| 5 | `.env.example` | Environment variables template | 169 B |
| 6 | `.gitignore` | Git ignore rules | 146 B |
| 7 | `README.md` | Documentation | 3.3 KB |
| 8 | `SETUP.md` | Step-by-step setup guide | 3.7 KB |

**Total: 8 files, ~30 KB**

---

## 🗂️ Upload Structure

Upload files to your GitHub repo in this exact structure:

```
marcs-gale-hub/
├── index.html
├── netlify.toml
├── package.json
├── .env.example
├── .gitignore
├── README.md
├── SETUP.md
└── netlify/
    └── functions/
        └── api.js
```

### Important: The `netlify/functions/` folder

- Create folder: `netlify/`
- Inside that, create folder: `functions/`
- Inside that, upload: `api.js`

---

## 🔧 Your Action Plan

### Step 1: Clean GitHub (2 min)
Delete ALL old files:
- `index (1).html` ❌
- `package (1).json` ❌
- `README (1).md` ❌
- `server.js` ❌
- `index_updated.html` ❌
- `netlify/functions/` folder ❌

### Step 2: Upload New Files (3 min)
1. Upload all 8 files above
2. Create `netlify/functions/` folder structure
3. Upload `api.js` inside

### Step 3: Get API Keys (5 min)
1. **NewsAPI**: https://newsapi.org/register → Copy key
2. **Finnhub**: https://finnhub.io/register → Copy key

### Step 4: Configure Netlify (3 min)
1. Go to Netlify Dashboard → Your project
2. Settings → Build & deploy → Environment
3. Add variable: `NEWSAPI_KEY` = your key
4. Add variable: `FINNHUB_KEY` = your key

### Step 5: Deploy (2 min)
1. Push changes to GitHub (or let Netlify auto-detect)
2. Netlify auto-deploys
3. Wait 2-3 minutes
4. Done! ✅

---

## ✨ What Each File Does

### Frontend Layer
- **`index.html`** - Your beautiful dashboard UI (React-like interactivity, no build needed)

### Backend Layer
- **`api.js`** - Netlify Function that:
  - Fetches client news from NewsAPI
  - Fetches competitor news from NewsAPI
  - Fetches industry news from RSS feeds (Ad Age, Digiday, Axios, Marketing Dive, The Drum)
  - Fetches stock prices from Finnhub
  - Sends data to frontend

### Configuration
- **`netlify.toml`** - Tells Netlify:
  - How to build (install dependencies)
  - Where functions are (`netlify/functions/`)
  - How to handle routing

- **`package.json`** - Lists dependencies:
  - `axios` - HTTP requests
  - `rss-parser` - Parse RSS feeds

- **`.env.example`** - Template for environment variables

### Documentation
- **`README.md`** - Full documentation
- **`SETUP.md`** - Step-by-step setup guide

### Git
- **`.gitignore`** - Prevents uploading node_modules, .env, etc.

---

## 🚀 Timeline

| Step | Time | Task |
|------|------|------|
| 1 | 2 min | Delete old files in GitHub |
| 2 | 3 min | Upload new files to GitHub |
| 3 | 5 min | Get API keys (NewsAPI + Finnhub) |
| 4 | 3 min | Add API keys to Netlify environment |
| 5 | 2 min | Trigger redeploy in Netlify |
| | **15 min** | **Total** |

---

## ✅ Success Checklist

After deployment:
- [ ] GitHub repo is clean (only new files)
- [ ] `netlify/functions/api.js` exists
- [ ] Netlify environment variables are set (NEWSAPI_KEY, FINNHUB_KEY)
- [ ] Netlify shows "Published" status (green checkmark)
- [ ] Site loads at `https://marcs-gale-hub.netlify.app` (or your custom domain)
- [ ] Dashboard shows "✅ Data loaded"
- [ ] You see your 8 clients listed
- [ ] You see stock prices (if public companies)
- [ ] You see news articles

---

## 🆘 Troubleshooting

| Issue | Solution |
|-------|----------|
| 404 error | Check `api.js` is in `netlify/functions/` folder |
| No data loading | Check API keys in Netlify environment variables |
| Build failed | Check Netlify deploy log for errors |
| Dashboard empty | Open browser console (F12) and check for errors |

---

## 📞 Need Help?

1. **Browser Console** - Press F12, click Console tab, look for errors
2. **Netlify Logs** - Dashboard → Logs & metrics → Functions
3. **GitHub Structure** - Make sure files are in correct folders

---

**You're ready to go! Download all 8 files and start uploading.** 🎉
