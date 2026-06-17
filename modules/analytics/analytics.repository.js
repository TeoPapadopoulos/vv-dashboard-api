export function createAnalyticsRepository(collection) {
  return {
    async getGuildOverview(guildId, from, to) {
      const [result] = await collection
        .aggregate([
          {
            $match: {
              guildId,
              startTime: {
                $gte: from,
                $lte: to,
              },
            },
          },
          {
            $facet: {
              totals: [
                {
                  $group: {
                    _id: null,
                    totalUsers: { $addToSet: '$userId' },
                    totalSessions: { $sum: 1 },
                    totalVoiceTime: { $sum: '$totalTime' },
                    totalActiveTime: { $sum: { $max: [0, '$totalActiveTime'] } },
                    totalCameraTime: { $sum: '$totalCameraOnTime' },
                    totalStreamingTime: { $sum: '$totalStreamingTime' },
                  },
                },
                {
                  $project: {
                    _id: 0,
                    totalUsers: { $size: '$totalUsers' },
                    totalSessions: 1,
                    totalVoiceTime: 1,
                    totalActiveTime: 1,
                    totalCameraTime: 1,
                    totalStreamingTime: 1,
                    averageSessionDuration: {
                      $cond: [
                        { $gt: ['$totalSessions', 0] },
                        { $divide: ['$totalVoiceTime', '$totalSessions'] },
                        0,
                      ],
                    },
                    cameraUsagePercentage: {
                      $cond: [
                        { $gt: ['$totalCameraTime', 0] },
                        {
                          $multiply: [
                            {
                              $divide: ['$totalCameraTime', '$totalVoiceTime'],
                            },
                            100,
                          ],
                        },
                        0,
                      ],
                    },
                    streamingUsagePercentage: {
                      $cond: [
                        { $gt: ['$totalVoiceTime', 0] },
                        {
                          $multiply: [
                            {
                              $divide: [
                                '$totalStreamingTime',
                                '$totalVoiceTime',
                              ],
                            },
                            100,
                          ],
                        },
                        0,
                      ],
                    },
                  },
                },
              ],
              topChannels: [
                {
                  $group: {
                    _id: '$channelId',
                    channelName: { $first: '$channelName' },
                    totalSessions: { $sum: 1 },
                    totalActiveTime: {
                      $sum: { $max: [0, '$totalActiveTime'] },
                    },
                  },
                },
                { $sort: { totalActiveTime: -1 } },
                { $limit: 5 },
                {
                  $project: {
                    _id: 0,
                    channelId: '$_id',
                    channelName: 1,
                    totalSessions: 1,
                    totalActiveTime: 1,
                  },
                },
              ],
              peakHours: [
                {
                  $group: {
                    _id: { $hour: '$startTime' },
                    sessions: { $sum: 1 },
                  },
                },
                { $sort: { _id: 1 } },
              ],
            },
          },
        ])
        .toArray();

      const totals = result?.totals[0] ?? {
        totalUsers: 0,
        totalSessions: 0,
        totalVoiceTime: 0,
        totalActiveTime: 0,
        averageSessionDuration: 0,
        cameraUsagePercentage: 0,
        streamingUsagePercentage: 0,
      };

      const peakActivityHours = Array.from({ length: 24 }, () => 0);
      for (const row of result?.peakHours ?? []) {
        peakActivityHours[row._id] = row.sessions;
      }

      return {
        ...totals,
        topChannels: result?.topChannels ?? [],
        peakActivityHours: peakActivityHours,
      };
    },
  };
}
