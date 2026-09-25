import { useEffect, useRef, useState } from 'react'

export default function DraftBgm({ src }: { src?: string }) {
  const audio = useRef<HTMLAudioElement>(null)
  const [enabled, setEnabled] = useState(false)
  const [pending, setPending] = useState(false)
  const [message, setMessage] = useState('')

  useEffect(() => {
    const player = audio.current
    const pauseWhenHidden = () => { if (document.hidden) player?.pause() }
    document.addEventListener('visibilitychange', pauseWhenHidden)
    return () => { player?.pause(); document.removeEventListener('visibilitychange', pauseWhenHidden) }
  }, [src])

  const toggle = async () => {
    // Until a track is supplied, preview the sound preference without pretending
    // to play an audio file or showing a placeholder message.
    if (!src || !audio.current) { setEnabled(value => !value); return }
    const player = audio.current
    setMessage('')
    if (!player.paused) { player.pause(); return }
    setPending(true)
    try { await player.play() }
    catch { setMessage('음악을 재생하지 못했어요. 잠시 후 다시 눌러주세요.') }
    finally { setPending(false) }
  }

  return <div className="draft-bgm">
    {src && <audio ref={audio} src={src} loop preload="none" onPlaying={() => setEnabled(true)} onPause={() => setEnabled(false)} onError={() => { setEnabled(false); setPending(false); setMessage('음악을 불러오지 못했어요. 잠시 후 다시 눌러주세요.') }} />}
    {/* Keep both filter properties out of CSS minification, which merges aliases. */}
    <button type="button" className="draft-bgm-toggle" style={{ backdropFilter: 'blur(10px) saturate(140%)', WebkitBackdropFilter: 'blur(10px) saturate(140%)' }} role="switch" aria-label="배경음악" aria-checked={enabled} aria-disabled={pending} onClick={() => { if (!pending) void toggle() }}>
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M9 18V5l11-2v13M9 9l11-2" /><ellipse cx="6" cy="18" rx="3" ry="2.5" /><ellipse cx="17" cy="16" rx="3" ry="2.5" /></svg>
      <span className="draft-bgm-track" aria-hidden="true"><span /></span>
    </button>
    <span className="draft-bgm-status" role="status">{message}</span>
  </div>
}
