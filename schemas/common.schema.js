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

export const analyticsRangeQuery = {
  $id: 'AnalyticsRangeQuery',
  type: 'object',
  properties: {
    from: {
      type: 'string',
      format: 'date-time',
      description: 'Start of range UTC',
      examples: ['2025-04-20T00:00:00Z'],
    },
    to: {
      type: 'string',
      format: 'date-time',
      description: 'End of range UTC',
      examples: ['2025-05-20T00:00:00Z'],
    },
  },
  required: ['from', 'to'],
};
