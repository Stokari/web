import { useEffect, useState } from "react";
import {
  getStorageEstimate,
  requestPersistentStorage,
  type StorageEstimateInfo,
} from "../../data/persistence-manager";
import "./StorageGauge.css";

function formatBytes(bytes: number): string {
  if (bytes === 0) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + " " + sizes[i];
}

export function StorageGauge() {
  const [estimate, setEstimate] = useState<StorageEstimateInfo>({
    quotaBytes: 0,
    usageBytes: 0,
    percentUsed: 0,
    isPersisted: false,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchEstimate() {
      const data = await getStorageEstimate();
      setEstimate(data);
      setLoading(false);
    }
    void fetchEstimate();
  }, []);

  const handleEnablePersist = async () => {
    const granted = await requestPersistentStorage();
    if (granted) {
      const updated = await getStorageEstimate();
      setEstimate(updated);
    }
  };

  return (
    <div className="storage-gauge-card">
      <div className="storage-gauge-header">
        <h3 className="storage-gauge-title">Local Storage & Offline Database</h3>
        {estimate.isPersisted ? (
          <span className="storage-badge-persisted">
            <span aria-hidden="true">✓</span> Persistent Storage Active
          </span>
        ) : (
          <button
            type="button"
            className="storage-badge-unpersisted"
            onClick={handleEnablePersist}
            title="Click to enable persistent storage protection"
          >
            <span>Enable Persistence</span>
          </button>
        )}
      </div>

      <div
        className="storage-bar-track"
        role="progressbar"
        aria-valuenow={estimate.percentUsed}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label="Local storage used"
      >
        <div
          className="storage-bar-fill"
          style={{ width: `${Math.max(1, estimate.percentUsed)}%` }}
        />
      </div>

      <div className="storage-meta-row">
        <span>
          Used:{" "}
          <strong className="storage-meta-value">
            {loading ? "..." : formatBytes(estimate.usageBytes)}
          </strong>
        </span>
        <span>
          Quota:{" "}
          <strong className="storage-meta-value">
            {loading ? "..." : formatBytes(estimate.quotaBytes)}
          </strong>
        </span>
      </div>

      <p className="storage-hint">
        {estimate.isPersisted
          ? "Your device browser guarantees this store database will not be cleared during cache cleanups."
          : "Persistent storage is currently not granted. Tap Enable Persistence to protect offline sales."}
      </p>
    </div>
  );
}

export default StorageGauge;
