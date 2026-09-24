# Invitation draft studio

URL: https://tangeroooo.github.io/mobile-wedding-invitation/draft/

This is an independent design workspace, not a replacement for the main, A or B invitation.
The Design Lab header links to it. The page is marked noindex, not password-protected.

- Intro: images/intro.jpg (the supplied filename; not into.jpg).
- Main cover: images/main.jpg.
- Generated photos: public/images/draft/*.webp; originals are ignored by Git.
- Black Rush: SVG outlines composed in the browser. The editor supports printable
  English letters, numbers and symbols, up to 100 characters / 3 lines. Curly quotes
  are normalized. Unsupported characters produce a visible message.
- Select and drag lettering; double-click or Enter to edit in place. Arrow keys move
  it by 1%, Shift + arrow by 5%. Drag the corner to resize, or use the slider.
- Rotate via the top round handle, angle slider or numeric field (-180° to 180°).
  Shift-drag snaps rotation to 15°. Rotation persists per scene, including exports.
  Older settings without rotation load at 0°; old default ivory intro lettering
  automatically upgrades to the Design Lab yellow (#F4D84F) when loading local storage.
- Mobile editing controls open from the bottom-right button.
- Colors, text and percentage positions are saved only in localStorage, per browser.
  Export JSON and import it on another device to reproduce the draft. This does not
  update the shared defaults or any production invitation.
- Shared defaults live in src/draftModel.ts. Apply an approved exported configuration
  there before publishing the final invitation.
- Gallery is provisional (two supplied photos), with lazy thumbnails and a lightbox.
- Event names, date/time, venue, RSVP and account information are not yet supplied.

Regenerate derivatives: `node scripts/prepare-draft.mjs`.
Optionally pass a local Blackrush.ttf path to rebuild the outline data. See asset notices.

Verification: `npm run build`, `npm run lint`, `npm run test:draft`.
The browser tests use installed Chrome; start the dev server first.
