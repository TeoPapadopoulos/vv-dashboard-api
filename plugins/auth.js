import fp from 'fastify-plugin';
import {
  createAuthSessionsService,
  SESSION_COOKIE_NAME,
} from '../modules/auth/authSessions.service.js';
import { createDiscordService } from '../modules/auth/discord.service.js';

export default fp(
  async (fastify) => {
    fastify.decorateRequest('sessionToken', null);
    fastify.decorateRequest('user', null);

    fastify.decorate(
      'authSessions',
      createAuthSessionsService(fastify.repos.authSessions),
    );
    fastify.decorate('discord', createDiscordService(fastify.config));

    fastify.decorate('loadUserFromCookie', async function (req) {
      try {
        const rawToken = req.cookies[SESSION_COOKIE_NAME];
        if (!rawToken) return null;

        const unsigned = req.unsignCookie(rawToken);
        if (!unsigned.valid || !unsigned.value) return null;

        const session = await fastify.authSessions.get(unsigned.value);
        if (!session) return null;

        req.sessionToken = unsigned.value;
        req.user = {
          ...session.user,
          guilds: session.guilds,
        };
      } catch (err) {
        req.log.warn({ err }, 'Error loading user from cookie');
      }
    });

    fastify.addHook(
      'onRequest',
      async (req, res) => await fastify.loadUserFromCookie(req),
    );

    fastify.decorate('requireUser', async function (req, res) {
      if (!req.user) throw fastify.errors.unauthorized();
    });
  },
  { name: 'auth', dependencies: ['fastifyEnv', 'cookie', 'mongodb', 'oauth2', 'repos', 'sensible', 'errors'] },
);
