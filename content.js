/* =========================================================================
   content.js — single source of truth for ALL visible copy (NL / EN / ES),
   pricing data and brand config.
   -------------------------------------------------------------------------
   EDIT HERE, not in index.html:
   - BRAND.name      → the product ("BTWklaar"). BRAND.agent → the AI
                       companion inside it ("Klaar"). Swappable in seconds.
   - PRICING         → tier prices (numbers only; currency formatting in JS).
   - CONTENT[lang]   → every string on the page. "{brand}" / "{agent}" are
                       replaced with BRAND.name / BRAND.agent at render time.
   Fiscal nouns stay Dutch in every language by design:
   BTW, aangifte, rubriek, Belastingdienst, reverse charge,
   verleggingsregeling, KVK, zzp'er.
   ========================================================================= */

const BRAND = {
  name: "BTWklaar",       // ← the product name (one place to change it)
  agent: "Klaar",         // ← the AI companion inside BTWklaar
  descriptor: "BTW filing assistant for zzp'ers",
  domain: "btwklaar.nl",  // placeholder for now
  studio: "Many-Worlds Studio",
  city: "Groningen, Netherlands",
  kvk: "[number]",        // placeholder — no real numbers in the prototype
  btw: "[number]",
  year: "2026",
};

/* Real figures from the live Q1 2026 dry-run — used as proof everywhere */
const FIGURES = {
  omzetBase: "€220,00",
  omzetBtw: "€46,20",
  rcBase: "€122,30",
  rcBtw: "€25,66",
  result: "+€24,15",
  resultNumber: 24.15, // hero count-up target
};

const PRICING = {
  tiers: [
    { id: "free",   monthly: 0,  yearly: 0   },
    { id: "pro",    monthly: 7,  yearly: 69,  highlight: true },
    { id: "studio", monthly: 14, yearly: 149 },
  ],
};

