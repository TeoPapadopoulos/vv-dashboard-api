export function createPremiumService(entitlementRepository, { premiumSKUId }) {
  async function hasActivePremium(guildId) {
    const entitlement =
      await entitlementRepository.findActiveEntitlementForGuild(
        guildId,
        premiumSKUId,
      );
    return Boolean(entitlement);
  }
  return {
    hasActivePremium,
  };
}
