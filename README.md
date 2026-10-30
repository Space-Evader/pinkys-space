# Pinky’s Space — founder review implementation

An unpublished redesign of the existing static website. The website needs no build step or runtime package installation. Reproducible validation uses this project's pinned development dependencies.

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
```

The browser check defaults to `/usr/bin/chromium`. To select another installed browser executable, run `CHROMIUM_PATH=/path/to/chromium npm run browser-check`. No browser download is required. Source checks and automated real-browser checks passed with Chromium 154.0.8037.57 and the project-pinned Playwright Core 1.57.0. The checks use this checkout's dependencies, without packages from another project.

The original `CNAME` and `pinky-final-wave.html` are unchanged. The published source checkpoint is GitHub commit `eca40d58c59d7f381bf6e18c67bb43ec16632509`.

All 23 photos from the supplied Drive portfolio are integrated in the gallery. Image 19 also anchors the entrance and the Artists archive chapter. Captions describe visible content; no unverified artwork titles, artist credits, or matches to the five priced products have been assumed. Derivatives retain the full image without cropping or creative alteration and omit EXIF metadata. The complete derivative set is 7,751,884 bytes (about 7.4 MiB); responsive loading avoids requesting every size at once.

**Do not merge or deploy until Magic × Wizard authorize publication.** The branch is a review draft. Exact artwork titles and credits, historical garden/venue photographs, and founder visual review remain open. The next archive addition can be just three to five original venue/garden photos with a true brief caption, approximate date, and photo credit where known. No substitute historical imagery has been fabricated.
