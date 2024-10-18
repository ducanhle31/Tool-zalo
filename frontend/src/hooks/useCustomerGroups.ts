"use client";

import { CustomerGroup } from "@/types/global";
import { instance } from "@/untils/instance";
import { useEffect, useState } from "react";

export const useCustomerGroups = () => {
  const [customerGroups, setCustomerGroups] = useState<CustomerGroup[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const getCustomers = async () => {
      setIsLoading(true);
      const response = await instance.get("customer-groups");
      const data = await response.data;
      const customers = data?.customer_groups as CustomerGroup[];
      customers && setCustomerGroups(customers);
      setIsLoading(false);
    };

    getCustomers();
  }, []);

  return {
    customerGroups,
    isLoading,
  };
};

export const useCustomerGroup = (id: string) => {
  const [customerGroup, setCustomerGroup] = useState<CustomerGroup | null>(
    null
  );
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const getCustomer = async () => {
      setIsLoading(true);
      const response = await instance.get(`customer-groups/${id}`);
      const data = await response.data;
      const customerGroup = data?.customer_group;
      customerGroup && setCustomerGroup(customerGroup);
      setIsLoading(false);
    };

    getCustomer();
  }, [id]);

  return {
    customerGroup,
    isLoading,
  };
};
