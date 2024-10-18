"use client";

import { CustomerPreview } from "@/types/global";
import { instance } from "@/untils/instance";

const url = process.env.NEXT_PUBLIC_API_URL!;

export const useFiles = () => {
  const handleExportTemplate = () => {
    if (window && typeof window === "object") {
      window.location.href = `${url}/customers/export`;
    }
  };

  const handleExportData = async (data: CustomerPreview[]) => {
    try {
      const response = await instance.post("customers/export", data, {
        responseType: "blob",
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "exported_data.xlsx");
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error("Error exporting data:", error);
    }
  };

  return {
    handleExportTemplate,
    handleExportData,
  };
};
