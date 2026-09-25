import { useEffect, useRef, useState } from 'react'
import type { InvitationVariant } from './invitationVariants'
import { invitationShare } from './invitationShare'
import { kakaoKey, loadKakaoShare } from './kakaoShare'

export default function DraftShare({ variant }: { variant?: InvitationVariant }) {
  const share = invitationShare(variant)
  const section = useRef<HTMLElement>(null)
  const [ready, setReady] = useState(false)
  const [status, setStatus] = useState('')
  const [manual, setManual] = useState(false)
  const [busy, setBusy] = useState(false)
  useEffect(() => {
    if (!status) return
    const timer = window.setTimeout(() => setStatus(''), 4500)
    return () => window.clearTimeout(timer)
  }, [status])
  useEffect(() => {
    if (!kakaoKey || !section.current) return
    let active = true
    const observer = new IntersectionObserver(entries => {
      if (!entries.some(entry => entry.isIntersecting)) return
      observer.disconnect()
      void loadKakaoShare().then(() => { if (active) setReady(true) }).catch(() => {})
    }, { rootMargin: '600px' })
    observer.observe(section.current)
    return () => { active = false; observer.disconnect() }
  }, [])

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(share.url)
      setManual(false)
      setStatus('청첩장 링크를 복사했어요.')
    } catch {
      setManual(true)
      setStatus('아래 주소를 선택해 복사해주세요.')
    }
  }
  const shareLink = async () => {
    if (busy) return
    setBusy(true)
    setStatus('')
    try {
      if (kakaoKey) {
        // Open synchronously on a user tap once preloaded, avoiding popup blocking.
        if (ready && window.Kakao) window.Kakao.Share.sendDefault(share.kakao)
        else {
          await loadKakaoShare()
          setReady(true)
          setStatus('카카오톡 공유를 한 번 더 눌러주세요.')
        }
      } else if (navigator.share) {
        setStatus('공유 목록에서 카카오톡 등 원하는 앱을 선택해주세요.')
        await navigator.share(share.native)
        setStatus('')
      } else {
        setManual(true)
        setStatus('링크를 복사해 카카오톡에 붙여 넣어주세요.')
      }
    } catch (error) {
      if (error instanceof Error && error.name === 'AbortError') setStatus('')
      else {
        setManual(true)
        setStatus('공유창을 열지 못했어요. 링크를 복사해 전달해주세요.')
      }
    } finally { setBusy(false) }
  }
  return <section ref={section} className="draft-share" aria-label="청첩장 공유">
    <div className="draft-share-actions">
      <button type="button" onClick={() => void copyLink()}><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><rect x="8" y="8" width="12" height="13" rx="2" /><path d="M16 8V5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h3" /></svg><span>청첩장 링크 복사</span></button>
      <button type="button" onClick={() => void shareLink()} disabled={busy}>
        {kakaoKey ? <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 3C6.5 3 2 6.4 2 10.6c0 2.7 1.8 5.1 4.5 6.4l-1 3.7c-.1.4.3.6.6.4l4.4-3h1.5c5.5 0 10-3.4 10-7.5S17.5 3 12 3Z" /></svg> : <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M12 15V2m-4 4 4-4 4 4M6 10H4v12h16V10h-2" /></svg>}
        <span>{kakaoKey ? '카카오톡으로 공유' : '청첩장 공유하기'}</span>
      </button>
    </div>
    <p className="draft-share-status" role="status">{status}</p>
    {manual && <input className="draft-share-url" aria-label="복사할 청첩장 링크" readOnly value={share.url} onFocus={event => event.currentTarget.select()} onClick={event => event.currentTarget.select()} />}
  </section>
}
