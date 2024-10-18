"use client";

import { Transaction, TransactionForm } from "@/types/global";
import { instance } from "@/untils/instance";
import { useEffect, useState } from "react";

export const useTransactionForms = () => {
  const [transactionForms, setTransactionForms] = useState<TransactionForm[]>(
    []
  );
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const getTransactionForms = async () => {
      setIsLoading(true);
      const response = await instance.get(`transaction-forms`);
      const data = await response.data;
      const transactionForms = data?.transactionForms;
      transactionForms && setTransactionForms(transactionForms);
      setIsLoading(false);
    };

    getTransactionForms();
  }, []);

  return {
    transactionForms,
    isLoading,
  };
};

export const useTransactionForm = (id: string) => {
  const [transactionForm, setTransactionForm] = useState<Transaction | null>(
    null
  );
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const getTransactionForm = async () => {
      setIsLoading(true);
      try {
        const response = await instance.get(`transaction-forms/${id}`);
        const data = await response.data;
        const transactionForm = data?.transactionForm;
        transactionForm && setTransactionForm(transactionForm);
        setIsLoading(false);
      } catch (error) {
        setIsLoading(false);
      }
    };

    getTransactionForm();
  }, [id]);

  return {
    transactionForm,
    isLoading,
  };
};
