import { parseCeremonyDate } from './draftDate'

export default function DraftCalendar({ dateValue }: { dateValue: string }) {
  const date = parseCeremonyDate(dateValue)
  if (!date) return null
  const year = date.getUTCFullYear(), month = date.getUTCMonth(), day = date.getUTCDate()
  const firstDay = new Date(Date.UTC(year, month, 1)).getUTCDay()
  const days = new Date(Date.UTC(year, month + 1, 0)).getUTCDate()
  const cells = Array.from({ length: Math.ceil((firstDay + days) / 7) * 7 }, (_, index) => {
    const value = index - firstDay + 1
    return value > 0 && value <= days ? value : null
  })
  return <table className="draft-calendar" aria-label={`${year}년 ${month + 1}월 예식 달력`}>
    <caption><span>{year}</span><strong>{String(month + 1).padStart(2, '0')}<small> / {date.toLocaleString('en-US', { month: 'long', timeZone: 'UTC' }).toUpperCase()}</small></strong></caption>
    <thead><tr>{['일', '월', '화', '수', '목', '금', '토'].map(label => <th key={label} scope="col">{label}</th>)}</tr></thead>
    <tbody>{Array.from({ length: cells.length / 7 }, (_, row) => <tr key={row}>{cells.slice(row * 7, row * 7 + 7).map((value, column) => <td key={column} className={value === day ? 'is-wedding-day' : undefined}>
      {value === day ? <span aria-label={`${month + 1}월 ${day}일, 결혼식`}><span aria-hidden="true">{value}</span><i aria-hidden="true">♥</i></span> : value}
    </td>)}</tr>)}</tbody>
  </table>
}
