import type { UIKey } from "@/i18n/en";

export interface NavItem {
  key: UIKey;
  href: string;
}

export const mainNav: NavItem[] = [
  { key: "nav.products", href: "/products" },
  { key: "nav.grades", href: "/grades-standards" },
  { key: "nav.quality", href: "/quality-inspection" },
  { key: "nav.logistics", href: "/logistics" },
  { key: "nav.about", href: "/about" },
];

export const productNav: NavItem[] = [
  { key: "nav.casing", href: "/products/casing" },
  { key: "nav.tubing", href: "/products/tubing" },
  { key: "nav.accessories", href: "/products/accessories" },
];

export const legalNav: NavItem[] = [
  { key: "nav.privacy", href: "/privacy" },
  { key: "nav.terms", href: "/terms" },
];
