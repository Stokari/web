import { fireEvent, render, screen } from "@testing-library/react";
import React from "react";
import { describe, expect, it } from "vite-plus/test";
import { I18nProvider, translate, useTranslation } from "../index";
import { LanguageSelector } from "../LanguageSelector";

const TestConsumer: React.FC = () => {
  const { t, locale } = useTranslation();
  return (
    <div>
      <span data-testid="current-locale">{locale}</span>
      <h1 data-testid="catalog-title">{t("catalog.title")}</h1>
      <p data-testid="charge-label">{t("pos.charge")}</p>
      <LanguageSelector />
    </div>
  );
};

describe("i18n Bilingual Subsystem (VS-09-03 / Task #45)", () => {
  it("translates English and Amharic strings directly", () => {
    expect(translate("en", "catalog.title")).toBe("Product Catalog");
    expect(translate("am", "catalog.title")).toBe("የእቃዎች ዝርዝር");

    expect(translate("en", "pos.charge")).toBe("Charge");
    expect(translate("am", "pos.charge")).toBe("ክፈል");
  });

  it("falls back to English when a key is missing in Amharic", () => {
    expect(translate("am", "common.nonExistentKey")).toBe("common.nonExistentKey");
  });

  it("substitutes dynamic parameters in translated text", () => {
    const result = translate("en", "pos.insufficientStock");
    expect(result).toBe("Warning: Exceeds current stock");
  });

  it("renders with LanguageSelector and switches locale on click", () => {
    render(
      <I18nProvider initialLocale="en">
        <TestConsumer />
      </I18nProvider>,
    );

    expect(screen.getByTestId("current-locale").textContent).toBe("en");
    expect(screen.getByTestId("catalog-title").textContent).toBe("Product Catalog");

    const amharicBtn = screen.getByRole("button", { name: "አማ" });
    fireEvent.click(amharicBtn);

    expect(screen.getByTestId("current-locale").textContent).toBe("am");
    expect(screen.getByTestId("catalog-title").textContent).toBe("የእቃዎች ዝርዝር");
    expect(screen.getByTestId("charge-label").textContent).toBe("ክፈል");

    const englishBtn = screen.getByRole("button", { name: "EN" });
    fireEvent.click(englishBtn);

    expect(screen.getByTestId("current-locale").textContent).toBe("en");
    expect(screen.getByTestId("catalog-title").textContent).toBe("Product Catalog");
  });
});
