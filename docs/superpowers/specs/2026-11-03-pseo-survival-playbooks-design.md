# Design Specification: Programmatic SEO (pSEO) Street Survival Playbooks

**Document ID:** `docs/superpowers/specs/2026-11-03-pseo-survival-playbooks-design.md`  
**Date:** 2026-11-03  
**Status:** Approved  
**Author:** Benito / Antigravity Engineering  

---

## 1. Executive Summary & Strategic Objectives

CalleNomad is an online Spanish coaching academy for remote workers and digital nomads based in Colombia. While the core commercial products are private 1-on-1 coaching ($129–$1,099), free 20-minute Fluency Audits, and a self-study digital product ($19 Notion Audio & Script Vault), organic discovery currently relies solely on the primary homepage and quiz.

This project implements **Strategy 4: Programmatic SEO (pSEO) "Street Survival Playbooks"**. By generating static, zero-bloat, lightning-fast guide pages on GitHub Pages under `/survival/[slug]/`, CalleNomad will capture high-intent, panic-driven Google and AI search traffic from expats and nomads searching for immediate real-world Spanish solutions (e.g., apartment lease negotiations, hailing taxis without being overcharged, ordering at local cafes, and navigating dating slang).

### Core Goals:
1. **$0 Infrastructure Cost:** Fully static pre-rendered HTML hosted natively on GitHub Pages with sub-300ms load times and 100/100 Core Web Vitals.
2. **High-Intent Search Capture:** High-CTR H1 headlines targeting zero-competition, conversational queries that Duolingo and grammar textbooks fail to address.
3. **Frictionless Dual Conversion Funnel:**
   * **Tripwire Impulse Offer:** The Anti-Gringo Tax Audio & Script Vault ($19 USD via Stripe).
   * **High-Ticket Service Lead Generation:** Free 20-Minute Fluency Audit via Cal.com.
4. **Content Protection & Value Demonstration:** Option A "Taster" model—featuring 2 native-speed audio clips per guide as undeniable proof of quality, leaving the remaining 22+ audio clips and complete script bank exclusive to the paid $19 Vault.
5. **Infinite Scalability:** Data-driven Python generator that can expand from the initial 5 guides to 50+ city-specific playbooks in seconds.

---

## 2. Architecture & Tech Stack

CalleNomad uses a zero-build-step, pure static web architecture. There are no client-side runtime build frameworks (no React, Next.js, or complex bundling pipelines). Everything compiles to static HTML, CSS, and Vanilla JavaScript.

```
callenomad/
├── data/
│   └── survival_playbooks.json         # Master JSON content manifest for all playbooks
├── templates/
│   ├── survival_guide_template.html    # Master HTML template for individual playbook pages
│   └── survival_hub_template.html      # Master HTML template for the /survival/ index directory
├── scripts/
│   └── build_survival_pages.py         # Python build script compiling JSON + templates -> static HTML
├── survival/
│   ├── index.html                      # Hub directory listing all survival playbooks
│   ├── negotiate-rent-medellin-spanish/
│   │   └── index.html                  # Clean static URL: /survival/negotiate-rent-medellin-spanish/
│   ├── colombian-taxi-indrive-spanish-phrases/
│   │   └── index.html
│   ├── dating-whatsapp-slang-colombia/
│   │   └── index.html
│   ├── order-coffee-tinto-medellin-bogota/
│   │   └── index.html
│   └── what-does-dar-papaya-lucas-mean/
│       └── index.html
├── audios/                             # 30 native audio clips (.m4a)
├── sitemap.xml                         # Auto-updated XML sitemap for Google Search Console
└── robots.txt                          # Search engine directives referencing sitemap.xml
```

---

## 3. Data Schema (`data/survival_playbooks.json`)

Each survival playbook is defined as a structured JSON object:

