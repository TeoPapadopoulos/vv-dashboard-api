import fp from 'fastify-plugin';
import mongodb from '@fastify/mongodb';

export default fp(
  async (fastify) => {
    await fastify.register(mongodb, {
      url: fastify.config.MONGO_URL,
      forceClose: true,
    });
    await fastify.mongo.db.collection('dashboard_sessions').createIndex(
      {
        sessionIdHash: 1,
      },
      { unique: true },
    );

    await fastify.mongo.db
      .collection('dashboard_sessions')
      .createIndex({ discordUserId: 1 });

    await fastify.mongo.db
      .collection('dashboard_sessions')
      .createIndex({ expiresAt: 1 }, { expireAfterSeconds: 0 });
  },
  { name: 'mongodb', dependencies: ['fastifyEnv'] },
);
