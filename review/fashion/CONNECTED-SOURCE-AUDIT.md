# Connected-source audit — Pinky’s Space

Later identity update: the user supplied the original logo and Big Chef Dog Halloween portrait after this source search. Both are now integrated; see `../identity-sources.json`. Earlier missing-asset findings below document the search checkpoint. The public telephone number remains unverified.
Verified 2026-10-30. Read-only; no connected source was edited.

The accessible historical Square export contains 802 rows. The wearable extraction contains 716 variant rows, 71 exact product names and 79 provisional exact-name/SKU-family groups. This is complete for that source’s wearable rows; it is not a complete current Square catalog.

Provisional groups preserve duplicate names across SKU families. Examples include two PSILY hoodies, two cotton caps, two XOXO hoodies and two p.s. I Love You crop tops. Do not deduplicate them by displayed name or infer that they are the same Square item.

Inventory includes headwear, tops, hoodies, swimwear, footwear, bags, aprons and pet bandanas. It excludes artwork/canvases, home goods, office goods, donations, food and event services.

## Files

- historical-wearables-by-sku-family.json: review inventory with original exact name, inferred design-family label, source categories, historical variant/option/price/visibility data and explicit current unknowns.
- source-wearable-variants.json: 716 exact source variant records, including original handles, variation tokens, SKUs and the three permalink hints.
- source-product-descriptions.json: original historical copy for each provisional group. Product/art/image identity still needs verification before display.
- connected-source-manifest.json: source URLs, dates, verification scope and limitations.

## Missing products and current-field gaps

- Full current Square catalog access is not established by Drive records.
- Historical prices are not current price verification; currency is not specified in the export.
- Current stock and available variants are unknown; historical quantity/visibility must not be represented as present-day availability.
- No image fields exist in the export. Every historical group needs matching original product photography.
- 713 wearable rows have blank Permalink fields. The remaining three are slugs only: Alien Rainbow /Flip Flops → rainbowflipflops; Electric Planet Heart /Flip Flops → flipflop; I'm What's Cookin' /Apron → NYCButcherApron. None is a verified complete purchase URL.
- Parent Square item IDs are absent; the provisional 79-group count is not a certified count of distinct live items.
- Separate HatsRx catalog has 12 historical named units but no verified Square destinations/images/prices. Keep it a distinct brand reference until linked identities are verified.

## Recovered prior checkpoint

The I LIKE YOUR HAT. brief records the working storefront as https://pinkysspace.square.site (double s). It notes a prior failure used pinkyspace.square.site. It records cap item188 at https://pinkysspace.square.site/product/p-s-i-love-you-cotton-cap/188 with $36.00 prior observed price, seven colors, and original Square image filename FHM7FXSRNKBMTFKIBJSHPO5M.jpeg (2000 × 2000). It also records Diamond Mind /T-shirt at $25 and PSILY /hoodie item239 at $45, while warning of a separate item238. These are checkpoint claims and need current re-verification.

## Asset and hotline gaps

- No verified original Pinky’s Space logo file located in the queried connected sources.
- No verified original Big Chef Dog Halloween photograph located.
- No Google Voice number ending in 212 with explicit public-hotline suitability evidence located. Do not publish a telephone link from unrelated personal contact fields.
- Pinky’s Master Art Catalog explicitly quarantines DOT_* document references as unsuitable for art/photo publication.
- Google AI Studio folder contains generic image, screenshot and prompt candidates; folder presence is not provenance for an original product photograph or logo.
- The Google Merchant Center feed sheet is only a Google sample template; all example rows were rejected.

## Search scope

Google Drive legacy and typed metadata searches: Pinky, Pinkys, HatsRx, Big Chef, Halloween, Chef, logo, Dog, hotline, Google Voice, Square, fashion, catalog. Inspected the relevant project folder and Google AI Studio direct children. Empty searches are access/search limitations, not proof the assets do not exist. Unrelated legal, family, financial and private-contact sources were not used for product or hotline publication.


Focused asset check: Drive typed-image searches for Pinky logo, Pinky's Space, PINKYS, Halloween dog, Big Chef Dog, BigChef and pinkysspace found no verified originals. Two Pinky-logo search hits (1j_JXXFcUO6-Y_S2ttcBsQ_syGYALLOz8 and 1Obg7L4DLY0JXfj7KtvAlIZZTSCbQ4sUe) were visually inspected and are unrelated WorkOS admin screenshots. They were rejected.

## Final focused connected-source checks

Canva search recovered two historical references: @Pinky’s Space (design DAEZ5CJRoDc, 2021, two pages; fetched text @pinkysspace / PS) and Copie de Copy of Pinky’s Space (design DAEeTJNo6Do, 2021, three historical menu pages). These remain original-logo leads without verified reusable source artwork. The menu’s generic space Hat / space T-shirt $25 amounts are historical context and do not establish new distinct products or current prices. No new product records were added from them.

Notion Big Chef / HatsRx queries returned no results; Pinky query timed out. Canva Big Chef returned only an explicitly photo-free portfolio. No supplied Halloween dog photograph or public-hotline proof was recovered.

## Local preservation and classification

The full 802-row source is preserved locally in source-all-item-rows.json and catalog-cleaned-2026-05-31-readable.csv.txt. The 86 excluded nonwearable rows are in excluded-nonwearable-source-rows.json and should remain outside the public site data. inventory.json provides the 79 provisional wearable source records in the application-requested shape, with null current fields and exact historical variants. Editorial category classification uses the exact type suffix after slash; it does not search design-family text. Counts: Hats & Headwear 26; T-Shirts & Tops 9; Hoodies & Outerwear 10; Accessories 9; Footwear 15; Swimwear 7; Pet Wear 3.
