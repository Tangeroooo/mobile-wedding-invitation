import { useEffect, useMemo, useRef, useState } from 'react'
import type { RefObject } from 'react'
import { ceremonyCountdown, parseCeremonyDate, validCeremonyTime } from './draftDate'
import type { DraftCopy } from './draftCopy'
import { copyDefaults } from './draftCopy'
import { createWeddingCalendar } from './draftCalendarFile'

export function DraftCalendarAdd({ copy }: { copy: DraftCopy }) {
  const calendar = useMemo(() => createWeddingCalendar(copy), [copy])
  const isDefault = (['groom', 'bride', 'ceremonyDate', 'ceremonyTime', 'ceremonyEndTime', 'venueName', 'venueHall', 'venueAddress'] as const).every(key => copy[key] === copyDefaults[key])
  const [editedUrl, setEditedUrl] = useState<string | null>(null)
  useEffect(() => {
    if (isDefault || !calendar) return
    const url = URL.createObjectURL(new File([calendar], 'wedding.ics', { type:'text/calendar;charset=utf-8' }))
    setEditedUrl(url)
    return () => URL.revokeObjectURL(url)
  }, [calendar, isDefault])
  if (!calendar) return <p className="draft-calendar-error" role="status">캘린더 종료 시간을 시작 시간 이후로 설정해주세요.</p>
  const revision = `${copy.ceremonyDate}-${copy.ceremonyTime}-${copy.ceremonyEndTime}`.replace(/[^\d-]/g, '')
  const href = isDefault ? `${import.meta.env.BASE_URL}calendar/wedding.ics?v=${revision}` : editedUrl
  if (!href) return null
  return <a className="draft-calendar-add" href={href} type="text/calendar" aria-label="결혼식 일정 캘린더에 추가">
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><rect x="3" y="5" width="18" height="16" rx="3" /><path d="M7 3v4m10-4v4M3 10h18m-9 3v5m-2.5-2.5h5" /></svg>
    캘린더에 추가
  </a>
}

export function DraftCountdown({ dateValue }: { dateValue: string }) {
  const [now, setNow] = useState(() => new Date())
  useEffect(() => {
    const refresh = () => setNow(new Date())
    const timer = window.setInterval(refresh, 60_000)
    document.addEventListener('visibilitychange', refresh)
    return () => { window.clearInterval(timer); document.removeEventListener('visibilitychange', refresh) }
  }, [])
  const countdown = ceremonyCountdown(dateValue, now)
  if (!countdown) return null
  return <div className="draft-countdown" aria-label={countdown.days > 0 ? `결혼식까지 ${countdown.days}일` : countdown.days === 0 ? '오늘은 결혼식 날입니다' : `결혼식으로부터 ${-countdown.days}일`}>
    <span aria-hidden="true">OUR DAY</span><strong aria-hidden="true">{countdown.label}</strong>
  </div>
}

export function DraftEventFloat({ dateValue, time, venue, hall, quietRegion, enabled = true }: { dateValue: string; time: string; venue: string; hall: string; quietRegion: RefObject<HTMLElement | null>; enabled?: boolean }) {
  const [quiet, setQuiet] = useState(false)
  const float = useRef<HTMLElement>(null)
  useEffect(() => {
    const card = quietRegion.current, summary = float.current
    if (!card || !summary) return
    let frame = 0
    // Use the two actual screen rectangles, not a broad viewport trigger band.
    // Visibility keeps the summary measurable even while it is hidden.
    const measure = () => {
      frame = 0
      const a = card.getBoundingClientRect(), b = summary.getBoundingClientRect()
      setQuiet(a.top < b.bottom && a.bottom > b.top && a.left < b.right && a.right > b.left)
    }
    const schedule = () => { if (!frame) frame = requestAnimationFrame(measure) }
    const observer = new ResizeObserver(schedule)
    observer.observe(card)
    observer.observe(summary)
    const invitation = card.closest('.draft-invitation')
    if (invitation) observer.observe(invitation)
    window.addEventListener('scroll', schedule, { passive: true })
    window.addEventListener('resize', schedule)
    card.addEventListener('animationend', schedule)
    window.visualViewport?.addEventListener('resize', schedule)
    schedule()
    return () => {
      cancelAnimationFrame(frame)
      observer.disconnect()
      window.removeEventListener('scroll', schedule)
      window.removeEventListener('resize', schedule)
      card.removeEventListener('animationend', schedule)
      window.visualViewport?.removeEventListener('resize', schedule)
    }
  }, [quietRegion])
  const date = parseCeremonyDate(dateValue)
  if (!date || !validCeremonyTime(time)) return null
  const shortVenue = venue === '더링크서울 트리뷰트 포트폴리오 호텔' ? '더링크서울' : venue
  return <aside ref={float} className={`draft-event-float${quiet || !enabled ? ' is-quiet' : ''}`} aria-label="예식 일정 요약" aria-hidden={quiet || !enabled || undefined}
    style={{ backdropFilter: 'blur(16px) saturate(160%)', WebkitBackdropFilter: 'blur(16px) saturate(160%)' }}>
    <time dateTime={`${dateValue}T${time}:00+09:00`}>
      <strong>{String(date.getUTCMonth() + 1).padStart(2, '0')}.{String(date.getUTCDate()).padStart(2, '0')}</strong>
      <span>{['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'][date.getUTCDay()]} · {time}</span>
    </time>
    <span className="draft-event-venue" title={venue}>{shortVenue}</span>
    <span className="draft-event-hall">{hall}</span>
  </aside>
}
