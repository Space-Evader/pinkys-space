# Pinky’s Space — founder review

Prepared October 30, 2026. Status: working, unpublished visual and interaction draft with all 23 supplied portfolio photos integrated. Automated source and real-browser checks passed. Exact artwork titles and credits, historical garden/venue photography, and founder visual review remain open.

## What is ready to review

The entrance uses electric pink, large editorial type, a static star, and an original artwork photograph in a dark frame. Portfolio image 19 anchors this entrance and appears in the Artists archive chapter. Icons use inline SVG for consistent rendering; hero spacing has been adjusted for the checked desktop and mobile layouts. Clear routes lead into Pinky’s Days and the artwork gallery. The site continues through the East Village origin story, seven browsable archive chapters, the garden, the 23-image portfolio, the priced collection, the central creative statement, and contact.

Chapter history comes from the supplied brief. No dates beyond the supplied pandemic context, visitor quotes, artist identities, individual memories, or historical photographs have been invented. The typographic motifs are interface decoration, not presented as collection artwork. Google Photos links initially could not be read because the web reader failed and direct access was blocked by outbound network policy (HTTP CONNECT 403). The user subsequently supplied a connected Drive folder; all 23 image files were downloaded and visually inspected. Media access is now working through Drive. Album sharing URLs and keys have not been copied into this public repository.

All 23 supplied images now appear in a separate portfolio gallery. Captions and alt text describe visible content; they do not assert artwork titles, artist or photographer identities, dates, or product matches. None of these images has been assigned to the five existing priced works without matching evidence. Historical photographs establishing the restaurant, garden, or venue context are still unconfirmed.

The source includes 46 responsive WebP derivatives at 640 and 1600 pixels on the longest edge, totaling 7,751,884 bytes (about 7.4 MiB). The full-size image 19 derivative is 167,272 bytes. The originals remain unchanged outside the source tree. Optimized derivatives strip EXIF metadata and preserve the complete image without cropping or creative alteration. [image-sources.json](image-sources.json) records source and derivative hashes, dimensions, and processing details without exposing Drive sharing keys.

The gallery initially displays eight images and offers a “Show all 23 images” control. Its native dialog supports previous/next, left/right arrow navigation, an explicit Tab cycle within its controls, Escape/Close, and restoration of focus to the opening image link. The Tab cycle handles Chromium's native dialog focus transition out of the document. With JavaScript disabled, all 23 full-image links remain available.

The archive supports credited images, captions, stories, dates or known periods, and external video/interview links. It now supports actual pixel dimensions and validated responsive image variants; a neutral frame reserves space when dimensions are unknown. Chapter navigation focuses the heading without announcing the entire photo journal as a live region. Collection detail buttons have work-specific accessible names. The local editor exports an updated archive.js; replacing that file and approved assets requires no rebuild. It is a file-based workflow, not an authenticated CMS or an automatic publishing system. Changes are held in the editor tab until exported.

## Source and published baseline

Repository: https://github.com/Space-Evader/pinkys-space

Published source: `eca40d58c59d7f381bf6e18c67bb43ec16632509`.

Evidence: the successful GitHub Pages run https://github.com/Space-Evader/pinkys-space/actions/runs/24486965580 deployed that exact SHA from main. The repository reports GitHub Pages enabled; its CNAME contains pinkysspace.com. Its index content matches the live page inspected via the web connector.

The published baseline tree contains four source files: index.html, pinky-final-wave.html, README.md, and CNAME. There are no image assets, package manifests, build dependencies, or custom workflow files in that baseline. Both HTML pages were inspected. The alternate pinky-final-wave.html includes its own additional archive concepts and contact destination; it remains unchanged.

The executor’s proxy was unavailable for Git cloning. The GitHub connector was used to read the exact repository files instead. Their Git blob hashes were verified locally. The local baseline branch is a byte-exact source snapshot with a new local checkpoint commit, not a clone of upstream history. The remote review commit is based on the real upstream commit.

Baseline blob hashes:

| File | Git blob SHA |
| --- | --- |
| index.html | 23ead29e67108e4e86a134c85a96d73ae1a99f38 |
| pinky-final-wave.html | 1b132b6dcfbbaa4a94f64700f2a8bee058642a47 |
| README.md | b8199f8f121123aab641b15f04c413d1dc3217d0 |
| CNAME | 92f35745295df6e529e320c40716e89909fd135b |

