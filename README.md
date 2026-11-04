# CalleNomad (callenomad.com)

Practical street Spanish for digital nomads and remote workers in Colombia and Latin America. 1-on-1 coaching by Ben Chiverton-Hunt, taught from Barranquilla. Static site on GitHub Pages.

## Offer ladder

| Offer | Price | Where |
| --- | --- | --- |
| Street Survival Quiz + 30-word Nomad Street Guide (PDF) | Free | `/quiz/` |
| Colombia price checker and landlord WhatsApp translator | Free | `/tools/` |
| Anti-Gringo Tax Audio & Script Vault (Notion) | $19 USD, credited in full against coaching | Stripe |
| Free 20-minute Fluency Audit (Zoom) | Free | cal.com/callenomad/20min |
| The Quick Start: Arrival Basics | $129 USD, 2 weeks, 3 sessions | Cal.com + Stripe |
| The Street Smart Bootcamp | $399 USD, 6 weeks, 6 sessions | Cal.com + Stripe |
| The Complete Insider | $1,099 USD, 12 weeks, 24 sessions | Cal.com + Stripe |
| Friends & Family packs (private, noindex) | £100 / £220 | `/friends/` |

Every session follows the 50-minute 10-20-15-5 method: 10 min street glue, 20 min roleplay, 15 min listening and accent tuning, 5 min street mission.

Contact: info@callenomad.com · Instagram @calle.nomad · WhatsApp +57 350 217 6541

## Site map

| Path | What it is |
| --- | --- |
| `index.html` | Homepage (single file, inline CSS and JS) |
| `quiz/` | 60-second diagnostic; posts leads to a Make.com webhook |
| `tools/` | Price checker and landlord translator (`data.json` holds prices and templates) |
| `survival/` | Survival playbooks, generated from `data/survival_playbooks.json` |
| `friends/` | Private Friends & Family rate page |
| `go/<channel>/` | Tracking redirects: event, linkedin, x, tandem, podcast, newsletter, workshop, instagram |
| `marketing/` | Lead magnet, email sequences, one-pager, Make.com nurture setup |
| `archive/` | Old homepage versions, logo exploration, unused legacy files (blocked in robots.txt) |

## Tracking

- Cloudflare Web Analytics runs on every public page. It does not record query strings, so each channel has its own `/go/<channel>/` path.
- The first `?src=`, `?utm_source=` or external referrer is saved in the visitor's session and sent with every quiz lead as `source`.

## Rebuilding the survival playbooks

Edit `data/survival_playbooks.json` or the files in `templates/`, then run:

```bash
python3 scripts/build_survival_pages.py   # regenerates survival/, sitemap.xml and robots.txt
python3 scripts/test_survival_pages.py    # checks the output
```

## Brand

Terracotta `#D94E36`, charcoal `#1E2229`, cream `#FCFBFA`; Outfit for headings, Inter for body text; logo mark in `logo-mark.svg`. Use the same tokens on any new page.

## Running locally

```bash
python3 -m http.server 8000
```

Then open http://localhost:8000.

© 2026 CalleNomad.com. All rights reserved.
