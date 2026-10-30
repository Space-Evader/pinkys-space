/* Progressive filtering of the complete static archive. No API, tracking or checkout. */
(() => {
  "use strict";
  const records = [...document.querySelectorAll("[data-fashion-record]")];
  const filters = [...document.querySelectorAll("[data-fashion-filter]")];
  const search = document.querySelector("#fashion-search");
  const results = document.querySelector("#fashion-results");
  const empty = document.querySelector("#fashion-empty");
  if (!records.length || !search || !results || !empty) return;
  let category = "all";
  function apply() {
    const term = search.value.trim().toLocaleLowerCase();
    let count = 0;
    for (const record of records) {
      const matches = (category === "all" || record.dataset.category === category) &&
        (!term || record.dataset.search.toLocaleLowerCase().includes(term));
      record.hidden = !matches;
      if (matches) count++;
    }
    results.textContent = count + " of " + records.length + " archive entries";
    empty.hidden = count !== 0;
    for (const button of filters) button.setAttribute("aria-pressed", String(button.dataset.fashionFilter === category));
  }
  filters.forEach(button => button.addEventListener("click", () => {
    category = button.dataset.fashionFilter;
    apply();
  }));
  search.addEventListener("input", apply);
  document.querySelector("#fashion-clear")?.addEventListener("click", () => {
    category = "all";
    search.value = "";
    apply();
    search.focus();
  });
  document.querySelector(".fashion-tools").hidden = false;
  apply();
})();
