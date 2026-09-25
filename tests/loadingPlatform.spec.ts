import { test, expect } from '@playwright/test'
import { loadingPlatform } from '../src/loadingPlatform'

test('loading indicator chooses Apple style on Apple devices and a ring on Android', () => {
  expect(loadingPlatform('Mozilla/5.0 (iPhone; CPU iPhone OS 18_0 like Mac OS X)')).toBe('apple')
  expect(loadingPlatform('Mozilla/5.0 (iPad; CPU OS 18_0 like Mac OS X)')).toBe('apple')
  expect(loadingPlatform('Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)', 'MacIntel', 5)).toBe('apple')
  expect(loadingPlatform('', 'MacIntel', 5)).toBe('apple')
  expect(loadingPlatform('Mozilla/5.0 (iPhone) KAKAOTALK/26.0')).toBe('apple')
  expect(loadingPlatform('Mozilla/5.0 (Linux; Android 16) Chrome/140.0 KAKAOTALK')).toBe('material')
  expect(loadingPlatform('Mozilla/5.0 (Windows NT 10.0)')).toBe('material')
  expect(loadingPlatform('')).toBe('material')
})

test('loading indicator is centered, announced, and disappears after loading', async ({page}) => {
  let release!: () => void
  const gate = new Promise<void>(resolve => { release = resolve })
  await page.route('**/src/DraftStudio.tsx', async route => { await gate; await route.continue() })
  await page.goto('./', {waitUntil:'domcontentloaded'})
  const loader = page.getByRole('status')
  await expect(loader).toHaveText('청첩장을 불러오는 중입니다.')
  await expect(page.locator('.invitation-loading-label')).toHaveCSS('clip-path','inset(50%)')
  const centered = await page.locator('.invitation-loading').evaluate(el => {
    const indicator = el.querySelector('.invitation-loading-apple,.invitation-loading-material')!.getBoundingClientRect()
    return {x:indicator.x + indicator.width/2 - innerWidth/2,y:indicator.y + indicator.height/2 - innerHeight/2}
  })
  expect(Math.abs(centered.x)).toBeLessThan(1)
  expect(Math.abs(centered.y)).toBeLessThan(1)
  release()
  await expect(page.locator('.invitation-loading')).toHaveCount(0)
})
