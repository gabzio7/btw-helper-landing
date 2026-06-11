# Build Brief — BTW Helper Landing Page
### Handoff document for **Claude Fable 5**
> Paste this whole file into Claude Fable 5 (Claude Code, launched from the project folder). It is the single source of truth for building the marketing landing prototype. Upstream strategy and design rationale live in the two companion HTML files (`BTW-Helper-Business-Case.html`, `BTW-Helper-Design-Proposal.html`) — read them if available, but this brief is self-contained.

---

## 0. Mission

Build an **awwwards-worthy, single-page marketing landing** for BTW Helper — a Dutch VAT (BTW) filing assistant for zzp'ers / sole proprietors. It must feel **calm, premium, and confident**, with **one dramatic hero moment** powered by motion (GSAP) and a subtle 3D ambient field (Three.js).

This is a **preview prototype**, not market-ready. No real auth, no payments, no backend. All CTAs are decorative or scroll-to-anchor. A visible "preview" marker stays until launch.

**Hard requirements (non-negotiable):**
- GSAP for scroll/load motion; Three.js (or OGL if lighter) for the hero ambient field.
- Fully **responsive** — verified down to 360px.
- **Self-checked in Chrome DevTools** — see §6 for the exact protocol.
- **Trilingual**: NL (default) / EN / ES, switchable live (see §5).
- Accessible: keyboard focus visible, `prefers-reduced-motion` respected, semantic landmarks, alt text.

---

## 1. What the product is (for accurate copy)

A filing assistant. The freelancer drops a quarter's invoices in; AI classifies each into the correct Belastingdienst **rubriek**, handles reverse-charge VAT, currency conversion, and foreign invoices, then pre-fills a 7-step simulator mirroring the official form. The user **copies** values into the portal and files themselves — **no auto-submission**.

**Positioning / anti-frame (must permeate all copy):** Sell *relief*, not bookkeeping. We are **not** accounting software. Lead every headline with the **outcome** ("done / klaar / lista"), never the mechanism. The enemy is deadline-night dread and the €600 accountant — not a competitor.

**Real figures to use as proof (from the live Q1 2026 dry-run):**
- 1a omzet €220,00 / BTW €46,20
- 4a base €122,30 / BTW €25,66 (reverse charge)
- 5g result: **+€24,15 te betalen**

---

## 2. Design tokens — extend the existing app, don't reinvent

> Claude Code already has the app's design base (Tailwind v4 OKLCH tokens, glassmorphism, indigo/purple). **Reuse it.** The landing should feel continuous with the product. Pull the actual values from the app's `globals.css`; the below is the intended direction.

```
COLOR
  --void        #05050a   /* hero background — deeper than the app for drama */
  --void-2      #0c0c18
  --indigo      #5B5BF0   /* primary signal (matches app) */
  --indigo-deep #3E2BC9
  --violet      #a78bfa   /* gradient partner, accents */
  --green       #16a34a   /* RESERVED: only the "done / money back" payoff */
  --paper       #FBFAF6   /* warm off-white for calm reading sections */
  --ink         #11152A

TYPE  (load from Google Fonts or self-host)
  Display : Space Grotesk  (700/600) — headlines, the wordmark
  Body    : Inter (400/500/600)
  Mono    : JetBrains Mono — EVERY euro figure & rubriek code (the "precision" signal)

MOTION
  Easing  : power3.out for reveals, power2.inOut for the hero count-up
  Reveal   : translateY(20px)+opacity, stagger 0.08s, ScrollTrigger at 85% viewport
  Respect  : prefers-reduced-motion → disable all GSAP/Three, show final state
```

