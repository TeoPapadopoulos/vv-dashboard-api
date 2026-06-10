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
