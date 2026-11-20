# Free Deployment & CI/CD Guide — Sreshta Jewellers

Deploy the complete **Sreshta Jewellers** platform (Next.js frontend + Express backend + Supabase PostgreSQL + Supabase Storage) using **100% free tier services** with automated CI/CD:

| Component | Service | Free Tier Limits |
| :--- | :--- | :--- |
| **Database** | [Supabase](https://supabase.com) (PostgreSQL) | 500 MB database, connection pooling, automated backups |
| **Media / Images** | [Supabase Storage](https://supabase.com) | 1 GB free bucket storage, public global CDN |
| **Backend API** | [Render](https://render.com) (Web Service) | 750 free hours/month, automatic HTTPS & Git auto-deploy |
| **Frontend UI** | [Vercel](https://vercel.com) | 100 GB bandwidth, fast global edge network, native Next.js |
| **CI/CD** | GitHub Actions + Vercel / Render Git triggers | Continuous build, typecheck verification, and auto-deploy |

---

## Architecture Overview (Standalone — No ERP Required)

```
┌─────────────────────────────────┐        API Rewrites        ┌─────────────────────────────────┐
│        Vercel (Frontend)        ├───────────────────────────►│        Render (Backend)         │
│     sreshta-store.vercel.app    │                            │    sreshta-api.onrender.com     │
└────────────────┬────────────────┘                            └───────────────┬─────────────────┘
                 │                                                             │
                 │ Direct CDN Image Serving                                    │
                 ▼                                                             ▼
┌─────────────────────────────────┐                            ┌─────────────────────────────────┐
│     Supabase Storage (1 GB)     │◄───────────────────────────┤   Supabase PostgreSQL (500 MB) │
│      sreshta-assets bucket      │      Uploaded Photos       │    Products, CMS, Orders, Auth  │
└─────────────────────────────────┘                            └─────────────────────────────────┘
```

The website catalog is **100% standalone**:
- Products, pricing, purity, categories, and banners are managed directly in the Supabase database.
- New images and photos uploaded via the Admin Portal (`/upload`) go directly to **Supabase Storage**.
- No external ERP connectivity is needed.

---

## Step 1: Set Up Free Image Storage in Supabase (1 minute)

You already have the Supabase PostgreSQL database running! To store uploaded product photos and banners in Supabase Storage:

1. Go to your Supabase Dashboard: **[supabase.com/dashboard/project/tthkyojwrgqpjvpvnkwo](https://supabase.com/dashboard/project/tthkyojwrgqpjvpvnkwo)**.
2. In the left sidebar, click **Storage**.
3. Click **New Bucket**:
   - **Name:** `sreshta-assets`
   - **Public bucket:** **Toggle to ON** (checked).
   - Click **Save bucket**.
4. To get your Service Role Key (for secure backend uploads):
   - In Supabase, go to **Project Settings** (gear icon) → **API**.
   - Copy the `service_role` secret key (or the `anon` public key).

---

## Step 2: Deploy Backend to Render (Free Web Service)

1. Sign up or log in at **[dashboard.render.com](https://dashboard.render.com)**.
2. Click **New +** → **Web Service** → Connect your GitHub repo `sreshta-website`.
3. Configure the service:
   - **Name:** `sreshta-backend`
   - **Region:** `Singapore` (or region closest to your Supabase DB)
   - **Branch:** `main`
   - **Root Directory:** `backend`
   - **Runtime:** `Node`
   - **Build Command:**
     ```bash
     npm install && npm run build
     ```
   - **Start Command:**
     ```bash
     npm run db:migrate:prod && npm start
     ```
     *(This runs the database migration and starts the Express server).*
   - **Instance Type:** Select **Free**.

4. Under **Environment Variables**, add:

   | Key | Value | Description |
   | :--- | :--- | :--- |
   | `NODE_VERSION` | `20` | Supported Node LTS version |
   | `NODE_ENV` | `production` | Production mode |
   | `DATABASE_URL` | `postgresql://postgres.tthkyojwrgqpjvpvnkwo:Sreshta%40063@aws-1-ap-northeast-1.pooler.supabase.com:5432/postgres` | Your Supabase pooler connection string |
   | `SESSION_SECRET` | `sreshta-super-secret-session-key-32-chars` | Min 16-character secret |
   | `CORS_ORIGIN` | `https://your-frontend.vercel.app,http://localhost:3000` | Allowed frontend domains (update once Vercel is deployed) |
   | `PUBLIC_BASE_URL` | `https://your-frontend.vercel.app` | Storefront public URL |
   | `PUBLIC_API_BASE_URL` | `https://sreshta-backend.onrender.com` | Backend Render URL |
   | `SUPABASE_URL` | `https://tthkyojwrgqpjvpvnkwo.supabase.co` | Your Supabase project URL |
   | `SUPABASE_SERVICE_ROLE_KEY` | *(Your Supabase service_role key)* | Optional for bucket uploads |
   | `SUPABASE_STORAGE_BUCKET` | `sreshta-assets` | Supabase storage bucket name |
   | `RAZORPAY_KEY_ID` | `rzp_test_...` *(optional test key)* | Razorpay Key ID |
   | `RAZORPAY_KEY_SECRET` | `...` *(optional test secret)* | Razorpay Secret |

5. Click **Deploy Web Service**.
6. When deployment finishes, copy your live backend URL (e.g., `https://sreshta-backend.onrender.com`).
   - Smoke test: visit `https://sreshta-backend.onrender.com/health` → `{"ok":true,"service":"sreshta-backend"}`.

---

## Step 3: Deploy Frontend to Vercel (Free Next.js Hosting)

1. Sign up or log in at **[vercel.com](https://vercel.com)**.
2. Click **Add New…** → **Project** → Import your GitHub repository `sreshta-website`.
3. Configure the project:
   - **Project Name:** `sreshta-frontend`
   - **Framework Preset:** `Next.js`
   - **Root Directory:** Click **Edit** and select `frontend`.
4. Under **Environment Variables**, add:

   | Key | Value | Description |
   | :--- | :--- | :--- |
   | `BACKEND_URL` | `https://sreshta-backend.onrender.com` | **Crucial:** Your Render backend URL |
   | `NEXT_PUBLIC_BASE_URL` | `https://sreshta-frontend.vercel.app` | Your Vercel frontend URL |

5. Click **Deploy**.
6. Vercel will build and assign your live URL (e.g., `https://sreshta-frontend.vercel.app`).

---

## Step 4: Final Connection & Verification

1. **Update Backend CORS on Render:**
   - Go to Render Dashboard → `sreshta-backend` → **Environment**.
   - Update `CORS_ORIGIN` with your actual Vercel domain:
     ```text
     https://sreshta-frontend.vercel.app,http://localhost:3000
     ```
   - Update `PUBLIC_BASE_URL`:
     ```text
     https://sreshta-frontend.vercel.app
     ```
   - Render will automatically re-deploy with zero downtime.

2. **Log in to Admin Dashboard:**
   - Go to: `https://sreshta-frontend.vercel.app/account/login`
   - **Email:** `admin@sreshta.com`
   - **Password:** `admin123`
   - Navigate to `/upload` to add products, upload images, and configure banners.

---

## Step 5: Automated CI/CD (Continuous Integration & Deployment)

The repository is equipped with a complete automated CI/CD pipeline:

1. **Automated CI (GitHub Actions):**
   - Configured in [`.github/workflows/ci.yml`](../.github/workflows/ci.yml).
   - On every `git push` or `pull_request` to `main`, GitHub Actions automatically:
     - Installs dependencies
     - Compiles the backend (`npm run build:backend`)
     - Verifies frontend TypeScript types (`npx tsc --noEmit`)
   - Any broken build or type error is caught before reaching production.

2. **Automated CD (Push-to-Deploy):**
   - **Vercel:** Automatically deploys new frontend commits pushed to `main`.
   - **Render:** Automatically deploys new backend commits pushed to `main`.
