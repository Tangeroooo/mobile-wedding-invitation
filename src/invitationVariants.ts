import { copyDefaults } from './draftCopy.ts'

export type InvitationVariant = 'main' | 'a' | 'b'

export function invitationCopy(variant: InvitationVariant) {
  const copy = { ...copyDefaults }
  if (variant === 'main') {
    copy.groomFamily1Name = copy.groomFamily1Bank = copy.groomFamily1Number = ''
    copy.groomFamily2Name = copy.groomFamily2Bank = copy.groomFamily2Number = ''
  }
  if (variant === 'b') {
    copy.groom = '주현'
    copy.bride = '하니'
    copy.brideParents = '오규식 · 박건자의 장녀'
    // Bank account holders retain their legal names for transfer verification.
  }
  return copy
}
