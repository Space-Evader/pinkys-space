/* Local portfolio viewing only. Captions are descriptive, not product matches. */
(() => {
  "use strict";
  const photos = Array.isArray(window.PINKYS_PORTFOLIO) ? window.PINKYS_PORTFOLIO : [];
  const links = [...document.querySelectorAll("#gallery .portfolio-open")];
  const cards = [...document.querySelectorAll("#gallery .portfolio-card")];
  const more = document.querySelector("#portfolio-more");
  const dialog = document.querySelector("#portfolio-dialog");
  const image = document.querySelector("#portfolio-image");
  const caption = document.querySelector("#portfolio-caption");
  const count = document.querySelector("#portfolio-count");
  const previous = document.querySelector("#portfolio-prev");
  const next = document.querySelector("#portfolio-next");
  const close = dialog?.querySelector("[data-photo-close]");
  if (!photos.length || !links.length) return;

  if (more && cards.length > 8) {
    cards.slice(8).forEach(card => { card.hidden = true; });
    more.textContent = "Show all " + cards.length + " images";
    more.hidden = false;
    more.addEventListener("click", () => {
      cards.slice(8).forEach(card => { card.hidden = false; });
      more.hidden = true;
      const firstNew = cards[8].querySelector(".portfolio-open");
      firstNew?.focus({ preventScroll: true });
      firstNew?.scrollIntoView({ block: "nearest" });
    });
  }

  // Keep image links useful in browsers without native modal-dialog support.
  if (!dialog || typeof dialog.showModal !== "function" || !image || !caption || !count || !previous || !next || !close) return;
  let selected = 0;
  let opener = null;
  const localSource = value => {
    if (typeof value !== "string" || !value.startsWith("assets/")) return null;
    try {
      const url = new URL(value, document.baseURI);
      return url.origin === location.origin ? url.href : null;
    } catch { return null; }
  };
  const render = index => {
    const wrapped = (index + photos.length) % photos.length;
    const photo = photos[wrapped];
    const source = localSource(photo?.full || photo?.image);
    if (!source) return false;
    selected = wrapped;
    image.alt = typeof photo.alt === "string" ? photo.alt : "";
    image.src = source;
    image.decoding = "async";
    image.loading = "eager";
    const dimension = value => Number.isInteger(Number(value)) && Number(value) > 0 && Number(value) <= 20000;
    if (dimension(photo.width) && dimension(photo.height)) {
      image.width = Number(photo.width);
      image.height = Number(photo.height);
    } else {
      image.removeAttribute("width");
      image.removeAttribute("height");
    }
    caption.textContent = typeof photo.caption === "string" ? photo.caption : "";
    count.textContent = (selected + 1) + " / " + photos.length;
    previous.disabled = photos.length < 2;
    next.disabled = photos.length < 2;
    return true;
  };
  links.forEach(link => link.addEventListener("click", event => {
    // Preserve browser gestures such as opening an image in another tab.
    if (event.button > 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    const index = Number(link.dataset.photo);
    if (!Number.isInteger(index) || index < 0 || index >= photos.length || !render(index)) return;
    event.preventDefault();
    opener = link;
    dialog.showModal();
  }));
  previous.addEventListener("click", () => render(selected - 1));
  next.addEventListener("click", () => render(selected + 1));
  close.addEventListener("click", () => dialog.close());
  dialog.addEventListener("click", event => {
    if (event.target === dialog) dialog.close();
  });
  dialog.addEventListener("keydown", event => {
    if (dialog.open && event.key === "Tab") {
      const controls = [...dialog.querySelectorAll('button:not([disabled]), a[href]')];
      const first = controls[0], last = controls.at(-1);
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last?.focus(); }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first?.focus(); }
      return;
    }
    if (!dialog.open || event.metaKey || event.ctrlKey || event.altKey || event.shiftKey) return;
    const target = event.target;
    if (target?.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/i.test(target?.tagName || "")) return;
    if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
      event.preventDefault();
      render(selected + (event.key === "ArrowLeft" ? -1 : 1));
    }
  });
  // Escape is handled natively and also reaches this close event.
  dialog.addEventListener("close", () => {
    image.removeAttribute("src");
    opener?.focus({ preventScroll: true });
  });
})();
