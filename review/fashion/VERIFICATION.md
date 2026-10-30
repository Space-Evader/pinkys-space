# Wearable Art verification

October 30, 2026. Review branch: `codex/pinkys-universe-review`. Publication was subsequently authorized by the owner; see the release record. These checks perform no commerce mutation or purchase.

## Results

| Check | Result | Evidence |
| --- | --- | --- |
| Source, syntax, HTML/ARIA references, local files, CSS and existing behavior | Pass | `npm run validate` |
| Existing homepage, archive, portfolio and commerce-route regression | Pass | [browser-results.json](../browser-results.json) |
| Fashion identity, source groups, filters, search, disclosures and fallback | Pass | [fashion-browser-results.json](../fashion-browser-results.json) |
| Verified original identity images and non-AI guide | Pass | Exact supplied JPEG hashes, complete-frame rendering, image decoding, normal and preview guide, keyboard controls, missing-asset fallback, verified public call link in normal mode and suppression in preview |
| Image and protected-source preservation | Pass | [preservation-results.json](../preservation-results.json): all 53 protected files match the checkpoint |
| Current Square product prices, currency, variants, stock and checkout | Not verified | Source access blocked/incomplete; zero item-level purchase buttons |
| Original logo and Halloween portrait | Integrated | User-supplied originals, byte-identical source copies; [identity provenance](../identity-sources.json) |

Chromium 154.0.8037.57 was used with this repository’s pinned Playwright Core 1.57.0. Desktop viewport: 1440 × 1000. Mobile viewport: 390 × 844. Neither the fashion page nor the existing homepage had horizontal overflow at 320, 390, 650, 768, 1024 or 1440 pixels. The new page made no external requests and produced no browser errors. Reduced-motion behavior and the no-JavaScript archive were checked. No real Core Web Vitals, Safari, physical-device or assistive-technology certification is claimed.

All 71 archive entry names, categories, source links and nested group counts match the 79-group inventory. All 716 historical variants remain in the inventory. Duplicate exact names retain distinct source groups. All current price/currency/availability/Square destination fields are null. No product photo or purchase identity was inferred from the art portfolio. All 25 HatsRx references resolve in the markup to their observed official source URLs; remote availability is not a checkout test.

The existing browser suite verifies all 46 responsive WebP variants decode at their declared widths, all 23 gallery images remain available, the image viewer and seven chapters work, original artwork prices/inquiry links remain intact, and checkout remains opt-in. A separate SHA-256 comparison confirms unchanged bytes for the 46 images and seven protected source/configuration files. Two inaccurate inherited captions were corrected after direct visual inspection; image bytes and provenance hashes were preserved.

## Screenshots

| View | Desktop | Mobile |
| --- | --- | --- |
| Wearable Art entrance | [Desktop](../screenshots/fashion-desktop.png) | [Mobile](../screenshots/fashion-mobile.png) |
| Archive heading and filters | [Desktop](../screenshots/fashion-index-desktop.png) | [Mobile](../screenshots/fashion-index-mobile.png) |
| Archive entries | [Desktop](../screenshots/fashion-records-desktop.png) | [Mobile](../screenshots/fashion-records-mobile.png) |
| Big Chef Dog guide | [Desktop](../screenshots/hotline-desktop.png) | [Mobile](../screenshots/hotline-mobile.png) |
| Local hotline preview | [Desktop](../screenshots/hotline-preview-desktop.png) | [Mobile](../screenshots/hotline-preview-mobile.png) |

Existing homepage, gallery and artwork-viewer screenshots were also refreshed by the regression suite. These are actual browser captures. Both guide modes show the original Halloween portrait and approved copy. The normal guide displays the owner-confirmed (347) 635-4690 and links to `tel:+13476354690`; preview mode omits the call link. Browser checks inspect and activate the link with default navigation prevented, without placing a real call.

## Reproduction

From this checkout, install its pinned dependencies with `npm ci`, then run:

```sh
npm run validate
npm run browser-check
npm run fashion-check
```

An installed Chromium is required. The test commands run temporary local HTTP servers and need local socket access where the sandbox restricts it. No external checkout requests are made. The optional `python review/build-fashion.py` regenerates the checked-in static fashion page without installing a runtime framework.

See [missing sources and readiness](MISSING-AND-READINESS.md) for the remaining source gaps. Passing these local checks does not establish a complete current commerce catalog.
