/* =========================================================================
   content.js — single source of truth for ALL visible copy (NL / EN / ES),
   pricing data and brand config.
   -------------------------------------------------------------------------
   EDIT HERE, not in index.html:
   - BRAND.name      → swap "Klaar" for "Kwartaal" / "BTW Helper" in seconds.
   - PRICING         → tier prices (numbers only; currency formatting in JS).
   - CONTENT[lang]   → every string on the page. "{brand}" is replaced with
                       BRAND.name at render time.
   Fiscal nouns stay Dutch in every language by design:
   BTW, aangifte, rubriek, Belastingdienst, verleggingsregeling.
   ========================================================================= */

const BRAND = {
  name: "Klaar",            // ← the one place to change the brand name
  descriptor: "BTW Helper", // explanatory sub-line, kept in all languages
  studio: "Many-Worlds Studio",
  city: "Groningen, Netherlands",
  kvk: "[number]",          // placeholder — no real numbers in the prototype
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
      title: "{brand} — Je BTW-aangifte? Klaar.",
      description:
        "Sleep je facturen erin. AI rubriceert, rekent en vult je BTW-aangifte voor. Jij controleert en dient zelf in bij de Belastingdienst — in tien minuten.",
    },
    badge: "Preview · nog niet live",
    previewTooltip: "Preview — nog niet live",
    nav: { how: "Hoe het werkt", proof: "De motor", pricing: "Prijzen", faq: "FAQ", cta: "Probeer gratis" },
    hero: {
      eyebrow: "BTW-aangifte voor zzp'ers",
      h1a: "Je BTW-aangifte?",
      h1b: "Klaar.",
      sub: "Sleep je facturen erin. Wij rubriceren, rekenen en vullen je aangifte voor. Jij controleert en dient in — in tien minuten.",
      ctaPrimary: "Probeer één kwartaal gratis",
      ctaNote: "geen creditcard nodig",
      ctaGhost: "Bekijk hoe het werkt",
      mockLabel: "Q1 2026 · resultaat",
      mockResultLabel: "5g · te betalen",
      mockRows: [
        ["1a · omzet", "€46,20"],
        ["4a · verleggingsregeling", "€25,66"],
        ["5g · te betalen", "+€24,15"],
      ],
    },
    pain: {
      eyebrow: "Het probleem",
      h: "Drie slechte opties. Eén gat.",
      intro: "Geen boekhoudcursus. Geen €600 voor de accountant. Geen paniek op de deadline.",
      cards: [
        { t: "De accountant", d: "± €600 per jaar om vier formulieren in te vullen. Prima — tot je beseft dat jij het voorwerk alsnog zelf aanlevert." },
        { t: "Boekhoudsoftware", d: "Gebouwd voor je complete administratie. Jij wilde één aangifte doen, niet leren boekhouden in een dashboard met veertig tabbladen." },
        { t: "De spreadsheet", d: "Gratis en vertrouwd — tot er een buitenlandse factuur of de verleggingsregeling voorbijkomt. Eén verkeerde cel en je rubriek klopt niet." },
      ],
      gap: "Er ontbreekt iets tussen die drie: één tool die precies één taak perfect doet. Je BTW-aangifte. {brand}.",
    },
    how: {
      eyebrow: "Hoe het werkt",
      h: "Van schoenendoos naar aangifte in vier stappen.",
      steps: [
        { t: "Upload", d: "Sleep de facturen van je kwartaal erin. PDF, foto, e-mail — door elkaar mag." },
        { t: "AI rubriceert", d: "Elke factuur krijgt de juiste rubriek. Verleggingsregeling, valuta en buitenlandse facturen: automatisch goed." },
        { t: "Controleer", d: "Je ziet per factuur in gewone taal waarom hij zo is ingedeeld. Twijfelgevallen worden gemarkeerd, niet gegokt." },
        { t: "Dien in", d: "Een 7-staps simulator spiegelt het officiële formulier. Jij kopieert de waarden naar het portaal van de Belastingdienst en dient zelf in." },
      ],
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
          "Diensten van buiten de EU: de BTW wordt naar jou verlegd. Je geeft 21% aan in rubriek 4a en trekt hetzelfde bedrag af als voorbelasting in 5b. Per saldo €0 — maar de Belastingdienst wil het wél zien staan.",
      },
    },
    compare: {
      eyebrow: "Eerlijke vergelijking",
      h: "Waar we winnen — en waar niet.",
      cols: ["", "{brand}", "Accountant", "MoneyBird", "Spreadsheet"],
      rows: [
        ["Scope", "Alleen je BTW-aangifte", "Alles — voor een prijs", "Volledige boekhouding", "Wat jij zelf bouwt"],
        ["Prijs per jaar", "€0 – €69", "± €600", "± €180", "€0"],
        ["Leercurve", "Tien minuten", "Geen — jij levert aan", "Avondenwerk", "Steil en riskant"],
        ["AI-native", "Ja — uitleg per factuur", "Nee", "Deels, achteraf", "Nee"],
      ],
      note: "Complexe situatie — overnames, internationale structuren, suppletie? Dan is een accountant het juiste antwoord. Ook volgens ons.",
    },
    pricing: {
      eyebrow: "Prijzen",
      h: "Begin gratis. Blijf voor de rust.",
      sub: "Het gratis plan doet één écht kwartaal — geen demo, je echte aangifte.",
      perMonth: "/maand",
      perYearPrefix: "of",
      perYearSuffix: "per jaar",
      freeLabel: "Gratis",
      popular: "Populair",
      tiers: {
        free: {
          name: "Gratis", tagline: "Eén echt kwartaal",
          features: ["1 kwartaal volledig voorbereid", "AI-rubricering met uitleg", "7-staps simulator", "Kopieer-en-plak naar het portaal"],
          cta: "Probeer je kwartaal",
        },
        pro: {
          name: "Pro", tagline: "Elk kwartaal, zonder stress",
          features: ["Alle kwartalen + jaaroverzicht", "Onbeperkt facturen", "Verleggingsregeling & valuta", "Controlechecks & deadline-herinneringen"],
          cta: "Kies Pro",
        },
        studio: {
          name: "Studio", tagline: "Voor meerdere ondernemingen",
          features: ["Alles uit Pro", "Tot 3 ondernemingen", "Prioriteitssupport", "Export voor je accountant"],
          cta: "Kies Studio",
        },
      },
    },
    faq: {
      eyebrow: "FAQ",
      h: "Vijf vragen vóór je ja zegt.",
      items: [
        { q: "Is dit een accountant?",
          a: "Nee — en dat is precies het punt. {brand} is een aangifte-assistent, geen accountant of boekhoudpakket. Het bereidt je aangifte voor zodat je hem zelf in minuten kunt indienen. Voor complexe situaties blijft een professional verstandig; voor de routine-BTW per kwartaal heb je er geen meer nodig." },
        { q: "Hoe weet ik dat de rubricering klopt?",
          a: "De AI legt elke factuur uit in gewone taal — waarom iets 4a verleggingsregeling is, waarom een Amerikaanse factuur tegen 21% zelf wordt aangegeven. Ingebouwde consistentiechecks markeren alles wat niet optelt, en jij controleert elk getal voordat het ergens heen gaat. Niets blijft verborgen." },
        { q: "Dient het automatisch in bij de Belastingdienst?",
          a: "Nee. Bewust niet. Het vult voor en geeft je kopieerknoppen — jij plakt in het officiële portaal en dient zelf in. Automatisch indienen bij de Belastingdienst is een risico dat wij niet namens jou nemen. De laatste klik blijft van jou." },
        { q: "Zijn mijn financiële gegevens veilig?",
          a: "Je data is geïsoleerd per account, versleuteld onderweg en in rust, en opgeslagen op EU-infrastructuur. Eén account hoort bij één persoon en één onderneming — geen gedeelde logins, niemand anders kan ooit je facturen zien." },
        { q: "En als mijn facturen rommelig zijn — buitenlands, gemengde BTW, creditnota's?",
          a: "Daar is het juist voor gebouwd. EU- en niet-EU-leveranciers, valutaconversie, verleggingsregeling, buitenlandse BTW en creditnota's worden allemaal afgehandeld. Randgevallen worden gemarkeerd voor jouw controle in plaats van stilletjes gegokt." },
      ],
    },
    final: {
      h: "Volgend kwartaal: tien minuten.",
      sub: "Probeer één echt kwartaal gratis. Geen creditcard, geen abonnement — gewoon je aangifte, klaar.",
      cta: "Probeer één kwartaal gratis",
    },
    footer: {
      tagline: "{brand} — your BTW helper",
      cols: [
        { h: "Product", items: ["Hoe het werkt", "Prijzen", "Beveiliging", "Roadmap", "Status"] },
        { h: "Bedrijf", items: ["Over", "Contact", "Gemaakt door {studio}", "KVK · {kvk}", "BTW · {btw}"] },
        { h: "Juridisch", items: ["Privacy & cookies (AVG/GDPR)", "Voorwaarden", "Verwerkersovereenkomst (DPA)", "Disclaimer"] },
      ],
      taxTitle: "Belasting-disclaimer.",
      tax: "{brand} ({descriptor}) is een softwaretool die helpt bij het voorbereiden van je Nederlandse BTW-aangifte. Het is geen belastingadviseur, accountant of administratiekantoor en geeft geen fiscaal, juridisch of financieel advies. Jij blijft zelf verantwoordelijk voor de juistheid en tijdige indiening van je aangifte bij de Belastingdienst. Controleer cijfers altijd vóór het indienen; raadpleeg een professional voor jouw specifieke situatie.",
      dataTitle: "Data.",
      data: "We verwerken je gegevens onder de AVG/GDPR. Data staat op EU-servers, geïsoleerd per account, en wordt nooit verkocht of gedeeld met adverteerders. Zie ons privacybeleid en de verwerkersovereenkomst.",
      fine: "© {year} {studio} · {city} · Dit is een preview-prototype en nog niet beschikbaar voor productiegebruik. “Belastingdienst” wordt alleen ter identificatie genoemd; {brand} is niet verbonden aan of goedgekeurd door de Belastingdienst.",
    },
  },

  /* ================================================================== EN */
  en: {
    meta: {
      title: "{brand} — Your VAT return? Done.",
      description:
        "Drop your invoices in. AI classifies, calculates and pre-fills your Dutch BTW aangifte. You review and file it yourself with the Belastingdienst — in ten minutes.",
    },
    badge: "Preview · not yet live",
    previewTooltip: "Preview — not yet live",
    nav: { how: "How it works", proof: "The engine", pricing: "Pricing", faq: "FAQ", cta: "Try it free" },
    hero: {
      eyebrow: "BTW filing for Dutch freelancers",
      h1a: "Your VAT return?",
      h1b: "Done.",
      sub: "Drop your invoices in. We classify, calculate and pre-fill your aangifte. You review and file — in ten minutes.",
      ctaPrimary: "Try one quarter free",
      ctaNote: "no card required",
      ctaGhost: "See how it works",
      mockLabel: "Q1 2026 · result",
      mockResultLabel: "5g · to pay",
      mockRows: [
        ["1a · omzet", "€46,20"],
        ["4a · verleggingsregeling", "€25,66"],
        ["5g · to pay", "+€24,15"],
      ],
    },
    pain: {
      eyebrow: "The problem",
      h: "Three bad options. One gap.",
      intro: "No accounting course. No €600 accountant. No deadline-night panic.",
      cards: [
        { t: "The accountant", d: "± €600 a year to fill in four forms. Fine — until you realise you still do all the prep work yourself." },
        { t: "Bookkeeping software", d: "Built for your entire administration. You wanted to file one aangifte, not learn accounting in a dashboard with forty tabs." },
        { t: "The spreadsheet", d: "Free and familiar — until a foreign invoice or the verleggingsregeling shows up. One wrong cell and your rubriek is off." },
      ],
      gap: "Something is missing between those three: one tool that does exactly one job perfectly. Your BTW aangifte. {brand}.",
    },
    how: {
      eyebrow: "How it works",
      h: "From shoebox to aangifte in four steps.",
      steps: [
        { t: "Upload", d: "Drop in the quarter's invoices. PDF, photo, email — mixed is fine." },
        { t: "AI classifies", d: "Every invoice lands in the correct rubriek. Reverse charge, currency and foreign invoices: handled correctly, automatically." },
        { t: "Review", d: "You see, in plain language, why each invoice was classified that way. Doubtful cases get flagged, not guessed." },
        { t: "File", d: "A 7-step simulator mirrors the official form. You copy the values into the Belastingdienst portal and file it yourself." },
      ],
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
          "Services from outside the EU: the BTW is reverse-charged to you. You declare 21% in rubriek 4a and deduct the same amount as input VAT in 5b. Net effect €0 — but the Belastingdienst does want to see it.",
      },
    },
    compare: {
      eyebrow: "Honest comparison",
      h: "Where we win — and where we don't.",
      cols: ["", "{brand}", "Accountant", "MoneyBird", "Spreadsheet"],
      rows: [
        ["Scope", "Only your BTW aangifte", "Everything — at a price", "Full bookkeeping", "Whatever you build"],
        ["Price per year", "€0 – €69", "± €600", "± €180", "€0"],
        ["Learning curve", "Ten minutes", "None — you hand it over", "Evenings of setup", "Steep and risky"],
        ["AI-native", "Yes — explained per invoice", "No", "Partly, bolted on", "No"],
      ],
      note: "Complex situation — acquisitions, international structures, corrections? Then an accountant is the right answer. We'd tell you the same.",
    },
    pricing: {
      eyebrow: "Pricing",
      h: "Start free. Stay for the calm.",
      sub: "The free plan files one real quarter — not a demo, your actual aangifte.",
      perMonth: "/month",
      perYearPrefix: "or",
      perYearSuffix: "per year",
      freeLabel: "Free",
      popular: "Popular",
      tiers: {
        free: {
          name: "Free", tagline: "One real quarter",
          features: ["1 quarter fully prepared", "AI classification with explanations", "7-step simulator", "Copy-paste into the portal"],
          cta: "Try your quarter",
        },
        pro: {
          name: "Pro", tagline: "Every quarter, zero stress",
          features: ["All quarters + year overview", "Unlimited invoices", "Reverse charge & currency", "Consistency checks & deadline reminders"],
          cta: "Choose Pro",
        },
        studio: {
          name: "Studio", tagline: "For multiple businesses",
          features: ["Everything in Pro", "Up to 3 businesses", "Priority support", "Export for your accountant"],
          cta: "Choose Studio",
        },
      },
    },
    faq: {
      eyebrow: "FAQ",
      h: "Five questions before you say yes.",
      items: [
        { q: "Is this an accountant?",
          a: "No — and that's the point. {brand} is a filing assistant, not an accountant or bookkeeping suite. It prepares your aangifte so you can file it yourself in minutes. For complex situations you'd still see a professional; for routine quarterly BTW, you won't need one." },
        { q: "How do I know the classification is correct?",
          a: "The AI explains every invoice in plain language — why it's a 4a reverse charge, why a US invoice gets self-assessed at 21%. Built-in consistency checks flag anything that doesn't add up, and you review every number before it goes anywhere. Nothing is hidden." },
        { q: "Does it submit to the Belastingdienst automatically?",
          a: "No. By design, it pre-fills and gives you copy buttons — you paste into the official portal and submit yourself. Automatic submission to a tax authority is a risk we won't take on your behalf. You stay in control of the final click." },
        { q: "Is my financial data safe?",
          a: "Your data is isolated to your account, encrypted in transit and at rest, and stored on EU infrastructure. One account belongs to one person and one business — no shared logins, no other user can ever see your invoices." },
        { q: "What if my invoices are messy — foreign, mixed VAT, refunds?",
          a: "That's exactly what it's built for. EU and non-EU vendors, currency conversion, reverse charge, foreign VAT and credit notes are all handled. Edge cases get flagged for your review rather than silently guessed." },
      ],
    },
    final: {
      h: "Next quarter: ten minutes.",
      sub: "Try one real quarter free. No card, no subscription — just your aangifte, done.",
      cta: "Try one quarter free",
    },
    footer: {
      tagline: "{brand} — your BTW helper",
      cols: [
        { h: "Product", items: ["How it works", "Pricing", "Security", "Roadmap", "Status"] },
        { h: "Company", items: ["About", "Contact", "Built by {studio}", "KVK · {kvk}", "BTW · {btw}"] },
        { h: "Legal", items: ["Privacy & cookies (AVG/GDPR)", "Terms of service", "Data processing (DPA)", "Disclaimer"] },
      ],
      taxTitle: "Tax disclaimer.",
      tax: "{brand} ({descriptor}) is a software tool that helps prepare your Dutch VAT return. It is not a tax advisor, accountant, or administrative office, and it does not provide tax, legal, or financial advice. You remain solely responsible for the accuracy and timely submission of your aangifte to the Belastingdienst. Always verify figures before filing; consult a qualified professional for your specific situation.",
      dataTitle: "Data.",
      data: "We process your data under the GDPR/AVG. Data is stored on EU servers, isolated per account, and never sold or shared with advertisers. See our Privacy Policy and Data Processing Agreement.",
      fine: "© {year} {studio} · {city} · This is a preview prototype and is not yet available for production use. “Belastingdienst” is referenced for identification only; {brand} is not affiliated with or endorsed by the Dutch Tax Administration.",
    },
  },

  /* ================================================================== ES */
  es: {
    meta: {
      title: "{brand} — ¿Tu declaración de IVA? Lista.",
      description:
        "Arrastra tus facturas. La IA clasifica, calcula y rellena tu aangifte de BTW. Tú revisas y la presentas ante la Belastingdienst — en diez minutos.",
    },
    badge: "Preview · aún no activo",
    previewTooltip: "Preview — aún no activo",
    nav: { how: "Cómo funciona", proof: "El motor", pricing: "Precios", faq: "FAQ", cta: "Pruébalo gratis" },
    hero: {
      eyebrow: "BTW para autónomos en Países Bajos",
      h1a: "¿Tu declaración de IVA?",
      h1b: "Lista.",
      sub: "Arrastra tus facturas. Nosotros clasificamos, calculamos y rellenamos tu aangifte. Tú revisas y presentas — en diez minutos.",
      ctaPrimary: "Prueba un trimestre gratis",
      ctaNote: "sin tarjeta",
      ctaGhost: "Mira cómo funciona",
      mockLabel: "Q1 2026 · resultado",
      mockResultLabel: "5g · a pagar",
      mockRows: [
        ["1a · omzet", "€46,20"],
        ["4a · verleggingsregeling", "€25,66"],
        ["5g · a pagar", "+€24,15"],
      ],
    },
    pain: {
      eyebrow: "El problema",
      h: "Tres malas opciones. Un hueco.",
      intro: "Sin curso de contabilidad. Sin gestor de €600. Sin pánico el día del plazo.",
      cards: [
        { t: "El gestor", d: "± €600 al año por rellenar cuatro formularios. Bien — hasta que te das cuenta de que el trabajo previo lo sigues haciendo tú." },
        { t: "Software contable", d: "Hecho para toda tu administración. Tú querías presentar una aangifte, no aprender contabilidad en un panel con cuarenta pestañas." },
        { t: "La hoja de cálculo", d: "Gratis y familiar — hasta que aparece una factura extranjera o la verleggingsregeling. Una celda mal y tu rubriek no cuadra." },
      ],
      gap: "Entre esas tres falta algo: una herramienta que hace exactamente una tarea, perfecta. Tu aangifte de BTW. {brand}.",
    },
    how: {
      eyebrow: "Cómo funciona",
      h: "De caja de zapatos a aangifte en cuatro pasos.",
      steps: [
        { t: "Sube", d: "Arrastra las facturas del trimestre. PDF, foto, email — mezcladas, da igual." },
        { t: "La IA clasifica", d: "Cada factura cae en la rubriek correcta. Inversión del sujeto pasivo (verleggingsregeling), divisas y facturas extranjeras: resueltas en automático." },
        { t: "Revisa", d: "Ves, en lenguaje claro, por qué cada factura se clasificó así. Los casos dudosos se marcan, no se adivinan." },
        { t: "Presenta", d: "Un simulador de 7 pasos replica el formulario oficial. Tú copias los valores al portal de la Belastingdienst y presentas tú mismo." },
      ],
    },
    proof: {
      eyebrow: "El motor",
      h: "Sin datos de demo. Esto es una factura real.",
      sub: "De la prueba real del Q1 2026: una factura de EE. UU., con inversión del sujeto pasivo y conversión automática.",
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
          "Servicios de fuera de la UE: el BTW se invierte hacia ti. Declaras el 21% en la rubriek 4a y deduces el mismo importe como IVA soportado en 5b. Efecto neto €0 — pero la Belastingdienst sí quiere verlo declarado.",
      },
    },
    compare: {
      eyebrow: "Comparación honesta",
      h: "Dónde ganamos — y dónde no.",
      cols: ["", "{brand}", "Gestor", "MoneyBird", "Hoja de cálculo"],
      rows: [
        ["Alcance", "Solo tu aangifte de BTW", "Todo — a un precio", "Contabilidad completa", "Lo que tú construyas"],
        ["Precio al año", "€0 – €69", "± €600", "± €180", "€0"],
        ["Curva de aprendizaje", "Diez minutos", "Ninguna — lo delegas", "Tardes enteras", "Empinada y arriesgada"],
        ["IA nativa", "Sí — explicación por factura", "No", "En parte, añadida", "No"],
      ],
      note: "¿Situación compleja — adquisiciones, estructuras internacionales, correcciones? Entonces un gestor es la respuesta correcta. Nosotros te diríamos lo mismo.",
    },
    pricing: {
      eyebrow: "Precios",
      h: "Empieza gratis. Quédate por la calma.",
      sub: "El plan gratis presenta un trimestre real — no una demo, tu aangifte de verdad.",
      perMonth: "/mes",
      perYearPrefix: "o",
      perYearSuffix: "al año",
      freeLabel: "Gratis",
      popular: "Popular",
      tiers: {
        free: {
          name: "Gratis", tagline: "Un trimestre real",
          features: ["1 trimestre preparado al completo", "Clasificación IA con explicaciones", "Simulador de 7 pasos", "Copiar y pegar al portal"],
          cta: "Prueba tu trimestre",
        },
        pro: {
          name: "Pro", tagline: "Cada trimestre, sin estrés",
          features: ["Todos los trimestres + resumen anual", "Facturas ilimitadas", "Verleggingsregeling y divisas", "Controles de consistencia y recordatorios"],
          cta: "Elige Pro",
        },
        studio: {
          name: "Studio", tagline: "Para varios negocios",
          features: ["Todo lo de Pro", "Hasta 3 negocios", "Soporte prioritario", "Exportación para tu gestor"],
          cta: "Elige Studio",
        },
      },
    },
    faq: {
      eyebrow: "FAQ",
      h: "Cinco preguntas antes de decir que sí.",
      items: [
        { q: "¿Esto es un gestor?",
          a: "No — y esa es la idea. {brand} es un asistente de presentación, no un gestor ni un paquete contable. Prepara tu aangifte para que la presentes tú mismo en minutos. Para situaciones complejas sigue siendo sensato ver a un profesional; para el BTW trimestral de rutina, ya no lo necesitas." },
        { q: "¿Cómo sé que la clasificación es correcta?",
          a: "La IA explica cada factura en lenguaje claro — por qué algo es 4a verleggingsregeling, por qué una factura de EE. UU. se autoliquida al 21%. Controles de consistencia integrados marcan todo lo que no cuadra, y tú revisas cada número antes de que vaya a ninguna parte. Nada queda oculto." },
        { q: "¿Presenta automáticamente ante la Belastingdienst?",
          a: "No. Por diseño. Rellena y te da botones de copiar — tú pegas en el portal oficial y presentas tú mismo. Enviar automáticamente a una autoridad fiscal es un riesgo que no asumimos en tu nombre. El último clic es tuyo." },
        { q: "¿Mis datos financieros están seguros?",
          a: "Tus datos están aislados por cuenta, cifrados en tránsito y en reposo, y almacenados en infraestructura de la UE. Una cuenta pertenece a una persona y un negocio — sin logins compartidos; nadie más puede ver tus facturas." },
        { q: "¿Y si mis facturas son un caos — extranjeras, IVA mixto, abonos?",
          a: "Para eso está hecho, exactamente. Proveedores de la UE y de fuera, conversión de divisas, verleggingsregeling, IVA extranjero y notas de crédito: todo se gestiona. Los casos límite se marcan para tu revisión en lugar de adivinarse en silencio." },
      ],
    },
    final: {
      h: "El próximo trimestre: diez minutos.",
      sub: "Prueba un trimestre real gratis. Sin tarjeta, sin suscripción — solo tu aangifte, lista.",
      cta: "Prueba un trimestre gratis",
    },
    footer: {
      tagline: "{brand} — your BTW helper",
      cols: [
        { h: "Producto", items: ["Cómo funciona", "Precios", "Seguridad", "Roadmap", "Estado"] },
        { h: "Empresa", items: ["Sobre nosotros", "Contacto", "Creado por {studio}", "KVK · {kvk}", "BTW · {btw}"] },
        { h: "Legal", items: ["Privacidad y cookies (AVG/GDPR)", "Términos de servicio", "Tratamiento de datos (DPA)", "Aviso legal"] },
      ],
      taxTitle: "Aviso fiscal.",
      tax: "{brand} ({descriptor}) es una herramienta de software que ayuda a preparar tu declaración de IVA neerlandesa (BTW). No es un asesor fiscal, contable ni gestoría, y no ofrece asesoramiento fiscal, legal o financiero. Tú sigues siendo el único responsable de la exactitud y la presentación a tiempo de tu aangifte ante la Belastingdienst. Verifica siempre las cifras antes de presentar; consulta a un profesional cualificado para tu situación concreta.",
      dataTitle: "Datos.",
      data: "Tratamos tus datos conforme al RGPD/AVG. Los datos se almacenan en servidores de la UE, aislados por cuenta, y nunca se venden ni se comparten con anunciantes. Consulta nuestra política de privacidad y el acuerdo de tratamiento de datos.",
      fine: "© {year} {studio} · {city} · Esto es un prototipo de vista previa y aún no está disponible para uso en producción. “Belastingdienst” se menciona solo a efectos de identificación; {brand} no está afiliado ni avalado por la administración tributaria neerlandesa.",
    },
  },
};
