import { useState, useId } from "react";
import "./AcceptInviteScreen.css";

export interface InviteDetails {
  token: string;
  shopName: string;
  inviterName: string;
  currentAttendants: number;
  maxAttendants: number;
  expiresInHours: number;
}

export interface AcceptInviteScreenProps {
  invite: InviteDetails;
  onAccept: (inviteToken: string, attendantName: string) => Promise<void> | void;
  onDecline: () => void;
  defaultUserName?: string;
}

export function AcceptInviteScreen({
  invite,
  onAccept,
  onDecline,
  defaultUserName = "",
}: AcceptInviteScreenProps) {
  const [name, setName] = useState(defaultUserName);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const nameInputId = useId();

  const isQuotaFull = invite.currentAttendants >= invite.maxAttendants;

  const handleAccept = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isQuotaFull) {
      setError("This store has already reached its 5-attendant limit.");
      return;
    }
    if (!name.trim()) {
      setError("Please enter your name to complete the invitation.");
      return;
    }

    try {
      setSubmitting(true);
      setError("");
      await onAccept(invite.token, name.trim());
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to accept invite");
      setSubmitting(false);
    }
  };

  return (
    <div className="accept-invite-container">
      <div className="invite-badge-header">
        <span>Attendant Invitation</span>
      </div>

      <h1 className="accept-invite-title">Join {invite.shopName}</h1>
      <p className="accept-invite-desc">
        <strong>{invite.inviterName}</strong> has invited you to join their store staff as a
        cashier.
      </p>

      {error && <div className="error-banner">{error}</div>}

      <div className="invite-details-box">
        <div className="invite-detail-row">
          <span className="invite-detail-label">Store Workspace:</span>
          <span className="invite-detail-val">{invite.shopName}</span>
        </div>
        <div className="invite-detail-row">
          <span className="invite-detail-label">Invited By:</span>
          <span className="invite-detail-val">{invite.inviterName} (Owner)</span>
        </div>
        <div className="invite-detail-row">
          <span className="invite-detail-label">Role:</span>
          <span className="invite-detail-val">ATTENDANT (Cashier)</span>
        </div>
        <div className="invite-detail-row">
          <span className="invite-detail-label">Staff Quota:</span>
          <span className={`quota-indicator ${isQuotaFull ? "full" : ""}`}>
            {invite.currentAttendants} / {invite.maxAttendants} Attendants
          </span>
        </div>
        <div className="invite-detail-row">
          <span className="invite-detail-label">Link Expires:</span>
          <span className="invite-detail-val">In {invite.expiresInHours} hours</span>
        </div>
      </div>

      {isQuotaFull ? (
        <div className="error-banner">
          This store is at capacity ({invite.maxAttendants} attendants limit). Please contact the
          store owner.
        </div>
      ) : (
        <form onSubmit={handleAccept}>
          <div className="invite-form-group">
            <label htmlFor={nameInputId} className="wizard-label">
              Your Full Name <span style={{ color: "var(--accent)" }}>*</span>
            </label>
            <input
              id={nameInputId}
              type="text"
              className="wizard-input"
              placeholder="e.g. Dawit Tadesse"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                if (error) setError("");
              }}
              disabled={submitting}
            />
          </div>

          <div className="invite-actions">
            <button
              type="button"
              className="btn-secondary"
              onClick={onDecline}
              disabled={submitting}
            >
              Decline
            </button>
            <button type="submit" className="btn-primary" disabled={submitting || !name.trim()}>
              {submitting ? "Joining..." : "Accept & Join Store"}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}

export default AcceptInviteScreen;
