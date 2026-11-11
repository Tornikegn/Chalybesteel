import { en, type UIKey } from "./en";

export const defaultLocale = "en";
export const locales = { en } as const;
export type Locale = keyof typeof locales;

/** Returns a translator for the given locale, falling back to English. */
export function useTranslations(locale: string = defaultLocale) {
  const dict: Record<UIKey, string> = locales[locale as Locale] ?? en;
  return (key: UIKey) => dict[key] ?? en[key];
}
