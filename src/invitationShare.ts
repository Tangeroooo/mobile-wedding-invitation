import type { InvitationVariant } from './invitationVariants'

const site = 'https://tangeroooo.github.io/mobile-wedding-invitation/'

// Never share the editor, localhost, query parameters, or a different edition.
export function invitationShare(variant: InvitationVariant = 'main') {
  const url = `${site}${variant === 'main' ? '' : `invitation-${variant}/`}`
  const title = `${variant === 'b' ? '주현 ♥ 하니' : '정주현 ♥ 임하니'} 결혼합니다`
  const text = '2026년 11월 7일 토요일 오후 7시 20분 · 더링크호텔 3층 베일리홀'
  return {
    url, title, text,
    kakao: {
      objectType: 'feed' as const,
      content: {
        title, description: text,
        imageUrl: `${site}images/share/wedding-${variant}.jpg?v=main-photo-1`,
        imageWidth: 1200, imageHeight: 630,
        link: { mobileWebUrl: url, webUrl: url },
      },
      buttons: [{ title: '청첩장 보기', link: { mobileWebUrl: url, webUrl: url } }],
    },
  }
}
