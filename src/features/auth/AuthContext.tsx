import { useEffect, useState, type ReactNode } from "react";
import { tokenManager } from "../../session/token-manager";
import type { AuthUser, OfflineLease } from "../../session/types";
import { AuthContext, type AuthContextValue } from "./auth-context";

export interface AuthProviderProps {
  children: ReactNode;
  initialUser?: AuthUser | null;
  initialLease?: OfflineLease | null;
}

export function AuthProvider({
  children,
  initialUser = null,
  initialLease = null,
}: AuthProviderProps) {
  const [user, setUser] = useState<AuthUser | null>(initialUser);
  const [lease, setLease] = useState<OfflineLease | null>(initialLease);
  const [isLoading, setIsLoading] = useState(!initialUser);
  const [isSecurityLocked, setIsSecurityLocked] = useState(false);

  useEffect(() => {
    async function restoreSession() {
      if (initialUser) {
        setIsLoading(false);
        return;
      }
      try {
        const stored = await tokenManager.loadStoredSession();
        if (tokenManager.isSecurityLocked()) {
          setIsSecurityLocked(true);
        } else if (stored.user && stored.lease) {
          setUser(stored.user);
          setLease(stored.lease);
          tokenManager.setAccessToken("restored_access_token", 900);
        }
      } catch (err) {
        console.error("Failed to restore session", err);
      } finally {
        setIsLoading(false);
      }
    }

    void restoreSession();
  }, [initialUser]);

  const loginWithGoogle = async (idToken: string): Promise<void> => {
    setIsLoading(true);
    try {
      if (tokenManager.isSecurityLocked()) {
        throw new Error("SECURITY_LOCK: Clock rollback detected");
      }

      let parsedName = "Stokari Merchant";
      if (idToken.includes("name=")) {
        const afterName = idToken.split("name=")[1];
        if (afterName) {
          parsedName = afterName.split(";")[0] ?? "Stokari Merchant";
        }
      }

      const mockUser: AuthUser = {
        id: "usr_" + Math.random().toString(36).slice(2, 9),
        email: "user@stokari.com",
        name: parsedName,
        role: "OWNER",
        shopId: "shop_mercato_01",
        membershipId: "mem_01",
        deviceId: "dev_" + Math.random().toString(36).slice(2, 8),
      };

      const mockLease: OfflineLease = {
        leaseId: "lease_" + Date.now(),
        membershipId: mockUser.membershipId,
        shopId: mockUser.shopId,
        role: mockUser.role,
        deviceId: mockUser.deviceId,
        allowedOps: ["*"],
        issuedAt: new Date().toISOString(),
        expiresAt: new Date(Date.now() + 7 * 86400 * 1000).toISOString(),
      };

      const mockRefresh = {
        token: "ref_" + Math.random().toString(36),
        familyId: "fam_01",
        expiresAt: new Date(Date.now() + 30 * 86400 * 1000).toISOString(),
        shopId: mockUser.shopId,
        userId: mockUser.id,
        deviceId: mockUser.deviceId,
      };

      tokenManager.setAccessToken("access_jwt_" + Date.now(), 900);
      await tokenManager.persistSessionData(mockRefresh, mockLease, mockUser);

      setUser(mockUser);
      setLease(mockLease);
    } finally {
      setIsLoading(false);
    }
  };

  const refreshSession = async (): Promise<boolean> => {
    if (tokenManager.isSecurityLocked()) {
      setIsSecurityLocked(true);
      return false;
    }
    const session = await tokenManager.loadStoredSession();
    if (session.refreshToken) {
      tokenManager.setAccessToken("rotated_jwt_" + Date.now(), 900);
      return true;
    }
    return false;
  };

  const logout = async (): Promise<void> => {
    await tokenManager.clearSession();
    setUser(null);
    setLease(null);
  };

  const value: AuthContextValue = {
    user,
    lease,
    isAuthenticated: !!user && !isSecurityLocked,
    isLoading,
    isSecurityLocked,
    loginWithGoogle,
    logout,
    refreshSession,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export default AuthProvider;
