# Contact Channels & Lead Capture Forms

## 1. Verified Contact Channels

| Channel | Details / Value | Location on Site |
| :--- | :--- | :--- |
| **Primary Telephone** | `+91 9030888469` / `9030888469` | Header click-to-call, Footer, Contact Us page |
| **WhatsApp Direct** | Linked to `9030888469` via Click to Chat plugin | Sticky bottom/floating icon on all pages |
| **HR / Recruitment Email** | `hrteam@talentechno.com` | Footer, Contact Us page |
| **General Inquiries Email**| `contact@talentechno.com` | Footer, Contact Us page |
| **Office Address** | `# 402 kavya apartments, Madhura Nagar, Near Madhura nagar metro, Near Ameerpet, Hyderabad 500038, Telangana` | Contact Us page |
| **Operating Hours** | Mon–Fri: 10:00 AM – 6:00 PM<br>Sat: 10:00 AM – 1:00 PM<br>Sun: Closed | Contact Us page |

> [!WARNING]
> **Template Dummy Number Found:** On the **About Us** page (`/about-us/`), an unedited template telephone number `(+021) 5812 698` appears beneath the *"Search a Job"* section. This should be replaced with `+91 9030888469` or removed.

---

## 2. Lead Capture Forms (Metform Integration)

The site utilizes the **Metform** WordPress plugin for enquiry capture. Three distinct form templates are configured:

### Form 1: Contact Us Form (`/metform-form/contact-form/`)
* **Page Location:** `/contact-us/`
* **Form Purpose:** General client and candidate inquiries.
* **Input Fields:**
  1. `mf-listing-fname`: Full Name (Text input)
  2. `mf-email`: Email Address (Email input, required)
  3. `mf-telephone`: Phone Number (Tel input)
  4. `message`: Inquirer Message / Comments (Textarea)
* **Submit Action Button:** `"Submit"`

---

### Form 2: Homepage Enquiry Form (`/metform-form/home-page-form/`)
* **Page Location:** Modal / popup trigger on the Homepage (`"Get Enquiry"` / `"Contact Us"`).
* **Input Fields:**
  1. `mf-listing-fname`: First Name
  2. `mf-listing-lname`: Last Name
  3. `mf-email`: Email Address
  4. `mf-telephone`: Phone Number
  5. `message`: Message / Project Details
* **Submit Action Button:** `"Submit"`

---

### Form 3: About Us Quick Form (`/metform-form/home-abiut-form/`)
* **Page Location:** `/about-us/` (Sidebar / Inline enquiry block).
* **Input Fields:**
  1. `mf-listing-fname`: Name
  2. `mf-email`: Email Address
  3. `mf-telephone`: Phone Number
* **Submit Action Button:** `"Submit"`

---

## 3. Newsletter Subscription Form

* **Widget:** Jeg Elementor Kit Mailchimp Form (`jkit_mailchimp`)
* **Page Location:** Homepage footer area.
* **Headline:** *"Subscribe Our Newsletter & Get Latest News"*
* **Placeholder Text:** *"Lorem ipsum dolor sit amet, consectetur adipiscing elit..."*
* **Form Action:** Submits to an unconfigured Mailchimp backend; returns default alert message: *"Successfully listed this email"* or *"Something went wrong"*.

---

## 4. Social Media Profiles Audit

In both the header and footer templates, social media icons exist for:
* **Facebook** (`fa-facebook-f`)
* **Twitter / X** (`fa-twitter`)
* **Instagram** (`fa-instagram`)
* **LinkedIn** (`fa-linkedin-in`)

**Audit Note:** All social media links currently point to dummy hashtag anchor tags (`#`). Real company social profiles have not yet been linked.

