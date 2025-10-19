
export interface User {
  id: string;
  name: string;
  phone: string;
  email?: string;
  photoUrl?: string;
  balance: number;
  pin?: string;
  createdAt: Date;
  isVerified: boolean;
  isBusiness: boolean;
  isBlocked: boolean;
}

export interface Transaction {
  id: string;
  type: 'send' | 'receive' | 'deposit' | 'withdraw' | 'payment' | 'airtime' | 'bill';
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
  receiptId?: string;
}

export interface BillPayment {
  id: string;
  type: 'electricity' | 'water' | 'wifi';
  provider: string;
  accountNumber: string;
  amount: number;
  fee: number;
  status: 'pending' | 'completed' | 'failed';
  createdAt: Date;
}

export interface AirtimePurchase {
  id: string;
  provider: 'Ethio Telecom' | 'Safaricom';
  phoneNumber: string;
  amount: number;
  type: 'airtime' | 'data';
  packageName?: string;
  status: 'pending' | 'completed' | 'failed';
  createdAt: Date;
}

export interface PaymentMethod {
  id: string;
  type: 'telebirr' | 'mpesa' | 'bank';
  name: string;
  accountNumber: string;
  isDefault: boolean;
}

export type TransactionFee = {
  min: number;
  max: number;
  fee: number;
};

export const TRANSACTION_FEES: TransactionFee[] = [
  { min: 0, max: 100, fee: 0.5 },
  { min: 101, max: 500, fee: 1 },
  { min: 501, max: 1000, fee: 2 },
  { min: 1001, max: 1500, fee: 3 },
  { min: 1501, max: Infinity, fee: 5 },
];

export function calculateTransactionFee(amount: number): number {
  const feeStructure = TRANSACTION_FEES.find(
    (fee) => amount >= fee.min && amount <= fee.max
  );
  return feeStructure ? feeStructure.fee : 5;
}