const CONTENT = {
  /* ======================================================== NL (default) */
  nl: {
    meta: {
      title: "{brand} — BTW aangifte voor zzp'ers",
      description:
        "Je facturen erin. {agent} eruit. {brand} rubriceert je facturen, regelt reverse charge en valuta, en vult je BTW-aangifte voor. Jij controleert en dient zelf in — in 10 minuten.",
    },
    badge: "Preview · nog niet live",
    previewTooltip: "Preview — nog niet live",
    nav: { how: "Hoe het werkt", proof: "De motor", pricing: "Prijzen", faq: "FAQ", cta: "Probeer gratis" },
    hero: {
      eyebrow: "Je facturen erin. {agent} eruit.",
      h1a: "Je BTW-aangifte?",
      h1b: "Klaar.",
      sub: "Sleep je facturen erin. {agent} rubriceert ze, regelt reverse charge en buitenlandse valuta. Jij controleert. Jij dient in. 10 minuten — geen 3 uur.",
      ctaPrimary: "Probeer je eerste kwartaal — gratis",
      ctaNote: "Geen creditcard. Geen Nederlands nodig. Geen accountant nodig.",
      ctaGhost: "Bekijk hoe het werkt",
      mockLabel: "Q1 2026 · resultaat",
      mockResultLabel: "5g · te betalen",
      mockRows: [
        ["1a · omzet", "€46,20"],
        ["4a · verleggingsregeling", "€25,66"],
        ["5g · te betalen", "+€24,15"],
      ],
    },
    builder: {
      text: "Ik bouwde {brand} omdat ik zelf elk kwartaal uren kwijt was. Het formulier, de rubrieken, de buitenlandse facturen — niemand legt het je uit als je begint. Als het mij heeft geholpen, helpt het jou ook.",
      sig: "— Gabz, zzp'er & maker",
      label: "Gemaakt door één persoon in 🇳🇱",
    },
    pain: {
      eyebrow: "Het probleem",
      h: "De vijand is niet de accountant. Het is die middag per kwartaal.",
      intro: "Vier dingen maken die middag langer dan nodig.",
      cards: [
        { icon: "⏱", t: "Tijd", d: "Het portaal van de Belastingdienst kost je een middag als je de regels niet kent. Dat zou niet zo moeten zijn." },
        { icon: "🌐", t: "Taal", d: "Het formulier is in het Nederlands. Je facturen zijn in het Engels. Je tools zijn Amerikaans. Eén van deze dingen hoort niet in het rijtje." },
        { icon: "📖", t: "Onwetendheid", d: "Reverse charge. Rubriek 4a. ICP-opgaaf. Niemand legt het uit als je je KVK registreert. Je ontdekt het pas als er iets misgaat." },
        { icon: "⚠️", t: "Angst", d: "Een verkeerde rubriek is niet zomaar een foutje — het is een brief van de Belastingdienst. De meeste zzp'ers doen het goed. De meesten weten het alleen niet zeker." },
      ],
      gap: "{brand} haalt alle vier weg. Je facturen erin. {agent} eruit.",
    },
    stats: {
      eyebrow: "De besparing",
      h: "Wat {brand} je bespaart",
      items: [
        { num: "10", suffix: " min", green: false,
          sub: "Gemiddelde tijd voor een kwartaalaangifte als je facturen op orde zijn.",
          foot: "3+ uur als je vanaf nul begint met een spreadsheet." },
        { num: "0", prefix: "€", green: true,
          sub: "Kosten van je eerste kwartaal. Geen creditcard, geen verplichtingen.",
          foot: "Daarna €7/maand. Minder dan één koffie per kwartaal." },
        { num: "3", suffix: " talen", green: false,
          sub: "Nederlands, Engels, Spaans — elk veld uitgelegd in jouw taal.",
          foot: "Het formulier blijft in het Nederlands. De uitleg niet." },
      ],
    },
    how: {
      eyebrow: "Hoe het werkt",
      h: "Van schoenendoos naar aangifte in vier stappen.",
      steps: [
        { t: "Upload", d: "Sleep de facturen van je kwartaal erin. PDF, foto, e-mail — door elkaar mag." },
        { t: "{agent} rubriceert", d: "Elke factuur krijgt de juiste rubriek, met uitleg. Reverse charge, valuta en buitenlandse facturen: automatisch goed." },
        { t: "Controleer", d: "Je ziet per factuur in gewone taal waarom hij zo is ingedeeld. Twijfelgevallen worden gemarkeerd, niet gegokt." },
        { t: "Open twee vensters. Kopieer. Klaar.", d: "De {brand}-simulator heeft exact dezelfde velden als het formulier van de Belastingdienst. Naast elkaar. Kopieer de getallen. Je dient in — je gokt niet." },
      ],
      simCaption: "Zelfde velden, naast elkaar. Kopieer de getallen — je dient in, je gokt niet.",
      simLeft: "{brand} · simulator",
      simRight: "Mijn Belastingdienst Zakelijk",
    },
    proof: {
      eyebrow: "De motor",
      h: "Geen demo-data. Dit is een echte factuur.",
      sub: "Uit de Q1 2026 proefrit: een Amerikaanse factuur, automatisch verlegd en omgerekend.",
      invoice: {
        vendor: "Vercel Inc.",
        origin: "Verenigde Staten · buiten de EU",
        flag: "BTW verlegd naar jou",
        rows: [
          ["Bedrag ($ → €)", "€122,30"],
          ["Rubriek", "4a · verleggingsregeling"],
          ["21% zelf aangegeven", "€25,66"],
          ["Zelfde bedrag als voorbelasting (5b)", "−€25,66"],
        ],
        explain:
          "Diensten van buiten de EU: de BTW wordt naar jou verlegd. {agent} geeft 21% aan in rubriek 4a en trekt hetzelfde bedrag af als voorbelasting in 5b. Per saldo €0 — maar de Belastingdienst wil het wél zien staan. Jij ziet de redenering bij elke stap.",
      },
    },
    audience: {
      eyebrow: "Voor wie",
      h: "Herken je dit?",
      cards: [
        { icon: "💻", d: "Je gebruikt Vercel, Anthropic, Linear. Al je kosten zijn buitenlandse facturen zonder BTW. Je wist niet dat dat 'reverse charge' heet — en dat jij de BTW zelf moet aangeven." },
        { icon: "🌍", d: "Je woont in Nederland maar denkt in het Engels. Het Belastingdienst-portaal is in het Nederlands. Elk kwartaal open je Google Translate naast het formulier." },
        { icon: "📊", d: "Je houdt alles bij in een Excel. Het werkt min of meer. Maar elke aangifte vraag je je af: doe ik dit goed?" },
        { icon: "🧾", d: "Je boekhouder rekent €200 per kwartaal voor je BTW. Voor vijf facturen. Ergens voelt dat niet kloppen." },
      ],
    },
    compare: {
      eyebrow: "Eerlijke vergelijking",
      h: "Waar we winnen — en waar niet.",
      cols: ["", "{brand}", "Accountant", "MoneyBird", "Spreadsheet"],
      rows: [
        ["Scope", "Alleen je BTW-aangifte", "Alles — voor een prijs", "Volledige boekhouding", "Wat jij zelf bouwt"],
        ["Prijs per jaar", "€0 – €69", "± €600–800", "± €180", "€0"],
        ["Leercurve", "Tien minuten", "Geen — jij levert aan", "Avondenwerk", "Steil en riskant"],
        ["AI-native", "Ja — uitleg per factuur", "Nee", "Deels, achteraf", "Nee"],
      ],
      note: "Complexe situatie — overnames, internationale structuren, suppletie? Dan is een accountant het juiste antwoord. Ook volgens ons.",
    },
    pricing: {
      eyebrow: "Prijzen",
      h: "Je eerste kwartaal is gratis.",
      sub: "De volledige ervaring — geen demo, je echte aangifte.",
      perMonth: "/maand",
      perYearPrefix: "of",
      perYearSuffix: "per jaar",
      popular: "Populair",
      nudgeLabel: "Na je gratis kwartaal zie je:",
      nudgeQuote: "Als {brand} je heeft geholpen, help ons dan ook. €7 per maand. Minder dan één koffie per kwartaal.",
      tiers: {
        free: {
          name: "Eerste kwartaal", tagline: "Eén echt kwartaal, alles erop en eraan",
          copy: "De volledige ervaring. Geen limieten. Als het je tijd bespaart, weet je vanzelf of het €7 waard is.",
          cta: "Start je eerste kwartaal",
        },
        pro: {
          name: "Elk kwartaal", tagline: "Voor wie elk kwartaal rust wil",
          features: ["Onbeperkt kwartalen", "Onbeperkt uploads", "PDF-export", "{agent} AI-agent", "Verwerking met voorrang"],
          cta: "Begin met indienen",
        },
        studio: {
          name: "Power user", tagline: "Voor wie meer wil",
          features: ["Alles uit Pro", "Exportbundel voor je accountant", "Geavanceerde categorieën", "Vroege toegang tot nieuwe functies"],
          cta: "Kies Studio",
        },
      },
    },
    faq: {
      eyebrow: "FAQ",
      h: "Vijf vragen vóór je ja zegt.",
      items: [
        { q: "Is {brand} net zo nauwkeurig als mijn boekhouder?",
          a: "{brand} leest dezelfde factuurgegevens als je boekhouder. Elke classificatie komt met uitleg — je ziet precies waarom een Vercel-factuur rubriek 4a wordt. Jij controleert vóór het indienen. Jij houdt de controle." },
        { q: "Ik heb buitenlandse facturen (Vercel, Anthropic, AWS). Kan het daarmee overweg?",
          a: "Ja — daar is het juist voor gebouwd. Facturen van buiten de EU worden automatisch omgerekend naar euro's en zelf aangegeven tegen 21% Nederlandse BTW (rubriek 4a). EU-facturen zonder BTW krijgen rubriek 4b. De regels worden correct toegepast, en je ziet de redenering." },
        { q: "Dient het automatisch in bij de Belastingdienst?",
          a: "Nee — en dat is bewust. {brand} vult een simulator voor die het officiële formulier spiegelt. Jij kopieert de getallen zelf naar Mijn Belastingdienst Zakelijk. Jij dient in. Jij bent verantwoordelijk. Zo hoort het." },
        { q: "Ik ben expat. Mijn Nederlands is niet geweldig. Is dit iets voor mij?",
          a: "Juist voor jou. De hele app werkt in het Engels en Spaans. Elke rubriek, elk veld, elke foutmelding — uitgelegd in jouw taal. Het formulier van de Belastingdienst blijft in het Nederlands (daar kunnen wij niets aan doen), maar jij weet precies wat waar hoort." },
        { q: "Wat gebeurt er na mijn gratis kwartaal?",
          a: "Je krijgt een vriendelijk duwtje. Als {brand} je heeft geholpen, is €7 per maand de upgrade. Zo niet, blijf de gratis versie gebruiken — één actief kwartaal, geen tijdslimiet." },
      ],
    },
    final: {
      h: "Volgend kwartaal: tien minuten.",
      sub: "Probeer je eerste kwartaal gratis. Geen creditcard, geen abonnement — gewoon je aangifte, klaar.",
      cta: "Probeer je eerste kwartaal — gratis",
    },
    footer: {
      tagline: "{brand} — Je facturen erin. {agent} eruit.",
      cols: [
        { h: "Product", items: ["Hoe het werkt", "Prijzen", "Beveiliging", "Roadmap", "Status"] },
        { h: "Bedrijf", items: ["Over", "Contact", "Gemaakt door {studio}", "{domain}", "KVK · {kvk}", "BTW · {btw}"] },
        { h: "Juridisch", items: ["Privacy & cookies (AVG/GDPR)", "Voorwaarden", "Verwerkersovereenkomst (DPA)", "Disclaimer"] },
      ],
      taxTitle: "Belasting-disclaimer.",
      tax: "{brand} is een softwaretool die helpt bij het voorbereiden van je Nederlandse BTW-aangifte. Het is geen belastingadviseur, accountant of administratiekantoor en geeft geen fiscaal, juridisch of financieel advies. Jij blijft zelf verantwoordelijk voor de juistheid en tijdige indiening van je aangifte bij de Belastingdienst. Controleer cijfers altijd vóór het indienen; raadpleeg een professional voor jouw specifieke situatie.",
      dataTitle: "Data.",
      data: "We verwerken je gegevens onder de AVG/GDPR. Data staat op EU-servers, geïsoleerd per account, en wordt nooit verkocht of gedeeld met adverteerders. Zie ons privacybeleid en de verwerkersovereenkomst.",
      fine: "© {year} {studio} · {city} · Dit is een preview-prototype en nog niet beschikbaar voor productiegebruik. “Belastingdienst” wordt alleen ter identificatie genoemd; {brand} is niet verbonden aan of goedgekeurd door de Belastingdienst.",
    },
  },

  /* ================================================================== EN */
  en: {
    meta: {
      title: "{brand} — VAT filing for freelancers",
      description:
        "Drop your invoices. Get your return. {agent} classifies every invoice, handles reverse charge and currencies, and pre-fills your BTW aangifte. You verify and file yourself — in 10 minutes.",
    },
    badge: "Preview · not yet live",
    previewTooltip: "Preview — not yet live",
    nav: { how: "How it works", proof: "The engine", pricing: "Pricing", faq: "FAQ", cta: "Try it free" },
    hero: {
      eyebrow: "Drop your invoices. Get your return. {agent}.",
      h1a: "Your VAT return?",
      h1b: "Klaar.",
      sub: "Drop your invoices. {agent} classifies them, maps every rubriek, handles reverse charge and foreign currencies. You verify. You file. 10 minutes — not 3 hours.",
      ctaPrimary: "Try your first quarter — free",
      ctaNote: "No credit card. No Dutch required. No accountant needed.",
      ctaGhost: "See how it works",
      mockLabel: "Q1 2026 · result",
      mockResultLabel: "5g · to pay",
      mockRows: [
        ["1a · omzet", "€46,20"],
        ["4a · verleggingsregeling", "€25,66"],
        ["5g · to pay", "+€24,15"],
      ],
    },
    builder: {
      text: "I built {brand} because I lost hours every quarter myself. The form, the rubrieken, the foreign invoices — nobody explains any of it when you start. If it helped me, it'll help you too.",
      sig: "— Gabz, zzp'er & maker",
      label: "Made by one person in 🇳🇱",
    },
    pain: {
      eyebrow: "The problem",
      h: "The enemy isn't the accountant. It's that quarterly afternoon.",
      intro: "Four things make that afternoon longer than it should be.",
      cards: [
        { icon: "⏱", t: "Time", d: "The Belastingdienst portal takes an afternoon if you don't know the rules. It shouldn't." },
        { icon: "🌐", t: "Language", d: "The form is in Dutch. Your invoices are in English. Your tools are American. One of these things is not like the others." },
        { icon: "📖", t: "Not knowing", d: "Reverse charge. Rubriek 4a. ICP opgaaf. Nobody explains these when you register your KVK. You find out when something goes wrong." },
        { icon: "⚠️", t: "The fear", d: "A wrong rubriek isn't just a mistake — it's a letter from the Belastingdienst. Most zzp'ers get it right. Most aren't sure they did." },
      ],
      gap: "{brand} removes all four. Drop your invoices. Get your return. {agent}.",
    },
    stats: {
      eyebrow: "The savings",
      h: "What {brand} saves you",
      items: [
        { num: "10", suffix: " min", green: false,
          sub: "Average time to complete a quarterly aangifte if your invoices are organized.",
          foot: "3+ hours if you start from scratch with a spreadsheet." },
        { num: "0", prefix: "€", green: true,
          sub: "Cost of your first quarter. No credit card, no commitment.",
          foot: "€7/mo after that. Less than one coffee per quarter." },
        { num: "3", suffix: " languages", green: false,
          sub: "Dutch, English, Spanish — every field explained in your language.",
          foot: "The form is always in Dutch. The explanation doesn't have to be." },
      ],
    },
    how: {
      eyebrow: "How it works",
      h: "From shoebox to aangifte in four steps.",
      steps: [
        { t: "Upload", d: "Drop in the quarter's invoices. PDF, photo, email — mixed is fine." },
        { t: "{agent} classifies", d: "Every invoice lands in the correct rubriek, with an explanation. Reverse charge, currency and foreign invoices: handled correctly, automatically." },
        { t: "Review", d: "You see, in plain language, why each invoice was classified that way. Doubtful cases get flagged, not guessed." },
        { t: "Open two windows. Copy. Done.", d: "The {brand} simulator has the exact same fields as the Belastingdienst form. Side by side. Copy the numbers. You're filing — not guessing." },
      ],
      simCaption: "Same fields, side by side. Copy the numbers — you're filing, not guessing.",
      simLeft: "{brand} · simulator",
      simRight: "Mijn Belastingdienst Zakelijk",
    },
    proof: {
      eyebrow: "The engine",
      h: "No demo data. This is a real invoice.",
      sub: "From the Q1 2026 dry-run: a US invoice, reverse-charged and converted automatically.",
      invoice: {
        vendor: "Vercel Inc.",
        origin: "United States · outside the EU",
        flag: "BTW reverse-charged to you",
        rows: [
          ["Amount ($ → €)", "€122,30"],
          ["Rubriek", "4a · verleggingsregeling"],
          ["21% self-assessed", "€25,66"],
          ["Same amount as input VAT (5b)", "−€25,66"],
        ],
        explain:
          "Services from outside the EU: the BTW is reverse-charged to you. {agent} declares 21% in rubriek 4a and deducts the same amount as input VAT in 5b. Net effect €0 — but the Belastingdienst does want to see it. You see the reasoning at every step.",
      },
    },
    audience: {
      eyebrow: "Who it's for",
      h: "Sound familiar?",
      cards: [
        { icon: "💻", d: "You use Vercel, Anthropic, Linear. All your costs are foreign invoices without BTW. You didn't know that's called 'reverse charge' — or that you have to declare the BTW yourself." },
        { icon: "🌍", d: "You live in the Netherlands but think in English. The Belastingdienst portal is in Dutch. Every quarter you open Google Translate next to the form." },
        { icon: "📊", d: "You track everything in an Excel. It more or less works. But every aangifte you wonder: am I doing this right?" },
        { icon: "🧾", d: "Your accountant charges €200 a quarter for your BTW. For five invoices. Something about that doesn't add up." },
      ],
    },
    compare: {
      eyebrow: "Honest comparison",
      h: "Where we win — and where we don't.",
      cols: ["", "{brand}", "Accountant", "MoneyBird", "Spreadsheet"],
      rows: [
        ["Scope", "Only your BTW aangifte", "Everything — at a price", "Full bookkeeping", "Whatever you build"],
        ["Price per year", "€0 – €69", "± €600–800", "± €180", "€0"],
        ["Learning curve", "Ten minutes", "None — you hand it over", "Evenings of setup", "Steep and risky"],
        ["AI-native", "Yes — explained per invoice", "No", "Partly, bolted on", "No"],
      ],
      note: "Complex situation — acquisitions, international structures, corrections? Then an accountant is the right answer. We'd tell you the same.",
    },
    pricing: {
      eyebrow: "Pricing",
      h: "Your first quarter is free.",
      sub: "The full experience — not a demo, your actual aangifte.",
      perMonth: "/month",
      perYearPrefix: "or",
      perYearSuffix: "per year",
      popular: "Popular",
      nudgeLabel: "After your free quarter, you'll see:",
      nudgeQuote: "If {brand} helped you, help us back. €7 a month. Less than one coffee per quarter.",
      tiers: {
        free: {
          name: "First quarter", tagline: "One real quarter, the whole experience",
          copy: "Full experience. No limits. When it saves you time, you'll know if it's worth €7.",
          cta: "Start your first quarter",
        },
        pro: {
          name: "Every quarter", tagline: "For calm, every quarter",
          features: ["Unlimited quarters", "Unlimited uploads", "PDF export", "{agent} AI agent", "Priority parsing"],
          cta: "Start filing",
        },
        studio: {
          name: "Power user", tagline: "For those who want more",
          features: ["Everything in Pro", "Accountant export bundle", "Advanced categories", "Early access to new features"],
          cta: "Get Studio",
        },
      },
    },
    faq: {
      eyebrow: "FAQ",
      h: "Five questions before you say yes.",
      items: [
        { q: "Is {brand} as accurate as my accountant?",
          a: "{brand} reads the same invoice data your accountant would. Every classification comes with an explanation — you see exactly why a Vercel invoice becomes rubriek 4a. You review before filing. You stay in control." },
        { q: "I have foreign invoices (Vercel, Anthropic, AWS). Can it handle those?",
          a: "Yes — that's exactly what it's built for. Non-EU invoices are automatically converted to EUR and self-assessed at 21% Dutch VAT (rubriek 4a). EU invoices with no VAT charged get rubriek 4b. The rules are applied correctly, and you see the reasoning." },
        { q: "Does it file automatically to the Belastingdienst?",
          a: "No — and that's intentional. {brand} pre-fills a simulator that mirrors the official form. You copy the numbers into Mijn Belastingdienst Zakelijk yourself. You file. You're responsible. That's the right way to do it." },
        { q: "I'm an expat. My Dutch isn't great. Is this for me?",
          a: "Especially for you. The entire app runs in English and Spanish. Every rubriek, every field, every error message — explained in your language. The Belastingdienst form stays in Dutch (we can't change that), but you'll know exactly what goes where." },
        { q: "What happens after my free quarter?",
          a: "You get a gentle nudge. If {brand} helped you, €7/month is the upgrade. If it didn't, keep using the free tier — one active quarter, no time limit." },
      ],
    },
    final: {
      h: "Next quarter: ten minutes.",
      sub: "Try your first quarter free. No card, no subscription — just your aangifte, done.",
      cta: "Try your first quarter — free",
    },
    footer: {
      tagline: "{brand} — Drop your invoices. Get your return. {agent}.",
      cols: [
        { h: "Product", items: ["How it works", "Pricing", "Security", "Roadmap", "Status"] },
        { h: "Company", items: ["About", "Contact", "Built by {studio}", "{domain}", "KVK · {kvk}", "BTW · {btw}"] },
        { h: "Legal", items: ["Privacy & cookies (AVG/GDPR)", "Terms of service", "Data processing (DPA)", "Disclaimer"] },
      ],
      taxTitle: "Tax disclaimer.",
      tax: "{brand} is a software tool that helps prepare your Dutch VAT return. It is not a tax advisor, accountant, or administrative office, and it does not provide tax, legal, or financial advice. You remain solely responsible for the accuracy and timely submission of your aangifte to the Belastingdienst. Always verify figures before filing; consult a qualified professional for your specific situation.",
      dataTitle: "Data.",
      data: "We process your data under the GDPR/AVG. Data is stored on EU servers, isolated per account, and never sold or shared with advertisers. See our Privacy Policy and Data Processing Agreement.",
      fine: "© {year} {studio} · {city} · This is a preview prototype and is not yet available for production use. “Belastingdienst” is referenced for identification only; {brand} is not affiliated with or endorsed by the Dutch Tax Administration.",
    },
  },

  /* ================================================================== ES */
  es: {
    meta: {
      title: "{brand} — Aangifte de IVA para freelancers",
      description:
        "Sube tus facturas. Obtén tu aangifte. {agent} clasifica cada factura, resuelve el reverse charge y las divisas, y rellena tu aangifte de BTW. Tú verificas y presentas — en 10 minutos.",
    },
    badge: "Preview · aún no activo",
    previewTooltip: "Preview — aún no activo",
    nav: { how: "Cómo funciona", proof: "El motor", pricing: "Precios", faq: "FAQ", cta: "Pruébalo gratis" },
    hero: {
      eyebrow: "Sube tus facturas. Obtén tu aangifte. {agent}.",
      h1a: "¿Tu declaración de IVA?",
      h1b: "Klaar.",
      sub: "Sube tus facturas. {agent} las clasifica, asigna cada rubriek, resuelve el reverse charge y las divisas extranjeras. Tú verificas. Tú presentas. 10 minutos — no 3 horas.",
      ctaPrimary: "Prueba tu primer trimestre — gratis",
      ctaNote: "Sin tarjeta. Sin necesidad de neerlandés. Sin accountant.",
      ctaGhost: "Mira cómo funciona",
      mockLabel: "Q1 2026 · resultado",
      mockResultLabel: "5g · a pagar",
      mockRows: [
        ["1a · omzet", "€46,20"],
        ["4a · verleggingsregeling", "€25,66"],
        ["5g · a pagar", "+€24,15"],
      ],
    },
    builder: {
      text: "Construí {brand} porque yo mismo perdía horas cada trimestre. El formulario, las rubrieken, las facturas extranjeras — nadie te lo explica cuando empiezas. Si me ayudó a mí, también te ayudará a ti.",
      sig: "— Gabz, zzp'er & maker",
      label: "Hecho por una persona en 🇳🇱",
    },
    pain: {
      eyebrow: "El problema",
      h: "El enemigo no es el gestor. Es esa tarde cada trimestre.",
      intro: "Cuatro cosas hacen esa tarde más larga de lo necesario.",
      cards: [
        { icon: "⏱", t: "Tiempo", d: "El portal de la Belastingdienst te cuesta una tarde si no conoces las reglas. No debería ser así." },
        { icon: "🌐", t: "Idioma", d: "El formulario está en neerlandés. Tus facturas, en inglés. Tus herramientas son americanas. Una de estas cosas no encaja con las demás." },
        { icon: "📖", t: "No saber", d: "Reverse charge. Rubriek 4a. ICP opgaaf. Nadie te lo explica cuando registras tu KVK. Lo descubres cuando algo sale mal." },
        { icon: "⚠️", t: "El miedo", d: "Una rubriek equivocada no es solo un error — es una carta de la Belastingdienst. La mayoría de los zzp'ers lo hacen bien. La mayoría no está segura de haberlo hecho." },
      ],
      gap: "{brand} elimina las cuatro. Sube tus facturas. Obtén tu aangifte. {agent}.",
    },
    stats: {
      eyebrow: "El ahorro",
      h: "Lo que {brand} te ahorra",
      items: [
        { num: "10", suffix: " min", green: false,
          sub: "Tiempo medio para completar la aangifte del trimestre si tus facturas están organizadas.",
          foot: "Más de 3 horas si empiezas de cero con una hoja de cálculo." },
        { num: "0", prefix: "€", green: true,
          sub: "Coste de tu primer trimestre. Sin tarjeta, sin compromiso.",
          foot: "Después, €7/mes. Menos que un café al trimestre." },
        { num: "3", suffix: " idiomas", green: false,
          sub: "Neerlandés, inglés, español — cada campo explicado en tu idioma.",
          foot: "El formulario siempre está en neerlandés. La explicación no tiene por qué." },
      ],
    },
    how: {
      eyebrow: "Cómo funciona",
      h: "De caja de zapatos a aangifte en cuatro pasos.",
      steps: [
        { t: "Sube", d: "Arrastra las facturas del trimestre. PDF, foto, email — mezcladas, da igual." },
        { t: "{agent} clasifica", d: "Cada factura cae en la rubriek correcta, con explicación. Reverse charge, divisas y facturas extranjeras: resueltas en automático." },
        { t: "Revisa", d: "Ves, en lenguaje claro, por qué cada factura se clasificó así. Los casos dudosos se marcan, no se adivinan." },
        { t: "Abre dos ventanas. Copia. Klaar.", d: "El simulador de {brand} tiene exactamente los mismos campos que el formulario de la Belastingdienst. Lado a lado. Copia los números. Estás presentando — no adivinando." },
      ],
      simCaption: "Los mismos campos, lado a lado. Copia los números — presentas, no adivinas.",
      simLeft: "{brand} · simulador",
      simRight: "Mijn Belastingdienst Zakelijk",
    },
    proof: {
      eyebrow: "El motor",
      h: "Sin datos de demo. Esto es una factura real.",
      sub: "De la prueba real del Q1 2026: una factura de EE. UU., con reverse charge y conversión automática.",
      invoice: {
        vendor: "Vercel Inc.",
        origin: "Estados Unidos · fuera de la UE",
        flag: "BTW invertido hacia ti",
        rows: [
          ["Importe ($ → €)", "€122,30"],
          ["Rubriek", "4a · verleggingsregeling"],
          ["21% autoliquidado", "€25,66"],
          ["Mismo importe como IVA soportado (5b)", "−€25,66"],
        ],
        explain:
          "Servicios de fuera de la UE: el BTW se invierte hacia ti. {agent} declara el 21% en la rubriek 4a y deduce el mismo importe como IVA soportado en 5b. Efecto neto €0 — pero la Belastingdienst sí quiere verlo declarado. Tú ves el razonamiento en cada paso.",
      },
    },
    audience: {
      eyebrow: "Para quién",
      h: "¿Te suena?",
      cards: [
        { icon: "💻", d: "Usas Vercel, Anthropic, Linear. Todos tus gastos son facturas extranjeras sin BTW. No sabías que eso se llama 'reverse charge' — ni que el BTW lo tienes que declarar tú." },
        { icon: "🌍", d: "Vives en Países Bajos pero piensas en inglés (o en español). El portal de la Belastingdienst está en neerlandés. Cada trimestre abres Google Translate junto al formulario." },
        { icon: "📊", d: "Lo apuntas todo en un Excel. Funciona, más o menos. Pero en cada aangifte te preguntas: ¿lo estaré haciendo bien?" },
        { icon: "🧾", d: "Tu gestor te cobra €200 al trimestre por el BTW. Por cinco facturas. Algo ahí no cuadra." },
      ],
    },
    compare: {
      eyebrow: "Comparación honesta",
      h: "Dónde ganamos — y dónde no.",
      cols: ["", "{brand}", "Gestor", "MoneyBird", "Hoja de cálculo"],
      rows: [
        ["Alcance", "Solo tu aangifte de BTW", "Todo — a un precio", "Contabilidad completa", "Lo que tú construyas"],
        ["Precio al año", "€0 – €69", "± €600–800", "± €180", "€0"],
        ["Curva de aprendizaje", "Diez minutos", "Ninguna — lo delegas", "Tardes enteras", "Empinada y arriesgada"],
        ["IA nativa", "Sí — explicación por factura", "No", "En parte, añadida", "No"],
      ],
      note: "¿Situación compleja — adquisiciones, estructuras internacionales, correcciones? Entonces un gestor es la respuesta correcta. Nosotros te diríamos lo mismo.",
    },
    pricing: {
      eyebrow: "Precios",
      h: "Tu primer trimestre es gratis.",
      sub: "La experiencia completa — no una demo, tu aangifte de verdad.",
      perMonth: "/mes",
      perYearPrefix: "o",
      perYearSuffix: "al año",
      popular: "Popular",
      nudgeLabel: "Después de tu trimestre gratis verás:",
      nudgeQuote: "Si {brand} te ayudó, ayúdanos tú también. €7 al mes. Menos que un café al trimestre.",
      tiers: {
        free: {
          name: "Primer trimestre", tagline: "Un trimestre real, la experiencia completa",
          copy: "La experiencia completa. Sin límites. Cuando te ahorre tiempo, sabrás si vale €7.",
          cta: "Empieza tu primer trimestre",
        },
        pro: {
          name: "Cada trimestre", tagline: "Calma, cada trimestre",
          features: ["Trimestres ilimitados", "Subidas ilimitadas", "Exportación PDF", "Agente IA {agent}", "Procesamiento prioritario"],
          cta: "Empieza a presentar",
        },
        studio: {
          name: "Power user", tagline: "Para quien quiere más",
          features: ["Todo lo de Pro", "Paquete de exportación para tu gestor", "Categorías avanzadas", "Acceso anticipado a novedades"],
          cta: "Elige Studio",
        },
      },
    },
    faq: {
      eyebrow: "FAQ",
      h: "Cinco preguntas antes de decir que sí.",
      items: [
        { q: "¿Es {brand} tan preciso como mi gestor?",
          a: "{brand} lee los mismos datos de factura que leería tu gestor. Cada clasificación viene con una explicación — ves exactamente por qué una factura de Vercel se convierte en rubriek 4a. Tú revisas antes de presentar. Tú mantienes el control." },
        { q: "Tengo facturas extranjeras (Vercel, Anthropic, AWS). ¿Puede con ellas?",
          a: "Sí — para eso está hecho, exactamente. Las facturas de fuera de la UE se convierten automáticamente a euros y se autoliquidan al 21% de IVA neerlandés (rubriek 4a). Las facturas de la UE sin IVA reciben la rubriek 4b. Las reglas se aplican correctamente, y tú ves el razonamiento." },
        { q: "¿Presenta automáticamente ante la Belastingdienst?",
          a: "No — y es intencional. {brand} rellena un simulador que replica el formulario oficial. Tú copias los números a Mijn Belastingdienst Zakelijk. Tú presentas. Tú eres responsable. Así es como debe ser." },
        { q: "Soy expat. Mi neerlandés no es muy bueno. ¿Esto es para mí?",
          a: "Especialmente para ti. Toda la app funciona en inglés y español. Cada rubriek, cada campo, cada mensaje de error — explicado en tu idioma. El formulario de la Belastingdienst sigue en neerlandés (eso no podemos cambiarlo), pero sabrás exactamente qué va dónde." },
        { q: "¿Qué pasa después de mi trimestre gratis?",
          a: "Recibes un empujoncito amable. Si {brand} te ayudó, €7 al mes es la mejora. Si no, sigue usando el plan gratis — un trimestre activo, sin límite de tiempo." },
      ],
    },
    final: {
      h: "El próximo trimestre: diez minutos.",
      sub: "Prueba tu primer trimestre gratis. Sin tarjeta, sin suscripción — solo tu aangifte, lista.",
      cta: "Prueba tu primer trimestre — gratis",
    },
    footer: {
      tagline: "{brand} — Sube tus facturas. Obtén tu aangifte. {agent}.",
      cols: [
        { h: "Producto", items: ["Cómo funciona", "Precios", "Seguridad", "Roadmap", "Estado"] },
        { h: "Empresa", items: ["Sobre nosotros", "Contacto", "Creado por {studio}", "{domain}", "KVK · {kvk}", "BTW · {btw}"] },
        { h: "Legal", items: ["Privacidad y cookies (AVG/GDPR)", "Términos de servicio", "Tratamiento de datos (DPA)", "Aviso legal"] },
      ],
      taxTitle: "Aviso fiscal.",
      tax: "{brand} es una herramienta de software que ayuda a preparar tu declaración de IVA neerlandesa (BTW). No es un asesor fiscal, contable ni gestoría, y no ofrece asesoramiento fiscal, legal o financiero. Tú sigues siendo el único responsable de la exactitud y la presentación a tiempo de tu aangifte ante la Belastingdienst. Verifica siempre las cifras antes de presentar; consulta a un profesional cualificado para tu situación concreta.",
      dataTitle: "Datos.",
      data: "Tratamos tus datos conforme al RGPD/AVG. Los datos se almacenan en servidores de la UE, aislados por cuenta, y nunca se venden ni se comparten con anunciantes. Consulta nuestra política de privacidad y el acuerdo de tratamiento de datos.",
      fine: "© {year} {studio} · {city} · Esto es un prototipo de vista previa y aún no está disponible para uso en producción. “Belastingdienst” se menciona solo a efectos de identificación; {brand} no está afiliado ni avalado por la administración tributaria neerlandesa.",
    },
  },
};
