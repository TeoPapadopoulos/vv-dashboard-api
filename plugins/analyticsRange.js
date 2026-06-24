import fp from 'fastify-plugin';
import { normalizeUtcRange } from '../modules/analytics/range.js';
import { createPremiumService } from '../modules/access/premium.service.js';

export default fp(
  async (fastify) => {
    const premiumService = createPremiumService(fastify.repos.entitlements, {
      premiumSKUId: fastify.config.PREMIUM_SKU_ID,
    });

    const FREE_MAX_DAYS = Number(fastify.config.FREE_MAX_DAYS ?? 7);

    fastify.decorateRequest('analyticsRange', null);

    fastify.decorate('normalizeAnalyticsRange', async function (req) {
      try {
        req.analyticsRange = normalizeUtcRange(req.query);
      } catch (err) {
        if (err instanceof Error && err.code === 'INVALID_RANGE')
          throw fastify.errors.invalidRange(err.details);
        if (err instanceof Error && err.code === 'INVALID_DATE_FORMAT')
          throw fastify.errors.invalidDateFormat(err.details?.value);
        throw err;
      }
    });

    fastify.decorate('requireAnalyticsRangeAccess', async function (req) {
      const isPremium = await premiumService.hasActivePremium(
        req.params.guildId,
      );
      req.guildPremium = { active: isPremium };

      if (isPremium) return;

      const { days } = req.analyticsRange;
      if (days > FREE_MAX_DAYS) {
        throw fastify.errors.rangeNotAllowed(FREE_MAX_DAYS, days);
      }
    });

    fastify.decorate('requireLeaderboardMetricAccess', async function (req) {
      const metric = req.query.metric ?? 'activeTime';
      const limit = req.query.limit ?? 10;
      if ((metric !== 'activeTime' || limit > 10) && !req.guildPremium?.active) throw fastify.errors.premiumRequired();
      return;

    })
  },
  {
    name: 'analyticsRange',
    dependencies: ['fastifyEnv', 'mongodb', 'repos', 'errors', 'accessPolicy'],
  },
);
