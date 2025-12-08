# Deploy to Render - Step by Step Guide

## 🎯 What You'll Get

- **Web App**: https://your-app.onrender.com
- **PostgreSQL Database**: Managed by Render
- **Free SSL**: Automatic HTTPS
- **Auto-deploy**: Push to GitHub → Auto deploys

**Cost**: Free (Hobby) or $14/month (Starter)

---

## 📋 Prerequisites

- ✅ GitHub account
- ✅ Code pushed to GitHub (already done ✅)
- ✅ **No credit card required** for Free plan!

---

## 🚀 Deployment Steps

### Step 1: Sign Up for Render

1. Go to **https://render.com**
2. Click **"Get Started"**
3. Sign up with **GitHub**
4. Authorize Render to access your repositories

---

### Step 2: Create PostgreSQL Database

1. **Click "New +"** → **"PostgreSQL"**

2. **Configure Database:**
   ```
   Name: snake-db
   Database: snake_showdown
   User: snake_user
   Region: Oregon (or closest to you)
   PostgreSQL Version: 16
   ```

3. **Choose Plan:**
   - **Starter**: $7/month (recommended)
   - Instance Type: Starter

4. **Click "Create Database"**

5. **Wait 2-3 minutes** for database to provision

6. **Copy Connection Details:**
   - Click on your database
   - Find "Connections" section
   - **Copy "Internal Database URL"** (starts with `postgresql://`)
   - Save it somewhere safe!

---

### Step 3: Create Web Service

1. **Click "New +"** → **"Web Service"**

2. **Connect Repository:**
   - Click **"Connect a repository"**
   - Find `burundu4ok2000/snake-showdown-live`
   - Click **"Connect"**

3. **Configure Service:**
   ```
   Name: snake-showdown
   Region: Oregon (same as database!)
   Branch: main
   Root Directory: (leave blank)
   Environment: Docker
   ```

4. **Choose Plan:**
   - **Starter**: $7/month
   - Instance Type: Starter (512 MB RAM, 0.5 CPU)

5. **Advanced Settings** (scroll down):

   **Build Command:**
   ```
   (leave blank - uses Dockerfile)
   ```

   **Start Command:**
   ```
   (leave blank - uses Dockerfile ENTRYPOINT)
   ```

---

### Step 4: Set Environment Variables

**CRITICAL: Set these before first deploy!**

In the "Environment Variables" section, add:

1. **DATABASE_URL**
   ```
   Value: <paste Internal Database URL from Step 2>
   ```
   Example: `postgresql://snake_user:password@dpg-xxxxx-a/snake_showdown`

2. **SECRET_KEY**
   ```
   Value: <generate random key - see below>
   ```

**Generate SECRET_KEY:**

Run this in your terminal:
```bash
python3 -c "import secrets; print(secrets.token_urlsafe(64))"
```

Copy the output and paste as SECRET_KEY.

Example output:
```
xK8mN3pQ7rS5tU1vW9yZ2aB4cD6eF8gH0iJ2kL4mN6oP8qR0sT2uV4wX6yZ8aB0cD2eF4gH6iJ8
```

---

### Step 5: Deploy!

1. **Click "Create Web Service"**

2. **Watch the build:**
   - Render will:
     - Clone your repo
     - Build Docker image (takes 5-10 minutes first time)
     - Start the container
     - Run database migrations
     - Seed database

3. **Monitor Logs:**
   - Click on "Logs" tab
   - You should see:
     ```
     🚀 Starting Snake Showdown Live...
     ⏳ Waiting for database...
     ✅ Database is ready!
     📊 Running database migrations...
     🌱 Seeding database...
     ✅ Setup complete!
     ```

4. **Wait for "Live" status** (green dot)

---

### Step 6: Access Your App

1. **Get Your URL:**
   - Top of page shows: `https://snake-showdown.onrender.com`
   - Click it!

2. **Test Login:**
   - Email: `pro@snake.com`
   - Password: `pass123`

3. **Check API Docs:**
   - Visit: `https://snake-showdown.onrender.com/docs`

---

## ✅ You're Live!

**Your app is now deployed!** 🎉

