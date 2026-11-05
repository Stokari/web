import { useState } from "react";
import { MemberList } from "./MemberList";
import { InviteModal } from "./InviteModal";
import type { StaffMember } from "./types";
import "./StaffScreen.css";

export interface StaffScreenProps {
  shopName: string;
  initialMembers: StaffMember[];
  maxAttendants?: number;
  onDeactivateMember?: (memberId: string) => Promise<void> | void;
  onGenerateInvite?: () => Promise<string> | string;
}

export function StaffScreen({
  shopName,
  initialMembers,
  maxAttendants = 5,
  onDeactivateMember,
  onGenerateInvite,
}: StaffScreenProps) {
  const [members, setMembers] = useState<StaffMember[]>(initialMembers);
  const [isInviteOpen, setIsInviteOpen] = useState(false);

  const activeAttendantsCount = members.filter(
    (m) => m.role === "ATTENDANT" && m.status === "ACTIVE",
  ).length;

  const isLimitReached = activeAttendantsCount >= maxAttendants;

  const handleDeactivate = async (memberId: string) => {
    if (onDeactivateMember) {
      await onDeactivateMember(memberId);
    }
    setMembers((prev) =>
      prev.map((m) =>
        m.id === memberId
          ? {
              ...m,
              status: "DEACTIVATED" as const,
              activeLeaseRemainingDays: 0,
              deactivatedAt: new Date().toISOString(),
            }
          : m,
      ),
    );
  };

  const handleCreateInviteToken = async () => {
    if (onGenerateInvite) {
      return await onGenerateInvite();
    }
    return "inv_" + Math.random().toString(36).slice(2, 12);
  };

  return (
    <div className="staff-screen-container">
      <header className="staff-header">
        <div className="staff-header-text">
          <h1>Staff &amp; Attendants</h1>
          <p className="staff-subtitle">
            Manage cashier accounts and offline leases for <strong>{shopName}</strong>.
          </p>
        </div>

        <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
          <div
            className={`staff-quota-badge ${
              isLimitReached
                ? "limit-reached"
                : activeAttendantsCount >= maxAttendants - 1
                  ? "near-limit"
                  : ""
            }`}
          >
            <span>Quota:</span>
            <strong>
              {activeAttendantsCount} / {maxAttendants} Attendants
            </strong>
          </div>

          <button
            type="button"
            className="btn-primary"
            onClick={() => setIsInviteOpen(true)}
            disabled={isLimitReached}
          >
            <span aria-hidden="true">+</span> Invite Attendant
          </button>
        </div>
      </header>

      <MemberList members={members} onDeactivate={handleDeactivate} />

      <InviteModal
        isOpen={isInviteOpen}
        onClose={() => setIsInviteOpen(false)}
        currentAttendants={activeAttendantsCount}
        maxAttendants={maxAttendants}
        onGenerateInvite={handleCreateInviteToken}
      />
    </div>
  );
}

export default StaffScreen;
