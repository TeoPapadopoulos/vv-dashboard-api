import fp from 'fastify-plugin';
import { createAccessService } from '../modules/access/access.service.js';
import { createPremiumService } from '../modules/access/premium.service.js';

export default fp(
  async (fastify) => {
    // Services
    const accessService = createAccessService(fastify.repos.guilds);
    const premiumService = createPremiumService(fastify.repos.entitlements, {
      premiumSKUId: fastify.config.PREMIUM_SKU_ID,
    });

    fastify.decorateRequest('guild', null);
    fastify.decorateRequest('guildAccess', null);
    fastify.decorateRequest('guildPremium', null);

    fastify.decorate('requireGuildAccess', async function (req, reply) {
      const { guildId } = req.params;
      const membership = req.user.guilds.find((g) => g.id === guildId);
      if (!membership)
        return reply
          .code(403)
          .send({ error: 'You are not in this guild access denied' });

      const guild = await accessService.getActiveGuild(guildId);
      if (!guild) return reply.code(404).send({ error: 'Guild not found' });

      req.guild = guild;
      req.guildAccess = membership;
    });

    fastify.decorate('requireGuildPremium', async function (req, reply) {
      const activePremium = await premiumService.hasActivePremium(
        req.params.guildId,
      );
      if (!activePremium)
        return reply
          .code(403)
          .send({ error: 'Guild does not have active premium' });
      req.guildPremium = { active: true };
    });
  },
  { name: 'accessPolicy', dependencies: ['fastifyEnv', 'mongodb', 'auth', 'repos'] },
);
