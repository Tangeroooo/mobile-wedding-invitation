import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react'
import type { CSSProperties, PointerEvent as ReactPointerEvent } from 'react'
import DraftLettering from './DraftLettering'
import type { Outlines } from './DraftLettering'
import { clamp, defaults, isSupportedText, normalizeText, parseConfig, storageKey } from './draftModel'
import type { DraftConfig, Scene } from './draftModel'
import './DraftStudio.css'

const asset = (name: string) => `${import.meta.env.BASE_URL}images/draft/${name}`
const photo = (scene: Scene, width = 800) => asset(`${scene}-${width}.webp`)
const sceneLabel = { intro: '인트로', main: '메인 커버' }

function readSaved() {
  try {
    const saved = localStorage.getItem(storageKey)
    return saved ? parseConfig(JSON.parse(saved)) : defaults
  } catch { return defaults }
}

export default function DraftStudio() {
  const [config, setConfig] = useState<DraftConfig>(readSaved)
  const [scene, setScene] = useState<Scene>('intro')
  const [preview, setPreview] = useState(false)
  const [phase, setPhase] = useState<'intro' | 'leaving' | 'main'>('intro')
  const [mainReady, setMainReady] = useState(false)
  const [outlines, setOutlines] = useState<Outlines | null>(null)
  const [fontError, setFontError] = useState(false)
  const [notice, setNotice] = useState('')
  const [saveState, setSaveState] = useState('이 브라우저에 자동 저장')
  const [history, setHistory] = useState<DraftConfig[]>([])
  const [inline, setInline] = useState(false)
  const [toolsOpen, setToolsOpen] = useState(false)
  const [lightbox, setLightbox] = useState<Scene | null>(null)
  const [replay, setReplay] = useState(0)
  const stage = useRef<HTMLElement>(null)
  const selection = useRef<HTMLDivElement>(null)
  const inlineInput = useRef<HTMLTextAreaElement>(null)
  const dialog = useRef<HTMLDialogElement>(null)
  const importInput = useRef<HTMLInputElement>(null)
  const drag = useRef<{ id: number; x: number; y: number; block: DraftConfig['intro']; w: number; h: number; bw: number; bh: number; resize: boolean } | null>(null)
  const liveConfig = useRef(config)
  liveConfig.current = config
  const block = config[scene]

  useLayoutEffect(() => {
    if (preview || !stage.current || !selection.current) return
    const keepInFrame = () => {
      const frame = stage.current?.getBoundingClientRect()
      const text = selection.current?.getBoundingClientRect()
      if (!frame || !text) return
      const halfW = Math.min(49, text.width / frame.width * 50)
      const halfH = Math.min(49, text.height / frame.height * 50)
      setConfig(current => {
        const value = current[scene]
        const x = clamp(value.x, halfW, 100 - halfW), y = clamp(value.y, halfH, 100 - halfH)
        return Math.abs(x - value.x) < .01 && Math.abs(y - value.y) < .01 ? current : { ...current, [scene]: { ...value, x, y } }
      })
    }
    keepInFrame()
    const observer = new ResizeObserver(keepInFrame)
    observer.observe(stage.current); observer.observe(selection.current)
    return () => observer.disconnect()
  }, [scene, preview, block.text, block.width, block.x, block.y, outlines])

  useEffect(() => {
    const abort = new AbortController()
    fetch(asset('black-rush-outlines.json'), { signal: abort.signal })
      .then(response => { if (!response.ok) throw new Error(); return response.json() })
      .then(setOutlines)
      .catch(error => { if (error.name !== 'AbortError') setFontError(true) })
    return () => abort.abort()
  }, [])

  useEffect(() => {
    const timer = window.setTimeout(() => {
      try { parseConfig(config) } catch { setSaveState('문구를 채우면 자동 저장돼요'); return }
      try { localStorage.setItem(storageKey, JSON.stringify(config)); setSaveState('이 브라우저에 저장됨') }
      catch { setSaveState('자동 저장 불가 · 설정 파일로 보관해주세요') }
    }, 250)
    return () => window.clearTimeout(timer)
  }, [config])

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
    if (lightbox) dialog.current?.showModal()
    else dialog.current?.close()
  }, [lightbox])
  useEffect(() => {
    if (!preview || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const sections = document.querySelectorAll('.draft-poster-section')
    const observer = new IntersectionObserver(entries => {
      for (const entry of entries) if (entry.isIntersecting) { entry.target.classList.add('draft-revealed'); observer.unobserve(entry.target) }
    }, { threshold: .08 })
    for (const section of sections) { section.classList.add('draft-reveal'); observer.observe(section) }
    return () => { observer.disconnect(); for (const section of sections) section.classList.remove('draft-reveal', 'draft-revealed') }
  }, [preview, replay])

  const remember = useCallback(() => setHistory(current => [...current.slice(-49), structuredClone(liveConfig.current)]), [])
  const update = (next: DraftConfig, record = true) => { if (record) remember(); setConfig(next) }
  const updateBlock = (patch: Partial<DraftConfig['intro']>, record = true) => {
    update({ ...liveConfig.current, [scene]: { ...liveConfig.current[scene], ...patch } }, record)
  }
  const updateText = (value: string) => {
    if (!isSupportedText(value) || value.length > 100 || value.split('\n').length > 3) {
      setNotice('Black Rush 문구는 영문·숫자·기호로 3줄, 100자까지 입력할 수 있어요.'); return
    }
    setNotice(''); updateBlock({ text: normalizeText(value) })
  }
  const undo = () => {
    const previous = history.at(-1)
    if (previous) { setConfig(previous); setHistory(history.slice(0, -1)) }
  }
  const startPreview = () => {
    setInline(false); setPhase('intro'); setMainReady(false); setReplay(value => value + 1); setPreview(true)
    window.scrollTo({ top: 0, behavior: 'instant' })
  }
  const chooseScene = (value: Scene) => {
    setScene(value); setInline(false); stage.current?.scrollIntoView({ block: 'start', behavior: 'smooth' })
  }

  const startDrag = (event: ReactPointerEvent<HTMLElement>, resize = false) => {
    if (preview || inline || event.button !== 0) return
    const rect = stage.current?.getBoundingClientRect()
    const letterRect = selection.current?.getBoundingClientRect()
    if (!rect || !letterRect) return
    event.preventDefault(); event.stopPropagation()
    event.currentTarget.focus(); event.currentTarget.setPointerCapture(event.pointerId)
    remember()
    drag.current = { id: event.pointerId, x: event.clientX, y: event.clientY, block: { ...block }, w: rect.width, h: rect.height, bw: letterRect.width, bh: letterRect.height, resize }
  }
  const move = (event: ReactPointerEvent<HTMLDivElement>) => {
    const current = drag.current
    if (!current || current.id !== event.pointerId) return
    const dx = (event.clientX - current.x) / current.w * 100
    const dy = (event.clientY - current.y) / current.h * 100
    if (current.resize) updateBlock({ width: clamp(current.block.width + dx * 2, 25, 94) }, false)
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
    } catch { setNotice('빈 문구를 채운 뒤 내보내주세요.') }
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
    return outlines ? <DraftLettering text={content.text || ' '} color={content.color} outlines={outlines} animate={animate} />
      : <span className="draft-loading">{fontError ? '레터링을 불러오지 못했어요. 새로고침해주세요.' : '레터링 준비 중…'}</span>
  }
  const position = (value: Scene): CSSProperties => ({ left: `${config[value].x}%`, top: `${config[value].y}%`, width: `${config[value].width}%` })

  return <main className={`draft-studio ${preview ? 'is-preview' : ''}`} style={{ '--draft-paper': config.palette.background, '--draft-blue': config.palette.blue, '--draft-pink': config.palette.pink } as CSSProperties}>
    {!preview && <>
      <header className="draft-header">
        <a href={`${import.meta.env.BASE_URL}design-lab/`}>← DESIGN LAB</a>
        <span>OUR INVITATION <i> / </i> DRAFT 01</span>
        <button className="draft-primary" onClick={startPreview} disabled={!outlines}>전체 재생 ↗</button>
      </header>
      <div className="draft-introduction"><div><p className="draft-eyebrow">A LITTLE SPACE FOR OUR DAY</p><h1>우리의 초대장, <em>만드는 중.</em></h1></div><p>24 프렐류드의 시작, 20 시트러스의 리듬.<br />사진 위의 문장을 움직이며 우리다운 장면을 찾아보세요.</p></div>
    </>}

    <div className="draft-workspace">
      {!preview && <aside className={`draft-inspector ${toolsOpen ? 'is-open' : ''}`} aria-label="초안 편집 도구" id="draft-inspector">
        <div className="draft-panel-title"><span>EDIT YOUR INVITATION</span><small>01</small></div>
        <div className="draft-tabs" role="group" aria-label="편집할 장면">
          {(['intro', 'main'] as const).map(value => <button key={value} aria-pressed={scene === value} onClick={() => chooseScene(value)}>{sceneLabel[value]}</button>)}
        </div>
        <label className="draft-field"><span>사진 위 문구 <small>BLACK RUSH</small></span><textarea aria-label="사진 위 문구" value={block.text} rows={3} onChange={event => updateText(event.target.value)} /></label>
        <p className="draft-help">줄바꿈으로 행을 나눌 수 있어요. 사진 위 문구를 드래그해 이동하고, 더블클릭해 편집하세요.</p>
        <label className="draft-field"><span>글자 크기 <small>{Math.round(block.width)}%</small></span><input aria-label="글자 크기" type="range" min="25" max="94" value={block.width} onChange={event => updateBlock({ width: Number(event.target.value) })} /></label>
        <div className="draft-coordinate-fields">
          {(['x', 'y'] as const).map((axis, index) => <label key={axis}>{index ? '세로 위치' : '가로 위치'}<input aria-label={index ? '세로 위치' : '가로 위치'} type="number" min="0" max="100" step="1" value={Math.round(block[axis])} onChange={event => updateBlock({ [axis]: clamp(Number(event.target.value), 0, 100) })} /></label>)}
        </div>
        <label className="draft-color-field">레터링 색상 <span>{block.color}<input aria-label="레터링 색상" type="color" value={block.color} onChange={event => updateBlock({ color: event.target.value })} /></span></label>
        <div className="draft-small-actions"><button onClick={() => updateBlock({ x: 50 })}>가운데 정렬</button><button onClick={() => updateBlock(defaults[scene])}>이 장면 초기화</button></div>
        <div className="draft-palette-heading"><span>02 / PAPER & INK</span><h2>사진에서 이어지는 색</h2><p>수트의 블루, 드레스의 로즈핑크.<br />배경은 노란 기가 적은 쿨 아이보리를 추천해요.</p></div>
        {(['background', 'blue', 'pink'] as const).map((key, index) => <label key={key} className="draft-color-field">{['본문 배경', '블루 글자', '핑크 포인트'][index]}<span>{config.palette[key]}<input aria-label={['본문 배경', '블루 글자', '핑크 포인트'][index]} type="color" value={config.palette[key]} onChange={event => update({ ...config, palette: { ...config.palette, [key]: event.target.value } })} /></span></label>)}
        <div className="draft-swatches">{[['쿨 아이보리', '#F4F4F0'], ['미스트 블루', '#EAF0F5'], ['블러시 화이트', '#FAF0F2']].map(([label, color]) => <button key={color} aria-label={`${label} 배경`} title={label} onClick={() => update({ ...config, palette: { ...config.palette, background: color } })}><i style={{ background: color }} />{label}</button>)}</div>
        <button className="draft-body-link" onClick={() => { setToolsOpen(false); document.getElementById('draft-body')?.scrollIntoView({ behavior: 'smooth' }) }}>본문에서 색상 확인 ↓</button>
        <div className="draft-save-tools"><p role="status">● {saveState}</p><p>자동 저장은 이 기기에만 적용돼요.<br />설정 파일을 옮기면 다른 기기에서도 이어갈 수 있어요.</p><div><button onClick={undo} disabled={!history.length}>되돌리기</button><button onClick={exportConfig}>설정 내보내기</button><button onClick={() => importInput.current?.click()}>불러오기</button></div></div>
        <input ref={importInput} type="file" accept="application/json,.json" hidden onChange={async event => {
          const file = event.target.files?.[0]; event.target.value = ''; if (!file) return
          try { if (file.size > 30000) throw new Error('설정 파일이 너무 큽니다.'); update(parseConfig(JSON.parse(await file.text()))); setNotice('설정을 불러왔어요.') }
          catch (error) { setNotice(error instanceof Error ? error.message : '설정 파일을 확인해주세요.') }
        }} />
        {notice && <p className="draft-notice" role="status">{notice}</p>}
      </aside>}

      <div className="draft-preview-column">
        {!preview && <div className="draft-canvas-caption"><span>{scene === 'intro' ? '01 / THE PRELUDE' : '02 / THE COVER'}</span><span>드래그 · 더블클릭 · 방향키</span></div>}
        <article className="draft-invitation">
          <section ref={stage} className="draft-stage" aria-label={`${preview ? '청첩장' : sceneLabel[scene]} 화면`}>
            {preview ? <>
              <div className="draft-cover-layer" key={`cover-${replay}`}>{renderPhoto('main', true)}<div className="draft-letter-position" style={position('main')} key={`main-${replay}-${phase === 'main'}`}>{phase === 'main' && renderLetters('main', true)}</div><span className="draft-scroll-note">OUR NEXT CHAPTER <span>↓</span></span></div>
              {phase !== 'main' && <div className={`draft-intro-layer ${phase === 'leaving' ? 'is-leaving' : ''}`} key={`intro-${replay}`}>{renderPhoto('intro')}<div className="draft-letter-position" style={position('intro')}>{renderLetters('intro', true)}</div><span className="draft-intro-caption">TOGETHER, A NEW BEGINNING</span><button className="draft-skip" onClick={() => setPhase('leaving')}>건너뛰기 →</button></div>}
            </> : <>
              {renderPhoto(scene)}
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
                {inline && <textarea ref={inlineInput} className="draft-inline-input" aria-label="사진 위에서 문구 편집" value={block.text} onChange={event => updateText(event.target.value)} onBlur={() => setInline(false)} onKeyDown={event => { if (event.key === 'Escape') setInline(false) }} />}
                {!inline && <><span className="draft-selection-label">BLACK RUSH · 이동</span><span className="draft-handle" role="slider" aria-label="문구 크기 핸들" aria-valuemin={25} aria-valuemax={94} aria-valuenow={Math.round(block.width)} tabIndex={0} onPointerDown={event => startDrag(event, true)} onKeyDown={event => { if (event.key === 'ArrowRight' || event.key === 'ArrowLeft') { event.stopPropagation(); event.preventDefault(); updateBlock({ width: clamp(block.width + (event.key === 'ArrowRight' ? 1 : -1), 25, 94) }) } }} /></>}
              </div>
              <span className="draft-stage-footnote">{scene === 'intro' ? '인트로 → 메인 커버로 부드럽게 전환' : '이 장면 아래로 초대장이 이어집니다'}</span>
            </>}
          </section>

          <div className="draft-poster-body" id="draft-body">
            <div className="draft-ticker"><span>WITH YOU, ALWAYS</span><b>✳</b><span>A NEW CHAPTER</span><b>✳</b></div>
            <section className="draft-poster-section draft-greeting"><div className="draft-section-index">01 <span>THE INVITATION</span></div><h2>우리의<br /><em>가장 좋은 날.</em></h2><div className="draft-flower" aria-hidden="true">✳</div><p>서로의 일상에 가장 다정한 사람이 되어<br />이제, 함께하는 내일을 시작합니다.</p><p>소중한 여러분을<br />우리의 시작에 초대합니다.</p><div className="draft-couple">신랑 이름 <i>&</i> 신부 이름</div></section>
            <section className="draft-poster-section draft-date"><div className="draft-section-index">02 <span>SAVE THE DATE</span></div><h2>함께할<br /><em>그날의 약속.</em></h2><div className="draft-date-card"><strong>OUR DAY</strong><p>예식 날짜 · 시간 입력 예정</p><span>예식장 · 홀 이름 입력 예정</span></div></section>
            <section className="draft-poster-section draft-gallery"><div className="draft-section-index">03 <span>MOMENTS OF US</span></div><h2>우리라는<br /><em>장면들.</em></h2><p>함께 웃던 순간을 모아.</p><div className="draft-gallery-grid">{(['intro', 'main'] as const).map((value, index) => <button key={value} onClick={() => setLightbox(value)} aria-label={`${sceneLabel[value]} 사진 크게 보기`}><img src={photo(value)} width="800" height="1200" loading="lazy" decoding="async" alt={index ? '블루와 핑크, 두 사람의 초상' : '정원에서의 두 사람'} /><span>0{index + 1} / {index ? 'SIDE BY SIDE' : 'IN THE GARDEN'} ↗</span></button>)}</div><small className="draft-gallery-note">갤러리 구성은 사진을 추가하며 다듬을 예정입니다.</small></section>
            <section className="draft-poster-section"><div className="draft-section-index">04 <span>MEET US HERE</span></div><h2>만나는 곳.</h2><div className="draft-location-card"><span>↗</span><strong>예식장 이름 입력 예정</strong><p>주소와 교통 안내를 이곳에 담을게요.</p></div></section>
            <section className="draft-poster-section draft-rsvp"><div className="draft-section-index">05 <span>WITH LOVE</span></div><h2>당신과 함께라서<br /><em>더 특별한 하루.</em></h2><p>참석 여부와 마음 전하실 곳은<br />정보가 정해지면 연결할 예정입니다.</p></section>
            <footer className="draft-poster-footer"><span>BLUE MEETS PINK.</span><strong>Better, together.</strong><span>OUR WEDDING INVITATION</span></footer>
          </div>
        </article>
        {!preview && <p className="draft-bottom-note">이름·일시·장소는 미입력 상태입니다. 초안 편집은 기존 청첩장에 반영되지 않습니다.</p>}
      </div>
    </div>
    {!preview && <button className="draft-mobile-tools" aria-controls="draft-inspector" aria-expanded={toolsOpen} onClick={() => setToolsOpen(value => !value)}>{toolsOpen ? '편집 도구 닫기 ×' : '문구 · 배경 편집 ✎'}</button>}
    {preview && <nav className="draft-preview-controls" aria-label="미리보기 제어"><button onClick={() => { setPreview(false); setInline(false); window.scrollTo({ top: 0, behavior: 'instant' }) }}>← 편집으로</button><button onClick={startPreview}>다시 재생 ↻</button></nav>}
    <dialog ref={dialog} className="draft-lightbox" onCancel={() => setLightbox(null)} onClick={event => { if (event.target === event.currentTarget) setLightbox(null) }} onKeyDown={event => { if (event.key === 'ArrowRight' || event.key === 'ArrowLeft') setLightbox(current => current === 'intro' ? 'main' : 'intro') }}>
      <button className="draft-lightbox-close" autoFocus onClick={() => setLightbox(null)}>닫기 ×</button>
      {lightbox && <img src={photo(lightbox, 1400)} alt={`${sceneLabel[lightbox]} 사진 확대`} />}
      <div><button onClick={() => setLightbox('intro')}>← 정원 사진</button><button onClick={() => setLightbox('main')}>커버 사진 →</button></div>
    </dialog>
  </main>
}
