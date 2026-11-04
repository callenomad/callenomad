# CalleNomad Expat Tools Guide

This folder contains the standalone web tool for CalleNomad at `/tools/`.

## Values to Verify or Fill In (`data.json`)

All price ranges in `data.json` are currently set to `null` with `"status": "TO VERIFY"`. Until you enter real figures, the tool displays: *"We do not have a reliable range for this yet."* rather than guessing.

### 1. Tool A Price Ranges (COP)

In `tools/data.json`, locate `tool_a.categories` and fill in `min` and `max` in Colombian Pesos for each city (`bogota`, `medellin`, `cartagena`, `other`):

* **Taxi** (`id: "taxi"`)
  * `bogota`: `{ "min": null, "max": null }`
  * `medellin`: `{ "min": null, "max": null }`
  * `cartagena`: `{ "min": null, "max": null }`
  * `other`: `{ "min": null, "max": null }`
* **Rent** (`id: "rent"`)
  * `bogota`: `{ "min": null, "max": null }`
  * `medellin`: `{ "min": null, "max": null }`
  * `cartagena`: `{ "min": null, "max": null }`
  * `other`: `{ "min": null, "max": null }`
* **Market produce** (`id: "market_produce"`)
  * `bogota`: `{ "min": null, "max": null }`
  * `medellin`: `{ "min": null, "max": null }`
  * `cartagena`: `{ "min": null, "max": null }`
  * `other`: `{ "min": null, "max": null }`
* **Street food** (`id: "street_food"`)
  * `bogota`: `{ "min": null, "max": null }`
  * `medellin`: `{ "min": null, "max": null }`
  * `cartagena`: `{ "min": null, "max": null }`
  * `other`: `{ "min": null, "max": null }`
* **Haircut** (`id: "haircut"`)
  * `bogota`: `{ "min": null, "max": null }`
  * `medellin`: `{ "min": null, "max": null }`
  * `cartagena`: `{ "min": null, "max": null }`
  * `other`: `{ "min": null, "max": null }`
* **Handyman** (`id: "handyman"`)
  * `bogota`: `{ "min": null, "max": null }`
  * `medellin`: `{ "min": null, "max": null }`
  * `cartagena`: `{ "min": null, "max": null }`
  * `other`: `{ "min": null, "max": null }`

*Example when verified:*
```json
"bogota": { "min": 15000, "max": 28000, "status": "VERIFIED" }
```

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
