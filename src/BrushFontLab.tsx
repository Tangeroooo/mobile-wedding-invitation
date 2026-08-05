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
    id: 'bretageds',
    name: 'Bretageds',
    label: '기존 후보 중 유일하게 유지',
    texture: '긴 사선과 불규칙한 끝 획이 살아 있어 Black Rush의 속도감에 가까운 인상을 줍니다.',
    mood: '날렵함 · 패션 · 드라마틱',
    license: 'PERSONAL USE · SVG ONLY',
    source: 'https://www.dafont.com/bretageds.font',
    rank: 'CLOSE 01',
  },
  {
    id: 'hey-august',
    name: 'Hey August',
    label: '사용자 선택 후보',
    texture: '큼직한 대문자와 빠르게 뻗는 연결 획이 강합니다. Black Rush의 자유로운 속도감과 비교하기 좋은 후보입니다.',
    mood: '활기 · 러프 · 캐주얼',
    license: '100% FREE · SVG PREVIEW',
    source: 'https://www.dafont.com/hey-august.font',
    rank: 'PICK 01',
  },
  {
    id: 'hey-october',
    name: 'Hey October',
    label: '사용자 선택 후보',
    texture: 'Hey August보다 획의 높이 차와 기울기가 커서 더 즉흥적으로 쓴 듯한 인상을 줍니다.',
    mood: '즉흥적 · 자유로움 · 거침',
    license: '100% FREE · SVG PREVIEW',
    source: 'https://www.dafont.com/hey-october.font',
    rank: 'PICK 02',
  },
  {
    id: 'smithen-script',
    name: 'Smithen Script',
    label: '사용자 선택 후보',
    texture: '붓을 눌렀다 빠르게 떼는 굵기 변화가 크고, 단어 실루엣이 단단하게 모이는 스크립트입니다.',
    mood: '단단함 · 빈티지 · 핸드메이드',
    license: '100% FREE · SVG PREVIEW',
    source: 'https://www.dafont.com/smithen-script.font',
    rank: 'PICK 03',
  },
  {
    id: 'james-stroker',
    name: 'James Stroker',
    label: '사용자 선택 후보',
    texture: '세로 획은 길고 가장자리는 거칠어 Black Rush보다 더 날카롭고 포스터 같은 분위기를 만듭니다.',
    mood: '날카로움 · 포스터 · 드라마틱',
    license: '100% FREE · SVG PREVIEW',
    source: 'https://www.dafont.com/james-stroker.font',
    rank: 'PICK 04',
  },
  {
    id: 'great-sejagad',
    name: 'Great Sejagad',
    label: '사용자 선택 후보',
    texture: '가늘고 굵은 획의 대비와 길게 휘는 끝 획이 함께 살아 있어 로맨틱한 러프함이 강합니다.',
    mood: '로맨틱 · 유연함 · 다이내믹',
    license: '100% FREE · SVG PREVIEW',
    source: 'https://www.dafont.com/great-sejagad.font',
    rank: 'PICK 05',
  },
  {
    id: 'darty-zhedant',
    name: 'Darty Zhedant',
    label: '사용자 선택 후보',
    texture: '좁고 긴 글자와 마른 붓 끝이 특징입니다. 화면을 가로지르는 긴 문구에 속도감을 더합니다.',
    mood: '슬림 · 빠름 · 거친 잉크',
    license: '100% FREE · SVG PREVIEW',
    source: 'https://www.dafont.com/darty-zhedant.font',
    rank: 'PICK 06',
  },
  {
    id: 'all-pony',
    name: 'All Pony',
    label: '사용자 선택 후보',
    texture: '가볍게 튀는 획과 불규칙한 베이스라인이 있어 정제된 캘리그라피보다 손글씨 쪽에 가깝습니다.',
    mood: '경쾌함 · 자유로움 · 캐주얼',
    license: '100% FREE · SVG PREVIEW',
    source: 'https://www.dafont.com/all-pony.font',
    rank: 'PICK 07',
  },
  {
    id: 'wintersoul',
    name: 'Wintersoul',
    label: '사용자 선택 후보',
    texture: '거친 가장자리를 유지하면서도 글자 연결이 안정적입니다. 러프함과 가독성 사이의 후보입니다.',
    mood: '따뜻함 · 안정감 · 내추럴',
    license: '100% FREE · SVG PREVIEW',
    source: 'https://www.dafont.com/wintersoul.font',
    rank: 'PICK 08',
  },
  {
    id: 'hotel-lorint',
    name: 'Hotel Lorint',
    label: '사용자 선택 후보',
    texture: '붓의 시작과 끝이 분명하고 획 사이 여백이 넓어, 사진을 덜 가리면서도 손맛을 남깁니다.',
    mood: '여유 · 빈티지 · 내추럴',
    license: '100% FREE · SVG PREVIEW',
    source: 'https://www.dafont.com/hotel-lorint.font',
    rank: 'PICK 09',
  },
  {
    id: 'passengers-script',
    name: 'Passengers Script',
    label: '사용자 선택 후보',
    texture: '큰 루프와 길게 뻗는 스와시가 있어 두 줄 레터링을 하나의 제스처처럼 묶어 줍니다.',
    mood: '여행 · 자유로움 · 서정적',
    license: '100% FREE · SVG PREVIEW',
    source: 'https://www.dafont.com/passengers-script.font',
    rank: 'PICK 10',
  },
  {
    id: 'a-buster-down',
    name: 'A Buster Down',
    label: '사용자 선택 후보',
    texture: '빠르게 긁어 쓴 듯한 끝 획과 들쭉날쭉한 리듬이 강해 가장 즉흥적인 후보 중 하나입니다.',
    mood: '즉흥적 · 스트리트 · 대담함',
    license: '100% FREE · SVG PREVIEW',
    source: 'https://www.dafont.com/a-buster-down.font',
    rank: 'PICK 11',
  },
  {
    id: 'dolato-de-stato',
    name: 'Dolato de Stato',
    label: '사용자 선택 후보',
    texture: '두꺼운 붓 압력과 마른 잉크 틈이 공존해, 어두운 사진 위에서도 질감이 또렷하게 남습니다.',
    mood: '볼드 · 질감 · 시네마틱',
    license: '100% FREE · SVG PREVIEW',
    source: 'https://www.dafont.com/dolato-de-stato.font',
    rank: 'PICK 12',
  },
  {
    id: 'rampage-kid',
    name: 'Rampage Kid',
    label: '사용자 선택 후보',
    texture: '짧고 거친 붓자국이 겹쳐 보여 캘리그라피보다 직접 칠한 레터링에 가까운 인상을 줍니다.',
    mood: '거침 · 젊음 · 에너지',
    license: '100% FREE · SVG PREVIEW',
    source: 'https://www.dafont.com/rampage-kid.font',
    rank: 'PICK 13',
  },
  {
    id: 'tony-bhages',
    name: 'Tony Bhages',
    label: '사용자 선택 후보',
    texture: '폭이 넓은 글자와 뚜렷한 붓 결로 한 단어가 크게 보입니다. 메인 카피에 힘을 주기 좋습니다.',
    mood: '대담함 · 러프 · 포스터',
    license: '100% FREE · SVG PREVIEW',
    source: 'https://www.dafont.com/tony-bhages.font',
    rank: 'PICK 14',
  },
  {
    id: 'loving-memories',
    name: 'Loving Memories',
    label: '사용자 선택 후보',
    texture: '길게 이어지는 가는 획과 거친 굵은 획의 대비가 커서 가장 드라마틱한 실루엣을 만듭니다.',
    mood: '드라마틱 · 감성적 · 와이드',
    license: '100% FREE · SVG PREVIEW',
    source: 'https://www.dafont.com/loving-memories.font',
    rank: 'PICK 15',
  },
  {
    id: 'mybread',
    name: 'Mybread',
    label: '사용자 선택 후보',
    texture: '눌러 쓴 듯한 굵은 몸통과 마른 끝부분이 대비됩니다. 친근하지만 충분히 거친 후보입니다.',
    mood: '친근함 · 굵음 · 핸드메이드',
    license: '100% FREE · SVG PREVIEW',
    source: 'https://www.dafont.com/mybread.font',
    rank: 'PICK 16',
  },
  {
    id: 'bhineka',
    name: 'Bhineka',
    label: '사용자 선택 후보',
    texture: '수평으로 길게 흐르는 획과 낮은 글자 높이가 특징이라, 풀블리드 사진의 폭을 강조합니다.',
    mood: '와이드 · 여유 · 현대적',
    license: '100% FREE · SVG PREVIEW',
    source: 'https://www.dafont.com/bhineka-2.font',
    rank: 'PICK 17',
  },
  {
    id: 'wandertucker',
    name: 'Wandertucker',
    label: '사용자 선택 후보',
    texture: '기울어진 연결 획과 거친 끝 처리가 균형을 이뤄, Black Rush보다 차분한 대안으로 볼 수 있습니다.',
    mood: '빈티지 · 여행 · 차분함',
    license: '100% FREE · SVG PREVIEW',
    source: 'https://www.dafont.com/wandertucker.font',
    rank: 'PICK 18',
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
        <span>TYPE STUDY · 01—20</span>
      </header>

      <section className="brush-lab-intro" aria-labelledby="brush-lab-title">
        <p>ROUGH BRUSH LETTERING STUDY</p>
        <h1 id="brush-lab-title">
          Black Rush 옆에
          <br />
          19개의 붓을 놓다.
        </h1>
        <div>
          <p>
            기존 후보 중 Bretageds만 남기고, 직접 골라 주신 무료 후보 18종을
            추가했습니다. 같은 사진과 같은 크기의 문장으로 바로 비교합니다.
          </p>
          <strong>WE'RE GETTING MARRIED</strong>
          <span>원본 폰트 파일 없이 윤곽선 SVG만 사용한 고정 문구입니다.</span>
        </div>
      </section>

      <section className="reference-fonts" aria-labelledby="reference-font-title">
        <div className="reference-font-heading">
          <p>SELECTION RULE</p>
          <h2 id="reference-font-title">이번 후보의 기준</h2>
        </div>
        <article>
          <span>01 · FORM</span>
          <strong>Same scene, same line</strong>
          <p>색, 사진, 문장, 배치를 모두 고정해 서체의 획과 실루엣 차이만 보이도록 했습니다.</p>
        </article>
        <article>
          <span>02 · LICENSE</span>
          <strong>Checked per font</strong>
          <p>DaFont 페이지 표기를 기준으로 100% 무료와 개인용 무료를 카드마다 구분했습니다.</p>
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
