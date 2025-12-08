# Cloud Deployment Options

Complete guide for deploying Snake Showdown Live to various cloud platforms.

## 🎯 Quick Comparison

| Platform | Difficulty | Cost (est/month) | Best For | Database Included |
|----------|-----------|------------------|----------|-------------------|
| **Railway** | ⭐ Easy | $5-20 | Quick start, indie | ✅ PostgreSQL |
| **Render** | ⭐ Easy | $7-25 | Side projects | ✅ PostgreSQL |
| **Fly.io** | ⭐⭐ Medium | $5-15 | Edge deployment | ❌ Need separate |
| **DigitalOcean** | ⭐⭐ Medium | $12-30 | Full control | ✅ Managed DB |
| **Google Cloud Run** | ⭐⭐ Medium | Pay-as-go (~$10) | Serverless, scale | ❌ Need Cloud SQL |
| **AWS ECS** | ⭐⭐⭐ Hard | $20-50 | Enterprise | ❌ Need RDS |
| **Heroku** | ⭐ Easy | $13-25 | Classic PaaS | ✅ PostgreSQL |
| **Azure** | ⭐⭐⭐ Hard | $25-60 | Microsoft stack | ❌ Need Azure DB |

---

## 1. Railway (Recommended for Beginners) ⭐

**Why Railway:**
- ✅ Easiest deployment
- ✅ Free tier available
- ✅ Automatic PostgreSQL provisioning
- ✅ One-click deploy from GitHub
- ✅ Automatic HTTPS
- ✅ Built-in monitoring

**Cost:** $5-20/month (Free tier: $5 credit/month)

### Deployment Steps:

