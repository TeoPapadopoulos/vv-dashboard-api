import fastify from 'fastify';
import autoload from '@fastify/autoload';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const app = await fastify({
  logger: true,
});

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

await app.register(autoload, {
  dir: join(__dirname, 'plugins'),
});

await app.register(autoload, {
  dir: join(__dirname, 'routes'),
  options: { prefix: '/api' },
});

app.get('/', (req, res) => {
  if (req.user) {
    return res.send(`hello ${req.user.username}`, 302);
  }
  res.send('Hello World');
});

app.listen({ port: 3005 }, (err, address) => {
  if (err) {
    app.log.error(err);
    process.exit(1);
  }
  app.log.info(`Server is running on ${address}`);
});
