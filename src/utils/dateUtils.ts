/**
 * Date utility helpers for resolving today's reading, day calculations, and formatting.
 */

export const DAY_OFFSETS: Record<string, number> = {
  Monday: 0,
  Tuesday: 1,
  Wednesday: 2,
  Thursday: 3,
  Friday: 4,
  Saturday: 5,
  Sunday: 6,
};

export const DAY_NAMES = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'] as const;

/**
 * Returns today's date formatted as YYYY-MM-DD in local time.
 */
export function getTodayDateString(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * Returns the day of the week name for today (e.g., "Thursday")
 */
export function getTodayDayOfWeek(): string {
  const now = new Date();
  return DAY_NAMES[now.getDay()];
}

/**
 * Parse a YYYY-MM-DD string into a local Date object.
 */
export function parseDateString(dateStr: string): Date {
  const [y, m, d] = dateStr.split('-').map(Number);
  return new Date(y, m - 1, d);
}

/**
 * Add N days to a YYYY-MM-DD date string and return the resulting YYYY-MM-DD string.
 */
export function addDaysToDate(dateStr: string, days: number): string {
  const date = parseDateString(dateStr);
  date.setDate(date.getDate() + days);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * Format date string into human-friendly string: e.g. "Thursday, Sep 10, 2026"
 */
export function formatReadableDate(dateStr: string): string {
  try {
    const date = parseDateString(dateStr);
    return date.toLocaleDateString(undefined, {
      weekday: 'long',
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  } catch {
    return dateStr;
  }
}

/**
 * Format date string for scrubber: e.g. { dayName: "Thu", dayNum: "10" }
 */
export function formatDayDisplay(dateStr: string): { dayName: string; dayNum: string; isSunday: boolean } {
  try {
    const date = parseDateString(dateStr);
    const dayName = date.toLocaleDateString(undefined, { weekday: 'short' });
    const dayNum = String(date.getDate());
    const isSunday = date.getDay() === 0;
    return { dayName, dayNum, isSunday };
  } catch {
    return { dayName: '', dayNum: '', isSunday: false };
  }
}

/**
 * Check if a date string is today
 */
export function isToday(dateStr: string): boolean {
  return dateStr === getTodayDateString();
}

/**
 * Check if date falls in the week starting on weekOf (Monday to Sunday)
 */
export function isDateInWeek(dateStr: string, weekOf: string): boolean {
  const target = parseDateString(dateStr).getTime();
  const start = parseDateString(weekOf).getTime();
  const end = parseDateString(addDaysToDate(weekOf, 6)).getTime();
  return target >= start && target <= end;
}

/**
 * Get date for a sermon day based on week_of
 */
export function getSermonDayDate(weekOf: string, day: string): string {
  const offset = DAY_OFFSETS[day] ?? 0;
  return addDaysToDate(weekOf, offset);
}

