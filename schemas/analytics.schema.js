export const analyticsOverviewResponse = {
  $id: 'AnalyticsOverviewResponse',
  type: 'object',
  properties: {
    totalUsers: { type: 'number' },
    totalSessions: { type: 'number' },
    averageSessionDuration: { type: 'number' },
    topChannels: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          channelId: { type: 'string' },
          channelName: { type: 'string' },
          totalSessions: { type: 'number' },
        },
      },
    },
    peakActivityHours: { type: 'array', items: { type: 'number' } },
    cameraUsagePercentage: { type: 'number' },
    streamingUsagePercentage: { type: 'number' },
    firstSessionDate: { type: 'string' },
    lastSessionDate: { type: 'string' },
  },
  required: [
    'totalUsers',
    'totalSessions',
    'averageSessionDuration',
    'topChannels',
    'peakActivityHours',
    'cameraUsagePercentage',
    'streamingUsagePercentage',
    'firstSessionDate',
    'lastSessionDate',
  ],
};
