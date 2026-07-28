import { useEffect } from 'react'
import './FullInvitation.css'

type InvitationConcept = {
  id: string
  number: string
  name: string
  koreanName: string
  mood: 'warm' | 'modern'
  description: string
  keywords: string[]
}

type FullInvitationProps = {
  concept: InvitationConcept
  concepts: InvitationConcept[]
}

const calendarDays: Array<number | ''> = [
  '',
  '',
  '',
  '',
  '',
  '',
  1,
  2,
  3,
  4,
  5,
  6,
  7,
  8,
  9,
  10,
  11,
  12,
  13,
  14,
  15,
  16,
  17,
  18,
  19,
  20,
  21,
  22,
  23,
  24,
  25,
  26,
  27,
  28,
  29,
  30,
  31,
]

const weekdayLabels = ['일', '월', '화', '수', '목', '금', '토']

function FullInvitation({ concept, concepts }: FullInvitationProps) {
  const activeIndex = concepts.findIndex((item) => item.id === concept.id)
  const previousConcept =
    concepts[(activeIndex - 1 + concepts.length) % concepts.length]
  const nextConcept = concepts[(activeIndex + 1) % concepts.length]
  const designLabUrl = `${import.meta.env.BASE_URL}design-lab/`

  useEffect(() => {
    document.title = `${concept.koreanName} — Wedding Design Lab`
    window.scrollTo(0, 0)
  }, [concept.koreanName])

  return (
    <main className="invitation-preview-page">
      <header className="preview-toolbar">
        <a href={designLabUrl} className="preview-back">
          <span aria-hidden="true">←</span>
          Design Lab
        </a>
        <div className="preview-identity">
          <span>{concept.number} / 06</span>
          <strong>{concept.name}</strong>
        </div>
        <nav aria-label="다른 디자인 보기">
          <a
            href={`${designLabUrl}?concept=${previousConcept.id}`}
            aria-label={`이전 디자인: ${previousConcept.koreanName}`}
          >
            ←
          </a>
          <a
            href={`${designLabUrl}?concept=${nextConcept.id}`}
            aria-label={`다음 디자인: ${nextConcept.koreanName}`}
          >
            →
          </a>
        </nav>
      </header>

      <p className="demo-notice">
        DESIGN PREVIEW · 모든 이름, 날짜, 장소, 연락처는 비교용 임시 정보입니다.
      </p>

      <article className="full-invitation" data-concept={concept.id}>
        <section className="invitation-hero">
          <div className="hero-ornament" aria-hidden="true">
            <i />
            <i />
            <i />
          </div>
          <div className="hero-heading">
            <span className="hero-overline">OUR WEDDING DAY</span>
            <h1>
              <span>민준</span>
              <i>&amp;</i>
              <span>서연</span>
            </h1>
            <p>서로의 가장 좋은 친구가 되어 결혼합니다.</p>
          </div>
          <PhotoPlaceholder className="hero-portrait" label="MAIN PORTRAIT" />
          <div className="hero-date">
            <time dateTime="2027-05-15T13:00">2027. 05. 15. SAT · 1:00 PM</time>
            <span>서울 ○○웨딩홀 그랜드홀</span>
          </div>
        </section>

        <section className="invitation-section greeting-section">
          <SectionTitle number="01" eyebrow="INVITATION" title="초대합니다" />
          <div className="greeting-copy">
            <p>
              함께 있을 때 가장 우리다운 두 사람이
              <br />
              이제 같은 방향을 바라보며 걸어가려 합니다.
            </p>
            <p>
              소중한 분들을 모시고 첫걸음을 내딛는 날,
              <br />
              따뜻한 마음으로 축복해 주시면 감사하겠습니다.
            </p>
          </div>
          <div className="family-list" aria-label="혼주와 신랑 신부">
            <p>
              <span>김정우 · 이선영</span>의 아들 <strong>민준</strong>
            </p>
            <p>
              <span>박성호 · 최미경</span>의 딸 <strong>서연</strong>
            </p>
          </div>
        </section>

        <section className="invitation-section date-section">
          <SectionTitle number="02" eyebrow="THE DAY" title="예식 안내" />
          <div className="date-display">
            <strong>15</strong>
            <div>
              <span>MAY</span>
              <span>2027</span>
            </div>
          </div>
          <p className="date-summary">2027년 5월 15일 토요일 오후 1시</p>
          <div className="calendar" aria-label="2027년 5월 달력">
            {weekdayLabels.map((weekday) => (
              <span key={weekday} className="weekday">
                {weekday}
              </span>
            ))}
            {calendarDays.map((day, index) => (
              <span
                key={`${day}-${index}`}
                className={day === 15 ? 'wedding-day' : undefined}
              >
                {day}
              </span>
            ))}
          </div>
        </section>

        <section className="invitation-section gallery-section">
          <SectionTitle number="03" eyebrow="OUR MOMENTS" title="사진첩" />
          <div className="gallery-layout">
            <PhotoPlaceholder className="gallery-photo gallery-photo-one" label="PHOTO 01" />
            <PhotoPlaceholder className="gallery-photo gallery-photo-two" label="PHOTO 02" />
            <PhotoPlaceholder className="gallery-photo gallery-photo-three" label="PHOTO 03" />
            <PhotoPlaceholder className="gallery-photo gallery-photo-four" label="PHOTO 04" />
          </div>
          <p className="gallery-caption">서로를 바라보는 평범한 순간들을 담았습니다.</p>
        </section>

        <section className="invitation-section venue-section">
          <SectionTitle number="04" eyebrow="LOCATION" title="오시는 길" />
          <div className="venue-copy">
            <strong>서울 ○○웨딩홀 그랜드홀</strong>
            <p>서울특별시 ○○구 ○○로 123, 4층</p>
            <span>02-000-0000</span>
          </div>
          <div className="map-placeholder" aria-label="지도 영역 미리보기">
            <span>MAP</span>
            <i aria-hidden="true" />
            <strong>○○웨딩홀</strong>
          </div>
          <div className="transport-list">
            <div>
              <strong>SUBWAY</strong>
              <p>2호선 ○○역 3번 출구에서 도보 5분</p>
            </div>
            <div>
              <strong>BUS</strong>
              <p>○○웨딩홀 정류장 하차 후 도보 2분</p>
            </div>
            <div>
              <strong>PARKING</strong>
              <p>건물 내 주차장 2시간 무료 이용</p>
            </div>
          </div>
          <div className="map-actions" aria-label="지도 앱 버튼 미리보기">
            <button type="button" disabled>네이버지도</button>
            <button type="button" disabled>카카오맵</button>
            <button type="button" disabled>티맵</button>
          </div>
        </section>

        <section className="invitation-section contact-section">
          <SectionTitle number="05" eyebrow="CONTACT" title="마음 전하실 곳" />
          <p className="section-intro">
            축하의 마음을 전하고 싶으신 분들을 위해 연락처와 계좌 정보를
            안내드립니다.
          </p>
          <div className="contact-cards">
            <details>
              <summary>
                <span>신랑측</span>
                <strong>연락처 · 계좌 보기</strong>
              </summary>
              <div>
                <p>신랑 민준 · 010-0000-0000</p>
                <p>○○은행 000-000-000000</p>
              </div>
            </details>
            <details>
              <summary>
                <span>신부측</span>
                <strong>연락처 · 계좌 보기</strong>
              </summary>
              <div>
                <p>신부 서연 · 010-0000-0000</p>
                <p>○○은행 000-000-000000</p>
              </div>
            </details>
          </div>
        </section>

        <section className="invitation-section rsvp-section">
          <span className="rsvp-mark" aria-hidden="true">R</span>
          <SectionTitle number="06" eyebrow="RSVP" title="참석 여부 전달" />
          <p>
            정성껏 자리를 준비할 수 있도록
            <br />
            참석 여부를 알려주시면 감사하겠습니다.
          </p>
          <button type="button" disabled>
            참석 여부 전달하기
            <span>준비 예정</span>
          </button>
        </section>

        <footer className="invitation-footer">
          <p>MINJUN <i>&amp;</i> SEOYEON</p>
          <time dateTime="2027-05-15">15 MAY 2027</time>
          <span>Thank you for celebrating with us.</span>
        </footer>
      </article>

      <footer className="preview-footer">
        <a href={designLabUrl}>6개 디자인 목록으로 돌아가기</a>
        <p>{concept.number} · {concept.koreanName}</p>
      </footer>
    </main>
  )
}

function SectionTitle({
  number,
  eyebrow,
  title,
}: {
  number: string
  eyebrow: string
  title: string
}) {
  return (
    <header className="section-title">
      <span>{number}</span>
      <p>{eyebrow}</p>
      <h2>{title}</h2>
    </header>
  )
}

function PhotoPlaceholder({
  className,
  label,
}: {
  className: string
  label: string
}) {
  return (
    <div className={`photo-placeholder ${className}`}>
      <span>{label}</span>
    </div>
  )
}

export default FullInvitation
