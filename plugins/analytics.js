import fp from 'fastify-plugin';
import { createAnalyticsService } from '../modules/analytics/analytics.service.js';
import { createGuildAnalyticsRepository } from '../modules/analytics/guild.repository.js';
import { createChannelAnalyticsRepository } from '../modules/analytics/channels.repository.js';
import { createLeaderboardsRepository } from '../modules/analytics/leaderboards.repository.js';
import { createUserAnalyticsRepository } from '../modules/analytics/user.repository.js';

export default fp(
  async (fastify) => {
    const voiceSessionsCollection =
      fastify.mongo.db.collection('voicesessions');

    const repos = {
      guild: createGuildAnalyticsRepository(voiceSessionsCollection),
      user: createUserAnalyticsRepository(voiceSessionsCollection),
      channels: createChannelAnalyticsRepository(voiceSessionsCollection),
      leaderboards: createLeaderboardsRepository(voiceSessionsCollection),
    };
    fastify.decorate('analytics', createAnalyticsService(repos));
  },
  { name: 'analytics', dependencies: ['fastifyEnv', 'mongodb'] },
);
