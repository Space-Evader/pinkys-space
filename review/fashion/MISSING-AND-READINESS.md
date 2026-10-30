# Fashion archive — missing sources and publication readiness

Prepared October 30, 2026. Draft implementation only. Do not publish or merge.

The accessible historical export has been fully inventoried: 802 source rows, 716 wearable variant rows, 86 excluded nonwearable rows, 71 exact wearable names and 79 provisional exact-name/SKU-family groups. The website groups repeated exact names into 71 archive entries while retaining all separate source groups in their details. Parent Square item IDs were not present, so neither 71 nor 79 is a certified count of current purchasable products.

`content/fashion-inventory.json` is the complete wearable source inventory, including exact names, source dates, category basis, name-derived design families, historical descriptions, variants, sizes/colors where recorded, historical price amounts and source stock/visibility fields. Current price, currency, availability and purchase URLs remain explicitly null. Historical amounts have no verified ISO currency. The CSV summarizes each source group; it does not replace the detailed JSON.

The separate `content/related-brand-catalog.json` contains 25 individually read official HatsRx pages and 31 image references, including six artwork/inspiration images. HatsRx remains a separate brand and no records or stock have been merged into Pinky’s catalog. Its dollar-symbol prices are recorded with unknown ISO currency. The public references are editorial links, not Pinky’s purchase buttons.

## Publication blockers

| Missing verification | Scope | Required evidence |
| --- | --- | --- |
| Complete current Square catalog | Unknown total; historical source is dated May 31 | Current authorized export or readable current catalog with parent item IDs and online URLs |
| Correct product-to-Square destinations | All 79 historical groups | Exact current listing for each matched item, including separate hoodie/cap records |
| Current price and currency | All 79 historical groups | Current listing or catalog data with currency |
| Available variants and inventory | All 79 historical groups | Current variation and availability data; historical quantities such as 100000 are not live stock evidence |
| Matched original product photography | All 79 historical groups | Original images mapped to exact item IDs; gallery/artwork pictures cannot stand in for these |
| HatsRx image files | 31 source references | Source binaries and visual verification before local publication; image host is blocked here |
| Original Pinky’s Space logo | Not recovered | Supplied original artwork file with provenance; no redraw or substitute |
| Big Chef Dog Halloween portrait | Not recovered | Supplied original photograph with provenance |
| Full Google Voice number ending 212 | Not verified | Full number and evidence it is approved for public hotline use |

The user’s “sent” response contained no file reference or attachment accessible in this turn. Searches did not establish access to those originals. These are access gaps, not claims that the assets do not exist.

## Square link evidence

The existing `https://pinkysspace.square.site/` store link and `https://pinkys.space` companion destination are preserved. The earlier brief records cap188 at `https://pinkysspace.square.site/product/p-s-i-love-you-cotton-cap/188`; the search index exposes `https://pinkysspace.square.site/product/xoxo-crop-tee/209` with tracking parameters in the recovery-lead file. Neither page exposed current listing content during this audit. A historical brief also mentions separate hoodie238 and hoodie239; no new full URLs were constructed from those numbers.

Direct access to Square returned HTTP CONNECT 403. The web reader returned minimal or inaccessible content. No live product purchase mapping, price, variant availability, shopping transaction, or checkout success can be claimed. Consequently the new archive has zero product-level purchase buttons. The storefront destination is available as the existing general shopping route. Existing artwork inquiry and opt-in Stripe checkout behavior are preserved.

## Implemented and reviewable

- `fashion.html`: editorial entrance, authentic supplied portfolio photograph, all 71 exact archive names, seven source-supported categories, search, native source disclosures, and separate HatsRx references. All entries remain accessible without JavaScript.
- `index.html#wearable-art`: homepage entry into the new room. Existing artwork, history chapters, gallery, five priced artworks and commerce destinations remain available.
- `content/identity.js`: original-asset configuration is unset. The normal floating hotline is dormant. Local `fashion.html?hotline-preview=1` or `index.html?hotline-preview=1` previews the approved non-AI copy and navigation without a portrait or telephone link.
- The original-logo hook accepts only a verified supplied image. It has no replacement logo artwork.
- Portfolio photograph 03 provides editorial context only; no catalog match, title, price or artist credit has been invented. Visual reinspection corrected two inherited descriptions: image11 shows stencils and paint supplies rather than a jacket; image13 shows a painted panel rather than fabric. All 46 image files are byte-identical to the checkpoint.

## Preservation and remaining review

Work continues on `codex/pinkys-universe-review` from `b46ad03383a229ff3b202fda1f9832baf81181ce`. The recovered checkout was clean, with no unpublished local edits to overwrite. Prior review commits remain ancestors. The original Drive images were not changed. The complete raw historical export and excluded rows are retained in `/workspace/pinkys-source-audit`, outside the public website source. Unrelated environments were not used for runtime packages or testing.

This is an implemented historical fashion archive, not a completed current commerce integration. Publication is blocked by the source and asset gaps above and by the user’s explicit no-publish/no-merge instruction. Final founder visual review and current commerce verification remain required. Browser results and screenshots are recorded alongside this report; emulated mobile Chromium checks do not replace Safari, physical-device or assistive-technology review.
