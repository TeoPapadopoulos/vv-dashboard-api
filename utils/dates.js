export function appError(code, message, details) {
  const err = new Error(message);
  err.code = code;
  err.details = details;
  return err;
}

export function parseUtcInstant(value) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    throw appError('INVALID_DATE_FORMAT', 'Invalid date format', { value });
  }
  return date;
}

export function daysBetween(from, to) {
  const ms = to.getTime() - from.getTime();
  return Math.floor(ms / (1000 * 60 * 60 * 24)) + 1;
}
