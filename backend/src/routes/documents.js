const documentController = require('../controllers/documentController');
const { verifyToken } = require('../config/firebase');

async function documentRoutes(fastify, options) {
  fastify.addHook('onRequest', async (request, reply) => {
    try {
      const authHeader = request.headers.authorization;
      
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return reply.status(401).send({ error: 'No token provided' });
      }
      
      const token = authHeader.substring(7);
      const decoded = await verifyToken(token);
      
      request.user = {
        uid: decoded.uid,
        email: decoded.email,
        ...decoded
      };
      
    } catch (err) {
      return reply.status(401).send({ error: 'Invalid token' });
    }
  });

  fastify.get('/word/:id', documentController.generateWord);
  fastify.get('/excel', documentController.generateExcel);
  fastify.get('/excel/:id', documentController.generateExcelById);
}

module.exports = documentRoutes;