import { useEffect, useState } from 'react'
import './DesignLab.css'
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
  const activeConcept = concepts.find(
    (concept) =>
      concept.id === new URLSearchParams(window.location.search).get('concept'),
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
        <span className="lab-edition">DESIGN STUDY · 01</span>
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
