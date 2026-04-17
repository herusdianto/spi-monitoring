const monitoringController = require('../controllers/monitoringController');

async function monitoringRoutes(fastify, options) {
  fastify.addHook('onRequest', async (request, reply) => {
    await fastify.authenticate(request, reply);
  });

  fastify.post('/', monitoringController.createMonitoring);
  fastify.get('/', monitoringController.getAllMonitoring);
  fastify.get('/stats', monitoringController.getMonitoringStats);
  fastify.get('/:id', monitoringController.getMonitoring);
  fastify.put('/:id', monitoringController.updateMonitoring);
  fastify.delete('/:id', monitoringController.deleteMonitoring);
}

module.exports = monitoringRoutes;