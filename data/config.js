/**
 * Single Source of Truth (SSOT) Document Suite Configuration
 * Centralizes all candidate details, employment contracts, dates,
 * financial calculations, bank details, TaxHoa HR letters, and invoice settings into one file.
 */

export const CANDIDATE_CONFIG = {
  name: "Kaushlendra Pratap Singh",
  firstName: "Kaushlendra",
  role: "Software Engineer",
  secondaryRole: "Software Engineer",
  pan: "PKWPS0547H",
  email: "kpratapsingh380@gmail.com",
  phone: "7389451139",
  address: {
    line1: "Bankasiya Shivratana Singh, Bankasiya",
    city: "Gonda",
    state: "Uttar Pradesh",
    pinCode: "271302",
    formattedInline: "Bankasiya Shivratana Singh, Bankasiya, Gonda, Uttar Pradesh - 271302",
    bankAddress: "Bankasiya Shivratana Singh,\nBankasiya, Gonda,\nUttar Pradesh - 271302",
  },
};

export const EMPLOYMENT_CONFIG = {
  company: "TaxHoa (Amoeba Global FZ-LLC)",
  companyShort: "TaxHoa",
  buyerCompany: "Amoeba Global FZ LLC",
  buyerAddress: "PO Box 10055, Ras Al Khaimah UNITED ARAB EMIRATES",
  buyerTaxId: "0000004036244",
  founderName: "Sachin",
  founderTitle: "Founder & CEO",
  monthlySalaryInr: 92000,
  get formattedSalaryInr() {
    return `INR ${this.monthlySalaryInr.toLocaleString("en-IN")}`;
  },
  dates: {
    offerDate: "June 05, 2025",
    offerDeadline: "June 07, 2025",
    joiningDate: "June 09, 2025",
    relievingDate: "September 30, 2026",
    issueDate: "September 30, 2026",
  },
  metadata: {
    offerLetterDate: new Date(2025, 5, 5, 14, 30, 0),
    relievingLetterDate: new Date(2026, 8, 30, 11, 0, 0),
    experienceLetterDate: new Date(2026, 8, 30, 11, 30, 0),
  },
};

