import { createContext, useContext } from "react";
import amTranslations from "./am.json";
import enTranslations from "./en.json";

export type SupportedLocale = "en" | "am";

export type TranslationTree = Record<string, unknown>;

export const dictionaries: Record<SupportedLocale, TranslationTree> = {
  en: enTranslations,
  am: amTranslations,
};

export interface I18nContextValue {
  locale: SupportedLocale;
  setLocale: (locale: SupportedLocale) => void;
  t: (key: string, params?: Record<string, string | number>) => string;
}

export const STORAGE_KEY = "stokari_locale";

export const I18nContext = createContext<I18nContextValue | null>(null);

function resolveKey(tree: TranslationTree, path: string): string | null {
  const parts = path.split(".");
  let current: unknown = tree;

  for (const part of parts) {
    if (typeof current !== "object" || current === null) {
      return null;
    }
    current = (current as Record<string, unknown>)[part];
  }

  return typeof current === "string" ? current : null;
}

export function translate(
  locale: SupportedLocale,
  key: string,
  params?: Record<string, string | number>,
): string {
  const currentDict = dictionaries[locale] ?? dictionaries.en;
  let text = resolveKey(currentDict, key);

  // Fallback to English if not found in target language
  if (text === null && locale !== "en") {
    text = resolveKey(dictionaries.en, key);
  }

  if (text === null) {
    return key;
  }

  if (params) {
    for (const [paramKey, paramValue] of Object.entries(params)) {
      text = text.replace(new RegExp(`\\{${paramKey}\\}`, "g"), String(paramValue));
    }
  }

  return text;
}

export function useTranslation(): I18nContextValue {
  const ctx = useContext(I18nContext);
  if (!ctx) {
    return {
      locale: "en",
      setLocale: () => {},
      t: (key: string, params?: Record<string, string | number>) => translate("en", key, params),
    };
  }
  return ctx;
}
