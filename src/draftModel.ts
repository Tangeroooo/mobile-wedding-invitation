import { copyDefaults } from './draftCopy'
import type { CopyKey, DraftCopy } from './draftCopy'
import { parseCeremonyDate, validCeremonyTime } from './draftDate'
export type Scene = 'intro' | 'main'
export type Lettering = { text: string; x: number; y: number; width: number; color: string; rotation: number }
export type DraftConfig = {
  version: 1
  intro: Lettering
  main: Lettering
  palette: { background: string; blue: string; pink: string }
  copy: DraftCopy
}
export const storageKey = 'wedding-draft-v1'
export const defaults: DraftConfig = {
  version: 1,
  // Approved snapshot exported from Zen on 2026-09-25; percentages stay exact.
  intro: { text: "We're getting\nmarried", x: 51, y: 24.209302325581397, width: 94, color: '#F4D84F', rotation: -8 },
  main: { text: 'Wedding\nInvitation', x: 50, y: 16.88372093023256, width: 76.32558139534883, color: '#203F76', rotation: 0 },
  palette: { background: '#F4F4F0', blue: '#274D85', pink: '#B94470' },
  copy: { ...copyDefaults },
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
    if (block?.rotation !== undefined && (typeof block.rotation !== 'number' || !Number.isFinite(block.rotation) || Math.abs(block.rotation) > 180)) {
      throw new Error('회전 각도는 -180°에서 180° 사이여야 합니다.')
    }
    if (!block || typeof block.text !== 'string' || block.text.length > 100
      || block.text.split('\n').length > 3 || !color(block.color)
      || ![block.x, block.y, block.width].every(value => typeof value === 'number' && Number.isFinite(value))
      || block.x < 0 || block.x > 100 || block.y < 0 || block.y > 100 || block.width < 25 || block.width > 94) {
      throw new Error('문구는 100자 / 3줄 이내로 입력하고 위치·색상을 확인해주세요.')
    }
  }
  const copy = { ...copyDefaults }
  if (item.copy !== undefined) {
    if (!item.copy || typeof item.copy !== 'object' || Array.isArray(item.copy)) throw new Error('본문 문구 형식을 확인해주세요.')
    for (const key of Object.keys(copyDefaults) as CopyKey[]) {
      const value = item.copy[key]
      if (value === undefined) continue
      if (typeof value !== 'string' || value.length > 1000) throw new Error('본문 문구는 항목당 1,000자까지 입력할 수 있어요.')
      copy[key] = value
    }
  }
  // Replace only the original placeholders, preserving custom copy and layout.
  const previousCopy: Partial<DraftCopy> = {
    footerLabel:'BLUE MEETS PINK.',
    greetingTitle:'우리의', greetingAccent:'가장 좋은 날.',
    greetingMessage:'서로의 일상에 가장 다정한 사람이 되어\n이제, 함께하는 내일을 시작합니다.',
    greetingInvite:'소중한 여러분을\n우리의 시작에 초대합니다.',
    dateTitle:'함께할', dateAccent:'그날의 약속.', galleryTitle:'우리라는', galleryAccent:'장면들.',
  }
  for (const key of Object.keys(previousCopy) as CopyKey[]) {
    if (copy[key] === previousCopy[key]) copy[key] = copyDefaults[key]
  }
  if (copy.galleryAccent === '빛나는 순간들.' || copy.galleryAccent === '빛나는 순간들') copy.galleryAccent = copyDefaults.galleryAccent
  if (copy.galleryMessage === '함께 웃던 순간을 모아.') copy.galleryMessage = copyDefaults.galleryMessage
  if (copy.footerLabel === '이 모든 것 위에 사랑을 더하라\n이는 온전하게 매는 띠니라\n\n골로새서 3:14') copy.footerLabel = copyDefaults.footerLabel
  if (copy.groom === '신랑 이름') copy.groom = copyDefaults.groom
  if (copy.bride === '신부 이름') copy.bride = copyDefaults.bride
  if (copy.venueName === '더링크호텔') copy.venueName = copyDefaults.venueName
  if (copy.rsvpMessage === '참석 여부와 마음 전하실 곳은\n정보가 정해지면 연결할 예정입니다.') copy.rsvpMessage = copyDefaults.rsvpMessage
  if (!parseCeremonyDate(copy.ceremonyDate) || !validCeremonyTime(copy.ceremonyTime) || !validCeremonyTime(copy.ceremonyEndTime)) throw new Error('예식 날짜와 시간을 확인해주세요.')
  return {
    version: 1,
    intro: { ...item.intro, text: normalizeText(item.intro.text), rotation: item.intro.rotation ?? 0 },
    main: { ...item.main, text: normalizeText(item.main.text), rotation: item.main.rotation ?? 0 },
    palette: { background: item.palette.background, blue: item.palette.blue, pink: item.palette.pink },
    copy,
  }
}
