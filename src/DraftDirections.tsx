import { useEffect, useRef, useState } from 'react'
import DraftRouteImage from './DraftRouteImage'

const videoUrl = 'https://youtu.be/I5oNxPbXw3I'

export default function DraftDirections() {
  const [view, setView] = useState<'video' | 'map' | null>(null)
  const dialog = useRef<HTMLDialogElement>(null)
  useEffect(() => {
    const viewer = dialog.current
    if (!viewer || !view) return
    const root = document.documentElement, body = document.body
    const original = { root:root.style.overflow, body:body.style.overflow }
    viewer.showModal()
    root.style.overflow = body.style.overflow = 'hidden'
    return () => {
      viewer.close()
      root.style.overflow = original.root; body.style.overflow = original.body
    }
  }, [view])

  return <><button type="button" aria-haspopup="dialog" onClick={() => setView('video')}>
      <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true"><rect x="1" y="4" width="22" height="16" rx="5" fill="#FF0033" /><path d="m10 8 6 4-6 4Z" fill="#fff" /></svg>
      셔틀버스 영상
    </button>
    <button type="button" aria-haspopup="dialog" onClick={() => setView('map')}>
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" aria-hidden="true"><path d="m3 5 6-2 6 2 6-2v16l-6 2-6-2-6 2ZM9 3v16M15 5v16" /></svg>
      약도
    </button>
    <dialog ref={dialog} className={`draft-shuttle-modal${view === 'map' ? ' is-map' : ''}`} aria-label={view === 'map' ? '약도' : '셔틀버스 이용 안내'} onCancel={() => setView(null)} onClose={() => setView(null)} onClick={event => { if (event.target === event.currentTarget) setView(null) }}>
      {view === 'video' && <header><h2>셔틀버스 이용 안내</h2></header>}
      <button type="button" className="draft-directions-close" aria-label="안내 모달 닫기" autoFocus onClick={() => setView(null)} style={{ backdropFilter:'blur(2px)', WebkitBackdropFilter:'blur(2px)' }}><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true"><path d="m6 6 12 12M18 6 6 18" /></svg></button>
      {view === 'video' && <><iframe title="신도림역 셔틀버스 이용 안내 영상" src="https://www.youtube-nocookie.com/embed/I5oNxPbXw3I?autoplay=1&playsinline=1&rel=0" allow="autoplay; encrypted-media; picture-in-picture; fullscreen" allowFullScreen referrerPolicy="strict-origin-when-cross-origin" />
        <footer><span>재생이 안 되면</span><a href={videoUrl} target="_blank" rel="noopener noreferrer">YouTube에서 보기 ↗</a></footer></>}
      {view === 'map' && <DraftRouteImage />}
    </dialog>
  </>
}
