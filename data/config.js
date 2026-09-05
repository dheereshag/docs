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
 * Historical Salary Slips / Invoices Data (2023 Tenure)
 */
export const ALL_INVOICES = [
  createInvoice({
    monthLabel: "February 2023",
    no: "ONTOP872190",
    issueDate: "28/01/2023",
    dueDate: "05/02/2023",
    paymentDate: "05/02/2023",
    dueDateISO: "2023-02-05",
    rate: 82.3512,
    metadataDate: new Date("2023-03-09T01:22:31Z"),
  }),
  createInvoice({
    monthLabel: "March 2023",
    no: "ONTOP913452",
    issueDate: "28/02/2023",
    dueDate: "05/03/2023",
    paymentDate: "05/03/2023",
    dueDateISO: "2023-03-05",
    rate: 82.2415,
    metadataDate: new Date("2023-04-09T01:22:31Z"),
  }),
  createInvoice({
    monthLabel: "April 2023",
    no: "ONTOP948120",
    issueDate: "28/03/2023",
    dueDate: "05/04/2023",
    paymentDate: "05/04/2023",
    dueDateISO: "2023-04-05",
    rate: 82.1105,
    metadataDate: new Date("2023-05-09T01:22:31Z"),
  }),
  createInvoice({
    monthLabel: "May 2023",
    no: "ONTOP985259",
    issueDate: "28/04/2023",
    dueDate: "05/05/2023",
    paymentDate: "05/05/2023",
    dueDateISO: "2023-05-05",
    rate: 82.1524,
    metadataDate: new Date("2023-06-09T01:22:31Z"),
  }),
  createInvoice({
    monthLabel: "June 2023",
    no: "ONTOP1029418",
    issueDate: "28/05/2023",
    dueDate: "05/06/2023",
    paymentDate: "05/06/2023",
    dueDateISO: "2023-06-05",
    rate: 82.2618,
    metadataDate: new Date("2023-07-09T01:22:31Z"),
  }),
  createInvoice({
    monthLabel: "July 2023",
    no: "ONTOP1074823",
    issueDate: "28/06/2023",
    dueDate: "05/07/2023",
    paymentDate: "05/07/2023",
    dueDateISO: "2023-07-05",
    rate: 82.1402,
    metadataDate: new Date("2023-08-09T01:22:31Z"),
  }),
];

export const SLIP_CONFIG = {
  // Configured for last 3 months of tenure: May, June, July 2023
  slipCount: 3,

  getActiveInvoicesSync(count = SLIP_CONFIG.slipCount) {
    return ALL_INVOICES.slice(-count);
  },

  async getActiveInvoices(count = SLIP_CONFIG.slipCount) {
    const active = ALL_INVOICES.slice(-count);
    for (const inv of active) {
      if (inv.dueDateISO) {
        inv.rate = await fetchHistoricalExchangeRate(inv.dueDateISO, inv.rate);
      }
    }
    return active;
  },
};
