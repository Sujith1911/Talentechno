# Talentechno

> **Premier IT Recruitment & Technical Workforce Architecture Platform**  
> Based in Hyderabad, India &bull; Executive Luxury Light Theme &bull; Real-Time Admin Core &bull; Live 3D Career Decision Coin

---

## 🌟 Executive Overview

**Talentechno** is a specialized IT recruitment consultancy connecting fast-growing enterprises with the top 1% of technology talent. This repository houses the complete full-stack web platform for Talentechno, engineered with:

* **Executive Luxury Light Design System:** Alabaster white, champagne silk, liquid-gloss 3D gold buttons, and gold-foil embossed badges.
* **Live 3D Career Decision Coin:** Interactive Three.js WebGL cylinder featuring gyroscopic mouse tilt, click-to-flip physics, 4 selectable career tracks, dynamic morphing dossier, and scroll-linked multi-axis rotation.
* **Secure Admin Command Core (`/_tg_gate_7a92b`):** Protected dashboard with live Server-Sent Events (SSE) inquiry stream, audio chime notifications, status management, notes, and metrics.
* **Anti-Gobuster & Anti-Scanner Defense:** Active tarpit honeypot that catches automated dictionary brute-forcers, delays them with intentional latency, logs attacker IPs, and returns decoy 404s.
* **YouTube Video Review Engine:** Client testimonials carousel with video pop-up player and full CRUD management.
* **Dual-Layer Cloud Architecture:** Direct integration with **Supabase** (PostgreSQL) and **Cloudflare R2** (S3-compatible object vault), featuring automatic resilient fallback to local JSON storage.

---

## 🚀 Key Features

### 1. 🪙 Live 3D Career Decision Coin & Path Navigator
- Real-time 3D metallic coin modeled in Three.js with realistic PBR lighting, bump-mapped relief, and milled edge ridges.
- **Face A (Heads):** Talentechno 3D crest with laurel wreath, guilloche radial sunburst, and beaded rim studs.
- **Face B (Tails):** 8-point Career Destiny Compass Rose with *"CHOOSE RIGHT CAREER PATH • HYDERABAD • 2026"*.
- **Interactive Controls:** Mouse parallax tilt, click-to-flip physics, and dynamic morphing connecting directly to the consultation intake form.
- **4 Career Tracks:**
  1. ☁️ *Cloud & Distributed Architecture* (Go, Rust, AWS, Kubernetes, Terraform)
  2. 🤖 *AI, LLMs & Data Intelligence* (PyTorch, LangChain, vLLM, Vector DBs)
  3. ⚡ *Full-Stack & High-Scale Systems* (Next.js, TypeScript, Node.js, PostgreSQL)
  4. 🛡️ *Cybersecurity & DevSecOps* (Zero-Trust, RBAC, SIEM, Vault)

### 2. 🛡️ Enterprise Security & Scanner Shield
- **Obfuscated Admin Gate:** Secret admin route (`/_tg_gate_7a92b`) isolated from standard scanner wordlists.
- **Anti-Gobuster Tarpit:** Known probe paths (`/admin`, `/wp-admin`, `/administrator`, etc.) are intercepted by `scannerShield.js`, subject to an artificial tarpit delay (1.2–1.5s), logged to `scanner_probes.json`, and served a clean decoy response.
- **Zero-Trust Auth:** Separate administrative email authentication (`security.admin@talentechno.com`) with 6-digit OTP verification and master security token.

### 3. ⚡ Real-Time Contact & Inquiry Management
- Public forms across Home, About, Services, and Contact broadcast new inquiries via SSE (`/api/realtime/stream`) with zero page refreshes.
- Admin dashboard receives real-time desktop notifications and audio chimes.

---

## 📁 Repository Structure

```
Talentechno/
├── about.html                 # About Us (Pillars, Mission, Hyderabad HQ)
├── contact.html               # Contact Portal & Live Consultation Form
├── index.html                 # Landing Page with Hero & 3D Decision Coin
├── services.html              # 4 Core Pillars & 6-Step Recruitment Lifecycle
├── robots.txt                 # Search Engine Directives & Honeypot Traps
├── .gitignore                 # Excludes node_modules, .env, and logs
│
├── admin-ui/
│   └── index.html             # Command Core Cockpit (4 Tabs, Real-Time SSE)
│
├── backend/
│   ├── config.json            # Server Configuration
│   ├── package.json           # Express, JWT, CORS, AWS S3 Client
│   ├── server.js              # Node.js Server (Port 5000)
│   ├── supabase_schema.sql    # PostgreSQL SQL Schema & RLS Policies
│   ├── middleware/
│   │   └── scannerShield.js   # Anti-Gobuster Tarpit & Honeypot
│   ├── services/
│   │   ├── adminAuth.js       # Admin Mail & OTP Session Manager
│   │   ├── cloudflareR2Client.js # Cloudflare R2 / S3 Object Storage
│   │   ├── supabaseClient.js  # Supabase Client & Local Fallback
│   │   └── videoManager.js    # YouTube Video Reviews CRUD
│   └── tests/
│       └── verify_admin_crud.py # 13-Point Automated Verification Suite
│
├── css/
│   └── luxury-light.css       # Design System (Alabaster, Gold, Liquid Buttons)
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
    ├── career-coin.js         # Three.js 3D Decision Coin Controller
    ├── frontend-app.js        # Video Modal, Dynamic R2, Form Submissions
    ├── main.js                # Legacy Controller Support
    └── three.min.js           # Local Three.js Engine Bundle
```

---

## 🛠️ Quick Start Guide

### 1. Prerequisites
- **Node.js** v18+ and **npm**
- **Python** 3.8+ (for verification tests)

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
- **3D Decision Coin:** `http://localhost:5000/#career-coin-section`
- **Admin Command Core:** `http://localhost:5000/_tg_gate_7a92b`

### 5. Automated Verification Test Suite
Run the 13-point end-to-end verification suite:
```bash
python backend/tests/verify_admin_crud.py
```

---

## 🔒 Security & Admin Access

* **Secret Admin Gateway:** `/_tg_gate_7a92b`
* **Default Admin Email:** `security.admin@talentechno.com`
* **Decoy Scanner Routes:** `/admin`, `/wp-admin`, `/administrator` (Protected by Tarpit Delay)

---

## 📄 License & Credits

Designed and maintained for **Talentechno** &bull; Hyderabad, India.  
Copyright &copy; 2026 Talentechno. All rights reserved.
