import puppeteer from "puppeteer-core";
import { PDFDocument } from "pdf-lib";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import { CANDIDATE_DATA, EMPLOYMENT_DATA, SLIP_CONFIG } from "../data/config.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PRODUCER_STRING = "iText® 5.5.13.3 ©2000-2026 iText Group NV (AGPL-version)";

function formatDateForMeta(d) {
  if (!d) return "";
  const day = String(d.getUTCDate()).padStart(2, "0");
  const month = String(d.getUTCMonth() + 1).padStart(2, "0");
  const year = d.getUTCFullYear();
  const hours = String(d.getUTCHours()).padStart(2, "0");
  const mins = String(d.getUTCMinutes()).padStart(2, "0");
  const secs = String(d.getUTCSeconds()).padStart(2, "0");
  return `${day}/${month}/${year}, ${hours}:${mins}:${secs}`;
}

async function generateAllInvoices() {
  const browser = await puppeteer.launch({
    headless: true,
    executablePath: "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });

  const page = await browser.newPage();
  const filePath = `file://${path.join(__dirname, "index.html")}`;

  await page.goto(filePath, { waitUntil: "networkidle0" });
  await page.evaluateHandle("document.fonts.ready");

  const generatedFiles = [];
  const invoices = await SLIP_CONFIG.getActiveInvoices();

  for (const inv of invoices) {
    // Update DOM content dynamically for this invoice
    await page.evaluate(
      ({ data, candidate, employment }) => {
        // Seller Information
        const sellerName = document.querySelector(".seller-name");
        if (sellerName) sellerName.textContent = candidate.name;
        const sellerAddr1 = document.querySelector(".seller-address-1");
        if (sellerAddr1) sellerAddr1.textContent = candidate.address.line1;
        const sellerAddr2 = document.querySelector(".seller-address-2");
        if (sellerAddr2)
          sellerAddr2.textContent = `${candidate.address.city}, ${candidate.address.pinCode}`;
        const sellerTaxId = document.querySelector(".seller-tax-id");
        if (sellerTaxId) sellerTaxId.textContent = `Tax ID: ${candidate.pan}`;

        // Buyer Information
        const buyerName = document.querySelector(".buyer-name");
        if (buyerName) buyerName.textContent = employment.buyerCompany;

        // Role / Scope
        const scopeRole = document.querySelector(".contract-scope-col:nth-child(2) p");
        if (scopeRole) scopeRole.textContent = candidate.role;
        const itemRole = document.querySelector(".table-row .col-item");
        if (itemRole) itemRole.textContent = candidate.secondaryRole || candidate.role;

        // Invoice No & Dates
        const metaPs = Array.from(document.querySelectorAll(".meta-col p"));
        for (const p of metaPs) {
          if (p.textContent.includes("No.")) {
            const val = p.querySelector(".meta-val");
            if (val) val.textContent = data.no;
          } else if (p.textContent.includes("Issue Date:")) {
            const val = p.querySelector(".meta-val");
            if (val) val.textContent = data.issueDate;
          } else if (p.textContent.includes("Due Date:")) {
            const val = p.querySelector(".meta-val");
            if (val) val.textContent = data.dueDate;
          }
        }

        // Line items table
        const row = document.querySelector(".table-row");
        if (row) {
          const inrCol = row.querySelector(".col-amount-inr");
          const usdCol = row.querySelector(".col-amount-usd");
          if (inrCol) inrCol.textContent = data.amountInr;
          if (usdCol) usdCol.textContent = data.amountUsd;
        }

        // Exchange rate
        const rateVal = document.querySelector(".exchange-row .rate");
        if (rateVal) rateVal.textContent = data.rateText;

        // Summary banner
        const subtotalNum = document.querySelector(".summary-left-values .num:first-child");
        if (subtotalNum) subtotalNum.textContent = data.amountUsd;

        const totalVal = document.querySelector(".summary-right-value");
        if (totalVal) totalVal.textContent = data.amountUsd;

        // Contractor payment date
        const paymentVal = document.querySelector(".contractor-payment-date .val");
        if (paymentVal) paymentVal.textContent = data.paymentDate;

        // Document title
        document.title = `Invoice - ${data.buyer} - ${data.dueDateISO}`;
      },
      { data: inv, candidate: CANDIDATE_DATA, employment: EMPLOYMENT_DATA },
    );

    const outputFileName = `Invoice - ${inv.buyer} - ${inv.dueDateISO}.pdf`;
    const outputPath = path.join(__dirname, outputFileName);

    const initialPdfBuffer = await page.pdf({
      format: "A4",
      printBackground: true,
      margin: { top: "0px", right: "0px", bottom: "0px", left: "0px" },
    });

    // Apply exact PDF metadata with pdf-lib
    const pdfDoc = await PDFDocument.load(initialPdfBuffer, { updateMetadata: false });

    pdfDoc.setTitle("Invoice");
    pdfDoc.setAuthor("Ontop Holdings Inc");
    pdfDoc.setCreator("Ontop Holdings Inc");
    pdfDoc.setProducer(PRODUCER_STRING);
    pdfDoc.setSubject("Contract");
    pdfDoc.setKeywords([]);

    pdfDoc.setCreationDate(inv.metadataDate);
    pdfDoc.setModificationDate(inv.metadataDate);

    const finalPdfBytes = await pdfDoc.save({ useObjectStreams: false, updateMetadata: false });
    fs.writeFileSync(outputPath, finalPdfBytes);

    generatedFiles.push({ fileName: outputFileName, filePath: outputPath, config: inv });
  }

  await browser.close();

  // Print summary & metadata for each file
  for (const item of generatedFiles) {
    console.log(`\n======================================================`);
    console.log(`PDF Generated: ${item.fileName} (${item.config.monthLabel})`);
    console.log(
      `  Conversion: ${item.config.amountInr} @ (${item.config.rateText}) => ${item.config.amountUsd}`,
    );
    console.log(`======================================================`);
    await printMetadata(item.filePath);
  }
}

async function printMetadata(filePath) {
  const buffer = fs.readFileSync(filePath);
  const pdfDoc = await PDFDocument.load(buffer, { updateMetadata: false });

  const title = pdfDoc.getTitle() || "";
  const author = pdfDoc.getAuthor() || "";
  const creator = pdfDoc.getCreator() || "";
  const producer = pdfDoc.getProducer() || "";
  const subject = pdfDoc.getSubject() || "";
  const keywords = pdfDoc.getKeywords() || "";
  const creationDate = formatDateForMeta(pdfDoc.getCreationDate());
  const modDate = formatDateForMeta(pdfDoc.getModificationDate());

  console.log(`Title\n${title}\n`);
  console.log(`Author\n${author}\n`);
  console.log(`CreationDate\n${creationDate}\n`);
  console.log(`Creator\n${creator}\n`);
  console.log(`Keywords\n${keywords}\n`);
  console.log(`ModDate\n${modDate}\n`);
  console.log(`Producer\n${producer}\n`);
  console.log(`Subject\n${subject}`);
}

generateAllInvoices().catch((err) => {
  console.error("Error generating invoices:", err);
  process.exit(1);
});