export const BANK_CONFIG = {
  accountDetails: {
    get name() {
      return CANDIDATE_CONFIG.name;
    },
    type: "Savings",
    number: "8199450523",
    get address() {
      return CANDIDATE_CONFIG.address.bankAddress;
    },
    branch: "Indiranagar Branch",
    ifsc: "IDIB000I522",
    currency: "INR",
  },
  openingBalance: 144111.5,
  page1ItemCount: 5,
  expectedTxnCount: 16,
  password: "KAUSHLENDRA85492004",
  pdfMetadata: {
    creator: "JasperReports Library version 6.21.5-74d586df47b25dbd05bd0957999819196e59934a",
    producer: "OpenPDF 2.0.2",
    encryptionAlgorithm: "AES-128",
  },
  transactions: [
    // 1. August opening small debit
    {
      date: "02 Aug 2026",
      details:
        "YESB0YBLUPI/Mr\nSANTOSHSAH /XXXXX\n/q607334392@ybl\n/UPI/657610294812/Paid\nvia SuperMoney",
      debit: 45.0,
      credit: 0,
    },
    // 2. August Ontop Salary Credit
    {
      date: "05 Aug 2026",
      details: "INWREMIT-G0822330980154-\nONTOP HOLDINGS INC-\nTRANGLO",
      debit: 0,
      credit: EMPLOYMENT_CONFIG.monthlySalaryInr,
    },
    // 3. August rent / large debit
    {
      date: "12 Aug 2026",
      details:
        "ICIC0DC0099/Ttonnik\n/XXXXX43449/getepay.mba\nndhan111649@icici\n/UPI/657748920153/Paid\nvia SuperMoney",
      debit: 25000.0,
      credit: 0,
    },
    // 4. August personal transfer
    {
      date: "18 Aug 2026",
      details:
        "FDRL0002540/MALAY\nGUHA/XXXXX\n/malayguha1@fbl\n/UPI/657803317552/Paid\nvia SuperMoney",
      debit: 15000.0,
      credit: 0,
    },
    // 5. August Swiggy debit
    {
      date: "27 Aug 2026",
      details:
        "PYTM0123456/SWIGGY\n/XXXXX89123/swiggy@icici\n/UPI/657812904812/Paid\nvia SuperMoney",
      debit: 320.0,
      credit: 0,
    },
    // 6. September Zepto grocery
    {
      date: "02 Sep 2026",
      details: "PYTM0123456/ZEPTO\n/XXXXX31920/zepto@icici\n/UPI/657890123841/Paid\nvia SuperMoney",
      debit: 120.0,
      credit: 0,
    },
    // 7. September Ontop Salary Credit
    {
      date: "05 Sep 2026",
      details: "INWREMIT-G0822330980154-\nONTOP HOLDINGS INC-\nTRANGLO",
      debit: 0,
      credit: EMPLOYMENT_CONFIG.monthlySalaryInr,
    },
    // 8. September large transfer
    {
      date: "14 Sep 2026",
      details:
        "YESB0YBLUPI/Mr\nSANTOSHSAH /XXXXX\n/q607334392@ybl\n/UPI/657892019482/Paid\nvia SuperMoney",
      debit: 25000.0,
      credit: 0,
    },
    // 9. September Airtel broadband/mobile utility
    {
      date: "21 Sep 2026",
      details:
        "AIRTEL001/AIRTEL BILL\n/XXXXX51139/airtelpayment\n@icici/UPI/657899201482\n/Paid via SuperMoney",
      debit: 499.0,
      credit: 0,
    },
    // 10. September Zepto grocery
    {
      date: "24 Sep 2026",
      details: "PYTM0123456/ZEPTO\n/XXXXX31920/zepto@icici\n/UPI/657901847192/Paid\nvia SuperMoney",
      debit: 185.0,
      credit: 0,
    },
    // 11. September small self UPI
    {
      date: "30 Sep 2026",
      details:
        "SBIN0017586/KAUSHLEND\nRA PRATAPSINGH\n/XXXXX51139/7389451139\n@ptsbi/UPI/657904389623\n/Paid via SuperMoney",
      debit: 50.0,
      credit: 0,
    },
    // 12. October Swiggy debit
    {
      date: "02 Oct 2026",
      details:
        "PYTM0123456/SWIGGY\n/XXXXX89123/swiggy@icici\n/UPI/658001928412/Paid\nvia SuperMoney",
      debit: 240.0,
      credit: 0,
    },
    // 13. October Ontop Salary Credit
    {
      date: "05 Oct 2026",
      details: "INWREMIT-G0822330980154-\nONTOP HOLDINGS INC-\nTRANGLO",
      debit: 0,
      credit: EMPLOYMENT_CONFIG.monthlySalaryInr,
    },
    // 14. October rent / debit
    {
      date: "06 Oct 2026",
      details:
        "ICIC0DC0099/Ttonnik\n/XXXXX43449/getepay.mba\nndhan111649@icici\n/UPI/658019385012/Paid\nvia SuperMoney",
      debit: 20000.0,
      credit: 0,
    },
    // 15. October personal transfer
    {
      date: "15 Oct 2026",
      details:
        "YESB0YBLUPI/Mr\nSANTOSHSAH /XXXXX\n/q607334392@ybl\n/UPI/658049102834/Paid\nvia SuperMoney",
      debit: 25000.0,
      credit: 0,
    },
    // 16. October Zomato dining
    {
      date: "28 Oct 2026",
      details:
        "PYTM0123456/ZOMATO\n/XXXXX92817/zomato@icici\n/UPI/658102938471/Paid\nvia SuperMoney",
      debit: 350.0,
      credit: 0,
    },
  ],
};

