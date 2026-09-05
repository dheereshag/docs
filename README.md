# Document Generation Suite

A high-fidelity document templating and PDF generation suite built with modern web technologies, Puppeteer, and Tailwind CSS.

## Architecture & Configuration

The suite is driven by a **Single Source of Truth (SSOT)** configuration module located at [`data/config.js`](file:///Users/d/Documents/docs/data/config.js).

### Centralized Configuration (`data/config.js`)

All candidate, employment, financial, and date variables are centralized in one file:

- **`CANDIDATE_DATA`**: Candidate full name, first name, role, secondary role, PAN / Tax ID, and address with PIN code.
- **`EMPLOYMENT_DATA`**: Company names, monthly salary amount, employment dates (offer date, joining date, relieving date, issue date), and PDF creation metadata dates.
- **`BANK_DATA`**: Account holder, account number, IFSC, branch, opening balance, and PDF statement password.
- **`SLIP_CONFIG`**: Controls invoice/salary slip generation duration (`slipCount: 3` or `6`). Calling `SLIP_CONFIG.getActiveInvoices()` automatically provides either the last 3 or last 6 months of invoices with synchronized amounts and metadata.

### Document Suites

- **Invoice Suite (`invoice/`)**: A4 contractor invoice templates dynamically injected with candidate details, multi-currency conversion, and precise PDF metadata.
- **Bank Statement Suite (`bank/`)**: 2-page account statement with watermarking, transaction ledger validation (10 transactions), running balances, and AES-128 PDF password protection matching `BANK_DATA.password`.
- **TaxHoa HR Suite (`taxhoa/`)**: Company HR letters (Offer Letter, Experience Letter, Relieving Letter) with standardized web components, dynamic DOM data injection, and aligned PDF metadata dates.

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
pnpm run build:invoice-pdf

# Generate password-protected bank statement PDF
pnpm run build:bank-pdf

# Generate TaxHoa HR documents (Offer, Experience, Relieving letters)
pnpm run build:taxhoa-pdf
```

## Configuring 3 vs 6 Months of Salary Slips

In [`data/config.js`](file:///Users/d/Documents/docs/data/config.js), modify `slipCount`:

```javascript
export const SLIP_CONFIG = {
  // Set to 3 for May–July 2026, or 6 for Feb–July 2026
  slipCount: 6,
  getActiveInvoices(count = SLIP_CONFIG.slipCount) {
    return ALL_INVOICES.slice(-count);
  },
};
```

Running `pnpm run build:invoice-pdf` will automatically generate all 6 monthly invoice PDFs.

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
