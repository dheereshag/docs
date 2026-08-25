import puppeteer from 'puppeteer-core';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { PDFDocument } from 'pdf-lib';
import { execFileSync } from 'child_process';
import { STATEMENT_DATA } from './data.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const STATEMENT_PASSWORD = 'AKASH85492004';

export { STATEMENT_DATA };

function getFormattedTimestamps(date = new Date()) {
  const pad = (n) => String(n).padStart(2, '0');
  
  const day = pad(date.getDate());
  const month = pad(date.getMonth() + 1);
  const year = date.getFullYear();
  
  const hours = pad(date.getHours());
  const minutes = pad(date.getMinutes());
  const seconds = pad(date.getSeconds());
  
  // Format: AccountStatement_DD-MM-YYYY HH_MM_SS.pdf
  const filename = `AccountStatement_${day}-${month}-${year} ${hours}_${minutes}_${seconds}.pdf`;
  const displayDateStr = `${day}/${month}/${year}, ${hours}:${minutes}:${seconds}`;

  return { filename, displayDateStr };
}

function encryptPdfFile(filePath, password) {
  const pyCode = `
import sys
from pypdf import PdfReader, PdfWriter

path = sys.argv[1]
pwd = sys.argv[2]

reader = PdfReader(path)
writer = PdfWriter()
for page in reader.pages:
    writer.add_page(page)
if reader.metadata:
    writer.add_metadata(reader.metadata)
writer.encrypt(user_password=pwd, owner_password=pwd, algorithm='AES-128')
with open(path, 'wb') as f:
    writer.write(f)
`;
  execFileSync('python3', ['-c', pyCode, filePath, password]);
}

async function generateBankPDF() {
  // Enforce transaction count
  const txnCount = STATEMENT_DATA.transactions.length;
  console.log(`\nVerifying transaction count: ${txnCount} transactions found.`);
  if (txnCount !== 10) {
    throw new Error(`Validation Error: Expected exactly 10 transactions, found ${txnCount}`);
  }

  const browser = await puppeteer.launch({
    headless: true,
    executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--allow-file-access-from-files']
  });

  const page = await browser.newPage();
  const filePath = `file://${path.join(__dirname, 'index.html')}`;
  
  await page.goto(filePath, { waitUntil: 'networkidle0' });
  await page.evaluateHandle('document.fonts.ready');

  // Allow DOM rendering cycle to settle
  await new Promise(r => setTimeout(r, 500));

  const rawPdfBuffer = await page.pdf({
    format: 'A4',
    printBackground: true,
    margin: {
      top: '0px',
      right: '0px',
      bottom: '0px',
      left: '0px'
    }
  });

  await browser.close();

  // Load and inject metadata with pdf-lib
  const now = new Date();
  const { filename, displayDateStr } = getFormattedTimestamps(now);
  const outputPath = path.join(__dirname, filename);

  const pdfDoc = await PDFDocument.load(rawPdfBuffer, { updateMetadata: false });
  
  const creator = 'JasperReports Library version 6.21.5-74d586df47b25dbd05bd0957999819196e59934a';
  const producer = 'OpenPDF 2.0.2';

  pdfDoc.setCreator(creator);
  pdfDoc.setProducer(producer);
  pdfDoc.setCreationDate(now);
  pdfDoc.setModificationDate(now);

  const finalPdfBytes = await pdfDoc.save({ useObjectStreams: false, updateMetadata: false });
  fs.writeFileSync(outputPath, finalPdfBytes);

  // Encrypt PDF with password
  encryptPdfFile(outputPath, STATEMENT_PASSWORD);

  // Compute financial totals
  let runningBal = STATEMENT_DATA.openingBalance;
  let totalDr = 0;
  let totalCr = 0;
  for (const t of STATEMENT_DATA.transactions) {
    totalDr += t.debit || 0;
    totalCr += t.credit || 0;
    runningBal = runningBal + (t.credit || 0) - (t.debit || 0);
  }

  const stats = fs.statSync(outputPath);
  console.log(`========================================`);
  console.log(`Bank Statement PDF Generated: ${filename}`);
  console.log(`Size: ${(stats.size / 1024).toFixed(2)} KB (${stats.size} bytes)`);
  console.log(`Pages: ${pdfDoc.getPageCount()}`);
  console.log(`Password: ${STATEMENT_PASSWORD} (Protected)`);
  console.log(`Location: ${outputPath}`);
  console.log(`----------------------------------------`);
  console.log(`Metadata:`);
  console.log(`  CreationDate: ${displayDateStr}`);
  console.log(`  ModDate:      ${displayDateStr}`);
  console.log(`  Creator:      ${creator}`);
  console.log(`  Producer:     ${producer}`);
  console.log(`----------------------------------------`);
  console.log(`Ledger Summary:`);
  console.log(`  Opening Balance: INR ${STATEMENT_DATA.openingBalance.toLocaleString('en-IN', { minimumFractionDigits: 2 })}`);
  console.log(`  Total Credits:   + INR ${totalCr.toLocaleString('en-IN', { minimumFractionDigits: 2 })}`);
  console.log(`  Total Debits:    - INR ${totalDr.toLocaleString('en-IN', { minimumFractionDigits: 2 })}`);
  console.log(`  Ending Balance:  INR ${runningBal.toLocaleString('en-IN', { minimumFractionDigits: 2 })}`);
  console.log(`  Total Transactions: ${txnCount}`);
  console.log(`========================================\n`);

  return { filename, outputPath };
}

generateBankPDF().catch(err => {
  console.error('Error generating Bank PDF:', err);
  process.exit(1);
});
