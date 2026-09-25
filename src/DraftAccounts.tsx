import { useState } from 'react'
import type { DraftCopy } from './draftCopy'

export default function DraftAccounts({ copy }: { copy: DraftCopy }) {
  const [status, setStatus] = useState('')
  const groups = [
    { label: '신랑측', side: 'groom', accounts: [
      [copy.groomAccountName, copy.groomAccountBank, copy.groomAccountNumber],
      [copy.groomFamily1Name, copy.groomFamily1Bank, copy.groomFamily1Number],
      [copy.groomFamily2Name, copy.groomFamily2Bank, copy.groomFamily2Number],
    ] },
    { label: '신부측', side: 'bride', accounts: [[copy.brideAccountName, copy.brideAccountBank, copy.brideAccountNumber]] },
  ]
  const copyAccount = async (name: string, account: string) => {
    try {
      await navigator.clipboard.writeText(account.replace(/[\s-]/g, ''))
      setStatus(`${name}님의 계좌번호를 복사했어요.`)
    } catch {
      setStatus('자동 복사가 지원되지 않아요. 계좌번호를 길게 눌러 복사해주세요.')
    }
  }
  return <div className="draft-accounts">
    {groups.map(({ label, side, accounts }) => <details key={side} className={`draft-account-group ${side}`}>
      <summary><span>{label} 계좌 안내</span><span className="draft-account-toggle" aria-hidden="true">＋</span></summary>
      <ul>{accounts.filter(([, , number]) => number.trim()).map(([name, bank, number], index) => <li key={index}>
        <div><strong>{name}</strong><span className="draft-account-bank">{bank}</span><span className="draft-account-number">{number}</span></div>
        <button type="button" aria-label={`${name} 계좌번호 복사`} onClick={() => copyAccount(name, number)}>복사</button>
      </li>)}</ul>
    </details>)}
    <p className="draft-account-status" role="status" aria-live="polite">{status}</p>
  </div>
}
