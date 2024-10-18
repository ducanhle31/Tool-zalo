import { CampaignPreview } from "@/types/global";

const backend_url = process.env.NEXT_PUBLIC_API_URL!;

export const createCampaign = async (
  campaign: Omit<CampaignPreview, "_id" | "createdAt" | "updatedAt">
) => {
  return await fetch(`${backend_url}/campaigns`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.NEXT_PUBLIC_TOKEN!}`,
    },
    body: JSON.stringify(campaign),
  });
};

export const updateCampaign = async (
  campaign: Omit<CampaignPreview, "createdAt" | "updatedAt">
) => {
  const { _id, ...args } = campaign;
  return await fetch(`${backend_url}/campaigns/${_id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.NEXT_PUBLIC_TOKEN!}`,
    },
    body: JSON.stringify(args),
  });
};

export const deleteCampaign = async (_id: string) => {
  return await fetch(`${backend_url}/campaigns/${_id}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.NEXT_PUBLIC_TOKEN!}`,
    },
  });
};
