// Central content source for Fluoro Seals Die Casting Machinery

export const COMPANY = {
  name: "Fluoro Seals",
  fullName: "Fluoro Seals Die Casting Machinery",
  tagline: "Die casting machine servicing & spares up to 2700T",
  founded: 1998,
  location: "Bidadi, Karnataka, India",
  phone: "+91 98450 48359",
  email: "fluoro.2007@gmail.com",
  address:
    "121, Kenchanakuppe Village, Bidadi, Mysore-Bengaluru Main Road, Bengaluru, Karnataka 562109",
};

export const HERO_VIDEO =
  "https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260328_105406_16f4600d-7a92-4292-b96e-b19156c7830a.mp4";

// Authentic factory-floor photography supplied by the company.
const ASSETS = {
  boringMachine:
    "https://customer-assets-v7afamib.emergentagent.net/job_company-portal-256/artifacts/mnlde2qw_IMG_1101.webp",
  butlerComponent:
    "https://customer-assets-v7afamib.emergentagent.net/job_company-portal-256/artifacts/v4vst1d6_IMG_1154.webp",
  machinedSteel:
    "https://customer-assets-v7afamib.emergentagent.net/job_company-portal-256/artifacts/qhaigb3v_IMG_1155.webp",
  butlerFloor:
    "https://customer-assets-v7afamib.emergentagent.net/job_company-portal-256/artifacts/up19s0z1_IMG_1159.webp",
  hydraulic: "https://images.pexels.com/photos/36532643/pexels-photo-36532643.jpeg",
  // Rotated 90° CW copies (originals were sideways), stored in object storage.
  machinedSteelUpright: "/api/files/fluoro-seals/site-media/e395a521-5f15-4e81-bda8-40c61ecf0aaa.webp",
  boringMachineUpright: "/api/files/fluoro-seals/site-media/6d4ec1f5-6da2-43c9-a63b-0de64f4e0279.webp",
};

// Editable media slots — overridable from the admin panel at /admin.
export const DEFAULT_IMAGES = {
  heroVideo: HERO_VIDEO,
  heroBackdrop: ASSETS.butlerFloor,
  machineServicing: ASSETS.butlerFloor,
  spareManufacturing: ASSETS.machinedSteelUpright,
  importSubstitution: ASSETS.boringMachineUpright,
  capabilities: ASSETS.boringMachineUpright,
  story: ASSETS.butlerComponent,
  founder: ASSETS.butlerComponent,
  caseReconditioning: ASSETS.butlerFloor,
  caseAerospace: ASSETS.hydraulic,
  caseInjection: ASSETS.machinedSteel,
  caseDefence: ASSETS.butlerComponent,
};

export const IMAGE_FIELDS = [
  { key: "heroBackdrop", label: "Home hero backdrop", note: "Sits behind the hero video" },
  { key: "machineServicing", label: "Service card — Machine servicing" },
  { key: "spareManufacturing", label: "Service card — Spare manufacturing" },
  { key: "importSubstitution", label: "Service card — Import substitution" },
  { key: "capabilities", label: "Capabilities section" },
  { key: "story", label: "Our story section" },
  { key: "founder", label: "Founder portrait" },
  { key: "caseReconditioning", label: "Case study — 1350T reconditioning" },
  { key: "caseAerospace", label: "Case study — HAL hydroforming" },
  { key: "caseInjection", label: "Case study — C-Frame injection system" },
  { key: "caseDefence", label: "Case study — BDL launch pads" },
];

export const MEDIA_FIELDS = [
  {
    key: "heroVideo",
    label: "Home hero background video",
    note: "MP4 or WebM · up to 80MB · plays muted on loop",
    kind: "video",
  },
  ...IMAGE_FIELDS.map((f) => ({ ...f, kind: "image" })),
];

export const NAV_LINKS = [
  { label: "Home", to: "/" },
  { label: "Services", to: "/services" },
  { label: "Capabilities", to: "/capabilities" },
  { label: "Import Substitution", to: "/import-substitution" },
  { label: "Projects", to: "/projects" },
  { label: "About", to: "/about" },
  { label: "Contact", to: "/contact" },
];

export const HERO = {
  eyebrow: "ISO certified · Serving Indian manufacturing since 1998",
  headlineLead: "Servicing and spares for",
  headlineShine: "machines up to 2700T",
  subheadline:
    "When your die casting machine is down, every hour costs you production. We manufacture precision spares, recondition large-tonnage machines, and deliver Indian-made alternatives to imported parts — faster and at lower cost.",
  trustLine:
    "Trusted by TVS, Rane, Sundaram Clayton, and manufacturers across India.",
};

