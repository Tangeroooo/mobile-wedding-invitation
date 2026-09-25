# Invitation draft studio

URL: https://tangeroooo.github.io/mobile-wedding-invitation/draft/

This is an independent design workspace, not a replacement for the main, A or B invitation.
The Design Lab header links to it. The page is marked noindex, not password-protected.

- Intro: images/intro.jpg (the supplied filename; not into.jpg).
- Main cover: images/main.jpg.
- Generated photos: public/images/draft/*.webp; originals are ignored by Git.
- Black Rush: SVG outlines composed in the browser. The editor supports printable
  English letters, numbers and symbols, up to 100 characters / 3 lines. Curly quotes
  are normalized. Korean and other unsupported characters use a system-font SVG
  fallback and show a notice; input is never discarded for missing font glyphs.
- Select and drag lettering; double-click or Enter to edit in place. Arrow keys move
  it by 1%, Shift + arrow by 5%. Drag the corner to resize, or use the slider.
- Rotate via the top round handle, angle slider or numeric field (-180° to 180°).
  Shift-drag snaps rotation to 15°. Rotation persists per scene, including exports.
  Older settings without rotation load at 0°; old default ivory intro lettering
  automatically upgrades to the Design Lab yellow (#F4D84F) when loading local storage.
- Mobile editing controls open from the bottom-right button.
- Use the visible photo-level Edit/Done button for touch editing. Moving focus no
  longer dismisses the text editor. Empty text is a valid, saved hidden caption.
- Colors, text and percentage positions are saved only in localStorage, per browser.
  Export JSON and import it on another device to reproduce the draft. This does not
  update the shared defaults or any production invitation.
- Changes save synchronously, including empty captions and on page exit. A Save Now
  action and timestamps expose the result. Reload and font loading never rewrite
  the saved geometry; only deliberate edits trigger in-frame fitting.
- Shared defaults live in src/draftModel.ts. Apply an approved exported configuration
  there before publishing the final invitation.
- Gallery is a compact eight-slot memory board using the two supplied photos and
  six empty frames, mixing portrait, landscape and square shapes in unequal sizes.
  White borders only: no tape or captions. The viewport-aware board fits a single
  mobile screen with its heading. Each print flies in and settles with a small
  bounce. Real photos retain lazy thumbnails and the existing lightbox.
- Preview scroll entrances combine masked heading reveals, scale/rotation on cards,
  a turning flower and staggered copy. Each element enters once per preview replay;
  editor mode shows the resting layout. Reduced-motion changes are handled live.
- Section 02 shows a small D-Day badge to the right of its title (D-Day on the day,
  D+N afterwards). The date and time text share the same size.
- A small glass-blurred schedule summary follows the invitation's center-right edge.
  It uses the edited date, time and venue; pointer events pass through it. It fades
  away only when its actual screen rectangle overlaps the calendar card; section
  headings do not trigger it. It stays visible over accounts and maps without
  intercepting taps. Account copy icons align immediately after the number column.
- The small button below the calendar opens an ICS event using the edited
  names, date/time and venue, with Korean time converted to UTC. No end time or
  reminder is invented; saving the event is left to the visitor's calendar app.
  Shared defaults are emitted as calendar/wedding.ics at build time. Edited local
  drafts use a text/calendar Blob. No download attribute forces a download; the
  device/browser decides whether to open its calendar handler or save the file.
- The main cover caption and arrow float gently; reduced-motion settings disable it.
- Section 06 (attendance placeholder) is removed in edit and preview modes. Legacy
  saved copy is retained for compatibility, but is no longer rendered or editable.
- Both floating glass surfaces use 20% tinted backgrounds with backdrop blur.
- BGM has a minimal 58 × 28 glass-effect music icon and switch inside the invitation,
  anchored to its top-right edge while scrolling, with a 44px-tall touch target and no
  visible labels. No music is bundled yet: the switch previews the sound preference
  without audio requests. Add a licensed file under public/audio/ and set its
  base-path-aware URL in src/draftMusic.ts to connect it. Playback starts only after
  a tap; with a source connected, checked reflects playback and unchecked pauses.
  Hiding the page pauses playback. Playback errors are announced to screen readers.
- Ceremony: November 7, 2026 (Saturday), 19:20 KST, 더링크호텔 3층 베일리홀.
  Year assumed to be the upcoming November; confirm before final publication.
- Venue address: 서울특별시 구로구 경인로 610, verified against the official listing:
  https://www.marriott.com/en-us/hotels/seltx-the-link-seoul-a-tribute-portfolio-hotel/overview/
  A lazy-loaded Naver static map (official image download) and Naver/Kakao map links
  are included in the draft only. Buttons use the providers' official site/app icons.
  The unmodified map image has a visible Naver credit and opens Naver Map on tap.
  Map pin (37.5052943, 126.8838555) comes from the official listing's View Map link.
- Couple: 정주현 & 임하니. The accounts section has separate expandable groom/bride
  groups and per-account copy buttons (bank name + account number, preserving hyphens); a failed clipboard request gives
  manual-copy guidance. All account fields remain editable and are included in JSON
  exports. Publishing the supplied names/accounts to the public repository and draft
  page was explicitly approved by the user. RSVP details are still pending.
- Date is a monthly calendar with the ceremony day highlighted. Editable date and
  time fields drive the calendar, weekday and displayed time from one source.
  Existing saved photo layouts and custom text are preserved; only the original
  name/RSVP placeholders migrate to the new defaults.
- Every body section has a collapsible copy editor, including labels, headings,
  names, date display, gallery captions, transport notes, and footer. Source defaults
  live in src/draftCopy.ts. Empty strings are valid; line breaks are preserved.
  Copy is saved/exported with the existing configuration; legacy files merge defaults.
  Venue name/hall are shared by the date and directions sections. Changing address
  text updates search links but does not move the map pin; the editor states this.
- Dedicated preview URL: /draft/?mode=preview. The mode survives reload and browser
  back/forward. It omits all editors, and a second tab follows same-browser saved edits
  through storage events without writing stale preview data back to storage.
  Preview links do not transfer local edits to another device; use JSON export/import.

Regenerate derivatives: `node scripts/prepare-draft.mjs`.
Optionally pass a local Blackrush.ttf path to rebuild the outline data. See asset notices.

Verification: `npm run build`, `npm run lint`, `npm run test:draft`.
The browser tests use installed Chrome; start the dev server first.
