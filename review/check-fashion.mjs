import assert from "node:assert/strict";
import { chromium } from "playwright-core";
import { createServer } from "node:http";
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { createHash } from "node:crypto";
import vm from "node:vm";

const root = fileURLToPath(new URL("../", import.meta.url));
// Independent hashes measured from the two user-supplied original JPEGs.
// These assertions verify the shipped files without requiring attachment paths
// or exposing private filesystem locations in the review artifact.
const expectedIdentity = [
  {key:"originalLogo",src:"assets/identity/pinkys-space-original-logo.jpg",bytes:32358,sha256:"60b2b87f88f69576f0fb2c1fbcd083719c4a72f1fd082d5f22ee8898275ae497",width:812,height:1280,confirmed:"originalArtworkConfirmed"},
  {key:"chefPortrait",src:"assets/identity/big-chef-dog-halloween.jpg",bytes:83842,sha256:"e971f4eeea9c40202a3193f2b813dbf6e13e2052f2206340e0f1536b108f6936",width:960,height:1280,confirmed:"originalHalloweenPhotoConfirmed"}
];
const identityContext = vm.createContext({window:{}});
vm.runInContext(await fs.readFile(path.join(root,"content/identity.js"),"utf8"),identityContext,{timeout:1000});
const identity = identityContext.window.PINKYS_IDENTITY;
const identityManifest = JSON.parse(await fs.readFile(path.join(root,"review/identity-sources.json"),"utf8"));
assert.equal(identityManifest.records.length,2);
const expectedTelephone={e164:"+13476354690",display:"(347) 635-4690"};
assert.equal(identity.publicTelephone.e164,expectedTelephone.e164);
assert.equal(identity.publicTelephone.display,expectedTelephone.display);
assert.equal(identity.publicTelephone.publicHotlineUseConfirmed,true);
assert.ok(identity.publicTelephone.sourceReference.includes("1000002984.jpg"));
assert.match(identity.publicTelephone.verifiedAt,/^\d{4}-\d{2}-\d{2}$/);
assert.equal(identity.publicTelephone.display.replace(/\D/g,""),identity.publicTelephone.e164.slice(2));
for(const expected of expectedIdentity){
  const configured=identity[expected.key];
  assert.equal(configured.src,expected.src);
  assert.equal(configured.width,expected.width);
  assert.equal(configured.height,expected.height);
  assert.equal(configured[expected.confirmed],true);
  assert.ok(configured.alt && configured.sourceReference);
  assert.match(configured.verifiedAt,/^\d{4}-\d{2}-\d{2}$/);
  const bytes=await fs.readFile(path.join(root,expected.src));
  assert.equal(bytes.length,expected.bytes);
  assert.equal(createHash("sha256").update(bytes).digest("hex"),expected.sha256,"Original image bytes changed: "+expected.src);
  const provenance=identityManifest.records.find(record=>record.src===expected.src);
  assert.ok(provenance,"Missing original-image source manifest record: "+expected.src);
  for(const field of ["bytes","sha256","width","height"]) assert.equal(provenance[field],expected[field],"Identity manifest mismatch: "+expected.src+"/"+field);
  assert.equal(provenance.source_sha256,expected.sha256);
  assert.deepEqual(provenance.source_dimensions,[expected.width,expected.height]);
}
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
const mime = {".html":"text/html",".css":"text/css",".js":"text/javascript",".webp":"image/webp",".jpg":"image/jpeg",".jpeg":"image/jpeg",".svg":"image/svg+xml",".json":"application/json"};
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
const results = {browser:await browser.version(),inventory:{exactNames:71,provisionalGroups:79,historicalVariants:716,verifiedCurrentSquareItems:0},identityAssets:expectedIdentity.map(({key,src,bytes,sha256,width,height})=>({key,src,bytes,sha256,width,height,originalBytesVerified:true})),publicHotline:expectedTelephone,viewports:[],checks:[],screenshots:[],limitations:["No current Square product page was accessible; remote destination availability and checkout were not exercised.","No physical device, Safari, or assistive-technology testing is implied.","The owner-confirmed public telephone link is checked by intercepted keyboard activation. No call was placed and voicemail delivery was not tested. The private account-settings screenshot is not a website asset."]};
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
async function decodeIdentityImages(page){
  for(const image of await page.locator("[data-original-logo] img, .chef-portrait, .chef-launcher-portrait").all()){
    const decoded=await image.evaluate(async node=>{
      await node.decode();
      const style=getComputedStyle(node);
      return {src:new URL(node.currentSrc).pathname.slice(1),width:node.naturalWidth,height:node.naturalHeight,alt:node.alt,objectFit:style.objectFit,filter:style.filter,clipPath:style.clipPath,borderRadius:style.borderRadius};
    });
    const expected=expectedIdentity.find(asset=>asset.src===decoded.src);
    assert.ok(expected,"Unexpected identity image: "+decoded.src);
    assert.equal(decoded.width,expected.width);
    assert.equal(decoded.height,expected.height);
    assert.ok(decoded.alt.trim());
    assert.equal(decoded.objectFit,"contain","Identity image must retain its full frame");
    assert.equal(decoded.filter,"none","Original identity image must retain its supplied colors");
    assert.equal(decoded.clipPath,"none","Original identity image must not be clipped");
    assert.equal(decoded.borderRadius,"0px","Original identity portrait must not use avatar cropping");
  }
}
async function checkHotline(page,viewport,preview,capture=true){
  const launcher=page.locator("#chef-launcher");
  assert.equal(await launcher.textContent(),preview ? "Big Chef Dog · preview" : "Big Chef Dog Hotline");
  assert.equal(await page.locator(".chef-portrait").count(),1);
  assert.equal(await page.locator(".chef-launcher-portrait").count(),1);
  assert.equal(await page.locator("#chef-call").count(),preview ? 0 : 1);
  assert.equal(await page.locator("a[href^='tel:']").count(),preview ? 0 : 1);
  await decodeIdentityImages(page);
  await launcher.focus();await page.keyboard.press("Enter");
  assert.equal(await page.locator("#chef-dialog").evaluate(node=>node.open),true);
  assert.equal(await page.locator("#chef-greeting").textContent(),"Congratulations. You've reached the Big Chef Dog. He wasn't expecting you. But then again, he never is.");
  assert.equal(await page.locator(".chef-message").textContent(),"Leave him a message. Maybe he'll get back to you.");
  if(!preview){
    const call=page.locator("#chef-call");
    assert.equal(await call.getAttribute("href"),"tel:"+expectedTelephone.e164);
    assert.equal(await call.isVisible(),true);
    const label=await call.innerText();
    assert.ok(label.includes(expectedTelephone.display),"Visible call label must include the owner-confirmed public number");
    assert.equal(label.replace(/\D/g,""),expectedTelephone.display.replace(/\D/g,""),"Visible telephone number and actual destination must agree");
    // Test keyboard activation without handing a call to the operating system.
    await call.evaluate(link=>{
      window.__chefCallActivation=null;
      link.addEventListener("click",event=>{
        event.preventDefault();
        window.__chefCallActivation={href:link.getAttribute("href"),trusted:event.isTrusted};
      },{once:true});
    });
    const beforeActivation=page.url();
    await call.focus();await page.keyboard.press("Enter");
    const activation=await page.evaluate(()=>window.__chefCallActivation);
    assert.deepEqual(activation,{href:"tel:"+expectedTelephone.e164,trusted:true});
    assert.equal(page.url(),beforeActivation);
  }
  assert.deepEqual(await page.locator(".chef-routes a").evaluateAll(nodes=>nodes.map(a=>a.getAttribute("href"))),["index.html#chapter-unexpected","index.html#gallery"]);
  for(const key of ["Tab","Tab","Tab","Tab","Shift+Tab","Shift+Tab"]){
    await page.keyboard.press(key);
    assert.equal(await page.evaluate(()=>document.querySelector("#chef-dialog").contains(document.activeElement)),true);
  }
  if(capture) await shot(page,(preview ? "hotline-preview-" : "hotline-")+viewport.name);
  await page.keyboard.press("Escape");
  assert.equal(await page.locator("#chef-dialog").evaluate(node=>node.open),false);
  assert.equal(await launcher.evaluate(node=>node===document.activeElement),true);
  await launcher.click();await page.locator("#chef-close").click();
  assert.equal(await page.locator("#chef-dialog").evaluate(node=>node.open),false);
  assert.equal(await launcher.evaluate(node=>node===document.activeElement),true);
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
    await page.locator(".fashion-cover figure img").evaluate(img=>img.decode());
    assert.equal(await page.locator("[data-fashion-record]").count(),71);
    assert.equal(await page.locator("[data-fashion-record]:visible").count(),71);
    assert.equal(await page.locator(".fashion-group").count(),79);
    assert.equal(await page.locator("[data-fashion-filter]").count(),8);
    assert.equal(await page.locator("#chef-launcher, #chef-dialog").count(),2);
    assert.equal(await page.locator("a[href^='tel:']").count(),1);
    assert.equal(await page.locator("#chef-call").getAttribute("href"),"tel:"+expectedTelephone.e164);
    assert.ok(await page.locator("[data-original-logo] img").count()>0);
    assert.equal(await page.locator("[data-original-logo]").first().isVisible(),true);
    await decodeIdentityImages(page);
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
    await page.evaluate(()=>window.scrollTo({top:0,behavior:"instant"}));
    await checkHotline(page,viewport,false);
    await page.goto(origin+"/fashion.html?hotline-preview=1",{waitUntil:"networkidle"});
    await checkHotline(page,viewport,true);
    await page.goto(origin+"/index.html",{waitUntil:"networkidle"});
    await checkHotline(page,viewport,false,false);
    await page.goto(origin+"/index.html?hotline-preview=1",{waitUntil:"networkidle"});
    await checkHotline(page,viewport,true,false);
    assert.deepEqual(externalRequests,[]);
    results.viewports.push(viewport);
    await context.close();
  }
  // Independently exercise the missing-asset gate without modifying source files.
  const missing=await browser.newContext({viewport:{width:390,height:844}});
  const missingRequests=[];
  await missing.route("**/*",route=>{
    const url=route.request().url();
    missingRequests.push(url);
    if(url===origin+"/content/identity.js") route.fulfill({contentType:"text/javascript",body:"window.PINKYS_IDENTITY={originalLogo:null,chefPortrait:null,publicTelephone:null};"});
    else if(url.startsWith(origin+"/")) route.continue();
    else route.abort();
  });
  const missingPage=await missing.newPage();
  for(const entry of ["index.html","fashion.html"]){
    await missingPage.goto(origin+"/"+entry,{waitUntil:"networkidle"});
    assert.equal(await missingPage.locator("#chef-launcher, #chef-dialog, a[href^='tel:'], [data-original-logo] img").count(),0);
  }
  assert.equal(missingRequests.filter(url=>url.includes("/assets/identity/")).length,0);
  assert.equal(missingRequests.filter(url=>!url.startsWith(origin+"/")).length,0);
  await missing.close();
  // Owner approval, provenance and valid E.164 are independently required.
  // Keep the authentic portrait active while denying each telephone candidate.
  // Invalid fixtures use malformed non-dialable strings, not other real numbers.
  const deniedTelephones=[
    {name:"null",value:null},
    {name:"public use not confirmed",value:{...identity.publicTelephone,publicHotlineUseConfirmed:false}},
    {name:"missing source",value:{...identity.publicTelephone,sourceReference:""}},
    {name:"invalid E.164",value:{...identity.publicTelephone,e164:"not-a-telephone"}},
    {name:"invalid leading zero",value:{...identity.publicTelephone,e164:"+00000000"}},
    {name:"too short",value:{...identity.publicTelephone,e164:"+1"}},
    {name:"too long",value:{...identity.publicTelephone,e164:"+1234567890123456"}}
  ];
  for(const fixture of deniedTelephones){
    const denied=await browser.newContext({viewport:{width:390,height:844}});
    const deniedIdentity={...identity,publicTelephone:fixture.value};
    await denied.route("**/*",route=>{
      const url=route.request().url();
      if(url===origin+"/content/identity.js") route.fulfill({contentType:"text/javascript",body:"window.PINKYS_IDENTITY="+JSON.stringify(deniedIdentity)+";"});
      else if(url.startsWith(origin+"/")) route.continue();
      else route.abort();
    });
    const deniedPage=await denied.newPage();
    for(const entry of ["index.html","fashion.html"]){
      await deniedPage.goto(origin+"/"+entry,{waitUntil:"networkidle"});
      assert.equal(await deniedPage.locator("#chef-launcher, #chef-dialog").count(),2,"Portrait guide should remain available: "+fixture.name);
      assert.equal(await deniedPage.locator(".chef-launcher-portrait, .chef-portrait").count(),2);
      assert.equal(await deniedPage.locator("#chef-call, a[href^='tel:']").count(),0,"Rejected telephone must never become a link: "+fixture.name);
    }
    await denied.close();
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
  results.checks=["71 exact source names, 79 distinct provisional groups, 716 historical variants","Every card identity, category, source link and group count matches inventory","Seven supported category filters, keyboard activation, case-insensitive search, no results and clear/focus","All records and native source disclosure usable without JavaScript","No current prices, inventory or purchase destination invented; no commerce action inside archival records","25 HatsRx design references remain distinct from Pinky's historical records","Original logo and Halloween portrait JPEG byte counts and SHA-256 match independent supplied-source hashes","Original identity images decode at supplied dimensions with nonempty descriptions","Normal portrait launcher and local-only preview on homepage and fashion page: exact approved copy, route links, Tab containment, Escape, Close and restored focus","Owner-confirmed visible telephone number matches tel:+13476354690; intercepted keyboard activation places no call","Local preview suppresses telephone links on both pages","Null, false approval, missing provenance and malformed E.164 each suppress telephone links while portrait guide stays active on both pages","Runtime all-null identity override keeps normal logo and guide absent and requests no identity images on homepage and fashion page","No horizontal overflow at 320, 390, 650, 768, 1024 and 1440 pixels","No external requests or browser errors; reduced-motion mode","Ten current desktop/mobile fashion, normal hotline and hotline-preview screenshots"];
  await fs.writeFile(path.join(root,"review/fashion-browser-results.json"),JSON.stringify(results,null,2)+"\n");
  console.log("PASS: fashion identities, filters/search, original identity bytes/images, public hotline/intercepted activation, preview/telephone gates, no-JS, responsive widths and ten screenshots.");
} finally {
  await browser.close();
  await new Promise(resolve=>server.close(resolve));
}
