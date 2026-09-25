import { test, expect } from '@playwright/test'
import { readFileSync } from 'node:fs'
import { invitationCopy } from '../src/invitationVariants'
import { copyDefaults } from '../src/draftCopy'
import { createWeddingCalendar } from '../src/draftCalendarFile'

test('published edition data stays independent and calendars use edition names', () => {
  const main = invitationCopy('main'), a = invitationCopy('a'), b = invitationCopy('b')
  expect(main.groomAccountNumber).toBe(copyDefaults.groomAccountNumber)
  for (const key of ['groomFamily1Number','groomFamily2Number','brideAccountNumber'] as const) expect(main[key]).toBe('')
  expect(a).toEqual(copyDefaults)
  expect(b).toMatchObject({groom:'주현',bride:'하니',brideParents:'오규식 · 박건자의 장녀',groomAccountName:'정주현',brideAccountName:'임하니'})
  expect(createWeddingCalendar(b)).toContain('SUMMARY:주현 ♥ 하니 결혼식')
  expect(createWeddingCalendar(a)).toContain('SUMMARY:정주현 ♥ 임하니 결혼식')
  expect(copyDefaults.brideParents).toBe('임춘구 · 박건자의 장녀')
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
    await expect(page.locator('.bride.draft-account-group')).toHaveCount(edition === 'main' ? 0 : 1)
    await expect(page.locator('.draft-calendar-add')).toHaveAttribute('href',new RegExp(`wedding-${edition}\\.ics`))
    if (edition !== 'main') await expect(page.locator('.draft-greeting>p').first()).toHaveCSS('font-size','19px')
  })
}
