
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Transaction, calculateTransactionFee } from '@/types';
import { useAuth } from './AuthContext';

interface WalletContextType {
  balance: number;
  transactions: Transaction[];
  isLoading: boolean;
  sendMoney: (toPhone: string, amount: number, description: string) => Promise<boolean>;
  depositMoney: (amount: number, method: string) => Promise<boolean>;
  withdrawMoney: (amount: number, method: string) => Promise<boolean>;
  payBill: (type: string, provider: string, accountNumber: string, amount: number) => Promise<boolean>;
  buyAirtime: (provider: string, phoneNumber: string, amount: number) => Promise<boolean>;
  refreshTransactions: () => Promise<void>;
}

const WalletContext = createContext<WalletContextType | undefined>(undefined);

export function WalletProvider({ children }: { children: ReactNode }) {
  const { user, updateUser } = useAuth();
  const [balance, setBalance] = useState(0);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (user) {
      setBalance(user.balance);
      loadTransactions();
    }
  }, [user]);

  const loadTransactions = async () => {
    if (!user) return;

    try {
      const transactionsData = await AsyncStorage.getItem(`transactions_${user.id}`);
      if (transactionsData) {
        const parsed = JSON.parse(transactionsData);
        setTransactions(parsed.map((t: any) => ({
          ...t,
          createdAt: new Date(t.createdAt),
          completedAt: t.completedAt ? new Date(t.completedAt) : undefined,
        })));
      }
    } catch (error) {
      console.log('Error loading transactions:', error);
    }
  };

  const saveTransaction = async (transaction: Transaction) => {
    if (!user) return;

    try {
      const updatedTransactions = [transaction, ...transactions];
      await AsyncStorage.setItem(
        `transactions_${user.id}`,
        JSON.stringify(updatedTransactions)
      );
      setTransactions(updatedTransactions);
    } catch (error) {
      console.log('Error saving transaction:', error);
    }
  };

  const sendMoney = async (toPhone: string, amount: number, description: string): Promise<boolean> => {
    if (!user) return false;

    try {
      const fee = calculateTransactionFee(amount);
      const total = amount + fee;

      if (balance < total) {
        console.log('Insufficient balance');
        return false;
      }

      const transaction: Transaction = {
        id: Date.now().toString(),
        type: 'send',
        amount,
        fee,
        total,
        fromUserId: user.id,
        toPhone,
        status: 'completed',
        description,
        createdAt: new Date(),
        completedAt: new Date(),
        receiptId: `RCP${Date.now()}`,
      };

      const newBalance = balance - total;
      setBalance(newBalance);
      await updateUser({ balance: newBalance });
      await saveTransaction(transaction);

      return true;
    } catch (error) {
      console.log('Send money error:', error);
      return false;
    }
  };

  const depositMoney = async (amount: number, method: string): Promise<boolean> => {
    if (!user) return false;

    try {
      const transaction: Transaction = {
        id: Date.now().toString(),
        type: 'deposit',
        amount,
        fee: 0,
        total: amount,
        fromUserId: user.id,
        status: 'completed',
        description: `Deposit via ${method}`,
        category: method,
        createdAt: new Date(),
        completedAt: new Date(),
        receiptId: `RCP${Date.now()}`,
      };

      const newBalance = balance + amount;
      setBalance(newBalance);
      await updateUser({ balance: newBalance });
      await saveTransaction(transaction);

      return true;
    } catch (error) {
      console.log('Deposit error:', error);
      return false;
    }
  };

  const withdrawMoney = async (amount: number, method: string): Promise<boolean> => {
    if (!user) return false;

    try {
      const fee = calculateTransactionFee(amount);
      const total = amount + fee;

      if (balance < total) {
        console.log('Insufficient balance');
        return false;
      }

      const transaction: Transaction = {
        id: Date.now().toString(),
        type: 'withdraw',
        amount,
        fee,
        total,
        fromUserId: user.id,
        status: 'completed',
        description: `Withdraw to ${method}`,
        category: method,
        createdAt: new Date(),
        completedAt: new Date(),
        receiptId: `RCP${Date.now()}`,
      };

      const newBalance = balance - total;
      setBalance(newBalance);
      await updateUser({ balance: newBalance });
      await saveTransaction(transaction);

      return true;
    } catch (error) {
      console.log('Withdraw error:', error);
      return false;
    }
  };

  const payBill = async (
    type: string,
    provider: string,
    accountNumber: string,
    amount: number
  ): Promise<boolean> => {
    if (!user) return false;

    try {
      const fee = calculateTransactionFee(amount);
      const total = amount + fee;

      if (balance < total) {
        console.log('Insufficient balance');
        return false;
      }

      const transaction: Transaction = {
        id: Date.now().toString(),
        type: 'bill',
        amount,
        fee,
        total,
        fromUserId: user.id,
        status: 'completed',
        description: `${type} bill - ${provider}`,
        category: type,
        createdAt: new Date(),
        completedAt: new Date(),
        receiptId: `RCP${Date.now()}`,
      };

      const newBalance = balance - total;
      setBalance(newBalance);
      await updateUser({ balance: newBalance });
      await saveTransaction(transaction);

      return true;
    } catch (error) {
      console.log('Pay bill error:', error);
      return false;
    }
  };

  const buyAirtime = async (
    provider: string,
    phoneNumber: string,
    amount: number
  ): Promise<boolean> => {
    if (!user) return false;

    try {
      const fee = calculateTransactionFee(amount);
      const total = amount + fee;

      if (balance < total) {
        console.log('Insufficient balance');
        return false;
      }

      const transaction: Transaction = {
        id: Date.now().toString(),
        type: 'airtime',
        amount,
        fee,
        total,
        fromUserId: user.id,
        toPhone: phoneNumber,
        status: 'completed',
        description: `${provider} airtime`,
        category: 'airtime',
        createdAt: new Date(),
        completedAt: new Date(),
        receiptId: `RCP${Date.now()}`,
      };

      const newBalance = balance - total;
      setBalance(newBalance);
      await updateUser({ balance: newBalance });
      await saveTransaction(transaction);

      return true;
    } catch (error) {
      console.log('Buy airtime error:', error);
      return false;
    }
  };

  const refreshTransactions = async () => {
    setIsLoading(true);
    await loadTransactions();
    setIsLoading(false);
  };

  return (
    <WalletContext.Provider
      value={{
        balance,
        transactions,
        isLoading,
        sendMoney,
        depositMoney,
        withdrawMoney,
        payBill,
        buyAirtime,
        refreshTransactions,
      }}
    >
      {children}
    </WalletContext.Provider>
  );
}

export function useWallet() {
  const context = useContext(WalletContext);
  if (context === undefined) {
    throw new Error('useWallet must be used within a WalletProvider');
  }
  return context;
}
