# Fluoro Seals Die Casting Machinery — PRD

## Original problem statement
Build a company website for **Fluoro Seals Die Casting Machinery** (Bidadi, Karnataka; founded 1998),
using the owner's portfolio PDF and factory photos, in an **industrial blue-and-white theme**.
Owner inbox for enquiries: `Fluoro.2007@gmail.com`.

### Latest governing request (June 2026)
Redesign the whole site using a "DesignPro"-style hero spec — full-screen looping muted video
background, pill-shaped nav with gray-700 border, two-column intro copy under the nav, animated
shiny-gradient headline (framer-motion `ShinyText`), rounded-full CTAs with arrow icons — while
**keeping the existing industrial blue/white palette**. User-approved choices:
- Dark steel-navy hero overlay, white text, `#1d4ed8 → #64CEFB` shiny gradient headline
- CloudFront hero video now, factory-photo Ken-Burns backdrop layered beneath (swap video later)
- Copy adapted to Fluoro Seals (owner supplied full page copy verbatim)
- Apply the new style across **all pages**
- Add an **in-site admin page to edit site images** by pasting URLs

## Architecture
- React CRA (`/app/frontend`) + FastAPI (`/app/backend`) + MongoDB
- Fonts: Oswald (display) + IBM Plex Sans/Mono; Tailwind + shadcn primitives
- Motion: framer-motion, Lenis smooth scroll, react-fast-marquee
- Emails: Emergent-managed Resend (owner alert + customer auto-reply, best-effort)
- Auth: bcrypt + PyJWT single admin account (Bearer token, 12h), lockout after 5 failed logins / 15 min

## Implemented

### Phase 1 (earlier) — 2026
- 7-page industrial blueprint site, contact form with Mongo persistence
- Enquiry validation, public `GET /api/contact` removed (PII)
- Owner email alert + customer confirmation auto-reply (provider 202; inbox receipt not user-confirmed)

### Phase 2 — June 2026 (this session)
- **Hero redesign** (`components/home/Hero.jsx`): full-screen CloudFront video (autoplay/loop/muted/inline)
  over a Ken-Burns factory still, steel-navy grading, blueprint grid, two-column intro row,
  eyebrow + `ShinyText` headline "Servicing and spares for **machines up to 2700T**", rounded-full CTAs
- **ShinyText** (`components/site/ShinyText.jsx`): framer-motion gradient sweep, 3s, 100° spread,
  `backgroundClip: text` + transparent fill
- **Pill navigation**: circular logo (white 2px ring + inner dot), rounded pill with slate-700 border,
  text-sm white/80 links, arrow on last link, "Request a quote" CTA, hamburger < lg
- **All owner-supplied copy applied** across Home, Services, Capabilities, Import Substitution (new page),
  Projects (proof/case studies), About (our story + timeline), Founder, Contact (RFQ)
- Home sections: trust bar (4 stats), 3 service cards, import-substitution strip CTA, capabilities +
  spec table, story + spec table, clients grid + marquee, 4 case studies, RFQ section
- Shared `RfqForm` (name/company/email/phone/description) posting to `POST /api/contact`
- **Admin image manager** at `/admin`: JWT login, 11 editable image slots with live previews,
  reset-to-original per slot, save → `PUT /api/site-images`; public `GET /api/site-images` overrides
  defaults site-wide via `context/SiteImages.jsx`
- Dark `PageHeader` across inner pages so the nav stays legible everywhere

### Verification (iteration 2 report: `/app/test_reports/iteration_2.json`)
- Frontend: 100% of tested flows pass (all 8 pages, nav desktop + mobile, RFQ submit, admin end-to-end)
- Backend: 20/21 at report time; the one failure (brute-force lockout behind ingress) is **fixed and
  re-verified** (429 on the 6th attempt); `PUT /api/site-images` now merges per key; invalid key/URL → 400
- Hero video cannot decode in headless Chromium (H.264) — Ken-Burns still renders as designed

### Phase 3 — June 2026 (uploads)
- **Emergent Managed Object Storage** integration (`backend/storage.py`) with chunked uploads
  (`POST /api/uploads/chunk`, 4MB chunks from the browser) so phone photos and mp4 clips bypass
  proxy body limits; public serving via `GET /api/files/{path}` (records tracked in `db.files`,
  soft-delete only — storage has no delete API)
