import { lazy, Suspense } from 'react'
import InvitationLoading from './InvitationLoading'
import './App.css'

const DraftStudio = lazy(() => import('./DraftStudio'))
const DesignLab = lazy(() => import('./DesignLab'))

export default function App() {
  const path = window.location.pathname.replace(/\/index\.html$/, '').replace(/\/+$/, '')
  const variant = path.endsWith('/invitation-b') ? 'b' : path.endsWith('/invitation-a') ? 'a' : 'main'
  return <Suspense fallback={<InvitationLoading />}>
    {path.endsWith('/design-lab') ? <DesignLab /> : <DraftStudio variant={path.endsWith('/draft') ? undefined : variant} />}
  </Suspense>
}
