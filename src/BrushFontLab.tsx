import { useEffect } from 'react'
import './BrushFontLab.css'

type BrushFont = {
  id: string
  name: string
  label: string
  texture: string
  mood: string
  license: string
  source: string
  rank: string
  reference?: boolean
}

const brushFonts: BrushFont[] = [
  {
    id: 'black-rush',
    name: 'Black Rush',
    label: '기준 레터링',
    texture: '길게 연결되는 획, 큰 대문자, 마른 붓의 갈라짐이 모두 살아 있는 현재 기준점입니다.',
    mood: '대담함 · 로맨틱 · 러프',
    license: 'PERSONAL USE · SVG ONLY',
    source: 'https://www.dafont.com/blackrush.font',
    rank: 'REFERENCE',
    reference: true,
  },
  {
    id: 'selima',
    name: 'Selima',
    label: '가장 가까운 무료 후보',
    texture: 'Black Rush보다 가볍지만 빠른 연결 획과 자연스러운 잉크 번짐의 균형이 가장 비슷합니다.',
    mood: '자유로움 · 감성적 · 유연함',
    license: '100% FREE · SVG PREVIEW',
    source: 'https://www.dafont.com/selima.font',
    rank: 'CLOSE 01',
  },
  {
    id: 'brusher',
    name: 'Brusher',
    label: '굵은 연결 브러시',
    texture: '거친 입자는 적지만 획의 압력과 연결감이 강합니다. 사진 위에서도 글자가 흐려지지 않습니다.',
    mood: '볼드 · 현대적 · 선명함',
    license: '100% FREE · SVG PREVIEW',
    source: 'https://www.dafont.com/brusher.font',
    rank: 'CLOSE 02',
  },
  {
    id: 'dry-brush',
    name: 'Dry Brush',
    label: '질감이 가장 거친 후보',
    texture: '갈라진 붓털과 긁힌 가장자리가 가장 강합니다. 연결감보다 실제 페인트 질감을 우선할 때 좋습니다.',
    mood: '거침 · 시네마틱 · 강한 대비',
    license: 'PERSONAL USE · SVG ONLY',
    source: 'https://www.dafont.com/dry-brush.font',
    rank: 'TEXTURE 01',
  },
  {
    id: 'bretageds',
    name: 'Bretageds',
    label: '날렵한 러프 스크립트',
    texture: '긴 사선과 불규칙한 끝 획이 살아 있어 Black Rush의 속도감에 가까운 인상을 줍니다.',
    mood: '날렵함 · 패션 · 드라마틱',
    license: 'PERSONAL USE · SVG ONLY',
    source: 'https://www.dafont.com/bretageds.font',
    rank: 'FLOW 01',
  },
  {
    id: 'rough-brush-script',
    name: 'Rough Brush Script',
    label: '손으로 칠한 듯한 후보',
    texture: '글자마다 붓 압력이 크게 달라집니다. 정제되지 않은 손맛은 좋지만 Black Rush보다 장식성이 낮습니다.',
    mood: '핸드메이드 · 소박함 · 빈티지',
    license: '100% FREE · SVG PREVIEW',
    source: 'https://www.dafont.com/rough-brush-script.font',
    rank: 'TEXTURE 02',
  },
]

function BrushFontLab() {
  const designLabUrl = `${import.meta.env.BASE_URL}design-lab/`
  const letteringUrl = (fontId: string, line: 'were-getting' | 'married') =>
    `${import.meta.env.BASE_URL}images/design-lab/lettering/${fontId}-${line}.svg`
  const samplePhotoUrl = `${import.meta.env.BASE_URL}images/design-lab/sample-wedding-hero.jpg`

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
        <p>ROUGH BRUSH LETTERING STUDY</p>
        <h1 id="brush-lab-title">
          Black Rush와
          <br />
          정말 가까운 붓만.
        </h1>
        <div>
          <p>
            기존 후보는 모두 제외했습니다. 이번에는 연결된 굵은 획과 거친 잉크
            자국을 함께 가진 서체만, 같은 사진과 같은 문장으로 비교합니다.
          </p>
          <strong>WE'RE GETTING MARRIED</strong>
          <span>폰트 파일 대신 윤곽선 SVG만 사용한 고정 문구입니다.</span>
        </div>
      </section>

      <section className="reference-fonts" aria-labelledby="reference-font-title">
        <div className="reference-font-heading">
          <p>SELECTION RULE</p>
          <h2 id="reference-font-title">이번 후보의 기준</h2>
        </div>
        <article>
          <span>01 · FORM</span>
          <strong>Connected &amp; bold</strong>
          <p>가느다란 사인펜 필기체는 제외하고, 단어 전체가 한 붓처럼 흐르는 굵은 스크립트만 남겼습니다.</p>
        </article>
        <article>
          <span>02 · TEXTURE</span>
          <strong>Dry ink, not clean</strong>
          <p>매끈한 벡터 가장자리보다 붓털의 갈라짐과 비어 있는 잉크 자국이 보이는 후보를 우선했습니다.</p>
        </article>
      </section>

      <section className="brush-font-grid" aria-label="Black Rush와 유사 브러시 폰트 비교">
        {brushFonts.map((font) => (
          <article className="brush-font-card" key={font.id} data-reference={font.reference}>
            <div className="brush-font-meta">
              <div>
                <span>{font.label}</span>
                <h2>{font.name}</h2>
              </div>
              <strong>{font.rank}</strong>
            </div>
            <div className="brush-font-stage">
              <img className="brush-stage-photo" src={samplePhotoUrl} alt="" />
              <div className="brush-stage-shade" aria-hidden="true" />
              <div className="brush-svg-sample" aria-label={`We're getting married — ${font.name}`}>
                <img src={letteringUrl(font.id, 'were-getting')} alt="" />
                <img src={letteringUrl(font.id, 'married')} alt="" />
              </div>
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
                  <dt>USE</dt>
                  <dd>{font.license}</dd>
                </div>
              </dl>
              <a href={font.source} target="_blank" rel="noreferrer">
                출처와 라이선스 보기 ↗
              </a>
            </div>
          </article>
        ))}
      </section>

      <footer className="brush-lab-footer">
        <p>
          이 화면에는 폰트 원본 파일이 없습니다. 각 문구를 윤곽선 SVG로 변환했고,
          개인용 후보는 이 청첩장 시안 외의 용도로 재사용하지 않습니다.
        </p>
        <a href={designLabUrl}>전체 디자인으로 돌아가기 →</a>
      </footer>
    </main>
  )
}

export default BrushFontLab
