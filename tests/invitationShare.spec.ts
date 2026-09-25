import { test, expect } from '@playwright/test'
import { invitationShare } from '../src/invitationShare'

test('sharing data preserves each published edition and never shares the editor', () => {
  const base = 'https://tangeroooo.github.io/mobile-wedding-invitation/'
  for (const variant of ['main', 'a', 'b'] as const) {
    const data = invitationShare(variant)
    const url = base + (variant === 'main' ? '' : `invitation-${variant}/`)
    expect(data.url).toBe(url)
    expect(data.title).toBe(`${variant === 'b' ? '주현 ♥ 하니' : '정주현 ♥ 임하니'} 결혼합니다`)
    expect(data.kakao.content.link).toEqual({mobileWebUrl:url,webUrl:url})
    expect(data.kakao.buttons[0].link).toEqual(data.kakao.content.link)
    expect(data.kakao.content.imageUrl).toBe(`${base}images/share/wedding-${variant}.jpg?v=main-photo-1`)
  }
  expect(invitationShare().url).toBe(base)
})
