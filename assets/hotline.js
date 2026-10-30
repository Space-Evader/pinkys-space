/* A local, non-AI guide. No messages are collected, stored, or transmitted. */
(() => {
  "use strict";
  const identity = window.PINKYS_IDENTITY || {};
  const localSource = value => {
    if (typeof value !== "string" || !value.trim()) return null;
    try {
      const url = new URL(value, document.baseURI);
      return url.origin === location.origin && /^(https?:|file:)$/.test(url.protocol) ? url.href : null;
    } catch { return null; }
  };
  const sourced = value => Boolean(value && typeof value.sourceReference === "string" && value.sourceReference.trim() && /^\d{4}-\d{2}-\d{2}$/.test(value.verifiedAt || ""));
  const verifiedImage = (value, kind) => Boolean(value && value[kind] === true && sourced(value) && localSource(value.src) && value.alt && Number.isInteger(value.width) && value.width > 0 && Number.isInteger(value.height) && value.height > 0);
  const logoReady = verifiedImage(identity.originalLogo, "originalArtworkConfirmed");
  const portraitReady = verifiedImage(identity.chefPortrait, "originalHalloweenPhotoConfirmed");
  const phone = identity.publicTelephone;
  const telephoneReady = Boolean(phone && sourced(phone) && phone.publicHotlineUseConfirmed === true && /^\+[1-9]\d{7,14}$/.test(phone.e164 || "") && phone.e164.endsWith("212"));
  const image = (asset, className) => {
    const element = document.createElement("img");
    element.src = localSource(asset.src);
    element.alt = asset.alt;
    element.width = asset.width;
    element.height = asset.height;
    element.decoding = "async";
    element.className = className;
    return element;
  };
  // An original logo is rendered as its supplied image, without redrawing,
  // filters, masking, color changes, cropping, or replacement artwork.
  if (logoReady) {
    document.querySelectorAll("[data-original-logo]").forEach(mount => {
      mount.replaceChildren(image(identity.originalLogo, "pinkys-original-logo"));
      mount.hidden = false;
    });
  }
  const localPreview = /^(localhost|127\.0\.0\.1|\[::1\])$/.test(location.hostname) || location.protocol === "file:";
  const preview = localPreview && new URLSearchParams(location.search).get("hotline-preview") === "1";
  // Both the authentic portrait and the explicitly public number are required
  // before the normal floating hotline is shown.
  if (!preview && !(portraitReady && telephoneReady)) return;
  const mount = document.querySelector("#hotline-root");
  if (!mount || typeof HTMLDialogElement === "undefined" || typeof HTMLDialogElement.prototype.showModal !== "function") return;
  const node = (tag, value, className) => {
    const element = document.createElement(tag);
    if (value) element.textContent = value;
    if (className) element.className = className;
    return element;
  };
  const launcher = node("button", "", "chef-launcher");
  launcher.id = "chef-launcher";
  launcher.type = "button";
  launcher.setAttribute("aria-haspopup", "dialog");
  launcher.setAttribute("aria-controls", "chef-dialog");
  if (!preview) launcher.append(image(identity.chefPortrait, "chef-launcher-portrait"));
  launcher.append(node("span", preview ? "Big Chef Dog · preview" : "Big Chef Dog Hotline"));
  const dialog = node("dialog", "", "chef-dialog");
  dialog.id = "chef-dialog";
  dialog.setAttribute("aria-labelledby", "chef-title");
  dialog.setAttribute("aria-describedby", "chef-greeting");
  const inner = node("div", "", "chef-inner");
  const close = node("button", "Close ×", "chef-close");
  close.type = "button";
  close.id = "chef-close";
  close.setAttribute("aria-label", "Close Big Chef Dog Hotline");
  inner.append(close, node("p", preview ? "LOCAL REVIEW / HOTLINE PREVIEW" : "A SMALL DETOUR IN THE UNIVERSE", "chef-kicker"));
  if (portraitReady) inner.append(image(identity.chefPortrait, "chef-portrait"));
  const title = node("h2", "The Big Chef Dog.");
  title.id = "chef-title";
  const greeting = node("p", "Congratulations. You've reached the Big Chef Dog. He wasn't expecting you. But then again, he never is.", "chef-greeting");
  greeting.id = "chef-greeting";
  inner.append(title, greeting, node("p", "Leave him a message. Maybe he'll get back to you.", "chef-message"));
  if (!preview && telephoneReady) {
    const call = node("a", "Call the Big Chef Dog", "button pink chef-call");
    call.id = "chef-call";
    call.href = "tel:" + phone.e164;
    inner.append(call);
  } else {
    inner.append(node("p", "The telephone link is not available in this preview.", "chef-preview-note"));
  }
  const routes = node("nav", "", "chef-routes");
  routes.setAttribute("aria-label", "Explore with the Big Chef Dog");
  for (const [label, href] of [["Find the unexpected", "index.html#chapter-unexpected"], ["Follow the art", "index.html#gallery"]]) {
    const link = node("a", label);
    link.href = href;
    routes.append(link);
  }
  inner.append(routes);
  dialog.append(inner);
  mount.replaceChildren(launcher, dialog);
  launcher.addEventListener("click", () => {
    dialog.showModal();
    close.focus({preventScroll:true});
  });
  close.addEventListener("click", () => dialog.close());
  dialog.addEventListener("close", () => launcher.focus({preventScroll:true}));
  dialog.addEventListener("click", event => {
    if (event.target !== dialog) return;
    const bounds = dialog.getBoundingClientRect();
    if (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom) dialog.close();
  });
  dialog.addEventListener("keydown", event => {
    if (event.key !== "Tab") return;
    const controls = [...dialog.querySelectorAll("button:not([disabled]), a[href]")];
    const index = controls.indexOf(document.activeElement);
    event.preventDefault();
    controls[(index + (event.shiftKey ? -1 : 1) + controls.length) % controls.length]?.focus();
  });
})();
