export const guildOverviewResponse = {
  $id: 'GuildOverviewResponse',
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

export const leaderboardQuery = {
  $id: 'LeaderboardQuery',
  type: 'object',
  properties: {
    metric: {
      type: 'string',
      enum: [
        'activeTime',
        'totalTime',
        'cameraTime',
        'streamingTime',
        'soloTime',
        'deafenedTime',
        'mutedTime',
        'activeDays',
      ],
      default: 'activeTime',
    },
    limit: { type: 'number', default: 10 },
  },
};

const leaderboardEntry = {
  $id: 'LeaderboardEntry',
  type: 'object',
  properties: {
    userId: { type: 'string' },
    username: { type: 'string' },
    value: { type: 'number' },
    totalSessions: { type: 'number' },
    totalActiveTime: { type: 'number' },
    rank: { type: 'number' },
  },
};
export const leaderboardResponse = {
  $id: 'LeaderboardResponse',
  type: 'object',
  properties: {
    metric: { type: 'string' },
    total: { type: 'number' },
    entries: { type: 'array', items: leaderboardEntry },
    limit: { type: 'number' },
    firstSessionDate: { type: 'string' },
    lastSessionDate: { type: 'string' },
  },
  required: [
    'metric',
    'total',
    'entries',
    'firstSessionDate',
    'lastSessionDate',
  ],
};
