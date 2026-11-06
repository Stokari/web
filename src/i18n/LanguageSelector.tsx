import React from "react";
import { useTranslation } from "./index";

export const LanguageSelector: React.FC<{ className?: string }> = ({ className = "" }) => {
  const { locale, setLocale } = useTranslation();

  return (
    <div
      className={`language-selector-group ${className}`}
      role="group"
      aria-label="Language selector"
    >
      <button
        type="button"
        className={`lang-btn ${locale === "en" ? "active" : ""}`}
        onClick={() => setLocale("en")}
        aria-pressed={locale === "en"}
        style={{
          minHeight: "44px",
          minWidth: "44px",
          padding: "6px 12px",
          border: "1px solid var(--border)",
          borderRadius: "6px 0 0 6px",
          backgroundColor: locale === "en" ? "var(--accent-bg)" : "transparent",
          color: locale === "en" ? "var(--text-h)" : "var(--text)",
          fontWeight: locale === "en" ? 700 : 500,
          cursor: "pointer",
        }}
      >
        EN
      </button>
      <button
        type="button"
        className={`lang-btn ${locale === "am" ? "active" : ""}`}
        onClick={() => setLocale("am")}
        aria-pressed={locale === "am"}
        style={{
          minHeight: "44px",
          minWidth: "44px",
          padding: "6px 12px",
          border: "1px solid var(--border)",
          borderLeft: "none",
          borderRadius: "0 6px 6px 0",
          backgroundColor: locale === "am" ? "var(--accent-bg)" : "transparent",
          color: locale === "am" ? "var(--text-h)" : "var(--text)",
          fontWeight: locale === "am" ? 700 : 500,
          cursor: "pointer",
        }}
      >
        አማ
      </button>
    </div>
  );
};
