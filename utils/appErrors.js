export function createAppErrors(httpErrors) {
  const { createError } = httpErrors;

  return {
    unauthorized: () =>
      createError(401,  'Authentication required', { code: 'UNAUTHORIZED' }),
    guildAccessDenied: () =>
      createError(403, 'You are not in this guild', { code: 'GUILD_ACCESS_DENIED' }),
    guildNotFound: (guildId) =>
      createError(
        404,
        `Guild ${guildId} not found`,
        { code: 'GUILD_NOT_FOUND', details: { guildId } },
      ),
    premiumRequired: () =>
      createError(
        403,
        'This feature requires an active premium subscription',
        { code: 'PREMIUM_REQUIRED' },
      ),
    rangeNotAllowed: (maxDays, requestedDays) =>
      createError(
        403,
        `Free guilds can request for analytics up to ${maxDays} days`,
        { code: 'RANGE_NOT_ALLOWED', details: { maxDays, requestedDays } },
      ),
    validation: (details) =>
      createError(
        400,
        'Request validation failed',
        { code: 'VALIDATION_ERROR', details },
      ),
  };
}
