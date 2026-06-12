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
    .replaceAll("{agent}", BRAND.agent)
    .replaceAll("{domain}", BRAND.domain)
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
      `<article class="pain-card glass">
        <span class="card-num mono" aria-hidden="true">0${i + 1}</span>
        <h3>${t(card.t)}</h3><p>${t(card.d)}</p>
      </article>`)
    .join("");
}

function renderStats(c) {
  document.getElementById("stats-cards").innerHTML = c.stats.items
    .map((s) =>
      `<article class="stat-card glass${s.green ? " stat-green" : ""}">
        <p class="stat-num mono" data-num="${s.num}" data-prefix="${s.prefix || ""}" data-suffix="${s.suffix || ""}">${s.prefix || ""}${s.num}${s.suffix || ""}</p>
        <p class="stat-sub">${t(s.sub)}</p>
        <p class="stat-foot mono">${t(s.foot)}</p>
      </article>`)
    .join("");
}

function renderAudience(c) {
  document.getElementById("aud-cards").innerHTML = c.audience.cards
    .map((card) => `<article class="aud-card glass"><p>${t(card.d)}</p></article>`)
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
      // free tier shows a copy paragraph instead of a feature wall
      const body = copy.features
        ? `<ul class="price-features">${copy.features.map((f) => `<li>${t(f)}</li>`).join("")}</ul>`
        : `<p class="price-copy">${t(copy.copy)}</p>`;
      return `<article class="price-card${tier.highlight ? " highlight" : ""}">
        ${tier.highlight ? `<span class="price-pop mono">${p.popular}</span>` : ""}
        <h3 class="price-name">${copy.name}</h3>
        <p class="price-tagline">${t(copy.tagline)}</p>
        <p class="price-amount mono">${amount}</p>
        <p class="price-year">${year}</p>
        ${body}
        <button type="button" class="btn btn-primary inert-cta">${copy.cta}</button>
      </article>`;
    })
    .join("");
  document.getElementById("pricing-nudge").innerHTML =
    `<p class="nudge-label mono">${t(p.nudgeLabel)}</p>
     <blockquote class="nudge-quote mono">${t(p.nudgeQuote)}</blockquote>`;
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
  const soon = t(f.soon);
  document.getElementById("footer-tagline").textContent = t(f.tagline);
  document.getElementById("footer-madeby").textContent = t(f.madeBy);
  document.getElementById("soon-chip-gh").textContent = soon;
  document.getElementById("footer-links-h").textContent = f.linksH;
  document.getElementById("footer-legal-h").textContent = f.legalH;
  document.getElementById("footer-links").innerHTML =
    [["#how", c.nav.how], ["#proof", c.nav.proof], ["#pricing", c.nav.pricing], ["#faq", c.nav.faq]]
      .map(([href, label]) => `<li><a href="${href}">${t(label)}</a></li>`)
      .join("") +
    `<li><a href="mailto:${t(f.contact)}">${t(f.contact)}</a></li>`;
  document.getElementById("footer-legal").innerHTML = f.legal
    .map((label) =>
      `<li><a href="#" data-soon aria-label="${label} — ${soon}">${label}<span class="soon-chip mono" aria-hidden="true">${soon}</span></a></li>`)
    .join("");
  document.getElementById("footer-tax-title").textContent = f.taxTitle;
  document.getElementById("footer-tax").textContent = t(f.tax);
  document.getElementById("footer-data-title").textContent = f.dataTitle;
  document.getElementById("footer-data").textContent = t(f.data);
  document.getElementById("footer-bar-left").textContent = t(f.barLeft);
  document.getElementById("footer-bar-right").textContent = t(f.barRight);
}

function renderBrand() {
  document.getElementById("brand-word").textContent = BRAND.name;
  document.getElementById("brand-descriptor").textContent = BRAND.descriptor;
  document.getElementById("footer-brand-word").textContent = BRAND.name;
}

