import fp from 'fastify-plugin';
import fastifyEnv from '@fastify/env';

export default fp(
  async (fastify) => {
    await fastify.register(fastifyEnv, {
      confKey: 'config',
      schema: {
        type: 'object',
        required: [
          'DISCORD_CLIENT_ID',
          'DISCORD_CLIENT_SECRET',
          'DISCORD_OAUTH_REDIRECT_URL',
          'DISCORD_API_URL',
          'MONGO_URL',
          'SECRET_KEY',
          'DASHBOARD_URL',
          'PREMIUM_SKU_ID',
        ],
        properties: {
          DISCORD_CLIENT_ID: { type: 'string' },
          DISCORD_CLIENT_SECRET: { type: 'string' },
          DISCORD_OAUTH_REDIRECT_URL: { type: 'string' },
          DISCORD_API_URL: { type: 'string' },
          MONGO_URL: { type: 'string' },
          SECRET_KEY: { type: 'string' },
          DASHBOARD_URL: { type: 'string' },
          PREMIUM_SKU_ID: { type: 'string' },
        },
      },
      dotenv: true,
    });
  },
  { name: 'fastifyEnv' },
);
