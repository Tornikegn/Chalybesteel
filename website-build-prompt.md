# Claude Code prompt — chalybesteel.com website

Paste everything below the line into Claude Code. Before running it, unzip `chalybe-steel-logos.zip` into the project folder as `brand/`.

---

# Project: chalybesteel.com — corporate website for an API 5CT OCTG trading company

## Context

We are **Chalybe Steel** (brand name; replace if the final name differs), an international trading and sourcing company supplying **API 5CT seamless casing and tubing (OCTG)** from qualified international manufacturers to oil & gas operators, drilling contractors and distributors. We are a trader, not a mill. We own the domain chalybesteel.com. Sales contact: **sales@chalybesteel.com**.

**Company details policy:** do not show a physical address, legal entity name or registration details anywhere on the site, and do not add placeholders for them. Use only the brand name "Chalybe Steel". The only public contact channel is sales@chalybesteel.com. Put company details in a single `src/config/site.ts` file with optional fields (`legalName`, `address`, `phone`, `registrationNo`) left empty; components must render these only when a field is filled, so we can add them later with a one-line change.

Audience: procurement managers, drilling/completions engineers and supply-chain teams at E&P companies and distributors. They want a clear product range, specs, quality assurance and a fast way to send an RFQ. This is B2B: credibility and clarity over flash.

## Tech stack

- Astro (latest) + Tailwind CSS + TypeScript, static output. Minimal JS: islands only where needed (mobile nav, RFQ form, spec-table filters).
- Product and spec data in content collections (Markdown/JSON) so we can edit content without touching components.
- Deploy target: Cloudflare Pages (keep it portable to Vercel/Netlify). Include a `_headers` file with security headers (CSP, HSTS, X-Content-Type-Options, Referrer-Policy).
- Node LTS, npm, ESLint + Prettier.

## Brand & design direction

- Tone: established, precise, engineering-led — like a tier-one steel/OCTG supplier, not a startup.
- **Logo (provided — do not redraw or alter):** files are in `brand/`. Use concept A, "pipe end":
  - `brand/chalybe-pipe-logo.svg` — header/footer on light backgrounds
  - `brand/chalybe-pipe-logo-dark.svg` — on dark backgrounds (dark header, hero, footer)
  - `brand/chalybe-pipe-mark.svg` / `brand/chalybe-pipe-mark-dark.svg` — symbol only (mobile header, social cards)
  - `brand/favicon.svg` — SVG favicon; also generate PNG favicons and touch icons (32, 180, 192, 512 px) and the web manifest from it.
  - Copy the files you use into `public/brand/`; keep the logo's clear space at least the height of the orange bore ring on every side; minimum logo height 28px.
- Palette (from the logo): graphite #16191D, near-black #121417, steel grey #6B7480, light steel #9AA3AD, paper #F3F2EF, plus one accent — forge orange #D9622B — used sparingly for CTAs and highlights. WCAG AA contrast throughout (check orange-on-dark and white-on-orange combinations; use dark text on orange buttons if white fails).
- Typography: Archivo for headings (matches the logo wordmark), Archivo or Inter for body, IBM Plex Mono for spec labels (e.g. `API 5CT · PSL-2 · P110`), tabular numerals in spec tables. Self-host fonts.
- Visual motifs: thin technical lines, subtle grid, pipe cross-section / thread-profile geometry drawn as SVG, echoing the logo's ring. No cheesy stock photos (handshakes, globes).
- Imagery: the site must look finished with SVG illustrations alone. Add slots for photos in `/public/images` with descriptive filenames and alt text, and a CREDITS.md. Never use images showing identifiable mill brands or logos.
- Mobile-first and fully responsive; sticky header with a persistent "Request a Quote" button.

## Sitemap & content

1. **Home**
   - Hero: headline along the lines of "API 5CT Seamless Casing & Tubing, Sourced from Qualified Mills." Subline on sourcing, inspection and delivery to site. CTAs: Request a Quote / View Products.
   - Spec-style fact strip (no invented numbers): `API 5CT · PSL-1/2/3`, `Casing 4½"–20"`, `Tubing 1.050"–4½"`, `Third-party inspection`.
   - Product cards: Casing, Tubing, Accessories (pup joints, couplings, crossovers — on request).
   - "How we work": 1 Enquiry & spec review → 2 Mill selection & quotation → 3 Production & inspection → 4 Documentation & shipping → 5 Delivery.
   - Quality preview, applications (onshore, offshore, sour service grades, HPHT on request), RFQ call-to-action band.

2. **Products**
   - `/products/casing`: overview, OD range table, grades, connections (STC, LTC, BTC; premium/semi-premium connections per client specification — do not name proprietary connection brands), range lengths R1/R2/R3, end finish, coating, marking, PSL levels.
   - `/products/tubing`: same structure with NUE/EUE connections.
   - Data-driven spec tables from JSON: OD in inches and mm, common nominal weights / wall thickness, with filters by grade and OD. Note on each page: "Indicative. Final specification per purchase order and the current edition of API 5CT."

