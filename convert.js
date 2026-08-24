import puppeteer from 'puppeteer-core';
import { PDFDocument } from 'pdf-lib';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const INVOICES = [
  {
    monthLabel: 'May 2026',
    buyer: 'Amoeba Global FZ LLC',
    no: 'ONTOP985259',
    issueDate: '28/04/2026',
    dueDate: '05/05/2026',
    paymentDate: '05/05/2026',
    dueDateISO: '2026-05-05',
    amountInr: '92,000 INR',
    rateText: '1 USD = 95.52054 INR',
    amountUsd: '963.14 USD',
    metadataDate: new Date('2026-06-09T01:22:31Z') // 09/06/2026, 01:22:31
  },
  {
    monthLabel: 'June 2026',
    buyer: 'Amoeba Global FZ LLC',
    no: 'ONTOP1029418',
    issueDate: '28/05/2026',
    dueDate: '05/06/2026',
    paymentDate: '05/06/2026',
    dueDateISO: '2026-06-05',
    amountInr: '92,000 INR',
    rateText: '1 USD = 95.63124 INR',
    amountUsd: '962.03 USD',
    metadataDate: new Date('2026-07-09T01:22:31Z') // 09/07/2026, 01:22:31
  },
  {
    monthLabel: 'July 2026',
    buyer: 'Amoeba Global FZ LLC',
    no: 'ONTOP1074823',
    issueDate: '28/06/2026',
    dueDate: '05/07/2026',
    paymentDate: '05/07/2026',
    dueDateISO: '2026-07-05',
    amountInr: '92,000 INR',
    rateText: '1 USD = 95.30218 INR',
    amountUsd: '965.35 USD',
    metadataDate: new Date('2026-08-09T01:22:31Z') // 09/08/2026, 01:22:31
  }
];

const PRODUCER_STRING = 'iText® 5.5.13.3 ©2000-2026 iText Group NV (AGPL-version)';

function formatDateForMeta(d) {
  if (!d) return '';
  const day = String(d.getUTCDate()).padStart(2, '0');
  const month = String(d.getUTCMonth() + 1).padStart(2, '0');
  const year = d.getUTCFullYear();
  const hours = String(d.getUTCHours()).padStart(2, '0');
  const mins = String(d.getUTCMinutes()).padStart(2, '0');
  const secs = String(d.getUTCSeconds()).padStart(2, '0');
  return `${day}/${month}/${year}, ${hours}:${mins}:${secs}`;
}

async function generateAllInvoices() {
  const browser = await puppeteer.launch({
    headless: true,
    executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  const filePath = `file://${path.join(__dirname, 'index.html')}`;
  
  await page.goto(filePath, { waitUntil: 'networkidle0' });
  await page.evaluateHandle('document.fonts.ready');

  const generatedFiles = [];

  for (const inv of INVOICES) {
    // Update DOM content dynamically for this invoice
    await page.evaluate((data) => {
      // Invoice No
      const metaPs = Array.from(document.querySelectorAll('.meta-col p'));
      for (const p of metaPs) {
        if (p.textContent.includes('No.')) {
          const val = p.querySelector('.meta-val');
          if (val) val.textContent = data.no;
        } else if (p.textContent.includes('Issue Date:')) {
          const val = p.querySelector('.meta-val');
          if (val) val.textContent = data.issueDate;
        } else if (p.textContent.includes('Due Date:')) {
          const val = p.querySelector('.meta-val');
          if (val) val.textContent = data.dueDate;
        }
      }

      // Line items table
      const row = document.querySelector('.table-row');
      if (row) {
        const inrCol = row.querySelector('.col-amount-inr');
        const usdCol = row.querySelector('.col-amount-usd');
        if (inrCol) inrCol.textContent = data.amountInr;
        if (usdCol) usdCol.textContent = data.amountUsd;
      }

      // Exchange rate
      const rateVal = document.querySelector('.exchange-row .rate');
      if (rateVal) rateVal.textContent = data.rateText;

      // Summary banner
      const subtotalNum = document.querySelector('.summary-left-values .num:first-child');
      if (subtotalNum) subtotalNum.textContent = data.amountUsd;

      const totalVal = document.querySelector('.summary-right-value');
      if (totalVal) totalVal.textContent = data.amountUsd;

      // Contractor payment date
      const paymentVal = document.querySelector('.contractor-payment-date .val');
      if (paymentVal) paymentVal.textContent = data.paymentDate;

      // Document title
      document.title = `Invoice - ${data.buyer} - ${data.dueDateISO}`;
    }, inv);

    const outputFileName = `Invoice - ${inv.buyer} - ${inv.dueDateISO}.pdf`;
    const outputPath = path.join(__dirname, outputFileName);

    const initialPdfBuffer = await page.pdf({
      format: 'A4',
      printBackground: true,
      margin: { top: '0px', right: '0px', bottom: '0px', left: '0px' }
    });

    // Apply exact PDF metadata with pdf-lib
    const pdfDoc = await PDFDocument.load(initialPdfBuffer, { updateMetadata: false });
    
    pdfDoc.setTitle('Invoice');
    pdfDoc.setAuthor('Ontop Holdings Inc');
    pdfDoc.setCreator('Ontop Holdings Inc');
    pdfDoc.setProducer(PRODUCER_STRING);
    pdfDoc.setSubject('Contract');
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
    console.log(`======================================================`);
    await printMetadata(item.filePath);
  }
}

async function printMetadata(filePath) {
  const buffer = fs.readFileSync(filePath);
  const pdfDoc = await PDFDocument.load(buffer, { updateMetadata: false });

  const title = pdfDoc.getTitle() || '';
  const author = pdfDoc.getAuthor() || '';
  const creator = pdfDoc.getCreator() || '';
  const producer = pdfDoc.getProducer() || '';
  const subject = pdfDoc.getSubject() || '';
  const keywords = pdfDoc.getKeywords() || '';
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

generateAllInvoices().catch(err => {
  console.error('Error generating invoices:', err);
  process.exit(1);
});
