import { useCallback, useEffect, useRef, useState } from 'react'

export default function DraftBgm({ src, autoStart = false }: { src: string; autoStart?: boolean }) {
  const audio = useRef<HTMLAudioElement>(null)
  const attempt = useRef(0)
  const userPaused = useRef(false)
  const [enabled, setEnabled] = useState(false)
  const [pending, setPending] = useState(false)
  const [message, setMessage] = useState('')

  const stop = useCallback(() => {
    attempt.current += 1
    audio.current?.pause()
    setEnabled(false)
    setPending(false)
  }, [])

  const start = useCallback(async () => {
    const player = audio.current
    if (!player || document.hidden) return
    const id = ++attempt.current
    setMessage('')
    setPending(true)
    try { await player.play() }
    catch (error) {
      if (id !== attempt.current) return
      setEnabled(false)
      setMessage(error instanceof DOMException && error.name === 'NotAllowedError'
        ? '음표 버튼을 누르면 배경음악이 재생됩니다.'
        : '음악을 재생하지 못했어요. 잠시 후 다시 눌러주세요.')
    }
    finally { if (id === attempt.current) setPending(false) }
  }, [])

  useEffect(() => {
    const player = audio.current
    if (autoStart && !userPaused.current) void start()
    const pauseWhenHidden = () => { if (document.hidden) stop() }
    document.addEventListener('visibilitychange', pauseWhenHidden)
    return () => {
      attempt.current += 1
      player?.pause()
      document.removeEventListener('visibilitychange', pauseWhenHidden)
    }
  }, [src, autoStart, start, stop])

  const toggle = () => {
    if (!audio.current) return
    if (pending || !audio.current.paused) {
      userPaused.current = true
      setMessage('')
      stop()
    } else {
      userPaused.current = false
      void start()
    }
  }

  return <div className="draft-bgm">
    <audio ref={audio} src={src} loop preload="none" onPlaying={() => { setEnabled(true); setPending(false); setMessage('') }} onPause={() => setEnabled(false)} onError={() => { stop(); setMessage('음악을 불러오지 못했어요. 잠시 후 다시 눌러주세요.') }} />
    {/* Keep both filter properties out of CSS minification, which merges aliases. */}
    <button type="button" className="draft-bgm-toggle" role="switch" aria-label="배경음악" aria-checked={enabled} aria-busy={pending} onClick={toggle}>
      <span className="draft-bgm-glass" style={{ backdropFilter: 'blur(10px) saturate(140%)', WebkitBackdropFilter: 'blur(10px) saturate(140%)' }} aria-hidden="true">
      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M9 18V5l11-2v13M9 9l11-2" /><ellipse cx="6" cy="18" rx="3" ry="2.5" /><ellipse cx="17" cy="16" rx="3" ry="2.5" /></svg>
      <span className="draft-bgm-track" aria-hidden="true"><span /></span>
      </span>
    </button>
    <span className="draft-bgm-status" role="status">{message}</span>
  </div>
}
