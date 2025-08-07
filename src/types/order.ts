export type OrderStatus = 'pending' | 'processing' | 'completed' | 'cancelled';

export interface Order {
  id: string;
  user_id: string;
  product_name: string;
  quantity: number;
  total_amount: number;
  status: OrderStatus;
  created_at: string;
  updated_at: string;
  profiles?: {
    username?: string;
    phone_number?: string;
  } | null;
}