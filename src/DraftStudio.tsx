import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import type { CSSProperties, PointerEvent as ReactPointerEvent, SyntheticEvent } from 'react'
import DraftLettering from './DraftLettering'
import DraftMap from './DraftMap'
import DraftCopyEditor from './DraftCopyEditor'
import DraftCalendar from './DraftCalendar'
import { ceremonyLabel } from './draftDate'
import DraftAccounts from './DraftAccounts'
import DraftBgm from './DraftBgm'
import { DraftCalendarAdd, DraftCountdown, DraftEventFloat } from './DraftEventDetails'
import { draftMusicSrc } from './draftMusic'
import type { CopyKey } from './draftCopy'
import type { Outlines } from './DraftLettering'
import { clamp, defaults, isSupportedText, normalizeText, parseConfig, storageKey } from './draftModel'
import type { DraftConfig, Scene } from './draftModel'
import './DraftStudio.css'

const asset = (name: string) => `${import.meta.env.BASE_URL}images/draft/${name}`
const photo = (scene: Scene, width = 800) => asset(`${scene}-${width}.webp`)
const sceneLabel = { intro: '인트로', main: '메인 커버' }
const galleryPhotos = Array.from({ length:25 }, (_, index) => index + 1)
// Mix settings, outfits and framing; board slot and full-gallery photo ID are independent.
const galleryBoard = [1, 17, 6, 7, 18, 9, 20, 21, 23, 24]
const galleryPhoto = (number: number, width: 320 | 1200 = 320) => asset(`gallery/${String(number).padStart(2, '0')}-${width}.webp`)
const isPreviewUrl = () => new URLSearchParams(window.location.search).get('mode') === 'preview'
const isPublishedPreview = () => isPreviewUrl() && new URLSearchParams(window.location.search).get('source') === 'published'
// Preserve the original glyph and its metrics; VS15 requests text, not emoji.
const DraftAsterisk = () => <>{'\u2733\uFE0E'}</>
// Outline of the original text asterisk, including its subtly tapered arms.
// No font or Unicode glyph is used by the ticker, so mobile cannot substitute emoji.
const DraftTickerAsterisk = () => <svg className="draft-ticker-star" viewBox="0 15.308 74.902 100" aria-hidden="true" focusable="false"><path fill="currentColor" d="M72.217 67.480L40.723 66.602L63.623 88.184L60.400 91.406L38.818 68.506L39.697 100.000L35.205 100.000L36.084 68.506L14.502 91.406L11.279 88.184L34.180 66.602L2.686 67.480L2.686 62.988L34.180 64.014L11.279 42.383L14.502 39.209L36.084 62.109L35.205 30.615L39.697 30.615L38.818 62.109L60.400 39.209L63.623 42.383L40.723 64.014L72.217 63.135Z" /></svg>
// Discourage ordinary image saving without disabling selection in the editor.
const protectPhoto = (event: SyntheticEvent) => {
  if (event.target instanceof Element && event.target.closest('input, textarea, [contenteditable="true"]')) return
  event.preventDefault()
}

function readSaved() {
  if (isPublishedPreview()) return defaults
  try {
    const saved = localStorage.getItem(storageKey)
    if (!saved) return defaults
    const raw = JSON.parse(saved)
    const parsed = parseConfig(raw)
    // Upgrade only the old default ivory; keep custom colors and all edits.
    if (raw.intro.rotation === undefined && parsed.intro.color.toUpperCase() === '#FFF5DE') parsed.intro.color = defaults.intro.color
    return parsed
  } catch { return defaults }
}

