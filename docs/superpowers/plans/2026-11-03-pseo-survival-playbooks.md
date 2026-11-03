# Programmatic SEO (pSEO) Street Survival Playbooks Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a high-performance, static Programmatic SEO (pSEO) engine on GitHub Pages (`callenomad.com/survival/`) with an initial batch of 5 high-intent Colombian street Spanish playbooks featuring textbook vs. street comparison tables, native audio snippet teasers, an interactive mid-article mini-quiz, and a mobile sticky dual-CTA bar.

**Architecture:** A Python data-driven generator (`scripts/build_survival_pages.py`) compiles a structured JSON content manifest (`data/survival_playbooks.json`) into pre-rendered static HTML guides (`survival/<slug>/index.html`) and a hub index (`survival/index.html`), while updating `sitemap.xml` and `robots.txt` for rapid search engine indexing.

**Tech Stack:** Python 3 (standard library: `json`, `os`, `pathlib`, `xml.etree`), Semantic HTML5, Vanilla CSS3 (Terracotta/Charcoal design system), Vanilla JavaScript (audio controls, inline mini-quiz, clipboard copy), Schema.org JSON-LD.

**Spec:** [`docs/superpowers/specs/2026-11-03-pseo-survival-playbooks-design.md`](file:///Users/benchiverton-hunt/Documents/callenomad/docs/superpowers/specs/2026-11-03-pseo-survival-playbooks-design.md)

## Global Constraints
- Target platform is GitHub Pages static hosting with clean directory URLs (`/survival/<slug>/`).
- Zero external client runtime libraries (no React, jQuery, or heavy UI frameworks).
- Design system: `--brand-coral: #D94E36`, `--text-main: #1E2229`, `--bg-page: #FCFBFA`, font families `Outfit` and `Inter`.
- Sticky bar CTA 1: Stripe checkout `https://buy.stripe.com/9B628r7dUh1G8LndbAcV203` ($19 USD).
- Sticky bar CTA 2: Cal.com audit `https://cal.com/callenomad/20min` (Free 20-Min Fluency Audit).
- Audio strategy: Option A "Taster" model (2 short `.m4a` audio clips per guide sourced from `audios/`, remainder exclusive to the paid Vault).

## Review Focus
1. **Audio Path Resolution:** Audio files in `audios/` must resolve accurately from both root and nested `/survival/<slug>/` paths without 404 errors.
2. **Clipboard API Fallback:** `navigator.clipboard.writeText` may fail on older browsers or non-HTTPS local origins; must provide a reliable textarea fallback.
3. **Mobile Sticky Bar Viewport Occlusion:** The fixed bottom bar must not overlap the footer or obscure page content (proper `padding-bottom: 80px` on mobile body).
4. **Mini-Quiz State Resets:** Clicking quiz options must calculate score accurately and reveal results without allowing infinite duplicate clicks.
5. **Valid Schema.org JSON-LD:** Structured data for `Article` and `FAQPage` must pass syntax validation with zero missing required fields.

---

### Task 1: Content Manifest & Data Schema

**Files:**
- Create: `data/survival_playbooks.json`
- Test: `scripts/test_survival_pages.py` (Validation check)

**Interfaces:**
- Produces: `data/survival_playbooks.json` containing an array of 5 playbook objects with keys: `slug`, `metaTitle`, `metaDescription`, `h1`, `city`, `cityBadge`, `readTime`, `updatedDate`, `introHook`, `comparisonRows`, `audioTasters`, `miniQuiz`, `whatsappScripts`, `faqs`.

- [ ] **Step 1: Write test script to validate manifest schema**
Create `scripts/test_survival_pages.py` checking that `data/survival_playbooks.json` exists, has 5 items, all slugs match the spec, and all referenced audio files exist in `audios/`.

- [ ] **Step 2: Run test to verify it fails**
Run: `python3 scripts/test_survival_pages.py`
Expected: FAIL (manifest file not found).

- [ ] **Step 3: Create `data/survival_playbooks.json`**
Populate the 5 complete playbook datasets:
1. `negotiate-rent-medellin-spanish` (Audio: `audios/Cuanto es lo menos.m4a`, `audios/Listo.m4a`)
2. `colombian-taxi-indrive-spanish-phrases` (Audio: `audios/Cambio:vuelto.m4a`, `audios/Pilas.m4a`)
3. `dating-whatsapp-slang-colombia` (Audio: `audios/Que onda.m4a`, `audios/Ligar.m4a`)
4. `order-coffee-tinto-medellin-bogota` (Audio: `audios/Ahorita.m4a`, `audios/De una.m4a`)
5. `what-does-dar-papaya-lucas-mean` (Audio: `audios/Lucas.m4a`, `audios/Plata.m4a`)

- [ ] **Step 4: Run test to verify it passes**
Run: `python3 scripts/test_survival_pages.py`
Expected: PASS (manifest valid and all audio references exist).

- [ ] **Step 5: Commit**
```bash
git add data/survival_playbooks.json scripts/test_survival_pages.py
git commit -m "feat(pseo): create survival playbooks content manifest"
```

---

### Task 2: Master HTML Template & Interactive Components

**Files:**
- Create: `templates/survival_guide_template.html`
- Modify: `scripts/test_survival_pages.py` (Add template syntax and component checks)

**Interfaces:**
- Consumes: JSON playbook objects from Task 1.
- Produces: `templates/survival_guide_template.html` with placeholders `{{H1}}`, `{{META_TITLE}}`, `{{META_DESCRIPTION}}`, `{{CANONICAL_URL}}`, `{{SCHEMA_JSON}}`, `{{BREADCRUMB_NAME}}`, `{{CITY_BADGE}}`, `{{READ_TIME}}`, `{{INTRO_HOOK}}`, `{{COMPARISON_TABLE}}`, `{{AUDIO_TASTERS}}`, `{{MINI_QUIZ}}`, `{{WHATSAPP_SCRIPTS}}`, `{{FAQS}}`, `{{RELATED_GUIDES}}`.

- [ ] **Step 1: Add template validation assertions to `scripts/test_survival_pages.py`**
Verify placeholder coverage, audio player markup, mini-quiz JavaScript logic, copy-to-clipboard functionality, and mobile sticky dual-CTA bar markup.

- [ ] **Step 2: Run test to verify it fails**
Run: `python3 scripts/test_survival_pages.py`
Expected: FAIL (template does not exist).

- [ ] **Step 3: Create `templates/survival_guide_template.html`**
Implement the complete responsive HTML5 template:
- Responsive navigation header with CalleNomad logo and breadcrumb trail.
- "Textbook vs. Calle Spanish" 3-column table with responsive card-stacking on mobile.
- Native HTML5 audio player cards for the 2 audio tasters.
- Mid-article interactive 3-question mini-quiz with instant scoring and tailored CTAs.
- WhatsApp message cards with 1-click clipboard copy button and visual confirmation.
- Collapsible FAQ accordion with `itemscope itemtype="https://schema.org/FAQPage"`.
- Mobile sticky bottom bar:
  - Button 1 (Coral): `🎧 All 30 Clips + Scripts ($19)` $\rightarrow$ Stripe checkout
  - Button 2 (Charcoal): `⚡ Free 20-Min Audit` $\rightarrow$ Cal.com
- Full Schema.org JSON-LD scripts for `Article` and `FAQPage`.

- [ ] **Step 4: Run test to verify it passes**
Run: `python3 scripts/test_survival_pages.py`
Expected: PASS (template verified with all components).

- [ ] **Step 5: Commit**
```bash
git add templates/survival_guide_template.html scripts/test_survival_pages.py
git commit -m "feat(pseo): create responsive survival guide master template"
```

---

### Task 3: Directory Hub Template (`/survival/`)

**Files:**
- Create: `templates/survival_hub_template.html`
- Modify: `scripts/test_survival_pages.py` (Add hub template checks)

**Interfaces:**
- Produces: `templates/survival_hub_template.html` with placeholder `{{GUIDES_GRID}}`.

- [ ] **Step 1: Add hub template validation to test script**
Assert hub template structure, category filtering, and link structure.

- [ ] **Step 2: Run test to verify it fails**
Run: `python3 scripts/test_survival_pages.py`
Expected: FAIL (hub template missing).

- [ ] **Step 3: Create `templates/survival_hub_template.html`**
Implement `/survival/` hub page featuring:
- Hero header: *"Street Spanish Survival Playbooks for Colombia"*
- Grid of playbooks with category tags (Rent & Housing, Taxis & Transport, Nightlife & Dating, Food & Cafes, Street Safety & Slang).
- Link back to CalleNomad homepage and quiz.

- [ ] **Step 4: Run test to verify it passes**
Run: `python3 scripts/test_survival_pages.py`
Expected: PASS.

- [ ] **Step 5: Commit**
```bash
git add templates/survival_hub_template.html scripts/test_survival_pages.py
git commit -m "feat(pseo): create survival hub directory template"
```

---

### Task 4: Python Build Script & Sitemap/Robots Generation

**Files:**
- Create: `scripts/build_survival_pages.py`
- Modify: `sitemap.xml`
- Modify: `robots.txt`
- Output: `survival/index.html` and 5 `survival/<slug>/index.html` files

**Interfaces:**
- Consumes: `data/survival_playbooks.json`, `templates/survival_guide_template.html`, `templates/survival_hub_template.html`.
- Produces: Pre-rendered HTML files in `survival/`, updated `sitemap.xml`, and `robots.txt`.

- [ ] **Step 1: Add build generation tests to `scripts/test_survival_pages.py`**
Verify that all 5 static pages and the hub page are built, check status codes, ensure no unrendered `{{...}}` placeholders remain, and check sitemap entries.

- [ ] **Step 2: Run test to verify it fails**
Run: `python3 scripts/test_survival_pages.py`
Expected: FAIL (build script missing).

- [ ] **Step 3: Implement `scripts/build_survival_pages.py`**
- Load JSON manifest.
- Generate HTML for each guide, substituting all placeholders and building HTML markup for comparison tables, audio cards, mini-quiz, WhatsApp scripts, FAQs, and Schema JSON-LD.
- Write each file to `survival/<slug>/index.html`.
- Generate `survival/index.html` using the hub template.
- Generate/update `sitemap.xml` with `<loc>https://callenomad.com/survival/<slug>/</loc>` tags.
- Verify or create `robots.txt` pointing to `https://callenomad.com/sitemap.xml`.

- [ ] **Step 4: Run the build script and test suite**
Run: `python3 scripts/build_survival_pages.py && python3 scripts/test_survival_pages.py`
Expected: PASS (all files generated and tests pass).

- [ ] **Step 5: Commit**
```bash
git add scripts/build_survival_pages.py survival/ sitemap.xml robots.txt scripts/test_survival_pages.py
git commit -m "feat(pseo): build 5 static survival playbooks and sitemap"
```

---

### Task 5: Homepage Integration, Final Verification & Deployment

**Files:**
- Modify: `index.html` (Add Survival Guides link to footer navigation and mobile drawer)
- Test: Full end-to-end verification

- [ ] **Step 1: Add Survival Guides navigation links to `index.html`**
Add `<a href="/survival/">Survival Guides 🇨🇴</a>` in `desktop-nav`, `mobileDrawer`, and `footer-links-group` in `index.html`.

- [ ] **Step 2: Run full automated verification suite**
Run: `python3 scripts/test_survival_pages.py`
Expected: PASS with 100% green checks across all routes, audio assets, and schema markup.

- [ ] **Step 3: Commit all changes**
```bash
git add index.html
git commit -m "feat: link survival guides hub in main navigation and footer"
```

- [ ] **Step 4: Push to GitHub Pages and verify live deployment**
Run: `git push origin main`
Verify with `curl -sI https://callenomad.com/survival/` and `https://callenomad.com/survival/negotiate-rent-medellin-spanish/` returning HTTP 200 OK.
