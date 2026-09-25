import { useEffect, useRef, useState } from 'react'
import type { Map } from 'leaflet'
import 'leaflet/dist/leaflet.css'

export default function DraftMap() {
  const container = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)
  const [failed, setFailed] = useState(false)
  const canvas = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(entries => {
      if (entries.some(entry => entry.isIntersecting)) {
        setVisible(true)
        observer.disconnect()
      }
    }, { rootMargin: '400px' })
    if (container.current) observer.observe(container.current)
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    if (!visible || !canvas.current) return
    let disposed = false
    let map: Map | undefined
    let resize: ResizeObserver | undefined
    // Defer both the map library and tiles until this section is near the viewport.
    void import('leaflet').then(L => {
      if (disposed || !canvas.current) return
      const point: [number, number] = [37.5052943, 126.8838555]
      map = L.map(canvas.current, { scrollWheelZoom:false, dragging:false, touchZoom:false, doubleClickZoom:false }).setView(point, 16)
      L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom:19,
        attribution:'&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener noreferrer">OpenStreetMap</a> contributors',
      }).on('tileerror', () => { if (!disposed) setFailed(true) }).addTo(map)
      L.marker(point, {
        title:'더링크호텔 · 3층 베일리홀',
        icon:L.divIcon({ className:'draft-map-pin', html:'<span aria-hidden="true">♥</span>', iconSize:[30,30], iconAnchor:[15,30] }),
      }).addTo(map).bindTooltip('더링크호텔', {permanent:true, direction:'top', offset:[0,-30]})
      map.zoomControl.setPosition('bottomright')
      resize = new ResizeObserver(() => map?.invalidateSize())
      resize.observe(canvas.current)
    }).catch(() => { if (!disposed) setFailed(true) })
    return () => { disposed = true; resize?.disconnect(); map?.remove() }
  }, [visible])

  return <div ref={container} className="draft-location-map" role="region" aria-label="더링크호텔 위치 지도">
    <div ref={canvas} className="draft-map-canvas" />
    {failed && <span className="draft-map-error" role="status">지도를 불러오지 못했어요. 아래 지도 버튼을 이용해주세요.</span>}
  </div>
}
