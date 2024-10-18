"use client";

import { Customer, CustomerPreview } from "@/types/global";
import { instance } from "@/untils/instance";
import { useEffect, useState } from "react";

export const useCustomers = () => {
  const [customers, setCustomers] = useState<CustomerPreview[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const getCustomers = async () => {
      setIsLoading(true);
      const response = await instance.get(`customers`);
      const data = await response.data;
      const customers = data?.customers;
      customers && setCustomers(customers);
      setIsLoading(false);
    };

    getCustomers();
  }, []);

  return {
    customers,
    isLoading,
  };
};

export const useCustomer = (id: string) => {
  const [customer, setCustome] = useState<Customer | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const getCustomer = async () => {
      setIsLoading(true);
      try {
        const response = await instance.get(`customers/${id}`);
        const data = await response.data;
        const customer = data?.customer;
        customer && setCustome(customer);
        setIsLoading(false);
      } catch (error) {
        setIsLoading(false);
      }
    };

    getCustomer();
  }, [id]);

  return {
    customer,
    isLoading,
  };
};
