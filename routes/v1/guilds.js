import { errorResponse } from '../../schemas/common.schema.js';
import { guildResponse } from '../../schemas/guilds.schema.js';

export default async function (fastify) {
  fastify.get(
    '/guilds/:guildId',
    {
      onRequest: [fastify.requireUser],
      preHandler: [fastify.requireGuildAccess, fastify.requireGuildPremium],
      schema: {
        description: 'Get a guild',
        tags: ['guilds'],
        params: {
          type: 'object',
          properties: {
            guildId: { type: 'string' },
          },
          required: ['guildId'],
        },
        response: {
          200: guildResponse,
          ...errorResponse(400, 401, 403, 404),
        },
      },
    },
    async (req, reply) => {
      return reply.send({
        guild: req.guild,
        premium: req.guildPremium.active,
        access: req.guildAccess,
      });
    },
  );
}
