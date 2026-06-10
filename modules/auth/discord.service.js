export function createDiscordService(config) {
  const baseUrl = config.DISCORD_API_URL;

  async function call(path, accessToken) {
    const res = await fetch(`${baseUrl}${path}`, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    if (!res.ok) {
      throw new Error(
        `Discord API ${path} failed: ${res.status} ${res.statusText}`,
      );
    }
    return res.json();
  }

  return {
    getCurrentUser: (accessToken) => call('/users/@me', accessToken),
    getCurrentUserGuilds: (accessToken) =>
      call('/users/@me/guilds', accessToken),
  };
}
