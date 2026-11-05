import { useState, useId } from "react";
import "./CreateShopWizard.css";

export interface CreateShopInput {
  name: string;
  slug: string;
  currency: string;
  category: string;
}

export interface CreateShopWizardProps {
  onComplete: (input: CreateShopInput) => void;
  onCancel: () => void;
}

const STORE_TYPES = [
  { id: "retail", title: "General Retail", desc: "Everyday goods & sundries" },
  { id: "wholesale", title: "Wholesale Depot", desc: "Bulk packs & crates" },
  { id: "grocery", title: "Grocery & Mart", desc: "Fresh food & staples" },
  { id: "pharmacy", title: "Pharmacy / Meds", desc: "Health & personal care" },
  { id: "electronics", title: "Electronics", desc: "Appliances & tech" },
];

export function CreateShopWizard({ onComplete, onCancel }: CreateShopWizardProps) {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [currency, setCurrency] = useState("ETB");
  const [category, setCategory] = useState("retail");
  const [error, setError] = useState("");

  const storeNameId = useId();
  const storeSlugId = useId();
  const storeCurrencyId = useId();

  const handleNameChange = (val: string) => {
    setName(val);
    setError("");
    // Auto-generate clean slug from name if user hasn't explicitly edited slug yet
    const generated = val
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");
    setSlug(generated);
  };

  const handleNextFromStep1 = () => {
    if (!name.trim()) {
      setError("Please enter a name for your store.");
      return;
    }
    setError("");
    setStep(2);
  };

  const handleSubmit = () => {
    onComplete({
      name: name.trim(),
      slug:
        slug.trim() ||
        name
          .trim()
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "-"),
      currency,
      category,
    });
  };

  return (
    <div className="wizard-container">
      <div className="wizard-header">
        <h2>Set Up New Store</h2>
        <p className="wizard-subtitle">
          Step {step} of 3:{" "}
          {step === 1 ? "Store Details" : step === 2 ? "Business Type" : "Review & Launch"}
        </p>
      </div>

      <div className="wizard-progress" aria-hidden="true">
        <div className={`wizard-step-dot ${step === 1 ? "active" : step > 1 ? "completed" : ""}`}>
          1
        </div>
        <div className={`wizard-progress-line ${step > 1 ? "filled" : ""}`} />
        <div className={`wizard-step-dot ${step === 2 ? "active" : step > 2 ? "completed" : ""}`}>
          2
        </div>
        <div className={`wizard-progress-line ${step > 2 ? "filled" : ""}`} />
        <div className={`wizard-step-dot ${step === 3 ? "active" : ""}`}>3</div>
      </div>

      {step === 1 && (
        <div>
          <div className="wizard-form-group">
            <label htmlFor={storeNameId} className="wizard-label">
              Store Name <span style={{ color: "var(--accent)" }}>*</span>
            </label>
            <input
              id={storeNameId}
              type="text"
              className="wizard-input"
              placeholder="e.g. Mercato Wholesale Hub"
              value={name}
              onChange={(e) => handleNameChange(e.target.value)}
              autoFocus
            />
            {error && <p className="wizard-input-error">{error}</p>}
            <p className="wizard-input-hint">The primary public name of your store.</p>
          </div>

          <div className="wizard-form-group">
            <label htmlFor={storeSlugId} className="wizard-label">
              Store Code / Slug
            </label>
            <input
              id={storeSlugId}
              type="text"
              className="wizard-input"
              placeholder="e.g. mercato-wholesale"
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
            />
            <p className="wizard-input-hint">Used in URLs and printable receipts.</p>
          </div>

          <div className="wizard-form-group">
            <label htmlFor={storeCurrencyId} className="wizard-label">
              Operating Currency
            </label>
            <select
              id={storeCurrencyId}
              className="wizard-select"
              value={currency}
              onChange={(e) => setCurrency(e.target.value)}
            >
              <option value="ETB">ETB — Ethiopian Birr (santim)</option>
              <option value="USD">USD — US Dollar (cents)</option>
              <option value="KES">KES — Kenyan Shilling</option>
            </select>
          </div>
        </div>
      )}

      {step === 2 && (
        <div>
          <p className="wizard-label" style={{ marginBottom: "12px" }}>
            Select your store category:
          </p>
          <div className="wizard-type-grid" role="radiogroup">
            {STORE_TYPES.map((t) => (
              <div
                key={t.id}
                role="radio"
                aria-checked={category === t.id}
                tabIndex={0}
                className={`wizard-type-card ${category === t.id ? "selected" : ""}`}
                onClick={() => setCategory(t.id)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") setCategory(t.id);
                }}
              >
                <span className="wizard-type-title">{t.title}</span>
                <span className="wizard-type-desc">{t.desc}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {step === 3 && (
        <div className="wizard-summary-box">
          <div className="wizard-summary-row">
            <span className="wizard-summary-label">Store Name:</span>
            <span className="wizard-summary-value">{name}</span>
          </div>
          <div className="wizard-summary-row">
            <span className="wizard-summary-label">Store Code:</span>
            <span className="wizard-summary-value">{slug || "auto-generated"}</span>
          </div>
          <div className="wizard-summary-row">
            <span className="wizard-summary-label">Currency:</span>
            <span className="wizard-summary-value">{currency}</span>
          </div>
          <div className="wizard-summary-row">
            <span className="wizard-summary-label">Category:</span>
            <span className="wizard-summary-value">
              {STORE_TYPES.find((t) => t.id === category)?.title}
            </span>
          </div>
          <div className="wizard-summary-row">
            <span className="wizard-summary-label">Attendant Quota:</span>
            <span className="wizard-summary-value">Up to 5 cashiers / staff</span>
          </div>
        </div>
      )}

      <div className="wizard-footer">
        <button
          type="button"
          className="btn-secondary"
          onClick={step === 1 ? onCancel : () => setStep((s) => (s - 1) as 1 | 2)}
        >
          {step === 1 ? "Cancel" : "Back"}
        </button>

        {step < 3 ? (
          <button
            type="button"
            className="btn-primary"
            onClick={step === 1 ? handleNextFromStep1 : () => setStep(3)}
          >
            Continue
          </button>
        ) : (
          <button type="button" className="btn-primary" onClick={handleSubmit}>
            Create Store
          </button>
        )}
      </div>
    </div>
  );
}

export default CreateShopWizard;
