import { useEffect, useRef, useState } from 'react'

export default function DraftCalendarGuide({ browserName, onClose }: { browserName: string; onClose: () => void }) {
  const dialog = useRef<HTMLDialogElement>(null)
  const [status, setStatus] = useState('')
  const url = window.location.href
  useEffect(() => {
    const viewer = dialog.current!
    const trigger = document.activeElement instanceof HTMLElement ? document.activeElement : null
    const root = document.documentElement, body = document.body
    const previous = { root:root.style.overflow, body:body.style.overflow }
    viewer.showModal()
    root.style.overflow = body.style.overflow = 'hidden'
    return () => {
      viewer.close()
      root.style.overflow = previous.root
      body.style.overflow = previous.body
      trigger?.focus({ preventScroll:true })
    }
  }, [])
  const copyUrl = async () => {
    try {
      await navigator.clipboard.writeText(url)
      setStatus(`주소를 복사했어요. ${browserName} 주소창에 붙여 넣어주세요.`)
    } catch {
      setStatus('아래 주소를 길게 눌러 복사해주세요.')
    }
  }
  return <dialog ref={dialog} className="draft-calendar-guide" aria-labelledby="calendar-guide-title" aria-describedby="calendar-guide-description" onCancel={onClose} onClick={event => { if (event.target === event.currentTarget) onClose() }}>
    <button type="button" className="draft-calendar-guide-close" aria-label="캘린더 안내 닫기" autoFocus onClick={onClose}>×</button>
    <h2 id="calendar-guide-title">{browserName}에서<br />일정을 추가해주세요</h2>
    <p id="calendar-guide-description">카카오톡에서는 ‘구독 캘린더 추가’가 표시될 수 있어요.</p>
    <ol>
      <li>카카오톡의 메뉴·공유 버튼에서 <strong>‘다른 브라우저로 열기’</strong>를 찾아주세요.</li>
      <li>{browserName === 'Chrome' ? 'Chrome 등 외부 브라우저' : browserName}에서 <strong>‘캘린더에 추가’</strong>를 다시 눌러주세요.</li>
    </ol>
    <p className="draft-calendar-guide-help">메뉴가 없다면 주소를 복사해 직접 열어주세요. 구독 화면은 취소해주세요.</p>
    <button type="button" className="draft-calendar-guide-copy" onClick={() => void copyUrl()}>청첩장 주소 복사</button>
    <label className="draft-calendar-guide-url">청첩장 주소<input aria-label="복사할 청첩장 주소" readOnly value={url} onFocus={event => event.currentTarget.select()} /></label>
    <p className="draft-calendar-guide-status" role="status">{status}</p>
  </dialog>
}
