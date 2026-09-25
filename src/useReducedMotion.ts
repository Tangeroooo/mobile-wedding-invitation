import { useSyncExternalStore } from 'react'

const query = '(prefers-reduced-motion: reduce)'
const snapshot = () => window.matchMedia(query).matches
const subscribe = (onChange: () => void) => {
  const preference = window.matchMedia(query)
  preference.addEventListener('change', onChange)
  return () => preference.removeEventListener('change', onChange)
}

export function useReducedMotion() {
  return useSyncExternalStore(subscribe, snapshot, () => false)
}
