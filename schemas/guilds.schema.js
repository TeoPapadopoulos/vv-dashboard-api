 const guild = {
  $id: 'Guild',
  type: 'object',
  properties: {
    _id: { type: 'string' },
    guildId: { type: 'string' },
    guildName: { type: 'string' },
    users: { type: 'array', items: { type: 'string' } },
    isActive: { type: 'boolean' },
    createdAt: { type: 'string' },
    firstSource: { type: 'string' },
  },
  required: [
    '_id',
    'guildId',
    'guildName',
    'users',
    'isActive',
    'createdAt',
    'firstSource',
  ],
};
 const guildAccess = {
  $id: 'GuildAccess',
  type: 'object',
  properties: {
    isOwner: { type: 'boolean' },
    isAdmin: { type: 'boolean' },
    canManage: { type: 'boolean' },
  },
  required: ['isOwner', 'isAdmin', 'canManage'],
};

export const guildResponse = {
    $id: 'GuildResponse',
    type: 'object',
    properties: {
        guild: guild,
        premium: { type: 'boolean' },
        access: guildAccess,
    },
    required: ['guild', 'premium', 'access'],
}
