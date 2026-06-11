/* =========================================================================
   main.js — language switch (NL/EN/ES), content rendering from content.js,
   ScrollTrigger reveals, FAQ accordion, inert-CTA tooltip.
   No localStorage/sessionStorage: language lives in a JS variable + URL hash.
   ========================================================================= */

gsap.registerPlugin(ScrollTrigger);

const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/* ----------------------------------------------------------- language */
const LANGS = ["nl", "en", "es"];
let currentLang = "nl"; // in-memory only

function detectLang() {
  const hash = location.hash.replace("#", "");
  if (LANGS.includes(hash)) return hash;
  const nav = (navigator.language || "nl").slice(0, 2).toLowerCase();
  return LANGS.includes(nav) ? nav : "nl";
}

/* replace {brand} etc. in any copy string */
function t(str) {
  return str
    .replaceAll("{brand}", BRAND.name)
    .replaceAll("{descriptor}", BRAND.descriptor)
    .replaceAll("{studio}", BRAND.studio)
    .replaceAll("{city}", BRAND.city)
    .replaceAll("{kvk}", BRAND.kvk)
    .replaceAll("{btw}", BRAND.btw)
    .replaceAll("{year}", BRAND.year);
}

function get(obj, path) {
  return path.split(".").reduce((o, k) => (o ? o[k] : undefined), obj);
}

/* ------------------------------------------------------------ renderers */
function applyI18n(c) {
  document.querySelectorAll("[data-i18n]").forEach((el) => {
    const val = get(c, el.dataset.i18n);
    if (typeof val === "string") el.textContent = t(val);
  });
}

function renderHeroMock(c) {
  const rows = document.getElementById("mock-rows");
  rows.innerHTML = c.hero.mockRows
    .map(([k, v]) => `<div class="mock-row mono"><span>${k}</span><span>${v}</span></div>`)
    .join("");
}

function renderPain(c) {
  document.getElementById("pain-cards").innerHTML = c.pain.cards
    .map((card, i) =>
      `<article class="card">
        <span class="card-num" aria-hidden="true">0${i + 1}</span>
        <h3>${t(card.t)}</h3><p>${t(card.d)}</p>
      </article>`)
    .join("");
}

function renderHow(c) {
  document.getElementById("how-steps").innerHTML = c.how.steps
    .map((s) => `<li><h3>${t(s.t)}</h3><p>${t(s.d)}</p></li>`)
    .join("");
}

function renderProof(c) {
  const inv = c.proof.invoice;
  document.getElementById("invoice-card").innerHTML =
    `<div class="invoice-head">
       <span class="invoice-vendor disp">${inv.vendor}</span>
       <span class="invoice-flag">${t(inv.flag)}</span>
     </div>
     <p class="invoice-origin">${t(inv.origin)}</p>
     ${inv.rows.map(([k, v]) => `<div class="invoice-row"><span>${k}</span><span>${v}</span></div>`).join("")}`;
  document.getElementById("invoice-explain").textContent = t(inv.explain);
}

function renderCompare(c) {
  const head = c.compare.cols
    .map((col, i) => `<th scope="col"${i === 1 ? ' class="us"' : ""}>${t(col)}</th>`)
    .join("");
  const body = c.compare.rows
    .map((row) =>
      `<tr><th scope="row">${t(row[0])}</th>${row.slice(1)
        .map((cell, i) => `<td${i === 0 ? ' class="us"' : ""}>${t(cell)}</td>`)
        .join("")}</tr>`)
    .join("");
  document.getElementById("compare-table").innerHTML =
    `<thead><tr>${head}</tr></thead><tbody>${body}</tbody>`;
}

function renderPricing(c) {
  const p = c.pricing;
  document.getElementById("pricing-cards").innerHTML = PRICING.tiers
    .map((tier) => {
      const copy = p.tiers[tier.id];
      const amount = tier.monthly === 0
        ? `€0`
        : `€${tier.monthly}<span class="per">${p.perMonth}</span>`;
      const year = tier.yearly > 0
        ? `${p.perYearPrefix} €${tier.yearly} ${p.perYearSuffix}`
        : "&nbsp;";
      return `<article class="price-card${tier.highlight ? " highlight" : ""}">
        ${tier.highlight ? `<span class="price-pop mono">${p.popular}</span>` : ""}
        <h3 class="price-name">${copy.name}</h3>
        <p class="price-tagline">${t(copy.tagline)}</p>
        <p class="price-amount mono">${amount}</p>
        <p class="price-year">${year}</p>
        <ul class="price-features">${copy.features.map((f) => `<li>${t(f)}</li>`).join("")}</ul>
        <button type="button" class="btn btn-primary inert-cta">${copy.cta}</button>
      </article>`;
    })
    .join("");
  bindInertCtas();
}

