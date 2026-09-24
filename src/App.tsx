import { lazy, Suspense, useState } from 'react'
import './App.css'
import DesignLab from './DesignLab'

const DraftStudio = lazy(() => import('./DraftStudio'))

type Theme = 'warm' | 'modern'

const themeOptions: Array<{ id: Theme; label: string }> = [
  { id: 'warm', label: 'Warm' },
  { id: 'modern', label: 'Modern' },
]

function App() {
  const currentPath = window.location.pathname.replace(/\/+$/, '')

  if (currentPath.endsWith('/draft')) {
    return <Suspense fallback={<p role="status">초안을 불러오고 있어요.</p>}><DraftStudio /></Suspense>
  }

  if (currentPath.endsWith('/design-lab')) {
    return <DesignLab />
  }

  return <ComingSoon />
}

function ComingSoon() {
  const [theme, setTheme] = useState<Theme>('warm')

  return (
    <main className="invitation-shell" data-theme={theme}>
      <div className="ambient ambient-one" aria-hidden="true" />
      <div className="ambient ambient-two" aria-hidden="true" />
      <div className="fine-grid" aria-hidden="true" />

      <header className="page-header">
        <p className="edition">WEDDING INVITATION · PREVIEW</p>
        <div className="theme-switcher" role="group" aria-label="화면 분위기 선택">
          {themeOptions.map((option) => (
            <button
              key={option.id}
              type="button"
              aria-pressed={theme === option.id}
              onClick={() => setTheme(option.id)}
            >
              {option.label}
            </button>
          ))}
        </div>
      </header>

      <section className="coming-soon-card" aria-labelledby="coming-soon-title">
        <div className="frame-corner corner-top-left" aria-hidden="true" />
        <div className="frame-corner corner-top-right" aria-hidden="true" />
        <div className="frame-corner corner-bottom-left" aria-hidden="true" />
        <div className="frame-corner corner-bottom-right" aria-hidden="true" />

        <div className="botanical-mark" aria-hidden="true">
          <span className="petal petal-one" />
          <span className="petal petal-two" />
          <span className="petal petal-three" />
          <span className="stem" />
        </div>

        <p className="eyebrow">OUR WEDDING</p>
        <h1 id="coming-soon-title">
          <span>초대장을</span>
          <span>준비하고 있어요</span>
        </h1>
        <p className="description">
          두 사람이 함께 걷게 될 날의 이야기를
          <br />
          이곳에 정성껏 담고 있습니다.
        </p>

        <div className="divider" aria-hidden="true">
          <span />
          <i />
          <span />
        </div>

        <p className="status">
          <span className="status-dot" aria-hidden="true" />
          COMING SOON
        </p>
      </section>

      <footer className="page-footer">
        <span>초대장을 준비 중입니다. 곧 새로운 모습으로 찾아뵐게요.</span>
        <span aria-hidden="true">∞</span>
      </footer>
    </main>
  )
}

export default App
