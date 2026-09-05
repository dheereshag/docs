/**
 * Single Source of Truth (SSOT) Document Suite Configuration
 * Centralizes all candidate details, employment contracts, dates,
 * financial calculations, bank details, and slip generation settings.
 */

export const CANDIDATE_DATA = {
  name: "Aakash Jaiswal",
  firstName: "Aakash",
  role: "Software Engineer",
  secondaryRole: "Backend Engineer",
  pan: "CPPJ7376N",
  address: {
    line1: "Muhalla, Shahamohamdapur",
    city: "Azamgarh",
    state: "Uttar Pradesh",
    pinCode: "276404",
    formattedInline: "Muhalla, Shahamohamdapur, Azamgarh, Uttar Pradesh, 276404",
    bankAddress: "muhalla\nshahamohamdapur,\nMubarakpur, , POST\nMUBARAKPUR,\nAzamgarh, 276404",
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
    relievingDate: "July 31, 2026",
    issueDate: "August 25, 2026",
  },
  metadata: {
    // Offer Letter generated around June 05, 2025 afternoon
    offerLetterMetadataDate: new Date(2025, 5, 5, 14, 30, 0),
    // Relieving & Experience Letters generated around August 25, 2026
    relievingLetterMetadataDate: new Date(2026, 7, 25, 11, 0, 0),
    experienceLetterMetadataDate: new Date(2026, 7, 25, 11, 30, 0),
  },
};

export const BANK_DATA = {
  accountHolder: "Aakash Jaiswal",
  accountType: "Savings",
  accountNumber: "8199450523",
  branch: "JODHPUR PARK",
  ifsc: "IDIB000K760",
  currency: "INR",
  openingBalance: 12450.5,
  password: "AKASH85492004",
};

/**
 * Historical Salary Slips / Invoices Data (Up to 6 Months)
 */
export const ALL_INVOICES = [
  {
    monthLabel: "February 2026",
    buyer: EMPLOYMENT_DATA.buyerCompany,
    no: "ONTOP872190",
    issueDate: "28/01/2026",
    dueDate: "05/02/2026",
    paymentDate: "05/02/2026",
    dueDateISO: "2026-02-05",
    amountInr: `${EMPLOYMENT_DATA.monthlySalaryInr.toLocaleString("en-IN")} INR`,
    rateText: "1 USD = 95.84102 INR",
    amountUsd: "959.92 USD",
    metadataDate: new Date("2026-03-09T01:22:31Z"),
  },
  {
    monthLabel: "March 2026",
    buyer: EMPLOYMENT_DATA.buyerCompany,
    no: "ONTOP913452",
    issueDate: "28/02/2026",
    dueDate: "05/03/2026",
    paymentDate: "05/03/2026",
    dueDateISO: "2026-03-05",
    amountInr: `${EMPLOYMENT_DATA.monthlySalaryInr.toLocaleString("en-IN")} INR`,
    rateText: "1 USD = 95.72018 INR",
    amountUsd: "961.13 USD",
    metadataDate: new Date("2026-04-09T01:22:31Z"),
  },
  {
    monthLabel: "April 2026",
    buyer: EMPLOYMENT_DATA.buyerCompany,
    no: "ONTOP948120",
    issueDate: "28/03/2026",
    dueDate: "05/04/2026",
    paymentDate: "05/04/2026",
    dueDateISO: "2026-04-05",
    amountInr: `${EMPLOYMENT_DATA.monthlySalaryInr.toLocaleString("en-IN")} INR`,
    rateText: "1 USD = 95.61050 INR",
    amountUsd: "962.24 USD",
    metadataDate: new Date("2026-05-09T01:22:31Z"),
  },
  {
    monthLabel: "May 2026",
    buyer: EMPLOYMENT_DATA.buyerCompany,
    no: "ONTOP985259",
    issueDate: "28/04/2026",
    dueDate: "05/05/2026",
    paymentDate: "05/05/2026",
    dueDateISO: "2026-05-05",
    amountInr: `${EMPLOYMENT_DATA.monthlySalaryInr.toLocaleString("en-IN")} INR`,
    rateText: "1 USD = 95.52054 INR",
    amountUsd: "963.14 USD",
    metadataDate: new Date("2026-06-09T01:22:31Z"),
  },
  {
    monthLabel: "June 2026",
    buyer: EMPLOYMENT_DATA.buyerCompany,
    no: "ONTOP1029418",
    issueDate: "28/05/2026",
    dueDate: "05/06/2026",
    paymentDate: "05/06/2026",
    dueDateISO: "2026-06-05",
    amountInr: `${EMPLOYMENT_DATA.monthlySalaryInr.toLocaleString("en-IN")} INR`,
    rateText: "1 USD = 95.63124 INR",
    amountUsd: "962.03 USD",
    metadataDate: new Date("2026-07-09T01:22:31Z"),
  },
  {
    monthLabel: "July 2026",
    buyer: EMPLOYMENT_DATA.buyerCompany,
    no: "ONTOP1074823",
    issueDate: "28/06/2026",
    dueDate: "05/07/2026",
    paymentDate: "05/07/2026",
    dueDateISO: "2026-07-05",
    amountInr: `${EMPLOYMENT_DATA.monthlySalaryInr.toLocaleString("en-IN")} INR`,
    rateText: "1 USD = 95.30218 INR",
    amountUsd: "965.35 USD",
    metadataDate: new Date("2026-08-09T01:22:31Z"),
  },
];

export const SLIP_CONFIG = {
  // Set to 3 or 6 depending on requirements (default: 3 months: May, June, July)
  slipCount: 3,

  getActiveInvoices(count = SLIP_CONFIG.slipCount) {
    return ALL_INVOICES.slice(-count);
  },
};
