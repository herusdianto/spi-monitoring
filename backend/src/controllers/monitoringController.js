const monitoringService = require('../services/monitoringService');
const { createMonitoringSchema, updateMonitoringSchema, idParamSchema } = require('../validations/monitoring');

async function createMonitoring(request, reply) {
  const { error, value } = createMonitoringSchema.validate(request.body);
  
  if (error) {
    return reply.status(400).send({ error: error.details[0].message });
  }
  
  try {
    const result = await monitoringService.create(request.user.uid, value);
    return reply.status(201).send(result);
  } catch (err) {
    request.log.error(err);
    return reply.status(500).send({ error: 'Failed to create monitoring record' });
  }
}

async function getMonitoring(request, reply) {
  const { id } = request.params;
  const { error } = idParamSchema.validate({ id });
  
  if (error) {
    return reply.status(400).send({ error: error.details[0].message });
  }
  
  try {
    const result = await monitoringService.getById(id, request.user.uid);
    
    if (!result) {
      return reply.status(404).send({ error: 'Record not found' });
    }
    
    return reply.send(result);
  } catch (err) {
    request.log.error(err);
    return reply.status(500).send({ error: 'Failed to retrieve record' });
  }
}

async function getAllMonitoring(request, reply) {
  const { limit, offset, status, category } = request.query;
  
  try {
    const results = await monitoringService.getAll(request.user.uid, {
      limit: limit ? parseInt(limit) : undefined,
      offset: offset ? parseInt(offset) : undefined,
      status,
      category
    });
    
    return reply.send(results);
  } catch (err) {
    request.log.error(err);
    return reply.status(500).send({ error: 'Failed to retrieve records' });
  }
}

async function updateMonitoring(request, reply) {
  const { id } = request.params;
  const { error: idError } = idParamSchema.validate({ id });
  
  if (idError) {
    return reply.status(400).send({ error: idError.details[0].message });
  }
  
  const { error, value } = updateMonitoringSchema.validate(request.body);
  
  if (error) {
    return reply.status(400).send({ error: error.details[0].message });
  }
  
  try {
    const result = await monitoringService.update(id, request.user.uid, value);
    
    if (!result) {
      return reply.status(404).send({ error: 'Record not found' });
    }
    
    return reply.send(result);
  } catch (err) {
    request.log.error(err);
    return reply.status(500).send({ error: 'Failed to update record' });
  }
}

async function deleteMonitoring(request, reply) {
  const { id } = request.params;
  const { error } = idParamSchema.validate({ id });
  
  if (error) {
    return reply.status(400).send({ error: error.details[0].message });
  }
  
  try {
    const deleted = await monitoringService.delete(id, request.user.uid);
    
    if (!deleted) {
      return reply.status(404).send({ error: 'Record not found' });
    }
    
    return reply.status(204).send();
  } catch (err) {
    request.log.error(err);
    return reply.status(500).send({ error: 'Failed to delete record' });
  }
}

async function getMonitoringStats(request, reply) {
  try {
    const stats = await monitoringService.getStats(request.user.uid);
    return reply.send(stats);
  } catch (err) {
    request.log.error(err);
    return reply.status(500).send({ error: 'Failed to retrieve stats' });
  }
}

module.exports = {
  createMonitoring,
  getMonitoring,
  getAllMonitoring,
  updateMonitoring,
  deleteMonitoring,
  getMonitoringStats
};