import assert from "node:assert/strict";
import { chromium } from "playwright-core";
import { createServer } from "node:http";
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL("../", import.meta.url));
const screenshots = path.join(root, "review/screenshots");
await fs.mkdir(screenshots, { recursive: true });
const mime = { ".html":"text/html", ".css":"text/css", ".js":"text/javascript", ".webp":"image/webp", ".svg":"image/svg+xml" };
const server = createServer(async (request, response) => {
  try {
    const pathname = decodeURIComponent(new URL(request.url, "http://localhost").pathname);
    const file = path.resolve(root, "." + (pathname === "/" ? "/index.html" : pathname));
    if (!file.startsWith(root) || pathname.includes("/.git")) throw Error("Invalid path");
    const data = await fs.readFile(file);
    response.writeHead(200, { "Content-Type": mime[path.extname(file)] || "application/octet-stream" });
    response.end(data);
  } catch { response.writeHead(404); response.end("Not found"); }
});
await new Promise(resolve => server.listen(0, "127.0.0.1", resolve));
const origin = "http://127.0.0.1:" + server.address().port;
const browser = await chromium.launch({ executablePath: process.env.CHROMIUM_PATH || "/usr/bin/chromium", headless: true, args: ["--no-sandbox"] });
const results = { browser: await browser.version(), viewports: [], checks: [], screenshots: [] };
const errors = [];
try {
  for (const viewport of [{name:"desktop",width:1440,height:1000},{name:"mobile",width:390,height:844}]) {
    const context = await browser.newContext({ viewport: {width:viewport.width,height:viewport.height}, reducedMotion:"reduce" });
    const externalRequests = [];
    await context.route("**/*", route => {
      if (route.request().url().startsWith(origin + "/")) route.continue();
      else { externalRequests.push(route.request().url()); route.abort(); }
    });
    const page = await context.newPage();
    page.on("pageerror", error => errors.push(error.message));
    page.on("response", response => { if (response.status() >= 400) errors.push(response.url() + " " + response.status()); });
    await page.goto(origin, { waitUntil:"networkidle" });
    if (viewport.name === "desktop") {
      const decoded = await page.evaluate(async () => {
        const output = [];
        for (const photo of window.PINKYS_PORTFOLIO) {
          for (const source of photo.sources) {
            const image = new Image(); image.src = source.src; await image.decode();
            output.push({src:source.src,width:image.naturalWidth,height:image.naturalHeight,expectedWidth:source.width});
          }
        }
        return output;
      });
      assert.equal(decoded.length,46);
      assert.equal(new Set(decoded.map(image => image.src)).size,46);
      for (const image of decoded) assert.ok(image.width === image.expectedWidth && image.height > 0,"Derivative failed to decode at declared width: " + image.src);
      results.decodedWebPVariants = decoded.length;
    }
    await page.locator(".entrance-art img").evaluate(img => img.decode());
    assert.equal(await page.locator("#gallery .portfolio-card").count(),23);
    assert.equal(await page.locator("#gallery .portfolio-card:visible").count(),8);
    await page.screenshot({ path:path.join(screenshots,"homepage-" + viewport.name + ".png") });
    results.screenshots.push("review/screenshots/homepage-" + viewport.name + ".png");
    await page.locator("#gallery").scrollIntoViewIfNeeded();
    await page.evaluate(() => document.querySelector("#gallery").scrollIntoView({block:"start",behavior:"instant"}));
    for (const image of await page.locator("#gallery .portfolio-card:visible img").all()) {
      await image.evaluate(img => { img.loading = "eager"; });
      await image.evaluate(img => img.decode());
    }
    await page.screenshot({ path:path.join(screenshots,"gallery-" + viewport.name + ".png") });
    results.screenshots.push("review/screenshots/gallery-" + viewport.name + ".png");
    const first = page.locator("#gallery .portfolio-open").first();
    await first.click();
    assert.equal(await page.locator("#portfolio-dialog").evaluate(dialog => dialog.open),true);
    await page.locator("#portfolio-image").evaluate(img => img.decode());
    await page.screenshot({ path:path.join(screenshots,"artwork-viewer-" + viewport.name + ".png") });
    results.screenshots.push("review/screenshots/artwork-viewer-" + viewport.name + ".png");
    const firstCaption = await page.locator("#portfolio-caption").textContent();
    await page.keyboard.press("ArrowRight");
    assert.notEqual(await page.locator("#portfolio-caption").textContent(),firstCaption);
    await page.keyboard.press("ArrowLeft");
    assert.equal(await page.locator("#portfolio-caption").textContent(),firstCaption);
    await page.locator("#portfolio-next").click();
    await page.locator("#portfolio-prev").click();
    assert.equal(await page.locator("#portfolio-caption").textContent(),firstCaption);
    // Native modal must retain keyboard focus.
    for (let i=0;i<8;i++) {
      await page.keyboard.press("Tab");
      assert.equal(await page.evaluate(() => document.querySelector("#portfolio-dialog").contains(document.activeElement)),true);
    }
    await page.keyboard.press("Escape");
    assert.equal(await page.locator("#portfolio-dialog").evaluate(dialog => dialog.open),false);
    assert.equal(await first.evaluate(link => link === document.activeElement),true);
    await page.locator("#portfolio-more").click();
    assert.equal(await page.locator("#gallery .portfolio-card:visible").count(),23);
    // Decode every image, including lower lazy-loaded records.
    for (const image of await page.locator("#gallery .portfolio-card img").all()) {
      await image.evaluate(img => { img.loading = "eager"; });
      await image.evaluate(img => img.decode());
      assert.equal(await image.evaluate(img => img.naturalWidth > 0),true);
    }
    // Exercise all seven archive chapter links with keyboard activation.
    for (const link of await page.locator("[data-chapter]").all()) {
      await link.focus(); await page.keyboard.press("Enter");
      assert.equal(await page.locator("#journal h3").evaluate(heading => heading === document.activeElement),true);
    }
    // Product details preserve source titles/prices and modal focus.
    const prices = [88,111,222,333,222];
    const buttons = await page.locator("[data-work]").all();
    for (let index=0;index<buttons.length;index++) {
      await buttons[index].focus(); await page.keyboard.press("Enter");
      await page.waitForFunction(() => document.querySelector("#work-dialog").open);
      const actualPrice = await page.locator("#work-price").textContent();
      assert.ok(actualPrice.includes("$" + prices[index]), "Work " + index + ": expected $" + prices[index] + ", received " + actualPrice);
      assert.ok((await page.locator("#work-inquiry").getAttribute("href")).startsWith("mailto:info@pinkys.space?subject="));
      await page.keyboard.press("Escape");
      await page.waitForFunction(() => !document.querySelector("#work-dialog").open);
      assert.equal(await buttons[index].evaluate(button => button === document.activeElement),true);
    }
    assert.equal(await page.locator('a[href="https://pinkysspace.square.site/"]').count(),1);
    assert.equal(await page.locator('a[href="https://pinkys.space"]').count(),1);
    assert.equal(await page.locator('a[href="checkout.html"]').count(),1);
    assert.equal(await page.locator("stripe-buy-button").count(),0);
    // No image / decorative motion is forced for reduced-motion visitors.
    assert.equal(await page.evaluate(() => getComputedStyle(document.documentElement).scrollBehavior),"auto");
    for (const width of [320,390,650,768,1024,1440]) {
      await page.setViewportSize({width,height:viewport.height});
      assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1), "Horizontal overflow at " + width);
    }
    assert.deepEqual(externalRequests,[]);
    await page.setViewportSize({width:viewport.width,height:viewport.height});
    for (const link of await page.locator("header nav a").all()) {
      const hash = await link.getAttribute("href");
      await link.click();
      assert.equal(new URL(page.url()).hash,hash);
      const top = await page.locator(hash).evaluate(node => node.getBoundingClientRect().top);
      assert.ok(top >= 0 && top < viewport.height, "Navigation destination not visible: " + hash);
    }
    results.viewports.push(viewport);
    await context.close();
  }
  // Progressive enhancement: all gallery items and full-image links without JS.
  const noScript = await browser.newContext({javaScriptEnabled:false,viewport:{width:390,height:844}});
  const plain = await noScript.newPage();
  await plain.goto(origin);
  assert.equal(await plain.locator("#gallery .portfolio-card:visible").count(),23);
  assert.ok((await plain.locator(".portfolio-open").first().getAttribute("href")).endsWith(".webp"));
  await noScript.close();
  // Verify checkout remains opt-in, without contacting Stripe or buying anything.
  const checkout = await browser.newPage();
  await checkout.goto(origin + "/checkout.html");
  assert.equal(await checkout.locator("stripe-buy-button").count(),0);
  assert.equal(await checkout.locator('script[src*="stripe.com"]').count(),0);
  await checkout.close();
  assert.deepEqual(errors,[]);
  results.checks = ["all 46 WebP variants decoded at their declared widths","23 visible decoded portfolio images after disclosure","native gallery dialog and previous/next controls","arrow keys, Tab containment, Escape and focus restoration","seven archive headings with keyboard activation","desktop and mobile main-navigation destinations","five product prices and specific inquiry links","Square, companion domain and checkout links preserved","no homepage external requests or browser errors","no horizontal overflow at 320, 390, 650, 768, 1024, 1440 pixels","reduced motion","no-JavaScript gallery fallback","checkout remains opt-in; no transaction attempted"];
  await fs.writeFile(path.join(root,"review/browser-results.json"),JSON.stringify(results,null,2)+"\n");
  console.log("PASS: browser integration, keyboard, images, commerce links, responsive widths, reduced motion and no-script fallback.");
  console.log("Saved " + results.screenshots.length + " actual Chromium screenshots.");
} finally {
  await browser.close();
  await new Promise(resolve => server.close(resolve));
}