```json
{
  "slug": "negotiate-rent-medellin-spanish",
  "metaTitle": "How to Negotiate Rent in Medellín in Spanish (No Gringo Tax)",
  "metaDescription": "Stop paying 40% platform markups in Medellín. Exact WhatsApp landlord scripts, textbook vs street comparison, and native Colombian audio clips.",
  "h1": "How to Negotiate Apartment Rent in Medellín Without Paying the Gringo Tax (Exact Spanish Scripts + Audio)",
  "city": "Medellín, Colombia",
  "cityBadge": "🇨🇴 Medellín • El Poblado, Laureles & Envigado",
  "readTime": "4 min read",
  "updatedDate": "2026-11-03",
  "introHook": "Text describing the problem...",
  "comparisonRows": [
    {
      "intent": "Asking if the price is flexible",
      "textbook": "¿Cuál es el precio del alquiler?",
      "calle": "¿En cuánto me lo deja directo si me quedo tres meses?",
      "nuance": "Signals you are renting directly and bypass app fees."
    }
  ],
  "audioTasters": [
    {
      "file": "audios/Cuanto es lo menos.m4a",
      "phrase": "¿Cuánto es lo menos?",
      "translation": "What is the lowest you can do?",
      "breakdown": "The universal Colombian negotiation phrase..."
    },
    {
      "file": "audios/Listo.m4a",
      "phrase": "Listo, de una.",
      "translation": "Done, let's do it.",
      "breakdown": "How locals seal an agreement naturally..."
    }
  ],
  "miniQuiz": [
    {
      "question": "A landlord says the monthly rent is 'un millón quinientas lucas'. How much is that?",
      "options": [
        { "text": "$150 USD", "correct": false, "feedback": "Incorrect. 'Lucas' means thousands of Colombian Pesos." },
        { "text": "1,500,000 COP (~$380 USD)", "correct": true, "feedback": "¡Exacto! 'Lucas' is street slang for thousands of Pesos." },
        { "text": "15,000 COP", "correct": false, "feedback": "Way off—15,000 COP wouldn't pay for a sandwich." }
      ]
    }
  ],
  "whatsappScripts": [
    {
      "title": "Initial Direct Lease Inquiry (WhatsApp)",
      "script": "Hola [Nombre], buenas tardes. Me gustó muchísimo el apartamento en [Barrio/Edificio]...",
      "english": "Hello [Name], good afternoon. I really liked the apartment in [Neighborhood]..."
    }
  ],
  "faqs": [
    {
      "question": "Do I need a Colombian fiador (co-signer) for direct rentals?",
      "answer": "Not if you negotiate upfront payments or a security deposit in cash..."
    }
  ]
}
```

---

## 4. Initial 5 High-Intent Playbooks

1. **`negotiate-rent-medellin-spanish`**
   * *H1:* How to Negotiate Apartment Rent in Medellín Without Paying the Gringo Tax (Exact Spanish Scripts + Audio)
   * *Focus:* Bypassing the 30–50% Airbnb/agency premium, contacting owners directly on WhatsApp, deposit terms, and negotiation etiquette.
   * *Audio Tasters:* `Cuanto es lo menos.m4a`, `Listo.m4a`.
2. **`colombian-taxi-indrive-spanish-phrases`**
   * *H1:* How to Take Taxis & InDrive in Colombia Without Getting Ripped Off (Exact Spanish Phrases + Audio)
   * *Focus:* Clarifying price before getting in (*la carrera*), using InDrive cash negotiation, navigating drop-offs, avoiding meter tricks (*el muñeco*).
   * *Audio Tasters:* `Cambio:vuelto.m4a`, `Pilas.m4a`.
3. **`dating-whatsapp-slang-colombia`**
   * *H1:* How to Chat on WhatsApp & Date in Colombia Without Sounding Like a Textbook (Real Slang + Audio)
   * *Focus:* Conversational warmth, voice note cadence, slang like *parche*, *caer*, *ligar*, and deciphering authentic intent.
   * *Audio Tasters:* `Que onda.m4a`, `Ligar.m4a`.
4. **`order-coffee-tinto-medellin-bogota`**
   * *H1:* How to Order Coffee & Food in Medellín and Bogotá Like a Local (Menus, Wifi, & Audio)
   * *Focus:* Difference between *tinto*, *perico*, *café con leche*, ordering lunch specials (*almuerzo del día*), and asking for the wifi and a plug politely.
   * *Audio Tasters:* `Ahorita.m4a`, `De una.m4a`.