**Why these (so you don't drift):** Space Grotesk + mono-for-money is the brand's distinguishing risk — it makes numbers read like a fiscal instrument. Indigo is the single signal colour; green is *only* for the payoff. Boldness is spent in the hero; everything else stays quiet. Do not add a second accent colour or a serif.

---

## 3. Page structure (build in this order)

| # | Section | Content | Motion |
|---|---------|---------|--------|
| 1 | **Hero** | Outcome headline ("Je BTW? Klaar."), sub, primary + ghost CTA, live dashboard mock counting up to **+€24,15** | Three.js ambient particle/gradient field; GSAP timeline: headline mask-reveal → CTA fade → number count-up |
| 2 | **Pain** | The 3 bad options (accountant / bookkeeping software / spreadsheet) + the gap | Scroll-reveal cards, stagger |
| 3 | **How it works** | 4 steps: Upload → AI classifies → Review → File. Show the real reverse-charge logic as proof | ScrollTrigger pinned or stepped reveal |
| 4 | **The engine / proof** | A real classified invoice card (e.g. Vercel US → 4a, $→€, self-assessed 21%) | Hover micro-interaction |
| 5 | **Comparison** | Honest table vs accountant / MoneyBird / spreadsheet (scope, price, learning curve, AI-native) | Row reveal |
| 6 | **Pricing** | Free €0 / Pro €7mo (€69yr) / Studio €14mo (€149yr). Free files one real quarter. | Card lift on hover |
| 7 | **FAQ** | 5 objection-killers (accountant? accuracy? auto-submit? data safety? messy invoices?) | Accordion |
| 8 | **Final CTA + legal footer** | Repeat promise; legal/trust block with tax disclaimer, AVG/GDPR, "not the Belastingdienst", "preview prototype" | — |

Full copy in all 3 languages is in `BTW-Helper-Design-Proposal.html` §04 and §06–07. Mirror it into the content config (§5).

---

## 4. The hero (the one place to go all-in)

The signature element is a **live dashboard counting up to the user's result**, not a stock illustration. Sequence on load:
1. Three.js: a slow ambient field behind everything — drifting indigo→violet particles or a low-poly gradient mesh. Low opacity, never competes with text. ~60fps; pause when tab hidden.
2. GSAP timeline: headline reveals (clip-path or line-by-line mask), sub fades, CTAs rise, then the dashboard number animates `0 → +€24,15` (mono font) with the rubriek rows ticking in beneath.
3. Subtle parallax on the dashboard card on scroll.

Keep Three.js **lightweight**: cap pixel ratio at 2, dispose on unmount, prefer a shader-driven gradient or instanced points over heavy geometry. If FPS drops below ~50 on a mid laptop in DevTools, simplify — the calm feeling matters more than the effect.

---

## 5. Trilingual (NL / EN / ES)

**Architecture:** ALL visible copy lives in one structured object. This keeps the three languages in one place and lets you (or Claude Code) edit copy without touching markup — it's the mechanism that makes the live language switch clean, not an agent feature.

```js
// content.js  — single source of truth for copy
const CONTENT = {
  nl: { hero: { h: "Je BTW-aangifte? Klaar.", sub: "...", ctaPrimary: "Probeer één kwartaal gratis", ... }, pain:{...}, ... },
  en: { hero: { h: "Your VAT return? Done.", ... }, ... },
  es: { hero: { h: "¿Tu declaración de IVA? Lista.", ... }, ... }
};
```

- Default language **NL**. Detect `navigator.language` for first visit, then a header toggle (🇳🇱 / 🇬🇧 / 🇪🇸) swaps live via JS, no reload.
- Persist choice in memory only (no localStorage — not supported in this preview env; use a JS variable / URL hash like `#en`).
- Set `<html lang>` dynamically and update `<title>`/meta on switch.
- **Keep fiscal nouns untranslated** in every language: `aangifte`, `Belastingdienst`, `BTW`, `rubriek`, `verleggingsregeling`. Localise the feeling, not the form vocabulary.
- Use the exact copy from the Design Proposal §04. Spanish and English keep "aangifte" and "Belastingdienst" as anchors.

---

## 6. Chrome DevTools self-check protocol (required before "done")

Run the page and verify with DevTools (use the MCP/automation available to you). Check and report:

1. **Console:** zero errors, zero warnings (especially Three.js context / GSAP target-not-found).
2. **Responsive:** device toolbar at 360 / 390 / 768 / 1024 / 1440px — no horizontal scroll, no overlap, hero readable, dashboard mock legible, nav toggle reachable.
3. **Performance:** hero animation holds ~60fps; record a trace, confirm no long-task jank on load. Throttle to mid-tier CPU and confirm it degrades gracefully.
4. **Animation:** GSAP timeline fires in order; ScrollTrigger reveals each section once; `prefers-reduced-motion: reduce` (emulate in DevTools rendering tab) disables motion and shows final state.
5. **Accessibility:** run Lighthouse a11y — target 95+. Visible focus rings; tab order logical; the language toggle is keyboard-operable; images have alt text.
6. **Lighthouse:** report Performance / Accessibility / Best Practices / SEO scores. For SEO basics, ensure semantic HTML5 landmarks (`<header> <main> <section> <footer>`, one `<h1>`), a meta description, OpenGraph tags, and image alt text.
7. **Three.js cleanup:** confirm the render loop pauses on `visibilitychange` (hidden tab) and there's no memory growth on repeated resize.

Report a short pass/fail table for the above. Fix anything red before shipping. Take a screenshot at desktop and mobile widths.

---

## 7. Tech & file layout

```
landing/
  index.html        # semantic markup, meta/OG tags, mounts
  content.js        # CONTENT (3 langs) + PRICING + FAQ data  ← edit copy/pricing here
  styles.css        # tokens + layout (or Tailwind if reusing app config)
  hero.js           # Three.js ambient field + GSAP hero timeline
  main.js           # language switch, ScrollTrigger reveals, FAQ accordion
  README.md         # file map + how to edit copy/pricing/colour/language
```

- Stack-agnostic: plain HTML/CSS/JS is fine for a preview, OR a single Next.js route if you prefer to reuse the app's Tailwind tokens directly. Pick one and say why.
- GSAP + ScrollTrigger via CDN or npm; Three.js (or OGL) via CDN or npm.
- No backend, no real form submission. CTAs scroll to `#pricing` or are inert with a tooltip "Preview — not yet live."
- Do **not** use localStorage/sessionStorage (unsupported in this preview env).

---

## 8. Constraints & guardrails

- **Preview prototype.** A small persistent marker ("Preview · not yet live") must be visible (e.g. corner badge or in footer). Keep until real launch.
- **Copy-not-submit** is part of the brand — never imply auto-filing to the Belastingdienst.
- **Not affiliated** with the Belastingdienst — the footer says so; don't use their logo or imply endorsement.
- Use the recommended name **Klaar** with "BTW Helper" as the descriptor, but keep the brand name in ONE place in `content.js` so it can be swapped (to "Kwartaal" or "BTW Helper") in seconds.
- No real KVK/BTW numbers hard-coded in markup — pull from config, placeholder `[number]` for now.

---

## 9. Ship footer

This is a standalone prototype repo/folder (not the BTW Helper app's calc path), so the trivial-change rule applies:

```
git add . && git commit -m "feat(landing): <description>" && git push
```

If this later merges into the main app and touches anything shared (tokens, routes, build config), escalate to the full PR + test flow per the app's ship rules. For the standalone landing prototype, direct commits are fine — but always run the §6 DevTools check before committing a "done" state.

---

## 10. Definition of done

- [ ] All 8 sections built, content from config, in NL/EN/ES with working live toggle.
- [ ] Hero: Three.js ambient field + GSAP load timeline + count-up to +€24,15, ~60fps.
- [ ] Responsive 360 → 1440px, no horizontal scroll at any width.
- [ ] `prefers-reduced-motion` fully respected.
- [ ] Semantic landmarks, meta description + OG tags, alt text, README present.
- [ ] DevTools §6 protocol run; pass/fail table + Lighthouse scores reported; desktop + mobile screenshots.
- [ ] Console clean. Accessibility 95+.
- [ ] "Preview · not yet live" marker present. No auto-submit implications. Not-affiliated note in footer.
- [ ] Brand name editable from one place in config.

---

*Companion files: `BTW-Helper-Business-Case.html` (market/funding) and `BTW-Helper-Design-Proposal.html` (full copy, naming rationale, legal footer). This brief + those two = the complete handoff.*
