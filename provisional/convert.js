import puppeteer from "puppeteer-core";
import { PDFDocument } from "pdf-lib";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import { PROVISIONAL_CERTIFICATE_CONFIG } from "./config.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function generateProvisionalCertificatePdf() {
  const browser = await puppeteer.launch({
    headless: true,
    executablePath: "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
    args: ["--no-sandbox", "--disable-setuid-sandbox", "--allow-file-access-from-files"],
  });

  const page = await browser.newPage();
  const filePath = `file://${path.join(__dirname, "index.html")}`;

  await page.setViewport({ width: 1240, height: 1754, deviceScaleFactor: 2 });
  await page.goto(filePath, { waitUntil: "networkidle0" });
  await page.evaluateHandle("document.fonts.ready");

  const outputFileName = `Provisional_Degree_Certificate_${PROVISIONAL_CERTIFICATE_CONFIG.student.name.replace(/\s+/g, "_")}.pdf`;
  const outputPath = path.join(__dirname, outputFileName);

  const initialPdfBuffer = await page.pdf({
    format: "A4",
    printBackground: true,
    margin: { top: "0px", right: "0px", bottom: "0px", left: "0px" },
  });

  const pdfDoc = await PDFDocument.load(initialPdfBuffer, { updateMetadata: false });
  const meta = PROVISIONAL_CERTIFICATE_CONFIG.pdfMetadata;

  if (meta) {
    if (meta.title) pdfDoc.setTitle(meta.title);
    if (meta.author) pdfDoc.setAuthor(meta.author);
    if (meta.creator) pdfDoc.setCreator(meta.creator);
    if (meta.producer) pdfDoc.setProducer(meta.producer);
    if (meta.subject) pdfDoc.setSubject(meta.subject);
    if (meta.keywords) pdfDoc.setKeywords(meta.keywords);
  }

  const finalPdfBytes = await pdfDoc.save({ useObjectStreams: false, updateMetadata: false });
  fs.writeFileSync(outputPath, finalPdfBytes);

  await browser.close();

  console.log(`\n======================================================`);
  console.log(`Provisional Degree Certificate Generated Successfully!`);
  console.log(`Output: ${outputPath}`);
  console.log(`Student: ${PROVISIONAL_CERTIFICATE_CONFIG.student.name}`);
  console.log(`Roll No: ${PROVISIONAL_CERTIFICATE_CONFIG.student.rollNo}`);
  console.log(`Issue Date: ${PROVISIONAL_CERTIFICATE_CONFIG.meta.dateOfIssue}`);
  console.log(`======================================================\n`);
}

generateProvisionalCertificatePdf().catch((err) => {
  console.error("Error generating provisional certificate PDF:", err);
  process.exit(1);
});
