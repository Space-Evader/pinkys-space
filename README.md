# Pinky’s Space

The static Pinky’s Space art and culture website. The website needs no build step or runtime package installation. Reproducible validation uses this project's pinned development dependencies.

Publication of the reviewed Wearable Art site was authorized on October 30, 2026, with continued review and iteration after release. The work continues `codex/pinkys-universe-review` from `b46ad03383a229ff3b202fda1f9832baf81181ce`. See the [release record](review/RELEASE-2026-10-30.md) and [inventory/source limitations](review/fashion/MISSING-AND-READINESS.md).

- `fashion.html`: editorial fashion archive with 71 exact names, 79 provisional source groups and 716 historical variants, plus 25 distinct HatsRx design references. Search/category filters enhance complete static HTML.
- `content/fashion-inventory.json`: full recovered historical wearable inventory; current commerce fields remain unverified.
- `content/related-brand-catalog.json`: separate official HatsRx source records.
- `review/fashion/source-manifest.json` and `review/fashion/inventory-summary.csv`: source scope, access limits, provenance and inventory summary.
- `review/build-fashion.py`: optional deterministic regeneration of the checked-in fashion HTML from its two JSON source files.
- `content/identity.js`, `assets/hotline.js`, `assets/hotline.css`: verified original-logo and Big Chef Dog integration. The floating guide uses the supplied Halloween portrait and approved copy, with a call button for the owner-confirmed Google Voice number (347) 635-4690. See [identity provenance and hotline status](review/HOTLINE-ASSETS.md).

Open `index.html` in a modern browser, or serve this directory with `python -m http.server 8000` and visit the URL printed by that command. No checkout is loaded by the homepage. The separate `checkout.html` loads the original Stripe button only after an explicit click.

- `content/archive.js`: chapter introductions and approved journal entries.
- `content/portfolio.js`: the 23 supplied portfolio images with descriptive captions, alt text, dimensions, and responsive sources.
- `review/editor.html`: local form-based archive editor. Export the replacement content file; no build required. It has no server storage and does not publish.
- `assets/space.css`: responsive presentation and reduced-motion support.
- `assets/space.js`: chapter browsing, media rendering, and collection details.
- `assets/portfolio.js`: full-image dialog, previous/next and keyboard navigation, and gallery disclosure after the first eight images.
- `assets/portfolio/`: 46 optimized WebP derivatives at 640 and 1600 pixels on the longest edge. Original files remain unchanged outside the source tree.
- `review/FOUNDER-REVIEW.md`: audit, preservation record, limitations, and review instructions.
- `review/check.mjs`: dependency-free behavior checks; run `node review/check.mjs` from the project root.
- `review/check-portfolio.mjs`: dependency-free gallery checks; run `node review/check-portfolio.mjs` from the project root.
- `review/check-source.py` and `review/check-css.mjs`: HTML, local assets, JavaScript syntax, portfolio completeness, and CSS validation.
- [Image source record](review/image-sources.json): original and derivative hashes, dimensions, and processing details; no Drive sharing keys.
- [Browser results](review/browser-results.json) and [six screenshots](review/screenshots/): automated Chromium checks at desktop and mobile sizes.

To reproduce the checks from the project root, with Node, npm, Python 3, and an installed Chromium:

```sh
npm ci
npm run validate
npm run browser-check
npm run fashion-check
```

The browser check defaults to `/usr/bin/chromium`. To select another installed browser executable, run `CHROMIUM_PATH=/path/to/chromium npm run browser-check`. No browser download is required. Source checks and automated real-browser checks passed with Chromium 154.0.8037.57 and the project-pinned Playwright Core 1.57.0. The checks use this checkout's dependencies, without packages from another project.

The original `CNAME` and `pinky-final-wave.html` are unchanged. The previous production checkpoint is GitHub commit `eca40d58c59d7f381bf6e18c67bb43ec16632509`.

All 23 photos from the supplied Drive portfolio are integrated in the gallery. Image 19 also anchors the entrance and the Artists archive chapter. Captions describe visible content; no unverified artwork titles, artist credits, or matches to the five priced products have been assumed. Derivatives retain the full image without cropping or creative alteration and omit EXIF metadata. The complete derivative set is 7,751,884 bytes (about 7.4 MiB); responsive loading avoids requesting every size at once.

Earlier artwork release notes below describe the prior checkpoint. The owner has now authorized publication of the reviewed fashion archive and original identity integration. Exact artwork titles and credits, historical garden/venue photographs, current Square product mapping and continued founder visual review remain open. The original logo and dog portrait were subsequently supplied and are integrated faithfully. No substitute historical or product imagery has been fabricated.
