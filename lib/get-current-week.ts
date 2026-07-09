/**
 * Returns the current service-year week number (1–52).
 * Set SERVICE_START_DATE to the first Monday of your current NYSC batch.
 */
export function getCurrentWeekNumber(): number {
  const SERVICE_START_DATE = new Date('2025-01-01') // ← change to your batch start date
  const today = new Date()
  const msPerWeek = 7 * 24 * 60 * 60 * 1000
  const weekNumber = Math.floor(
    (today.getTime() - SERVICE_START_DATE.getTime()) / msPerWeek
  ) + 1
  // Clamp between 1 and 52
  return Math.min(Math.max(weekNumber, 1), 52)
}