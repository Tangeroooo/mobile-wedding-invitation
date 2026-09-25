export function parseCeremonyDate(value: string) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return null
  const date = new Date(`${value}T00:00:00Z`)
  return Number.isFinite(date.getTime()) && date.toISOString().slice(0, 10) === value ? date : null
}

export const validCeremonyTime = (value: string) => /^([01]\d|2[0-3]):[0-5]\d$/.test(value)

export function ceremonyLabel(dateValue: string, time: string) {
  const date = parseCeremonyDate(dateValue)
  if (!date || !validCeremonyTime(time)) return ''
  const [hour, minute] = time.split(':').map(Number)
  return `${date.getUTCFullYear()}년 ${date.getUTCMonth() + 1}월 ${date.getUTCDate()}일 ${'일월화수목금토'[date.getUTCDay()]}요일\n${hour < 12 ? '오전' : '오후'} ${hour % 12 || 12}시${minute ? ` ${minute}분` : ''}`
}
