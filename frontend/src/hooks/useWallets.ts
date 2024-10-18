"use client";

import { Wallet } from "@/types/global";
import { instance } from "@/untils/instance";
import { useEffect, useState } from "react";

export const useWallets = () => {
  const [wallets, setWallets] = useState<Wallet[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const getWallets = async () => {
      setIsLoading(true);
      const response = await instance.get(`wallets`);
      const data = await response.data;
      const wallets = data?.wallets;
      wallets && setWallets(wallets);
      setIsLoading(false);
    };

    getWallets();
  }, []);

  return {
    wallets,
    isLoading,
  };
};

export const useWallet = (id: string) => {
  const [wallet, setWallet] = useState<Wallet | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const getWallet = async () => {
      setIsLoading(true);
      try {
        const response = await instance.get(`wallets/${id}`);
        const data = await response.data;
        const wallet = data?.wallet;
        wallet && setWallet(wallet);
        setIsLoading(false);
      } catch (error) {
        setIsLoading(false);
      }
    };

    getWallet();
  }, [id]);

  return {
    wallet,
    isLoading,
  };
};
