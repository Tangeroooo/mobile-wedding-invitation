import { useEffect, useRef, useState } from 'react'

export default function DraftBgm({ src }: { src?: string }) {
  const audio = useRef<HTMLAudioElement>(null)
  const [playing, setPlaying] = useState(false)
  const [pending, setPending] = useState(false)
  const [message, setMessage] = useState('')

  useEffect(() => {
    const player = audio.current
    const pauseWhenHidden = () => { if (document.hidden) player?.pause() }
    document.addEventListener('visibilitychange', pauseWhenHidden)
    return () => { player?.pause(); document.removeEventListener('visibilitychange', pauseWhenHidden) }
  }, [src])

  const toggle = async () => {
    if (!src || !audio.current) { setMessage('음악을 준비 중입니다. 곡이 등록되면 재생할 수 있어요.'); return }
    const player = audio.current
    setMessage('')
    if (!player.paused) { player.pause(); return }
    setPending(true)
    try { await player.play() }
    catch { setMessage('음악을 재생하지 못했어요. 잠시 후 다시 눌러주세요.') }
    finally { setPending(false) }
  }

  return <div className="draft-bgm">
    {src && <audio ref={audio} src={src} loop preload="none" onPlaying={() => setPlaying(true)} onPause={() => setPlaying(false)} onError={() => { setPlaying(false); setPending(false); setMessage('음악을 불러오지 못했어요. 잠시 후 다시 눌러주세요.') }} />}
    <button type="button" className="draft-bgm-toggle" aria-label={src ? (playing ? '배경음악 끄기' : '배경음악 켜기') : '배경음악 준비 중'} aria-pressed={playing} aria-disabled={!src || pending} onClick={() => { if (!pending) void toggle() }}>
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M9 18V5l11-2v13M9 9l11-2" /><ellipse cx="6" cy="18" rx="3" ry="2.5" /><ellipse cx="17" cy="16" rx="3" ry="2.5" />{!playing && <path d="m3 3 18 18" />}</svg>
      <span>BGM {playing ? 'ON' : 'OFF'}{!src && <small>준비 중</small>}{pending && <small>불러오는 중</small>}</span>
    </button>
    {message && <div className="draft-bgm-message"><p role="status">{message}</p><button type="button" aria-label="음악 안내 닫기" onClick={() => setMessage('')}>×</button></div>}
  </div>
}
