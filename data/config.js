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
    offerLetterMetadataDate: new Date(2022, 5, 10, 14, 30, 0),
    // Relieving & Experience Letters generated July 07, 2023 morning
    relievingLetterMetadataDate: new Date(2023, 6, 7, 11, 0, 0),
    experienceLetterMetadataDate: new Date(2023, 6, 7, 11, 30, 0),
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
 * Historical Salary Slips / Invoices Data (2023 Tenure)
 */
export const ALL_INVOICES = [
  {
    monthLabel: "February 2023",
    buyer: EMPLOYMENT_DATA.buyerCompany,
    no: "ONTOP872190",
    issueDate: "28/01/2023",
    dueDate: "05/02/2023",
    paymentDate: "05/02/2023",
    dueDateISO: "2023-02-05",
    amountInr: `${EMPLOYMENT_DATA.monthlySalaryInr.toLocaleString("en-IN")} INR`,
    rateText: "1 USD = 82.35120 INR",
    amountUsd: "1,117.17 USD",
    metadataDate: new Date("2023-03-09T01:22:31Z"),
  },
  {
    monthLabel: "March 2023",
    buyer: EMPLOYMENT_DATA.buyerCompany,
    no: "ONTOP913452",
    issueDate: "28/02/2023",
    dueDate: "05/03/2023",
    paymentDate: "05/03/2023",
    dueDateISO: "2023-03-05",
    amountInr: `${EMPLOYMENT_DATA.monthlySalaryInr.toLocaleString("en-IN")} INR`,
    rateText: "1 USD = 82.24150 INR",
    amountUsd: "1,118.66 USD",
    metadataDate: new Date("2023-04-09T01:22:31Z"),
  },
  {
    monthLabel: "April 2023",
    buyer: EMPLOYMENT_DATA.buyerCompany,
    no: "ONTOP948120",
    issueDate: "28/03/2023",
    dueDate: "05/04/2023",
    paymentDate: "05/04/2023",
    dueDateISO: "2023-04-05",
    amountInr: `${EMPLOYMENT_DATA.monthlySalaryInr.toLocaleString("en-IN")} INR`,
    rateText: "1 USD = 82.11050 INR",
    amountUsd: "1,120.44 USD",
    metadataDate: new Date("2023-05-09T01:22:31Z"),
  },
  {
    monthLabel: "May 2023",
    buyer: EMPLOYMENT_DATA.buyerCompany,
    no: "ONTOP985259",
    issueDate: "28/04/2023",
    dueDate: "05/05/2023",
    paymentDate: "05/05/2023",
    dueDateISO: "2023-05-05",
    amountInr: `${EMPLOYMENT_DATA.monthlySalaryInr.toLocaleString("en-IN")} INR`,
    rateText: "1 USD = 82.15240 INR",
    amountUsd: "1,119.87 USD",
    metadataDate: new Date("2023-06-09T01:22:31Z"),
  },
  {
    monthLabel: "June 2023",
    buyer: EMPLOYMENT_DATA.buyerCompany,
    no: "ONTOP1029418",
    issueDate: "28/05/2023",
    dueDate: "05/06/2023",
    paymentDate: "05/06/2023",
    dueDateISO: "2023-06-05",
    amountInr: `${EMPLOYMENT_DATA.monthlySalaryInr.toLocaleString("en-IN")} INR`,
    rateText: "1 USD = 82.26180 INR",
    amountUsd: "1,118.38 USD",
    metadataDate: new Date("2023-07-09T01:22:31Z"),
  },
  {
    monthLabel: "July 2023",
    buyer: EMPLOYMENT_DATA.buyerCompany,
    no: "ONTOP1074823",
    issueDate: "28/06/2023",
    dueDate: "05/07/2023",
    paymentDate: "05/07/2023",
    dueDateISO: "2023-07-05",
    amountInr: `${EMPLOYMENT_DATA.monthlySalaryInr.toLocaleString("en-IN")} INR`,
    rateText: "1 USD = 82.14020 INR",
    amountUsd: "1,120.04 USD",
    metadataDate: new Date("2023-08-09T01:22:31Z"),
  },
];

export const SLIP_CONFIG = {
  // Configured for last 3 months of tenure: May, June, July 2023
  slipCount: 3,

  getActiveInvoices(count = SLIP_CONFIG.slipCount) {
    return ALL_INVOICES.slice(-count);
  },
};
