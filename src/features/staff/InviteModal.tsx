import { useState } from "react";
import "./StaffScreen.css";

export interface InviteModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentAttendants: number;
  maxAttendants: number;
  onGenerateInvite: () => Promise<string> | string;
}

export function InviteModal({
  isOpen,
  onClose,
  currentAttendants,
  maxAttendants,
  onGenerateInvite,
}: InviteModalProps) {
  const [inviteUrl, setInviteUrl] = useState("");
  const [copied, setCopied] = useState(false);
  const [generating, setGenerating] = useState(false);

  if (!isOpen) return null;

  const isLimitReached = currentAttendants >= maxAttendants;

  const handleCreate = async () => {
    setGenerating(true);
    try {
      const token = await onGenerateInvite();
      const url = `${window.location.origin}/invite/${token}`;
      setInviteUrl(url);
    } finally {
      setGenerating(false);
    }
  };

  const handleCopy = async () => {
    if (inviteUrl) {
      await navigator.clipboard.writeText(inviteUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div
      className="modal-overlay"
      role="dialog"
      aria-modal="true"
      aria-labelledby="invite-modal-title"
    >
      <div className="invite-modal">
        <h2 id="invite-modal-title">Invite Store Attendant</h2>
        <p className="staff-subtitle">
          Staff limit: {currentAttendants} / {maxAttendants} attendants used.
        </p>

        {isLimitReached ? (
          <div className="error-banner" style={{ marginTop: "16px" }}>
            Store has reached the maximum quota of 5 attendants. You must deactivate an inactive
            attendant to invite a new cashier.
          </div>
        ) : !inviteUrl ? (
          <div style={{ marginTop: "20px" }}>
            <p style={{ fontSize: "14px", color: "var(--text)" }}>
              Generate a secure 48-hour invite link. The recipient can redeem it to become a cashier
              in your store.
            </p>
            <button
              type="button"
              className="btn-primary"
              style={{ marginTop: "16px", width: "100%", justifyContent: "center" }}
              onClick={handleCreate}
              disabled={generating}
            >
              {generating ? "Generating..." : "Generate Invite Link"}
            </button>
          </div>
        ) : (
          <div style={{ marginTop: "16px" }}>
            <label style={{ fontSize: "13px", fontWeight: 500, color: "var(--text-h)" }}>
              Share this link with your attendant (expires in 48h):
            </label>
            <div className="invite-link-box">
              <input
                type="text"
                className="invite-link-input"
                value={inviteUrl}
                readOnly
                aria-label="Generated invitation link"
              />
              <button type="button" className="btn-primary" onClick={handleCopy}>
                {copied ? "Copied!" : "Copy"}
              </button>
            </div>
          </div>
        )}

        <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "24px" }}>
          <button type="button" className="btn-secondary" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

export default InviteModal;
