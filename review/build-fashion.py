"""Render the source-backed archive as static HTML; no build is needed to view it."""
from collections import OrderedDict
from html import escape
import json
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
ARROW = '<svg class="arrow" aria-hidden="true" focusable="false" viewBox="0 0 24 24"><path d="M6 18 18 6M6 6h12v12" fill="none" stroke="currentColor" stroke-width="1.8"/></svg>'
DOWN_ARROW = ARROW.replace('stroke-width="1.8"', 'stroke-width="1.8" transform="rotate(90 12 12)"')
STAR = '<i aria-hidden="true"><svg class="star" aria-hidden="true" focusable="false" viewBox="0 0 24 24"><path d="M12 2v20M2 12h20M5 5l14 14M5 19 19 5" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"/></svg></i>'
inventory = json.loads((ROOT / "content/fashion-inventory.json").read_text())
related = json.loads((ROOT / "content/related-brand-catalog.json").read_text())
groups = OrderedDict()
for item in inventory["items"]:
    groups.setdefault(item["name"], []).append(item)


def e(value):
    return escape(str(value), quote=True)


def card(number, name, items):
    category = items[0]["category"]
    search = " ".join([name, category] + [item["collection"] for item in items])
    detail = []
    for item in items:
        options = OrderedDict()
        for variant in item["historicalVariants"]:
            for option in variant["options"]:
                options.setdefault(option["name"], [])
                if option["value"] not in options[option["name"]]:
                    options[option["name"]].append(option["value"])
        fields = "".join(f'<dt>{e(label)} recorded</dt><dd>{e(", ".join(values))}</dd>' for label, values in options.items())
        count = len(item["historicalVariants"])
        variant_label = 'record' if count == 1 else 'records'
        detail.append(f'<div class="fashion-group"><p>SOURCE GROUP {e(item["skuFamily"])}<br>{count} historical variant {variant_label}</p><dl>{fields}</dl></div>')
    multiple = '<p>This exact name occurs in separate SKU groups. Their Square item identities remain unresolved; the source groups are retained separately below.</p>' if len(items) > 1 else ''
    return f'''<article class="fashion-record" id="fashion-entry-{number:02}" data-fashion-record="{e(items[0]['id'])}" data-category="{e(category)}" data-search="{e(search)}">
<div class="fashion-record-meta"><span>{number:02} / {e(category)}</span><span>2026 ARCHIVE</span></div>
<h3>{e(name)}</h3><p class="archive-label">HISTORICAL DESIGN RECORD</p>
<details><summary aria-label="Explore the source record for {e(name)}">Explore the source record</summary><p>Recorded May 31, 2026. Current sizes, colors, price and availability are unconfirmed. Product photography has not yet been matched.</p>{multiple}{''.join(detail)}<p><a href="{e(items[0]['sourceUrl'])}" target="_blank" rel="noopener noreferrer">Historical catalog source ↗</a></p></details>
</article>'''


categories = ["Hats & Headwear", "T-Shirts & Tops", "Hoodies & Outerwear", "Accessories", "Footwear", "Swimwear", "Pet Wear"]
buttons = '<button type="button" data-fashion-filter="all" aria-pressed="true">All Designs</button>'
buttons += ''.join(f'<button type="button" data-fashion-filter="{e(category)}" aria-pressed="false">{e(category)}</button>' for category in categories if any(group[0]["category"] == category for group in groups.values()))
cards = '\n'.join(card(number, name, items) for number, (name, items) in enumerate(groups.items(), 1))
related_rows = '\n'.join(f'<li><a href="{e(item["sourceUrl"])}" target="_blank" rel="noopener noreferrer">{e(item["name"])} ↗</a><span>HATSRX / DESIGN REFERENCE</span></li>' for item in related["inventory"])

