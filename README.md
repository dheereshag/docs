# Document Generation Suite

A high-fidelity document templating and PDF generation suite built with modern web technologies, Puppeteer, and Tailwind CSS.

## Architecture & Design System

The suite generates production-grade PDF documents from HTML/CSS templates:

- **Invoice Suite (`invoice/`)**: A4 contract invoice template with dynamic month/data replacement, multi-currency conversion, and precise PDF metadata injection.
- **Bank Statement Suite (`bank/`)**: 2-page account statement template with watermarking, 10-transaction ledger validation, running balances, and AES-128 PDF password encryption.
- **TaxHoa HR Suite (`taxhoa/`)**: Standardized company HR letters (Offer Letter, Experience Letter, Relieving Letter) with custom web components.

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
# Generate invoices for May, June, and July
pnpm run build:invoice-pdf

# Generate password-protected bank statement PDF
pnpm run build:bank-pdf

# Generate TaxHoa HR documents
pnpm run build:taxhoa-pdf
```

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
