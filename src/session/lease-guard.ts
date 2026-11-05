import type { OfflineLease } from "./types";

export interface LeaseStatus {
  isValid: boolean;
  isExpired: boolean;
  isRevoked: boolean;
  isExpiringSoon: boolean; // < 24 hours remaining
  remainingHours: number;
  reason?: string;
}

/**
 * Checks if an offline lease is valid, expired, revoked, or expiring within 24 hours.
 */
export function checkLeaseStatus(
  lease: OfflineLease | null,
  currentTimeMs: number = Date.now(),
): LeaseStatus {
  if (!lease) {
    return {
      isValid: false,
      isExpired: true,
      isRevoked: false,
      isExpiringSoon: false,
      remainingHours: 0,
      reason: "NO_LEASE_FOUND",
    };
  }

  if (lease.revokedAt) {
    return {
      isValid: false,
      isExpired: false,
      isRevoked: true,
      isExpiringSoon: false,
      remainingHours: 0,
      reason: "LEASE_REVOKED",
    };
  }

  const expiresAtMs = new Date(lease.expiresAt).getTime();
  const diffMs = expiresAtMs - currentTimeMs;

  if (diffMs <= 0) {
    return {
      isValid: false,
      isExpired: true,
      isRevoked: false,
      isExpiringSoon: false,
      remainingHours: 0,
      reason: "LEASE_EXPIRED",
    };
  }

  const remainingHours = Math.max(0, Math.floor(diffMs / (1000 * 60 * 60)));
  const isExpiringSoon = remainingHours < 24;

  return {
    isValid: true,
    isExpired: false,
    isRevoked: false,
    isExpiringSoon,
    remainingHours,
  };
}

/**
 * Verifies if the active lease authorizes the given operation type.
 */
export function isOperationPermitted(lease: OfflineLease | null, opType: string): boolean {
  if (!lease || !checkLeaseStatus(lease).isValid) {
    return false;
  }
  return lease.allowedOps.includes(opType) || lease.allowedOps.includes("*");
}
