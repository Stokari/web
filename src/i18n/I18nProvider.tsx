import React, { useEffect, useState } from "react";
import { I18nContext, STORAGE_KEY, translate, type SupportedLocale } from "./i18n-context";

export const I18nProvider: React.FC<{
  children: React.ReactNode;
  initialLocale?: SupportedLocale;
}> = ({ children, initialLocale }) => {
  const [locale, setLocaleState] = useState<SupportedLocale>(() => {
    if (initialLocale) return initialLocale;
    if (typeof localStorage !== "undefined") {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored === "en" || stored === "am") return stored;
    }
    return "en";
  });

  const setLocale = (newLocale: SupportedLocale) => {
    setLocaleState(newLocale);
    if (typeof localStorage !== "undefined") {
      localStorage.setItem(STORAGE_KEY, newLocale);
    }
  };

  useEffect(() => {
    // Reflect language attribute on document root for accessibility & font fallback
    if (typeof document !== "undefined") {
      document.documentElement.lang = locale;
    }
  }, [locale]);

  const t = (key: string, params?: Record<string, string | number>): string => {
    return translate(locale, key, params);
  };

  return <I18nContext.Provider value={{ locale, setLocale, t }}>{children}</I18nContext.Provider>;
};
