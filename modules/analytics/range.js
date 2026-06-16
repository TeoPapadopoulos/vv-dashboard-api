import { parseUtcInstant, daysBetween, appError } from '../../utils/dates.js';

export function normalizeUtcRange({ from, to }) {
  if (!from || !to) {
    throw appError('INVALID_RANGE', 'Invalid range', { from, to });
  }

  const fromDate = parseUtcInstant(from);
  const toDate = parseUtcInstant(to);

  if (fromDate > toDate) {
    throw appError('INVALID_RANGE', 'From date must be before to date', {
      from,
      to,
    });
  }

  return {
    from: fromDate,
    to: toDate,
    days: daysBetween(fromDate, toDate),
  };
}