## Domains and commerce

| Destination | Observed relationship | Treatment |
| --- | --- | --- |
| https://pinkysspace.com | Current living archive site, backed by the repository and GitHub Pages evidence above | Production unchanged |
| https://pinkys.space | Web inspection redirected to https://pinkysspace.square.site/ | Companion-domain destination retained |
| https://pinkysspace.square.site/ | Existing Square storefront; available crawl exposed only a minimal image, not a product catalog | Storefront links retained; inventory, checkout and account configuration untouched |
| Stripe buy button | index.html also configures a live Stripe button for Double Heart Transmission | Exact original button ID and publishable key retained in checkout.html, loaded on request |

Square and Stripe are separate observed commerce destinations. The published source contains no evidence that their product catalogs or inventory are synchronized. No such integration has been assumed or added. No transaction, product creation, price update, inventory update, DNS write, or deployment was performed.

The redesigned collection preserves all five titles, descriptions and listed print prices:

| Work | Print price | Original note |
| --- | --- | --- |
| Double Heart Transmission | $88 | Original available upon request |
| Origin Carrier | $111 | Original available upon request |
| Gold Vein Memory | $222 | Not specified in baseline |
| Signal Portal | $333 | Not specified in baseline |
| Night Mode / Eye Signal | $222 | Not specified in baseline |

The existing source’s future shop categories are retained under “Beyond the current collection.” Original full source is preserved in the baseline checkpoint/archive. Existing #about, #gallery, #shop, #contact, #collection and #top anchors continue to resolve. #gallery now identifies the actual artwork portfolio; #shop maps to the priced collection. Main-page email and Instagram destinations are retained.

## Findings and changes

| Baseline finding | Review implementation |
| --- | --- |
| CSS mobile media block lacks its closing brace; hero containers and collection markup are malformed | Balanced document and CSS, responsive layouts at 650px and 1000px |
| Gallery consists of six CSS placeholders and explicitly calls itself a placeholder | All 23 supplied portfolio photos, responsive full-image views, and seven history chapters with support for additional verified media |
| Four Collect buttons open #collection in a new tab, never reaching checkout | Work details and specific email inquiries; explicit Square link |
| All Inquire buttons point to #about | Work-specific email subject lines |
| Contact form only displays a placeholder alert, without sending or storing a message; inputs lack labels | Direct email and Instagram contact links; no simulated delivery |
| Unconditional ticker animation and smooth scrolling lack reduced-motion handling | Static decorative star; smooth scrolling disabled for reduced-motion preference |
| Focus outlines removed on fields; no skip link; repeated ambiguous links | Visible focus, skip link, named navigation, labeled native dialog, modal focus restoration |
| External Stripe script is requested immediately | External checkout script loads only after a visitor asks to load the existing button |
| Typography is system Arial/Helvetica with no external font dependency | System sans-serif with Georgia editorial emphasis; no font requests |

The baseline findings are source-based. The updated draft also passed the automated Chromium rendering and interaction checks below. These do not establish a comprehensive accessibility audit, measured Core Web Vitals, live checkout availability, or WCAG conformance.

## Validation completed

