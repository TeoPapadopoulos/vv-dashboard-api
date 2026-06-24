import { errorResponse } from '../../../schemas/common.schema.js';
import {
  leaderboardQuery,
  leaderboardResponse,
} from '../../../schemas/analytics.schema.js';

export default async function (fastify) {
  fastify.get(
    '/leaderboard',
    {
      preHandler: [
        fastify.requireGuildAccess,
        fastify.normalizeAnalyticsRange,
        fastify.requireAnalyticsRangeAccess,
        fastify.requireLeaderboardMetricAccess,
      ],
      schema: {
        description: 'Get the leaderboard for a guild',
        tags: ['analytics'],
        params: {
          type: 'object',
          properties: {
            guildId: { type: 'string' },
          },
          required: ['guildId'],
        },
        querystring: { $ref: 'AnalyticsRangeQuery#', ...leaderboardQuery },
        response: {
          ...errorResponse(400, 401, 403),
          200: leaderboardResponse,
        },
      },
    },
    async (req, reply) => {
      const leaderboard = await fastify.analytics.getLeaderboard(
        req.params.guildId,
        req.analyticsRange,
        req.query.metric,
        req.query.limit,
      );
      return reply.send(leaderboard);
    },
  );
}
