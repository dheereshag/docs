import { CANDIDATE_DATA, BANK_DATA, EMPLOYMENT_DATA } from "../data/config.js";

export const STATEMENT_DATA = {
  accountDetails: {
    name: CANDIDATE_DATA.name,
    type: BANK_DATA.accountType,
    number: BANK_DATA.accountNumber,
    address: CANDIDATE_DATA.address.bankAddress,
    branch: BANK_DATA.branch,
    ifsc: BANK_DATA.ifsc,
    currency: BANK_DATA.currency,
  },
  openingBalance: BANK_DATA.openingBalance,
  page1ItemCount: 5,
  transactions: [
    // 1. Before 5 May (small debit)
    {
      date: "02 May 2026",
      details:
        "YESB0YBLUPI/Mr\nSANTOSHSAH /XXXXX\n/q607334392@ybl\n/UPI/656745098074/Paid\nvia SuperMoney",
      debit: 56.0,
      credit: 0,
    },
    // 2. May Ontop Salary Credit
    {
      date: "05 May 2026",
      details: "INWREMIT-G0822330980154-\nONTOP HOLDINGS INC-\nTRANGLO",
      debit: 0,
      credit: EMPLOYMENT_DATA.monthlySalaryInr,
    },
    // 3. May large debit
    {
      date: "14 May 2026",
      details:
        "ICIC0DC0099/Ttonnik\n/XXXXX43449/getepay.mba\nndhan111649@icici\n/UPI/656858377035/Paid\nvia SuperMoney",
      debit: 25000.0,
      credit: 0,
    },
    // 4. May small debit
    {
      date: "26 May 2026",
      details:
        "PYTM0123456/SWIGGY\n/XXXXX89123/swiggy@icici\n/UPI/657129038172/Paid\nvia SuperMoney",
      debit: 245.0,
      credit: 0,
    },
    // 5. June Ontop Salary Credit
    {
      date: "05 Jun 2026",
      details: "INWREMIT-G0822330980154-\nONTOP HOLDINGS INC-\nTRANGLO",
      debit: 0,
      credit: EMPLOYMENT_DATA.monthlySalaryInr,
    },
    // 6. June large debit
    {
      date: "15 Jun 2026",
      details:
        "YESB0YBLUPI/Mr\nSANTOSHSAH /XXXXX\n/q607334392@ybl\n/UPI/656848927697/Paid\nvia SuperMoney",
      debit: 30000.0,
      credit: 0,
    },
    // 7. June small debit
    {
      date: "22 Jun 2026",
      details: "YESB0YBLUPI/SK NAZIR\nHOSSAIN/XXXXX",
      debit: 38.0,
      credit: 0,
    },
    // 8. July Ontop Salary Credit
    {
      date: "05 Jul 2026",
      details: "INWREMIT-G0822330980154-\nONTOP HOLDINGS INC-\nTRANGLO",
      debit: 0,
      credit: EMPLOYMENT_DATA.monthlySalaryInr,
    },
    // 9. July large debit
    {
      date: "18 Jul 2026",
      details:
        "FDRL0002540/MALAY\nGUHA/XXXXX\n/malayguha1@fbl\n/UPI/657803317552/Paid\nvia SuperMoney",
      debit: 15000.0,
      credit: 0,
    },
    // 10. August small debit
    {
      date: "01 Aug 2026",
      details:
        "SBIN0017586/KAUSHLEND\nRA PRATAPSINGH\n/XXXXX51139/7389451139\n@ptsbi\n/UPI/657904389623/Paid\nvia SuperMoney",
      debit: 50.0,
      credit: 0,
    },
  ],
};
