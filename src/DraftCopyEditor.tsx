import { copyGroups } from './draftCopy'
import type { CopyKey, DraftCopy } from './draftCopy'

export default function DraftCopyEditor({ group, copy, onChange, saveState }: {
  group: string; copy: DraftCopy; onChange: (key: CopyKey, value: string) => void; saveState: string
}) {
  const { title, fields } = copyGroups[group]
  return <details className="draft-copy-editor" id={`edit-${group}`}>
    <summary>{title} 문구 편집 ✎</summary>
    <div className="draft-copy-fields">
      <p>입력하면 바로 반영돼요. 빈칸으로 두면 해당 문구를 숨깁니다.</p>
      {fields.map(([key, label]) => <label key={key}>{label}<textarea aria-label={`${title} · ${label}`} value={copy[key]} rows={copy[key].includes('\n') ? 3 : 2} maxLength={1000} onChange={event => onChange(key, event.target.value)} /></label>)}
      {group === 'date' && <p>날짜 큰 글씨와 날짜·시간 안내를 함께 수정해주세요.</p>}
      {group === 'location' && <p>예식장·홀은 날짜 카드에도 반영됩니다. 지도 핀은 더링크호텔 위치로 고정되어 있어요. 다른 장소로 바꿀 때는 핀도 별도로 변경해야 합니다.</p>}
      <p role="status">{saveState}</p>
    </div>
  </details>
}
