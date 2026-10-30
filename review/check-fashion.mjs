import assert from "node:assert/strict";
import { chromium } from "playwright-core";
import { createServer } from "node:http";
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL("../", import.meta.url));
const inventory = JSON.parse(await fs.readFile(path.join(root,"content/fashion-inventory.json"),"utf8"));
const groups = new Map();
for (const item of inventory.items) {
  if (!groups.has(item.name)) groups.set(item.name,[]);
  groups.get(item.name).push(item);
  for (const field of ["price","currency","availability","squareUrl"]) assert.equal(item[field],null,"Unverified current fact must remain null: " + item.id + "/" + field);
  assert.equal(item.verificationStatus,"historical-source-verified-current-unverified");
}
assert.equal(groups.size,71);
assert.equal(inventory.items.length,79);
assert.equal(inventory.items.reduce((sum,item)=>sum+item.historicalVariants.length,0),716);
assert.equal(inventory.completeCurrentCatalog,false);
assert.equal(inventory.verifiedCurrentSquareItems,0);
const categories = [...new Set([...groups.values()].map(items=>items[0].category))];
assert.equal(categories.length,7);
const screenshots = path.join(root,"review/screenshots");
await fs.mkdir(screenshots,{recursive:true});
const mime = {".html":"text/html",".css":"text/css",".js":"text/javascript",".webp":"image/webp",".svg":"image/svg+xml",".json":"application/json"};
const server = createServer(async (request,response)=>{
  try {
    const pathname = decodeURIComponent(new URL(request.url,"http://localhost").pathname);
    const file = path.resolve(root,"."+(pathname === "/" ? "/index.html" : pathname));
    if (!file.startsWith(root) || pathname.includes("/.git")) throw Error("Invalid path");
    response.writeHead(200,{"Content-Type":mime[path.extname(file)] || "application/octet-stream"});
    response.end(await fs.readFile(file));
  } catch {response.writeHead(404);response.end("Not found");}
});
await new Promise(resolve=>server.listen(0,"127.0.0.1",resolve));
const origin = "http://127.0.0.1:"+server.address().port;
const browser = await chromium.launch({executablePath:process.env.CHROMIUM_PATH || "/usr/bin/chromium",headless:true,args:["--no-sandbox"]});
const results = {browser:await browser.version(),inventory:{exactNames:71,provisionalGroups:79,historicalVariants:716,verifiedCurrentSquareItems:0},viewports:[],checks:[],screenshots:[],limitations:["No current Square product page was accessible; remote destination availability and checkout were not exercised.","No physical device, Safari, or assistive-technology testing is implied.","Original logo, Halloween portrait, and confirmed public hotline number are absent; only local gated preview is tested."]};
const errors = [];
async function shot(page,name) {
  const relative = "review/screenshots/"+name+".png";
  await page.screenshot({path:path.join(root,relative)});
  results.screenshots.push(relative);
}
async function align(page,selector) {
  await page.locator(selector).evaluate(node=>{
    const header = document.querySelector("header").getBoundingClientRect();
    window.scrollTo({top:window.scrollY+node.getBoundingClientRect().top-header.height-18,behavior:"instant"});
  });
}
try {
  for (const viewport of [{name:"desktop",width:1440,height:1000},{name:"mobile",width:390,height:844}]) {
    const context = await browser.newContext({viewport:{width:viewport.width,height:viewport.height},reducedMotion:"reduce"});
    const externalRequests = [];
    await context.route("**/*",route=>{
      if (route.request().url().startsWith(origin+"/")) route.continue();
      else {externalRequests.push(route.request().url());route.abort();}
    });
    const page = await context.newPage();
    page.on("pageerror",error=>errors.push(error.message));
    page.on("response",response=>{if(response.status()>=400)errors.push(response.url()+" "+response.status());});
    await page.goto(origin+"/fashion.html",{waitUntil:"networkidle"});
    await page.locator(".fashion-cover img").evaluate(img=>img.decode());
    assert.equal(await page.locator("[data-fashion-record]").count(),71);
    assert.equal(await page.locator("[data-fashion-record]:visible").count(),71);
    assert.equal(await page.locator(".fashion-group").count(),79);
    assert.equal(await page.locator("[data-fashion-filter]").count(),8);
    assert.equal(await page.locator("#chef-launcher, #chef-dialog, a[href^='tel:'], [data-original-logo] img").count(),0);
    assert.equal(await page.locator("#fashion-records img, #fashion-records button").count(),0);
    assert.equal(await page.locator("#fashion-records a[href*='square.site']").count(),0);
    assert.ok(!/[$€£]|\b(?:USD|EUR|GBP|in stock|add to cart|buy now)\b/i.test(await page.locator("#fashion-records").innerText()));
    const cards = await page.locator("[data-fashion-record]").evaluateAll(nodes=>nodes.map(node=>({id:node.dataset.fashionRecord,category:node.dataset.category,name:node.querySelector("h3").textContent,groupCount:node.querySelectorAll(".fashion-group").length,links:[...node.querySelectorAll("a")].map(a=>a.getAttribute("href"))})));
    assert.deepEqual(cards.map(card=>card.name).sort(),[...groups.keys()].sort());
    for(const card of cards){
      const items=groups.get(card.name);
      assert.equal(card.id,items[0].id);
      assert.equal(card.category,items[0].category);
      assert.equal(card.groupCount,items.length);
      assert.deepEqual(card.links,[items[0].sourceUrl]);
    }
    assert.equal(await page.locator("#related-orbit ol li").count(),25);
    for(const href of await page.locator("#related-orbit ol a").evaluateAll(nodes=>nodes.map(a=>a.href))) assert.equal(new URL(href).hostname,"www.hatsrx.com");
    await shot(page,"fashion-"+viewport.name);
    await align(page,"#fashion-index");
    await shot(page,"fashion-index-"+viewport.name);
    await align(page,"#fashion-records");
    await shot(page,"fashion-records-"+viewport.name);
    for(const category of categories){
      const button=page.locator("[data-fashion-filter]").filter({hasText:category}).first();
      await button.focus(); await page.keyboard.press("Enter");
      const expected=cards.filter(card=>card.category===category).length;
      assert.equal(await page.locator("[data-fashion-record]:visible").count(),expected,"Category "+category);
      assert.equal(await button.getAttribute("aria-pressed"),"true");
      assert.equal(await page.locator("[data-fashion-filter][aria-pressed='true']").count(),1);
      assert.equal(await page.locator("#fashion-results").textContent(),expected+" of 71 archive entries");
    }
    await page.locator("[data-fashion-filter='all']").click();
    const search=page.locator("#fashion-search");
    await search.fill("DIAMOND MIND");
    const expected=cards.filter(card=>card.name.toLowerCase().includes("diamond mind")).length;
    assert.equal(await page.locator("[data-fashion-record]:visible").count(),expected);
    await search.fill("diamond mind");
    assert.equal(await page.locator("[data-fashion-record]:visible").count(),expected);
    await search.fill("no_such_verified_design_9d34e");
    assert.equal(await page.locator("[data-fashion-record]:visible").count(),0);
    assert.equal(await page.locator("#fashion-empty").isVisible(),true);
    await page.locator("#fashion-clear").click();
    assert.equal(await search.inputValue(),"");
    assert.equal(await search.evaluate(node=>node===document.activeElement),true);
    assert.equal(await page.locator("[data-fashion-record]:visible").count(),71);
    assert.equal(await page.locator("#fashion-empty").isVisible(),false);
    const first=page.locator("[data-fashion-record] details").first();
    await first.locator("summary").focus(); await page.keyboard.press("Enter");
    assert.equal(await first.evaluate(node=>node.open),true);
    assert.ok((await first.innerText()).includes("Current sizes, colors, price and availability are unconfirmed"));
    await page.keyboard.press("Enter");
    assert.equal(await first.evaluate(node=>node.open),false);
    for(const width of [320,390,650,768,1024,1440]){
      await page.setViewportSize({width,height:viewport.height});
      assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),"Fashion overflow at "+width);
    }
    await page.setViewportSize({width:viewport.width,height:viewport.height});
    assert.equal(await page.evaluate(()=>getComputedStyle(document.documentElement).scrollBehavior),"auto");
    await page.goto(origin+"/fashion.html?hotline-preview=1",{waitUntil:"networkidle"});
    assert.equal(await page.locator("#chef-launcher").textContent(),"Big Chef Dog · preview");
    await page.locator("#chef-launcher").focus();await page.keyboard.press("Enter");
    assert.equal(await page.locator("#chef-dialog").evaluate(node=>node.open),true);
    assert.equal(await page.locator("#chef-greeting").textContent(),"Congratulations. You've reached the Big Chef Dog. He wasn't expecting you. But then again, he never is.");
    assert.equal(await page.locator(".chef-message").textContent(),"Leave him a message. Maybe he'll get back to you.");
    assert.equal(await page.locator("#chef-call, a[href^='tel:'], .chef-portrait, .chef-launcher-portrait").count(),0);
    assert.deepEqual(await page.locator(".chef-routes a").evaluateAll(nodes=>nodes.map(a=>a.getAttribute("href"))),["index.html#chapter-unexpected","index.html#gallery"]);
    for(const key of ["Tab","Tab","Tab","Tab","Shift+Tab","Shift+Tab"]){
      await page.keyboard.press(key);
      assert.equal(await page.evaluate(()=>document.querySelector("#chef-dialog").contains(document.activeElement)),true);
    }
    await shot(page,"hotline-preview-"+viewport.name);
    await page.keyboard.press("Escape");
    assert.equal(await page.locator("#chef-dialog").evaluate(node=>node.open),false);
    assert.equal(await page.locator("#chef-launcher").evaluate(node=>node===document.activeElement),true);
    await page.locator("#chef-launcher").click();await page.locator("#chef-close").click();
    assert.equal(await page.locator("#chef-dialog").evaluate(node=>node.open),false);
    assert.deepEqual(externalRequests,[]);
    results.viewports.push(viewport);
    await context.close();
  }
  const noScript=await browser.newContext({javaScriptEnabled:false,viewport:{width:390,height:844}});
  const plain=await noScript.newPage();
  await plain.goto(origin+"/fashion.html");
  assert.equal(await plain.locator("[data-fashion-record]:visible").count(),71);
  assert.equal(await plain.locator(".fashion-tools").isVisible(),false);
  await plain.locator("[data-fashion-record] summary").first().click();
  assert.equal(await plain.locator("[data-fashion-record] details").first().evaluate(node=>node.open),true);
  await noScript.close();
  assert.deepEqual(errors,[]);
  results.checks=["71 exact source names, 79 distinct provisional groups, 716 historical variants","Every card identity, category, source link and group count matches inventory","Seven supported category filters, keyboard activation, case-insensitive search, no results and clear/focus","All records and native source disclosure usable without JavaScript","No current prices, inventory or purchase destination invented; no commerce action inside archival records","25 HatsRx design references remain distinct from Pinky's historical records","No default logo, portrait, floating hotline or telephone link without verified assets","Local-only hotline preview exact copy, route links, Tab containment, Escape, Close and restored focus","No horizontal overflow at 320, 390, 650, 768, 1024 and 1440 pixels","No external requests or browser errors; reduced-motion mode","Eight current desktop/mobile fashion and hotline screenshots"];
  await fs.writeFile(path.join(root,"review/fashion-browser-results.json"),JSON.stringify(results,null,2)+"\n");
  console.log("PASS: fashion source identities, archive filters/search, native disclosure, hotline preview, no-JS, responsive widths and eight screenshots.");
} finally {
  await browser.close();
  await new Promise(resolve=>server.close(resolve));
}