export const STATS = [
  { value: "600T–2700T", label: "Machine reconditioning range", icon: "gauge" },
  { value: "21 days", label: "Toggle mechanism turnaround", icon: "timer" },
  { value: "6–8 yrs", label: "Service life post-reconditioning", icon: "shield" },
  { value: "Since 1998", label: "Bidadi, Karnataka", icon: "factory" },
];

export const CLIENTS = [
  "TVS",
  "Sundaram Clayton (Padi, Oragadam, Hosur)",
  "Ashley Alteams",
  "DIMO",
  "Rane",
  "Sargam Diecastings",
  "SVI",
  "Jaya Hind",
  "Roots",
];

export const SERVICES = [
  {
    no: "01",
    title: "Machine servicing",
    tag: "Up to 2700T",
    imageKey: "machineServicing",
    summary:
      "Breakdown response and scheduled maintenance for die casting machines up to 2700T. We know large-tonnage machines — the tolerances, the failure modes, the parts that wear fastest.",
    points: [
      "Breakdown response and scheduled maintenance",
      "600T – 2700T large-tonnage experience",
      "Full toggle mechanism rebuilds in 21 days",
    ],
    icon: "wrench",
  },
  {
    no: "02",
    title: "Spare manufacturing",
    tag: "All die casting parts",
    imageKey: "spareManufacturing",
    summary:
      "Precision-machined spares for die casting machines, produced to your drawing or reverse-engineered from a worn part. Closing cylinders, injection systems, ejector cylinders, accumulators, manifolds — all made in-house.",
    points: [
      "Made to your drawing or reverse-engineered",
      "Closing cylinders, ejector cylinders, manifolds",
      "Tolerance records held for every job",
    ],
    icon: "cog",
  },
  {
    no: "03",
    title: "Import substitution",
    tag: "Local. Faster. Cheaper.",
    imageKey: "importSubstitution",
    to: "/import-substitution",
    summary:
      "We reverse-engineer and manufacture locally what you're currently importing — cutting 8–14 week lead times down to weeks, at 30–60% lower cost, with no quality compromise.",
    points: [
      "2–4 week delivery vs 10–14 weeks",
      "30–60% lower landed cost",
      "Bühler, Frech, HMT and other OEM parts",
    ],
    icon: "ship",
  },
];

export const CAPABILITIES = {
  eyebrow: "Capabilities",
  headline: "Heavy-capacity machining you can count on",
  subheadline:
    "Our plano milling machine handles parts the size of a small truck. Most job shops can't say that.",
  body: [
    "Most precision workshops cap out at small-format work. We invested in plant that lets us handle the jobs others can't — components that are large, heavy, complex, or all three.",
    "Whether it's a machine bed, a large platen, a press tool base, or a structural component — if it's a mechanical part, we can make it. Our capacity isn't a footnote. It's the reason plant engineers call us first when they have something nobody else can handle.",
  ],
  specs: [
    { label: "Plano milling (L×W×H)", value: "3100 × 2000 × 6000 mm" },
    { label: "Max die casting tonnage", value: "2700T" },
    { label: "Spare manufacturing", value: "Any mechanical spare" },
    { label: "Import substitution", value: "Yes, reverse engineering" },
  ],
};

export const STORY = {
  eyebrow: "Our story",
  headline: "Founded by an engineer who builds what others import",
  body: [
    "K.K. Nanjappa founded the company in 1998, starting with hydraulic cylinders, power packs, accumulators, and hydraulic seals — all designed from day one as import substitutes.",
    "As demand grew, the company expanded into manufacturing spares for Aluminium Pressure Die Casting machines from Indian and international brands, then into full machine reconditioning. Today we recondition machines up to 2700 tons, entirely within our own facility.",
  ],
  specs: [
    { label: "Founded", value: "1998" },
    { label: "Location", value: "Bidadi, Karnataka" },
    { label: "Certification", value: "ISO certified" },
    { label: "Reconditioning range", value: "600T – 2700T" },
  ],
};

