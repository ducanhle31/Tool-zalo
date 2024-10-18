"use client";

import { Transaction, TransactionType } from "@/types/global";
import { instance } from "@/untils/instance";
import { useEffect, useState } from "react";

export const useTransactionTypes = () => {
  const [transactionTypes, setTransactionTypes] = useState<TransactionType[]>(
    []
  );
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const getTransactionType = async () => {
      setIsLoading(true);
      const response = await instance.get(`transaction-types`);
      const data = await response.data;
      const transactionTypes = data?.transactionTypes;
      transactionTypes && setTransactionTypes(transactionTypes);
      setIsLoading(false);
    };

    getTransactionType();
  }, []);

  return {
    transactionTypes,
    isLoading,
  };
};

export const useTransactionType = (id: string) => {
  const [transactionType, setTransactionType] = useState<Transaction | null>(
    null
  );
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const getTransactionType = async () => {
      setIsLoading(true);
      try {
        const response = await instance.get(`transaction-types/${id}`);
        const data = await response.data;
        const transactionType = data?.transactionType;
        transactionType && setTransactionType(transactionType);
        setIsLoading(false);
      } catch (error) {
        setIsLoading(false);
      }
    };

    getTransactionType();
  }, [id]);

  return {
    transactionType,
    isLoading,
  };
};
