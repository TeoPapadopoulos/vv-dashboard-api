import overviewRoutes from './overview.routes.js';
import statusRoutes from './status.routes.js';
import leaderboardRoutes from './leaderboard.routes.js';

export default async function (fastify) {
  fastify.addHook('onRequest', fastify.requireUser);
  fastify.addHook('preHandler', fastify.requireGuildAccess);

  await fastify.register(overviewRoutes, { prefix: '/:guildId' });
  await fastify.register(statusRoutes, { prefix: '/:guildId' });
  await fastify.register(leaderboardRoutes, { prefix: '/:guildId' });
}
