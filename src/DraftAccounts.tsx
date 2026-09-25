import { useId, useState } from 'react'
import type { DraftCopy } from './draftCopy'

export default function DraftAccounts({ copy }: { copy: DraftCopy }) {
  const [status, setStatus] = useState('')
  const [expanded, setExpanded] = useState<Record<string, boolean>>({})
  const id = useId()
  const groups = [
    { label: '신랑측', side: 'groom', accounts: [
      [copy.groomAccountName, copy.groomAccountBank, copy.groomAccountNumber],
      [copy.groomFamily1Name, copy.groomFamily1Bank, copy.groomFamily1Number],
      [copy.groomFamily2Name, copy.groomFamily2Bank, copy.groomFamily2Number],
    ] },
    { label: '신부측', side: 'bride', accounts: [[copy.brideAccountName, copy.brideAccountBank, copy.brideAccountNumber]] },
  ]
  const copyAccount = async (name: string, bank: string, account: string) => {
    try {
      await navigator.clipboard.writeText([bank.trim(), account.trim()].filter(Boolean).join(' '))
      setStatus(`${name}님의 은행명과 계좌번호를 복사했어요.`)
    } catch {
      setStatus('자동 복사가 지원되지 않아요. 은행명과 계좌번호를 직접 선택해 복사해주세요.')
    }
  }
  return <div className="draft-accounts">
    {groups.map(({ label, side, accounts }) => <div key={side} className={`draft-account-group ${side} ${expanded[side] ? 'is-open' : ''}`}>
      <button type="button" className="draft-account-trigger" id={`${id}-${side}-trigger`} aria-expanded={!!expanded[side]} aria-controls={`${id}-${side}-panel`} onClick={() => setExpanded(current => ({ ...current, [side]: !current[side] }))}>
        <span>{label} 계좌 안내</span><span className="draft-account-toggle" aria-hidden="true">＋</span>
      </button>
      <div className="draft-account-panel" id={`${id}-${side}-panel`} role="region" aria-labelledby={`${id}-${side}-trigger`} aria-hidden={!expanded[side]} inert={!expanded[side]}>
        <div className="draft-account-panel-inner"><ul>{accounts.filter(([, , number]) => number.trim()).map(([name, bank, number], index) => <li key={index}>
          <button type="button" className="draft-account-copy" aria-label={`${name} 은행명과 계좌번호 복사`} onClick={() => copyAccount(name, bank, number)}>
            <strong>{name}</strong><span className="draft-account-bank">{bank}</span><span className="draft-account-number">{number}</span><span className="draft-account-copy-label" aria-hidden="true">복사</span>
          </button>
        </li>)}</ul></div>
      </div>
    </div>)}
    <p className="draft-account-status" role="status" aria-live="polite">{status}</p>
  </div>
}
