const documentController = require('../controllers/documentController');

async function documentRoutes(fastify, options) {
  fastify.addHook('onRequest', async (request, reply) => {
    await fastify.authenticate(request, reply);
  });

  fastify.get('/word/:id', documentController.generateWord);
  fastify.get('/excel', documentController.generateExcel);
  fastify.get('/excel/:id', documentController.generateExcelById);
}

module.exports = documentRoutes;