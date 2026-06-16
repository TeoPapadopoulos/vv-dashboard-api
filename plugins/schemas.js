import fp from 'fastify-plugin';
import { apiErrorSchema, analyticsRangeQuery } from '../schemas/common.schema.js';

export default fp(
  async (fastify) => {
    fastify.addSchema(apiErrorSchema);
    fastify.addSchema(analyticsRangeQuery);
  },
  { name: 'schemas' },
);
