const METRIC_FIELD = {
  activeTime: '$totalActiveTime',
  totalTime: '$totalTime',
  streamingTime: '$totalStreamingTime',
  cameraTime: '$totalCameraOnTime',
  soloTime: '$totalSoloTime',
  mutedTime: '$totalMutedTime',
  deafenedTime: '$totalDeafenTime',
};
function valueExprFor(metric) {
  if (metric === 'activeTime') {
    return { $sum: { $max: ['$totalActiveTime', 0] } };
  }
  if (metric === 'activeDays') {
    // handled separately because it needs $addToSet then $size
    return null;
  }
  return { $sum: METRIC_FIELD[metric] };
}
function buildLeaderboardPipeline({ guildId, from, to, limit, metric }) {
  const isActiveDays = metric === 'activeDays';
  const groupStage = isActiveDays
    ? {
        _id: '$userId',
        username: { $top: { sortBy: { startTime: -1 }, output: '$username' } },
        days: {
          $addToSet: { $dateTrunc: { date: '$startTime', unit: 'day' } },
        },
        totalActiveTime: { $sum: '$totalActiveTime' },
        totalSessions: { $sum: 1 },
      }
    : {
        _id: '$userId',
        username: { $top: { sortBy: { startTime: -1 }, output: '$username' } },
        value: valueExprFor(metric),
        totalActiveTime: { $sum: '$totalActiveTime' },
        totalSessions: { $sum: 1 },
      };
  const entries = [
    { $group: groupStage },
    ...(isActiveDays ? [{ $set: { value: { $size: '$days' } } }] : []),
    {
      $setWindowFields: {
        sortBy: { value: -1 },
        output: { rank: { $rank: {} } },
      },
    },
    { $sort: { value: -1, _id: 1 } },
    { $limit: limit },
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
  ];
  return [
    { $match: { guildId, startTime: { $gte: from, $lte: to } } },
    {
      $facet: {
        dateBounds: [
          {
            $group: {
              _id: null,
              firstSessionDate: { $min: '$startTime' },
              lastSessionDate: { $max: '$endTime' },
            },
          },
          { $project: { _id: 0, firstSessionDate: 1, lastSessionDate: 1 } },
        ],
        total: [{ $group: { _id: '$userId' } }, { $count: 'count' }],
        entries,
      },
    },
  ];
}

export function createLeaderboardRepository(collection) {
  return {
    async getLeaderboard(guildId, from, to, limit, metric) {
      const [result] = await collection
        .aggregate(
          buildLeaderboardPipeline({ guildId, from, to, limit, metric }),
        )
        .toArray();
      const dateBounds = result?.dateBounds?.[0];
      return {
        total: result?.total?.[0]?.count ?? 0,
        entries: result?.entries ?? [],
        firstSessionDate: dateBounds?.firstSessionDate ?? null,
        lastSessionDate: dateBounds?.lastSessionDate ?? null,
      };
    },
  };
}
