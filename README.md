# Document Generation Suite

A high-fidelity document templating and PDF generation suite built with modern web technologies, Puppeteer, and Tailwind CSS.

## Architecture & Configuration

The suite is driven by a **Single Source of Truth (SSOT)** configuration module located at [`data/config.js`](file:///Users/d/Documents/docs/data/config.js).

### Centralized Configuration (`data/config.js`)

All candidate, employment, financial, bank, TaxHoa letters, and invoice settings are consolidated in a single configuration file:

- **`CANDIDATE_CONFIG`**: Candidate full name, first name, role, secondary role, PAN / Tax ID, and address with PIN code.
- **`EMPLOYMENT_CONFIG`**: Company names, monthly salary amount, employment dates (offer date, joining date, relieving date, issue date), and document metadata dates.
- **`BANK_CONFIG`**: Account details (holder, number, IFSC, branch, type, currency), opening balance, transaction ledger (16 items), statement page limit, expected transaction validation count, PDF password, and JasperReports/OpenPDF metadata.
- **`TAXHOA_CONFIG`**: Organization branding, support contacts, document templates for Offer/Relieving/Experience letters, clause text, and Skia/PDF metadata.
- **`INVOICE_CONFIG`**: Invoice slip generation parameters (`slipCount`, `lastMonth`, generator steps), Ontop corporate disclaimer details, live ECB FX rate integration, and iText PDF metadata.
- **`CONFIG`**: Unified default export bundling all individual configurations (`candidate`, `employment`, `bank`, `taxhoa`, `invoice`).

### Document Suites

- **Invoice Suite (`invoice/`)**: A4 contractor invoice templates dynamically injected with candidate details, multi-currency conversion, and precise PDF metadata via `INVOICE_CONFIG`.
- **Bank Statement Suite (`bank/idbi/`)**: 2-page account statement with watermarking, transaction ledger validation (16 transactions), running balances, and AES-128 PDF password protection matching `BANK_CONFIG.password`.
- **TaxHoa HR Suite (`taxhoa/`)**: Company HR letters (Offer Letter, Experience Letter, Relieving Letter) with standardized web components, dynamic DOM data injection, and aligned PDF metadata dates via `TAXHOA_CONFIG`.
- **Provisional Degree Certificate Suite (`provisional/`)**: Pixel-accurate A4 provisional degree certificate driven by Single Source of Truth [`provisional/config.js`](file:///Users/d/Documents/docs/provisional/config.js), binding dynamically into [`index.html`](file:///Users/d/Documents/docs/provisional/index.html) DOM elements, and printable directly to PDF with synchronized metadata via `pnpm run build:provisional`.

### Inline Tailwind CSS Styling

Templates use utility-first inline Tailwind CSS classes directly within element `class` attributes (`@tailwindcss/browser@4` runtime):

- Layouts, typography, borders, and print states (`print:*`) are applied inline on elements.
- Semantic class names (such as `.table-row`, `.col-amount-inr`, `.meta-col`) are preserved for Puppeteer DOM queries during automated data injection.
- Minimal `@page` rules are maintained in `<style>` blocks for printer page dimension control (`A4`).

## Prerequisites

- [Node.js](https://nodejs.org/) (v20+)
- [pnpm](https://pnpm.io/) (`>=11.5.1`)
- Google Chrome (for headless Puppeteer PDF rendering at `/Applications/Google Chrome.app/Contents/MacOS/Google Chrome`)
- Python 3 with `pypdf` (for PDF password encryption)

## Installation

```bash
pnpm install
```

## PDF Generation Commands

Generate individual documents or test builds:

```bash
# Generate invoices / salary slips (default 3 months, configurable in data/config.js)
pnpm run build:invoice

# Generate password-protected bank statement PDF
pnpm run build:bank

# Generate TaxHoa HR documents (Offer, Experience, Relieving letters)
pnpm run build:taxhoa

# Generate Provisional Degree Certificate PDF
pnpm run build:provisional
```

## Configuring 3 vs 6 Months of Salary Slips

In [`data/config.js`](file:///Users/d/Documents/docs/data/config.js), slips are generated dynamically via `INVOICE_CONFIG` backward from the fixed `lastMonth`:

```javascript
export const INVOICE_CONFIG = {
  // Fixed anchor: last working month of employment
  lastMonth: {
    year: 2026,
    month: 10, // October 2026
    day: 5,
  },
  // Set to 6 for May–October 2026, or 3 for August–October 2026
  slipCount: 6,
  // ...
};
```

Running `pnpm run build:invoice` will automatically generate invoice PDFs with daily historical FX rates fetched from the ECB API.

## Code Quality & Verification

```bash
# Run linter
pnpm run lint

# Auto-fix lint issues
pnpm run lint:fix

# Check code formatting
pnpm run fmt:check

# Format files
pnpm run fmt
```
