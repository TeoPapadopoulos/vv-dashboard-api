export function createEntitlementRepository(collection) {
  return {
    async findActiveEntitlementForGuild(guildId, premiumSKUId) {
      const now = new Date();
      const entitlement = await collection.findOne({
        guildId,
        skuId: premiumSKUId,
        deleted: false,
        $and: [
          {
            $or: [
              { startsTimestamp: null },
              { startsTimestamp: { $lte: now } },
            ],
          },
          { $or: [{ endsTimestamp: null }, { endsTimestamp: { $gt: now } }] },
        ],
      });
      if (!entitlement) return null;
      return entitlement;
    },
  };
}
