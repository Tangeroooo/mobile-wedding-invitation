import { useEffect, useRef, useState } from 'react'

const videoUrl = 'https://youtu.be/I5oNxPbXw3I'

export default function DraftDirections({ stop }: { stop: string }) {
  const [view, setView] = useState<'video' | 'map' | null>(null)
  const [zoomed, setZoomed] = useState(false)
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

  return <div className="draft-shuttle">
    {stop && <p className="draft-shuttle-stop">{stop}</p>}
    <div className="draft-directions-buttons"><button type="button" className="draft-shuttle-button" aria-haspopup="dialog" onClick={() => setView('video')}>
      <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true"><rect x="2" y="5" width="20" height="14" rx="4" /><path d="m10 9 5 3-5 3Z" fill="currentColor" stroke="none" /></svg>
      셔틀버스 영상
    </button>
    <button type="button" className="draft-shuttle-button" aria-haspopup="dialog" onClick={() => { setZoomed(false); setView('map') }}>
      <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" aria-hidden="true"><path d="m3 5 6-2 6 2 6-2v16l-6 2-6-2-6 2ZM9 3v16M15 5v16" /></svg>
      약도
    </button></div>
    <dialog ref={dialog} className={`draft-shuttle-modal${view === 'map' ? ' is-map' : ''}`} aria-labelledby="draft-shuttle-title" onCancel={() => setView(null)} onClose={() => setView(null)} onClick={event => { if (event.target === event.currentTarget) setView(null) }}>
      <header><h2 id="draft-shuttle-title">{view === 'map' ? '약도' : '셔틀버스 이용 안내'}</h2><div className="draft-directions-tools">
        {view === 'map' && <button type="button" className="draft-map-zoom" aria-label={zoomed ? '약도 축소' : '약도 확대'} aria-pressed={zoomed} onClick={() => setZoomed(value => !value)}>{zoomed ? '−' : '+'}</button>}
        <button type="button" aria-label="안내 모달 닫기" autoFocus onClick={() => setView(null)}><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true"><path d="m6 6 12 12M18 6 6 18" /></svg></button></div></header>
      {view === 'video' && <><iframe title="신도림역 셔틀버스 이용 안내 영상" src="https://www.youtube-nocookie.com/embed/I5oNxPbXw3I?autoplay=1&playsinline=1&rel=0" allow="autoplay; encrypted-media; picture-in-picture; fullscreen" allowFullScreen referrerPolicy="strict-origin-when-cross-origin" />
        <footer><span>재생이 안 되면</span><a href={videoUrl} target="_blank" rel="noopener noreferrer">YouTube에서 보기 ↗</a></footer></>}
      {view === 'map' && <><div className={`draft-route-image${zoomed ? ' is-zoomed' : ''}`} tabIndex={0} role="region" aria-label="스크롤하여 보는 약도">
        <img src={`${import.meta.env.BASE_URL}images/draft/venue-directions.webp`} width="1327" height="2200" alt="더링크호텔서울 오시는 길. 신도림역 1번 출구 셔틀버스 탑승 위치, 주변 약도, 자가용·지하철·버스 이용 안내" />
      </div><footer><span>+ 버튼으로 확대하고 밀어서 확인하세요.</span></footer></>}
    </dialog>
  </div>
}
