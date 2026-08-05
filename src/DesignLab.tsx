import { useEffect, useState } from 'react'
import './DesignLab.css'
import BrushFontLab from './BrushFontLab'
import FullInvitation from './FullInvitation'

type Mood = 'all' | 'warm' | 'modern'

type Concept = {
  id: string
  number: string
  name: string
  koreanName: string
  mood: Exclude<Mood, 'all'>
  description: string
  keywords: string[]
}

const concepts: Concept[] = [
  {
    id: 'linen-letter',
    number: '01',
    name: 'Linen Letter',
    koreanName: '리넨 레터',
    mood: 'warm',
    description: '종이 청첩장의 온도를 화면에 옮긴 차분한 명조 중심 디자인',
    keywords: ['종이 질감', '명조', '로즈 베이지'],
  },
  {
    id: 'soft-film',
    number: '02',
    name: 'Soft Film',
    koreanName: '소프트 필름',
    mood: 'warm',
    description: '사진의 여백과 필름 프레임으로 이야기를 천천히 보여주는 구성',
    keywords: ['필름', '포토 스토리', '크림'],
  },
  {
    id: 'garden-note',
    number: '03',
    name: 'Garden Note',
    koreanName: '가든 노트',
    mood: 'warm',
    description: '세이지 컬러와 가는 식물 선으로 담백하게 표현한 내추럴 무드',
    keywords: ['보태니컬', '세이지', '자연스러움'],
  },
  {
    id: 'quiet-ivory',
    number: '04',
    name: 'Quiet Ivory',
    koreanName: '콰이어트 아이보리',
    mood: 'modern',
    description: '넓은 여백과 섬세한 선으로 완성하는 절제된 클래식 미니멀',
    keywords: ['미니멀', '아이보리', '타이포'],
  },
  {
    id: 'gallery-white',
    number: '05',
    name: 'Gallery White',
    koreanName: '갤러리 화이트',
    mood: 'modern',
    description: '사진을 작품처럼 배치하고 날짜를 그래픽 요소로 쓰는 갤러리형',
    keywords: ['갤러리', '그리드', '큰 날짜'],
  },
  {
    id: 'editorial-noir',
    number: '06',
    name: 'Editorial Noir',
    koreanName: '에디토리얼 누아르',
    mood: 'modern',
    description: '강한 대비와 대담한 활자로 만드는 패션 매거진 스타일',
    keywords: ['고대비', '매거진', '모노크롬'],
  },
  {
    id: 'full-bleed-vow',
    number: '07',
    name: 'Full Bleed Vow',
    koreanName: '풀블리드 바우',
    mood: 'warm',
    description: '입장 순간부터 세로 사진이 화면을 가득 채우는 몰입형 커버',
    keywords: ['풀스크린 사진', '화이트 레터링', '시네마틱'],
  },
  {
    id: 'glasshouse',
    number: '08',
    name: 'Glasshouse',
    koreanName: '글래스하우스',
    mood: 'modern',
    description: '사진 위 반투명 카드에 이름과 예식 정보를 정돈한 현대적 구성',
    keywords: ['풀스크린 사진', '글래스 UI', '레이어'],
  },
  {
    id: 'oval-nocturne',
    number: '09',
    name: 'Oval Nocturne',
    koreanName: '오벌 녹턴',
    mood: 'modern',
    description: '어두운 사진과 타원 프레임, 큰 제목을 조합한 극적인 커버',
    keywords: ['오벌 프레임', '저채도 사진', '드라마틱'],
  },
  {
    id: 'paper-collage',
    number: '10',
    name: 'Paper Collage',
    koreanName: '페이퍼 콜라주',
    mood: 'warm',
    description: '사진을 오려 붙인 듯한 레이어와 손글씨 감성을 담은 구성',
    keywords: ['콜라주', '폴라로이드', '손글씨'],
  },
  {
    id: 'moonlit-hanji',
    number: '11',
    name: 'Moonlit Hanji',
    koreanName: '달빛 한지',
    mood: 'warm',
    description: '현대 수묵 일러스트와 한지 여백으로 완성하는 보존형 청첩장',
    keywords: ['수묵 일러스트', '한지', '아카이브'],
  },
  {
    id: 'two-chapters',
    number: '12',
    name: 'Two Chapters',
    koreanName: '두 개의 장면',
    mood: 'modern',
    description: 'Day의 따뜻함과 Night의 모던함을 직접 전환하는 이중 테마',
    keywords: ['테마 전환', 'Day & Night', '인터랙션'],
  },
  {
    id: 'golden-hour-bleed',
    number: '13',
    name: 'Golden Hour Bleed',
    koreanName: '골든아워 블리드',
    mood: 'warm',
    description: '노을빛 사진을 여백 없이 펼치고 작은 캡션만 남긴 감성 커버',
    keywords: ['풀블리드', '골든아워', '감성 사진'],
  },
  {
    id: 'cinema-still',
    number: '14',
    name: 'Cinema Still',
    koreanName: '시네마 스틸',
    mood: 'modern',
    description: '영화의 한 장면처럼 넓은 사진과 자막형 정보를 배치한 구성',
    keywords: ['시네마스코프', '필름 자막', '블랙'],
  },
  {
    id: 'cover-story',
    number: '15',
    name: 'Cover Story',
    koreanName: '커버 스토리',
    mood: 'modern',
    description: '인물 사진 위에 대담한 제호와 커버라인을 얹은 매거진 스타일',
    keywords: ['매거진 커버', '대형 타이포', '에디토리얼'],
  },
  {
    id: 'ivory-diptych',
    number: '16',
    name: 'Ivory Diptych',
    koreanName: '아이보리 딥틱',
    mood: 'warm',
    description: '서로 다른 두 사진 장면을 한 화면에 이어 붙이는 포토 딥틱',
    keywords: ['2분할 사진', '아이보리', '포트레이트'],
  },
  {
    id: 'coming-warm-expanded',
    number: '17',
    name: 'Coming Warm Expanded',
    koreanName: '커밍 웜 익스팬디드',
    mood: 'warm',
    description: '현재 Coming Soon의 아치와 식물선을 전체 청첩장으로 확장한 시안',
    keywords: ['Coming Soon 연계', '아치 카드', '로즈 베이지'],
  },
  {
    id: 'coming-modern-expanded',
    number: '18',
    name: 'Coming Modern Expanded',
    koreanName: '커밍 모던 익스팬디드',
    mood: 'modern',
    description: '현재 Coming Soon의 직선 프레임과 격자를 이어가는 모던 시안',
    keywords: ['Coming Soon 연계', '직선 프레임', '모노톤'],
  },
  {
    id: 'porcelain-orbit',
    number: '19',
    name: 'Porcelain Orbit',
    koreanName: '포슬린 오빗',
    mood: 'modern',
    description: '백자빛 여백과 코발트 원형 프레임을 중심으로 구성한 청량한 시안',
    keywords: ['원형 포트레이트', '코발트', '슬로 페이드'],
  },
  {
    id: 'citrus-poster',
    number: '20',
    name: 'Citrus Poster',
    koreanName: '시트러스 포스터',
    mood: 'modern',
    description: '버터 옐로와 코발트 도형, 대형 활자를 조합한 그래픽 포스터형',
    keywords: ['컬러 블록', '볼드 타이포', '사이드 슬라이드'],
  },
  {
    id: 'terracotta-reel',
    number: '21',
    name: 'Terracotta Reel',
    koreanName: '테라코타 릴',
    mood: 'warm',
    description: '클레이와 플럼 컬러 위에 사진을 영화 필름처럼 이어가는 구성',
    keywords: ['필름 스트립', '테라코타', '마스크 리빌'],
  },
  {
    id: 'lavender-glass',
    number: '22',
    name: 'Lavender Glass',
    koreanName: '라벤더 글래스',
    mood: 'warm',
    description: '라벤더 안개와 모스 그린, 반투명 패널이 겹쳐지는 몽환적 시안',
    keywords: ['글래스 패널', '라벤더', '블러 리빌'],
  },
  {
    id: 'rose-ink-bleed',
    number: '23',
    name: 'Rose Ink Bleed',
    koreanName: '로즈 잉크 블리드',
    mood: 'warm',
    description: '풀블리드 사진 위로 로즈빛 캘리그라피가 한 획씩 쓰이는 감성 커버',
    keywords: ['필기 애니메이션', '풀스크린 사진', '로즈 잉크'],
  },
  {
    id: 'letter-prelude',
    number: '24',
    name: 'Letter Prelude',
    koreanName: '레터 프렐류드',
    mood: 'warm',
    description: '첫 사진의 손글씨 인트로가 사라지며 두 번째 커버로 이어지는 2단 입장 구성',
    keywords: ['사진 전환', '손글씨 인트로', '스킵 가능'],
  },
]

