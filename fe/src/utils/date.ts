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

export function toUTCDateString(localDateStr: string): string {
  if (!localDateStr) return ''
  if (localDateStr.includes('T')) {
    return localDateStr
  }
  const [year, month, day] = localDateStr.split('-').map(Number)
  const localDate = new Date(year, month - 1, day)
  return localDate.toISOString()
}

export function toLocalDateString(utcDateStr: string): string {
  if (!utcDateStr) return ''
  if (!utcDateStr.includes('T')) {
    return utcDateStr
  }
  const date = new Date(utcDateStr)
  return getLocalDateString(date)
}

export function parseLocalDate(localDateStr: string): Date {
  const [year, month, day] = localDateStr.split('-').map(Number)
  return new Date(year, month - 1, day)
}
