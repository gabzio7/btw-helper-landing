# Klaar — BTW Helper · Landing prototype

Awwwards-style single-page marketing landing for **Klaar** (descriptor: *BTW Helper*),
a Dutch VAT filing assistant for zzp'ers. **Preview prototype** — no auth, no
payments, no backend; all CTAs are decorative or scroll-to-anchor.

Built per `Fable5-Landing-Brief.md` (single source of truth) with copy from
`BTW-Helper-Design-Proposal.html`.

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
| `styles.css` | Design tokens (brief §2) + all layout. |
| `hero.js` | Three.js ambient particle field + GSAP hero load timeline + count-up to `+€24,15`. |
| `main.js` | Language switch, content rendering, ScrollTrigger reveals, FAQ accordion, inert-CTA toast. |

Dependencies (CDN, no install): GSAP 3.12 + ScrollTrigger, Three.js 0.165 (import map).

## How to edit

- **Copy / FAQ:** `content.js` → `CONTENT.nl|en|es`. `{brand}` is replaced with
  `BRAND.name` at render time. Fiscal nouns (BTW, aangifte, rubriek,
  Belastingdienst, verleggingsregeling) stay Dutch in every language — by design.
- **Brand name:** `content.js` → `BRAND.name` ("Klaar" → "Kwartaal" / "BTW Helper").
  One change updates wordmark, copy, footer, meta.
- **Pricing:** `content.js` → `PRICING.tiers` (numbers) + `CONTENT.<lang>.pricing.tiers` (strings).
- **Colours:** `styles.css` `:root` tokens. Indigo is the only signal colour;
  `--green` is reserved for the "done / money back" payoff — don't add accents.
- **Hero figures:** `content.js` → `FIGURES` + the `data-target` on `#mock-result`
  in `index.html` (count-up target).

## Language

NL default. First visit detects `navigator.language`; the header toggle (NL/EN/ES)
switches live without reload. Choice persists **only** in a JS variable + URL hash
(`#en`, `#es`) — no localStorage/sessionStorage (unsupported in this preview env).
`<html lang>`, `<title>` and the meta description update on switch.

## Accessibility & motion

- `prefers-reduced-motion: reduce` disables all GSAP/Three.js; the markup's
  static content *is* the final state (canvas hidden, CSS gradient fallback).
- Keyboard: visible focus rings, native `<details>` accordion, language toggle
  is a `role="group"` of buttons with `aria-pressed`.
- "Preview · nog niet live" badge is fixed and always visible (until launch).

## Constraints (keep until launch)

- Copy-not-submit: never imply auto-filing to the Belastingdienst.
- Not affiliated with the Belastingdienst (footer fine print).
- No real KVK/BTW numbers — placeholders `[number]` in `BRAND`.
