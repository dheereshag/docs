/**
 * Provisional Degree Certificate Configuration Module
 * Single source of truth for all certificate data, university details,
 * student credentials, examination results, signatures, and legal notes.
 */

export const PROVISIONAL_CERTIFICATE_CONFIG = {
  university: {
    nameLine1: "UNIVERSITY OF LUCKNOW",
    nameLine2: "",
    logoPath: "logo.png",
    logoAlt: "University of Lucknow Logo",
  },

  certificateTitle: "PROVISIONAL DEGREE CERTIFICATE",

  meta: {
    dateOfIssue: "09/10/2026",
    srNo: "DOC000000187912",
  },

  student: {
    name: "KAUSHLENDRA PRATAP SINGH",
    fatherName: "SUBHASH CHANDRA SINGH",
    rollNo: "2110013125054",
    enrollmentNo: "21801526",
    course: "B.Tech",
    branch: "Electronics and Communication Engineering",
    instituteName: "UNIVERSITY OF LUCKNOW",
    yearOfPassing: "2025-26",
    result: "Pass",
    division: "I-DIV",
  },

  signatories: {
    instituteDirectorLabel: "(Signature Of Institute Director)",
    controllerOfExamination: {
      signaturePath: "sign.png",
      signatureAlt: "Controller Of Examination Signature",
      title: "Controller Of Examination",
      line1: "UNIVERSITY OF LUCKNOW",
      line2: "",
    },
  },

  notes: [
    "As per Govt. notification no.3324/solah-1-2013(3)/2009) dated 31-10-2013, Mahamaya Technical University, Noida has been merged with G. B. Technical University, Lucknow and the University established after such merger shall be called Uttar Pradesh Technical University, Lucknow",
    "As per Govt. notification no.2696/solah-1-2015-1(30)/2009 dated 16.09.2015 Uttar Pradesh Technical University, Lucknow has been renamed as Dr. A.P.J. Abdul Kalam Technical University, Uttar Pradesh, Lucknow.",
  ],

  pdfMetadata: {
    title: "Provisional Degree Certificate - SAMAR JEET GUPTA",
    author: "University of Lucknow",
    creator: "University of Lucknow Examination Division",
    producer: "Skia/PDF m151",
    subject: "Provisional Degree Certificate",
    keywords: ["University of Lucknow", "Provisional Certificate", "Degree", "B.Tech"],
  },
};

export default PROVISIONAL_CERTIFICATE_CONFIG;
