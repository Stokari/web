import type { StaffMember } from "./types";
import "./StaffScreen.css";

export interface MemberListProps {
  members: StaffMember[];
  onDeactivate: (memberId: string) => Promise<void> | void;
}

export function MemberList({ members, onDeactivate }: MemberListProps) {
  if (members.length === 0) {
    return (
      <div style={{ padding: "40px 20px", textAlign: "center", color: "var(--text)" }}>
        No staff members found. Click &quot;Invite Attendant&quot; to add cashiers.
      </div>
    );
  }

  return (
    <div className="member-list-table-wrapper">
      <table className="member-table" aria-label="Store staff members">
        <thead>
          <tr>
            <th>Name & Email</th>
            <th>Role</th>
            <th>Offline Lease</th>
            <th>Status</th>
            <th style={{ textAlign: "right" }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {members.map((member) => (
            <tr key={member.id}>
              <td>
                <div className="member-name-cell">
                  <strong>{member.name}</strong>
                  <span className="member-email">{member.email}</span>
                </div>
              </td>
              <td>
                <span
                  className={`badge ${member.role === "OWNER" ? "badge-owner" : "badge-attendant"}`}
                >
                  {member.role}
                </span>
              </td>
              <td>
                {member.status === "ACTIVE" && member.role === "ATTENDANT" ? (
                  <span>
                    {typeof member.activeLeaseRemainingDays === "number"
                      ? `${member.activeLeaseRemainingDays} days left`
                      : "7 days lease"}
                  </span>
                ) : (
                  <span style={{ color: "var(--text)" }}>—</span>
                )}
              </td>
              <td>
                <span
                  className={`status-tag ${member.status === "ACTIVE" ? "active" : "deactivated"}`}
                >
                  {member.status}
                </span>
              </td>
              <td style={{ textAlign: "right" }}>
                {member.role !== "OWNER" && member.status === "ACTIVE" && (
                  <button
                    type="button"
                    className="btn-deactivate"
                    onClick={() => onDeactivate(member.id)}
                    aria-label={`Deactivate ${member.name}`}
                  >
                    1-Tap Deactivate
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default MemberList;
