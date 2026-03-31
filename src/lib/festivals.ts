export interface Festival {
  name: string;
  emoji: string;
  greeting: string;
  accentColor: string; // tailwind class
  startMonth: number; // 0-indexed
  startDay: number;
  endMonth: number;
  endDay: number;
}

const festivals: Festival[] = [
  // New Year
  { name: "New Year", emoji: "🎆", greeting: "Happy New Year!", accentColor: "from-yellow-400 to-amber-500", startMonth: 0, startDay: 1, endMonth: 0, endDay: 3 },
  // Valentine's Day
  { name: "Valentine's Day", emoji: "💕", greeting: "Happy Valentine's Day!", accentColor: "from-pink-400 to-rose-500", startMonth: 1, startDay: 12, endMonth: 1, endDay: 15 },
  // Holi
  { name: "Holi", emoji: "🎨", greeting: "Happy Holi!", accentColor: "from-fuchsia-400 to-orange-400", startMonth: 2, startDay: 13, endMonth: 2, endDay: 15 },
  // Easter (approx)
  { name: "Easter", emoji: "🐣", greeting: "Happy Easter!", accentColor: "from-violet-400 to-yellow-300", startMonth: 3, startDay: 18, endMonth: 3, endDay: 21 },
  // Eid (approx — shifts yearly, this is a rough window)
  { name: "Eid", emoji: "🌙", greeting: "Eid Mubarak!", accentColor: "from-emerald-400 to-teal-500", startMonth: 3, startDay: 9, endMonth: 3, endDay: 12 },
  // Mother's Day (2nd Sun May, approx)
  { name: "Mother's Day", emoji: "💐", greeting: "Happy Mother's Day!", accentColor: "from-pink-300 to-rose-400", startMonth: 4, startDay: 10, endMonth: 4, endDay: 12 },
  // Independence Day (US)
  { name: "Independence Day", emoji: "🇺🇸", greeting: "Happy 4th of July!", accentColor: "from-blue-500 to-red-500", startMonth: 6, startDay: 3, endMonth: 6, endDay: 5 },
  // Independence Day (India)
  { name: "Independence Day", emoji: "🇮🇳", greeting: "Happy Independence Day!", accentColor: "from-orange-400 to-green-500", startMonth: 7, startDay: 14, endMonth: 7, endDay: 16 },
  // Halloween
  { name: "Halloween", emoji: "🎃", greeting: "Happy Halloween!", accentColor: "from-orange-500 to-purple-600", startMonth: 9, startDay: 28, endMonth: 10, endDay: 1 },
  // Diwali (approx)
  { name: "Diwali", emoji: "🪔", greeting: "Happy Diwali!", accentColor: "from-amber-400 to-orange-500", startMonth: 10, startDay: 1, endMonth: 10, endDay: 5 },
  // Thanksgiving (US, 4th Thu Nov, approx)
  { name: "Thanksgiving", emoji: "🦃", greeting: "Happy Thanksgiving!", accentColor: "from-orange-400 to-amber-600", startMonth: 10, startDay: 25, endMonth: 10, endDay: 28 },
  // Christmas
  { name: "Christmas", emoji: "🎄", greeting: "Merry Christmas!", accentColor: "from-red-500 to-green-500", startMonth: 11, startDay: 23, endMonth: 11, endDay: 26 },
  // New Year's Eve
  { name: "New Year's Eve", emoji: "🥂", greeting: "Happy New Year's Eve!", accentColor: "from-yellow-400 to-purple-500", startMonth: 11, startDay: 30, endMonth: 11, endDay: 31 },
];

export function getActiveFestival(): Festival | null {
  const now = new Date();
  const month = now.getMonth();
  const day = now.getDate();

  for (const f of festivals) {
    if (f.startMonth === f.endMonth) {
      if (month === f.startMonth && day >= f.startDay && day <= f.endDay) return f;
    } else {
      // spans two months
      if ((month === f.startMonth && day >= f.startDay) || (month === f.endMonth && day <= f.endDay)) return f;
    }
  }
  return null;
}