const filterOptions: Array<{ id: Mood; label: string }> = [
  { id: 'all', label: '전체' },
  { id: 'warm', label: 'Warm' },
  { id: 'modern', label: 'Modern' },
]

const selectionStorageKey = 'wedding-design-lab-selection'

function readSavedSelection() {
  try {
    const saved = window.localStorage.getItem(selectionStorageKey)
    const parsed: unknown = saved ? JSON.parse(saved) : []

    return Array.isArray(parsed)
      ? parsed.filter((item): item is string => typeof item === 'string').slice(0, 3)
      : []
  } catch {
    return []
  }
}

function DesignLab() {
  const [filter, setFilter] = useState<Mood>('all')
  const [selected, setSelected] = useState<string[]>(readSavedSelection)
  const searchParams = new URLSearchParams(window.location.search)
  const activeConcept = concepts.find(
    (concept) => concept.id === searchParams.get('concept'),
  )

  useEffect(() => {
    try {
      window.localStorage.setItem(selectionStorageKey, JSON.stringify(selected))
    } catch {
      // The lab still works when browser storage is unavailable.
    }
  }, [selected])

  if (activeConcept) {
    return <FullInvitation concept={activeConcept} concepts={concepts} />
  }

  if (searchParams.get('view') === 'brush-fonts') {
    return <BrushFontLab />
  }

  const visibleConcepts =
    filter === 'all'
      ? concepts
      : concepts.filter((concept) => concept.mood === filter)

  const toggleSelection = (id: string) => {
    setSelected((current) => {
      if (current.includes(id)) {
        return current.filter((selectedId) => selectedId !== id)
      }

      if (current.length >= 3) {
        return current
      }

      return [...current, id]
    })
  }

  return (
    <main className="design-lab">
      <header className="lab-header">
        <a className="back-link" href={import.meta.env.BASE_URL}>
          <span aria-hidden="true">←</span>
          Coming Soon
        </a>
        <div className="lab-header-actions">
          <a href={`${import.meta.env.BASE_URL}design-lab/?view=brush-fonts`}>
            FONT LAB
          </a>
          <span className="lab-edition">
            DESIGN STUDY · 01—{String(concepts.length).padStart(2, '0')}
          </span>
        </div>
      </header>

      <section className="lab-intro" aria-labelledby="lab-title">
        <p className="lab-kicker">MOBILE WEDDING INVITATION</p>
        <h1 id="lab-title">
          Design
          <br />
          Lab
        </h1>
        <div className="intro-copy">
          <p>
            따뜻함과 모던함 사이,
            <br />
            우리에게 맞는 분위기를 찾는 중입니다.
          </p>
          <span>아래 이름과 날짜는 레이아웃 비교용 임시 문구입니다.</span>
        </div>
      </section>

      <a
        className="brush-lab-banner"
        href={`${import.meta.env.BASE_URL}design-lab/?view=brush-fonts`}
      >
        <span>NEW · TYPE STUDY</span>
        <strong>Black Rush와 가장 가까운 브러시 레터링 6종 비교하기</strong>
        <i aria-hidden="true">→</i>
      </a>

      <aside className="lab-asset-note" aria-label="디자인 시안 이미지 출처">
        <span>IMAGE NOTE</span>
        <p>
          시안 속 인물 사진과 한지 일러스트는 참고한 청첩장 사이트에서 가져온
          이미지가 아니라, 이 디자인 랩을 위해 생성한 임시 AI 이미지입니다.
          최종안에서는 두 분의 사진 또는 직접 제작한 일러스트로 교체합니다.
        </p>
      </aside>

      <section className="lab-toolbar" aria-label="디자인 필터와 선택 현황">
        <div className="filter-group" role="group" aria-label="분위기 필터">
          {filterOptions.map((option) => (
            <button
              key={option.id}
              type="button"
              aria-pressed={filter === option.id}
              onClick={() => setFilter(option.id)}
            >
              {option.label}
            </button>
          ))}
        </div>
        <p>
          관심 디자인 <strong>{selected.length}</strong> / 3
        </p>
      </section>

      <section className="concept-grid" aria-label="디자인 시안">
        {visibleConcepts.map((concept) => {
          const isSelected = selected.includes(concept.id)
          const selectionDisabled = selected.length >= 3 && !isSelected

          return (
            <article
              key={concept.id}
              className="concept-card"
              data-selected={isSelected}
            >
              <div className="concept-meta">
                <div>
                  <span className="concept-number">{concept.number}</span>
                  <span className={`mood-chip mood-${concept.mood}`}>
                    {concept.mood}
                  </span>
                </div>
                <button
                  className="select-button"
                  type="button"
                  aria-pressed={isSelected}
                  disabled={selectionDisabled}
                  onClick={() => toggleSelection(concept.id)}
                >
                  {isSelected ? '선택됨' : selectionDisabled ? '최대 3개' : '후보 선택'}
                </button>
              </div>

              <ConceptPreview conceptId={concept.id} />

              <div className="concept-copy">
                <div>
                  <p>{concept.name}</p>
                  <h2>{concept.koreanName}</h2>
                </div>
                <p>{concept.description}</p>
                <ul aria-label={`${concept.koreanName} 특징`}>
                  {concept.keywords.map((keyword) => (
                    <li key={keyword}>{keyword}</li>
                  ))}
                </ul>
                <a
                  className="open-concept"
                  href={`${import.meta.env.BASE_URL}design-lab/?concept=${concept.id}`}
                  target="_blank"
                  rel="noreferrer"
                >
                  전체 구성 보기
                  <span aria-hidden="true">↗</span>
                </a>
              </div>
            </article>
          )
        })}
      </section>

      <section className="lab-notes">
        <p className="lab-kicker">HOW TO CHOOSE</p>
        <h2>레이아웃을 먼저, 색감은 나중에.</h2>
        <p>
          각 카드의 ‘전체 구성 보기’를 누르면 첫 화면부터 참석 응답까지 같은
          내용으로 비교할 수 있습니다. 마음에 드는 시안을 최대 3개 선택하면 이
          기기에 저장됩니다. 이후 선택한 시안의 장점을 합쳐 최종안을 만듭니다.
        </p>
      </section>

      {selected.length > 0 && (
        <aside className="selection-dock" aria-label="선택한 디자인">
          <div>
            <span>SHORTLIST</span>
            <strong>
              {selected
                .map((id) => concepts.find((concept) => concept.id === id)?.number)
                .join(' · ')}
            </strong>
          </div>
          <button type="button" onClick={() => setSelected([])}>
            선택 초기화
          </button>
        </aside>
      )}
    </main>
  )
}

