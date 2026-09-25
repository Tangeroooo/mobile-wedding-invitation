import { test, expect } from '@playwright/test'
import { readFileSync } from 'node:fs'
import { invitationCopy } from '../src/invitationVariants'
import { copyDefaults } from '../src/draftCopy'
import { createWeddingCalendar } from '../src/draftCalendarFile'
import { defaults, parseConfig } from '../src/draftModel'

test('published edition data stays independent and calendars use edition names', () => {
  const main = invitationCopy('main'), a = invitationCopy('a'), b = invitationCopy('b')
  expect(main.groomAccountNumber).toBe(copyDefaults.groomAccountNumber)
  for (const key of ['groomFamily1Number','groomFamily2Number'] as const) expect(main[key]).toBe('')
  expect(main.brideAccountNumber).toBe(copyDefaults.brideAccountNumber)
  expect(main.brideAccountName).toBe('임하니')
  expect(a).toEqual(copyDefaults)
  expect(b).toMatchObject({groom:'주현',bride:'하니',brideParents:'오규식 · 박건자의 장녀',groomAccountName:'정주현',brideAccountName:'임하니'})
  expect(createWeddingCalendar(b)).toContain('SUMMARY:주현 ♥ 하니 결혼식')
  expect(createWeddingCalendar(a)).toContain('SUMMARY:정주현 ♥ 임하니 결혼식')
  expect(copyDefaults.brideParents).toBe('임춘구 · 박건자의 장녀')
  expect(main.footerLabel).toBe('이 모든 것 위에 사랑을 더하라\n이는 온전하게 매는 띠니라\n골로새서 3:14')
  expect(parseConfig({...defaults,copy:{...copyDefaults,footerLabel:'이 모든 것 위에 사랑을 더하라\n이는 온전하게 매는 띠니라\n\n골로새서 3:14'}}).copy.footerLabel).toBe(copyDefaults.footerLabel)
  expect(parseConfig({...defaults,copy:{...copyDefaults,footerLabel:'BLUE MEETS PINK.'}}).copy.footerLabel).toBe(copyDefaults.footerLabel)
  expect(parseConfig({...defaults,copy:{...copyDefaults,footerLabel:'직접 쓴 문구'}}).copy.footerLabel).toBe('직접 쓴 문구')
})

test('published HTML includes independent crawler-readable sharing cards', () => {
  for (const [path, edition] of [['index.html','main'],['invitation-a/index.html','a'],['invitation-b/index.html','b']]) {
    const html = readFileSync(path,'utf8')
    expect(html).toContain(`content="${edition === 'b' ? '주현 ♥ 하니' : '정주현 ♥ 임하니'} 결혼합니다"`)
    expect(html).toContain(`images/share/wedding-${edition}.jpg`)
    expect(html).not.toContain('Coming Soon')
    const image = readFileSync(`public/images/share/wedding-${edition}.jpg`)
    expect(image[0]).toBe(0xff)
    expect(image[1]).toBe(0xd8)
    expect(image.length).toBeLessThan(500_000)
  }
})

for (const edition of ['main','a','b'] as const) {
  test(`published ${edition} cover timing and scroll policy`, async ({page}) => {
    await page.emulateMedia({reducedMotion:'no-preference'})
    await page.goto(edition === 'main' ? './' : `invitation-${edition}/`)
    await page.getByRole('button',{name:'건너뛰기'}).click()
    const strokes = page.locator('.draft-cover-layer .draft-letter-position .draft-write')
    await expect(strokes.first()).toBeAttached()
    await expect(strokes.first()).toHaveCSS('animation-duration',edition === 'main' ? '1.25s' : '0.625s')
    await expect(strokes.last()).toHaveCSS('animation-delay',edition === 'main' ? '1.4s' : '0.7s')
    if (edition === 'main') {
      await expect(page.locator('#draft-body')).toHaveAttribute('inert','')
    } else {
      await expect(page.locator('#draft-body')).not.toHaveAttribute('inert','')
      await page.mouse.wheel(0,400)
      await expect.poll(()=>page.evaluate(()=>scrollY)).toBeGreaterThan(0)
    }
  })
  test(`published ${edition} has the correct readers, accounts, audio and no editor`, async ({ page }) => {
    await page.setViewportSize({width:320,height:740})
    await page.emulateMedia({reducedMotion:'reduce'})
    await page.goto(edition === 'main' ? './' : `invitation-${edition}/`)
    await expect(page.locator('[data-invitation-variant]')).toHaveAttribute('data-invitation-variant',edition)
    await expect(page.locator('.draft-inspector,.draft-preview-controls,.draft-copy-editor')).toHaveCount(0)
    await expect(page.locator('audio')).toHaveCount(edition === 'main' ? 1 : 0)
    await expect(page.getByRole('switch',{name:'배경음악'})).toHaveCount(edition === 'main' ? 1 : 0)
    await expect(page.locator('.draft-couple strong')).toHaveText(edition === 'b' ? ['주현','하니'] : ['정주현','임하니'])
    await expect(page.locator('.draft-couple small').last()).toHaveText(edition === 'b' ? '오규식 · 박건자의 장녀' : copyDefaults.brideParents)
    await expect(page.locator('.groom .draft-account-copy strong')).toHaveText(edition === 'main' ? ['정주현'] : ['정우선','김인숙','정주현'])
    await expect(page.locator('.bride.draft-account-group')).toHaveCount(1)
    await expect(page.locator('.bride .draft-account-copy strong')).toHaveText(['임하니'])
    await expect(page.locator('.bride .draft-account-copy strong')).toHaveCSS('color','rgb(185, 68, 112)')
    await expect(page.locator('.bride .draft-account-bank')).toHaveCSS('color','rgb(185, 68, 112)')
    await expect(page.locator('.bride .draft-account-number')).toHaveCSS('color','rgb(185, 68, 112)')
    await expect(page.locator('.draft-gallery h2')).toHaveText('우리의행복한 순간들')
    await expect(page.locator('.draft-gallery>p')).toHaveCount(0)
    if (edition !== 'main') {
      await page.getByRole('button',{name:'신랑측 계좌 안내',exact:true}).click()
      for (const row of await page.locator('.groom .draft-account-copy').all()) {
        const number = (await row.locator('.draft-account-number').boundingBox())!
        const icon = (await row.locator('.draft-account-copy-icon').boundingBox())!
        expect(icon.x - (number.x + number.width)).toBeCloseTo(10,0)
        expect(Math.abs(icon.y + icon.height / 2 - number.y - number.height / 2)).toBeLessThan(1)
      }
    }
    await expect(page.locator('.draft-calendar-add')).toHaveAttribute('href',new RegExp(`wedding-${edition}\\.ics`))
    if (edition !== 'main') await expect(page.locator('.draft-greeting>p').first()).toHaveCSS('font-size','19px')
  })
}
