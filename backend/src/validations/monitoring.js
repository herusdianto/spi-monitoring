const Joi = require('joi');

const createMonitoringSchema = Joi.object({
  spiName: Joi.string().required().min(3).max(100),
  description: Joi.string().optional().max(500),
  category: Joi.string().required().valid('operational', 'financial', 'compliance', 'strategic'),
  status: Joi.string().valid('draft', 'active', 'completed', 'archived').default('draft'),
  startDate: Joi.date().iso().required(),
  endDate: Joi.date().iso().min(Joi.ref('startDate')).optional(),
  responsible: Joi.string().required().min(3).max(100),
  department: Joi.string().required().max(100),
  priority: Joi.string().valid('low', 'medium', 'high', 'critical').default('medium'),
  metrics: Joi.object({
    target: Joi.number().optional(),
    current: Joi.number().optional(),
    unit: Joi.string().optional().max(50)
  }).optional(),
  notes: Joi.string().optional().max(1000)
});

const updateMonitoringSchema = Joi.object({
  spiName: Joi.string().min(3).max(100),
  description: Joi.string().optional().max(500),
  category: Joi.string().valid('operational', 'financial', 'compliance', 'strategic'),
  status: Joi.string().valid('draft', 'active', 'completed', 'archived'),
  startDate: Joi.date().iso(),
  endDate: Joi.date().iso().optional(),
  responsible: Joi.string().min(3).max(100),
  department: Joi.string().max(100),
  priority: Joi.string().valid('low', 'medium', 'high', 'critical'),
  metrics: Joi.object({
    target: Joi.number().optional(),
    current: Joi.number().optional(),
    unit: Joi.string().optional().max(50)
  }).optional(),
  notes: Joi.string().optional().max(1000)
}).min(1);

const idParamSchema = Joi.object({
  id: Joi.string().required().min(20).max(150)
});

module.exports = {
  createMonitoringSchema,
  updateMonitoringSchema,
  idParamSchema
};