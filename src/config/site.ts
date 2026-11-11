/**
 * Single source of truth for company details.
 *
 * Optional fields are intentionally left empty. Components render them only
 * when a value is set, so adding e.g. a phone number is a one-line change.
 */
export interface SiteConfig {
  name: string;
  url: string;
  email: string;
  description: string;
  /** Registered legal entity name. Shown in footer, legal pages and JSON-LD when set. */
  legalName?: string;
  /** Postal address, one line per array entry. */
  address?: string[];
  /** Phone in international format, e.g. "+44 20 0000 0000". */
  phone?: string;
  /** Company registration / VAT number. */
  registrationNo?: string;
  /** Show the "verify against current API 5CT edition" markers on numeric spec data. */
  showVerificationFlags: boolean;
  /**
   * Privacy-friendly analytics hook. Leave both empty for no tracking.
   * - cloudflareToken: Cloudflare Web Analytics beacon token
   * - plausibleDomain: domain registered in Plausible
   * If you enable one, add its script origin to the CSP in public/_headers.
   */
  analytics: {
    cloudflareToken?: string;
    plausibleDomain?: string;
  };
}

export const site: SiteConfig = {
  name: "Chalybe Steel",
  url: "https://chalybesteel.com",
  email: "sales@chalybesteel.com",
  description:
    "Chalybe Steel supplies API 5CT seamless casing and tubing (OCTG) from qualified international mills to oil & gas operators, drilling contractors and distributors.",
  legalName: "",
  address: [],
  phone: "",
  registrationNo: "",
  showVerificationFlags: true,
  analytics: {
    cloudflareToken: "",
    plausibleDomain: "",
  },
};

export const rfqMailto = `mailto:${site.email}?subject=${encodeURIComponent("RFQ – OCTG enquiry")}`;