3. **Grades & Standards**
   - Table of API 5CT grade groups — Group 1: H40, J55, K55, N80-1, N80Q, R95; Group 2: M65, L80 (Type 1, 9Cr, 13Cr), C90, T95, C110; Group 3: P110; Group 4: Q125 — with min/max yield, min tensile, typical use and colour-band identification.
   - Related standards: ISO 11960, API 5B (threading), NACE MR0175 / ISO 15156 (sour service).
   - Mark every numeric value with `TODO: verify against current API 5CT edition`.

4. **Quality & Inspection**: mill qualification, mill test certificates (EN 10204 3.1 / 3.2), independent third-party inspection available on request (e.g. SGS, Bureau Veritas, TÜV — phrase as options, not partnerships), NDT (EMI, UT), drift and hydrostatic testing, traceability, packing and marking.

5. **Logistics**: Incoterms (FOB, CFR, CIF, DAP), containerised and break-bulk shipping, export documentation, delivery to project sites. Keep it generic.

6. **About**: company story. The name comes from the Chalybes, an ancient people of the southern Black Sea coast whom Greek writers credited with early ironworking; the Greek word for steel, _chalyps_, derives from their name. Mission and values. No leadership/team section for now, and no statement of where the company is incorporated or located.

7. **Request a Quote / Contact**
   - RFQ form fields: name, company, country, email, phone, product (casing / tubing / accessories), OD, weight or wall thickness, grade, connection, PSL, quantity (m / ft / tonnes), destination port or site, required delivery date, Incoterm, optional spec-sheet upload, message.
   - Client-side validation, honeypot + Cloudflare Turnstile.
   - Submission through an endpoint set by environment variable (Cloudflare Pages Function emailing sales@chalybesteel.com, or Web3Forms/Formspree). Clear success and error states. Fallback `mailto:sales@chalybesteel.com` link with a pre-filled subject.
   - Contact block: sales@chalybesteel.com only (plus a line such as "We respond to RFQs within one business day" marked TODO for confirmation). No address, map or phone.

8. **Legal & utility**: Privacy Policy and Terms of Use written in the name of "Chalybe Steel" with sales@chalybesteel.com as the contact for data requests; add a TODO noting the legal entity name and address must be added before collecting data at scale (GDPR controller identification). 404 page. Cookie banner only if analytics are added.

**Footer**: logo (dark variant if the footer is dark), email, navigation, products, legal links, "© {year} Chalybe Steel", and the line: "API and API 5CT are trademarks of the American Petroleum Institute. Chalybe Steel is a trading company and is not an API-licensed manufacturer." No address or legal entity name.

## Content rules (important)

- Do not invent facts: no made-up years in business, tonnages, client logos, testimonials, certifications, office locations or mill partnerships. Where such content would naturally appear, either leave it out or insert a visible placeholder `{{TODO: ...}}`, and list every placeholder in TODO.md. (Address and legal entity are intentionally omitted — do not add placeholders for them.)
- Do not use the API Monogram or any manufacturer's logo.
- Copy: confident, concise B2B English; short paragraphs; specific, technical language.
- Structure the site to be i18n-ready (English default) so more languages can be added later.

## SEO, performance, accessibility

- Unique titles and meta descriptions, OpenGraph/Twitter cards (build a 1200×630 OG image from the dark logo on #121417), canonical URLs on https://chalybesteel.com.
- sitemap.xml, robots.txt, JSON-LD: Organization with name "Chalybe Steel", url, logo (`/brand/chalybe-pipe-logo.svg` plus a 512px PNG) and contactPoint (email sales@chalybesteel.com, contactType "sales") — no address or legalName until they are set in site config; plus product catalogue.
- Lighthouse ≥ 95 in all categories; semantic HTML, keyboard navigation, alt text ("Chalybe Steel" for the logo), visible focus states, prefers-reduced-motion respected.
- Favicons and web manifest from `brand/favicon.svg`.
- No tracking by default; leave a simple hook for privacy-friendly analytics (Cloudflare Web Analytics or Plausible).

## Process

1. Briefly state the design direction (palette, fonts, homepage layout) and file structure, then proceed without waiting unless something is blocking.
2. Build in stages: design system & layout → Home → Products + data → remaining pages → RFQ form → SEO & legal → QA.
3. Run the build and fix all errors; check layouts at 375px, 768px and 1440px; run Lighthouse/axe if available.
4. Deliver: README.md (local dev, editing content, editing `src/config/site.ts`, deploying to Cloudflare Pages, connecting the chalybesteel.com DNS, setting form env vars, and a note to configure SPF/DKIM/DMARC for the sales@ mailbox) and TODO.md listing all placeholders and data to verify.
