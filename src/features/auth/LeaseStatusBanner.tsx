import { useState } from "react";
import { checkLeaseStatus } from "../../session/lease-guard";
import type { OfflineLease } from "../../session/types";
import "./LeaseStatusBanner.css";

export interface LeaseStatusBannerProps {
  lease: OfflineLease | null;
  currentTimeMs?: number;
  onRenew?: () => void;
  onExportBackup?: () => void;
}

export function LeaseStatusBanner({
  lease,
  currentTimeMs,
  onRenew,
  onExportBackup,
}: LeaseStatusBannerProps) {
  const [initialNow] = useState(() => Date.now());
  const effectiveNow = currentTimeMs ?? initialNow;
  const status = checkLeaseStatus(lease, effectiveNow);

  if (!status.isExpired && !status.isExpiringSoon && !status.isRevoked) {
    return null;
  }

  if (status.isRevoked) {
    return (
      <div className="lease-banner expired" role="alert">
        <div className="lease-banner-content">
          <span className="lease-banner-icon" aria-hidden="true">
            🚫
          </span>
          <span>
            <strong>Access Revoked:</strong> Your attendant lease has been deactivated by the store
            owner. The app is in read-only mode.
          </span>
        </div>
        {onExportBackup && (
          <div className="lease-banner-actions">
            <button type="button" className="btn-banner-action" onClick={onExportBackup}>
              Export Data
            </button>
          </div>
        )}
      </div>
    );
  }

  if (status.isExpired) {
    return (
      <div className="lease-banner expired" role="alert">
        <div className="lease-banner-content">
          <span className="lease-banner-icon" aria-hidden="true">
            ⚠️
          </span>
          <span>
            <strong>Offline Lease Expired:</strong> Sales are disabled until you connect to the
            internet to renew your 7-day offline lease. Local records remain readable.
          </span>
        </div>
        <div className="lease-banner-actions">
          {onExportBackup && (
            <button type="button" className="btn-banner-action" onClick={onExportBackup}>
              Emergency Export
            </button>
          )}
          {onRenew && (
            <button type="button" className="btn-banner-action" onClick={onRenew}>
              Renew Now
            </button>
          )}
        </div>
      </div>
    );
  }

  // <24h remaining
  return (
    <div className="lease-banner warning" role="status">
      <div className="lease-banner-content">
        <span className="lease-banner-icon" aria-hidden="true">
          ⏳
        </span>
        <span>
          <strong>Offline Access Warning:</strong> Offline lease ends in{" "}
          <strong>{status.remainingHours} hours</strong>. Connect to internet to renew.
        </span>
      </div>
      {onRenew && (
        <div className="lease-banner-actions">
          <button type="button" className="btn-banner-action" onClick={onRenew}>
            Renew Lease
          </button>
        </div>
      )}
    </div>
  );
}

export default LeaseStatusBanner;
