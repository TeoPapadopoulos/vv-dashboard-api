import { analyticsOverviewResponse } from '../../../schemas/analytics.schema.js';
import { errorResponse } from '../../../schemas/common.schema.js';

export default async function (fastify) {
  fastify.get(
    '/overview',
    {
      preHandler: [
        fastify.requireGuildAccess,
        fastify.normalizeAnalyticsRange,
        fastify.requireAnalyticsRangeAccess,
      ],
      schema: {
        description: 'Get overview analytics for a guild',
        tags: ['analytics'],
        params: {
          type: 'object',
          properties: {
            guildId: { type: 'string' },
          },
          required: ['guildId'],
        },
        querystring: { $ref: 'AnalyticsRangeQuery#' },
        response: {
          ...errorResponse(400, 401, 403),
          200: analyticsOverviewResponse,
        },
      },
    },
    async (req, reply) => {
      const overview = await fastify.analytics.getGuildOverview(
        req.params.guildId,
        req.analyticsRange,
      );
      return reply.send(overview);
    },
  );
}
