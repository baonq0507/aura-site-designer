/**
 * Types for authentication and user management
 */

export interface CreateUserData {
  username: string;
  phoneNumber: string;
  password: string;
  fundPassword: string;
  invitationCode: string;
}

export interface CreateUserResponse {
  success: boolean;
  user_id: string;
  message: string;
  email_confirmed?: boolean;
  email?: string;
}

export interface AuthError {
  title: string;
  message: string;
  type: string;
}

export interface UserProfile {
  user_id: string;
  username: string | null;
  phone_number: string | null;
  balance: number | null;
  bonus_amount: number | null;
  bonus_order_count: number | null;
  fund_password: string | null;
  invitation_code: string | null;
  invited_by_code: string | null;
  is_locked: boolean | null;
  task_locked: boolean | null;
  total_orders: number;
  total_spent: number;
  vip_level: number;
  created_at: string;
  updated_at: string;
}
