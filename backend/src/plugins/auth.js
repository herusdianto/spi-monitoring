async function authPlugin(fastify, options) {
  fastify.decorate('authenticate', async (request, reply) => {
    try {
      const authHeader = request.headers.authorization;
      
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return reply.status(401).send({ error: 'No token provided' });
      }
      
      const token = authHeader.substring(7);
      const decoded = await require('../config/firebase').verifyToken(token);
      
      request.user = {
        uid: decoded.uid,
        email: decoded.email,
        ...decoded
      };
      
    } catch (err) {
      return reply.status(401).send({ error: 'Invalid token' });
    }
  });
}

async function authMiddleware(fastify, options) {
  fastify.decorate('authenticate', async (request, reply) => {
    try {
      const authHeader = request.headers.authorization;
      
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return reply.status(401).send({ error: 'No token provided' });
      }
      
      const token = authHeader.substring(7);
      const decoded = await require('../config/firebase').verifyToken(token);
      
      request.user = {
        uid: decoded.uid,
        email: decoded.email,
        ...decoded
      };
      
    } catch (err) {
      return reply.status(401).send({ error: 'Invalid token' });
    }
  });
}

module.exports = authMiddleware;