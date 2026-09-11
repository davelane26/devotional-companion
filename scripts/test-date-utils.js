// Exact logic mirrored from src/utils/dateUtils.ts
const DAY_OFFSETS = {
  Monday: 0,
  Tuesday: 1,
  Wednesday: 2,
  Thursday: 3,
  Friday: 4,
  Saturday: 5,
  Sunday: 6,
};

function getTodayDateString() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function parseDateString(dateStr) {
  const [y, m, d] = dateStr.split('-').map(Number);
  return new Date(y, m - 1, d);
}

function addDaysToDate(dateStr, days) {
  const date = parseDateString(dateStr);
  date.setDate(date.getDate() + days);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function isDateInWeek(dateStr, weekOf) {
  const target = parseDateString(dateStr).getTime();
  const start = parseDateString(weekOf).getTime();
  const end = parseDateString(addDaysToDate(weekOf, 6)).getTime();
  return target >= start && target <= end;
}

function getSermonDayDate(weekOf, day) {
  const offset = DAY_OFFSETS[day] ?? 0;
  return addDaysToDate(weekOf, offset);
}

console.log('Testing date logic:');
const today = getTodayDateString();
console.log('Today:', today);
const weekOf = '2026-09-07';
console.log('Is today in week of 2026-09-07?', isDateInWeek(today, weekOf));
console.log('Monday:', getSermonDayDate(weekOf, 'Monday'));
console.log('Thursday:', getSermonDayDate(weekOf, 'Thursday'));
console.log('Saturday:', getSermonDayDate(weekOf, 'Saturday'));

if (getSermonDayDate(weekOf, 'Thursday') === '2026-09-10') {
  console.log('PASS: Thursday correctly mapped to 2026-09-10');
} else {
  console.error('FAIL');
}
