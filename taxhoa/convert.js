import puppeteer from 'puppeteer-core';
import { PDFDocument } from 'pdf-lib';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function generateRelievingLetterPdf() {
  const browser = await puppeteer.launch({
    headless: true,
    executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  const filePath = `file://${path.join(__dirname, 'index.html')}`;

  await page.setViewport({ width: 1200, height: 1600, deviceScaleFactor: 2 });
  await page.goto(filePath, { waitUntil: 'networkidle0' });
  await page.evaluateHandle('document.fonts.ready');

  const outputPdfName = 'Relieving_Letter_Aakash_Jaiswal.pdf';
  const outputPath = path.join(__dirname, outputPdfName);

  const initialPdfBuffer = await page.pdf({
    format: 'A4',
    printBackground: true,
    margin: { top: '0px', right: '0px', bottom: '0px', left: '0px' }
  });

  const pdfDoc = await PDFDocument.load(initialPdfBuffer, { updateMetadata: false });
  pdfDoc.setTitle('Relieving Letter - Aakash Jaiswal');
  pdfDoc.setAuthor('TaxHoa');
  pdfDoc.setCreator('TaxHoa');
  pdfDoc.setSubject('Relieving Letter');

  const now = new Date();
  pdfDoc.setCreationDate(now);
  pdfDoc.setModificationDate(now);

  const finalPdfBytes = await pdfDoc.save({ useObjectStreams: false, updateMetadata: false });
  fs.writeFileSync(outputPath, finalPdfBytes);

  console.log(`Successfully generated PDF: ${outputPath}`);

  await browser.close();
}

generateRelievingLetterPdf().catch((err) => {
  console.error('Error generating relieving letter PDF:', err);
  process.exit(1);
});
