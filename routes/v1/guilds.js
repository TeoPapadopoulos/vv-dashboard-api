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
  fastify.get(
    '/guilds/:guildId/analytics',
    {
      onRequest: [fastify.requireUser],
      preHandler: [fastify.requireGuildAccess, fastify.normalizeAnalyticsRange],
      schema: {
        description: 'Get analytics for a guild',
        tags: ['analytics'],
        params: {
          type: 'object',
          properties: {
            guildId: { type: 'string' },
          },
          required: ['guildId'],
        },
        querystring: { $ref: 'AnalyticsRangeQuery#' },
        response: { ...errorResponse(400, 401, 403) },
      },
    },
    async (req, reply) => {
      return reply.send({
        analyticsRange: req.analyticsRange,
        guildId: req.params.guildId,
      });
    },
  );

  fastify.get(
    '/guilds/:guildId/overview',
    {
      onRequest: [fastify.requireUser],
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
          200: {
            type: 'object',
            properties: {
              totalUsers: { type: 'number' },
              totalSessions: { type: 'number' },
              totalActiveTime: { type: 'number' },
              averageSessionDuration: { type: 'number' },
              topChannels: {
                type: 'array',
                items: {
                  type: 'object',
                  properties: {
                    channelId: { type: 'string' },
                    channelName: { type: 'string' },
                    totalSessions: { type: 'number' },
                    totalActiveTime: { type: 'number' },
                  },
                },
              },
              peakActivityHours: { type: 'array', items: { type: 'number' } },
              cameraUsagePercentage: { type: 'number' },
              streamingUsagePercentage: { type: 'number' },
            },
            required: [
              'totalUsers',
              'totalSessions',
              'totalActiveTime',
              'averageSessionDuration',
              'topChannels',
              'peakActivityHours',
              'cameraUsagePercentage',
              'streamingUsagePercentage',
            ],
          },
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
