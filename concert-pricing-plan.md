# Concert Pricing Calculator — Plan

## Top-Level Overview

Build a **React + Vite** single-page web application that lets IBM account sellers quickly estimate how many Resource Units (RUs) a customer needs and the resulting list price — without needing to call Alec.

The user inputs:
- Which Concert capabilities they need (use-case checkboxes)
- The quantity for each selected capability (# of apps, servers, certs, workflows, etc.)
- A % discount for their account

The app outputs:
- Total RU count
- Which **T-shirt size** that maps to (XSmall/Small/Medium/Large)
- List price (per RU × total RUs) and discounted price
- A breakdown table showing RU contribution per capability
- An export of the estimate (copy to clipboard or download as CSV/PDF) for sharing with the customer

The pricing data (RU ratios, part prices, T-shirt thresholds) will be stored in a single constants/data file — easy to update when IBM changes pricing without touching UI code.

**Tech stack:** React + Vite (TypeScript), no backend required. Deployable to Vercel or GitHub Pages with a single command for future team-wide rollout.

---

## Sub-Tasks

---

### Sub-Task 1 — Project Scaffolding

**Intent**
Set up the Vite + React + TypeScript project with a clean folder structure, install dependencies, and verify the dev server runs.

**Expected Outcomes**
- `npm run dev` starts a working local dev server
- Project structure follows a predictable layout (`src/components/`, `src/data/`, `src/utils/`)
- Basic styles/reset in place (Tailwind CSS via CDN or a minimal CSS file)

**Todo List**
1. Scaffold project with `npm create vite@latest . -- --template react-ts`
2. Install dependencies (`npm install`)
3. Remove Vite boilerplate (default App content, logo, etc.)
4. Add a `src/data/` folder and `src/components/` folder
5. Add a simple global CSS reset / base styles
6. Verify `npm run dev` runs without errors

**Relevant Context**
- Repo root: `Concert-Pricing/`
- No existing source files — greenfield

**Status:** [ ] pending

---

### Sub-Task 2 — Pricing & RU Data Constants

**Intent**
Encode all domain knowledge (RU ratios, T-shirt sizes, part prices, discount logic) into a single versioned data file so the UI never hard-codes business rules and pricing updates are a one-file change.

**Expected Outcomes**
- `src/data/pricingData.ts` exports:
  - `CAPABILITIES` array: each entry has `id`, `label`, `useCase`, `description`, `ruPerUnit`, `unitLabel`, and for Compliance an additional `ruPerFramework` field
  - `TSHIRT_SIZES` array: XSmall=200 RU, Small=500 RU, Medium=1000 RU, Large=1500 RU (with capability breakdowns for reference)
  - `PARTS` array: the 9 On-Prem Software License line items (part number, description, list price per RU)
  - `DEFAULT_PART` pointing to `D0MK4ZX` (License + SW S&S, $6,360/RU)

**RU Ratios to encode (Concert Standard RU Model):**
| Capability | Ratio |
|---|---|
| Vulnerability Management | 3 RU per application |
| Certificate Health | 1 RU per 10 certificates |
| Compliance Management | 3 RU per framework + 2 RU per application framework applied to |
| Secure Coder (Add-On) | 1 RU per application |
| Resilience Posture Assessment | 5 RU per application |
| Concert Workflows | 5 RU per deployed workflow |
| Essentials App Performance Mgmt | 1 RU per 7 managed virtual servers |
| Standard App Performance Mgmt | 1 RU per 2 managed virtual servers |
| Optimization | 1 RU per 5 managed virtual servers |

**T-Shirt Size thresholds:**
| Size | RUs |
|---|---|
| XSmall | 200 |
| Small | 500 |
| Medium | 1000 |
| Large | 1500 |

**Todo List**
1. Create `src/data/pricingData.ts`
2. Define and export `CAPABILITIES` with all 9 capabilities and their RU ratios
3. Define and export `TSHIRT_SIZES` with RU thresholds
4. Define and export `PARTS` with all 9 On-Prem part line items and prices per RU
5. Export a `DEFAULT_PART_ID` constant

**Relevant Context**
- All values sourced from the "Concert Standard RU Model – Ratio Table" slide
- Parts and pricing sourced from the "Parts and Pricing – PID 5900BBE" slide (updated prices: D0MK4ZX = $6,360, E0MK2ZX = $1,270, etc.)

**Status:** [ ] pending

---

### Sub-Task 3 — RU Calculation Utility

**Intent**
Write a pure TypeScript utility function that takes user inputs and returns total RUs, per-capability RU breakdown, T-shirt size match, list price, and discounted price. Keeping this logic separate from UI makes it easy to test and reuse.

**Expected Outcomes**
- `src/utils/calculatePricing.ts` exports a `calculatePricing(inputs)` function
- Input type covers all capability quantities, selected part ID, and discount %
- Output type includes: `totalRUs`, `breakdown` (per capability), `tshirtSize`, `listPrice`, `discountedPrice`
- Compliance calculation handles the dual-input case (# frameworks + # apps)

**Todo List**
1. Create `src/utils/calculatePricing.ts`
2. Define `PricingInputs` and `PricingResult` TypeScript types
3. Implement per-capability RU calculation (including Compliance's framework + app formula)
4. Sum total RUs
5. Match to nearest T-shirt size (round up to next size if between thresholds)
6. Look up selected part price and multiply by total RUs for list price
7. Apply discount % to produce discounted price

**Relevant Context**
- Data file: `src/data/pricingData.ts` (Sub-Task 2)
- Compliance formula: `(# frameworks × 3) + (# apps × 2)`
- Certificate formula: `ceil(# certs / 10)`

**Status:** [ ] pending

---

### Sub-Task 4 — Capability Input Form (UI)

**Intent**
Build the main input form where the seller checks which capabilities the customer needs and enters quantities. This is the core UX of the tool.

**Expected Outcomes**
- `src/components/CapabilityForm.tsx` renders a grouped list of capabilities by use case (Protect, Resilience, Workflows, Observe, Optimize)
- Each capability row has a checkbox to enable it and a number input for quantity
- Compliance Management shows two number inputs (# frameworks, # apps)
- A `% Discount` field at the bottom (0–100)
- A `Part Type` dropdown showing **all 9 On-Prem part types** to select which license to price against (defaulting to D0MK4ZX)
- "Calculate" button triggers the pricing calculation
- Form is controlled (state lifted to `App.tsx`)

**Todo List**
1. Create `src/components/CapabilityForm.tsx`
2. Group capabilities by use case using `CAPABILITIES` from `pricingData.ts`
3. Render checkbox + quantity input per capability
4. Add special dual-input handling for Compliance Management
5. Add discount % input field
6. Add part type dropdown populated from all 9 entries in `PARTS`
7. Wire "Calculate" button to call `calculatePricing()` and pass results up

**Relevant Context**
- Capability list and groupings: `src/data/pricingData.ts`
- Calculation logic: `src/utils/calculatePricing.ts`

**Status:** [ ] pending

---

### Sub-Task 5 — Results Display (UI)

**Intent**
Build the results panel that shows total RUs, T-shirt size recommendation, pricing, and a per-capability breakdown — the core output sellers will use when talking to customers.

**Expected Outcomes**
- `src/components/PricingResults.tsx` renders when calculation has been run
- Shows: Total RUs, matched T-shirt size (with badge color), List Price, Discounted Price
- Shows a breakdown table: Capability | Quantity | RUs contributed
- T-shirt size section also shows what the customer can do at that tier (from `TSHIRT_SIZES` reference data)
- Clear visual separation from the input form
- Export actions available: "Copy to Clipboard" and "Download CSV"

**Todo List**
1. Create `src/components/PricingResults.tsx`
2. Display total RU count prominently
3. Display T-shirt size with a colored badge (XS=gray, S=blue, M=purple, L=green)
4. Display list price and discounted price (formatted as USD currency)
5. Render per-capability breakdown table
6. Show the T-shirt size description (what clients can do at that tier)
7. Add a "Recalculate" / "Reset" button to clear results and return to form
8. Add "Copy to Clipboard" button — copies a plain-text summary of the estimate
9. Add "Download CSV" button — triggers a browser download of a `.csv` file with the full breakdown

**Relevant Context**
- Result types defined in `src/utils/calculatePricing.ts`
- T-shirt size descriptions: `src/data/pricingData.ts`
- CSV export: use browser's native `Blob` + `URL.createObjectURL` — no library needed

**Status:** [ ] pending

---

### Sub-Task 6 — App Assembly & Polish

**Intent**
Wire all components together in `App.tsx`, add IBM Concert branding, and ensure the app is clean enough for sellers to use without instruction.

**Expected Outcomes**
- `App.tsx` composes `CapabilityForm` and `PricingResults` with shared state
- Page has an IBM Concert header/title
- App is responsive enough to use on a laptop screen
- `README.md` updated with setup instructions (`npm install` + `npm run dev`)

**Todo List**
1. Update `App.tsx` to manage shared state (inputs + results)
2. Add a simple header with "IBM Concert Pricing Calculator" title
3. Apply consistent spacing and layout (side-by-side on wide screens, stacked on narrow)
4. Update `README.md` with local setup and run instructions
5. Run `npm run build` to confirm production build succeeds with no TypeScript errors

**Relevant Context**
- All components: `src/components/`
- Utility: `src/utils/calculatePricing.ts`

**Status:** [ ] pending

---

## Architecture Diagram

```
App.tsx  (state: inputs, results)
├── CapabilityForm.tsx  →  calls calculatePricing()  →  sets results
└── PricingResults.tsx  ←  reads results
         ↑                        ↑
src/data/pricingData.ts    src/utils/calculatePricing.ts
```
