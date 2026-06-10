export function createGuildRepository(collection){
    return {
        async findByGuildId(guildId) {
            const guild = await collection.findOne({ guildId });
            if (!guild) return null;
            return guild;
    },
  };
}
