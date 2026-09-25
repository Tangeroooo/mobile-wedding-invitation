import { test, expect } from '@playwright/test'
import { galleryPhotos, galleryStartingAt } from '../src/draftGallery'

test('relative gallery rotates all 27 photos exactly once from any starting photo', () => {
  expect(galleryPhotos).toHaveLength(27)
  for (const [index, id] of galleryPhotos.entries()) {
    const order = galleryStartingAt(id)
    expect(order[0]).toBe(id)
    expect(order.at(-1)).toBe(galleryPhotos[(index + 26) % 27])
    expect(new Set(order).size).toBe(27)
    expect(order).toEqual([...galleryPhotos.slice(index), ...galleryPhotos.slice(0, index)])
  }
  expect(galleryStartingAt('10')).toEqual([
    '10','11','12','13','14','15','16','17','18','19','20','21','21-1','21-2',
    '22','23','24','25','1','2','3','4','5','6','7','8','9',
  ])
  expect(galleryStartingAt('unknown')).toEqual(galleryPhotos)
})
