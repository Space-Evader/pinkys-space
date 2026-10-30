import assert from "node:assert/strict";
import fs from "node:fs";
import vm from "node:vm";

// Behavioral checks with a small DOM fixture; visual/native dialog QA remains separate.
class Element {
  constructor(tag = "div") {
    this.tagName = tag; this.events = {}; this.attributes = {}; this.dataset = {};
    this.textContent = ""; this.hidden = false; this.children = []; this.open = false;
  }
  addEventListener(type, handler) { (this.events[type] ||= []).push(handler); }
  emit(type, properties = {}) {
    const event = { target: this, button: 0, prevented: false, preventDefault() { this.prevented = true; }, ...properties };
    for (const handler of this.events[type] || []) handler(event);
    return event;
  }
  focus() { this.focused = true; }
  scrollIntoView(options) { this.scrolled = options; }
  removeAttribute(name) { delete this.attributes[name]; delete this[name]; }
  showModal() { this.open = true; }
  close() { this.open = false; this.emit("close"); }
  querySelector(selector) { return this.selectors?.[selector] || null; }
}
function setup({ supported = true } = {}) {
  const photos = Array.from({ length: 23 }, (_, index) => ({
    full: "assets/portfolio/" + index + "-full.webp",
    image: "assets/portfolio/" + index + ".webp",
    caption: index === 0 ? "<script>Caption stays text</script>" : "Descriptive caption " + index,
    alt: "Artwork description " + index, width: 1800, height: 1200
  }));
  const links = photos.map((_, index) => {
    const link = new Element("A"); link.dataset.photo = String(index); return link;
  });
  const cards = links.map(link => {
    const card = new Element(); card.selectors = { ".portfolio-open": link }; return card;
  });
  const nodes = Object.fromEntries(["portfolio-more", "portfolio-dialog", "portfolio-image", "portfolio-caption", "portfolio-count", "portfolio-prev", "portfolio-next"].map(id => ["#" + id, new Element()]));
  const close = new Element("BUTTON");
  nodes["#portfolio-dialog"].selectors = { "[data-photo-close]": close };
  if (!supported) nodes["#portfolio-dialog"].showModal = undefined;
  const context = vm.createContext({
    URL, window: { PINKYS_PORTFOLIO: photos }, location: { origin: "https://review.example" },
    document: {
      baseURI: "https://review.example/index.html",
      querySelector: selector => nodes[selector],
      querySelectorAll: selector => selector.includes(".portfolio-open") ? links : cards
    }
  });
  vm.runInContext(fs.readFileSync("assets/portfolio.js", "utf8"), context);
  return { photos, links, cards, nodes, close };
}
const { photos, links, cards, nodes, close } = setup();
assert.equal(cards.filter(card => card.hidden).length, 15);
assert.equal(nodes["#portfolio-more"].textContent, "Show all 23 images");
nodes["#portfolio-more"].emit("click");
assert.equal(cards.some(card => card.hidden), false);
assert.equal(nodes["#portfolio-more"].hidden, true);
assert.equal(links[8].focused, true);
assert.equal(links[8].scrolled.block, "nearest");
assert.equal(links[0].emit("click", { ctrlKey: true }).prevented, false);
assert.equal(nodes["#portfolio-dialog"].open, false);
assert.equal(links[0].emit("click").prevented, true);
assert.equal(nodes["#portfolio-dialog"].open, true);
assert.equal(nodes["#portfolio-image"].src, "https://review.example/assets/portfolio/0-full.webp");
assert.equal(nodes["#portfolio-caption"].textContent, "<script>Caption stays text</script>");
assert.equal(nodes["#portfolio-image"].alt, "Artwork description 0");
assert.equal(nodes["#portfolio-image"].width, 1800);
nodes["#portfolio-prev"].emit("click");
assert.equal(nodes["#portfolio-count"].textContent, "23 / 23");
nodes["#portfolio-next"].emit("click");
assert.equal(nodes["#portfolio-count"].textContent, "1 / 23");
const dialog = nodes["#portfolio-dialog"];
assert.equal(dialog.emit("keydown", { key: "ArrowRight" }).prevented, true);
assert.equal(nodes["#portfolio-count"].textContent, "2 / 23");
assert.equal(dialog.emit("keydown", { key: "ArrowRight", target: new Element("INPUT") }).prevented, false);
assert.equal(nodes["#portfolio-count"].textContent, "2 / 23");
dialog.emit("click", { target: new Element() });
assert.equal(dialog.open, true);
close.emit("click");
assert.equal(dialog.open, false);
assert.equal(links[0].focused, true);
assert.equal(nodes["#portfolio-image"].src, undefined);
links[5].emit("click");
dialog.emit("click");
assert.equal(dialog.open, false);
assert.equal(links[5].focused, true);
photos[2].full = "javascript:alert(1)";
assert.equal(links[2].emit("click").prevented, false);
assert.equal(dialog.open, false);
links[2].dataset.photo = "-1";
assert.equal(links[2].emit("click").prevented, false);
const legacy = setup({ supported: false });
assert.equal(legacy.links[0].emit("click").prevented, false);
console.log("PASS: portfolio disclosure, local full views, literal captions, wrap navigation, keyboard controls, focus restoration, backdrop handling, modified clicks, unsafe source rejection, and native-link fallback.");
