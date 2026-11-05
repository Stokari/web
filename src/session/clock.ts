import type { ClockSecurityState } from "./types";

/** Maximum allowed clock drift backwards before triggering security lockdown (5 minutes) */
export const CLOCK_ROLLBACK_THRESHOLD_MS = 5 * 60 * 1000;

export interface ClockVerificationResult {
  valid: boolean;
  reason?: "CLOCK_ROLLBACK_DETECTED";
  newMaxSeenTimeMs: number;
}

/**
 * Validates the current time against the highest previously observed timestamp (maxSeenTime).
 * If the current time is behind maxSeenTime by more than 5 minutes, detects clock tampering.
 */
export function verifyClockIntegrity(
  currentTimeMs: number,
  maxSeenTimeMs: number,
  thresholdMs: number = CLOCK_ROLLBACK_THRESHOLD_MS,
): ClockVerificationResult {
  // If current time went backwards past the tolerance window
  if (currentTimeMs < maxSeenTimeMs - thresholdMs) {
    return {
      valid: false,
      reason: "CLOCK_ROLLBACK_DETECTED",
      newMaxSeenTimeMs: maxSeenTimeMs,
    };
  }

  return {
    valid: true,
    newMaxSeenTimeMs: Math.max(currentTimeMs, maxSeenTimeMs),
  };
}

export function createInitialClockState(nowMs: number = Date.now()): ClockSecurityState {
  return {
    clockOffsetMs: 0,
    maxSeenTimeMs: nowMs,
    isTampered: false,
  };
}
