# IBM Concert Pricing Calculator

A web application for IBM account sellers to estimate Resource Units (RUs) and list pricing for IBM Concert (On-Prem, PID 5900BBE) — without needing to manually reference pricing slides or contact a specialist.

## What it does

- Select which Concert capabilities a customer needs (Vulnerability Management, Resilience Posture, Certificate Health, Compliance Management, Secure Coder, Concert Workflows, App Performance Mgmt, Optimization)
- Enter quantities for each selected capability
- Enter the account's % discount
- Select the license type (all 9 On-Prem part types available)
- Get: total RU count, T-shirt size recommendation, list price, discounted price, and a full capability breakdown
- Export the estimate as a **CSV** or copy it to clipboard

## Getting started

### Prerequisites

- [Node.js](https://nodejs.org/) v18 or later

### Run locally

```bash
npm install
npm run dev
```

Then open [http://localhost:5173](http://localhost:5173) in your browser.

### Build for deployment

```bash
npm run build
```

The production-ready files will be in the `dist/` folder. Deploy to Vercel, GitHub Pages, or any static hosting provider.

## RU Ratios (Concert Standard RU Model)

| Capability | Ratio |
|---|---|
| Vulnerability Management | 3 RU per application |
| Certificate Health | 1 RU per 10 certificates |
| Compliance Management | 3 RU per framework + 2 RU per application |
| Secure Coder (Add-On) | 1 RU per application |
| Resilience Posture Assessment | 5 RU per application |
| Concert Workflows | 5 RU per deployed workflow |
| Essentials App Performance Mgmt | 1 RU per 7 managed virtual servers |
| Standard App Performance Mgmt | 1 RU per 2 managed virtual servers |
| Optimization | 1 RU per 5 managed virtual servers |

## T-Shirt Sizes

| Size | RUs |
|---|---|
| XSmall | 200 |
| Small | 500 |
| Medium | 1,000 |
| Large | 1,500 |

## Updating pricing

All business rules (RU ratios, part prices, T-shirt thresholds) live in [`src/data/pricingData.ts`](src/data/pricingData.ts). When IBM updates pricing, edit that single file — no UI code changes needed.
