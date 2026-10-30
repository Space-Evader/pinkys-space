import assert from "node:assert/strict";
import fs from "node:fs";
import vm from "node:vm";

// Focused behavioral checks without a browser. Native dialog, layout, keyboard
// behavior, screen readers and remote checkout still require browser review.
class Element {
  constructor(tag = "div") { this.tagName = tag; this.children = []; this.dataset = {}; this.attributes = {}; this.events = {}; this.textContent = ""; }
  append(...items) { this.children.push(...items); }
  replaceChildren(...items) { this.children = items; }
  setAttribute(key, value) { this.attributes[key] = value; }
  removeAttribute(key) { delete this.attributes[key]; }
  addEventListener(type, handler) { this.events[type] = handler; }
  focus() { this.focused = true; }
  scrollIntoView() { this.scrolled = true; }
  remove() { this.removed = true; }
  showModal() { this.open = true; }
  close() { this.open = false; this.events.close?.(); }
}
const ids = ["restaurant", "garden", "artists", "visitors", "unexpected", "transformation", "continues"];
const chapterLinks = ids.map(id => { const el = new Element("a"); el.dataset.chapter = id; return el; });
const workButtons = Array.from({length:5}, (_, index) => { const el = new Element("button"); el.dataset.work = String(index); return el; });
const selectors = Object.fromEntries(["journal","work-dialog","work-title","work-description","work-price","work-type","work-inquiry"].map(id => ["#" + id, new Element()]));
const garden = new Element("a");
const close = new Element("button");
selectors["#work-dialog"].querySelector = () => close;
const location = {hash:"",origin:"https://review.example",href:"https://review.example/"};
const document = {
  baseURI: location.href,
  createElement: tag => new Element(tag),
  querySelectorAll: selector => selector === "[data-chapter]" ? chapterLinks : workButtons,
  querySelector: selector => selector === "[data-open-garden]" ? garden : selectors[selector]
};
const window = {events:{},addEventListener(type, fn){ this.events[type] = fn; }};
const context = vm.createContext({window,document,location,URL,history:{pushState(_state,_title,hash){location.hash = hash;}}});
vm.runInContext(fs.readFileSync("content/archive.js","utf8"),context);
assert.equal(window.PINKYS_ARCHIVE.length,7);
assert.deepEqual(Array.from(window.PINKYS_ARCHIVE, c => c.id),ids);
// Approved-media behavior is tested with an in-memory fixture, never shipped.
window.PINKYS_ARCHIVE[1].entries = [
  {title:"Fixture", body:"<script>alert(1)</script>",image:"assets/test.jpg",alt:"Test description",caption:"Test caption",credit:"Test credit"},
  {title:"Rejected URL",body:"Fixture",image:"javascript:alert(1)",alt:"Unsafe URL",credit:"Test"}
];
vm.runInContext(fs.readFileSync("assets/space.js","utf8"),context);
assert.equal(chapterLinks[0].attributes["aria-current"],"true");
const click = el => el.events.click({preventDefault(){},target:el});
for (const [index, link] of chapterLinks.entries()) {
  click(link);
  assert.equal(selectors["#journal"].children[0].id,"chapter-" + ids[index]);
  assert.equal(chapterLinks.filter(item => item.attributes["aria-current"] === "true").length,1);
  assert.equal(location.hash,"#chapter-" + ids[index]);
}
click(garden);
const gardenArticle = selectors["#journal"].children[0];
const entries = gardenArticle.children.filter(node => node.className === "entry");
assert.equal(entries[0].children.find(node => node.tagName === "p").textContent,"<script>alert(1)</script>");
assert.equal(entries[0].children.find(node => node.tagName === "figure").children[0].src,"https://review.example/assets/test.jpg");
assert.equal(entries[1].children.some(node => node.tagName === "figure"),false);
location.hash = "#chapter-artists"; window.events.popstate();
assert.equal(selectors["#journal"].children[0].id,"chapter-artists");
for (const [index, button] of workButtons.entries()) {
  click(button);
  assert.ok(selectors["#work-dialog"].open);
  assert.ok(selectors["#work-price"].textContent.includes("$" + [88,111,222,333,222][index]));
  assert.ok(selectors["#work-inquiry"].href.startsWith("mailto:info@pinkys.space?subject="));
  click(close);
  assert.equal(selectors["#work-dialog"].open,false);
  assert.equal(button.focused,true);
}
console.log("PASS: seven archive chapters, navigation history, approved media, safe text rendering, blocked unsafe media, five product details, preserved prices, inquiry URLs, dialog close/focus callbacks.");
