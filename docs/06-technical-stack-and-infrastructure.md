# Technical Stack & Web Infrastructure

## 1. Core Technology Stack

| Component | Technology / Vendor | Version / Details |
| :--- | :--- | :--- |
| **Content Management System** | WordPress | Self-hosted instance |
| **Active Theme** | Hello Elementor | Version 3.1.1 (Minimalist base theme) |
| **Page Builder** | Elementor Core | Version 3.25.10 |
| **Addon Kit / Template Framework** | Jeg Elementor Kit (JKit) | Version 2.6.10 |
| **Header/Footer Builder** | ElementsKit Lite | Version 3.3.2 |
| **Form Management** | Metform Form Builder | Version 3.9.1 |
| **Messaging / Chat** | Click to Chat for WhatsApp | Version 4.12.1 |
| **Click-to-Call** | Call Now Button | Version 1.4.14 |
| **Slider Engine** | Swiper.js | Version 8.4.5 |
| **Web Typography** | Google Fonts | `Manrope` (Headings) & `Karla` (Body text) |

---

## 2. Template Origin & Design System

The website layout was deployed using the **Hiro – IT Recruiter & Staffing Agency Elementor Template Kit** created by **Jegtheme**.

Key characteristics of this template:
* Visual style: Modern corporate tech aesthetic with deep blues, gradients, clean sans-serif typography, and animated micro-interactions (`fadeInUp`, shrink animations).
* Layout structures: Tailored for recruitment firms, containing candidate search modules, job counters, testimonials, and service carousels.

---

## 3. WordPress REST API Analysis

The WordPress REST API is publicly accessible without rate limiting or authentication restrictions on standard endpoints:

* **Endpoint:** `https://talentechno.com/wp-json/wp/v2/`
* **Exposed Routes:**
  * `/wp-json/wp/v2/pages` (Returns all 7 pages and rendered HTML)
  * `/wp-json/wp/v2/posts` (Returns posts including default Hello World post)
  * `/wp-json/wp/v2/media` (Returns all 62 uploaded media files, URLs, and dimensions)
  * `/wp-json/wp/v2/types` (Reveals post types: `elementskit_content`, `metform-entry`, `wp_navigation`, etc.)
  * `/wp-json/wp/v2/users` (Discloses administrator username: `admin`)

---

## 4. Search Engine Optimization & Sitemaps

### `robots.txt`
```txt
User-agent: *
Disallow: /wp-admin/
Allow: /wp-admin/admin-ajax.php

Sitemap: https://talentechno.com/wp-sitemap.xml
```

### Sitemap Index Structure (`/wp-sitemap.xml`)
The native WordPress 5.5+ sitemap system is active, exposing:
1. `wp-sitemap-posts-page-1.xml`: All 7 core landing pages.
2. `wp-sitemap-posts-post-1.xml`: Default blog post.
3. `wp-sitemap-posts-elementskit_template-1.xml`: Header and footer template URLs (search engines may index template fragments).
4. `wp-sitemap-posts-metform-form-1.xml`: Metform internal post types (exposing form templates to crawler indexing).
5. `wp-sitemap-taxonomies-category-1.xml`: Uncategorized category archive.
6. `wp-sitemap-users-1.xml`: Author archive for `admin`.

---

## 5. Media Library Audit

The WordPress media library contains **62 assets** uploaded between November and December 2024:

1. **Branding Assets:**
   * `cropped-talent-1.png` / `talent-1.png` (Official Talentechno logo icon and wordmark).
2. **Stock Photography:**
   * Professional office environments, candidate interview settings, hiring managers holding resumes, and team collaboration scenes.
   * Modern IT/AI conceptual art: Circuit board patterns, AI avatars, robotic hands, and API hologram graphics.
3. **Template Kit Placeholders:**
   * 14+ placeholder PNGs (`placeholder-1.png` to `placeholder-14.png`).
   * `hiro-logo.png` and `hiro-vertical.png`.
   * Unused avatar images (`yogist-ceo.png`, `asian-businesswoman`, etc.).