URLs:
- **App**: https://snake-showdown.onrender.com
- **API**: https://snake-showdown.onrender.com/api/...
- **Docs**: https://snake-showdown.onrender.com/docs

---

## 🎨 Custom Domain (Optional)

### Add Your Own Domain

1. **In Render Dashboard:**
   - Go to your web service
   - Click **"Settings"**
   - Scroll to **"Custom Domain"**

2. **Add Domain:**
   - Click **"Add Custom Domain"**
   - Enter: `yourdomain.com` or `app.yourdomain.com`

3. **Update DNS:**
   - **For subdomain** (app.yourdomain.com):
     ```
     Type: CNAME
     Name: app
     Value: snake-showdown.onrender.com
     ```
   
   - **For apex domain** (yourdomain.com):
     ```
     Type: A
     Name: @
     Value: 216.24.57.1 (Render's IP)
     ```

4. **Wait for SSL:**
   - Render auto-generates SSL certificate (takes 1-2 minutes)
   - Your domain will have HTTPS! 🔒

---

## 🔧 Common Issues & Solutions

### Issue: Build Failed

**Check:**
1. Go to "Logs" tab
2. Look for red errors
3. Common causes:
   - Missing environment variables
   - Docker build error

**Solution:**
- Make sure DATABASE_URL and SECRET_KEY are set
- Check that Dockerfile exists in root

---

### Issue: Database Connection Failed

**Error:** `could not connect to server`

**Solution:**
1. Check DATABASE_URL is correct
2. Make sure database and web service are in **same region**
3. Use **Internal Database URL** (not External)

---

### Issue: App is Slow to Start

**Cause:** Free tier takes 30-60 seconds to wake up after inactivity

**Solution:**
- Upgrade to Starter plan ($7/mo)
- Or accept the wake-up time for free tier

---

### Issue: Need to Reset Database

**Steps:**
1. Go to your database in Render
2. Click **"Settings"**
3. Scroll to **"Danger Zone"**
4. Click **"Reset Database"**
5. Confirm
6. Redeploy web service (it will re-seed)

---

## 🔄 Auto-Deploy Setup

**Already Configured!** ✅

Every time you push to `main` branch:
1. Render detects the push
2. Automatically builds new Docker image
3. Deploys updated app
4. Zero downtime!

**To deploy manually:**
- Go to your service
- Click **"Manual Deploy"** → **"Deploy latest commit"**

---

## 📊 Monitoring & Logs

### View Logs
```
Dashboard → Your Service → Logs
```

Real-time logs show:
- HTTP requests
- Backend errors
- Database queries
- Performance metrics

### Metrics
```
Dashboard → Your Service → Metrics
```

Shows:
- CPU usage
- Memory usage
- Response times
- Request count

---

## 💰 Billing

**Current Cost:**
- Web Service: $7/month
- Database: $7/month
- **Total: $14/month**

**Free Tier Alternative:**
- Web Service: Free (with limitations)
- Database: Free (90 days, then $7/month)

**Upgrade:**
- Standard: $25/month (faster, more RAM)
- Pro: $85/month (even faster)

---

## 🎓 Next Steps

1. **✅ Test your app thoroughly**
2. **🎨 Add custom domain** (optional)
3. **📊 Set up monitoring** (Render provides this)
4. **🔐 Review security settings**
5. **💾 Set up database backups** (automatic on paid plans)
6. **📧 Configure email notifications** (deploy notifications)

---

## 🆘 Need Help?

**Render Support:**
- Help: https://render.com/docs
- Community: https://community.render.com
- Status: https://status.render.com

**Your App Issues:**
- Check logs in Render dashboard
- Look at database connection
- Verify environment variables

---

## 🎉 Congratulations!

Your Snake Showdown Live app is now:
- ✅ Deployed to production
- ✅ Running on Render's infrastructure
- ✅ Using managed PostgreSQL
- ✅ Auto-deploying from GitHub
- ✅ Secured with HTTPS
- ✅ Monitored 24/7

**Share your app:** `https://snake-showdown.onrender.com`

Enjoy! 🐍🎮