function renderFaq(c) {
  document.getElementById("faq-list").innerHTML = c.faq.items
    .map((item) =>
      `<details>
         <summary>${t(item.q)}</summary>
         <p class="faq-a">${t(item.a)}</p>
       </details>`)
    .join("");
  // accordion: opening one closes the others
  const all = document.querySelectorAll("#faq-list details");
  all.forEach((d) => {
    d.addEventListener("toggle", () => {
      if (d.open) all.forEach((o) => { if (o !== d) o.open = false; });
    });
  });
}

function renderFooter(c) {
  const f = c.footer;
  document.getElementById("footer-tagline").textContent = t(f.tagline);
  document.getElementById("footer-cols").innerHTML = f.cols
    .map((col) =>
      `<div><h3>${col.h}</h3><ul>${col.items.map((i) => `<li>${t(i)}</li>`).join("")}</ul></div>`)
    .join("");
  document.getElementById("footer-tax-title").textContent = f.taxTitle;
  document.getElementById("footer-tax").textContent = t(f.tax);
  document.getElementById("footer-data-title").textContent = f.dataTitle;
  document.getElementById("footer-data").textContent = t(f.data);
  document.getElementById("footer-fine-line").textContent = t(f.fine);
}

function renderBrand() {
  document.getElementById("brand-word").textContent = BRAND.name;
  document.getElementById("brand-descriptor").textContent = BRAND.descriptor;
}

/* ------------------------------------------------------------- setLang */
function setLang(lang, { initial = false } = {}) {
  currentLang = lang;
  const c = CONTENT[lang];

  document.documentElement.lang = lang;
  document.title = t(c.meta.title);
  document.querySelector('meta[name="description"]').setAttribute("content", t(c.meta.description));

  applyI18n(c);
  renderHeroMock(c);
  renderPain(c);
  renderHow(c);
  renderProof(c);
  renderCompare(c);
  renderPricing(c);
  renderFaq(c);
  renderFooter(c);

  document.querySelectorAll(".lang-switch button").forEach((b) =>
    b.setAttribute("aria-pressed", String(b.dataset.lang === lang)));

  // persist in the URL only (no storage), without scrolling the page
  if (!initial) history.replaceState(null, "", "#" + lang);

  if (!initial) buildReveals(); // re-attach reveals to the re-rendered nodes
}

/* ------------------------------------------------------------- reveals */
let revealCtx = null;
function buildReveals() {
  if (reducedMotion) return; // final state is the default state
  if (revealCtx) revealCtx.revert();
  revealCtx = gsap.context(() => {
    // single elements
    document.querySelectorAll("[data-reveal]").forEach((el) => {
      gsap.from(el, {
        y: 20, opacity: 0, duration: 0.7, ease: "power3.out",
        scrollTrigger: { trigger: el, start: "top 85%", once: true },
      });
    });
    // staggered groups (rendered lists)
    [
      ["#pain-cards", ".card"],
      ["#how-steps", "li"],
      ["#pricing-cards", ".price-card"],
      ["#faq-list", "details"],
      ["#compare-table", "tbody tr"],
    ].forEach(([wrap, sel]) => {
      const items = document.querySelectorAll(`${wrap} ${sel}`);
      if (!items.length) return;
      gsap.from(items, {
        y: 20, opacity: 0, duration: 0.7, ease: "power3.out", stagger: 0.08,
        scrollTrigger: { trigger: wrap, start: "top 85%", once: true },
      });
    });
  });
}

/* -------------------------------------------------- inert CTA tooltip */
let toastTimer = null;
function bindInertCtas() {
  document.querySelectorAll(".inert-cta").forEach((btn) => {
    btn.addEventListener("click", () => {
      let toast = document.getElementById("toast");
      if (!toast) {
        toast = document.createElement("div");
        toast.id = "toast";
        toast.className = "toast mono";
        toast.setAttribute("role", "status");
        document.body.appendChild(toast);
      }
      toast.textContent = CONTENT[currentLang].previewTooltip;
      toast.classList.add("show");
      clearTimeout(toastTimer);
      toastTimer = setTimeout(() => toast.classList.remove("show"), 1800);
    });
  });
}

/* ---------------------------------------------------------------- init */
document.querySelectorAll(".lang-switch button").forEach((b) =>
  b.addEventListener("click", () => setLang(b.dataset.lang)));

window.addEventListener("hashchange", () => {
  const hash = location.hash.replace("#", "");
  if (LANGS.includes(hash) && hash !== currentLang) setLang(hash);
});

setLang(detectLang(), { initial: true });
buildReveals();
