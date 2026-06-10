import fp from 'fastify-plugin';
import { createAppErrors } from '../utils/appErrors.js';

export default fp(
  async (fastify) => {
    fastify.decorate('errors', createAppErrors(fastify.httpErrors));

    fastify.setErrorHandler((err, req, reply) => {
      if (err.validation) {
        const details = err.validation.map((v) => ({
          path: `${err.validationContext ?? ''}${v.instancePath}`,
          message: v.message,
        }));

        return reply.code(400).send(fastify.errors.validation(details));
      }

      const statusCode = err.statusCode ?? 500;

      if (statusCode >= 500) {
        req.log.error({ err }, err.message);
        return reply.code(500).send(
          fastify.httpErrors.internalServerError('Something went wrong', {
            code: 'INTERNAL_ERROR',
          }),
        );
      }

      req.log.info({ err, code: err.code }, err.message);

      return reply.code(statusCode).send({
        statusCode,
        error: err.name,
        code: err.code ?? 'HTTP_ERROR',
        message: err.message,
        details: err.details ?? null,
      });
    });

    fastify.setNotFoundHandler((req, reply) => {
      reply.send(
        fastify.httpErrors.createError(
          404,
          `Route ${req.method} ${req.url} not found`,
          {
            code: 'ROUTE_NOT_FOUND',
          },
        ),
      );
    });
  },
  { name: 'errors', dependencies: ['sensible'] },
);
