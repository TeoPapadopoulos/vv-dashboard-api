import fp from 'fastify-plugin';
import oauth2 from '@fastify/oauth2';

export default fp(
  async (fastify) => {
    await fastify.register(oauth2, {
      name: 'discordOAuth2',
      credentials: {
        client: {
          id: fastify.config.DISCORD_CLIENT_ID,
          secret: fastify.config.DISCORD_CLIENT_SECRET,
        },
        auth: oauth2.DISCORD_CONFIGURATION,
      },
      startRedirectPath: '/api/v1/auth/discord/login',
      callbackUri: fastify.config.DISCORD_OAUTH_REDIRECT_URL,
      scope: ['identify', 'guilds'],
      cookie: {
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        httpOnly: true,
      },
    });
  },
  { name: 'oauth2', dependencies: ['fastifyEnv'] },
);
