# Pinky’s Space — founder review implementation

An unpublished redesign of the existing static website. No build system or package installation is required.

Open `index.html` in a modern browser, or serve this directory with `python -m http.server 8000` and visit the URL printed by that command. No checkout is loaded by the homepage. The separate `checkout.html` loads the original Stripe button only after an explicit click.

- `content/archive.js`: chapter introductions and approved journal entries.
- `review/editor.html`: local form-based archive editor. Export the replacement content file; no build required. It has no server storage and does not publish.
- `assets/space.css`: responsive presentation and reduced-motion support.
- `assets/space.js`: chapter browsing, media rendering, and collection details.
- `review/FOUNDER-REVIEW.md`: audit, preservation record, limitations, and review instructions.
- `review/check.mjs`: dependency-free behavior checks; run `node review/check.mjs` from the project root.

The original `CNAME` and `pinky-final-wave.html` are unchanged. The published source checkpoint is GitHub commit `eca40d58c59d7f381bf6e18c67bb43ec16632509`.

**Do not merge or deploy until Magic × Wizard authorize publication.** The branch is a review draft. Authentic artwork and historical photography are still needed; no substitute historical imagery has been fabricated.
