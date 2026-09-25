import { useEffect, useState } from 'react'
import type { RefObject } from 'react'
import { ceremonyCountdown, parseCeremonyDate, validCeremonyTime } from './draftDate'

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

export function DraftEventFloat({ dateValue, time, venue, hall, quietRegion, accountsRegion }: { dateValue: string; time: string; venue: string; hall: string; quietRegion: RefObject<HTMLElement | null>; accountsRegion: RefObject<HTMLElement | null> }) {
  const [quiet, setQuiet] = useState(false)
  useEffect(() => {
    if (!quietRegion.current) return
    // Keep the calendar and account-copy controls unobscured.
    const visible = new Set<Element>()
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => { if (entry.isIntersecting) visible.add(entry.target); else visible.delete(entry.target) })
      setQuiet(visible.size > 0)
    }, { rootMargin: '-25% 0px -25% 0px' })
    observer.observe(quietRegion.current)
    if (accountsRegion.current) observer.observe(accountsRegion.current)
    return () => observer.disconnect()
  }, [quietRegion, accountsRegion])
  const date = parseCeremonyDate(dateValue)
  if (!date || !validCeremonyTime(time)) return null
  const shortVenue = venue === '더링크서울 트리뷰트 포트폴리오 호텔' ? '더링크서울' : venue
  return <aside className={`draft-event-float${quiet ? ' is-quiet' : ''}`} aria-label="예식 일정 요약" aria-hidden={quiet || undefined}
    style={{ backdropFilter: 'blur(16px) saturate(160%)', WebkitBackdropFilter: 'blur(16px) saturate(160%)' }}>
    <time dateTime={`${dateValue}T${time}:00+09:00`}>
      <strong>{String(date.getUTCMonth() + 1).padStart(2, '0')}.{String(date.getUTCDate()).padStart(2, '0')}</strong>
      <span>{['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'][date.getUTCDay()]} · {time}</span>
    </time>
    <span className="draft-event-venue" title={venue}>{shortVenue}</span>
    <span className="draft-event-hall">{hall}</span>
  </aside>
}
