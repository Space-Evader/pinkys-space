/* No tracking, network writes, or checkout creation. */
(() => {
  "use strict";
  const chapters = Array.isArray(window.PINKYS_ARCHIVE) ? window.PINKYS_ARCHIVE : [];
  const journal = document.querySelector("#journal");
  const chapterLinks = [...document.querySelectorAll("[data-chapter]")];
  const text = (tag, value, className) => {
    const node = document.createElement(tag);
    node.textContent = value || "";
    if (className) node.className = className;
    return node;
  };
  const safeMedia = (value) => {
    if (typeof value !== "string" || !value.trim()) return null;
    try {
      const url = new URL(value, document.baseURI);
      return url.protocol === "https:" || (url.origin === location.origin && /^(http:|file:)$/.test(url.protocol)) ? url.href : null;
    } catch { return null; }
  };
  const addMedia = (parent, entry) => {
    const source = safeMedia(entry.image);
    if (!source || !entry.alt || !entry.credit) return;
    const figure = document.createElement("figure");
    const img = document.createElement("img");
    img.src = source; img.alt = entry.alt; img.loading = "lazy"; img.decoding = "async";
    const positivePixels = value => Number.isInteger(Number(value)) && Number(value) > 0 && Number(value) <= 20000;
    if (positivePixels(entry.width) && positivePixels(entry.height)) {
      img.width = Number(entry.width); img.height = Number(entry.height);
    } else {
      // Reserve a neutral frame until original dimensions are supplied.
      img.className = "media-undimensioned";
    }
    const variants = new Map();
    for (const variant of Array.isArray(entry.sources) ? entry.sources : []) {
      const url = safeMedia(variant.src);
      if (url && positivePixels(variant.width)) variants.set(Number(variant.width), url.replaceAll(",", "%2C"));
    }
    if (variants.size) {
      img.srcset = [...variants].sort((a, b) => a[0] - b[0]).map(([width, url]) => url + " " + width + "w").join(", ");
      img.sizes = "(max-width: 650px) calc(100vw - 100px), 50vw";
    }
    const caption = document.createElement("figcaption");
    if (entry.caption) caption.append(text("span", entry.caption));
    caption.append(text("span", entry.credit, "credit"));
    img.addEventListener("error", () => figure.remove(), { once: true });
    figure.append(img, caption); parent.append(figure);
  };
  function selectChapter(id, focus = false) {
    const chapter = chapters.find(item => item.id === id);
    if (!chapter || !journal) return false;
    const article = document.createElement("article");
    article.id = "chapter-" + chapter.id;
    article.append(text("p", "CHAPTER " + chapter.number + " / " + chapter.label.toUpperCase(), "eyebrow"));
    const heading = text("h3", chapter.title);
    article.append(heading, text("p", chapter.story));
    for (const entry of chapter.entries || []) {
      const section = document.createElement("section");
      section.className = "entry";
      if (entry.date) section.append(text("p", entry.date, "eyebrow"));
      section.append(text("h4", entry.title));
      addMedia(section, entry);
      if (entry.video) {
        const video = safeMedia(entry.video);
        if (video) {
          const link = text("a", entry.videoLabel || "Watch the archive video ↗");
          link.href = video; link.target = "_blank"; link.rel = "noopener noreferrer";
          section.append(link);
        }
      }
      if (entry.body) section.append(text("p", entry.body));
      article.append(section);
    }
    const share = text("a", "Share a memory from this chapter ↗");
    share.href = "mailto:info@pinkys.space?subject=" + encodeURIComponent("Pinky’s Days / " + chapter.label);
    article.append(share);
    journal.replaceChildren(article);
    for (const link of chapterLinks) {
      if (link.dataset.chapter === id) link.setAttribute("aria-current", "true");
      else link.removeAttribute("aria-current");
    }
    if (focus) {
      heading.tabIndex = -1;
      heading.focus({ preventScroll: true });
      heading.scrollIntoView({ block: "start" });
    }
    return true;
  }
  function fromHash() {
    const id = location.hash.startsWith("#chapter-") ? location.hash.slice(9) : "";
    if (id) selectChapter(id);
  }
  chapterLinks.forEach(link => link.addEventListener("click", event => {
    if (!chapters.length) return;
    event.preventDefault();
    const id = link.dataset.chapter;
    if (!selectChapter(id, true)) return;
    history.pushState(null, "", "#chapter-" + id);
  }));
  document.querySelector("[data-open-garden]")?.addEventListener("click", event => {
    if (!chapters.length) return;
    event.preventDefault();
    selectChapter("garden", true);
    history.pushState(null, "", "#chapter-garden");
  });
  window.addEventListener("hashchange", fromHash);
  window.addEventListener("popstate", fromHash);
  selectChapter("restaurant"); fromHash();
  const works = [
    { type: "HERO WORK", title: "Double Heart Transmission", price: 88, original: true, description: "A crossing of frequencies. Two hearts, mirrored and inverted — like signal loops caught between memory and motion." },
    { type: "COLLECTOR PIECE", title: "Origin Carrier", price: 111, original: true, description: "A being beyond identity, marked by a signal. A carrier of memory traveling across dimensions of culture, time, and transmission." },
    { type: "EDITION", title: "Gold Vein Memory", price: 222, description: "Buried wealth. A path carved through heat and time. A work from the subconscious archive, where value is revealed." },
    { type: "PORTAL WORK", title: "Signal Portal", price: 333, description: "Architecture becomes frequency — a threshold between the physical city and the unseen layer beneath it." },
    { type: "NIGHT SIGNAL", title: "Night Mode / Eye Signal", price: 222, description: "The observer awakens in the dark. A field of signals, stars, and hidden motion — suspended between digital and dream space." }
  ];
  const dialog = document.querySelector("#work-dialog");
  let opener = null;
  document.querySelectorAll("[data-work]").forEach(button => button.addEventListener("click", () => {
    const work = works[Number(button.dataset.work)];
    if (!work) return;
    document.querySelector("#work-type").textContent = work.type;
    document.querySelector("#work-title").textContent = work.title;
    document.querySelector("#work-description").textContent = work.description;
    document.querySelector("#work-price").textContent = "Print: $" + work.price + (work.original ? " · Original available upon request" : "");
    const href = "mailto:info@pinkys.space?subject=" + encodeURIComponent("Collection inquiry / " + work.title);
    document.querySelector("#work-inquiry").href = href;
    if (typeof dialog.showModal !== "function") { location.href = href; return; }
    opener = button; dialog.showModal();
  }));
  dialog.querySelector(".close").addEventListener("click", () => dialog.close());
  dialog.addEventListener("click", event => { if (event.target === dialog) dialog.close(); });
  dialog.addEventListener("close", () => opener?.focus());
})();
