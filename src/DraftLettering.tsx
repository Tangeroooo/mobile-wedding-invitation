import { useId } from 'react'
import { normalizeText } from './draftModel'

type Glyph = { path: string; advance: number; bounds: { x1: number; y1: number; x2: number; y2: number } }
export type Outlines = { glyphs: Record<string, Glyph>; kerning: Record<string, number> }

export default function DraftLettering({ text, color, outlines, animate }: {
  text: string; color: string; outlines: Outlines; animate: boolean
}) {
  const id = useId()
  const lines = normalizeText(text).split('\n').slice(0, 3).map(line => {
    let cursor = 0
    let previous = ''
    const paths: Array<{ d: string; x: number; fallback?: string }> = []
    let left = 0, right = 0, top = 0, bottom = 0
    for (const char of line) {
      const glyph = outlines.glyphs[char]
      if (!glyph) {
        paths.push({ d: '', x: cursor, fallback: char })
        right = Math.max(right, cursor + 100); top = Math.min(top, -90); bottom = Math.max(bottom, 15)
        cursor += 100; previous = ''; continue
      }
      cursor += outlines.kerning[previous + char] ?? 0
      if (glyph.path) {
        paths.push({ d: glyph.path, x: cursor })
        left = Math.min(left, cursor + glyph.bounds.x1)
        right = Math.max(right, cursor + glyph.bounds.x2)
        top = Math.min(top, glyph.bounds.y1)
        bottom = Math.max(bottom, glyph.bounds.y2)
      }
      cursor += glyph.advance
      previous = char
    }
    return { paths, left, top, width: Math.max(right - left, 20), height: Math.max(bottom - top, 50) }
  })
  const padding = 16
  const width = Math.max(...lines.map(line => line.width)) + padding * 2
  const height = lines.reduce((sum, line) => sum + line.height + padding, padding)
  let offset = padding
  if (!text.trim()) return <svg className="draft-letter-svg" viewBox="0 0 600 140" role="img" aria-label="빈 문구" />
  return <svg className="draft-letter-svg" viewBox={`0 0 ${width} ${height}`} role="img" aria-label={text}>
    <title>{text}</title>
    {lines.map((line, index) => {
      const y = offset - line.top
      offset += line.height + padding
      return <g key={`${id}-${index}`} transform={`translate(${(width - line.width) / 2 - line.left},${y})`} fill={color}>
        <g className={animate ? 'draft-write' : undefined} style={{ animationDelay: `${0.3 + index * 1.1}s` }}>
          {line.paths.map((path, glyphIndex) => path.fallback
            ? <text key={glyphIndex} x={path.x} y={0} fontSize="90" fontFamily="sans-serif">{path.fallback}</text>
            : <path key={glyphIndex} d={path.d} transform={`translate(${path.x},0)`} />)}
        </g>
      </g>
    })}
  </svg>
}
