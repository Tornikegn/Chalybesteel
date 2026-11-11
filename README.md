# chalybesteel.com

Corporate website for **Chalybe Steel** — API 5CT seamless casing and tubing (OCTG).

Astro 7 · Tailwind CSS 4 · TypeScript · static output · Cloudflare Pages (portable to Vercel/Netlify).

---

## 1. Local development

Requirements: Node.js 22 LTS or newer (`.nvmrc`), npm.

```bash
npm install
npm run dev          # http://localhost:4321
npm run build        # type-check (astro check) + static build to dist/
npm run preview      # serve dist/ locally
npm run lint         # ESLint
npm run format       # Prettier
npm run assets       # regenerate favicons, touch icons, OG image, web manifest
```

To test the RFQ function, security headers and redirects exactly as Cloudflare serves them:

```bash
npm run build
npx wrangler pages dev dist      # http://localhost:8788
```

Put runtime secrets for local testing in `.dev.vars` (git-ignored), e.g. `RESEND_API_KEY=...`.

## 2. Project structure

```
src/
  config/site.ts          company details, email, analytics hook  ← edit here
  config/nav.ts           navigation
  config/images.ts        optional photo slots
  content/products/*.md   product pages (casing, tubing, accessories)
  data/casing-sizes.json  casing size/weight table
  data/tubing-sizes.json  tubing size/weight table
  data/grades.json        API 5CT grade table
  i18n/                   UI strings (English default)
  components/             Header, Footer, SpecTable, RfqForm, SEO, …
  layouts/                BaseLayout, LegalLayout
  pages/                  routes
functions/api/rfq.ts      Cloudflare Pages Function: RFQ → email
public/
  _headers                security headers (CSP, HSTS, …) and caching
  _redirects              short-URL redirects
  brand/                  logo files (do not alter)
scripts/generate-assets.mjs
```

## 3. Editing content

- **Product pages** — `src/content/products/<name>.md`. Front matter holds the title, SEO text, key facts, connections and range lengths; the Markdown body holds the prose sections (each `##` heading appears in the "On this page" menu).
- **Spec tables** — `src/data/casing-sizes.json` and `tubing-sizes.json`. One object per size/weight; `grades` lists the typical grades offered and drives the grade filter. The schema is validated at build time (`src/content.config.ts`), so a typo fails the build instead of breaking the page.
- **Grades** — `src/data/grades.json`.
- **Verification markers** — numeric spec data shows a `†` "TODO: verify against current API 5CT edition" marker. When the data is verified, set `showVerificationFlags: false` in `src/config/site.ts`.
- **Placeholders** — `{{TODO: …}}` placeholders are listed in `TODO.md`.

## 4. Company details — `src/config/site.ts`

The site deliberately shows only the brand name and `sales@chalybesteel.com`. Optional fields are empty:

```ts
legalName: "",        // e.g. "Chalybe Steel Ltd"
address: [],          // e.g. ["Line 1", "City, Postcode", "Country"]
phone: "",
registrationNo: "",
```

Fill any field and it appears automatically wherever relevant: footer, contact block, privacy policy (as data controller), terms, and the Organization JSON-LD. Filling `legalName` also removes the GDPR placeholder on the legal pages.

## 5. Deploying to Cloudflare Pages

1. Push this folder to a GitHub or GitLab repository (private recommended).
2. Cloudflare dashboard → **Workers & Pages → Create → Pages → Connect to Git** → select the repo.
3. Build settings:
   - Framework preset: **Astro**
   - Build command: `npm run build`
   - Build output directory: `dist`
   - Environment variable: `NODE_VERSION` = `22`
4. Add the variables from section 7, then **Save and Deploy**.

The `functions/` folder is deployed automatically as Pages Functions (`/api/rfq`). `public/_headers` and `public/_redirects` are applied automatically.

**Direct upload (no Git):** `npm run build && npx wrangler pages deploy dist --project-name chalybesteel` (deploys `functions/` too).

**Vercel / Netlify:** the static `dist/` output works as-is. Port `functions/api/rfq.ts` to a Vercel/Netlify function, or set `PUBLIC_RFQ_ENDPOINT` to Web3Forms/Formspree, and translate `_headers` to `vercel.json` / `netlify.toml`.

## 6. Connecting chalybesteel.com

Easiest if the domain's DNS is on Cloudflare:

1. Cloudflare → **Add a site** → `chalybesteel.com` (Free plan) → change the nameservers at your registrar to the two Cloudflare nameservers shown. Wait for activation.
   - **Before switching nameservers**, make sure Cloudflare has copied all existing DNS records, especially **MX** and mail-related **TXT** records for `sales@chalybesteel.com`, so email is not interrupted.
2. Pages project → **Custom domains → Set up a custom domain** → `chalybesteel.com`. Cloudflare creates the DNS record and TLS certificate.
3. Add `www.chalybesteel.com` as a second custom domain, then create a redirect: **Rules → Redirect Rules → Create** → "Redirect from WWW to root" template (`https://www.chalybesteel.com/*` → `https://chalybesteel.com/${1}`, 301, preserve query string).
4. **SSL/TLS** → mode **Full (strict)**; **Edge Certificates** → enable **Always Use HTTPS**.
5. HSTS is sent by `_headers` (2 years, includeSubDomains). Only add `preload` and submit to hstspreload.org once you are certain every subdomain will always be served over HTTPS.

