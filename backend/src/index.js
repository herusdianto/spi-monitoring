require('dotenv').config();

const fastify = require('fastify')({ logger: true });
const cors = require('@fastify/cors');
const jwt = require('@fastify/jwt');

const { initializeFirebase } = require('./config/firebase');
const monitoringRoutes = require('./routes/monitoring');
const documentRoutes = require('./routes/documents');

async function start() {
  try {
    await fastify.register(cors, {
      origin: true,
      credentials: true
    });

    await fastify.register(jwt, {
      secret: process.env.JWT_SECRET || 'spi-monitoring-secret-key-change-in-production'
    });

    initializeFirebase();

    await fastify.register(monitoringRoutes, { prefix: '/api/monitoring' });
    await fastify.register(documentRoutes, { prefix: '/api/documents' });

    fastify.get('/health', async () => ({ status: 'ok', timestamp: new Date().toISOString() }));

    const port = process.env.PORT || 3000;
    await fastify.listen({ port, host: '0.0.0.0' });
    
    console.log(`Server running on http://localhost:${port}`);
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
}

start();