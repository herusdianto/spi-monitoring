const { Document, Packer, Paragraph, TextRun, HeadingLevel, Table, TableRow, TableCell, WidthType, AlignmentType, BorderStyle } = require('docx');
const { getFirestore } = require('../config/firebase');

async function generateWordDocument(data) {
  const tableRows = [
    new TableRow({
      children: [
        new TableCell({
          children: [new Paragraph({ text: 'Field', bold: true })],
          shading: { fill: 'DDDDDD' }
        }),
        new TableCell({
          children: [new Paragraph({ text: 'Value', bold: true })],
          shading: { fill: 'DDDDDD' }
        })
      ]
    }),
    new TableRow({
      children: [
        new TableCell({ children: [new Paragraph('SPI Name')] }),
        new TableCell({ children: [new Paragraph(data.spiName || 'N/A')] })
      ]
    }),
    new TableRow({
      children: [
        new TableCell({ children: [new Paragraph('Category')] }),
        new TableCell({ children: [new Paragraph(data.category || 'N/A')] })
      ]
    }),
    new TableRow({
      children: [
        new TableCell({ children: [new Paragraph('Status')] }),
        new TableCell({ children: [new Paragraph(data.status || 'N/A')] })
      ]
    }),
    new TableRow({
      children: [
        new TableCell({ children: [new Paragraph('Priority')] }),
        new TableCell({ children: [new Paragraph(data.priority || 'N/A')] })
      ]
    }),
    new TableRow({
      children: [
        new TableCell({ children: [new Paragraph('Responsible')] }),
        new TableCell({ children: [new Paragraph(data.responsible || 'N/A')] })
      ]
    }),
    new TableRow({
      children: [
        new TableCell({ children: [new Paragraph('Department')] }),
        new TableCell({ children: [new Paragraph(data.department || 'N/A')] })
      ]
    }),
    new TableRow({
      children: [
        new TableCell({ children: [new Paragraph('Start Date')] }),
        new TableCell({ children: [new Paragraph(data.startDate || 'N/A')] })
      ]
    }),
    new TableRow({
      children: [
        new TableCell({ children: [new Paragraph('End Date')] }),
        new TableCell({ children: [new Paragraph(data.endDate || 'N/A')] })
      ]
    }),
    new TableRow({
      children: [
        new TableCell({ children: [new Paragraph('Description')] }),
        new TableCell({ children: [new Paragraph(data.description || 'N/A')] })
      ]
    })
  ];

  const doc = new Document({
    sections: [{
      properties: {},
      children: [
        new Paragraph({
          text: 'SPI Monitoring Report',
          heading: HeadingLevel.TITLE,
          alignment: AlignmentType.CENTER
        }),
        new Paragraph({
          text: `Generated: ${new Date().toLocaleDateString()}`,
          alignment: AlignmentType.CENTER
        }),
        new Paragraph({ text: '' }),
        new Table({
          rows: tableRows,
          width: { size: 100, type: WidthType.PERCENTAGE }
        }),
        new Paragraph({ text: '' }),
        new Paragraph({
          text: 'Additional Notes',
          heading: HeadingLevel.HEADING_1
        }),
        new Paragraph(data.notes || 'No additional notes.')
      ]
    }]
  });

  return await Packer.toBuffer(doc);
}

async function generateWordFromFirestore(id, userId) {
  const db = getFirestore();
  const doc = await db.collection('monitoring').doc(id).get();
  
  if (!doc.exists) {
    throw new Error('Document not found');
  }
  
  const data = doc.data();
  
  if (data.userId !== userId) {
    throw new Error('Unauthorized');
  }
  
  return await generateWordDocument(data);
}

module.exports = {
  generateWordDocument,
  generateWordFromFirestore
};