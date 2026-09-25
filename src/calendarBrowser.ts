export function calendarBrowser(userAgent: string, platform = '', touchPoints = 0) {
  const kakao = /kakaotalk/i.test(userAgent)
  const apple = /iPhone|iPad|iPod/i.test(userAgent) || (platform === 'MacIntel' && touchPoints > 1)
  return { kakao, browserName: apple ? 'Safari' : /Android/i.test(userAgent) ? 'Chrome' : '외부 브라우저' }
}
