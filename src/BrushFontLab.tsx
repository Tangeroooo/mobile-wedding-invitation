import { useEffect, useState } from 'react'
import './BrushFontLab.css'

type BrushFont = {
  id: string
  name: string
  label: string
  texture: string
  mood: string
  license: string
  source: string
  current?: boolean
}

const brushFonts: BrushFont[] = [
  {
    id: 'water-brush',
    name: 'Water Brush',
    label: '마른 붓 캘리그래피',
    texture: '획 안쪽의 끊김과 거친 붓 끝이 가장 선명합니다.',
    mood: '로맨틱 · 자유로움',
    license: 'SIL OFL 1.1',
    source: 'https://fonts.google.com/specimen/Water+Brush',
    current: true,
  },
  {
    id: 'mrs-sheppards',
    name: 'Mrs Sheppards',
    label: '굵고 빠른 연결 획',
    texture: '상업 템플릿에서 자주 보이는 대담한 브러시 실루엣에 가깝습니다.',
    mood: '감각적 · 대담함',
    license: 'SIL OFL 1.1',
    source: 'https://fonts.google.com/specimen/Mrs+Sheppards',
  },
  {
    id: 'rock-salt',
    name: 'Rock Salt',
    label: '거친 드라이 브러시',
    texture: '번짐보다 긁힌 붓 자국이 강해 짧은 제목에서 힘이 생깁니다.',
    mood: '빈티지 · 에너지틱',
    license: 'Apache 2.0',
    source: 'https://fonts.google.com/specimen/Rock+Salt',
  },
  {
    id: 'caveat-brush',
    name: 'Caveat Brush',
    label: '따뜻한 손글씨 붓',
    texture: '거친 정도는 낮지만 작은 화면에서도 편안하고 잘 읽힙니다.',
    mood: '따뜻함 · 친근함',
    license: 'SIL OFL 1.1',
    source: 'https://fonts.google.com/specimen/Caveat+Brush',
  },
  {
    id: 'permanent-marker',
    name: 'Permanent Marker',
    label: '굵은 마커 브러시',
    texture: '대문자 중심의 강한 획으로 사진 위에서 존재감이 큽니다.',
    mood: '모던 · 캐주얼',
    license: 'Apache 2.0',
    source: 'https://fonts.google.com/specimen/Permanent+Marker',
  },
  {
    id: 'trade-winds',
    name: 'Trade Winds',
    label: '사선형 러프 브러시',
    texture: '비스듬한 획과 불규칙한 가장자리가 화보 같은 인상을 만듭니다.',
    mood: '에디토리얼 · 시네마틱',
    license: 'SIL OFL 1.1',
    source: 'https://fonts.google.com/specimen/Trade+Winds',
  },
]

function BrushFontLab() {
  const [previewText, setPreviewText] = useState("We're getting married")
  const samplePhotoUrl = `${import.meta.env.BASE_URL}images/design-lab/sample-wedding-hero.jpg`
  const designLabUrl = `${import.meta.env.BASE_URL}design-lab/`

  useEffect(() => {
    document.title = 'Brush Font Lab — Wedding Design Lab'
    window.scrollTo(0, 0)
  }, [])

  return (
    <main className="brush-font-lab">
      <header className="brush-lab-header">
        <a href={designLabUrl} className="brush-lab-back">
          <span aria-hidden="true">←</span>
          Design Lab
        </a>
        <span>TYPE STUDY · 01—06</span>
      </header>

      <section className="brush-lab-intro" aria-labelledby="brush-lab-title">
        <p>BRUSH LETTERING STUDY</p>
        <h1 id="brush-lab-title">
          같은 문장,
          <br />
          다른 붓의 온도.
        </h1>
        <div>
          <p>
            동일한 사진·크기·노란색으로 비교합니다. 글자를 직접 바꾸면 실제
            이름이나 문구가 각 폰트에서 어떻게 보이는지 확인할 수 있어요.
          </p>
          <label htmlFor="brush-preview-text">비교 문구</label>
          <input
            id="brush-preview-text"
            value={previewText}
            maxLength={42}
            onChange={(event) => setPreviewText(event.target.value)}
            placeholder="We're getting married"
          />
        </div>
      </section>

      <section className="reference-fonts" aria-labelledby="reference-font-title">
        <div className="reference-font-heading">
          <p>YOURSLETTER SAMPLE 02</p>
          <h2 id="reference-font-title">샘플에서 확인한 두 레터링</h2>
        </div>
        <article>
          <span>01 · INTRO NAMES</span>
          <strong>Custom event lettering</strong>
          <p>
            첫 사진의 이름은 일반 폰트가 아니라 손글씨를 윤곽선으로 만든 맞춤
            SVG입니다. 같은 모양의 재사용 가능한 폰트 파일은 없습니다.
          </p>
          <small>맞춤 제작 필요 · FONT FILE 없음</small>
        </article>
        <article>
          <span>02 · COVER TITLE</span>
          <strong>Black Rush</strong>
          <p>
            다음 사진의 “Wedding Invitation”은 Black Rush 브러시체를 SVG로
            변환해 재생합니다. 데모 폰트는 개인용이며 공개 저장소 탑재 전 별도
            라이선스 확인이 필요합니다.
          </p>
          <a
            href="https://www.dafont.com/blackrush.font"
            target="_blank"
            rel="noreferrer"
          >
            폰트 정보 보기 ↗
          </a>
        </article>
      </section>

      <section className="brush-font-grid" aria-label="공개 브러시 폰트 비교">
        {brushFonts.map((font) => (
          <article className="brush-font-card" key={font.id}>
            <div className="brush-font-meta">
              <div>
                <span>{font.label}</span>
                <h2>{font.name}</h2>
              </div>
              {font.current && <strong>현재 적용</strong>}
            </div>
            <div className="brush-font-stage">
              <img src={samplePhotoUrl} alt="" />
              <div aria-hidden="true" />
              <p className={`brush-sample brush-sample-${font.id}`}>
                {previewText || "We're getting married"}
              </p>
              <small>MINJUN · SEOYEON</small>
            </div>
            <div className="brush-font-copy">
              <p>{font.texture}</p>
              <dl>
                <div>
                  <dt>MOOD</dt>
                  <dd>{font.mood}</dd>
                </div>
                <div>
                  <dt>LICENSE</dt>
                  <dd>{font.license}</dd>
                </div>
              </dl>
              <a href={font.source} target="_blank" rel="noreferrer">
                Google Fonts에서 보기 ↗
              </a>
            </div>
          </article>
        ))}
      </section>

      <footer className="brush-lab-footer">
        <p>
          공개 폰트는 각각의 라이선스 파일과 함께 저장소에 보관했습니다.
          최종안에서는 선택한 폰트만 남겨 초기 로딩을 가볍게 만들 예정입니다.
        </p>
        <a href={designLabUrl}>전체 디자인으로 돌아가기 →</a>
      </footer>
    </main>
  )
}

export default BrushFontLab
