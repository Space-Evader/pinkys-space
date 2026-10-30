# Pinky’s Space — founder review

Prepared October 30, 2026. Status: working, unpublished visual and interaction draft. Authentic media integration and browser review remain open.

## What is ready to review

The entrance uses electric pink, large editorial type, a restrained rotating symbol, and clear routes into Pinky’s Days and the collection. The site continues through the East Village origin story, seven browsable archive chapters, the garden, the collection, the central creative statement, and contact.

Chapter history comes from the supplied brief. No dates beyond the supplied pandemic context, visitor quotes, artist identities, individual memories, or historical photographs have been invented. The typographic motifs are interface decoration, not presented as collection artwork. Three Google Photos album links were supplied on October 30. The web reader could not access them, and direct access was blocked by the managed environment’s outbound network policy (HTTP CONNECT 403). Plugin discovery found no Google Photos connection. No album contents, photo identities, or photographer credits have been verified. The album URLs and sharing keys have not been copied into this public repository.

The archive supports credited images, captions, stories, dates or known periods, and external video/interview links. It now supports actual pixel dimensions and validated responsive image variants; a neutral frame reserves space when dimensions are unknown. Chapter navigation focuses the heading without announcing the entire photo journal as a live region. Collection detail buttons have work-specific accessible names. The local editor exports an updated archive.js; replacing that file and approved assets requires no rebuild. It is a file-based workflow, not an authenticated CMS or an automatic publishing system. Changes are held in the editor tab until exported.

## Source and published baseline

Repository: https://github.com/Space-Evader/pinkys-space

Published source: `eca40d58c59d7f381bf6e18c67bb43ec16632509`.

Evidence: the successful GitHub Pages run https://github.com/Space-Evader/pinkys-space/actions/runs/24486965580 deployed that exact SHA from main. The repository reports GitHub Pages enabled; its CNAME contains pinkysspace.com. Its index content matches the live page inspected via the web connector.

The tree contains four source files: index.html, pinky-final-wave.html, README.md, and CNAME. There are no image assets, package manifests, build dependencies, or custom workflow files in this baseline. Both HTML pages were inspected. The alternate pinky-final-wave.html includes its own additional archive concepts and contact destination; it remains unchanged.

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

The existing source’s future shop categories are retained under “Beyond the current collection.” Original full source is preserved in the baseline checkpoint/archive. Existing #about, #gallery, #shop, #contact, #collection and #top anchors continue to resolve. Main-page email and Instagram destinations are retained.

## Findings and changes

| Baseline finding | Review implementation |
| --- | --- |
| CSS mobile media block lacks its closing brace; hero containers and collection markup are malformed | Balanced document and CSS, responsive layouts at 650px and 1000px |
| Gallery consists of six CSS placeholders and explicitly calls itself a placeholder | Seven history chapters with support for real credited media; no fake artworks |
| Four Collect buttons open #collection in a new tab, never reaching checkout | Work details and specific email inquiries; explicit Square link |
| All Inquire buttons point to #about | Work-specific email subject lines |
| Contact form only displays a placeholder alert, without sending or storing a message; inputs lack labels | Direct email and Instagram contact links; no simulated delivery |
| Unconditional ticker animation and smooth scrolling lack reduced-motion handling | Decorative animation and smooth scrolling disabled for reduced-motion preference |
| Focus outlines removed on fields; no skip link; repeated ambiguous links | Visible focus, skip link, named navigation, labeled native dialog, modal focus restoration |
| External Stripe script is requested immediately | External checkout script loads only after a visitor asks to load the existing button |
| Typography is system Arial/Helvetica with no external font dependency | System sans-serif with Georgia editorial emphasis; no font requests |

These are source-based findings. No comprehensive live accessibility audit, mobile rendering test, measured Core Web Vitals, or checkout availability test has been completed. No claim of WCAG conformance is made.

## Validation completed

- Node syntax checks for application code, archive data, editor script and checkout script.
- Balanced HTML, unique IDs, internal link targets and local asset paths checked for all three new HTML entrypoints.
- CSS parsed using the environment’s existing PostCSS package.
- Dependency-free behavioral checks passed for all seven chapters, navigation history, media URLs, literal text rendering, rejection of unsafe media schemes, five product details, prices, inquiry destinations, and dialog close/focus callbacks.
- All four original baseline blobs verified against GitHub’s reported hashes.
- No third-party script is requested by the homepage. Its HTML, CSS, application script, archive content and favicon total about 34 KB before compression, excluding future photos. No real performance measurement is implied.

The available environment has no supported interactive browser or preview handoff. Visual layout, native dialog focus trapping, touch interaction, zoom, screen-reader announcements, photo crops, and checkout rendering still need real browser review. The behavior tests use a small DOM fixture and cannot establish those browser outcomes.

## Founder review and completion

1. Open index.html locally and review the entrance, narrative, garden, collection, and contact.
2. Try all seven chapters, Back/Forward navigation, the five collection dialogs, Escape/Close, and narrow/zoomed layouts.
3. The supplied Google Photos links could not be read in this environment. Supply an album export ZIP or selected original photos as chat attachments, or an accessible Drive folder. Identify hero, garden, collection images, credits, and approved historical captions where known. Google Photos album pages should not be used as image URLs. Album artwork will not be assigned to priced works without matching evidence.
4. Use review/editor.html to add verified memories and credited images. Export the content file before closing the tab.
5. Confirm the listed print prices and whether the original Stripe button remains the intended checkout. Its configured identity was preserved but checkout was not exercised. Confirm Square’s intended role and whether an authenticated CMS is desired later.
6. Complete browser accessibility/mobile review with authentic imagery, then obtain explicit Magic × Wizard authorization before merging or publishing.

The attachment ended at “The atmosphere” in section C, The Garden. Requirements beyond that point were not available.

## Recovery and release boundary

The review branch is isolated from main. Do not merge it until founders approve. No Sites registration, domain change, production deployment, Square mutation, or checkout transaction is part of this work.

Local recovery materials contain a published-baseline.zip with all four original files at verified byte content and a Git bundle with baseline and review checkpoint branches. The review source is also downloadable from the draft branch on GitHub. The original upstream SHA remains recoverable in GitHub. If a future authorized deployment needs rollback, prepare a reviewed revert to that source checkpoint; do not automatically force-reset main.
