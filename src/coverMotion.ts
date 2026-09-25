export function coverMotion(reducedMotion: boolean, largeType: boolean) {
  return {
    introHoldMs: reducedMotion ? 800 : 4200,
    introFadeMs: reducedMotion ? 150 : 900,
    waitForIntroLetters: !reducedMotion,
    waitForMainLetters: !reducedMotion && !largeType,
  }
}
