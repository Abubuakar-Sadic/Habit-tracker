export function calculateCurrentStreak(completions: string[], today?: string): number {
  const todayDate = today ?? new Date().toISOString().split('T')[0];

  // Deduplicate
  const unique = Array.from(new Set(completions));

  // If today is not completed, streak is 0
  if (!unique.includes(todayDate)) return 0;

  // Sort descending
  const sorted = unique.slice().sort((a, b) => (a < b ? 1 : -1));

  let streak = 0;
  let cursor = todayDate;

  for (const date of sorted) {
    if (date === cursor) {
      streak++;
      // Move cursor back one calendar day
      const d = new Date(cursor + 'T00:00:00Z');
      d.setUTCDate(d.getUTCDate() - 1);
      cursor = d.toISOString().split('T')[0];
    } else if (date < cursor) {
      // Gap detected
      break;
    }
  }

  return streak;
}
