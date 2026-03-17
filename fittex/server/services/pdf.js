const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');

const generateInvoicePDF = async (payment, member) => {
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument({ margin: 50, size: 'A4' });
      const fileName = `invoice-${payment.invoiceNumber}.pdf`;
      const filePath = path.join(__dirname, '../uploads', fileName);

      const stream = fs.createWriteStream(filePath);
      doc.pipe(stream);

      // Colors
      const black = '#0a0a0a';
      const lime = '#a3e635';
      const gray = '#666666';

      // Background header
      doc.rect(0, 0, doc.page.width, 120).fill('#0a0a0a');

      // Logo / Gym Name
      doc.fontSize(28).fillColor('#bfff00').font('Helvetica-Bold')
        .text('FITTEX GYM', 50, 30);
      doc.fontSize(10).fillColor('#aaaaaa').font('Helvetica')
        .text('Sculpt Your Body, Elevate Your Spirit', 50, 65);

      // Invoice title
      doc.fontSize(24).fillColor('white').font('Helvetica-Bold')
        .text('INVOICE', doc.page.width - 170, 35)
        .fontSize(12).font('Helvetica')
        .text(`#${payment.invoiceNumber}`, doc.page.width - 170, 65);

      doc.fillColor(black);

      // Line
      doc.moveTo(50, 130).lineTo(550, 130).stroke('#bfff00');

      // Member + Date info
      doc.y = 145;
      doc.fontSize(11).fillColor('#444').font('Helvetica').text('BILL TO:', 50, 145);
      doc.fontSize(13).fillColor(black).font('Helvetica-Bold')
        .text(member.fullName, 50, 162);
      doc.fontSize(10).fillColor(gray).font('Helvetica')
        .text(`Phone: ${member.phone}`, 50, 178)
        .text(`Member ID: ${member.memberId}`, 50, 193);

      doc.fontSize(11).fillColor('#444').text('DATE:', 380, 145);
      doc.fontSize(13).fillColor(black).font('Helvetica-Bold')
        .text(new Date(payment.paymentDate).toLocaleDateString('en-IN'), 380, 162);
      doc.fontSize(10).fillColor(gray).font('Helvetica')
        .text(`Valid Until: ${new Date(member.endDate).toLocaleDateString('en-IN')}`, 380, 178);

      // Table header
      doc.rect(50, 220, 500, 35).fill('#0a0a0a');
      doc.fontSize(11).fillColor('#bfff00').font('Helvetica-Bold')
        .text('DESCRIPTION', 65, 232)
        .text('PLAN', 250, 232)
        .text('AMOUNT', 430, 232);

      // Table row
      doc.rect(50, 255, 500, 45).fill('#f8f8f8');
      doc.fontSize(11).fillColor(black).font('Helvetica')
        .text('Gym Membership', 65, 268)
        .text(payment.planName, 250, 268)
        .text(`₹${payment.amount?.toLocaleString('en-IN')}`, 430, 268, { width: 100, align: 'right' });

      // Total
      doc.rect(350, 315, 200, 40).fill('#0a0a0a');
      doc.fontSize(13).fillColor('#bfff00').font('Helvetica-Bold')
        .text('TOTAL:', 365, 326)
        .text(`₹${payment.amount?.toLocaleString('en-IN')}`, 430, 326, { width: 110, align: 'right' });

      // Status badge
      doc.rect(50, 315, 120, 40).fill('#BFFF00');
      doc.fontSize(13).fillColor('#0a0a0a').font('Helvetica-Bold')
        .text('✓ PAID', 70, 328);

      // Footer
      doc.moveTo(50, 450).lineTo(550, 450).stroke('#ddd');
      doc.fontSize(10).fillColor(gray).font('Helvetica')
        .text('Thank you for choosing FITTEX GYM!', 50, 465, { align: 'center', width: 500 })
        .text('For queries: +91 98765 43210 | info@fittexgym.com', 50, 480, { align: 'center', width: 500 });

      doc.end();

      stream.on('finish', () => {
        resolve({
          filePath,
          fileName,
          url: `/uploads/${fileName}`
        });
      });

      stream.on('error', reject);
    } catch (err) {
      reject(err);
    }
  });
};

module.exports = { generateInvoicePDF };
