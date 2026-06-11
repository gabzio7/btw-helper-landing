# BTWklaar · Landing prototype

Awwwards-style single-page marketing landing for **BTWklaar** — a BTW filing
assistant for zzp'ers. **Klaar** is the AI companion inside BTWklaar (the agent
that classifies invoices and explains every rubriek). **Preview prototype** —
no auth, no payments, no backend; all CTAs are decorative or scroll-to-anchor.

Domain placeholder: `btwklaar.nl`.

## Run it

No build step. Serve the folder statically (modules + import maps need http):

```bash
python3 -m http.server 4173
# → http://localhost:4173
```

## File map

| File | What it is |
|---|---|
| `index.html` | Semantic shell (landmarks, meta/OG, fonts, script mounts). NL copy inline as default. |
| `content.js` | **Edit copy here.** `CONTENT` (NL/EN/ES), `PRICING`, `FIGURES`, `BRAND`. |
| `styles.css` | Design tokens + all layout. |
| `hero.js` | Three.js mouse-reactive particle field + GSAP hero timeline + count-up to `+€24,15`. |
| `main.js` | Language switch, content rendering, scroll effects, GSAP accordion, magnetic CTAs. |

Dependencies (CDN, no install): GSAP 3.12 (+ScrollTrigger, +ScrollToPlugin), Three.js 0.165 (import map).

## Page structure (narrative arc)

Hero (result count-up) → Builder note (founder) → Pain (4 layers: tijd / taal /
onwetendheid / angst) → Stats (10 min · €0 · 3 languages, count-up) → How it
works (pinned 4 steps) → Two-window simulator demo (copy-chip loop) → Proof
(real Vercel invoice) → Audience ("Herken je dit?" — mirrors, not testimonials)
→ Comparison → Pricing (free quarter reframe + nudge quote) → FAQ → Final CTA
→ Legal footer.

## How to edit

- **Copy / FAQ:** `content.js` → `CONTENT.nl|en|es`. `{brand}` → `BRAND.name`
  ("BTWklaar"), `{agent}` → `BRAND.agent` ("Klaar"), `{domain}` → `BRAND.domain`.
  Fiscal nouns (BTW, aangifte, rubriek, Belastingdienst, reverse charge,
  verleggingsregeling, KVK, zzp'er) stay Dutch in every language — by design.
- **Product / agent name:** `content.js` → `BRAND.name` / `BRAND.agent`.
  One change updates wordmark, copy, footer, meta.
- **Pricing:** `content.js` → `PRICING.tiers` (numbers) + `CONTENT.<lang>.pricing.tiers`
  (strings). The free tier uses `copy` (paragraph) instead of `features` on purpose.
- **Builder avatar:** `index.html` → `.builder-avatar` (placeholder circle —
  swap for a real photo of Gabz later).
- **Colours:** `styles.css` `:root` tokens. Indigo is the only signal colour;
  `--green`/the green glow is reserved for the payoff (the €0 stat).
- **Hero figures:** `content.js` → `FIGURES` + `data-target` on `#mock-result`.

## Language

NL default. First visit detects `navigator.language`; the header toggle (NL/EN/ES)
switches live without reload (content cross-fades). Choice persists **only** in a
JS variable + URL hash (`#en`, `#es`) — no localStorage/sessionStorage.
`<html lang>`, `<title>` and the meta description update on switch.

## Accessibility & motion

- `prefers-reduced-motion: reduce` disables all GSAP/Three.js; the markup's
  static content *is* the final state (canvas hidden, sim demo shows final values).
- Keyboard: visible focus rings, GSAP-animated `<details>` accordion stays
  keyboard-operable, language toggle is a `role="group"` of buttons.
- "Preview · nog niet live" badge is fixed and always visible (until launch).

## Constraints (keep until launch)

- Copy-not-submit: never imply auto-filing to the Belastingdienst.
- Not affiliated with the Belastingdienst (footer fine print).
- No real KVK/BTW numbers — placeholders `[number]` in `BRAND`.
