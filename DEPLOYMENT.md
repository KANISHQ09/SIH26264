# Nexus 0 — Unified Deployment Guide

This guide covers deploying **Nexus 0** as a single, unified web service where the Node.js backend serves both the `/api/v1` REST endpoints and the React frontend on a **single domain/URL** with **zero CORS issues**.

---

## Option 1: Render.com (Recommended Free Hosting)

[Render](https://render.com) offers free hosting for web services with automatic builds from GitHub.

### Step 1: Push Code to GitHub
```bash
git add .
git commit -m "feat: complete Nexus 0 prototype and unified deployment configuration"
git push origin main
```

### Step 2: Deploy on Render
1. Log in to [render.com](https://dashboard.render.com/).
2. Click **New +** → **Web Service**.
3. Connect your GitHub repository (`SIH26264`).
4. Configure the settings:
   - **Name**: `nexus-0` (or your choice)
   - **Runtime**: `Node`
   - **Build Command**:
     ```bash
     npm install && npm run seed && npm run build
     ```
   - **Start Command**:
     ```bash
     npm start
     ```
   - **Plan**: `Free`
5. Click **Create Web Service**.

> **Note:** Because `render.yaml` is included in the root of the repository, Render will automatically detect these settings!
> Once the build completes (~2 minutes), Render will give you a public URL (e.g. `https://nexus-0.onrender.com`).

---

### Step 3: Prevent Render Cold Starts with UptimeRobot (100% Free 24/7 Keep-Alive)

Render's free tier spins down (sleeps) services after **15 minutes** of inactivity. When a user visits a sleeping service, it takes **50–90 seconds** to wake up.

By setting up a free monitor on [UptimeRobot](https://uptimerobot.com) to ping your `/health` endpoint every **5 minutes**, your Render service will **stay awake 24/7 with instant page loads**:

1. Create a free account at [uptimerobot.com](https://uptimerobot.com/).
2. In your UptimeRobot Dashboard, click **+ Add New Monitor**.
3. Configure the monitor:
   - **Monitor Type**: Select `HTTP(s)`
   - **Friendly Name**: `Nexus AICTE - Render Keep Alive`
   - **URL (or IP)**: `https://<YOUR-RENDER-APP-NAME>.onrender.com/health` (or `/ping`)
   - **Monitoring Interval**: `5 minutes` (or `10 minutes`)
4. Click **Create Monitor**.

That's it! UptimeRobot will ping the lightweight `/health` endpoint every 5 minutes, preventing Render from ever sleeping.

---

## Option 2: Railway.app

1. Go to [railway.app](https://railway.app/) and sign in with GitHub.
2. Click **New Project** → **Deploy from GitHub repo**.
3. Select this repository.
4. Railway will automatically detect the `Dockerfile` or `package.json`.
5. Under service settings, ensure:
   - **Build Command**: `npm install && npm run seed && npm run build`
   - **Start Command**: `npm start`
6. Click **Generate Domain** under the **Networking** tab.
7. Your app is live with SSL!

---

## Option 3: Docker / Cloud Run / Self-Hosted VPS

A production-ready `Dockerfile` is included in the project root.

### Build and Run Locally or on a VPS:
```bash
# Build Docker image
docker build -t nexus-0 .

# Run container on port 4000
docker run -d -p 4000:4000 --name nexus-0-instance nexus-0
```
Open `http://localhost:4000` to access the full application.

### Deploying to Google Cloud Run:
```bash
gcloud run deploy nexus-0 \
  --source . \
  --platform managed \
  --region asia-south1 \
  --allow-unauthenticated
```

---

## Environment Variables (Optional)

| Variable | Default | Purpose |
|---|---|---|
| `PORT` | `4000` (or injected by host) | Port the web service listens on |
| `NODE_ENV` | `production` | Enables production static asset caching |

---

## Health Check Endpoint
- Path: `/health`
- Expected Response: HTTP 200 `{ "status": "healthy", "service": "Nexus 0 - AICTE OneView API" }`