export default function DraftStudio() {
  const [config, setConfig] = useState<DraftConfig>(readSaved)
  const [scene, setScene] = useState<Scene>('intro')
  const [preview, setPreview] = useState(isPreviewUrl)
  // Diagnostic link only: isolate Safari's treatment of top fixed/sticky controls.
  const [cleanEdges] = useState(() => new URLSearchParams(window.location.search).get('edge') === 'clean')
  const [phase, setPhase] = useState<'intro' | 'leaving' | 'main'>('intro')
  const [mainReady, setMainReady] = useState(false)
  const [mainLetteringReady, setMainLetteringReady] = useState(false)
  const finishMainLettering = useCallback(() => setMainLetteringReady(true), [])
  const [outlines, setOutlines] = useState<Outlines | null>(null)
  const [fontError, setFontError] = useState(false)
  const [notice, setNotice] = useState('')
  const [saveState, setSaveState] = useState('이 브라우저에 자동 저장')
  const [history, setHistory] = useState<DraftConfig[]>([])
  const [inline, setInline] = useState(false)
  const [typing, setTyping] = useState(false)
  const [toolsOpen, setToolsOpen] = useState(false)
  const [lightbox, setLightbox] = useState<number | null>(null)
  const [replay, setReplay] = useState(0)
  const stage = useRef<HTMLElement>(null)
  const dateCard = useRef<HTMLDivElement>(null)
  const selection = useRef<HTMLDivElement>(null)
  const inlineInput = useRef<HTMLTextAreaElement>(null)
  const dialog = useRef<HTMLDialogElement>(null)
  const photoRail = useRef<HTMLDivElement>(null)
  const importInput = useRef<HTMLInputElement>(null)
  const drag = useRef<{ id: number; x: number; y: number; block: DraftConfig['intro']; w: number; h: number; bw: number; bh: number; mode: 'move' | 'resize' | 'rotate'; cx: number; cy: number; angle: number } | null>(null)
  const liveConfig = useRef(config)
  const constrainNextLayout = useRef(false)
  liveConfig.current = config
  const block = config[scene]
  const copy = config.copy
  const [ceremonyDay, ceremonyHour] = ceremonyLabel(copy.ceremonyDate, copy.ceremonyTime).split('\n')
  const mapQuery = encodeURIComponent(`${copy.venueName} ${copy.venueAddress}`)
  useEffect(() => { document.title = preview ? 'Our invitation — 미리보기' : 'Our invitation — 초안 스튜디오' }, [preview])

  useLayoutEffect(() => {
    if (!preview) return
    // The photo now lives directly under body, outside clipped/transformed ancestors.
    // Native toolbar/status-bar compositing is still controlled by the browser.
    const root = document.documentElement
    const hadClass = root.classList.contains('draft-preview-page')
    const themes = Array.from(document.querySelectorAll<HTMLMetaElement>('meta[name="theme-color"]'))
    const previousMedia = themes.map(meta => meta.getAttribute('media'))
    root.classList.add('draft-preview-page')
    themes.forEach(meta => meta.setAttribute('media', 'not all'))
    return () => {
      if (!hadClass) root.classList.remove('draft-preview-page')
      themes.forEach((meta, index) => {
        if (previousMedia[index] === null) meta.removeAttribute('media')
        else meta.setAttribute('media', previousMedia[index]!)
      })
    }
  }, [preview])

  useLayoutEffect(() => {
    // A reload must restore saved percentages, not overwrite them from a loading
    // placeholder or a different viewport. Constrain only deliberate edits.
    if (preview || inline || typing || !outlines || !constrainNextLayout.current || !stage.current || !selection.current) return
    const keepInFrame = () => {
      const frame = stage.current?.getBoundingClientRect()
      const text = selection.current?.getBoundingClientRect()
      if (!frame || !text) return
      const halfW = Math.min(49, text.width / frame.width * 50)
      const halfH = Math.min(49, text.height / frame.height * 50)
      setConfig(current => {
        const value = current[scene]
        const fit = Math.min(1, frame.width / text.width, frame.height / text.height)
        if (fit < .998 && value.width > 25) return { ...current, [scene]: { ...value, width: Math.max(25, value.width * fit * .98) } }
        const x = clamp(value.x, halfW, 100 - halfW), y = clamp(value.y, halfH, 100 - halfH)
        constrainNextLayout.current = false
        return Math.abs(x - value.x) < .01 && Math.abs(y - value.y) < .01 ? current : { ...current, [scene]: { ...value, x, y } }
      })
    }
    keepInFrame()
  }, [scene, preview, inline, typing, block.text, block.width, block.x, block.y, block.rotation, outlines])

  useEffect(() => {
    const abort = new AbortController()
    fetch(asset('black-rush-outlines.json'), { signal: abort.signal })
      .then(response => { if (!response.ok) throw new Error(); return response.json() })
      .then(setOutlines)
      .catch(error => { if (error.name !== 'AbortError') setFontError(true) })
    return () => abort.abort()
  }, [])

  const persist = useCallback((value: DraftConfig) => {
    try {
      localStorage.setItem(storageKey, JSON.stringify(parseConfig(value)))
      setSaveState(`이 브라우저에 저장됨 · ${new Date().toLocaleTimeString('ko-KR', { hour12: false })}`)
      return true
    } catch {
      setSaveState('저장하지 못했어요 · 설정 파일로 보관해주세요')
      return false
    }
  }, [])
  useLayoutEffect(() => { if (!preview) persist(config) }, [config, persist, preview])
  useEffect(() => {
    if (preview) return
    const flush = () => persist(liveConfig.current)
    window.addEventListener('pagehide', flush)
    return () => window.removeEventListener('pagehide', flush)
  }, [persist, preview])
  useEffect(() => {
    const syncMode = () => { setConfig(readSaved()); setPreview(isPreviewUrl()); setPhase('intro'); setMainReady(false); setMainLetteringReady(false); setInline(false) }
    window.addEventListener('popstate', syncMode)
    return () => window.removeEventListener('popstate', syncMode)
  }, [])
  useEffect(() => {
    if (!preview || isPublishedPreview()) return
    const syncCopy = (event: StorageEvent) => {
      if (event.key === storageKey && event.newValue) {
        try { setConfig(parseConfig(JSON.parse(event.newValue))) } catch { /* Keep the last valid preview. */ }
      }
    }
    window.addEventListener('storage', syncCopy)
    return () => window.removeEventListener('storage', syncCopy)
  }, [preview])

  useEffect(() => {
    if (!preview || !outlines || !mainReady || phase !== 'intro') return
    const timer = window.setTimeout(() => setPhase('leaving'), 4200)
    return () => window.clearTimeout(timer)
  }, [preview, outlines, mainReady, phase, replay])
  useEffect(() => {
    if (phase !== 'leaving') return
    const timer = window.setTimeout(() => setPhase('main'), 900)
    return () => window.clearTimeout(timer)
  }, [phase])
  useEffect(() => {
    if (!preview || phase === 'main') return
    const original = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = original }
  }, [preview, phase])
  useEffect(() => { if (inline) inlineInput.current?.focus() }, [inline])
  useEffect(() => {
    if (lightbox && dialog.current && !dialog.current.open) {
      dialog.current.showModal()
      // Set the selected photo only on opening; never snap back during a swipe.
      const rail = photoRail.current
      if (rail) rail.scrollLeft = (lightbox - 1) * rail.clientWidth
    } else if (!lightbox) dialog.current?.close()
  }, [lightbox])
  const changePhoto = (direction: -1 | 1) => {
    const rail = photoRail.current
    if (!rail || lightbox === null) return
    const next = (lightbox - 1 + direction + galleryPhotos.length) % galleryPhotos.length + 1
    const instant = Math.abs(next - lightbox) > 1 || window.matchMedia('(prefers-reduced-motion: reduce)').matches
    rail.scrollTo({ left:(next - 1) * rail.clientWidth, behavior:instant ? 'instant' : 'smooth' })
  }
  const photoViewerOpen = lightbox !== null
  useEffect(() => {
    if (!photoViewerOpen) return
    const viewer = dialog.current
    if (!viewer) return
    const original = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const stopGesture = (event: Event) => event.preventDefault()
    const stopPinch = (event: TouchEvent) => { if (event.touches.length > 1) event.preventDefault() }
    viewer.addEventListener('gesturestart', stopGesture, { passive:false })
    viewer.addEventListener('gesturechange', stopGesture, { passive:false })
    viewer.addEventListener('touchstart', stopPinch, { passive:false })
    return () => {
      document.body.style.overflow = original
      viewer.removeEventListener('gesturestart', stopGesture)
      viewer.removeEventListener('gesturechange', stopGesture)
      viewer.removeEventListener('touchstart', stopPinch)
    }
  }, [photoViewerOpen])
  useEffect(() => {
    if (!preview) return
    const invitation = stage.current?.closest('.draft-invitation')
    if (!invitation) return
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)')
    const items = invitation.querySelectorAll('.draft-poster-section > :not(.draft-gallery-grid):not(.draft-copy-editor), .draft-poster-footer > :not(.draft-copy-editor)')
    const pins = invitation.querySelectorAll('.draft-photo-pin')
    const observer = new IntersectionObserver(entries => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-in-view')
          observer.unobserve(entry.target)
        }
      }
    }, { threshold:0, rootMargin:'0px 0px -6% 0px' })
    const pinObserver = new IntersectionObserver(entries => {
      for (const entry of entries) if (entry.isIntersecting) { entry.target.classList.add('is-pinned'); pinObserver.unobserve(entry.target) }
    }, { threshold: .18, rootMargin:'0px 0px -8% 0px' })
    const clear = () => {
      observer.disconnect(); pinObserver.disconnect()
      for (const item of items) item.classList.remove('draft-motion-item', 'is-in-view')
      for (const pin of pins) pin.classList.remove('will-pin', 'is-pinned')
    }
    const start = () => {
      clear()
      if (reduced.matches) return
      // Observe each item: a tall section must not play its lower content early.
      for (const item of items) { item.classList.add('draft-motion-item'); observer.observe(item) }
      // Observe stable photo wrappers, not their transformed flying images.
      for (const pin of pins) { pin.classList.add('will-pin'); pinObserver.observe(pin) }
    }
    start()
    reduced.addEventListener('change', start)
    return () => { clear(); reduced.removeEventListener('change', start) }
  }, [preview, replay])

  const remember = useCallback(() => setHistory(current => [...current.slice(-49), structuredClone(liveConfig.current)]), [])
  const update = (next: DraftConfig, record = true, fit = true) => { if (record) remember(); if (fit) constrainNextLayout.current = true; liveConfig.current = next; persist(next); setConfig(next) }
  const updateCopy = (key: CopyKey, value: string) => update({ ...liveConfig.current, copy: { ...liveConfig.current.copy, [key]: value } }, true, false)
  const editCopy = (group: string) => !preview && <DraftCopyEditor group={group} copy={copy} onChange={updateCopy} saveState={saveState} />
  const updateBlock = (patch: Partial<DraftConfig['intro']>, record = true) => {
    update({ ...liveConfig.current, [scene]: { ...liveConfig.current[scene], ...patch } }, record)
  }
  const updateText = (value: string) => {
    if (value.length > 100 || value.split('\n').length > 3) {
      setNotice('문구는 3줄, 100자까지 입력할 수 있어요.'); return
    }
    setNotice(isSupportedText(value) ? '' : 'Black Rush에 없는 한글·기호는 기본 글꼴로 표시합니다. 입력한 문구는 그대로 저장돼요.')
    updateBlock({ text: normalizeText(value) })
  }
  const undo = () => {
    const previous = history.at(-1)
    if (previous) { setConfig(previous); setHistory(history.slice(0, -1)) }
  }
  const startPreview = () => {
    if (!preview) { const url = new URL(window.location.href); url.searchParams.set('mode', 'preview'); window.history.pushState(null, '', url) }
    setInline(false); setPhase('intro'); setMainReady(false); setMainLetteringReady(false); setReplay(value => value + 1); setPreview(true)
    window.scrollTo({ top: 0, behavior: 'instant' })
  }
  const chooseScene = (value: Scene) => {
    setScene(value); setInline(false); stage.current?.scrollIntoView({ block: 'start', behavior: 'smooth' })
  }
  const stopPreview = () => {
    const published = isPublishedPreview()
    const url = new URL(window.location.href); url.searchParams.delete('mode'); url.searchParams.delete('source'); window.history.pushState(null, '', url)
    if (published) setConfig(readSaved())
    setPreview(false); setInline(false); setToolsOpen(false); window.scrollTo({ top:0, behavior:'instant' })
  }

  const startDrag = (event: ReactPointerEvent<HTMLElement>, mode: 'move' | 'resize' | 'rotate' = 'move') => {
    if (preview || inline || event.button !== 0) return
    const rect = stage.current?.getBoundingClientRect()
    const letterRect = selection.current?.getBoundingClientRect()
    if (!rect || !letterRect) return
    event.preventDefault(); event.stopPropagation()
    event.currentTarget.focus(); event.currentTarget.setPointerCapture(event.pointerId)
    remember()
    const cx = letterRect.x + letterRect.width / 2, cy = letterRect.y + letterRect.height / 2
    drag.current = { id: event.pointerId, x: event.clientX, y: event.clientY, block: { ...block }, w: rect.width, h: rect.height, bw: letterRect.width, bh: letterRect.height, mode, cx, cy, angle: Math.atan2(event.clientY - cy, event.clientX - cx) }
  }
  const move = (event: ReactPointerEvent<HTMLDivElement>) => {
    const current = drag.current
    if (!current || current.id !== event.pointerId) return
    const dx = (event.clientX - current.x) / current.w * 100
    const dy = (event.clientY - current.y) / current.h * 100
    if (current.mode === 'rotate') {
      const angle = Math.atan2(event.clientY - current.cy, event.clientX - current.cx)
      const degrees = current.block.rotation + (angle - current.angle) * 180 / Math.PI
      const rotation = (degrees + 540) % 360 - 180
      updateBlock({ rotation: event.shiftKey ? Math.round(rotation / 15) * 15 : Math.round(rotation) }, false)
    } else if (current.mode === 'resize') {
      const radians = current.block.rotation * Math.PI / 180
      const localDx = (event.clientX - current.x) * Math.cos(radians) + (event.clientY - current.y) * Math.sin(radians)
      updateBlock({ width: clamp(current.block.width + localDx / current.w * 200, 25, 94) }, false)
    }
    else {
      const halfW = Math.min(49, current.bw / current.w * 50)
      const halfH = Math.min(49, current.bh / current.h * 50)
      updateBlock({ x: clamp(current.block.x + dx, halfW, 100 - halfW), y: clamp(current.block.y + dy, halfH, 100 - halfH) }, false)
    }
  }

  const exportConfig = () => {
    try {
      parseConfig(config)
      const url = URL.createObjectURL(new Blob([JSON.stringify(config, null, 2)], { type: 'application/json' }))
      const link = document.createElement('a'); link.href = url; link.download = 'wedding-draft.json'; link.click()
      window.setTimeout(() => URL.revokeObjectURL(url), 1000)
      setNotice('설정을 내보냈어요. 다른 기기에서 불러오거나 최종 반영할 때 사용할 수 있습니다.')
    } catch { setNotice('설정값을 확인한 뒤 다시 내보내주세요.') }
  }

  const renderPhoto = (value: Scene, isMainPreview = false) => <img
    className="draft-photo" src={photo(value)} srcSet={`${photo(value)} 800w, ${photo(value, 1400)} 1400w`}
    sizes="(max-width: 600px) 100vw, 430px" alt={value === 'intro' ? '정원에서 비눗방울과 함께 웃고 있는 두 사람' : '파란 수트와 핑크 드레스를 입고 나란히 앉은 두 사람'}
    width="800" height="1200" fetchPriority={isMainPreview ? 'low' : 'high'} draggable={false}
    onLoad={() => { if (isMainPreview) setMainReady(true) }}
    onError={() => { if (isMainPreview) setMainReady(true); setNotice('사진을 불러오지 못했어요. 연결 상태를 확인하고 새로고침해주세요.') }}
  />
  const renderLetters = (value: Scene, animate: boolean) => {
    const content = config[value]
    return outlines ? <DraftLettering text={content.text || ' '} color={content.color} outlines={outlines} animate={animate} onComplete={value === 'main' && animate ? finishMainLettering : undefined} />
      : <span className="draft-loading">{fontError ? '레터링을 불러오지 못했어요. 새로고침해주세요.' : '레터링 준비 중…'}</span>
  }
  const position = (value: Scene): CSSProperties => ({ left: `${config[value].x}%`, top: `${config[value].y}%`, width: `${config[value].width}%`, transform: `translate(-50%, -50%) rotate(${config[value].rotation}deg)` })

  return <>
    {preview && createPortal(<div className="draft-viewport-backdrop" aria-hidden="true" key={`backdrop-${replay}`}>
      {renderPhoto('main', true)}
      {phase !== 'main' && <div className={`draft-backdrop-intro ${phase === 'leaving' ? 'is-leaving' : ''}`}>{renderPhoto('intro')}</div>}
    </div>, document.body)}
    <main className={`draft-studio ${preview ? 'is-preview' : ''} ${preview && cleanEdges ? 'is-edge-clean' : ''}`} style={{ '--draft-paper': config.palette.background, '--draft-blue': config.palette.blue, '--draft-pink': config.palette.pink } as CSSProperties}>
    {!preview && <>
      <header className="draft-header">
        <a href={`${import.meta.env.BASE_URL}design-lab/`}>← DESIGN LAB</a>
        <span>OUR INVITATION <i> / </i> DRAFT 01</span>
        <nav className="draft-mode-switch" aria-label="초안 모드"><span aria-current="page">편집 모드</span><button className="draft-primary" onClick={startPreview}>미리보기 ▶</button><a href="?mode=preview" target="_blank" rel="noopener noreferrer">새 창 ↗</a></nav>
      </header>
      <div className="draft-introduction"><div><p className="draft-eyebrow">A LITTLE SPACE FOR OUR DAY</p><h1>우리의 초대장, <em>만드는 중.</em></h1></div><p>사진 위 문구는 드래그해서, 본문은 각 구역의<br />‘문구 편집’에서 수정하세요. 미리보기에는 도구가 숨겨져요.</p></div>
    </>}

    <div className="draft-workspace">
      {!preview && <aside className={`draft-inspector ${toolsOpen ? 'is-open' : ''}`} aria-label="초안 편집 도구" id="draft-inspector">
        <div className="draft-panel-title"><span>EDIT YOUR INVITATION</span><small>01</small></div>
        <div className="draft-tabs" role="group" aria-label="편집할 장면">
          {(['intro', 'main'] as const).map(value => <button key={value} aria-pressed={scene === value} onClick={() => chooseScene(value)}>{sceneLabel[value]}</button>)}
        </div>
        <label className="draft-field"><span>사진 위 문구 <small>BLACK RUSH</small></span><textarea aria-label="사진 위 문구" value={block.text} rows={3} onFocus={() => setTyping(true)} onBlur={() => setTyping(false)} onChange={event => updateText(event.target.value)} /></label>
        <p className="draft-help">줄바꿈으로 행을 나눌 수 있어요. 사진 위 문구를 드래그해 이동하고, 더블클릭해 편집하세요.</p>
        <label className="draft-field"><span>글자 크기 <small>{Math.round(block.width)}%</small></span><input aria-label="글자 크기" type="range" min="25" max="94" value={block.width} onChange={event => updateBlock({ width: Number(event.target.value) })} /></label>
        <label className="draft-field"><span>회전 <small>{block.rotation}°</small></span><input aria-label="문구 회전" type="range" min="-180" max="180" step="1" value={block.rotation} onChange={event => updateBlock({ rotation: Number(event.target.value) })} /></label>
        <div className="draft-rotation-tools"><label>각도 <input aria-label="회전 각도" type="number" min="-180" max="180" value={block.rotation} onChange={event => updateBlock({ rotation: clamp(Number(event.target.value), -180, 180) })} />°</label><button onClick={() => updateBlock({ rotation: 0 })}>수평으로</button></div>
        <p className="draft-help">문구 위의 ↻ 핸들을 끌어 회전하세요. Shift를 누르면 15°씩 맞춰집니다.</p>
        <div className="draft-coordinate-fields">
          {(['x', 'y'] as const).map((axis, index) => <label key={axis}>{index ? '세로 위치' : '가로 위치'}<input aria-label={index ? '세로 위치' : '가로 위치'} type="number" min="0" max="100" step="1" value={Math.round(block[axis])} onChange={event => updateBlock({ [axis]: clamp(Number(event.target.value), 0, 100) })} /></label>)}
        </div>
        <label className="draft-color-field">레터링 색상 <span>{block.color}<input aria-label="레터링 색상" type="color" value={block.color} onChange={event => updateBlock({ color: event.target.value })} /></span></label>
        <div className="draft-small-actions"><button onClick={() => updateBlock({ x: 50 })}>가운데 정렬</button><button onClick={() => updateBlock(defaults[scene])}>이 장면 초기화</button></div>
        {editCopy('cover')}
        <div className="draft-palette-heading"><span>02 / PAPER & INK</span><h2>사진에서 이어지는 색</h2><p>수트의 블루, 드레스의 로즈핑크.<br />배경은 노란 기가 적은 쿨 아이보리를 추천해요.</p></div>
        {(['background', 'blue', 'pink'] as const).map((key, index) => <label key={key} className="draft-color-field">{['본문 배경', '블루 글자', '핑크 포인트'][index]}<span>{config.palette[key]}<input aria-label={['본문 배경', '블루 글자', '핑크 포인트'][index]} type="color" value={config.palette[key]} onChange={event => update({ ...config, palette: { ...config.palette, [key]: event.target.value } })} /></span></label>)}
        <div className="draft-swatches">{[['쿨 아이보리', '#F4F4F0'], ['미스트 블루', '#EAF0F5'], ['블러시 화이트', '#FAF0F2']].map(([label, color]) => <button key={color} aria-label={`${label} 배경`} title={label} onClick={() => update({ ...config, palette: { ...config.palette, background: color } })}><i style={{ background: color }} />{label}</button>)}</div>
        <button className="draft-body-link" onClick={() => { setToolsOpen(false); document.getElementById('draft-body')?.scrollIntoView({ behavior: 'smooth' }) }}>본문에서 색상 확인 ↓</button>
        <div className="draft-save-tools"><p role="status">● {saveState}</p><p>자동 저장은 이 기기에만 적용돼요.<br />설정 파일을 옮기면 다른 기기에서도 이어갈 수 있어요.</p><p><a href="?mode=preview&source=published" target="_blank" rel="noopener noreferrer">공유용 미리보기 ↗</a><br />기기별 편집값 대신 마지막 배포본을 표시합니다.</p><div><button onClick={() => { if (persist(liveConfig.current)) setNotice('문구·위치·회전을 저장했어요. 새로고침해도 유지됩니다.') }}>지금 저장</button><button onClick={undo} disabled={!history.length}>되돌리기</button><button onClick={exportConfig}>설정 내보내기</button><button onClick={() => importInput.current?.click()}>불러오기</button></div></div>
        <input ref={importInput} type="file" accept="application/json,.json" hidden onChange={async event => {
          const file = event.target.files?.[0]; event.target.value = ''; if (!file) return
          try { if (file.size > 200000) throw new Error('설정 파일이 너무 큽니다.'); update(parseConfig(JSON.parse(await file.text()))); setNotice('설정을 불러왔어요.') }
          catch (error) { setNotice(error instanceof Error ? error.message : '설정 파일을 확인해주세요.') }
        }} />
        {notice && <p className="draft-notice" role="status">{notice}</p>}
      </aside>}

      <div className="draft-preview-column">
        {!preview && <div className="draft-canvas-caption"><span>{scene === 'intro' ? '01 / THE PRELUDE' : '02 / THE COVER'}</span><span>드래그 · 더블클릭 · 방향키</span></div>}
        <article className="draft-invitation">
          <div className="draft-bgm-dock">
            <DraftBgm key={draftMusicSrc ?? 'pending'} src={draftMusicSrc} />
            <DraftEventFloat dateValue={copy.ceremonyDate} time={copy.ceremonyTime} venue={copy.venueName} hall={copy.venueHall} quietRegion={dateCard} enabled={!preview || (phase === 'main' && (mainLetteringReady || fontError))} />
          </div>
          <section ref={stage} className="draft-stage" onContextMenu={protectPhoto} onCopy={protectPhoto} onDragStart={protectPhoto} onDoubleClick={preview ? protectPhoto : undefined} aria-label={`${preview ? '청첩장' : sceneLabel[scene]} 화면`}>
            {preview ? <>
              <div className={`draft-cover-layer ${phase !== 'main' ? 'is-waiting' : ''}`} key={`cover-${replay}`}>
                <div className="draft-scene-content"><div className="draft-letter-position" style={position('main')} key={`main-${replay}-${phase === 'main'}`}>{phase === 'main' && renderLetters('main', true)}</div><span className="draft-scroll-note">{copy.coverCaption} <span>↓</span></span></div>
              </div>
              {phase !== 'main' && <><div className={`draft-intro-layer ${phase === 'leaving' ? 'is-leaving' : ''}`} key={`intro-${replay}`}>
                <div className="draft-scene-content"><div className="draft-letter-position" style={position('intro')}>{renderLetters('intro', true)}</div><span className="draft-intro-caption">{copy.introCaption}</span></div>
              </div><div className="draft-cover-controls"><button className="draft-skip" disabled={phase === 'leaving'} onClick={() => setPhase('leaving')}>건너뛰기 →</button></div></>}
            </> : <>
              {renderPhoto(scene)}
              <button className="draft-edit-text-button" onClick={() => { setInline(value => !value); setToolsOpen(false) }}>{inline ? '편집 완료 ✓' : '문구 편집 ✎'}</button>
              <div ref={selection} className={`draft-letter-position draft-selection ${inline ? 'is-typing' : ''}`} style={position(scene)} tabIndex={0} role="group" aria-label="문구 이동 및 크기 조절"
                onPointerDown={event => startDrag(event)} onPointerMove={move} onPointerUp={() => { drag.current = null }} onPointerCancel={() => { drag.current = null }} onLostPointerCapture={() => { drag.current = null }}
                onDoubleClick={() => setInline(true)} onKeyDown={event => {
                  if (inline) return
                  if (event.key === 'Enter') { event.preventDefault(); setInline(true) }
                  const delta = event.shiftKey ? 5 : 1
                  const offsets: Record<string, [number, number]> = { ArrowLeft: [-delta, 0], ArrowRight: [delta, 0], ArrowUp: [0, -delta], ArrowDown: [0, delta] }
                  if (offsets[event.key]) { event.preventDefault(); const [dx, dy] = offsets[event.key]; updateBlock({ x: clamp(block.x + dx, 0, 100), y: clamp(block.y + dy, 0, 100) }) }
                }}>
                {renderLetters(scene, false)}
                {inline && <textarea ref={inlineInput} className="draft-inline-input" aria-label="사진 위에서 문구 편집" value={block.text} onPointerDown={event => event.stopPropagation()} onDoubleClick={event => event.stopPropagation()} onChange={event => updateText(event.target.value)} onKeyDown={event => { event.stopPropagation(); if (event.key === 'Escape' || (event.key === 'Enter' && (event.ctrlKey || event.metaKey))) setInline(false) }} />}
                {!inline && <><span className="draft-selection-label">BLACK RUSH · 이동</span>
                  <span className="draft-rotate-handle" role="slider" aria-label="문구 회전 핸들" aria-valuemin={-180} aria-valuemax={180} aria-valuenow={block.rotation} tabIndex={0} onDoubleClick={event => event.stopPropagation()} onPointerDown={event => startDrag(event, 'rotate')} onKeyDown={event => {
                    if (event.key.startsWith('Arrow')) { event.stopPropagation(); event.preventDefault(); const step = event.shiftKey ? 15 : 1; updateBlock({ rotation: clamp(block.rotation + (['ArrowRight', 'ArrowUp'].includes(event.key) ? step : -step), -180, 180) }) }
                  }}>↻</span>
                  <span className="draft-handle" role="slider" aria-label="문구 크기 핸들" aria-valuemin={25} aria-valuemax={94} aria-valuenow={Math.round(block.width)} tabIndex={0} onPointerDown={event => startDrag(event, 'resize')} onKeyDown={event => { if (event.key === 'ArrowRight' || event.key === 'ArrowLeft') { event.stopPropagation(); event.preventDefault(); updateBlock({ width: clamp(block.width + (event.key === 'ArrowRight' ? 1 : -1), 25, 94) }) } }} /></>}
              </div>
              {inline && notice && <p className="draft-inline-notice" role="status">{notice}</p>}
              <span className="draft-canvas-save" role="status">{saveState}</span>
              <span className="draft-stage-footnote">{scene === 'intro' ? '인트로 → 메인 커버로 부드럽게 전환' : '이 장면 아래로 초대장이 이어집니다'}</span>
            </>}
          </section>

          <div className="draft-poster-body" id="draft-body">
            <div className="draft-ticker"><span>{copy.tickerLeft}</span><b><DraftTickerAsterisk /></b><span>{copy.tickerRight}</span><b><DraftTickerAsterisk /></b></div>
            <section className="draft-poster-section draft-greeting">
              <div className="draft-section-index">01 <span>{copy.greetingLabel}</span></div><h2>{copy.greetingTitle}<em>{copy.greetingAccent}</em></h2><div className="draft-flower" aria-hidden="true"><DraftAsterisk /></div><p>{copy.greetingMessage}</p><p>{copy.greetingInvite}</p><div className="draft-couple"><span><small>신랑</small> {copy.groom}</span><i>&</i><span><small>신부</small> {copy.bride}</span></div>{editCopy('greeting')}
            </section>
            <section className="draft-poster-section draft-date">
              <div className="draft-section-index">02 <span>{copy.dateLabel}</span></div>
              <div className="draft-date-heading"><h2>{copy.dateTitle}<em>{copy.dateAccent}</em></h2><DraftCountdown dateValue={copy.ceremonyDate} /></div>
              <div ref={dateCard} className="draft-date-card"><DraftCalendar dateValue={copy.ceremonyDate} /><div className="draft-ceremony-details"><p className="draft-date-text"><time dateTime={`${copy.ceremonyDate}T${copy.ceremonyTime}:00+09:00`}><span>{ceremonyDay}</span>{'\n'}<span className="draft-ceremony-hour">{ceremonyHour}</span></time></p><div className="draft-ceremony-venue"><span>{copy.venueName}</span>{' '}<span className="draft-ceremony-hall">{copy.venueHall}</span></div></div></div><DraftCalendarAdd copy={copy} />{editCopy('date')}
            </section>
            <section className="draft-poster-section draft-gallery">
              <div className="draft-section-index">03 <span>{copy.galleryLabel}</span></div><h2>{copy.galleryTitle}<em>{copy.galleryAccent}</em></h2><p>{copy.galleryMessage}</p>
              <div className="draft-gallery-grid" role="group" aria-label="사진을 붙인 메모리 보드">
                  {galleryBoard.map((number, index) => {
                    return <div key={number} className={`draft-photo-pin pin-slot-${String(index + 1).padStart(2,'0')} frame-portrait`}>
                      <button className="draft-photo-print" onContextMenu={protectPhoto} onCopy={protectPhoto} onDragStart={protectPhoto} onDoubleClick={protectPhoto} onClick={() => setLightbox(number)} aria-label={`${number}번 사진 보기`}>
                        <img src={galleryPhoto(number)} width="320" height="480" loading="lazy" decoding="async" draggable={false} alt={`${number}번째 웨딩 사진`} />
                      </button>
                    </div>
                  })}
              </div>
              {editCopy('gallery')}
            </section>
            <section className="draft-poster-section draft-location">
              <div className="draft-section-index">04 <span>{copy.locationLabel}</span></div><h2>{copy.locationTitle}</h2><div className="draft-location-card"><div className="draft-location-title"><strong>{copy.venueName}</strong><span className="draft-location-hall">{copy.venueHall}</span><span className="draft-location-arrow" aria-hidden="true">↗</span></div><address>{copy.venueAddress}</address></div><DraftMap />
              <nav className="draft-map-links" aria-label="예식장 지도 앱">
                <a href={`https://map.naver.com/p/search/${mapQuery}`} target="_blank" rel="noopener noreferrer"><img src="https://ssl.pstatic.net/static/maps/assets/icons/apple-icon-180x180.png" width="22" height="22" alt="" loading="lazy" />네이버지도 ↗</a>
                <a href={`https://map.kakao.com/link/search/${mapQuery}`} target="_blank" rel="noopener noreferrer"><img src="https://map.kakao.com/favicon.ico" width="22" height="22" alt="" loading="lazy" />카카오맵 ↗</a>
              </nav>{copy.transport && <p className="draft-transport">{copy.transport}</p>}{editCopy('location')}
            </section>
            <section className="draft-poster-section draft-accounts-section">
              <div className="draft-section-index">05 <span>{copy.accountsLabel}</span></div><h2>{copy.accountsTitle}</h2><p>{copy.accountsMessage}</p><DraftAccounts copy={copy} />{editCopy('accounts')}
            </section>
            <footer className="draft-poster-footer"><span>{copy.footerLabel}</span><strong>{copy.footerTitle}</strong><span>{copy.footerNote}</span>{editCopy('footer')}</footer>
          </div>
        </article>
        {!preview && <p className="draft-bottom-note">수정 사항은 이 브라우저에 자동 저장돼요. 미리보기 주소를 다른 기기에서 열면 기본 초안이 표시됩니다.<br />다른 기기로 옮길 때는 설정 내보내기·불러오기를 이용해주세요.</p>}
      </div>
    </div>
    {!preview && <button className="draft-mobile-tools" aria-controls="draft-inspector" aria-expanded={toolsOpen} onClick={() => setToolsOpen(value => !value)}>{toolsOpen ? '편집 도구 닫기 ×' : '문구 · 배경 편집 ✎'}</button>}
    {preview && <nav className="draft-preview-controls" aria-label="미리보기 제어"><button onClick={stopPreview}>← 편집으로</button><button onClick={startPreview}>다시 재생 ↻</button></nav>}
    <dialog ref={dialog} className="draft-lightbox" aria-label="갤러리 사진 보기" onContextMenu={protectPhoto} onCopy={protectPhoto} onDragStart={protectPhoto} onDoubleClick={protectPhoto} onCancel={() => setLightbox(null)} onClick={event => { if (event.target === event.currentTarget) setLightbox(null) }} onKeyDown={event => { if (event.key === 'ArrowRight' || event.key === 'ArrowLeft') { event.preventDefault(); changePhoto(event.key === 'ArrowRight' ? 1 : -1) } }}>
      <div className="draft-lightbox-stage">
        <div ref={photoRail} className="draft-lightbox-rail" aria-label="좌우로 넘기는 사진" onScroll={event => {
          const rail = event.currentTarget
          if (dialog.current?.open && rail.clientWidth) setLightbox(clamp(Math.round(rail.scrollLeft / rail.clientWidth) + 1, 1, galleryPhotos.length))
        }}>
          {lightbox !== null && galleryPhotos.map(number => <div className="draft-lightbox-slide" key={number} aria-hidden={lightbox !== number}>
            <img src={galleryPhoto(number, Math.abs(number - lightbox) <= 1 ? 1200 : 320)} width="1200" height="1800" loading={Math.abs(number - lightbox) <= 1 ? 'eager' : 'lazy'} decoding="async" draggable={false} alt={`${number}번째 웨딩 사진`} />
          </div>)}
        </div>
        <button className="draft-lightbox-close" aria-label="사진 보기 닫기" autoFocus style={{ backdropFilter:'blur(2px)', WebkitBackdropFilter:'blur(2px)' }} onClick={() => setLightbox(null)}><svg viewBox="0 0 24 24" aria-hidden="true"><path d="m6 6 12 12M18 6 6 18" /></svg></button>
        {(['previous', 'next'] as const).map(direction => <button key={direction} className={`draft-lightbox-arrow is-${direction}`} aria-label={direction === 'previous' ? '이전 사진' : '다음 사진'} style={{ backdropFilter:'blur(2px)', WebkitBackdropFilter:'blur(2px)' }} onClick={() => changePhoto(direction === 'previous' ? -1 : 1)}><svg viewBox="0 0 24 24" aria-hidden="true"><path d={direction === 'previous' ? 'm14 5-7 7 7 7' : 'm10 5 7 7-7 7'} /></svg></button>)}
      </div>
    </dialog>
  </main>
  </>
}
