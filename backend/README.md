# Talentechno Backend & Command Core Admin Portal

Production-ready backend and real-time administrative command panel for **Talentechno – IT Recruiter**, equipped with **Supabase database integration**, **Cloudflare R2 image storage**, **separate admin email authentication**, and **anti-scanner / anti-Gobuster honeypot shields**.

---

## 🚀 Quick Access URLs & Credentials

| Resource | URL / Value | Notes |
| :--- | :--- | :--- |
| **🌐 Public Website** | [http://localhost:5000/](http://localhost:5000/) | 3D Scroll-effect recruitment portal |
| **🔒 Secret Admin Gate** | [http://localhost:5000/_tg_gate_7a92b](http://localhost:5000/_tg_gate_7a92b) | Obfuscated route hidden from scanner wordlists |
| **🔑 Separate Admin Mail**| `security.admin@talentechno.com` | Dedicated private email authentication |
| **🔐 Master Passphrase** | `TalentechnoSecure2026!` | Configurable in `.env` |
| **🛡️ Scanner Decoy Traps**| `/admin`, `/wp-admin`, `/login`, `/cpanel` | 1.5s tarpit delay + decoy 404 response |

---

## 🗄️ 1. Supabase Database Configuration

The backend is built with native **Supabase (PostgreSQL)** client support and an automated local resilient database fallback (`data/submissions.json`).

### Step-by-Step Supabase Setup:
1. Log into your [Supabase Dashboard](https://app.supabase.com) and create or open your project.
2. Navigate to **SQL Editor** -> Click **New Query**.
3. Copy the entire contents of [`supabase_schema.sql`](file:///d:/Talentechno/backend/supabase_schema.sql) and click **Run**.
   * Creates the `contact_submissions` table.
   * Configures automatic `updated_at` triggers and performance indexes.
   * Enables Row Level Security (RLS) and adds the table to the `supabase_realtime` publication.
4. Go to **Project Settings** -> **API**:
   * Copy your **Project URL** (`https://xyz.supabase.co`).
   * Copy your **service_role** secret key (or **anon** key).
5. Open [`d:\Talentechno\backend\.env`](file:///d:/Talentechno/backend/.env) and populate:
   ```env
   SUPABASE_URL=https://your-project.supabase.co
   SUPABASE_SERVICE_ROLE_KEY=your-service-role-secret-key
   SUPABASE_ANON_KEY=your-anon-key
   ```
6. Restart the backend:
   ```powershell
   cd d:\Talentechno\backend
   node server.js
   ```

---

## ☁️ 2. Cloudflare R2 Image Storage Configuration

Cloudflare R2 provides zero-egress-fee, S3-compatible cloud object storage for logos, candidate resumes, and assets.

### Step-by-Step Cloudflare R2 Setup:
1. Log into the [Cloudflare Dashboard](https://dash.cloudflare.com/) -> Click **R2** in the left sidebar.
2. Click **Create Bucket** -> Name it `talentechno-media` (or your preferred name).
3. Under Bucket Settings -> **Public Access**, click **Allow Access** or connect a Custom Domain (e.g. `assets.talentechno.com`).
4. Click **Manage R2 API Tokens** -> **Create API Token**:
   * Permission: **Admin Read & Write**.
   * Copy the **Access Key ID**, **Secret Access Key**, and your **Account ID**.
5. In [`d:\Talentechno\backend\.env`](file:///d:/Talentechno/backend/.env), set:
   ```env
   CLOUDFLARE_R2_ACCOUNT_ID=your-cloudflare-account-id
   CLOUDFLARE_R2_ACCESS_KEY_ID=your-access-key-id
   CLOUDFLARE_R2_SECRET_ACCESS_KEY=your-secret-access-key
   CLOUDFLARE_R2_BUCKET_NAME=talentechno-media
   CLOUDFLARE_R2_PUBLIC_DOMAIN=https://pub-xxxxxx.r2.dev
   ```
*Note: In local development, if R2 keys are left blank, the admin panel automatically uses local media storage in `d:\Talentechno\assets\uploads`, so you can immediately upload and manage images without cloud setup.*

---

## 🛡️ 3. Anti-Gobuster & Anti-Scanner Defense Architecture

Attackers and automated reconnaissance tools (such as **Gobuster**, **Dirbuster**, **ffuf**, **Feroxbuster**, or **Nikto**) scan websites using dictionaries looking for `/admin`, `/wp-admin`, `/login`, etc.

### How Talentechno Thwarts Scanners:
1. **Zero-Discovery Obfuscated Route:** The admin panel is mounted at an unguessable endpoint: `/_tg_gate_7a92b` (customizable in `.env`).
2. **Decoy Honeypots & Tarpit Throttling:** Requests probing common admin paths are hit with an artificial **1.5-second tarpit delay** and served a standard, generic 404 response claiming to be an unconfigured Apache/Nginx server. This exhausts scanner connection pools and slows dictionary attacks to a crawl.
3. **Real-Time Security Radar:** Probes are logged with timestamp, client IP, target path, and User-Agent, and streamed live to the admin panel's **Anti-Gobuster Radar** tab.
4. **Header Cloaking:** The `X-Powered-By: Express` header is stripped and disguised as standard static infrastructure.

---

## ⚡ 4. Real-Time Lead Reception & CRUD Actions

1. **Real-Time Updates via Server-Sent Events (SSE):**
   * When any user fills out the contact form or modal on the website, `POST /api/submissions` triggers a real-time event.
   * Connected admin dashboards immediately play an audio chime, flash a visual pulse, and insert the new lead row at the top of the table without refreshing!
2. **CRUD Capabilities:**
   * **Create:** Inquiries can arrive from website forms or be created manually by recruiters.
   * **Read:** Searchable by name, email, role, phone; filterable by status (`New`, `In Review`, `Contacted`, `Converted`, `Archived`).
   * **Update:** Recruiter assignment, status transitions, and private notes.
   * **Delete:** Permanent removal with confirmation.
   * **Export:** One-click CSV export of all inquiries.
3. **Cloudflare R2 Media Gallery:**
   * Drag-and-drop file uploader.
   * One-click copying of public CDN links for marketing or candidates.
   * Delete assets directly from the bucket.
