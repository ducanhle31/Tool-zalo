"use client";

import { RequestUserInfo } from "@/types/global";
import { instance } from "@/untils/instance";
import { useEffect, useState } from "react";

export const useRequestUserInfos = () => {
  const [requestUserInfos, setRequestUserInfos] = useState<RequestUserInfo[]>(
    []
  );
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const getCustomers = async () => {
      setIsLoading(true);
      const response = await instance.get("request-user-info");
      const data = await response.data;
      const customers = data?.request_user_info as RequestUserInfo[];
      customers && setRequestUserInfos(customers);
      setIsLoading(false);
    };

    getCustomers();
  }, []);

  return {
    requestUserInfos,
    isLoading,
  };
};

export const useRequestUserInfo = (id: string) => {
  const [requestUserInfo, setRequestUserInfo] =
    useState<RequestUserInfo | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const getCustomer = async () => {
      setIsLoading(true);
      const response = await instance.get(`request-user-info/${id}`);
      const data = await response.data;
      const requestUserInfo = data?.request_user_info;
      requestUserInfo && setRequestUserInfo(requestUserInfo);
      setIsLoading(false);
    };

    getCustomer();
  }, [id]);

  return {
    requestUserInfo,
    isLoading,
  };
};
