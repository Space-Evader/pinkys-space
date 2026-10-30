# Original identity and Big Chef Dog preparation

Prepared October 30, 2026. Draft only; no telephone number or substitute imagery has been added.

The connected-source audit did not locate a verified original Pinky's Space logo, the original Halloween portrait of the Big Chef Dog, or the full Google Voice number ending in 212 with evidence that it is intended for public hotline use. These are publication blockers for the requested identity integration. A failed search does not establish that the files do not exist.

`content/identity.js` deliberately leaves all three fields `null`. `assets/hotline.js` performs no AI calls, network requests, message collection, storage, or simulated message delivery. It prepares a native dialog with the approved copy, a telephone link only when verified, and links to existing archive and artwork destinations.

The normal floating launcher is dormant until both the original portrait and the public hotline number pass the source checks. A supplied logo can be enabled independently. No personal-contact candidates, unrelated footer numbers, generated dog, drawn logo, or placeholder photograph have been used.

## Local review

Load `index.html?hotline-preview=1` or `fashion.html?hotline-preview=1` on a local `localhost` / `127.0.0.1` server (or as a local file). The text-only launcher reads “Big Chef Dog · preview.” The preview shows the exact approved copy and existing archive routes, with no telephone link. The query flag does not activate a preview on a public hostname.

The parent page must load `assets/hotline.css`, then deferred `content/identity.js` and `assets/hotline.js`, and include `<div id="hotline-root"></div>`. To render a verified original logo faithfully, include an initially hidden mount such as `<div data-original-logo hidden></div>`. The script puts the supplied image in that mount without masks, filters, redrawing, cropping, or color changes.

## Evidence required to enable

Store original source files safely and add full-frame website derivatives under the project's assets, with source/derivative hashes in the source manifest. Review the actual source images before marking them verified. Populate the following schema only from that evidence:

```js
window.PINKYS_IDENTITY = {
  originalLogo: {
    src: "assets/identity/verified-original-logo.webp",
    alt: "Original Pinky’s Space logo",
    width: /* actual pixels */,
    height: /* actual pixels */,
    originalArtworkConfirmed: true,
    sourceReference: /* verified source record */,
    verifiedAt: /* YYYY-MM-DD */
  },
  chefPortrait: {
    src: "assets/identity/verified-chef-halloween.webp",
    alt: /* accurate description of the supplied portrait */,
    width: /* actual pixels */,
    height: /* actual pixels */,
    originalHalloweenPhotoConfirmed: true,
    sourceReference: /* verified source record */,
    verifiedAt: /* YYYY-MM-DD */
  },
  publicTelephone: {
    e164: /* verified complete E.164 number ending in 212 */,
    publicHotlineUseConfirmed: true,
    sourceReference: /* evidence of approval for public hotline use */,
    verifiedAt: /* YYYY-MM-DD */
  }
};
```

The paths above describe the schema and are not claimed to be existing assets. Local image paths, nonempty source evidence, explicit authenticity flags, dimensions, and verification dates are required. The telephone gate additionally requires valid E.164 syntax, the confirmed ending 212, and explicit public-use confirmation. A public number is included in source code only after suitability is established.

## QA contract

- Mount: `#hotline-root`; original-logo mount: `[data-original-logo]`.
- Launcher: `#chef-launcher`; native dialog: `#chef-dialog`; close: `#chef-close`.
- Exact greeting: `#chef-greeting`; approved second paragraph: `.chef-message`.
- Verified telephone anchor, present only in normal verified mode: `#chef-call`.
- Existing chapter/art links: `.chef-routes a`.
- Default unknown configuration: no launcher, no dialog, no `tel:` link, no identity image requests.
- Local preview: text launcher, exact approved copy, no `tel:` link, keyboard containment, Escape/Close, return of focus, and no horizontal overflow.

Publishing, merging, production access settings, checkout, and commerce remain unchanged.
