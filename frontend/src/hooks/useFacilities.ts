"use client";

import { FacilityPreview } from "@/types/global";
import { instance } from "@/untils/instance";
import { useEffect, useState } from "react";

export const useFacilities = () => {
  const [facilities, setFacilities] = useState<FacilityPreview[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const getFacilities = async () => {
      setIsLoading(true);
      const response = await instance.get("facilities");
      const data = await response.data;
      const facilities = data?.facilities as FacilityPreview[];
      facilities && setFacilities(facilities);
      setIsLoading(false);
    };

    getFacilities();
  }, []);

  return {
    facilities,
    isLoading,
  };
};

export const useFacility = (id: string) => {
  const [facility, setFacility] = useState<FacilityPreview | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const getFacility = async () => {
      setIsLoading(true);
      const response = await instance.get(`facilities/${id}`);
      const data = await response.data;
      const facility = data?.facility as FacilityPreview;
      facility && setFacility(facility);
      setIsLoading(false);
    };

    getFacility();
  }, [id]);

  return {
    facility,
    isLoading,
  };
};
