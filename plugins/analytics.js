import fp from 'fastify-plugin';
import { createAnalyticsService } from '../modules/analytics/analytics.service.js';
import { createAnalyticsRepository } from '../modules/analytics/analytics.repository.js';

export default fp(
  async (fastify) => {
    const analyticsRepository = createAnalyticsRepository(
      fastify.mongo.db.collection('voicesessions'),
    );
    const analyticsService = createAnalyticsService(analyticsRepository);
    fastify.decorate('analytics', analyticsService);
  },
  { name: 'analytics', dependencies: ['fastifyEnv', 'mongodb'] },
);