export const CASES = [
  {
    no: "01",
    kicker: "Reconditioning · Industry first",
    title: "Complete toggle mechanism reconditioning on a 1350T machine — in 21 days",
    description:
      "Full toggle mechanism rebuild on a 1350 ton capacity machine, completed in 21 days. To our knowledge, we're the only company in India capable of this turnaround at this quality level.",
    result: "21-day turnaround · Unmatched in India",
    imageKey: "caseReconditioning",
  },
  {
    no: "02",
    kicker: "Aerospace · HAL",
    title: "Rectified a hydroforming machine for HAL's Aerospace Division",
    description:
      "Upgraded and rectified hydraulic cylinders for Hindustan Aeronautics Limited's Aerospace Division hydroforming machine, bringing them up to reliable performance at 800 Bar pressure.",
    result: "Rated to 800 Bar · Aerospace-grade precision",
    imageKey: "caseAerospace",
  },
  {
    no: "03",
    kicker: "Import substitution",
    title: "Developed a C-Frame injection system for HMT/Bühler machines",
    description:
      "Designed and built a C-Frame injection system for HMT and Bühler machines at 660T and 400T capacity — an in-house engineering development, not a copy of an imported part.",
    result: "Built for 660T and 400T machines",
    imageKey: "caseInjection",
  },
  {
    no: "04",
    kicker: "Defence · BDL Hyderabad",
    title: "Manufactured missile launch pad components for BDL, Hyderabad",
    description:
      "Beyond die casting, our precision machining capability has been trusted for defence sector work — manufacturing missile launch pad components for Bharat Dynamics Limited.",
    result: "Defence-grade quality standard",
    imageKey: "caseDefence",
  },
];

export const IMPORT_SUB = {
  eyebrow: "Import substitution",
  headline: "Stop waiting 10 weeks for imported spares",
  subheadline:
    "We reverse-engineer and manufacture die casting machine spares locally — the same quality as the OEM part, delivered in a fraction of the time, at 30–60% lower cost. No import dependency.",
  problem: {
    eyebrow: "The problem",
    headline: "Imported spares are slowing your plant down",
    subheadline:
      "If your machines are from European, Japanese, or Chinese OEMs, you already know this pain.",
    points: [
      {
        title: "8–14 week lead times",
        text: "OEM spare orders routinely take months. Your machine sits idle while you wait for a part to clear customs.",
      },
      {
        title: "High import costs",
        text: "Import duty, freight, and OEM margins stack up. You're paying a premium on every spare, every time.",
      },
      {
        title: "Wrong parts, no recourse",
        text: "Part arrives and it's wrong — now you wait again. No local support, no fast fix, just another order cycle.",
      },
    ],
  },
  process: {
    eyebrow: "How it works",
    headline: "From worn part to running machine — in weeks",
    steps: [
      {
        no: "01",
        title: "Send us the part or the drawing",
        text: "Ship us the worn part or share the OEM drawing. If you don't have either, send us the machine make, model, and part name — we often already have reference data.",
      },
      {
        no: "02",
        title: "We reverse-engineer and quote",
        text: "Our engineers measure, model, and identify material spec. We send you a detailed quote with timeline before any work begins — no surprises.",
      },
      {
        no: "03",
        title: "We machine the part",
        text: "Using our precision CNC and plano milling capacity, we machine your part to spec. We hold tolerance records for every job so you have traceability.",
      },
      {
        no: "04",
        title: "Delivery and fitment support",
        text: "We deliver the finished part, and if needed our team can support installation on-site. If the first part fits and performs, we keep the tooling so future orders are even faster.",
      },
    ],
  },
  parts: {
    eyebrow: "Parts we substitute",
    headline: "If it's a die casting machine spare, we can make it",
    subheadline:
      "These are commonly requested. If your part isn't listed, ask — our general machining capacity means we can tackle almost any mechanical component.",
    list: [
      "Closing cylinders",
      "Injection system components",
      "Ejector cylinders",
      "Accumulators",
      "Hydraulic manifolds",
      "Die casting platens",
      "Toggle mechanism assemblies",
      "Hydraulic power packs",
      "Custom — send us your part",
      "Any other mechanical spare",
    ],
  },
  why: {
    eyebrow: "Why us",
    headline: "What makes us different from a standard job shop",
    points: [
      {
        title: "We know die casting machines",
        text: "We service these machines ourselves. That means we understand the function of every part, not just the dimensions — which matters when reverse-engineering something that has to perform under high pressure and heat.",
      },
      {
        title: "Capacity for large parts",
        text: "Our plano milling machine handles 3100×2000×6000mm. Platens, machine beds, large structural components — we're one of the few shops that can handle large die casting machine parts without sending them out.",
      },
      {
        title: "Faster than you expect",
        text: "Because we machine in-house and don't rely on sub-contractors, our lead times are short. Most import substitute parts are delivered in 2–4 weeks vs. the 10–14 weeks for OEM imports.",
      },
      {
        title: "We keep your tooling on record",
        text: "Once we've made a part for you, we hold the engineering record. Your next order skips the reverse-engineering step — quote to delivery in half the time.",
      },
    ],
  },
  cta: {
    headline: "Ready to cut your import dependency?",
    subheadline:
      "Send us the part drawing, a worn sample, or just the machine model and part name. We'll quote within 24 hours.",
  },
};

export const RFQ = {
  headline: "Send us your requirement",
  subheadline:
    "Have a drawing, a worn part, or a machine down? Tell us what you need and we'll come back to you within 24 hours.",
};

