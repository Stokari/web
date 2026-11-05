export type UserRole = "OWNER" | "ATTENDANT";

export interface SessionTokens {
  accessToken: string | null;
  expiresAtMs: number | null;
}

export interface StoredRefreshToken {
  token: string;
  familyId: string;
  expiresAt: string;
  shopId: string;
  userId: string;
  deviceId: string;
}

export interface OfflineLease {
  leaseId: string;
  membershipId: string;
  shopId: string;
  role: UserRole;
  deviceId: string;
  allowedOps: string[];
  issuedAt: string;
  expiresAt: string;
  revokedAt?: string | null;
}

export interface ClockSecurityState {
  clockOffsetMs: number;
  maxSeenTimeMs: number;
  isTampered: boolean;
}

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  shopId: string;
  membershipId: string;
  deviceId: string;
}
