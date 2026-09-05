/**
 * Single Source of Truth (SSOT) Document Suite Configuration
 * Centralizes all candidate details, employment contracts, dates,
 * financial calculations, bank details, and slip generation settings.
 */

export const CANDIDATE_DATA = {
  name: "Aditya Tiwari",
  firstName: "Aditya",
  role: "Full Stack Developer Trainee",
  secondaryRole: "Full Stack Developer Trainee",
  pan: "CJPMT4530P",
  address: {
    line1: "12/202, River wood park, near palava",
    city: "Dombivli East",
    state: "Maharashtra",
    pinCode: "421201",
    formattedInline: "12/202, River wood park, near palava, Dombivli East, Maharashtra - 421201",
    bankAddress: "12/202, River wood park,\nnear palava, Dombivli East,\nMaharashtra - 421201",
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
  monthlySalaryInr: 25000,
  get formattedSalaryInr() {
    return `INR ${this.monthlySalaryInr.toLocaleString("en-IN")}`;
  },
  dates: {
    offerDate: "June 10, 2022",
    offerDeadline: "June 14, 2022",
    joiningDate: "June 16, 2022",
    relievingDate: "July 05, 2023",
    issueDate: "July 07, 2023",
  },
  metadata: {
    // Offer Letter generated June 10, 2022 afternoon
    offerLetterMetadataDate: new Date(2022, 5, 10, 14, 32, 56),
    // Relieving & Experience Letters generated July 07, 2023 morning
    relievingLetterMetadataDate: new Date(2023, 6, 7, 11, 5, 25),
    experienceLetterMetadataDate: new Date(2023, 6, 7, 11, 33, 47),
  },
};

export const BANK_DATA = {
  accountHolder: "Aditya Tiwari",
  accountType: "Savings",
  accountNumber: "8199450523",
  branch: "DOMBIVLI EAST",
  ifsc: "IDIB000K760",
  currency: "INR",
  openingBalance: 12450.5,
  password: "ADITYA85492004",
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
 * Generates invoice descriptors dynamically in a loop backward from the fixed last month.
 *
 * @param {Object} [options]
 * @param {number} [options.count=3] - Number of monthly slips to generate
 * @param {number} [options.endYear=2023] - Ending year of employment
 * @param {number} [options.endMonth=7] - Ending month (1-12)
 * @param {number} [options.dueDay=5] - Due and payment day of month
 * @param {number} [options.baseInvoiceNumber=1074823] - Ending month invoice number
 * @param {number} [options.monthlyInvoiceStep=45405] - Ontop sequence decrement step
 * @returns {Array<Object>} Chronologically ordered invoice objects
 */
export function generateInvoiceSlips({
  count = 3,
  endYear = 2023,
  endMonth = 7,
  dueDay = 5,
  baseInvoiceNumber = 1074823,
  monthlyInvoiceStep = 45405,
} = {}) {
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

    // Approximate Ontop global invoice sequence number
    const invNo = `ONTOP${baseInvoiceNumber - i * monthlyInvoiceStep}`;

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
  // Fixed anchor: last working month of employment (July 2023)
  lastMonth: {
    year: 2023,
    month: 7,
    day: 5,
  },
  // Default count of slips (e.g. 3 for May-July 2023, or 6 for Feb-July 2023)
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
