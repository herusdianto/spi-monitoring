const ExcelJS = require('exceljs');
const { getFirestore } = require('../config/firebase');

async function generateExcelDocument(items) {
  const workbook = new ExcelJS.Workbook();
  workbook.creator = 'SPI Monitoring';
  workbook.created = new Date();

  const sheet = workbook.addWorksheet('SPI Monitoring Data');

  sheet.columns = [
    { header: 'ID', key: 'id', width: 25 },
    { header: 'SPI Name', key: 'spiName', width: 30 },
    { header: 'Category', key: 'category', width: 15 },
    { header: 'Status', key: 'status', width: 12 },
    { header: 'Priority', key: 'priority', width: 12 },
    { header: 'Responsible', key: 'responsible', width: 20 },
    { header: 'Department', key: 'department', width: 20 },
    { header: 'Start Date', key: 'startDate', width: 15 },
    { header: 'End Date', key: 'endDate', width: 15 },
    { header: 'Description', key: 'description', width: 40 },
    { header: 'Notes', key: 'notes', width: 40 },
    { header: 'Created At', key: 'createdAt', width: 20 },
    { header: 'Updated At', key: 'updatedAt', width: 20 }
  ];

  const headerRow = sheet.getRow(1);
  headerRow.font = { bold: true, color: { argb: 'FFFFFF' } };
  headerRow.fill = {
    type: 'pattern',
    pattern: 'solid',
    fgColor: { argb: '4472C4' }
  };
  headerRow.alignment = { horizontal: 'center' };
  headerRow.height = 25;

  items.forEach((item, index) => {
    const row = sheet.addRow({
      id: item.id,
      spiName: item.spiName || '',
      category: item.category || '',
      status: item.status || '',
      priority: item.priority || '',
      responsible: item.responsible || '',
      department: item.department || '',
      startDate: item.startDate || '',
      endDate: item.endDate || '',
      description: item.description || '',
      notes: item.notes || '',
      createdAt: item.createdAt || '',
      updatedAt: item.updatedAt || ''
    });
    
    if (index % 2 === 0) {
      row.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'F2F2F2' }
      };
    }
  });

  sheet.autoFilter = 'A1:M1';
  
  sheet.eachRow((row, rowNumber) => {
    if (rowNumber > 1) {
      row.alignment = { vertical: 'middle' };
    }
  });

  return await workbook.xlsx.writeBuffer();
}

async function generateExcelFromFirestore(userId, options = {}) {
  const db = getFirestore();
  const { status, category } = options;
  
  let query = db.collection('monitoring').where('userId', '==', userId);
  
  if (status) {
    query = query.where('status', '==', status);
  }
  
  if (category) {
    query = query.where('category', '==', category);
  }
  
  const snapshot = await query.get();
  const items = [];
  
  snapshot.forEach(doc => {
    items.push({ id: doc.id, ...doc.data() });
  });
  
  return await generateExcelDocument(items);
}

module.exports = {
  generateExcelDocument,
  generateExcelFromFirestore
};