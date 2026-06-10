import crypto from 'node:crypto';

export const SESSION_COOKIE_NAME = 'sid';
export const SESSION_TTL_MS = 7 * 24 * 60 * 60 * 1000;
export const SESSION_TTL_SECONDS = SESSION_TTL_MS / 1000;

function generateToken() {
  return crypto.randomBytes(32).toString('base64');
}

function hashToken(token) {
  return crypto.createHash('sha256').update(token).digest('hex');
}

export function createAuthSessionsService(authSessionsRepository) {
  async function create({ user, guilds, discord }) {
    const token = generateToken();
    const now = Date.now();

    const doc = {
      sessionIdHash: hashToken(token),
      discordUserId: user.id,
      user,
      guilds,
      createdAt: now,
      updatedAt: now,
      expiresAt: new Date(now + SESSION_TTL_MS),
      ...(discord ? { discord } : {}),
    };

    await authSessionsRepository.create(doc);
    return { token, session: doc };
  }

  async function get(token) {
    if (!token) return null;

    const session = await authSessionsRepository.get(
      hashToken(token),
    );

    if (!session) return null;

    if (session.expiresAt.getTime() <= Date.now()) {
      await authSessionsRepository.destroy(hashToken(token));
      return null;
    }
    return session;
  }

  async function updateGuilds(token, guilds) {
    await authSessionsRepository.updateGuilds(
      hashToken(token),
      guilds,
    );
  }

  async function destroy(token) {
    if (!token) return;
    await authSessionsRepository.destroy(hashToken(token));
  }

  async function destroyAllForUser(discordUserId) {
    await authSessionsRepository.destroyAll(discordUserId);
  }

  return {
    create,
    get,
    updateGuilds,
    destroy,
    destroyAllForUser,
  };
}
