import fp from 'fastify-plugin';
import { apiErrorSchema } from '../schemas/common.schema.js';

export default fp(
  async (fastify) => {
    fastify.addSchema(apiErrorSchema);
  },
  { name: 'schemas' },
);
