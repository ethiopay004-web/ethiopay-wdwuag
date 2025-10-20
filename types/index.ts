
export interface User {
  id: string;
  name: string;
  phone: string;
  email?: string;
  balance: number;
  createdAt: Date;
  isVerified: boolean;
  isBusiness: boolean;
  isBlocked: boolean;
  pin?: string;
  profilePhoto?: string;
}

export interface Transaction {
  id: string;
  type: 'send' | 'receive' | 'deposit' | 'withdraw' | 'bill' | 'airtime' | 'payment';
  amount: number;
  fee: number;
  total: number;
  fromUserId: string;
  toUserId?: string;
  toPhone?: string;
  status: 'pending' | 'completed' | 'failed' | 'cancelled';
  description: string;
  category?: string;
  createdAt: Date;
  completedAt?: Date;
  receiptId: string;
}

export function calculateTransactionFee(amount: number): number {
  if (amount <= 100) return 0.5;
  if (amount <= 500) return 1;
  if (amount <= 1000) return 2;
  if (amount <= 1500) return 3;
  return Math.ceil(amount / 500) * 2;
}