function renderAll(c) {
  applyI18n(c);
  renderHeroMock(c);
  renderPain(c);
  renderStats(c);
  renderHow(c);
  renderProof(c);
  renderAudience(c);
  renderCompare(c);
  renderPricing(c);
  renderFaq(c);
  renderFooter(c);
  refreshMagnetic();
  bindCardTilt(); // re-rendered cards need fresh tilt bindings
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

    // how it works: pinned, steps revealed by scrub, connecting line draws.
    // IMPORTANT: the pin must be created FIRST — triggers created after a pin
    // get the pin distance added to their positions; triggers created before
    // it keep stale, uncompensated positions (even after refresh).
    const mm = gsap.matchMedia();
    mm.add("(min-width: 1025px)", () => {
      // horizontal scroll: section pins, steps travel right-to-left while
      // the connecting line draws — user scrolls down, steps reveal left-to-right
      const row = document.getElementById("how-steps");
      const wrap = document.querySelector(".steps-wrap");
      const dist = () => Math.max(0, row.scrollWidth - wrap.clientWidth);
      const tl = gsap.timeline({
        scrollTrigger: { trigger: "#how", start: "top 72px", end: "+=1400", pin: true, scrub: 0.6, invalidateOnRefresh: true },
      });
      tl.fromTo(".steps-line i", { scaleX: 0 }, { scaleX: 1, duration: 4, ease: "none" }, 0)
        .to(row, { x: () => -dist(), duration: 4, ease: "none" }, 0)
        .from("#how-steps li", { opacity: 0.2, duration: 1.2, ease: "none", stagger: 0.9 }, 0)
        .to({}, { duration: 0.4 }); // breathing room after the last step
    });
    mm.add("(max-width: 1024px)", () => {
      gsap.from("#how-steps li", {
        y: 24, opacity: 0, duration: 0.7, ease: "power3.out", stagger: 0.12,
        scrollTrigger: { trigger: "#how-steps", start: "top 85%", once: true },
      });
    });

    // generic single-element reveals
    document.querySelectorAll("[data-reveal]").forEach((el) => {
      gsap.from(el, {
        y: 20, opacity: 0, duration: 0.7, ease: "power3.out",
        scrollTrigger: { trigger: el, start: "top 85%", once: true },
      });
    });

    // pain cards: staggered perspective slide-in
    gsap.from("#pain-cards .pain-card", {
      opacity: 0, y: 34, rotationY: 18, x: -36,
      transformOrigin: "left center", transformPerspective: 900,
      duration: 0.85, ease: "power3.out", stagger: 0.12,
      scrollTrigger: { trigger: "#pain-cards", start: "top 82%", once: true },
    });

    // audience cards: same 3D family, alternating tilt direction
    // (x offsets stay within the 24px container padding — no page overflow)
    gsap.utils.toArray("#aud-cards .aud-card").forEach((card, i) => {
      gsap.from(card, {
        opacity: 0, y: 34, rotationY: i % 2 ? -14 : 14, x: i % 2 ? 20 : -20,
        transformOrigin: i % 2 ? "right center" : "left center", transformPerspective: 900,
        duration: 0.85, ease: "power3.out", delay: (i % 2) * 0.1,
        scrollTrigger: { trigger: "#aud-cards", start: "top 82%", once: true },
      });
    });

    // stat numbers: count up on scroll entry
    gsap.utils.toArray(".stat-num").forEach((el) => {
      const target = parseFloat(el.dataset.num);
      const prefix = el.dataset.prefix || "";
      const suffix = el.dataset.suffix || "";
      const obj = { v: 0 };
      const st = { trigger: el.closest(".stat-card"), start: "top 85%", once: true };
      gsap.from(el.closest(".stat-card"), { opacity: 0, y: 24, duration: 0.6, ease: "power3.out", scrollTrigger: st });
      gsap.to(obj, {
        v: target, duration: 1.3, ease: "power2.out", scrollTrigger: st,
        onUpdate: () => { el.textContent = prefix + Math.round(obj.v) + suffix; },
        onComplete: () => { el.textContent = prefix + el.dataset.num + suffix; },
      });
    });

    // simulator demo: a value gets "copied" from the BTWklaar window
    // into the Belastingdienst window, on loop while in view
    const chip = document.querySelector(".sim-chip");
    if (chip) {
      gsap.timeline({
        repeat: -1, repeatDelay: 1.6,
        scrollTrigger: { trigger: ".sim-demo", start: "top 85%", toggleActions: "play pause resume pause" },
      })
        .set(".sim-target", { opacity: 0.25 })
        .fromTo(chip, { x: -34, opacity: 0 }, { x: -34, opacity: 1, duration: 0.3, ease: "power2.out" })
        .to(chip, { x: 34, duration: 0.8, ease: "power2.inOut" })
        .to(".sim-target", { opacity: 1, duration: 0.35, ease: "power2.out" }, "-=0.2")
        .to(chip, { opacity: 0, duration: 0.3 }, "-=0.2")
        .to({}, { duration: 0.4 });
    }

    // comparison rows: one at a time, with a highlight sweep across each
    gsap.utils.toArray("#compare-table tbody tr").forEach((row, i) => {
      const st = { trigger: "#compare-table", start: "top 80%", once: true };
      gsap.from(row, { opacity: 0, x: -26, duration: 0.55, ease: "power3.out", delay: i * 0.14, scrollTrigger: st });
      gsap.fromTo(row,
        { backgroundPosition: "-150% 0" },
        { backgroundPosition: "250% 0", duration: 1.0, ease: "power2.out", delay: 0.1 + i * 0.14, scrollTrigger: st });
    });

    // app screenshots: gentle parallax as they cross the viewport
    gsap.utils.toArray(".app-shot").forEach((img) => {
      gsap.fromTo(img, { y: 36 }, {
        y: -36, ease: "none",
        scrollTrigger: { trigger: img, start: "top bottom", end: "bottom top", scrub: 0.5 },
      });
    });

    // background hue shift across the whole page: 0° → +8° at half — back to 0°.
    // Drives a fixed body::before overlay (mix-blend-mode: color). Felt, not seen.
    const hue = { v: 0 };
    gsap.timeline({
      scrollTrigger: { trigger: document.body, start: "top top", end: "bottom bottom", scrub: 0.5 },
    })
      .to(hue, { v: 8, duration: 1, ease: "none", onUpdate: setHue }, 0)
      .to(hue, { v: 0, duration: 1, ease: "none", onUpdate: setHue }, 1);
    function setHue() {
      document.documentElement.style.setProperty("--bg-hue", hue.v.toFixed(2) + "deg");
    }

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
      const range = Math.max(r.width, r.height) / 2 + 80; // 80px attraction radius
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

/* ------------------------------------------------------ smart nav */
function initSmartNav() {
  const nav = document.querySelector(".site-header");
  let lastY = 0;
  window.addEventListener("scroll", () => {
    const y = window.scrollY;
    nav.classList.toggle("scrolled", y > 40);
    if (reducedMotion) return; // keep nav always visible
    if (y > lastY && y > 80) {
      nav.style.transform = "translateY(-100%)"; // scrolling down → hide
    } else {
      nav.style.transform = "translateY(0)"; // scrolling up → show
    }
    lastY = y;
  }, { passive: true });
}

/* --------------------------------------------------- custom cursor */
function initCursor() {
  if (reducedMotion || !finePointer) return;
  document.body.classList.add("has-cursor");

  const ring = document.createElement("div");
  ring.id = "cursor-ring";
  ring.innerHTML = `<span id="cursor-label" class="mono">VIEW</span>`;
  const dot = document.createElement("div");
  dot.id = "cursor-dot";
  const cross = document.createElement("div");
  cross.id = "cursor-cross";
  cross.innerHTML = "<i></i><i></i>";
  document.body.append(ring, dot, cross);
  gsap.set([ring, dot, cross], { xPercent: -50, yPercent: -50, x: -100, y: -100 });

  const move = {
    rx: gsap.quickTo(ring, "x", { duration: 0.35, ease: "power3" }),
    ry: gsap.quickTo(ring, "y", { duration: 0.35, ease: "power3" }),
    dx: gsap.quickTo(dot, "x", { duration: 0.12, ease: "power2" }),
    dy: gsap.quickTo(dot, "y", { duration: 0.12, ease: "power2" }),
    cx: gsap.quickTo(cross, "x", { duration: 0.2, ease: "power2" }),
    cy: gsap.quickTo(cross, "y", { duration: 0.2, ease: "power2" }),
  };
  window.addEventListener("mousemove", (e) => {
    move.rx(e.clientX); move.ry(e.clientY);
    move.dx(e.clientX); move.dy(e.clientY);
    move.cx(e.clientX); move.cy(e.clientY);
  }, { passive: true });
  document.addEventListener("mouseleave", () => gsap.to([ring, dot, cross], { opacity: 0, duration: 0.2 }));
  document.addEventListener("mouseenter", () => gsap.to([ring, dot], { opacity: 1, duration: 0.2 }));

  const CARD_SEL = ".pain-card, .aud-card, .stat-card, .price-card, #hero-mock, .shot-frame";
  const setState = (s, linkEl) => {
    const label = ring.querySelector("#cursor-label");
    gsap.killTweensOf(ring, "width,height,borderRadius");
    cross.style.opacity = "0";
    dot.style.opacity = "1";
    label.style.opacity = "0";
    if (s === "card") {
      gsap.to(ring, { width: 56, height: 56, borderRadius: 100, opacity: 1, duration: 0.25 });
      label.style.opacity = "1";
    } else if (s === "cross") {
      gsap.to(ring, { opacity: 0, duration: 0.15 });
      cross.style.opacity = "1";
    } else if (s === "cta") {
      gsap.to(ring, { opacity: 0, duration: 0.15 });
      gsap.to(dot, { width: 6, height: 6, duration: 0.2 });
    } else if (s === "nav" && linkEl) {
      // the ring collapses to a 2px underline matching the link width
      gsap.to(ring, { width: linkEl.getBoundingClientRect().width, height: 2, borderRadius: 1, opacity: 1, duration: 0.25 });
    } else {
      gsap.to(ring, { width: 28, height: 28, borderRadius: 100, opacity: 1, duration: 0.25 });
      gsap.to(dot, { width: 4, height: 4, duration: 0.2 });
    }
  };
  document.addEventListener("mouseover", (e) => {
    const el = e.target;
    if (el.closest(".invoice-card")) return setState("cross");
    if (el.closest(".btn")) return setState("cta");
    if (el.closest(".site-nav a")) return setState("nav", el.closest(".site-nav a"));
    if (el.closest(CARD_SEL)) return setState("card");
    setState("default");
  }, { passive: true });
}

/* ------------------------------------------------- card hover tilt */
function bindCardTilt() {
  if (reducedMotion || !finePointer) return;
  document.querySelectorAll(".pain-card, .aud-card, .stat-card, .invoice-card, #hero-mock").forEach((card) => {
    if (card.dataset.tiltBound) return;
    card.dataset.tiltBound = "1";
    const rx = gsap.quickTo(card, "rotationX", { duration: 0.4, ease: "power3" });
    const ry = gsap.quickTo(card, "rotationY", { duration: 0.4, ease: "power3" });
    const sc = gsap.quickTo(card, "scale", { duration: 0.4, ease: "power3" });
    gsap.set(card, { transformPerspective: 800 });
    card.addEventListener("mousemove", (e) => {
      const r = card.getBoundingClientRect();
      const px = (e.clientX - r.left) / r.width - 0.5;  // -0.5 … 0.5
      const py = (e.clientY - r.top) / r.height - 0.5;
      rx(-py * 12); ry(px * 12); sc(1.025);              // ±6° both axes
      card.classList.add("is-tilting");
    }, { passive: true });
    card.addEventListener("mouseleave", () => {
      rx(0); ry(0); sc(1);
      card.classList.remove("is-tilting");
    }, { passive: true });
  });
}

/* ---------------------------------------- "coming soon" footer links */
document.addEventListener("click", (e) => {
  const soon = e.target.closest("a[data-soon]");
  if (soon) e.preventDefault();
});

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
initSmartNav();
initCursor();