If you keep DNS elsewhere: add a `CNAME` for `www` → `<project>.pages.dev` and follow the apex-domain instructions shown in the Pages "Custom domains" screen (apex domains generally require Cloudflare DNS).

## 7. RFQ form — environment variables

The form posts `multipart/form-data` to `PUBLIC_RFQ_ENDPOINT` (default `/api/rfq`). It has client-side validation, a honeypot field, optional Cloudflare Turnstile, success/error states, and a pre-filled `mailto:` fallback if sending fails.

### Option A (default): Pages Function + Resend

1. Create an account at resend.com, add domain `chalybesteel.com`, and add the DNS records Resend gives you (SPF/DKIM on a subdomain such as `send.chalybesteel.com`). Create an API key.
2. Cloudflare → Turnstile → **Add widget** for `chalybesteel.com` (Managed mode). Copy the site key and secret key.
3. Pages project → **Settings → Variables and Secrets** (set for Production and Preview):

| Name                        | Type                 | Value                                              |
| --------------------------- | -------------------- | -------------------------------------------------- |
| `NODE_VERSION`              | Plaintext            | `22`                                               |
| `PUBLIC_TURNSTILE_SITE_KEY` | Plaintext            | Turnstile site key                                 |
| `TURNSTILE_SECRET_KEY`      | **Secret**           | Turnstile secret key                               |
| `RESEND_API_KEY`            | **Secret**           | Resend API key                                     |
| `RFQ_TO`                    | Plaintext (optional) | default `sales@chalybesteel.com`                   |
| `RFQ_FROM`                  | Plaintext (optional) | default `Chalybe Steel RFQ <rfq@chalybesteel.com>` |

`PUBLIC_*` variables are embedded at build time; redeploy after changing them. RFQ emails arrive with **Reply-To** set to the enquirer and the spec sheet attached (max 5 MB).

Recommended: Security → WAF → **Rate limiting rule** for `POST /api/rfq` (e.g. 5 requests per minute per IP).

### Option B: Web3Forms or Formspree (no function)

Set `PUBLIC_RFQ_ENDPOINT` to `https://api.web3forms.com/submit` (plus `PUBLIC_WEB3FORMS_ACCESS_KEY`) or `https://formspree.io/f/<id>`. Add that origin to `connect-src` and `form-action` in `public/_headers`. Check the provider's plan supports file attachments.

## 8. Email deliverability — sales@chalybesteel.com

Configure in DNS for the domain that hosts the sales@ mailbox (Google Workspace, Microsoft 365, etc.):

- **SPF** — one TXT record on `chalybesteel.com`, e.g. `v=spf1 include:_spf.google.com ~all` (use your provider's include; never publish two SPF records).
- **DKIM** — enable signing in your mail provider and publish the TXT/CNAME records it gives you. Resend publishes its own DKIM on its subdomain.
- **DMARC** — TXT on `_dmarc.chalybesteel.com`, start with `v=DMARC1; p=none; rua=mailto:sales@chalybesteel.com`, move to `p=quarantine` then `p=reject` once reports are clean.

Send a test RFQ after setup and check the message headers show `spf=pass`, `dkim=pass`, `dmarc=pass`.

## 9. SEO, analytics, accessibility

- Canonical URLs, Open Graph/Twitter cards (`public/og-image.png`), `sitemap-index.xml`, `robots.txt`, and JSON-LD (Organization with sales contactPoint; Product/OfferCatalog) are generated automatically.
- After launch, add the site to Google Search Console and Bing Webmaster Tools and submit `https://chalybesteel.com/sitemap-index.xml`.
- **Analytics** — none by default. To enable, set `site.analytics.cloudflareToken` (Cloudflare Web Analytics) or `site.analytics.plausibleDomain` (Plausible) in `src/config/site.ts`, and add the script origin to the CSP in `public/_headers`. Both are cookieless, so no cookie banner is needed; add one only if you introduce cookie-based tracking.
- QA at handover: Lighthouse 100/100/100/100 (home) and 99–100 on product and RFQ pages; no horizontal overflow at 375, 768 or 1440 px; no CSP violations.

## 10. Internationalisation

English is the default locale (`astro.config.mjs → i18n`). To add a language, e.g. German:

1. Add `"de"` to `i18n.locales` in `astro.config.mjs`.
2. Create `src/i18n/de.ts` mirroring `en.ts` and register it in `src/i18n/index.ts`.
3. Add translated pages under `src/pages/de/` and translated product files with `lang: de`.
4. Add `hreflang` links in `src/components/SEO.astro`.

## 11. Brand

Logo files in `public/brand/` (concept A "pipe end") are used unaltered; source files and alternate concepts are in `brand/`. Keep clear space of at least the bore-ring height on every side, and a minimum logo height of 28 px. Palette: graphite `#16191D`, near-black `#121417`, steel grey `#6B7480`, light steel `#9AA3AD`, paper `#F3F2EF`, forge orange `#D9622B` (CTAs only, with dark text: white on orange fails WCAG AA). Orange text on light backgrounds uses `#A9461A`.
