export type Scene = 'intro' | 'main'
export type Lettering = { text: string; x: number; y: number; width: number; color: string }
export type DraftConfig = {
  version: 1
  intro: Lettering
  main: Lettering
  palette: { background: string; blue: string; pink: string }
}
export const storageKey = 'wedding-draft-v1'
export const defaults: DraftConfig = {
  version: 1,
  intro: { text: "We're getting\nmarried", x: 50, y: 22, width: 86, color: '#FFF5DE' },
  main: { text: 'Wedding\nInvitation', x: 65, y: 77, width: 64, color: '#203F76' },
  palette: { background: '#F4F4F0', blue: '#274D85', pink: '#B94470' },
}
export const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value))
export const normalizeText = (text: string) => text.replace(/[‘’]/g, "'").replace(/[“”]/g, '"').replace(/[–—]/g, '-')
export const isSupportedText = (text: string) => /^[\x20-\x7e\n]*$/.test(normalizeText(text))

export function parseConfig(raw: unknown): DraftConfig {
  if (!raw || typeof raw !== 'object') throw new Error('초안 설정 파일이 아닙니다.')
  const item = raw as DraftConfig
  const color = (value: unknown) => typeof value === 'string' && /^#[\da-f]{6}$/i.test(value)
  if (item.version !== 1 || !item.palette || !Object.values(item.palette).every(color)
    || !['background', 'blue', 'pink'].every(key => color(item.palette[key as keyof DraftConfig['palette']]))) {
    throw new Error('색상 또는 파일 형식을 확인해주세요.')
  }
  for (const scene of ['intro', 'main'] as const) {
    const block = item[scene]
    if (!block || typeof block.text !== 'string' || block.text.length > 100 || !block.text.trim()
      || block.text.split('\n').length > 3 || !isSupportedText(block.text) || !color(block.color)
      || ![block.x, block.y, block.width].every(value => typeof value === 'number' && Number.isFinite(value))
      || block.x < 0 || block.x > 100 || block.y < 0 || block.y > 100 || block.width < 25 || block.width > 94) {
      throw new Error('문구는 영문·숫자·기호 100자 / 3줄 이내로 입력해주세요.')
    }
  }
  return {
    version: 1,
    intro: { ...item.intro, text: normalizeText(item.intro.text) },
    main: { ...item.main, text: normalizeText(item.main.text) },
    palette: { background: item.palette.background, blue: item.palette.blue, pink: item.palette.pink },
  }
}