page = f'''<!doctype html>
<html lang="en" class="fashion-document"><head>
<meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="description" content="Pinky’s Space — Wearable Art. Explore the historical fashion archive, art in everyday life, and the related HatsRx orbit.">
<title>Wearable Art — Pinky’s Space</title>
<link rel="icon" href="assets/favicon.svg" type="image/svg+xml">
<link rel="stylesheet" href="assets/space.css"><link rel="stylesheet" href="assets/fashion.css"><link rel="stylesheet" href="assets/hotline.css">
<script src="assets/fashion.js" defer></script><script src="content/identity.js" defer></script><script src="assets/hotline.js" defer></script>
</head><body class="fashion-page">
<a class="skip" href="#main">Skip to content</a>
<header class="header"><a class="wordmark" href="index.html#top" aria-label="Pinky’s Space home">PINKY’S<span>SPACE ✳</span></a><nav aria-label="Main navigation"><a href="index.html#archive">Pinky’s Days</a><a href="index.html#gallery">Original Art</a><a href="#fashion-index">Design Archive</a><a href="#related-orbit">Related Orbit</a></nav></header>
<main id="main">
<section class="fashion-hero" id="wearable-art" aria-labelledby="fashion-title">
<div class="fashion-meta"><span>PINKY’S SPACE / ANOTHER ROOM IN THE UNIVERSE</span><span>IN ORBIT SINCE 2017</span></div>
<div class="fashion-cover"><div class="fashion-cover-copy"><p class="eyebrow">ART · CLOTHING · IDENTITY</p><div data-original-logo hidden></div><h1 id="fashion-title">WEARABLE<br><em>ART.</em></h1><p class="fashion-deck">Art doesn't always hang on walls. Sometimes it walks around the city.</p><div class="actions"><a class="button black" href="#fashion-index">Explore the archive <span aria-hidden="true">↘</span></a><a class="text-link" href="index.html#archive">Back to Pinky’s Days ↗</a></div></div>
<figure><a href="assets/portfolio/03-1600.webp" aria-label="View the full supplied portfolio photograph of a decorated bag"><img src="assets/portfolio/03-640.webp" srcset="assets/portfolio/03-640.webp 480w, assets/portfolio/03-1600.webp 1200w" sizes="(max-width: 650px) calc(100vw - 44px), 43vw" width="1200" height="1600" alt="An olive-green crossbody bag with painted stars and marks, hanging against a red and violet painted background." decoding="async" fetchpriority="high"></a><figcaption><span>FROM THE SUPPLIED ART PORTFOLIO / 03<br>A bag suspended against red and violet marks.</span><span>EDITORIAL PHOTOGRAPH<br>NO CATALOG MATCH CLAIMED</span></figcaption></figure></div>
<div class="fashion-orbit"><span>FROM THE EAST VILLAGE.<br>OUT INTO THE EVERYDAY.</span><a href="index.html#gallery">See the original art portfolio ↗</a></div>
</section>
<section class="fashion-intro" aria-labelledby="fashion-intro-title"><h2 id="fashion-intro-title">Another surface.<br>The same impulse<br>to create.</h2><div><p>Art, clothing, identity. A painted object can become part of the way we move through the world. A design can carry an idea beyond the room where it began.</p><p>Pinky’s Space grew around artists, neighbors, strangers and unexpected encounters in the East Village. This room brings the fashion records into that continuing story.</p><a href="index.html#chapter-artists">Meet the Artists chapter ↗</a></div></section>
<section class="fashion-index" id="fashion-index" aria-labelledby="fashion-index-title">
<div class="section-kicker"><span>01 / THE DESIGN ARCHIVE</span><span>THE HISTORICAL DESIGN INDEX</span></div>
<div class="fashion-index-heading"><div><p class="eyebrow">PINKY’S SPACE — WEARABLE ART</p><h2 id="fashion-index-title">DESIGNS<br><em>IN ORBIT.</em></h2></div><p>71 EXACT PRODUCT NAMES<br>79 PROVISIONAL SOURCE GROUPS<br>716 HISTORICAL VARIANT RECORDS</p></div>
<p class="fashion-source-note">Recovered from the May 31, 2026 catalog. These are archival records; current product photographs, prices, available variants and Square listings are still being confirmed. The index covers this recovered source and may not include every current design.</p>
<div class="fashion-tools" hidden><div class="fashion-filters" role="group" aria-label="Browse fashion categories">{buttons}</div><div class="fashion-search-row"><div class="fashion-search"><label for="fashion-search">FIND A DESIGN</label><input id="fashion-search" type="search" placeholder="Name or design family" autocomplete="off" maxlength="160" aria-controls="fashion-records"></div><p id="fashion-results" role="status" aria-live="polite">71 of 71 archive entries</p></div></div>
<noscript><p>All 71 archive entries and their source details are available below. Search and category filters use JavaScript.</p></noscript>
<div id="fashion-records" class="fashion-records">{cards}</div>
<div id="fashion-empty" hidden><p>No designs match this selection.</p><button id="fashion-clear" class="button black" type="button">Clear search and filters</button></div>
<div class="fashion-index-foot"><p>The existing Square store remains the place to shop. Individual purchase links will appear here when each listing is verified.</p><a class="button black" href="https://pinkysspace.square.site/" target="_blank" rel="noopener noreferrer">Visit Pinky’s Square store <span aria-hidden="true">↗</span></a></div>
</section>
<section class="fashion-universe" id="related-orbit" aria-labelledby="related-title"><div class="section-kicker"><span>02 / THE WIDER UNIVERSE</span><span>MAGIC × WIZARD</span></div><div class="fashion-universe-grid"><div><h2 id="related-title">A community.<br>More than one orbit.</h2><p>The story continues through original artwork, the memories of Pinky’s Days, and the people who keep creating.</p><p><a href="index.html#archive">Walk through Pinky’s Days ↗</a></p><p><a href="index.html#gallery">Return to the art ↗</a></p></div><div class="fashion-related"><p class="eyebrow">HATSRX / A DISTINCT RELATED BRAND</p><h3>Ideas you can put on.</h3><p>Created by Wizard + Magic, <a href="https://www.hatsrx.com/blank" target="_blank" rel="noopener noreferrer">HatsRx</a> has its own design language and product catalog. Explore these 25 official design references in their original brand context.</p><p>These references are separate from Pinky’s historical records. No Square product match or shared inventory has been assumed.</p><details><summary>EXPLORE 25 HATSRX DESIGN REFERENCES</summary><ol>{related_rows}</ol></details></div></div></section>
</main><footer><a href="index.html#top">PINKY’S SPACE ↗</a><span>IN ORBIT SINCE 2017</span><span>ART · PEOPLE · EVERYDAY LIFE</span></footer>
<div id="hotline-root"></div>
</body></html>
'''
page = page.replace('SPACE ✳', 'SPACE ' + STAR).replace('↗', ARROW).replace('↘', DOWN_ARROW)
(ROOT / "fashion.html").write_text(page, encoding="utf-8")
print(f"Rendered {len(groups)} exact names from {len(inventory['items'])} historical groups and {len(related['inventory'])} distinct HatsRx references.")