export const STRIP_CTA = {
  headline: "Tired of waiting 10 weeks for an imported spare?",
  body: "If your machine uses parts from Bühler, Frech, HMT, or any other OEM — we can make them locally. Same specs. Faster delivery. A fraction of the import cost.",
};

// Manufacturing / inspection / handling facilities from the portfolio
export const FACILITIES = {
  manufacturing: [
    { detail: "Lathe (H-22)", make: "HMT", qty: 1 },
    { detail: "Lathe (Enterprise 400)", make: "Kirloskar", qty: 2 },
    { detail: "Lathe (Turn Master 35)", make: "—", qty: 1 },
    { detail: "Lathe (3.1 Meter)", make: "Sabari", qty: 1 },
    { detail: "Lathe (4 Meter)", make: "Mauser", qty: 1 },
    { detail: "Milling Machine (450 x 1400mm)", make: "Tos-Kurim", qty: 1 },
    { detail: "Milling Machine (450 x 1400mm)", make: "BFW", qty: 1 },
    { detail: "Radial Drilling (RM63 / RM61)", make: "HMT", qty: 2 },
    { detail: "Boring Machine, 3-Axis DRO (1400x1000mm)", make: "Scharmann", qty: 1 },
    { detail: "Floor Boring Machine, 3-Axis DRO", make: "WMW", qty: 1 },
    { detail: "Plano Milling (3100x2000x6000)", make: "Butler", qty: 1 },
    { detail: "Surface Grinding (150 x 450mm)", make: "Bhurj", qty: 1 },
    { detail: "Honing Machine (3 Meters)", make: "Fluoro Seals", qty: 1 },
    { detail: "Hydraulic Press (100 Tons)", make: "Fluoro Seals", qty: 1 },
  ],
  inspection: [
    { detail: "Vernier Calipers (0–600)", make: "Mitutoyo", qty: 11 },
    { detail: "External Micrometers (0–400)", make: "Forbes / Mitutoyo", qty: 16 },
    { detail: "Bore Gauges (18–325)", make: "Mitutoyo", qty: 8 },
    { detail: "Dial Gauges (0.01–10)", make: "Mitutoyo", qty: 8 },
    { detail: "2D Height Measuring (Optima Advantage 1000)", make: "—", qty: 1 },
    { detail: "Slip Gauge Set (1.005–100)", make: "USSR", qty: 1 },
    { detail: "Surface Tables (up to 2000 x 2000mm)", make: "MMT", qty: 2 },
    { detail: "Strain Measuring Instrument (0–1000 µε)", make: "IPA", qty: 1 },
  ],
  handling: [
    { detail: "EOT Crane", make: "10 Tons", qty: 2 },
    { detail: "EOT Crane", make: "20 Tons", qty: 1 },
    { detail: "Mobile Crane", make: "2 Tons", qty: 1 },
    { detail: "Hydraulic Pallet Roll", make: "2 Tons", qty: 1 },
    { detail: "Fork Lifter", make: "3 Tons", qty: 1 },
  ],
};

export const TIMELINE = [
  {
    year: "1998",
    title: "The foundation",
    text: "K.K. Nanjappa founds Fluoro Seals, producing hydraulic cylinders, power packs, accumulators and seals as import substitutes.",
  },
  {
    year: "2000s",
    title: "Into spares",
    text: "Expanded into manufacturing spares for Aluminium Pressure Die Casting machines across Indian and international brands.",
  },
  {
    year: "2010s",
    title: "Reconditioning leadership",
    text: "Ventured into full reconditioning of PDC machines — soon reconditioning capacities of up to 2700 Tons in-house.",
  },
  {
    year: "Today",
    title: "National authority",
    text: "Recognised as India's foremost authority in the reconditioning and manufacturing of Aluminium Pressure Die Casting machines.",
  },
];

export const FOUNDER = {
  name: "K.K. Nanjappa",
  role: "Founder & Managing Director",
  bio: [
    "An accomplished engineer, K.K. Nanjappa founded Fluoro Seals in 1998 with a singular vision — to build in India what the industry was importing. He started with hydraulic cylinders, power packs, accumulators and hydraulic seals, all designed as dependable import substitutes.",
    "Recognising the growing demand for higher quality in the market, he expanded the company into manufacturing spares for Aluminium Pressure Die Casting machines — for both Indian and international brands. That led naturally into the reconditioning of these machines, which today defines the company.",
    "Under his leadership, the company has successfully reconditioned machines with capacities of up to 2700 Tons, entirely within its own facilities in Bidadi, Karnataka.",
  ],
  quote:
    "A machine reconditioned right runs for eight years, not three. That difference is our entire philosophy.",
};
