/** UI strings for English (default locale). Add a sibling file per language. */
export const en = {
  skip: "Skip to main content",
  "nav.products": "Products",
  "nav.casing": "Casing",
  "nav.tubing": "Tubing",
  "nav.accessories": "Accessories",
  "nav.grades": "Grades & Standards",
  "nav.quality": "Quality & Inspection",
  "nav.logistics": "Logistics",
  "nav.about": "About",
  "nav.rfq": "Request a Quote",
  "nav.contact": "Contact",
  "nav.privacy": "Privacy Policy",
  "nav.terms": "Terms of Use",
  "nav.menu": "Menu",
  "nav.close": "Close menu",
  "nav.main": "Main navigation",
  "cta.quote": "Request a Quote",
  "cta.products": "View Products",
  "footer.company": "Company",
  "footer.legal": "Legal",
  "footer.contact": "Contact",
  "footer.trademark":
    "API and API 5CT are trademarks of the American Petroleum Institute. Chalybe Steel is a trading company and is not an API-licensed manufacturer.",
  "spec.indicative":
    "Indicative. Final specification per purchase order and the current edition of API 5CT.",
  "spec.verify": "TODO: verify against current API 5CT edition",
} as const;

export type UIKey = keyof typeof en;
