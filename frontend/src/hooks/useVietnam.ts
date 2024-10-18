import { useState } from "react";

export const useVietnam = () => {
  const [currentProvince, setCurrentProvince] = useState<any | null>(null);
  const [currentDistrict, setCurrentDistrict] = useState<any | null>(null);

  const districts = currentProvince?.districts;
  const towns = currentDistrict?.wards;

  return {
    currentProvince,
    setCurrentProvince,
    currentDistrict,
    setCurrentDistrict,
    districts,
    towns,
  };
};
