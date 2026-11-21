# Site Architecture & Page-by-Page Audit

## 1. Complete Page Inventory

The website contains **7 main published pages**, **2 global templates** (Header and Footer), **3 Metform forms**, and **1 default WordPress post**:

| ID | Title / Section | Slug / Path | Type | Last Modified |
| :---: | :--- | :--- | :--- | :--- |
| **64** | **Home** | `/` | WordPress Page (Elementor) | 2024-12-14 |
| **66** | **About Us** | `/about-us/` | WordPress Page (Elementor) | 2024-12-09 |
| **68** | **Contact Us** | `/contact-us/` | WordPress Page (Elementor) | 2024-12-13 |
| **224** | **Talent Management** | `/talent-management/` | WordPress Page (Elementor) | 2024-12-09 |
| **226** | **Recruitment Process** | `/recruitment-process/` | WordPress Page (Elementor) | 2024-12-09 |
| **228** | **HR Consulting** | `/hr-consulting/` | WordPress Page (Elementor) | 2024-12-09 |
| **230** | **Ongoing Staff Support** | `/ongoing-staff-support/` | WordPress Page (Elementor) | 2024-12-09 |
| **73** | **Header Template** | `/?elementskit_template=header` | ElementsKit Template | 2024-12-13 |
| **87** | **Footer Template** | `/?elementskit_template=footer` | ElementsKit Template | 2024-12-13 |
| **1** | **Hello world!** | `/hello-world/` | WordPress Post (Default) | 2024-11-28 |

---

## 2. Global Site Elements

### Header (`elementskit_template=header`)
* **Logo:** Custom branded graphic (`talent-1.png` / `cropped-talent-1.png`)
* **Navigation Menu:**
  * Home (`/`)
  * About Us (`/about-us/`)
  * Services (Dropdown menu):
    * Talent Management (`/talent-management/`)
    * Recruitment Process (`/recruitment-process/`)
    * HR Consulting (`/hr-consulting/`)
    * Ongoing Staff Support (`/ongoing-staff-support/`)
  * Contact Us (`/contact-us/`)
* **Header Action Button:** `"Contact Us"` (links to `/contact-us/`)
* **Floating CTA Integrations:**
  * **WhatsApp Chat:** Triggering WhatsApp conversation via Click to Chat plugin to `+91 9030888469`.
  * **Call Now Button:** Modern floating call button linking to `tel:9030888469`.

### Footer (`elementskit_template=footer`)
* **Branding Summary:** *"Talentecho is a specialized IT recruitment consultancy focused on connecting businesses with top-tier tech talent."*
* **Quick Links:** Home, About Us, Contact Us
* **Services Links:** Talent Management, Recruitment Process, HR Consulting, Ongoing staff support
* **Contact Information:**
  * Phone: `+91 9030888469`
  * Emails: `hrteam@talentechno.com`, `contact@talentechno.com`
* **Social Links:** Icons for Facebook, Twitter, Instagram, and LinkedIn (all configured with placeholder `#` links).
* **Copyright Notice:** `Copyright © 2024 Talentechno. All rights reserved by Web Rocz.`

---

## 3. Individual Page Breakdowns

### Page 1: Home (`https://talentechno.com/`)
* **Hero Banner:**
  * Headline: *"Connecting Tech Talent with Tomorrow's Innovations"*
  * CTAs: *"About Us"* and *"Get Enquiry"*
* **About Talentecho Teaser:**
  * Subheading: *"Empowering Businesses with Exceptional IT Talent and Expertise."*
  * Summary paragraphs, Vision & Mission preview.
* **Template Remnants Section:**
  * Subheading: *"About Hiro – Finding The Jobs That You Have Been Dreaming"*
  * Unconfigured counters: `0+ Job Recruitment`, `0% Expert Team`, `0% Best Service`.
  * Unedited Latin filler text (*"Lorem ipsum dolor sit amet, consectetuer adipiscing elit..."*).
* **Services Grid:** Overview cards linking to the 4 primary services.
* **Value Proposition:** *"Why Choose Talentecho?"* highlighting Industry Expertise and Tailored Solutions.
* **Client Testimonials:** 5 named client quotes (Ramesh, Vinod, Mounika, Sandhya, Naresh).
* **FAQ Accordion:** 5 expandable questions and detailed answers regarding industries, quality assurance, scaling, and ongoing support.
* **Blog Section Preview:** Displays the single default WordPress post *"Hello world!"*.
* **Newsletter Subscription Box:** Unconfigured Mailchimp widget displaying Latin placeholder text.

---

### Page 2: About Us (`https://talentechno.com/about-us/`)
* **Page Banner:** Breadcrumb trail and page title.
* **Mission & Vision Statements:** Expanded mission and vision statements emphasizing digital transformation and empowerment.
* **Why Choose Us:** Industry expertise, tailored solutions, and end-to-end support pillars.
* **Template Placeholders Present:**
  * *"About Hiro"* heading.
  * *"Evelyn Wood – Hiro CEO"* profile block.
  * Dummy phone number: `(+021) 5812 698` (template leftover).
  * Several Latin text blocks under *"The Benefits"*, *"Recognition"*, and *"Big Company"*.

---

### Page 3: Contact Us (`https://talentechno.com/contact-us/`)
* **Header / Intro:** *"Get In Touch with Us"*
* **Office Address:** `# 402 kavya apartments, Madhura Nagar, Near Madhura nagar metro, Near Ameerpet, Hyderabad 500038`
* **Calling Support:** `9030888469`
* **Email Inboxes:** `hrteam@talentechno.com`, `contact@talentechno.com`
* **Business Hours:**
  * Monday to Friday: 10:00 AM – 6:00 PM
  * Saturday: 10:00 AM – 1:00 PM
  * Sunday: Closed
* **Contact Form:** Interactive Metform block with fields for Name, Email, Phone, and Message.

---

### Pages 4–7: Dedicated Service Pages
Each service page follows a clean, structured layout detailing definition, industry relevance, core solution pillars, and reasons to choose Talentecho:
1. **Talent Management (`/talent-management/`):** Explains workforce planning, training, performance management, retention, and diversity initiatives.
2. **Recruitment Process (`/recruitment-process/`):** Outlines the structured 6-step recruitment lifecycle from needs discovery to onboarding.
3. **HR Consulting (`/hr-consulting/`):** Covers organizational development, compensation strategy, performance frameworks, and employee relations.
4. **Ongoing Staff Support (`/ongoing-staff-support/`):** Focuses on post-hire retention, coaching, continuous learning, and mental/physical wellbeing programs.

