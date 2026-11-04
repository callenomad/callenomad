# CalleNomad Expat Tools Guide

This folder contains the standalone web tool for CalleNomad at `/tools/`.

## Current Verified Price Ranges (`data.json`)

Prices are calibrated to Barranquilla as the baseline, with regional multipliers applied for other Colombian cities (1.25x for Medellín, 1.5x for Bogotá, and adjusted local ranges for Cartagena and other cities).

| Category | Barranquilla (Base) | Medellín (1.25x) | Bogotá (1.5x) | Cartagena | Other |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Taxi** | 10k - 15k | 12.5k - 19k | 15k - 22.5k | 12k - 18k | 10k - 15k |
| **Rent** (Furnished monthly) | 1.5M - 3M | 1.875M - 3.75M | 2.25M - 4.5M | 1.8M - 3.5M | 1.5M - 3M |
| **Market produce** (Per item / kilo) | 4k - 6k | 5k - 7.5k | 6k - 9k | 5k - 7.5k | 4k - 6k |
| **Street food** (Empanada, arepa) | 3k - 5k | 4k - 6.5k | 4.5k - 7.5k | 4k - 6.5k | 3k - 5k |
| **Haircut** | 15k - 20k | 19k - 25k | 22.5k - 30k | 18k - 25k | 15k - 20k |
| **Handyman** (Minor repair call) | 50k - 150k | 60k - 190k | 75k - 225k | 60k - 180k | 50k - 150k |

All figures are in Colombian Pesos (COP).

### 2. Last Updated Date

Update `"last_updated"` inside `"meta"` whenever prices are reviewed:
```json
"meta": {
  "last_updated": "November 2026"
}
```

### 3. Landlord Templates (`tool_b`)

Review the 18 pre-populated Colombian Spanish landlord messages across the 6 situations:
* `deposit` (3 messages, Polite and Firm tones)
* `repair` (3 messages, Polite and Firm tones)
* `contract` (3 messages, Polite and Firm tones)
* `utilities` (3 messages, Polite and Firm tones)
* `rent_negotiation` (3 messages, Polite and Firm tones)
* `notice` (3 messages, Polite and Firm tones)

Adjust phrasing or add extra templates as needed. Any tag enclosed in square brackets (e.g. `[nombre]`, `[monto]`) automatically creates an interactive input field on the page.

---

## Steps to Go Live on GitHub Pages

1. Stage the new files:
   ```bash
   git add tools/
   ```
2. Commit the changes:
   ```bash
   git commit -m "feat: add expat street tools for prices and landlord messages"
   ```
3. Push to `main`:
   ```bash
   git push origin main
   ```
4. Verify deployment:
   Visit `https://callenomad.com/tools/` (or test with attribution tracking: `https://callenomad.com/tools/?src=share`).
