# Talentechno Backend

Production-ready backend API server for **Talentechno – IT Recruiter**, equipped with **Supabase database integration**, **Cloudflare R2 image storage**, and public inquiry/video endpoints.

---

## 🚀 Quick Access URLs

| Resource | URL / Value | Notes |
| :--- | :--- | :--- |
| **🌐 Public Website** | [http://localhost:5000/](http://localhost:5000/) | Executive recruitment portal |
| **📩 Submissions API** | `POST http://localhost:5000/api/submissions` | Handles candidate & client intake |
| **🎥 Videos API** | `GET http://localhost:5000/api/videos` | Client testimonial videos |
| **🖼️ Media Showcase API** | `GET http://localhost:5000/api/media/showcase` | R2 dynamic showcase |

---

## 🗄️ 1. Supabase Database Configuration

The backend is built with native **Supabase (PostgreSQL)** client support and an automated local resilient database fallback (`data/submissions.json`).

### Step-by-Step Supabase Setup:
1. Log into your [Supabase Dashboard](https://app.supabase.com) and create or open your project.
2. Navigate to **SQL Editor** -> Click **New Query**.
3. Copy the contents of [`supabase_schema.sql`](file:///d:/Talentechno/backend/supabase_schema.sql) and click **Run**.
4. Go to **Project Settings** -> **API**:
   * Copy your **Project URL** (`https://xyz.supabase.co`).
   * Copy your **service_role** secret key (or **anon** key).
5. Open [`d:\Talentechno\backend\.env`](file:///d:/Talentechno/backend/.env) and populate:
   ```env
   SUPABASE_URL=https://your-project.supabase.co
   SUPABASE_SERVICE_ROLE_KEY=your-service-role-secret-key
   SUPABASE_ANON_KEY=your-anon-key
   ```
6. Start the backend:
   ```powershell
   cd d:\Talentechno\backend
   node server.js
   ```

---

## ☁️ 2. Cloudflare R2 Image Storage Configuration

Cloudflare R2 provides zero-egress-fee, S3-compatible cloud object storage for logos and assets.
Populate in `backend/.env`:
```env
CLOUDFLARE_R2_ACCOUNT_ID=your-cloudflare-account-id
CLOUDFLARE_R2_ACCESS_KEY_ID=your-access-key-id
CLOUDFLARE_R2_SECRET_ACCESS_KEY=your-secret-access-key
CLOUDFLARE_R2_BUCKET_NAME=talentechno-media
```
If unconfigured, the backend automatically falls back to local storage in `assets/uploads/`.