export const TAXHOA_CONFIG = {
  organization: {
    brandTagline: "Tax Accounting, Simplified",
    address: "Ras Al Khaimah, 10055, AE",
    email: "support@taxhoa.com",
    founderName: "Sachin",
    founderTitle: "Founder & CEO",
    company: "TaxHoa (Amoeba Global FZ-LLC)",
    companyShort: "TaxHoa",
  },
  pdfMetadata: {
    author: "TaxHoa",
    creator: "TaxHoa",
    producer: "Skia/PDF m151",
  },
  offerLetter: {
    workingHours: "Monday to Friday, 10:00 AM - 7:00 PM IST.",
    benefits: [
      "Health insurance coverage starting from your first month of employment.",
      "30 days of paid vacation per calendar year.",
      "Paid sick leave in accordance with company policy.",
      "Access to professional learning and development programs.",
    ],
    employmentTerms:
      "This is an at-will employment relationship that may be terminated by either party with 30 days written notice. This offer is contingent upon your acceptance of the Employment Contract and company policies.",
  },
  documents: [
    {
      id: "relieving",
      htmlFile: "relieving-letter.html",
      pdfFilePrefix: "Relieving_Letter_",
      titlePrefix: "Relieving Letter - ",
      subject: "Relieving Letter",
      getMetadataDate: () => EMPLOYMENT_CONFIG.metadata.relievingLetterDate,
    },
    {
      id: "experience",
      htmlFile: "experience-letter.html",
      pdfFilePrefix: "Experience_Letter_",
      titlePrefix: "Experience Letter - ",
      subject: "Experience Letter",
      getMetadataDate: () => EMPLOYMENT_CONFIG.metadata.experienceLetterDate,
    },
    {
      id: "offer",
      htmlFile: "offer-letter.html",
      pdfFilePrefix: "Offer_Letter_",
      titlePrefix: "Offer Letter - ",
      subject: "Offer Letter",
      getMetadataDate: () => EMPLOYMENT_CONFIG.metadata.offerLetterDate,
    },
  ],
};

/**
 * Fetches daily historical exchange rate (USD to INR) for a given ISO date (YYYY-MM-DD)
 * using the open European Central Bank (Frankfurter) FX API.
 */
export async function fetchHistoricalExchangeRate(dateStr, fallbackRate = 82.15) {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 4000);
    const response = await fetch(`https://api.frankfurter.dev/v1/${dateStr}?base=USD&symbols=INR`, {
      signal: controller.signal,
    });
    clearTimeout(timeoutId);
    if (response.ok) {
      const data = await response.json();
      if (data?.rates?.INR) {
        return Number(data.rates.INR);
      }
    }
  } catch {
    // Gracefully keep fallback rate if offline or network times out
  }
  return fallbackRate;
}

/**
 * Helper to create an invoice descriptor with dynamic getters for amountInr, rateText, and amountUsd.
 */
function createInvoice({
  monthLabel,
  buyer = EMPLOYMENT_CONFIG.buyerCompany,
  no,
  issueDate,
  dueDate,
  paymentDate,
  dueDateISO,
  rate = 82.15,
  metadataDate,
}) {
  return {
    monthLabel,
    buyer,
    no,
    issueDate,
    dueDate,
    paymentDate,
    dueDateISO,
    rate,
    metadataDate,
    get amountInr() {
      return `${EMPLOYMENT_CONFIG.monthlySalaryInr.toLocaleString("en-IN")} INR`;
    },
    get rateText() {
      return `1 USD = ${Number(this.rate).toFixed(5)} INR`;
    },
    get amountUsd() {
      const usd = EMPLOYMENT_CONFIG.monthlySalaryInr / this.rate;
      return `${usd.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} USD`;
    },
  };
}

function getRandomStep(min = 35000, max = 48000, rng = Math.random) {
  return Math.floor(rng() * (max - min + 1)) + min;
}

/**
 * Generates invoice descriptors dynamically in a loop backward from the fixed last month.
 */