- Admin panel now has **12 media slots**: hero background **video** (upload mp4/webm ≤80MB or paste a
  direct link) + 11 image slots (upload ≤15MB or paste), each with preview, progress bar and
  reset-to-original. Everything is stored in MongoDB, so the owner can change site media at any time,
  including after deployment
- Running byte-budget + stale partial-upload cleanup on the chunk endpoint
- Verified: iteration 3 report — backend 35/35 pytest, frontend 100% of tested flows (upload → save →
  live on /founder and Home hero → reset)

### Phase 4 — June 2026 (GitHub re-import + brochure)
- Code re-imported from https://github.com/carlos11-draper/fluoro-web-page.git into a fresh env;
  backend/.env reconstructed (JWT, admin creds, EMERGENT_LLM_KEY for object storage).
  **EMERGENT_EMAIL_KEY is a placeholder** — enquiry emails fail gracefully (logged, form still
  saves to Mongo) until the real key is restored as a deployment secret.
- **Downloadable brochure (admin-editable)**: PDF slot in /admin (upload ≤25MB via existing
  chunked upload, PDF-only validation client+server, live filename, Open/Remove, saves instantly
  via `PUT /api/site-settings`); public `GET /api/site-settings`; settings stored in
  `site_config` key "settings" ({brochure_url, brochure_filename}); PDFs served with
  `Content-Disposition: inline` so they open in a new tab.
- Public "Download portfolio" buttons (auto-hide when unset): Home hero, RFQ section
  (Home + Contact), footer CTA band. Component: `components/site/BrochureButton.jsx`,
  provider: `context/SiteSettings.jsx`.
- **Brochure download counter**: public buttons beacon `POST /api/brochure/track-download`
  ($inc on settings doc); count returned in `GET /api/site-settings` and shown in the /admin
  brochure slot ("Downloaded N times from the site"). Admin's "Open current PDF" is NOT counted.
  Verified: pytest test_brochure.py 8/8 + UI screenshot; counter reset to 0 after tests.
- **WhatsApp floating button: explicitly dropped by owner** — do not build.
- Verified: pytest `tests/test_brochure.py` 7/7; full suite 41/42 (1 pre-existing xdist race in
  test_admin ↔ test_uploads shared site-images state, passes serially); frontend iteration_4
  report 100% (upload → buttons live → open new tab → remove → auto-hide).

### Phase 5 — June 2026 (image orientation fix)
- IMG_1155/IMG_1101 (spareManufacturing, importSubstitution, capabilities slots) were sideways;
  rotated 90° CW with PIL, uploaded to object storage, DB overrides + DEFAULT_IMAGES updated so
  "Reset to original" keeps the upright versions. Other slots using the same source assets
  (e.g. caseInjection) intentionally untouched — owner did not request them.

## Backlog
- **P0** — Restore real EMERGENT_EMAIL_KEY (deployment secret) so enquiry emails send again
- **P0** — Owner to confirm real inbox receipt of owner alert + customer auto-reply
- **P0** — Owner to upload the real portfolio PDF at /admin (brochure slot is live, empty)
- **P1** — Replace founder portrait with a real photo of K.K. Nanjappa (owner can now upload it at `/admin`)
- **P1** — Replace the stock Pexels hydraulic photo used for the HAL case study with a company photo
- **P1** — Swap the DesignPro CloudFront hero clip for a real factory video (owner can upload at `/admin`)
- **P2** — File upload (object storage) in the admin panel — DONE (Phase 3)
- **P2** — Protected admin enquiry inbox (never reintroduce public `GET /api/contact`)
- **P2** — Download-portfolio CTA — DONE (Phase 4); WhatsApp button dropped by owner
- **P2** — Move admin JWT from localStorage to httpOnly cookie; tighten CORS to explicit origins

## Do not retry
- No public `GET /api/contact` (PII)
- Do not fabricate a likeness of the named founder
- `email_service.py` / `auth.py` must `load_dotenv` before reading env keys
- Provider `202` ≠ confirmed inbox delivery
