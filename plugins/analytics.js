import fp from 'fastify-plugin';
import { createAnalyticsService } from '../modules/analytics/analytics.service.js';
import { createGuildAnalyticsRepository } from '../modules/analytics/guild.repository.js';
import { createChannelAnalyticsRepository } from '../modules/analytics/channel.repository.js';
import { createLeaderboardRepository } from '../modules/analytics/leaderboard.repository.js';
import { createUserAnalyticsRepository } from '../modules/analytics/user.repository.js';

export default fp(
  async (fastify) => {
    const voiceSessionsCollection =
      fastify.mongo.db.collection('voicesessions');

    const repos = {
      guilds: createGuildAnalyticsRepository(voiceSessionsCollection),
      users: createUserAnalyticsRepository(voiceSessionsCollection),
      channels: createChannelAnalyticsRepository(voiceSessionsCollection),
      leaderboards: createLeaderboardRepository(voiceSessionsCollection),
    };
    fastify.decorate('analytics', createAnalyticsService(repos));
  },
  { name: 'analytics', dependencies: ['fastifyEnv', 'mongodb'] },
);
