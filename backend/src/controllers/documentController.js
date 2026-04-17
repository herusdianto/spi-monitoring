const { generateWordFromFirestore } = require('../services/wordService');
const { generateExcelFromFirestore } = require('../services/excelService');
const { idParamSchema } = require('../validations/monitoring');

async function generateWord(request, reply) {
  const { id } = request.params;
  const { error } = idParamSchema.validate({ id });
  
  if (error) {
    return reply.status(400).send({ error: error.details[0].message });
  }
  
  try {
    const buffer = await generateWordFromFirestore(id, request.user.uid);
    
    reply.header('Content-Type', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document');
    reply.header('Content-Disposition', `attachment; filename="spi-report-${id}.docx"`);
    
    return reply.send(buffer);
  } catch (err) {
    request.log.error(err);
    
    if (err.message === 'Document not found') {
      return reply.status(404).send({ error: 'Document not found' });
    }
    if (err.message === 'Unauthorized') {
      return reply.status(403).send({ error: 'Unauthorized' });
    }
    
    return reply.status(500).send({ error: 'Failed to generate Word document' });
  }
}

async function generateExcel(request, reply) {
  const { status, category } = request.query;
  
  try {
    const buffer = await generateExcelFromFirestore(request.user.uid, { status, category });
    
    reply.header('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    reply.header('Content-Disposition', `attachment; filename="spi-data-${Date.now()}.xlsx"`);
    
    return reply.send(buffer);
  } catch (err) {
    request.log.error(err);
    return reply.status(500).send({ error: 'Failed to generate Excel document' });
  }
}

async function generateExcelById(request, reply) {
  const { id } = request.params;
  const { error } = idParamSchema.validate({ id });
  
  if (error) {
    return reply.status(400).send({ error: error.details[0].message });
  }
  
  try {
    const { getFirestore } = require('../config/firebase');
    const db = getFirestore();
    const doc = await db.collection('monitoring').doc(id).get();
    
    if (!doc.exists) {
      return reply.status(404).send({ error: 'Document not found' });
    }
    
    const data = doc.data();
    if (data.userId !== request.user.uid) {
      return reply.status(403).send({ error: 'Unauthorized' });
    }
    
    const { generateExcelDocument } = require('../services/excelService');
    const buffer = await generateExcelDocument([{ id: doc.id, ...data }]);
    
    reply.header('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    reply.header('Content-Disposition', `attachment; filename="spi-report-${id}.xlsx"`);
    
    return reply.send(buffer);
  } catch (err) {
    request.log.error(err);
    return reply.status(500).send({ error: 'Failed to generate Excel document' });
  }
}

module.exports = {
  generateWord,
  generateExcel,
  generateExcelById
};