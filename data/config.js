/**
 * Single Source of Truth (SSOT) Document Suite Configuration
 * Centralizes all candidate details, employment contracts, dates,
 * financial calculations, bank details, and slip generation settings.
 */

export const CANDIDATE_DATA = {
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

export const EMPLOYMENT_DATA = {
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
    // Offer Letter generated June 05, 2025 afternoon
    offerLetterMetadataDate: new Date(2025, 5, 5, 14, 30, 0),
    // Relieving & Experience Letters generated September 30, 2026 morning
    relievingLetterMetadataDate: new Date(2026, 8, 30, 11, 0, 0),
    experienceLetterMetadataDate: new Date(2026, 8, 30, 11, 30, 0),
  },
};

export const BANK_DATA = {
  accountHolder: "Kaushlendra Pratap Singh",
  accountType: "Savings",
  accountNumber: "8199450523",
  branch: "Indiranagar Branch",
  ifsc: "IDIB000I522",
  currency: "INR",
  openingBalance: 15450.5,
  password: "KAUSHLENDRA85492004",
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
 * Creates an invoice descriptor with dynamic getters for amountInr, rateText, and amountUsd.
 */
function createInvoice({
  monthLabel,
  buyer = EMPLOYMENT_DATA.buyerCompany,
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
      return `${EMPLOYMENT_DATA.monthlySalaryInr.toLocaleString("en-IN")} INR`;
    },
    get rateText() {
      return `1 USD = ${Number(this.rate).toFixed(5)} INR`;
    },
    get amountUsd() {
      const usd = EMPLOYMENT_DATA.monthlySalaryInr / this.rate;
      return `${usd.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} USD`;
    },
  };
}

/**
 * Helper to get a random integer in [min, max].
 */
function getRandomStep(min = 35000, max = 48000, rng = Math.random) {
  return Math.floor(rng() * (max - min + 1)) + min;
}

/**
 * Generates invoice descriptors dynamically in a loop backward from the fixed last month.
 * Monthly invoice sequence numbers decrement by randomized steps to reflect real-world monthly volumes.
 *
 * @param {Object} [options]
 * @param {number} [options.count=3] - Number of monthly slips to generate
 * @param {number} [options.endYear=2023] - Ending year of employment
 * @param {number} [options.endMonth=7] - Ending month (1-12)
 * @param {number} [options.dueDay=5] - Due and payment day of month
 * @param {number} [options.baseInvoiceNumber=1074823] - Ending month invoice number
 * @param {number} [options.minStep=35000] - Minimum monthly sequence step
 * @param {number} [options.maxStep=48000] - Maximum monthly sequence step
 * @param {number|string|null} [options.seed=null] - Optional seed for deterministic pseudo-random steps
 * @returns {Array<Object>} Chronologically ordered invoice objects
 */
export function generateInvoiceSlips({
  count = 3,
  endYear = 2023,
  endMonth = 7,
  dueDay = 5,
  baseInvoiceNumber = 1074823,
  minStep = 35000,
  maxStep = 48000,
  seed = null,
} = {}) {
  // Configurable random generator (seeded PRNG if seed provided, else Math.random)
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

  // Precompute random steps backward from baseInvoiceNumber
  const invoiceNumbers = [baseInvoiceNumber];
  for (let stepIdx = 1; stepIdx < count; stepIdx++) {
    const step = getRandomStep(minStep, maxStep, rng);
    invoiceNumbers.push(invoiceNumbers[stepIdx - 1] - step);
  }
  // Reverse so index 0 is oldest month and last index is baseInvoiceNumber (July)
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

    // Issue date is on the 28th of the preceding month
    const prevDate = new Date(y, m - 2, 28);
    const prevY = prevDate.getFullYear();
    const prevMPad = pad(prevDate.getMonth() + 1);
    const issueDate = `28/${prevMPad}/${prevY}`;

    // Metadata creation timestamp on 9th of the following month at 01:22:31Z
    const metadataDate = new Date(Date.UTC(y, m, 9, 1, 22, 31));

    // Randomized Ontop global invoice sequence number
    const invNo = `ONTOP${invoiceNumbers[count - 1 - i]}`;

    invoices.push(
      createInvoice({
        monthLabel,
        no: invNo,
        issueDate,
        dueDate,
        paymentDate,
        dueDateISO,
        rate: 82.15, // fallback rate until live FX rate is fetched
        metadataDate,
      }),
    );
  }

  return invoices;
}

export const SLIP_CONFIG = {
  // Fixed anchor: last working month of employment (August 2026)
  lastMonth: {
    year: 2026,
    month: 8,
    day: 5,
  },
  // Default count of slips (e.g. 3 for June-August 2026, or 6 for March-August 2026)
  slipCount: 3,

  getActiveInvoicesSync(count = SLIP_CONFIG.slipCount) {
    return generateInvoiceSlips({
      count,
      endYear: SLIP_CONFIG.lastMonth.year,
      endMonth: SLIP_CONFIG.lastMonth.month,
      dueDay: SLIP_CONFIG.lastMonth.day,
    });
  },

  async getActiveInvoices(count = SLIP_CONFIG.slipCount) {
    const active = this.getActiveInvoicesSync(count);
    for (const inv of active) {
      if (inv.dueDateISO) {
        inv.rate = await fetchHistoricalExchangeRate(inv.dueDateISO, inv.rate);
      }
    }
    return active;
  },
};

/**
 * Historical Salary Slips / Invoices Data (Reference set generated dynamically via loop)
 */
export const ALL_INVOICES = generateInvoiceSlips({
  count: 6,
  endYear: SLIP_CONFIG.lastMonth.year,
  endMonth: SLIP_CONFIG.lastMonth.month,
  dueDay: SLIP_CONFIG.lastMonth.day,
});