export function generateInvoiceSlips({
  count = 3,
  endYear = 2026,
  endMonth = 8,
  dueDay = 5,
  baseInvoiceNumber = 1074823,
  minStep = 35000,
  maxStep = 48000,
  seed = null,
} = {}) {
  let rng = Math.random;
  if (seed !== null && seed !== undefined) {
    let s =
      typeof seed === "string" ? seed.split("").reduce((a, c) => a + c.charCodeAt(0), 0) : seed;
    rng = () => {
      s |= 0;
      s = (s + 0x6d2b79f5) | 0;
      let t = Math.imul(s ^ (s >>> 15), 1 | s);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }

  const invoiceNumbers = [baseInvoiceNumber];
  for (let stepIdx = 1; stepIdx < count; stepIdx++) {
    const step = getRandomStep(minStep, maxStep, rng);
    invoiceNumbers.push(invoiceNumbers[stepIdx - 1] - step);
  }
  invoiceNumbers.reverse();

  const invoices = [];
  const pad = (n) => String(n).padStart(2, "0");

  for (let i = count - 1; i >= 0; i--) {
    const d = new Date(endYear, endMonth - 1 - i, 1);
    const y = d.getFullYear();
    const m = d.getMonth() + 1;
    const mPad = pad(m);
    const dayPad = pad(dueDay);

    const monthName = d.toLocaleString("en-US", { month: "long" });
    const monthLabel = `${monthName} ${y}`;

    const dueDate = `${dayPad}/${mPad}/${y}`;
    const paymentDate = `${dayPad}/${mPad}/${y}`;
    const dueDateISO = `${y}-${mPad}-${dayPad}`;

    const prevDate = new Date(y, m - 2, 28);
    const prevY = prevDate.getFullYear();
    const prevMPad = pad(prevDate.getMonth() + 1);
    const issueDate = `28/${prevMPad}/${prevY}`;

    const metadataDate = new Date(Date.UTC(y, m, 9, 1, 22, 31));
    const invNo = `ONTOP${invoiceNumbers[count - 1 - i]}`;

    invoices.push(
      createInvoice({
        monthLabel,
        no: invNo,
        issueDate,
        dueDate,
        paymentDate,
        dueDateISO,
        rate: 82.15,
        metadataDate,
      }),
    );
  }

  return invoices;
}

export const INVOICE_CONFIG = {
  pdfMetadata: {
    author: "Ontop Holdings Inc",
    creator: "Ontop Holdings Inc",
    producer: "iText® 5.5.13.3 ©2000-2026 iText Group NV (AGPL-version)",
    title: "Invoice",
    subject: "Contract",
    keywords: [],
  },
  company: {
    name: "Ontop Holdings Inc",
    address:
      "Ontop Holdings Inc. - 251 Little Falls Drive, Wilmington, New Castle County, Delaware, 19808 | www.getontop.com",
  },
  generator: {
    prefix: "ONTOP",
    baseInvoiceNumber: 1074823,
    minStep: 35000,
    maxStep: 48000,
    fallbackExchangeRate: 82.15,
  },
  lastMonth: {
    year: 2026,
    month: 10,
    day: 5,
  },
  slipCount: 6,

  getActiveInvoicesSync(count = INVOICE_CONFIG.slipCount) {
    return generateInvoiceSlips({
      count,
      endYear: INVOICE_CONFIG.lastMonth.year,
      endMonth: INVOICE_CONFIG.lastMonth.month,
      dueDay: INVOICE_CONFIG.lastMonth.day,
      baseInvoiceNumber: INVOICE_CONFIG.generator.baseInvoiceNumber,
      minStep: INVOICE_CONFIG.generator.minStep,
      maxStep: INVOICE_CONFIG.generator.maxStep,
    });
  },

  async getActiveInvoices(count = INVOICE_CONFIG.slipCount) {
    const active = this.getActiveInvoicesSync(count);
    for (const inv of active) {
      if (inv.dueDateISO) {
        inv.rate = await fetchHistoricalExchangeRate(inv.dueDateISO, inv.rate);
      }
    }
    return active;
  },
};

export const CONFIG = {
  candidate: CANDIDATE_CONFIG,
  employment: EMPLOYMENT_CONFIG,
  bank: BANK_CONFIG,
  taxhoa: TAXHOA_CONFIG,
  invoice: INVOICE_CONFIG,
};

export default CONFIG;
