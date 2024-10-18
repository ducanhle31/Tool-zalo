import { useEffect, useState } from "react";
import { instance } from "@/untils/instance";
import { OaInfo } from "@/types/global";

export const useOaInfo = () => {
  const [oaInfo, setOaInfo] = useState<OaInfo | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchOaInfo = async () => {
      setIsLoading(true);
      try {
        const response = await instance.get(`/authzalo/info`);
        setOaInfo(response.data.data);
      } catch (error) {
        console.error("Failed to fetch OA info:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchOaInfo();
  }, []);

  return { oaInfo, isLoading };
};
