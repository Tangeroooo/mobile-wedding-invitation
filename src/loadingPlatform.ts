export function loadingPlatform(userAgent: string, platform = '', maxTouchPoints = 0): 'apple' | 'material' {
  const apple = /iPhone|iPad|iPod|Macintosh|Mac OS X/i.test(userAgent)
    || (platform === 'MacIntel' && maxTouchPoints > 1)
  return apple && !/Android/i.test(userAgent) ? 'apple' : 'material'
}