1. **Sign up at [railway.app](https://railway.app)**

2. **Create New Project → Deploy from GitHub**
   - Connect your GitHub account
   - Select `burundu4ok2000/snake-showdown-live`

3. **Add PostgreSQL Database**
   - Click "New" → "Database" → "PostgreSQL"
   - Railway automatically creates `DATABASE_URL`

4. **Configure Environment Variables**
   ```
   SECRET_KEY=<generate-random-key>
   DATABASE_URL=${{Postgres.DATABASE_URL}}
   PORT=80
   ```

5. **Deploy**
   - Railway auto-detects Dockerfile
   - Builds and deploys automatically
   - Gets custom URL: `your-app.railway.app`

**Custom Domain:**
```
Settings → Domains → Add Custom Domain → your-domain.com
```

**Dockerfile for Railway** (use root Dockerfile):
```bash
# Railway automatically uses ./Dockerfile
```

---

## 2. Render (Great for Simplicity) ⭐

**Why Render:**
- ✅ Very simple setup
- ✅ Free tier available
- ✅ Managed PostgreSQL
- ✅ Auto-deploy from Git
- ✅ Free SSL

**Cost:** $7-25/month (Free tier available)

### Deployment Steps:

1. **Sign up at [render.com](https://render.com)**

2. **Create PostgreSQL Database**
   - New → PostgreSQL
   - Name: `snake-db`
   - Plan: Free or Starter ($7/mo)
   - Copy Internal Database URL

3. **Create Web Service**
   - New → Web Service
   - Connect GitHub repo
   - Name: `snake-showdown`
   - Environment: Docker
   - Plan: Starter ($7/mo)

4. **Environment Variables**
   ```
   DATABASE_URL=<from-step-2>
   SECRET_KEY=<random-key>
   ```

5. **Deploy**
   - Render auto-builds from Dockerfile
   - URL: `https://snake-showdown.onrender.com`

**render.yaml** (optional automation):
```yaml
services:
  - type: web
    name: snake-showdown
    env: docker
    dockerfilePath: ./Dockerfile
    envVars:
      - key: DATABASE_URL
        fromDatabase:
          name: snake-db
          property: connectionString
      - key: SECRET_KEY
        generateValue: true

databases:
  - name: snake-db
    databaseName: snake_showdown
    plan: starter
```

---

## 3. Fly.io (Edge/Global Deployment) ⭐⭐

**Why Fly.io:**
- ✅ Global edge deployment
- ✅ Very fast
- ✅ Free tier (3 VMs)
- ✅ Great for performance
- ❌ Database not included (use external)

**Cost:** $5-15/month (Free tier: 3 shared VMs)

### Deployment Steps:

1. **Install Fly CLI**
   ```bash
   curl -L https://fly.io/install.sh | sh
   ```

2. **Login**
   ```bash
   fly auth login
   ```

3. **Initialize App**
   ```bash
   cd /workspaces/snake-showdown-live
   fly launch
   # Choose app name
   # Region: closest to users
   # PostgreSQL: Yes
   ```

4. **Configure fly.toml**
   ```toml
   app = "snake-showdown"
   primary_region = "sjc"

   [build]
     dockerfile = "Dockerfile"

   [env]
     PORT = "80"

   [[services]]
     internal_port = 80
     protocol = "tcp"

     [[services.ports]]
       port = 80
       handlers = ["http"]

     [[services.ports]]
       port = 443
       handlers = ["tls", "http"]

   [http_service]
     internal_port = 80
     force_https = true
   ```

5. **Set Secrets**
   ```bash
   fly secrets set SECRET_KEY="your-secret-key"
   fly secrets set DATABASE_URL="<postgres-url>"
   ```

6. **Deploy**
   ```bash
   fly deploy
   ```

7. **Open App**
   ```bash
   fly open
   ```

**Database Options:**
- Use Fly's managed Postgres: `fly postgres create`
- Or use external: Railway, Supabase, Neon

---

## 4. DigitalOcean App Platform ⭐⭐

**Why DigitalOcean:**
- ✅ Simple, reliable
- ✅ Managed PostgreSQL
- ✅ Good documentation
- ✅ Predictable pricing
- ✅ Full control

**Cost:** $12-30/month

### Deployment Steps:

1. **Sign up at [digitalocean.com](https://digitalocean.com)**

2. **Create App**
   - Apps → Create App
   - Source: GitHub
   - Select repo: `snake-showdown-live`

3. **Configure Build**
   - Type: Docker
   - Dockerfile Path: `Dockerfile`
   - HTTP Port: 80

4. **Add Database**
   - Add Resource → Database
   - Engine: PostgreSQL
   - Plan: Basic ($15/mo)

5. **Environment Variables**
   ```
   DATABASE_URL=${db.DATABASE_URL}
   SECRET_KEY=<random-key>
   ```

6. **Deploy**
   - Review and Create
   - URL: `https://your-app.ondigitalocean.app`

**doctl CLI (Optional):**
```bash
# Install doctl
snap install doctl

# Auth
doctl auth init

# Deploy
doctl apps create --spec .do/app.yaml
```

**.do/app.yaml:**
```yaml
name: snake-showdown
region: nyc
services:
  - name: web
    dockerfile_path: Dockerfile
    github:
      repo: burundu4ok2000/snake-showdown-live
      branch: main
    http_port: 80
    instance_count: 1
    instance_size_slug: basic-xxs
    envs:
      - key: DATABASE_URL
        scope: RUN_TIME
        value: ${db.DATABASE_URL}

databases:
  - name: db
    engine: PG
    production: false
    version: "16"
```

---

## 5. Google Cloud Run (Serverless) ⭐⭐

**Why Cloud Run:**
- ✅ Pay only for usage
- ✅ Auto-scaling (0 to ∞)
- ✅ Very cheap for low traffic
- ✅ Google infrastructure
- ❌ Complex setup

**Cost:** Pay-as-you-go (~$5-15/month for moderate traffic)

### Deployment Steps:

1. **Install gcloud CLI**
   ```bash
   curl https://sdk.cloud.google.com | bash
   gcloud init
   ```

2. **Create Project**
   ```bash
   gcloud projects create snake-showdown --name="Snake Showdown"
   gcloud config set project snake-showdown
   ```

3. **Enable APIs**
   ```bash
   gcloud services enable run.googleapis.com
   gcloud services enable sql-component.googleapis.com
   gcloud services enable sqladmin.googleapis.com
   ```

4. **Build and Push Container**
   ```bash
   # Build
   docker build -t gcr.io/snake-showdown/app:latest .
   
   # Configure Docker for GCR
   gcloud auth configure-docker
   
   # Push
   docker push gcr.io/snake-showdown/app:latest
   ```

5. **Create Cloud SQL Database**
   ```bash
   gcloud sql instances create snake-db \
     --database-version=POSTGRES_16 \
     --tier=db-f1-micro \
     --region=us-central1
   
   gcloud sql databases create snake_showdown --instance=snake-db
   gcloud sql users create snake_user --instance=snake-db --password=<password>
   ```

6. **Deploy to Cloud Run**
   ```bash
   gcloud run deploy snake-showdown \
     --image gcr.io/snake-showdown/app:latest \
     --platform managed \
     --region us-central1 \
     --allow-unauthenticated \
     --add-cloudsql-instances snake-showdown:us-central1:snake-db \
     --set-env-vars DATABASE_URL="postgresql://snake_user:<password>@/snake_showdown?host=/cloudsql/snake-showdown:us-central1:snake-db" \
     --set-env-vars SECRET_KEY="<random-key>"
   ```

7. **Get URL**
   ```bash
   gcloud run services describe snake-showdown --region us-central1 --format 'value(status.url)'
   ```

---

## 6. AWS ECS (Enterprise) ⭐⭐⭐

**Why AWS:**
- ✅ Most powerful
- ✅ Enterprise-grade
- ✅ Full control
- ❌ Complex
- ❌ Expensive

**Cost:** $20-50/month minimum

### Quick Steps:

1. **ECR (Container Registry)**
   ```bash
   aws ecr create-repository --repository-name snake-showdown
   docker tag snake-showdown:latest <account-id>.dkr.ecr.us-east-1.amazonaws.com/snake-showdown:latest
   docker push <account-id>.dkr.ecr.us-east-1.amazonaws.com/snake-showdown:latest
   ```

2. **RDS (Database)**
   - Create PostgreSQL RDS instance
   - Security group: Allow from ECS
   - Copy endpoint URL

3. **ECS Cluster**
   - Create Fargate cluster
   - Task definition with your container
   - Service with load balancer

**Easier:** Use AWS Copilot CLI:
```bash
copilot init
copilot deploy
```

---

## 7. Heroku (Classic) ⭐

**Why Heroku:**
- ✅ Very simple
- ✅ Well-documented
- ✅ Free PostgreSQL
- ❌ Expensive for production
- ❌ Sleeps on free tier

**Cost:** $13-25/month (No free tier anymore)

### Deployment Steps:

1. **Install Heroku CLI**
   ```bash
   curl https://cli-assets.heroku.com/install.sh | sh
   heroku login
   ```

2. **Create App**
   ```bash
   cd /workspaces/snake-showdown-live
   heroku create snake-showdown-live
   ```

3. **Add PostgreSQL**
   ```bash
   heroku addons:create heroku-postgresql:mini
   ```

4. **Set Config**
   ```bash
   heroku config:set SECRET_KEY="<random-key>"
   ```

5. **Deploy with Docker**
   ```bash
   heroku stack:set container
   git push heroku main
   ```

6. **Open**
   ```bash
   heroku open
   ```

---

## 🎯 My Recommendations

### For You (Quick Start):
**🥇 Railway** - Easiest, fastest, great for MVP
```bash
1. Go to railway.app
2. Connect GitHub
3. Add PostgreSQL
4. Deploy
5. Done in 5 minutes!
```

### For Production (Budget):
**🥈 Render** - Simple, affordable, reliable
- Free PostgreSQL included
- Auto-deploy from Git
- Good performance

### For Performance (Global):
**🥉 Fly.io** - Fast edge network
- Deploy close to users
- Low latency
- Great free tier

### For Enterprise:
**Google Cloud Run** or **AWS ECS**
- Unlimited scaling
- Enterprise support
- Most features

---

## 📝 Preparation Steps (For Any Platform)

### 1. Generate Strong Secret Key
```bash
python3 -c "import secrets; print(secrets.token_urlsafe(64))"
```

### 2. Update Environment Variables
Create `.env.production`:
```env
SECRET_KEY=<generated-above>
DATABASE_URL=<from-cloud-provider>
```

### 3. Test Build Locally
```bash
docker build -t snake-showdown:latest .
docker run -p 80:80 snake-showdown:latest
```

### 4. Configure Custom Domain (Optional)
Most platforms support custom domains:
- Add CNAME: `app.yourdomain.com` → `platform-url`
- Add A record for apex (@)

---

## 🚀 Quick Start: Deploy to Railway (NOW!)

**Fastest way to get live:**

1. **Go to** https://railway.app
2. **Sign in** with GitHub
3. **New Project** → Deploy from GitHub Repo
4. **Select** `burundu4ok2000/snake-showdown-live`
5. **Add** PostgreSQL database
6. **Add Env Var**: `SECRET_KEY` = (generate random)
7. **Deploy** ✅

**Live in ~5 minutes!** 🎉

---

## 💰 Cost Breakdown (Monthly Est.)

| Platform | Compute | Database | Total |
|----------|---------|----------|-------|
| Railway | $5 | Included | **$5-15** |
| Render | $7 | $7 | **$14** |
| Fly.io | Free-$5 | $10 | **$10-15** |
| DigitalOcean | $12 | $15 | **$27** |
| Cloud Run | $5-10 | $9 | **$14-19** |
| AWS | $15 | $20 | **$35+** |
| Heroku | $7 | $9 | **$16** |

**Recommendation: Start with Railway ($5-15/mo), scale to DigitalOcean/Cloud Run later.**

---

## 🎓 Need Help?

Choose your platform and I'll help you deploy step-by-step!

Just say:
- "Deploy to Railway"
- "Deploy to Render"
- "Deploy to Fly.io"
- etc.
