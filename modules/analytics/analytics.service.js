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
        guildId,
        from,
        to,
        limit,
        metric,
      );
      let normalizedMetric = '';
      switch (metric) {
        case 'activeTime':
          normalizedMetric = 'Active Time';
          break;
        case 'cameraTime':
          normalizedMetric = 'Camera Time';
          break;
        case 'streamingTime':
          normalizedMetric = 'Streaming Time';
          break;
        case 'soloTime':
          normalizedMetric = 'Solo Time';
          break;
        case 'deafenedTime':
          normalizedMetric = 'Deafened Time';
          break;
        case 'mutedTime':
          normalizedMetric = 'Muted Time';
          break;
        case 'activeDays':
          normalizedMetric = 'Active Days';
          break;
        default:
          normalizedMetric = 'Active Time';
          break;
      }

      return { metric: normalizedMetric, limit, ...data };
    },
  };
}
