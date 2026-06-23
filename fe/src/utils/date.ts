export function getLocalDateString(date = new Date()): string {
  const offset = date.getTimezoneOffset()
  const localDate = new Date(date.getTime() - offset * 60 * 1000)
  return localDate.toISOString().split('T')[0]
}

export function subtractDays(days: number): string {
  const d = new Date()
  d.setDate(d.getDate() - days)
  return getLocalDateString(d)
}
