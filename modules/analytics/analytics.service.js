export function createAnalyticsService(analyticsRepos) {
  return {
    async getGuildOverview(guildId, range) {
      const { from, to } = range;

      const stats = await analyticsRepos.guild.getGuildOverview(
        guildId,
        from,
        to,
      );

      return {
        totalUsers: stats.totalUsers,
        totalSessions: stats.totalSessions,
        averageSessionDuration: stats.averageSessionDuration,
        topChannels: stats.topChannels,
        peakActivityHours: stats.peakActivityHours,
        cameraUsagePercentage:
          Math.round(stats.cameraUsagePercentage * 10) / 10,
        streamingUsagePercentage:
          Math.round(stats.streamingUsagePercentage * 10) / 10,
        firstSessionDate: stats.firstSessionDate,
        lastSessionDate: stats.lastSessionDate,
      };
    },
    async getLeaderboard(guildId, range, metric, limit) {
      const { from, to } = range;
      const data = await analyticsRepos.leaderboards.getLeaderboard(
        guildId, from, to, limit, metric,
      );
      return { metric, limit, ...data };
    }
  };
}
