import {
  SESSION_COOKIE_NAME,
  SESSION_TTL_SECONDS,
} from '../../modules/auth/authSessions.service.js';
import { toSessionGuild } from '../../modules/access/guildPrivileges.js';
import { encryptSecret } from '../../modules/auth/crypto.js';

export default async function (fastify) {
  fastify.get(
    '/auth/discord/callback',
    {
      config: { scope: 'identify' },

      schema: {
        description: 'Callback for Discord OAuth2',
        tags: ['auth'],
        querystring: {
          type: 'object',
          properties: {
            code: { type: 'string' },
          },
          required: ['code'],
        },
      },
    },
    async (req, res) => {
      const { token } =
        await fastify.discordOAuth2.getAccessTokenFromAuthorizationCodeFlow(
          req,
        );
      const me = await fastify.discord.getCurrentUser(token.access_token);
      const rawGuilds = await fastify.discord.getCurrentUserGuilds(
        token.access_token,
      );

      const user = {
        id: me.id,
        username: me.username,
        globalName: me.global_name ?? null,
        avatar: me.avatar ?? null,
      };
      const guilds = rawGuilds.map(toSessionGuild);

      const discord = {
        accessToken: encryptSecret(
          token.access_token,
          fastify.config.SECRET_KEY,
        ),
        expiresAt: new Date(Date.now() + token.expires_in * 1000),
      };

      const { token: sid } = await fastify.authSessions.create({
        user,
        guilds,
        discord,
      });

      res.setCookie(SESSION_COOKIE_NAME, sid, {
        path: '/',
        httpOnly: true,
        sameSite: 'lax',
        secure: process.env.NODE_ENV === 'production',
        signed: true,
        maxAge: SESSION_TTL_SECONDS,
      });

      return res.redirect(fastify.config.DASHBOARD_URL, 302);
    },
  );

  fastify.get('/auth/logout', async (req, res) => {
    await fastify.authSessions.destroy(req.sessionToken);
    res.clearCookie(SESSION_COOKIE_NAME, { path: '/' });
    return res.send({ ok: true });
  });
}