function ConceptPreview({ conceptId }: { conceptId: string }) {
  const samplePhotoUrl = `${import.meta.env.BASE_URL}images/design-lab/sample-wedding-hero.jpg`
  const moonlitHanjiUrl = `${import.meta.env.BASE_URL}images/design-lab/sample-moonlit-hanji.jpg`
  const blackRushLetteringUrl = (line: string) =>
    `${import.meta.env.BASE_URL}images/design-lab/lettering/black-rush-${line}.svg`

  if (conceptId === 'linen-letter') {
    return (
      <div className="concept-preview preview-linen" aria-label="리넨 레터 미리보기">
        <div className="linen-orbit" aria-hidden="true" />
        <span className="preview-label">OUR WEDDING DAY</span>
        <div className="linen-names">
          <strong>민준</strong>
          <i>&amp;</i>
          <strong>서연</strong>
        </div>
        <p>오월의 따뜻한 날, 저희 두 사람 결혼합니다.</p>
        <time>2027 · 05 · 15</time>
      </div>
    )
  }

  if (conceptId === 'soft-film') {
    return (
      <div className="concept-preview preview-film" aria-label="소프트 필름 미리보기">
        <span className="film-title">We are getting married</span>
        <div className="film-photo photo-one">
          <span>PHOTO 01</span>
        </div>
        <div className="film-photo photo-two">
          <span>PHOTO 02</span>
        </div>
        <div className="film-caption">
          <strong>M &amp; S</strong>
          <time>MAY 15, 2027</time>
        </div>
      </div>
    )
  }

  if (conceptId === 'garden-note') {
    return (
      <div className="concept-preview preview-garden" aria-label="가든 노트 미리보기">
        <div className="garden-stem" aria-hidden="true">
          <i />
          <i />
          <i />
        </div>
        <p className="garden-date">05 · 15 · 2027</p>
        <div>
          <span>THE MARRIAGE OF</span>
          <strong>민준과 서연</strong>
          <p>서로의 계절이 되어 함께 걷겠습니다.</p>
        </div>
      </div>
    )
  }

  if (conceptId === 'quiet-ivory') {
    return (
      <div className="concept-preview preview-ivory" aria-label="콰이어트 아이보리 미리보기">
        <span className="ivory-top">INVITATION</span>
        <div className="ivory-monogram">M/S</div>
        <div className="ivory-rule" />
        <strong>민준 · 서연</strong>
        <p>
          SATURDAY
          <br />
          MAY 15, 2027
        </p>
      </div>
    )
  }

  if (conceptId === 'gallery-white') {
    return (
      <div className="concept-preview preview-gallery" aria-label="갤러리 화이트 미리보기">
        <div className="gallery-date">
          <strong>15</strong>
          <span>MAY<br />2027</span>
        </div>
        <div className="gallery-frame">
          <span>PORTRAIT</span>
        </div>
        <div className="gallery-names">
          <span>MINJUN</span>
          <i>×</i>
          <span>SEOYEON</span>
        </div>
      </div>
    )
  }

  if (conceptId === 'full-bleed-vow') {
    return (
      <div className="concept-preview preview-full-bleed" aria-label="풀블리드 바우 미리보기">
        <img src={samplePhotoUrl} alt="" />
        <div className="full-bleed-shade" aria-hidden="true" />
        <span className="full-bleed-top">OUR WEDDING DAY</span>
        <strong>
          민준
          <i>&amp;</i>
          서연
        </strong>
        <div className="full-bleed-bottom">
          <time>2027. 05. 15</time>
          <span>SEOUL</span>
        </div>
      </div>
    )
  }

  if (conceptId === 'glasshouse') {
    return (
      <div className="concept-preview preview-glasshouse" aria-label="글래스하우스 미리보기">
        <img src={samplePhotoUrl} alt="" />
        <div className="glass-card">
          <span>WE ARE GETTING MARRIED</span>
          <strong>M / S</strong>
          <p>민준 그리고 서연</p>
          <time>15 MAY 2027 · 1PM</time>
        </div>
      </div>
    )
  }

  if (conceptId === 'oval-nocturne') {
    return (
      <div className="concept-preview preview-oval" aria-label="오벌 녹턴 미리보기">
        <img src={samplePhotoUrl} alt="" />
        <div className="oval-frame" aria-hidden="true" />
        <strong>TWO OF US</strong>
        <p>민준 · 서연</p>
        <time>15 / 05 / 2027</time>
      </div>
    )
  }

  if (conceptId === 'paper-collage') {
    return (
      <div className="concept-preview preview-collage" aria-label="페이퍼 콜라주 미리보기">
        <span className="collage-date">MAY · 15 · 2027</span>
        <div className="collage-photo collage-photo-one">
          <img src={samplePhotoUrl} alt="" />
        </div>
        <div className="collage-photo collage-photo-two">
          <img src={samplePhotoUrl} alt="" />
        </div>
        <strong>결혼합니다</strong>
        <p>MINJUN &amp; SEOYEON</p>
      </div>
    )
  }

  if (conceptId === 'moonlit-hanji') {
    return (
      <div className="concept-preview preview-hanji" aria-label="달빛 한지 미리보기">
        <img src={moonlitHanjiUrl} alt="" />
        <span className="hanji-overline">두 사람의 혼례</span>
        <strong>
          민준
          <i>그리고</i>
          서연
        </strong>
        <div className="hanji-seal" aria-hidden="true">喜</div>
        <time>二〇二七 · 五月 · 十五日</time>
      </div>
    )
  }

  if (conceptId === 'two-chapters') {
    return (
      <div className="concept-preview preview-chapters" aria-label="두 개의 장면 미리보기">
        <img src={samplePhotoUrl} alt="" />
        <div className="chapter-half chapter-day">
          <span>DAY</span>
        </div>
        <div className="chapter-half chapter-night">
          <span>NIGHT</span>
        </div>
        <div className="chapter-toggle" aria-hidden="true">
          <i />
          <span>SWITCH THE MOOD</span>
        </div>
        <strong>M &amp; S</strong>
        <time>15 MAY 2027</time>
      </div>
    )
  }

  if (conceptId === 'golden-hour-bleed') {
    return (
      <div className="concept-preview preview-golden-bleed" aria-label="골든아워 블리드 미리보기">
        <img src={samplePhotoUrl} alt="" />
        <span className="golden-kicker">A DAY TO REMEMBER</span>
        <strong>
          민준
          <i>&amp;</i>
          서연
        </strong>
        <div className="golden-caption">
          <time>2027. 05. 15</time>
          <span>SEOUL · 1PM</span>
        </div>
      </div>
    )
  }

  if (conceptId === 'cinema-still') {
    return (
      <div className="concept-preview preview-cinema-still" aria-label="시네마 스틸 미리보기">
        <span className="cinema-frame">FRAME 0515 · TAKE 01</span>
        <div className="cinema-photo">
          <img src={samplePhotoUrl} alt="" />
        </div>
        <strong>OUR<br />FAVORITE<br />SCENE</strong>
        <div className="cinema-credit">
          <span>MINJUN × SEOYEON</span>
          <time>15 MAY 2027</time>
        </div>
      </div>
    )
  }

  if (conceptId === 'cover-story') {
    return (
      <div className="concept-preview preview-cover-story" aria-label="커버 스토리 미리보기">
        <img src={samplePhotoUrl} alt="" />
        <span className="cover-issue">THE WEDDING ISSUE · 2027</span>
        <strong className="cover-masthead">VOWS</strong>
        <div className="cover-lines">
          <span>THE NEW<br />CHAPTER</span>
          <p>민준 &amp; 서연</p>
        </div>
        <time>MAY 15 · SEOUL</time>
      </div>
    )
  }

  if (conceptId === 'ivory-diptych') {
    return (
      <div className="concept-preview preview-diptych" aria-label="아이보리 딥틱 미리보기">
        <div className="diptych-photo diptych-photo-left">
          <img src={samplePhotoUrl} alt="" />
        </div>
        <div className="diptych-photo diptych-photo-right">
          <img src={samplePhotoUrl} alt="" />
        </div>
        <span className="diptych-kicker">TWO PORTRAITS · ONE STORY</span>
        <strong>민준 <i>&amp;</i> 서연</strong>
        <time>15 · 05 · 2027</time>
      </div>
    )
  }

  if (conceptId === 'coming-warm-expanded') {
    return (
      <div className="concept-preview preview-coming preview-coming-warm" aria-label="커밍 웜 익스팬디드 미리보기">
        <div className="coming-preview-botanical" aria-hidden="true">
          <i />
          <i />
          <i />
          <span />
        </div>
        <p className="coming-preview-eyebrow">OUR WEDDING</p>
        <strong>
          <span>민준과 서연</span>
          <span>결혼합니다</span>
        </strong>
        <p className="coming-preview-copy">두 사람이 함께 걷게 될 날에<br />소중한 분들을 초대합니다.</p>
        <div className="coming-preview-divider" aria-hidden="true"><i /></div>
        <time>2027 · 05 · 15</time>
      </div>
    )
  }

  if (conceptId === 'coming-modern-expanded') {
    return (
      <div className="concept-preview preview-coming preview-coming-modern" aria-label="커밍 모던 익스팬디드 미리보기">
        <i className="coming-corner coming-corner-tl" aria-hidden="true" />
        <i className="coming-corner coming-corner-tr" aria-hidden="true" />
        <i className="coming-corner coming-corner-bl" aria-hidden="true" />
        <i className="coming-corner coming-corner-br" aria-hidden="true" />
        <div className="coming-modern-mark" aria-hidden="true"><i /><i /><i /></div>
        <p className="coming-preview-eyebrow">OUR WEDDING</p>
        <strong>
          <span>민준과 서연</span>
          <span>결혼합니다</span>
        </strong>
        <p className="coming-preview-copy">TWO PEOPLE · ONE DIRECTION</p>
        <div className="coming-preview-divider" aria-hidden="true"><i /></div>
        <time>15 MAY 2027 · SEOUL</time>
      </div>
    )
  }

  if (conceptId === 'porcelain-orbit') {
    return (
      <div className="concept-preview preview-porcelain" aria-label="포슬린 오빗 미리보기">
        <span className="porcelain-kicker">THE WEDDING OF</span>
        <div className="porcelain-photo">
          <img src={samplePhotoUrl} alt="" />
        </div>
        <div className="porcelain-orbit" aria-hidden="true" />
        <strong>
          <span>M</span><i>&amp;</i><span>S</span>
        </strong>
        <p>민준 그리고 서연</p>
        <time>15 · 05 · 2027</time>
      </div>
    )
  }

  if (conceptId === 'citrus-poster') {
    return (
      <div className="concept-preview preview-citrus" aria-label="시트러스 포스터 미리보기">
        <div className="citrus-shape citrus-circle" aria-hidden="true" />
        <div className="citrus-shape citrus-block" aria-hidden="true" />
        <div className="citrus-photo">
          <img src={samplePhotoUrl} alt="" />
        </div>
        <span className="citrus-kicker">WEDDING POSTER · NO.20</span>
        <strong>YES,<br />WE<br />DO!</strong>
        <p>MINJUN × SEOYEON</p>
        <time>MAY 15 · 2027</time>
      </div>
    )
  }

  if (conceptId === 'terracotta-reel') {
    return (
      <div className="concept-preview preview-terracotta" aria-label="테라코타 릴 미리보기">
        <span className="reel-kicker">A FILM ABOUT US</span>
        <div className="reel-photo">
          <img src={samplePhotoUrl} alt="" />
          <i aria-hidden="true" />
        </div>
        <strong>민준 <i>&amp;</i> 서연</strong>
        <div className="reel-footer">
          <span>SCENE 05</span>
          <time>15 MAY 2027</time>
        </div>
      </div>
    )
  }

  if (conceptId === 'lavender-glass') {
    return (
      <div className="concept-preview preview-lavender" aria-label="라벤더 글래스 미리보기">
        <img src={samplePhotoUrl} alt="" />
        <div className="lavender-haze lavender-haze-one" aria-hidden="true" />
        <div className="lavender-haze lavender-haze-two" aria-hidden="true" />
        <div className="lavender-card">
          <span>OUR WEDDING DAY</span>
          <strong>M <i>&amp;</i> S</strong>
          <p>민준과 서연, 결혼합니다.</p>
          <time>2027 · 05 · 15</time>
        </div>
      </div>
    )
  }

  if (conceptId === 'rose-ink-bleed') {
    return (
      <div className="concept-preview preview-rose-ink" aria-label="로즈 잉크 블리드 미리보기">
        <img src={samplePhotoUrl} alt="" />
        <div className="rose-ink-shade" aria-hidden="true" />
        <span className="rose-ink-kicker">MINJUN · SEOYEON</span>
        <div className="rose-preview-script" aria-label="We're getting married">
          <img src={blackRushLetteringUrl('were-getting')} alt="" />
          <img src={blackRushLetteringUrl('married')} alt="" />
        </div>
        <div className="rose-ink-footer">
          <time>15 MAY 2027</time>
          <span>SEOUL · 1PM</span>
        </div>
      </div>
    )
  }

  if (conceptId === 'letter-prelude') {
    return (
      <div className="concept-preview preview-letter-prelude" aria-label="첫 사진에서 다음 커버로 전환되는 레터 프렐류드 미리보기">
        <div className="letter-preview-frame letter-preview-first">
          <img src={samplePhotoUrl} alt="" />
          <div className="letter-preview-names">
            <img src={blackRushLetteringUrl('minjun')} alt="" />
            <i>&amp;</i>
            <img src={blackRushLetteringUrl('seoyeon')} alt="" />
          </div>
          <small>PHOTO 01 · INTRO</small>
        </div>
        <div className="letter-preview-frame letter-preview-second">
          <img src={moonlitHanjiUrl} alt="" />
          <span>MINJUN</span>
          <span>SEOYEON</span>
          <div className="letter-preview-cover-script" aria-label="Wedding Invitation">
            <img src={blackRushLetteringUrl('wedding')} alt="" />
            <img src={blackRushLetteringUrl('invitation')} alt="" />
          </div>
          <time>15 · MAY · 2027</time>
        </div>
        <div className="letter-preview-progress" aria-hidden="true"><i /></div>
      </div>
    )
  }

  return (
    <div className="concept-preview preview-noir" aria-label="에디토리얼 누아르 미리보기">
      <span className="noir-issue">ISSUE<br />05.15</span>
      <strong className="noir-title">TOGETHER<br />IS A<br />BEAUTIFUL<br />PLACE</strong>
      <div className="noir-footer">
        <span>MINJUN<br />SEOYEON</span>
        <i />
        <time>2027</time>
      </div>
    </div>
  )
}

export default DesignLab
