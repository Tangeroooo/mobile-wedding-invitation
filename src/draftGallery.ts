export const galleryPhotos = Array.from({ length: 25 }, (_, index) => String(index + 1))
  .flatMap(id => id === '21' ? [id, '21-1', '21-2'] : [id])

// Rotate once when opening, not on navigation. The resulting rail has two ends.
export function galleryStartingAt(photo: string) {
  const start = Math.max(0, galleryPhotos.indexOf(photo))
  return [...galleryPhotos.slice(start), ...galleryPhotos.slice(0, start)]
}