5. **`what-does-dar-papaya-lucas-mean`**
   * *H1:* What Does "Dar Papaya" & "Lucas" Mean in Colombia? (Street Slang Guide + Native Audio)
   * *Focus:* The #1 cultural rule of Colombia (*no dar papaya*), money slang (*lucas*, *plata*, *feria*), and avoiding the tourist trap badge.
   * *Audio Tasters:* `Lucas.m4a`, `Plata.m4a`.

---

## 5. UI & Component Design

The templates share CalleNomad's established aesthetic:
* **Backgrounds:** `--bg-page: #FCFBFA`, `--bg-surface: #F4F1EA`, `--bg-card: #FFFFFF`
* **Text & Contrast:** `--text-main: #1E2229` (Charcoal Obsidian), `--text-secondary: #4A4F58`
* **Accents:** `--brand-coral: #D94E36` (Terracotta Coral), `--brand-green: #1E6F5C`
* **Fonts:** `Outfit` (Headings) + `Inter` (Body)

### Key Components:
1. **Header & Breadcrumbs:** Compact, clean navigation bar with logo and hierarchical breadcrumb trail (`Home > Survival Guides > [Playbook Title]`).
2. **"Textbook vs. Calle" Comparison Table:** High-contrast table highlighting what textbooks teach vs. what locals actually say, complete with explanatory cultural nuance pills.
3. **Native Audio Taster Cards:** Minimalist inline audio cards featuring real waveforms/play buttons, transcript, and plain English translation.
4. **Interactive Mid-Article Mini-Quiz Widget:** 3 situational questions embedded directly within the article text. Readers get instantaneous visual feedback (green/red), an overall street score, and contextual CTA buttons.
5. **Copy-to-Clipboard WhatsApp Scripts:** Code/script container with a dedicated `[📋 Copy Script]` button that triggers immediate feedback (`Copied!`).
6. **Mobile Sticky Bottom Conversion Bar:**
   * Visible continuously on mobile & tablet viewports:
     * **Button 1 (Terracotta):** `🎧 Get All 30 Audio Clips ($19)` $\rightarrow$ Stripe checkout link (`https://buy.stripe.com/9B628r7dUh1G8LndbAcV203`)
     * **Button 2 (Charcoal):** `⚡ Free 20-Min Audit` $\rightarrow$ Cal.com link (`https://cal.com/callenomad/20min`)

---

## 6. SEO & Technical Infrastructure

1. **Clean URL Directory Structure:** Each playbook builds to `survival/<slug>/index.html`, resolving cleanly as `https://callenomad.com/survival/<slug>/`.
2. **Canonical URLs:** Every page embeds its absolute canonical tag (`<link rel="canonical" href="https://callenomad.com/survival/<slug>/">`) to enable syndication on Medium, Substack, and Reddit without duplicate penalty.
3. **Structured Data (Schema.org JSON-LD):**
   * `Article` schema with author attribution to Benito and organization `CalleNomad`.
   * `FAQPage` schema for cultural questions, enabling rich FAQ snippets on Google SERPs.
4. **XML Sitemap (`sitemap.xml`):** Automatically compiled during build time to index the root homepage, `/quiz/`, `/survival/` hub, and all individual playbook URLs.
5. **Robots.txt:** Formatted with `User-agent: *`, `Allow: /`, and `Sitemap: https://callenomad.com/sitemap.xml`.
6. **Hub Directory (`/survival/index.html`):** A clean landing directory indexing all available playbooks by category and city to pass internal link equity.

---

## 7. Verification & Testing Criteria

1. **Compilation Check:** Python build script runs without errors, generating all 5 playbook pages, the hub page, and the sitemap.
2. **Static Route Verification:** All generated paths resolve with HTTP 200 on local preview and GitHub Pages.
3. **Audio Playback:** Native `.m4a` audio players play properly across Safari, Chrome, and iOS/Android without codec issues.
4. **Copy-to-Clipboard:** WhatsApp script copy button correctly transfers text to clipboard with visible feedback.
5. **Mini-Quiz Interactivity:** Answers calculate correctly and reveal the tailored conversion CTA upon completion.
6. **Mobile Sticky Bar:** Renders cleanly at the bottom of the screen on mobile devices without obscuring body content.
7. **Schema & SEO Validation:** Validated against Schema.org validators for clean `Article` and `FAQPage` JSON-LD.
