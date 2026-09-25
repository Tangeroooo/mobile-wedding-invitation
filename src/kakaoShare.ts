import type { invitationShare } from './invitationShare'

type KakaoSdk = {
  init: (key: string) => void
  isInitialized: () => boolean
  Share: { sendDefault: (data: ReturnType<typeof invitationShare>['kakao']) => void }
}
declare global { interface Window { Kakao?: KakaoSdk } }

export const kakaoKey = (import.meta.env.VITE_KAKAO_JS_KEY ?? '').trim()
let pending: Promise<KakaoSdk> | undefined

export function loadKakaoShare(): Promise<KakaoSdk> {
  if (!kakaoKey) return Promise.reject(new Error('Kakao JavaScript key is not configured'))
  if (pending) return pending
  pending = new Promise<KakaoSdk>((resolve, reject) => {
    const initialize = () => {
      try {
        const sdk = window.Kakao
        if (!sdk) throw new Error('Kakao SDK unavailable')
        if (!sdk.isInitialized()) sdk.init(kakaoKey)
        resolve(sdk)
      } catch (error) { reject(error) }
    }
    if (window.Kakao) { initialize(); return }
    const script = document.createElement('script')
    const fail = () => {
      clearTimeout(timeout)
      script.onload = script.onerror = null
      script.remove()
      reject(new Error('Kakao SDK could not load'))
    }
    const timeout = window.setTimeout(fail, 12000)
    script.src = 'https://t1.kakaocdn.net/kakao_js_sdk/2.8.3/kakao.min.js'
    script.integrity = 'sha384-oroumrnFVE0xtgqyDZJARgERibXg2C28380uaUZz2kHDS5CR7tu20eGiOU6GkTpy'
    script.crossOrigin = 'anonymous'
    script.async = true
    script.onload = () => { clearTimeout(timeout); initialize() }
    script.onerror = fail
    document.head.append(script)
  }).catch(error => { pending = undefined; throw error })
  return pending
}
