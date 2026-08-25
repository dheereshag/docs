import puppeteer from 'puppeteer-core';
import { PDFDocument } from 'pdf-lib';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function getOfferLetterDate() {
  // June 05, 2025 with a random time between 10:00 AM and 5:00 PM
  const hour = Math.floor(Math.random() * 7) + 10; // 10 to 16 (10 AM to 4:59 PM)
  const minute = Math.floor(Math.random() * 60);
  const second = Math.floor(Math.random() * 60);
  return new Date(2025, 5, 5, hour, minute, second); // June 05, 2025 (month 5 = June)
}

const documents = [
  {
    htmlFile: 'relieving-letter.html',
    pdfFile: 'Relieving_Letter_Aakash_Jaiswal.pdf',
    title: 'Relieving Letter - Aakash Jaiswal',
    subject: 'Relieving Letter',
    getDate: () => new Date() // Current date and time
  },
  {
    htmlFile: 'experience-letter.html',
    pdfFile: 'Experience_Letter_Aakash_Jaiswal.pdf',
    title: 'Experience Letter - Aakash Jaiswal',
    subject: 'Experience Letter',
    getDate: () => new Date() // Current date and time
  },
  {
    htmlFile: 'offer-letter.html',
    pdfFile: 'Offer_Letter_Aakash_Jaiswal.pdf',
    title: 'Offer Letter - Aakash Jaiswal',
    subject: 'Offer Letter',
    getDate: getOfferLetterDate // Top-right date (June 05, 2025) with random time 10:00 AM - 5:00 PM
  }
];

async function generateAllPdfs() {
  const browser = await puppeteer.launch({
    headless: true,
    executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  for (const doc of documents) {
    const page = await browser.newPage();
    const filePath = `file://${path.join(__dirname, doc.htmlFile)}`;

    await page.setViewport({ width: 1200, height: 1600, deviceScaleFactor: 2 });
    await page.goto(filePath, { waitUntil: 'networkidle0' });
    await page.evaluateHandle('document.fonts.ready');

    const outputPath = path.join(__dirname, doc.pdfFile);

    const initialPdfBuffer = await page.pdf({
      format: 'A4',
      printBackground: true,
      margin: { top: '0px', right: '0px', bottom: '0px', left: '0px' }
    });

    const pdfDoc = await PDFDocument.load(initialPdfBuffer, { updateMetadata: false });
    pdfDoc.setTitle(doc.title);
    pdfDoc.setAuthor('TaxHoa');
    pdfDoc.setCreator('TaxHoa');
    pdfDoc.setProducer('Skia/PDF m151');
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
  console.error('Error generating PDFs:', err);
  process.exit(1);
});
