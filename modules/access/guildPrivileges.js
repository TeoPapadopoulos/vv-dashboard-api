const ADMINISTRATOR = 1n << 3n;
const MANAGE_GUILD = 1n << 5n;

export function parseGuildPrivileges(guild) {
  const bits = BigInt(guild.permissions ?? '0');
  const isOwner = Boolean(guild.owner);
  const isAdmin = (bits & ADMINISTRATOR) === ADMINISTRATOR;
  const canManage =
    isOwner || isAdmin || (bits & MANAGE_GUILD) === MANAGE_GUILD;
  return {
    isOwner,
    isAdmin,
    canManage,
  };
}

export function toSessionGuild(guild) {
  const { isOwner, isAdmin, canManage } = parseGuildPrivileges(guild);
  return {
    id: guild.id,
    name: guild.name,
    icon: guild.icon,
    isOwner,
    isAdmin,
    canManage,
  };
}
