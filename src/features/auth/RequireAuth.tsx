import { type ReactNode } from "react";
import { useAuth } from "./useAuth";
import { GoogleSignInButton } from "./GoogleSignInButton";
import "./Auth.css";

export interface RequireAuthProps {
  children: ReactNode;
}

export function RequireAuth({ children }: RequireAuthProps) {
  const { isAuthenticated, isLoading, isSecurityLocked, loginWithGoogle } = useAuth();

  if (isLoading) {
    return (
      <div className="auth-screen-container" style={{ padding: "60px 20px" }}>
        <div className="auth-brand-logo">
          <span className="auth-brand-dot" />
          <h2 className="auth-brand-title">Stokari</h2>
        </div>
        <p className="auth-subtitle">Restoring offline session...</p>
      </div>
    );
  }

  if (isSecurityLocked) {
    return (
      <div className="auth-screen-container">
        <div className="security-lock-alert">
          <h3>
            <span aria-hidden="true">⚠️</span> Security Lockout
          </h3>
          <p>
            A clock rollback was detected on this device. For financial integrity and security,
            local session operations have been locked.
          </p>
          <button
            type="button"
            className="btn-primary"
            style={{ width: "100%", justifyContent: "center" }}
            onClick={() => window.location.reload()}
          >
            Refresh & Verify Time
          </button>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="auth-screen-container">
        <div className="auth-brand-logo">
          <span className="auth-brand-dot" />
          <h2 className="auth-brand-title">Stokari</h2>
        </div>
        <p className="auth-subtitle">
          Sign in to access your offline-capable POS and inventory management system.
        </p>

        <GoogleSignInButton onSuccess={(token) => loginWithGoogle(token)} />
      </div>
    );
  }

  return <>{children}</>;
}

export default RequireAuth;
