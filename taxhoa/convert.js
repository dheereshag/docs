import puppeteer from "puppeteer-core";
import { PDFDocument } from "pdf-lib";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import { CANDIDATE_CONFIG, EMPLOYMENT_CONFIG, TAXHOA_CONFIG } from "../data/config.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const safeName = CANDIDATE_CONFIG.name.replace(/\s+/g, "_");

const documents = TAXHOA_CONFIG.documents.map((doc) => ({
  htmlFile: doc.htmlFile,
  pdfFile: `${doc.pdfFilePrefix}${safeName}.pdf`,
  title: `${doc.titlePrefix}${CANDIDATE_CONFIG.name}`,
  subject: doc.subject,
  getDate: doc.getMetadataDate,
}));

async function generateAllPdfs() {
  const browser = await puppeteer.launch({
    headless: true,
    executablePath: "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });

  for (const doc of documents) {
    const page = await browser.newPage();
    const filePath = `file://${path.join(__dirname, doc.htmlFile)}`;

    await page.setViewport({ width: 1200, height: 1600, deviceScaleFactor: 2 });
    await page.goto(filePath, { waitUntil: "networkidle0" });
    await page.evaluateHandle("document.fonts.ready");

    // Dynamically inject SSOT candidate and employment data into the DOM
    await page.evaluate(
      ({ candidate, employment, subject, taxhoa }) => {
        // Header Date
        const headerDate =
          subject === "Offer Letter" ? employment.dates.offerDate : employment.dates.issueDate;
        const metaValue = document.querySelector(".meta-value");
        if (metaValue) metaValue.textContent = headerDate;

        // Document Title
        document.title = `${subject} - ${candidate.name} - ${employment.companyShort}`;

        if (subject === "Offer Letter") {
          const recInfo = document.querySelector(".recipient-info");
          if (recInfo) {
            const divs = recInfo.querySelectorAll("div");
            if (divs.length >= 4) {
              divs[1].textContent = candidate.name;
              divs[2].textContent = candidate.address.line1;
              divs[3].textContent = `${candidate.address.city}, ${candidate.address.state}, ${candidate.address.pinCode}`;
            }
          }
          const salutation = document.querySelector(".salutation");
          if (salutation) salutation.textContent = `Dear ${candidate.firstName},`;
          const introStrong = document.querySelector(".intro-text strong");
          if (introStrong) introStrong.textContent = candidate.role;

          // Clauses
          const clauses = document.querySelectorAll(".clause-item");
          if (clauses.length >= 5) {
            clauses[0].innerHTML = `<strong>a. Position &amp; Reporting:</strong> You will join as ${candidate.role}, reporting to the Founder. This is a full-time remote role. Your start date will be <strong>${employment.dates.joiningDate}</strong>.`;
            clauses[1].innerHTML = `<strong>b. Compensation:</strong> Your consolidated compensation will be <strong>${employment.formattedSalaryInr}</strong> per month, payable monthly in arrears, subject to standard statutory deductions if applicable.`;
            clauses[2].innerHTML = `<strong>c. Working Hours:</strong> ${taxhoa.offerLetter.workingHours}`;
            clauses[3].innerHTML = `<strong>d. Benefits:</strong><ul class="benefits-sublist">${taxhoa.offerLetter.benefits.map((b) => `<li>${b}</li>`).join("")}</ul>`;
            clauses[4].innerHTML = `<strong>e. Employment Terms:</strong> ${taxhoa.offerLetter.employmentTerms}`;
          } else if (clauses.length >= 2) {
            clauses[0].innerHTML = `<strong>a. Position &amp; Reporting:</strong> You will join as ${candidate.role}, reporting to the Founder. This is a full-time remote role. Your start date will be <strong>${employment.dates.joiningDate}</strong>.`;
            clauses[1].innerHTML = `<strong>b. Compensation:</strong> Your consolidated compensation will be <strong>${employment.formattedSalaryInr}</strong> per month, payable monthly in arrears, subject to standard statutory deductions if applicable.`;
          }
          const conclusion = document.querySelector(".conclusion-text");
          if (conclusion) {
            conclusion.innerHTML = `Please confirm your acceptance of this offer by signing below and returning a signed copy on or before <strong>${employment.dates.offerDeadline}</strong>. We look forward to working with you.`;
          }
        } else if (subject === "Experience Letter") {
          const textBody = document.querySelector(".text-body");
          if (textBody) {
            const ps = textBody.querySelectorAll("p");
            if (ps.length >= 2) {
              ps[0].innerHTML = `This letter confirms that <strong>${candidate.name}</strong> worked as a <strong>${candidate.role}</strong> at <strong>${employment.companyShort}</strong> from <strong>${employment.dates.joiningDate}, to ${employment.dates.relievingDate}</strong>.`;
              ps[1].innerHTML = `During his tenure, ${candidate.firstName} led development projects and designed core backend services from the ground up. He worked effectively with the engineering team, handled technical challenges with clarity, and consistently met project goals.`;
            }
          }
        } else if (subject === "Relieving Letter") {
          const textBody = document.querySelector(".text-body");
          if (textBody) {
            const ps = textBody.querySelectorAll("p");
            if (ps.length >= 3) {
              ps[0].innerHTML = `This letter certifies that <strong>${candidate.name}</strong> was employed as a <strong>${candidate.role}</strong> at <strong>${employment.companyShort}</strong> from <strong>${employment.dates.joiningDate}, to ${employment.dates.relievingDate}</strong>.`;
              ps[1].innerHTML = `During his time with the company, ${candidate.firstName} delivered key engineering projects, worked closely with clients to address their requirements, and maintained strong working relationships across teams.`;
              ps[2].innerHTML = `He was officially relieved of his duties at the close of business on <strong>${employment.dates.relievingDate}</strong>. We appreciate his contributions and wish him continued success in his career.`;
            }
          }
        }
      },
      {
        candidate: CANDIDATE_CONFIG,
        employment: EMPLOYMENT_CONFIG,
        subject: doc.subject,
        taxhoa: TAXHOA_CONFIG,
      },
    );

    const outputPath = path.join(__dirname, doc.pdfFile);

    const initialPdfBuffer = await page.pdf({
      format: "A4",
      printBackground: true,
      margin: { top: "0px", right: "0px", bottom: "0px", left: "0px" },
    });

    const pdfDoc = await PDFDocument.load(initialPdfBuffer, { updateMetadata: false });
    pdfDoc.setTitle(doc.title);
    pdfDoc.setAuthor(TAXHOA_CONFIG.pdfMetadata.author);
    pdfDoc.setCreator(TAXHOA_CONFIG.pdfMetadata.creator);
    pdfDoc.setProducer(TAXHOA_CONFIG.pdfMetadata.producer);
    pdfDoc.setSubject(doc.subject);

    const docDate = doc.getDate();
    pdfDoc.setCreationDate(docDate);
    pdfDoc.setModificationDate(docDate);

    const finalPdfBytes = await pdfDoc.save({ useObjectStreams: false, updateMetadata: false });
    fs.writeFileSync(outputPath, finalPdfBytes);

    console.log(`Successfully generated PDF: ${outputPath}`);
    console.log(`  Title: ${doc.title}`);
    console.log(`  CreationDate & ModDate: ${docDate.toISOString()} (${docDate.toLocaleString()})`);

    await page.close();
  }

  await browser.close();
}

generateAllPdfs().catch((err) => {
  console.error("Error generating PDFs:", err);
  process.exit(1);
});
