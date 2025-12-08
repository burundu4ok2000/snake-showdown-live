# 🚀 Quick Deploy to Render - Cheat Sheet

## Before You Start

✅ **Your SECRET_KEY** (save this!):
```
22XKeoR4teYD_HQtNTSIa4P3loKzsI0cTL_Ui8JlaedCtFE8SGTbPuM8VfbVQUR0fu_CwfQafuhigxHnfDeTOA
```

## 5-Minute Deployment

### 1. Create Database (2 min)
- Go to https://render.com
- Click **"New +"** → **"PostgreSQL"**
- Name: `snake-db`
- Plan: Starter ($7/mo)
- Click **"Create Database"**
- **Copy Internal Database URL** (save it!)

### 2. Create Web Service (3 min)
- Click **"New +"** → **"Web Service"**
- Connect repo: `burundu4ok2000/snake-showdown-live`
- Name: `snake-showdown`
- Environment: **Docker**
- Plan: Starter ($7/mo)

**Environment Variables:**
```
DATABASE_URL = <paste from step 1>
SECRET_KEY = 22XKeoR4teYD_HQtNTSIa4P3loKzsI0cTL_Ui8JlaedCtFE8SGTbPuM8VfbVQUR0fu_CwfQafuhigxHnfDeTOA
```

- Click **"Create Web Service"**

### 3. Wait & Test (5-10 min)
- Wait for "Live" status (green dot)
- Visit your URL: `https://snake-showdown.onrender.com`
- Login: `pro@snake.com` / `pass123`

## Done! 🎉

**Your URLs:**
- App: https://snake-showdown.onrender.com
- API Docs: https://snake-showdown.onrender.com/docs

## Cost: $14/month
- Web Service: $7
- Database: $7

## Auto-Deploy ✅
Every push to `main` branch auto-deploys!

## Full Guide
See `DEPLOY_RENDER.md` for detailed instructions
