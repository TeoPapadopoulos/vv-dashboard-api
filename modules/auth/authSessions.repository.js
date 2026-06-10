export function createAuthSessionsRepository(collection) {
  return {
    async create(sessionDoc) {
      await collection.insertOne(sessionDoc);
    },
    async get(sessionIdHash) {
      const session = await collection.findOne({ sessionIdHash });
      if (!session) return null;
      return session;
    },
    async updateGuilds(sessionIdHash, guilds) {
      await collection.updateOne(
        { sessionIdHash },
        { $set: { guilds, updatedAt: Date.now() } },
      );
    },
    async destroy(sessionIdHash) {
      await collection.deleteOne({ sessionIdHash });
    },
    async destroyAll(discordUserId) {
      await collection.deleteMany({ discordUserId });
    },
  };
}
