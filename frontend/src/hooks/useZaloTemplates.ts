"use client";

import { ZaloTemplate } from "@/types/global";
import { instance } from "@/untils/instance";
import { useEffect, useState } from "react";

export const useZaloTemplates = () => {
  const [zaloTemplates, setZaloTemplates] = useState<ZaloTemplate[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const getTemplates = async () => {
      setIsLoading(true);
      const response = await instance.get(`zalo-templates`);
      const data = await response.data;
      const zaloTemplates = data?.zaloTemplates;
      zaloTemplates && setZaloTemplates(zaloTemplates);
      setIsLoading(false);
    };

    getTemplates();
  }, []);

  return {
    zaloTemplates,
    isLoading,
  };
};

export const useZaloTemplate = (id: string) => {
  const [zaloTemplate, setZaloTemplate] = useState<ZaloTemplate | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const getTemplate = async () => {
      setIsLoading(true);
      try {
        const response = await instance.get(`zalo-templates/${id}`);
        const data = await response.data;
        const zaloTemplate = data?.zaloTemplate;
        zaloTemplate && setZaloTemplate(zaloTemplate);
        setIsLoading(false);
      } catch (error) {
        setIsLoading(false);
      }
    };

    getTemplate();
  }, [id]);

  return {
    zaloTemplate,
    isLoading,
  };
};
