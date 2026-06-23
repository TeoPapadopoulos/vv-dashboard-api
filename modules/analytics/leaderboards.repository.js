export function createLeaderboardsRepository(collection) {
  return {
    async getActiveTimeLeaderboard(guildId, from, to, limit) {
      const [result] = await collection
        .aggregate([
          {
            $match: {
              guildId,
              startTime: { $gte: from, $lte: to },
            },
          },
          {
            $group: {
              _id: '$userId',
              username: {
                $top: { sortBy: { startTime: -1 }, output: '$username' },
              },
              value: {
                $sum: { $max: ['$totalActiveTime', 0] },
              },
              totalActiveTime: { $sum: '$totalActiveTime' },
              totalSessions: { $sum: 1 },
            },
          },
          { $sort: { value: -1, _id: 1 } },
          {
            $facet: {
              total: [{ $count: 'count' }],
              entries: [
                { $limit: limit },
                {
                  $setWindowFields: {
                    sortBy: { value: -1},
                    output: { rank: { $rank: {} } },
                  },
                },
                {
                  $project: {
                    _id: 0,
                    rank: 1,
                    userId: '$_id',
                    username: 1,
                    value: 1,
                    totalSessions: 1,
                    totalActiveTime: 1,
                  },
                },
              ],
            },
          },
        ])
        .toArray();

      return {
        total: result?.total[0]?.count ?? 0,
        entries: result?.entries ?? [],
      };
    },
  };
}
