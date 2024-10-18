"use client";

import { Campaign } from "@/types/global";
import { instance } from "@/untils/instance";
import { useEffect, useState } from "react";

export const useCampaigns = () => {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const getCampaigns = async () => {
      setIsLoading(true);
      const response = await instance.get(`campaigns`);
      const data = await response.data;
      const campaigns = data?.campaigns;
      campaigns && setCampaigns(campaigns);
      setIsLoading(false);
    };

    getCampaigns();
  }, []);

  return {
    campaigns,
    isLoading,
  };
};

export const useCampaign = (id: string) => {
  const [campaign, setCampaign] = useState<Campaign | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const getCampaign = async () => {
      setIsLoading(true);
      try {
        const response = await instance.get(`campaigns/${id}`);
        const data = await response.data;
        const campaign = data?.campaign;
        campaign && setCampaign(campaign);
        setIsLoading(false);
      } catch (error) {
        setIsLoading(false);
      }
    };

    getCampaign();
  }, [id]);

  return {
    campaign,
    isLoading,
  };
};
