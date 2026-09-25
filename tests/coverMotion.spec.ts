import { test, expect } from '@playwright/test'
import { coverMotion } from '../src/coverMotion'

test('reduced motion shortens cover waits without changing normal edition behavior', () => {
  for (const largeType of [false,true]) {
    expect(coverMotion(true,largeType)).toEqual({introHoldMs:1800,introFadeMs:150,waitForIntroLetters:false,waitForMainLetters:false})
  }
  expect(coverMotion(false,false)).toEqual({introHoldMs:4200,introFadeMs:900,waitForIntroLetters:true,waitForMainLetters:true})
  expect(coverMotion(false,true)).toEqual({introHoldMs:4200,introFadeMs:900,waitForIntroLetters:true,waitForMainLetters:false})
})

for (const edition of ['main','a','b']) {
  test(`reduced motion ${edition} opens and scrolls without waiting for lettering`, async ({page}) => {
    await page.emulateMedia({reducedMotion:'reduce'})
    let release!: () => void
    const gate = new Promise<void>(resolve => { release = resolve })
    await page.route('**/black-rush-outlines.json', async route => { await gate; await route.continue() })
    try {
      await page.goto(edition === 'main' ? './' : `invitation-${edition}/`, {waitUntil:'domcontentloaded'})
      await expect.poll(()=>page.locator('.draft-cover-layer img').evaluate((img: HTMLImageElement)=>img.complete && img.naturalWidth>0)).toBe(true)
      await expect(page.locator('.draft-intro-layer')).toHaveCount(0,{timeout:2800})
      await expect(page.locator('#draft-body')).not.toHaveAttribute('inert','')
      await page.mouse.wheel(0,400)
      await expect.poll(()=>page.evaluate(()=>scrollY)).toBeGreaterThan(0)
    } finally { release() }
  })
}
