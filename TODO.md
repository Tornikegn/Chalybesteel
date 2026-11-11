# TODO — placeholders and data to verify before/after launch

Visible placeholders render on the site as `{{TODO: …}}` (orange dashed box) or as a `†` marker on numeric spec data. Remove each one when resolved.

## Visible `{{TODO}}` placeholders

| Where                                                                  | Placeholder                                                                             | Action                                                                                                                                                                                  |
| ---------------------------------------------------------------------- | --------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `/request-a-quote` — contact block (`src/pages/request-a-quote.astro`) | `{{TODO: confirm response time}}` next to "We respond to RFQs within one business day." | Confirm the commitment or change the sentence, then delete the `<Todo>` tag.                                                                                                            |
| `/privacy` (`src/pages/privacy.astro`)                                 | `{{TODO: add legal entity name and registered address as data controller…}}`            | **Required before collecting data at scale** (GDPR Art. 13 controller identification). Set `legalName` and `address` in `src/config/site.ts`; the placeholder disappears automatically. |
| `/privacy` — retention section                                         | `{{TODO: confirm retention periods}}`                                                   | Confirm "24 months for enquiries" or replace with your policy.                                                                                                                          |
| `/terms` (`src/pages/terms.astro`)                                     | `{{TODO: add legal entity name, registered address and governing law…}}`                | Set `legalName` in `src/config/site.ts` and add a governing-law clause.                                                                                                                 |

## Spec data marked "TODO: verify against current API 5CT edition" (`†`)

All values were compiled from general API 5CT references and must be checked against the edition you trade to. When verified, set `showVerificationFlags: false` in `src/config/site.ts` to remove every `†` marker and legend at once.

- [ ] `src/data/grades.json` — min/max yield, min tensile (ksi and MPa), colour-band identification, typical use for all 15 grade rows.
- [ ] `src/data/casing-sizes.json` — OD (in/mm), nominal weights, wall thickness, ID, and **typical grade availability per size/weight** (grade lists are indicative and the most likely to need adjustment for your mills).
- [ ] `src/data/tubing-sizes.json` — OD, NUE/EUE weights, wall, ID, typical grades.
- [ ] `src/content/products/casing.md` and `tubing.md` — range lengths R1/R2/R3 (ft and m).
- [ ] `src/content/products/accessories.md` — typical pup joint lengths (2–12 ft).

## Statements to confirm (no placeholder shown)

These describe how the business operates. Confirm they are accurate or edit the copy:

- [ ] Quality page: "Orders are placed only with mills that hold a current API 5CT licence…" and the mill review process.
- [ ] Quality page / home: EN 10204 3.1 certificates on every shipment; 3.2 with independent inspection.
- [ ] Logistics page: Incoterms offered (FOB, CFR, CIF, DAP) and that cargo insurance is arranged by you under CIF.
- [ ] Applications: sour service and HPHT offered "on request".

## Configuration before go-live

- [ ] Create Resend account, verify `chalybesteel.com` as a sending domain, set `RESEND_API_KEY` (see README).
- [ ] Create a Turnstile widget for `chalybesteel.com`; set `PUBLIC_TURNSTILE_SITE_KEY` and `TURNSTILE_SECRET_KEY`.
- [ ] Send a test RFQ in production, with and without an attachment; confirm delivery to sales@ and Reply-To.
- [ ] Configure SPF, DKIM and DMARC for the sales@ mailbox and the Resend sending domain.
- [ ] Optional: add a Cloudflare rate-limiting rule for `POST /api/rfq`.
- [ ] Optional: enable analytics (`site.analytics` in `src/config/site.ts`) and add its origin to the CSP in `public/_headers`.

## Optional content to add later

- [ ] Photos for the slots in `src/config/images.ts` (see CREDITS.md). No mill brands or logos visible.
- [ ] `legalName`, `address`, `phone`, `registrationNo` in `src/config/site.ts` — each renders automatically (footer, contact block, legal pages, JSON-LD) once filled.
- [ ] Additional languages (see README → Internationalisation).
