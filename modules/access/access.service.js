export function createAccessService(guildRepository) {
  async function getActiveGuild(guildId) {
    return guildRepository.findByGuildId(guildId);
  }
  return {
    getActiveGuild,
  };
}
