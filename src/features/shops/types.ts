export type UserRole = "OWNER" | "ATTENDANT";

export type ShopStatus = "ACTIVE" | "CLOSED";

export interface ShopMembership {
  id: string;
  name: string;
  slug: string;
  role: UserRole;
  status: ShopStatus;
  currency: string;
  attendantCount?: number;
  maxAttendants?: number;
  lastAccessedAt?: string;
}

export interface ShopSelectorScreenProps {
  /** List of shops where the user has active memberships */
  shops: ShopMembership[];
  /** The currently active shop ID in the session, if any */
  currentShopId?: string;
  /** Callback triggered when the user picks a store */
  onSelectShop: (shopId: string) => void;
  /** Callback triggered when clicking "Create New Store" */
  onCreateNewShop?: () => void;
  /** User name or email for personalized greeting */
  userDisplayName?: string;
}
