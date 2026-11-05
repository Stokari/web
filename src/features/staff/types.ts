import type { UserRole } from "../../session/types";

export interface StaffMember {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  status: "ACTIVE" | "DEACTIVATED";
  activeLeaseRemainingDays?: number;
  joinedAt: string;
  deactivatedAt?: string;
}
