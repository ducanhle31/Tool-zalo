"use client";

import { Transaction, TransactionPreview } from "@/types/global";
import { instance } from "@/untils/instance";
import { useEffect, useState } from "react";

export const useTransactions = () => {
  const [transactions, setTransactions] = useState<TransactionPreview[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const getTransactions = async () => {
      setIsLoading(true);
      const response = await instance.get(`transactions`);
      const data = await response.data;
      const transactions = data?.transactions;
      transactions && setTransactions(transactions);
      setIsLoading(false);
    };

    getTransactions();
  }, []);

  return {
    transactions,
    isLoading,
  };
};

export const useTransactionsByWallet = ({ wallet }: { wallet: string }) => {
  const [transactions, setTransactions] = useState<TransactionPreview[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const getTransactions = async () => {
      setIsLoading(true);
      const response = await instance.get(`transactions/?wallet=${wallet}`);
      const data = await response.data;
      const transactions = data?.transactions;
      transactions && setTransactions(transactions);
      setIsLoading(false);
    };

    getTransactions();
  }, [wallet]);

  return {
    transactions,
    isLoading,
  };
};

export const useTransaction = (id: string) => {
  const [transaction, setTransaction] = useState<Transaction | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const getTransaction = async () => {
      setIsLoading(true);
      try {
        const response = await instance.get(`transactions/${id}`);
        const data = await response.data;
        const transaction = data?.transaction;
        transaction && setTransaction(transaction);
        setIsLoading(false);
      } catch (error) {
        setIsLoading(false);
      }
    };

    getTransaction();
  }, [id]);

  return {
    transaction,
    isLoading,
  };
};
