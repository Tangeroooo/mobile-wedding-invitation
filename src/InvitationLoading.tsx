import type { CSSProperties } from 'react'
import { loadingPlatform } from './loadingPlatform'
import './InvitationLoading.css'

export default function InvitationLoading() {
  const platform = loadingPlatform(navigator.userAgent, navigator.platform, navigator.maxTouchPoints)
  return <div className={`invitation-loading is-${platform}`} role="status" aria-live="polite">
    <span className="invitation-loading-label">청첩장을 불러오는 중입니다.</span>
    {platform === 'apple'
      ? <span className="invitation-loading-apple" aria-hidden="true">{Array.from({ length:12 }, (_, index) => <i key={index} style={{ '--spoke':index } as CSSProperties} />)}</span>
      : <svg className="invitation-loading-material" viewBox="0 0 40 40" aria-hidden="true" focusable="false"><circle cx="20" cy="20" r="16" /></svg>}
  </div>
}