- Node syntax checks for application code, archive and portfolio data, editor script and checkout script.
- Balanced HTML, unique IDs, internal link targets and local asset paths checked for all three new HTML entrypoints.
- CSS and inline styles parsed using this project's pinned PostCSS 8.5.6 dependency.
- Dependency-free behavioral checks passed for all seven chapters, navigation history, media URLs, literal text rendering, rejection of unsafe media schemes, five product details, prices, inquiry destinations, and dialog close/focus callbacks.
- Portfolio behavior checks passed for disclosure after eight images, full-image viewing, literal captions, wrapping previous/next navigation, keyboard controls, focus restoration, backdrop closing, modified link gestures, unsafe-source rejection, and native-link fallback.
- All 23 supplied image files were visually inspected; the 46 optimized derivatives have explicit dimensions and responsive sources. The self-contained source check verifies each derivative’s byte count, SHA-256, Git blob SHA, and RIFF/WebP header and length against the image-source record.
- All four original baseline blobs verified against GitHub’s reported hashes.
- Automated real-browser checks passed with system Chromium 154.0.8037.57 and this project's pinned Playwright Core 1.57.0. All 46 WebP variants decoded at their declared widths, and all 23 portfolio images decoded successfully after disclosure. Gallery previous/next controls, arrow keys, Tab containment, Escape, and focus restoration passed; all seven archive headings were reachable by keyboard.
- Browser checks confirmed the five product prices and inquiry destinations, retained Square/companion-domain/checkout links, desktop/mobile main navigation, reduced-motion handling, and the no-JavaScript gallery fallback. The homepage produced no external requests or browser errors. Checkout remains opt-in; no transaction was attempted.
- No horizontal overflow was detected at viewport widths of 320, 390, 650, 768, 1024, or 1440 pixels.
- No third-party script is requested by the homepage. Its HTML, CSS, scripts, content data and favicon total 88,966 bytes before compression, excluding the WebP derivatives. The complete derivative set is about 7.4 MiB; the hero is prioritized while below-fold images load lazily and responsive variants reduce smaller-screen transfers. No real performance measurement is implied.

The checks are reproducible from the project root with Node, npm, Python 3, and an installed Chromium:

```sh
npm ci
npm run validate
npm run browser-check
```

`npm run validate` checks source structure, syntax, local assets, CSS, and application behavior. `npm run browser-check` launches a temporary local server and runs the real-browser checks, then closes its server and browser. It defaults to `/usr/bin/chromium`; use `CHROMIUM_PATH=/path/to/chromium npm run browser-check` for another installed executable. The dependencies and lockfile belong to this project; packages from another checkout are not needed. No browser download is required.

[browser-results.json](browser-results.json) records the tested browser, viewports, assertions, and screenshot paths. The six captured PNGs have these exact dimensions:

| View | Desktop, 1440 × 1000 | Mobile, 390 × 844 |
| --- | --- | --- |
| Homepage | [Desktop entrance](screenshots/homepage-desktop.png) | [Mobile entrance](screenshots/homepage-mobile.png) |
| Gallery | [Desktop gallery](screenshots/gallery-desktop.png) | [Mobile gallery](screenshots/gallery-mobile.png) |
| Artwork viewer | [Desktop viewer](screenshots/artwork-viewer-desktop.png) | [Mobile viewer](screenshots/artwork-viewer-mobile.png) |

These are automated Chromium results, including emulated mobile viewport sizes. Manual assistive-technology testing, Safari testing, physical mobile-device testing, and a live checkout transaction were not performed.

## Founder review and completion

1. Open index.html locally and review the entrance, narrative, garden, 23-image portfolio, priced collection, and contact.
2. Try all seven chapters, Back/Forward navigation, the portfolio’s “Show all” control and full-image dialog, the five collection dialogs, Escape/Close, arrow navigation, and narrow/zoomed layouts.
3. Review the actual portfolio selection and descriptive captions. Confirm artwork titles and artist/photographer credits where known. For the next archive addition, collect just three to five original venue/garden photos with a brief true caption, approximate date, and photo credit where known. The supplied Drive-image workflow is already working; it does not need to be restarted. Portfolio artwork will not be assigned to priced works without matching evidence.
4. Use review/editor.html to add verified memories and credited images. Export the content file before closing the tab.
5. Confirm the listed print prices and whether the original Stripe button remains the intended checkout. Its configured identity was preserved but checkout was not exercised. Confirm Square’s intended role and whether an authenticated CMS is desired later.
6. Review the saved desktop/mobile screenshots and any additional browser or assistive-technology coverage the founders need, then obtain explicit Magic × Wizard authorization before merging or publishing.

The attachment ended at “The atmosphere” in section C, The Garden. Requirements beyond that point were not available.

## Recovery and release boundary

The review branch is isolated from main. Do not merge it until founders approve. No Sites registration, domain change, production deployment, Square mutation, or checkout transaction is part of this work.

Local recovery materials contain a published-baseline.zip with all four original files at verified byte content and a Git bundle with baseline and review checkpoint branches. The review source is also downloadable from the draft branch on GitHub. The original upstream SHA remains recoverable in GitHub. If a future authorized deployment needs rollback, prepare a reviewed revert to that source checkpoint; do not automatically force-reset main.
