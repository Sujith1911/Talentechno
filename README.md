# Talentechno

> **Premier IT Recruitment & Technical Workforce Architecture Platform**  
> Based in Hyderabad, India &bull; Executive Luxury Light Theme &bull; Real-Time Lead Architecture

---

## 🌟 Executive Overview

**Talentechno** is a specialized IT recruitment consultancy connecting fast-growing enterprises with the top 1% of technology talent. This repository houses the complete full-stack web platform for Talentechno, engineered with:

* **Executive Luxury Light Design System:** Alabaster white, champagne silk, liquid-gloss 3D gold buttons, and gold-foil embossed badges.
* **YouTube Video Review Engine:** Client testimonials showcase with responsive video modal player.
* **Dual-Layer Cloud Architecture:** Direct integration with **Supabase** (PostgreSQL) and **Cloudflare R2** (S3-compatible object vault), featuring automatic resilient fallback to local JSON storage.
* **Responsive Multi-Page Experience:** Clean, structured pages for Home (`index.html`), About Us (`about.html`), Solutions Hub (`services.html`), and Contact (`contact.html`).

---

## 📁 Repository Structure

```
Talentechno/
├── about.html                 # About Us (Pillars, Mission, Hyderabad HQ)
├── contact.html               # Contact Portal & Live Consultation Form
├── index.html                 # Landing Page with Hero & Placement Stream
├── services.html              # 4 Core Pillars & 6-Step Recruitment Lifecycle
├── robots.txt                 # Search Engine Directives
├── .gitignore                 # Excludes node_modules, .env, and logs
│
├── backend/
│   ├── config.json            # Server Configuration
│   ├── package.json           # Express, CORS, AWS S3 Client
│   ├── server.js              # Node.js Express Server (Port 5000)
│   ├── supabase_schema.sql    # PostgreSQL SQL Schema
│   └── services/
│       ├── cloudflareR2Client.js # Cloudflare R2 / S3 Object Storage
│       ├── supabaseClient.js  # Supabase Client & Resilient Local Fallback
│       └── videoManager.js    # YouTube Video Reviews Manager
│
├── css/
│   └── luxury-light.css       # Design System (Alabaster, Gold, Liquid Buttons)
│
├── data/
│   ├── submissions.json       # Local Resilient Submissions Store
│   └── videos.json            # Testimonial Videos Store
│
├── docs/                      # Comprehensive Architecture & Audit Reports
│   ├── 01-company-overview.md
│   ├── 02-services-and-solutions.md
│   ├── 03-site-architecture-and-pages.md
│   ├── 04-contact-forms-and-leads.md
│   ├── 05-client-testimonials-and-faq.md
│   ├── 06-technical-stack-and-infrastructure.md
│   ├── 07-observations-and-audit-issues.md
│   └── README.md
│
└── js/
    ├── frontend-app.js        # Video Modal, Dynamic R2, Form Submissions
    └── main.js                # Helper Utilities
```

---

## 🛠️ Quick Start Guide

### 1. Prerequisites
- **Node.js** v18+ and **npm**

### 2. Installation
```bash
# Clone the repository
git clone https://github.com/Sujith1911/Talentechno.git
cd Talentechno

# Install backend dependencies
cd backend
npm install
```

### 3. Environment Configuration
Copy the example environment configuration:
```bash
cp .env.example .env
```
Configure your credentials in `backend/.env` (Supabase, Cloudflare R2, or run seamlessly with the built-in resilient local storage fallbacks).

### 4. Launch Application
```bash
# Start backend server
node server.js
```
The application will launch on `http://localhost:5000`:
- **Public Portal:** `http://localhost:5000`
- **About Us:** `http://localhost:5000/about`
- **Services:** `http://localhost:5000/services`
- **Contact:** `http://localhost:5000/contact`

---

## 📄 License & Credits

Designed and maintained for **Talentechno** &bull; Hyderabad, India.  
Copyright &copy; 2026 Talentechno. All rights reserved.
