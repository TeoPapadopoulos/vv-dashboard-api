import fp from 'fastify-plugin';
import { createGuildRepository } from '../modules/guilds/guild.repository.js';
import { createEntitlementRepository } from '../modules/entitlements/entitlement.repository.js';
import { createAuthSessionsRepository } from '../modules/auth/authSessions.repository.js';


export default fp(
  async (fastify) => {
    fastify.decorate('repos', {
      guilds: createGuildRepository(fastify.mongo.db.collection('guilds')),
      entitlements: createEntitlementRepository(
        fastify.mongo.db.collection('entitlements'),
      ),
      authSessions: createAuthSessionsRepository(
        fastify.mongo.db.collection('dashboard_sessions'),
      ),
    });
  },
  { name: 'repos', dependencies: ['mongodb'] },
);
