import { test, expect } from '@playwright/test'
import { invitationShare } from '../src/invitationShare'

test('sharing data preserves each published edition and never shares the editor', () => {
  const base = 'https://tangeroooo.github.io/mobile-wedding-invitation/'
  for (const variant of ['main', 'a', 'b'] as const) {
    const data = invitationShare(variant)
    const url = base + (variant === 'main' ? '' : `invitation-${variant}/`)
    expect(data.url).toBe(url)
    expect(data.title).toBe(`${variant === 'b' ? '주현 ♥ 하니' : '정주현 ♥ 임하니'} 결혼합니다`)
    expect(data.text).toBe('2026년 11월 7일 토요일 오후 7시 20분 · 더링크호텔 3층 베일리홀')
    expect(data.kakao.content.description).toBe(data.text)
    expect(data.kakao.content.link).toEqual({mobileWebUrl:url,webUrl:url})
    expect(data.kakao.buttons[0].link).toEqual(data.kakao.content.link)
    expect(data.kakao.content.imageUrl).toBe(`${base}images/share/wedding-${variant}.jpg?v=main-photo-1`)
  }
  expect(invitationShare().url).toBe(base)
})

test('sharing buttons have equal vertical spacing even after copying', async ({ page, context }) => {
  await context.grantPermissions(['clipboard-read', 'clipboard-write'])
  await page.setViewportSize({width:375,height:812})
  await page.goto('invitation-b/')
  await page.getByRole('button',{name:'청첩장 링크 복사',exact:true}).click()
  await expect(page.locator('.draft-share-status')).toHaveText('청첩장 링크를 복사했어요.')
  const spacing = await page.locator('.draft-share').evaluate(section => {
    const outer = section.getBoundingClientRect()
    const buttons = section.querySelector('.draft-share-actions')!.getBoundingClientRect()
    return {top:buttons.top-outer.top,bottom:outer.bottom-buttons.bottom}
  })
  expect(spacing).toEqual({top:30,bottom:30})
  expect(await page.evaluate(() => navigator.clipboard.readText())).toBe(invitationShare('b').url)
})
