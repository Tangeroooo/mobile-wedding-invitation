import type { DraftCopy } from './draftCopy.ts'
import { parseCeremonyDate, validCeremonyTime } from './draftDate.ts'

const escapeText = (value: string) => value.replace(/\\/g, '\\\\').replace(/\r\n|\r|\n/g, '\\n').replace(/;/g, '\\;').replace(/,/g, '\\,')
const stamp = (date: Date) => date.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '')

function foldLine(line: string) {
  const encoder = new TextEncoder()
  let result = '', bytes = 0
  for (const character of line) {
    const size = encoder.encode(character).length
    if (bytes + size > 75) { result += '\r\n '; bytes = 1 }
    result += character
    bytes += size
  }
  return result
}

export function weddingCalendarEvent(copy: DraftCopy) {
  if (!parseCeremonyDate(copy.ceremonyDate) || !validCeremonyTime(copy.ceremonyTime) || !validCeremonyTime(copy.ceremonyEndTime)) return null
  const start = new Date(`${copy.ceremonyDate}T${copy.ceremonyTime}:00+09:00`)
  const end = new Date(`${copy.ceremonyDate}T${copy.ceremonyEndTime}:00+09:00`)
  if (end <= start) return null
  return {
    start, end, title: `${copy.groom} ♥ ${copy.bride} 결혼식`,
    location: [copy.venueName, copy.venueHall, copy.venueAddress].filter(Boolean).join(' · '),
    description: '소중한 여러분을 우리의 결혼식에 초대합니다.',
  }
}

export function createWeddingCalendar(copy: DraftCopy, now = new Date()) {
  const event = weddingCalendarEvent(copy)
  if (!event) return null
  return [
    'BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//Our Wedding//Invitation//KO', 'CALSCALE:GREGORIAN',
    'BEGIN:VEVENT', 'UID:our-wedding@tangeroooo.github.io', `DTSTAMP:${stamp(now)}`,
    `DTSTART:${stamp(event.start)}`, `DTEND:${stamp(event.end)}`,
    `SUMMARY:${escapeText(event.title)}`,
    `LOCATION:${escapeText(event.location)}`,
    `DESCRIPTION:${escapeText(event.description)}`,
    'END:VEVENT', 'END:VCALENDAR', '',
  ].map(foldLine).join('\r\n')
}
