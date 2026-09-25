import { useEffect, useRef, useState } from 'react'
import type { PointerEvent as ReactPointerEvent } from 'react'
import { boundMapView, initialMapView, pinchMapView } from './draftMapZoom'
import type { MapPoint, MapView } from './draftMapZoom'

export default function DraftRouteImage() {
  const frame = useRef<HTMLDivElement>(null)
  const [view, setView] = useState(initialMapView)
  const current = useRef(view)
  const pointers = useRef(new Map<number, MapPoint>())
  const gesture = useRef<{ view: MapView; points: MapPoint[] } | null>(null)
  const update = (next: MapView) => {
    const rect = frame.current?.getBoundingClientRect()
    if (!rect) return
    const bounded = boundMapView(next, rect.width, rect.height)
    current.current = bounded; setView(bounded)
  }
  const point = (event: { clientX: number; clientY: number }) => {
    const rect = frame.current!.getBoundingClientRect()
    return { x:event.clientX - rect.left - rect.width / 2, y:event.clientY - rect.top - rect.height / 2 }
  }
  const resetGesture = () => { gesture.current = pointers.current.size ? { view:current.current, points:[...pointers.current.values()] } : null }
  const release = (event: ReactPointerEvent) => {
    if (!pointers.current.delete(event.pointerId)) return
    resetGesture()
  }
  useEffect(() => {
    const element = frame.current
    if (!element) return
    const resize = new ResizeObserver(() => {
      const rect = element.getBoundingClientRect()
      const bounded = boundMapView(current.current, rect.width, rect.height)
      current.current = bounded; setView(bounded)
      pointers.current.clear(); gesture.current = null
    })
    resize.observe(element)
    return () => resize.disconnect()
  }, [])
  return <div ref={frame} className="draft-route-image" data-scale={view.scale} tabIndex={0} role="region" aria-label="약도: 두 손가락으로 확대·축소, 확대한 뒤 밀어서 이동. 키보드는 더하기·빼기와 방향키 사용."
    onPointerDown={event => {
      if (event.button !== 0) return
      pointers.current.set(event.pointerId, point(event)); resetGesture()
      event.currentTarget.setPointerCapture(event.pointerId)
    }} onPointerMove={event => {
      if (!pointers.current.has(event.pointerId) || !gesture.current) return
      pointers.current.set(event.pointerId, point(event))
      update(pinchMapView(gesture.current.view, gesture.current.points, [...pointers.current.values()]))
    }} onPointerUp={release} onPointerCancel={release} onLostPointerCapture={release}
    onDoubleClick={event => {
      event.preventDefault()
      const next = current.current.scale > 1 ? 1 : 2.5, anchor = point(event), ratio = next / current.current.scale
      update({ scale:next, x:anchor.x - (anchor.x - current.current.x) * ratio, y:anchor.y - (anchor.y - current.current.y) * ratio })
    }} onKeyDown={event => {
      if (!['+','=','-','0','ArrowUp','ArrowDown','ArrowLeft','ArrowRight'].includes(event.key)) return
      event.preventDefault()
      const next = { ...current.current }
      if (event.key === '0') { update(initialMapView); return }
      if (event.key === '+' || event.key === '=') next.scale += .5
      if (event.key === '-') next.scale -= .5
      if (event.key === 'ArrowLeft') next.x += 50
      if (event.key === 'ArrowRight') next.x -= 50
      if (event.key === 'ArrowUp') next.y += 50
      if (event.key === 'ArrowDown') next.y -= 50
      update(next)
    }}>
    <img src={`${import.meta.env.BASE_URL}images/draft/venue-directions.webp`} width="1327" height="2200" draggable={false}
      style={{ transform:`translate(${view.x}px,${view.y}px) scale(${view.scale})` }}
      alt="더링크호텔서울 오시는 길. 신도림역 1번 출구 셔틀버스 탑승 위치, 주변 약도, 자가용·지하철·버스 이용 안내" />
  </div>
}
