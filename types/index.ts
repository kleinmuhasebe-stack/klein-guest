export type Role = "owner" | "manager" | "checkin";
export type GuestStatus = "pending" | "vip" | "plus1" | "plus2";

export interface Profile {
  id: string;
  full_name: string | null;
  avatar_url: string | null;
  created_at: string;
}

export interface Organization {
  id: string;
  name: string;
  owner_id: string;
  created_at: string;
}

export interface OrgMember {
  id: string;
  org_id: string;
  user_id: string;
  role: Role;
  created_at: string;
  profile?: Profile;
}

export interface Event {
  id: string;
  org_id: string;
  name: string;
  date: string | null;
  venue: string | null;
  emoji: string;
  description: string | null;
  bugece_url: string | null;
  is_active: boolean;
  created_by: string;
  created_at: string;
  guest_count?: number;
  checked_in_count?: number;
}

export interface Guest {
  id: string;
  event_id: string;
  first_name: string;
  last_name: string;
  email: string | null;
  phone: string | null;
  status: GuestStatus;
  table_name: string | null;
  note: string | null;
  checked_in: boolean;
  checked_in_at: string | null;
  checked_in_by: string | null;
  created_at: string;
}

export interface GuestStats {
  total: number;
  checked_in: number;
  vip: number;
  pending: number;
  plus: number;
}
