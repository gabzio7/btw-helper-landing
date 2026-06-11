/* =========================================================================
   main.js — language switch (NL/EN/ES), content rendering from content.js,
   scroll effects (ScrollTrigger), GSAP accordion, magnetic CTAs.
   No localStorage/sessionStorage: language lives in a JS variable + URL hash.
   ========================================================================= */

gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const finePointer = window.matchMedia("(pointer: fine)").matches;

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
  bindPricingHover();
}

function renderFaq(c) {
  document.getElementById("faq-list").innerHTML = c.faq.items
    .map((item) =>
      `<details>
         <summary>${t(item.q)}</summary>
         <div class="faq-body"><p class="faq-a">${t(item.a)}</p></div>
       </details>`)
    .join("");
  bindFaq();
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

function renderAll(c) {
  applyI18n(c);
  renderHeroMock(c);
  renderPain(c);
  renderHow(c);
  renderProof(c);
  renderCompare(c);
  renderPricing(c);
  renderFaq(c);
  renderFooter(c);
  refreshMagnetic();
}

/* ------------------------------------------------------------- setLang */
function setLang(lang, { initial = false } = {}) {
  currentLang = lang;
  const c = CONTENT[lang];

  const apply = () => {
    document.documentElement.lang = lang;
    document.title = t(c.meta.title);
    document.querySelector('meta[name="description"]').setAttribute("content", t(c.meta.description));
    renderAll(c);
    document.querySelectorAll(".lang-switch button").forEach((b) =>
      b.setAttribute("aria-pressed", String(b.dataset.lang === lang)));
    if (!initial) {
      history.replaceState(null, "", "#" + lang); // URL only — no storage
      buildScrollFX(); // re-attach triggers to the re-rendered nodes
    }
  };

  if (initial || reducedMotion) {
    apply();
    return;
  }
  // the active language fades/slides in, the old one fades out
  gsap.timeline()
    .to(["#main", ".site-footer"], { opacity: 0, y: 10, duration: 0.18, ease: "power2.in", onComplete: apply })
    .to(["#main", ".site-footer"], { opacity: 1, y: 0, duration: 0.35, ease: "power3.out", clearProps: "transform" });
}

/* --------------------------------------------------------- scroll FX */
let fxCtx = null;
function buildScrollFX() {
  if (reducedMotion) return; // final state is the default state

  if (fxCtx) fxCtx.revert();
  fxCtx = gsap.context(() => {

    // generic single-element reveals
    document.querySelectorAll("[data-reveal]").forEach((el) => {
      gsap.from(el, {
        y: 20, opacity: 0, duration: 0.7, ease: "power3.out",
        scrollTrigger: { trigger: el, start: "top 85%", once: true },
      });
    });

    // pain cards: staggered perspective slide-in
    gsap.from("#pain-cards .card", {
      opacity: 0, y: 34, rotationY: 18, x: -36,
      transformOrigin: "left center", transformPerspective: 900,
      duration: 0.85, ease: "power3.out", stagger: 0.12,
      scrollTrigger: { trigger: "#pain-cards", start: "top 82%", once: true },
    });

    // how it works: pinned, steps revealed by scrub, connecting line draws
    const mm = gsap.matchMedia();
    mm.add("(min-width: 921px)", () => {
      const steps = gsap.utils.toArray("#how-steps li");
      const tl = gsap.timeline({
        scrollTrigger: { trigger: "#how", start: "top 72px", end: "+=1400", pin: true, scrub: 0.6 },
      });
      tl.fromTo(".steps-line i", { scaleX: 0 }, { scaleX: 1, duration: 4, ease: "none" }, 0);
      steps.forEach((s, i) => {
        tl.from(s, { y: 70, opacity: 0, duration: 0.9, ease: "power2.out" }, i * 0.95);
      });
      tl.to({}, { duration: 0.4 }); // breathing room after the last step
    });
    mm.add("(max-width: 920px)", () => {
      gsap.from("#how-steps li", {
        y: 24, opacity: 0, duration: 0.7, ease: "power3.out", stagger: 0.12,
        scrollTrigger: { trigger: "#how-steps", start: "top 85%", once: true },
      });
    });

    // comparison rows: one at a time, with a highlight sweep across each
    gsap.utils.toArray("#compare-table tbody tr").forEach((row, i) => {
      const st = { trigger: "#compare-table", start: "top 80%", once: true };
      gsap.from(row, { opacity: 0, x: -26, duration: 0.55, ease: "power3.out", delay: i * 0.14, scrollTrigger: st });
      gsap.fromTo(row,
        { backgroundPosition: "-150% 0" },
        { backgroundPosition: "250% 0", duration: 1.0, ease: "power2.out", delay: 0.1 + i * 0.14, scrollTrigger: st });
    });

    // pricing cards + FAQ items: staggered rise
    [["#pricing-cards", ".price-card"], ["#faq-list", "details"]].forEach(([wrap, sel]) => {
      const items = document.querySelectorAll(`${wrap} ${sel}`);
      if (!items.length) return;
      gsap.from(items, {
        y: 20, opacity: 0, duration: 0.7, ease: "power3.out", stagger: 0.08,
        scrollTrigger: { trigger: wrap, start: "top 85%", once: true },
      });
    });
  });

  ScrollTrigger.refresh();
}

/* ----------------------------------------------------- FAQ accordion */
function bindFaq() {
  const all = document.querySelectorAll("#faq-list details");

  if (reducedMotion) {
    // native open/close, just keep one-at-a-time behaviour
    all.forEach((d) => d.addEventListener("toggle", () => {
      if (d.open) all.forEach((o) => { if (o !== d) o.open = false; });
    }));
    return;
  }

  const close = (d) => {
    const body = d.querySelector(".faq-body");
    gsap.to(body, {
      height: 0, opacity: 0, duration: 0.28, ease: "power2.in",
      onComplete: () => { d.open = false; gsap.set(body, { clearProps: "all" }); },
    });
  };

  all.forEach((d) => {
    d.querySelector("summary").addEventListener("click", (e) => {
      e.preventDefault();
      if (d.open) { close(d); return; }
      all.forEach((o) => { if (o !== d && o.open) close(o); });
      d.open = true;
      const body = d.querySelector(".faq-body");
      gsap.fromTo(body,
        { height: 0, opacity: 0 },
        { height: "auto", opacity: 1, duration: 0.45, ease: "power3.out",
          onComplete: () => gsap.set(body, { clearProps: "height" }) });
    });
  });
}

/* ------------------------------------------------ pricing hover glow */
function bindPricingHover() {
  if (reducedMotion || !finePointer) return;
  document.querySelectorAll(".price-card").forEach((card) => {
    card.addEventListener("mouseenter", () => {
      gsap.to(card, {
        y: -8,
        boxShadow: "0 0 0 1.5px rgba(91,91,240,.9), 0 26px 60px -22px rgba(91,91,240,.55)",
        duration: 0.35, ease: "power3.out",
      });
    });
    card.addEventListener("mouseleave", () => {
      gsap.to(card, { y: 0, duration: 0.45, ease: "power3.out", clearProps: "boxShadow,transform" });
    });
  });
}

/* ------------------------------------------------------ magnetic CTAs */
let magnets = [];
function refreshMagnetic() {
  if (reducedMotion || !finePointer) return;
  magnets = [...document.querySelectorAll(".btn-primary")].map((el) => ({
    el,
    xTo: gsap.quickTo(el, "x", { duration: 0.4, ease: "power3" }),
    yTo: gsap.quickTo(el, "y", { duration: 0.4, ease: "power3" }),
  }));
}
function initMagnetic() {
  if (reducedMotion || !finePointer) return;
  let mx = 0, my = 0, raf = null;
  const update = () => {
    raf = null;
    magnets.forEach((m) => {
      const r = m.el.getBoundingClientRect();
      if (!r.width) return;
      const dx = mx - (r.left + r.width / 2);
      const dy = my - (r.top + r.height / 2);
      const dist = Math.hypot(dx, dy);
      const range = Math.max(r.width, r.height) / 2 + 60; // 60px attraction radius
      if (dist < range) {
        const pull = (1 - dist / range) * 0.45;
        m.xTo(dx * pull); m.yTo(dy * pull);
      } else {
        m.xTo(0); m.yTo(0);
      }
    });
  };
  window.addEventListener("mousemove", (e) => {
    mx = e.clientX; my = e.clientY;
    if (!raf) raf = requestAnimationFrame(update);
  }, { passive: true });
}

/* ------------------------------------------------------ smooth scroll */
function initSmoothScroll() {
  document.addEventListener("click", (e) => {
    const a = e.target.closest('a[href^="#"]');
    if (!a) return;
    const id = a.getAttribute("href");
    if (id.length < 2) return;
    const target = document.querySelector(id);
    if (!target) return;
    e.preventDefault();
    if (reducedMotion) { target.scrollIntoView(); return; }
    gsap.to(window, { scrollTo: { y: target, offsetY: 70 }, duration: 0.9, ease: "power3.inOut" });
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
  b.addEventListener("click", () => {
    if (b.dataset.lang === currentLang) {
      // already active (e.g. auto-detected): just persist it in the URL
      history.replaceState(null, "", "#" + currentLang);
      return;
    }
    setLang(b.dataset.lang);
  }));

window.addEventListener("hashchange", () => {
  const hash = location.hash.replace("#", "");
  if (LANGS.includes(hash) && hash !== currentLang) setLang(hash);
});

renderBrand();
setLang(detectLang(), { initial: true });
buildScrollFX();
initMagnetic();
initSmoothScroll();
