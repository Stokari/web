import { createContext } from "react";
import type { AuthUser, OfflineLease } from "../../session/types";

export interface AuthContextValue {
  user: AuthUser | null;
  lease: OfflineLease | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isSecurityLocked: boolean;
  loginWithGoogle: (idToken: string) => Promise<void>;
  logout: () => Promise<void>;
  refreshSession: () => Promise<boolean>;
}

export const AuthContext = createContext<AuthContextValue | null>(null);
