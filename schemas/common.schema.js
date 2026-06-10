export const apiErrorSchema = {
  $id: 'ApiError',
  type: 'object',
  properties: {
    statusCode: { type: 'number' },
    error: { type: 'string' },
    code: { type: 'string' },
    message: { type: 'string' },
    details: { type: 'object', nullable: true },
  },
  required: ['statusCode', 'error', 'code', 'message'],
};

export function errorResponse(...statusCodes) {
  return Object.fromEntries(
    statusCodes.map((code) => [code, { $ref: 'ApiError#' }]),
  );
}
