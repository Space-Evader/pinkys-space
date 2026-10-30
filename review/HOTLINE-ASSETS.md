# Original identity and Big Chef Dog integration

Updated October 30, 2026. Draft only; no publication, merge or telephone number has been added.

The user supplied the original Pinky’s Space logo (`1000002955.jpg`, 812 × 1280) and Big Chef Dog Halloween portrait (`1000002978.jpg`, 960 × 1280) after the initial catalog audit. Both were visually inspected and copied byte-for-byte to `assets/identity/`. [identity-sources.json](identity-sources.json) records original filenames, exact SHA-256 hashes, byte counts, dimensions and user-supplied provenance. No crop, redraw, filters, recoloring or generative editing was applied. The original frames and embedded color profiles remain intact; the supplied JPEGs contain no EXIF tags.

The original logo appears as a historical signature on the homepage’s Wearable Art entry and in the fashion-page entrance. Its image is displayed at its native aspect ratio. The existing artwork-led homepage and interface wordmark are preserved.

The discreet floating guide uses the original portrait, the approved greeting and message copy, and links to the existing Unexpected and Art chapters. It makes no AI calls, collects no messages, stores no data and does not simulate delivery. The complete portrait is shown in the button and dialog with `object-fit: contain`; it is not cut into a cropped avatar.

## Telephone status

The full Google Voice number ending in 212 is still unverified. `content/identity.js` leaves `publicTelephone` null. No `tel:` link or personal contact candidate appears in the draft. The dialog states that the telephone link is not available yet.

The authentic portrait enables the non-AI guide independently of telephone access. A telephone link is added only when the configured full E.164 number ends in 212, has dated source evidence, and is explicitly confirmed suitable for public hotline use. This implements the user’s existing authorization; it does not introduce a new approval requirement. No unrelated footer number is used as a substitute.

The original-logo and portrait fields require local image paths, actual dimensions, dated source references and explicit original-asset authenticity flags. Missing or unverified originals remain gated. Removing both assets from configuration leaves the normal guide dormant rather than substituting artwork.

## Review and QA

Open `index.html` or `fashion.html` locally to review the normal portrait launcher. Local `?hotline-preview=1` remains available on localhost, 127.0.0.1 or local files; it is not enabled by that query on public hostnames. Preview mode shows the supplied portrait and approved copy without telephone access.

- Original logo mount: `[data-original-logo]`.
- Launcher: `#chef-launcher`; dialog: `#chef-dialog`; close: `#chef-close`.
- Greeting: `#chef-greeting`; approved second paragraph: `.chef-message`.
- Portraits: `.chef-launcher-portrait` and `.chef-portrait`.
- Telephone anchor: `#chef-call`, absent while the public number is unverified.
- Existing story/art links: `.chef-routes a`.

Browser checks verify original file hashes, natural dimensions and decoding, complete-frame styles, normal and preview guide interactions, exact approved copy, Tab containment, Escape/Close, focus restoration, no telephone link, missing-asset fallback and responsive widths. Current screenshots and results are linked in [fashion verification](fashion/VERIFICATION.md).
