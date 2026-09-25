export type MapView = { scale: number; x: number; y: number }
export type MapPoint = { x: number; y: number }
export const initialMapView: MapView = { scale:1, x:0, y:0 }
export function boundMapView(view: MapView, width: number, height: number): MapView {
  const scale = Math.max(1, Math.min(5, view.scale))
  const limitX = width * (scale - 1) / 2, limitY = height * (scale - 1) / 2
  return { scale, x:Math.max(-limitX, Math.min(limitX, view.x)), y:Math.max(-limitY, Math.min(limitY, view.y)) }
}
export function pinchMapView(view: MapView, from: MapPoint[], to: MapPoint[]): MapView {
  if (from.length < 2 || to.length < 2) return { ...view, x:view.x + to[0].x - from[0].x, y:view.y + to[0].y - from[0].y }
  const center = (points: MapPoint[]) => ({ x:(points[0].x + points[1].x) / 2, y:(points[0].y + points[1].y) / 2 })
  const distance = (points: MapPoint[]) => Math.hypot(points[1].x - points[0].x, points[1].y - points[0].y)
  const start = center(from), end = center(to)
  const scale = Math.max(1, Math.min(5, view.scale * distance(to) / Math.max(1, distance(from))))
  return { scale, x:end.x - (start.x - view.x) * scale / view.scale, y:end.y - (start.y - view.y) * scale / view.scale }
}
