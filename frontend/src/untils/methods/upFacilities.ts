import { FacilityPreview } from "@/types/global";

const backend_url = process.env.NEXT_PUBLIC_API_URL!;

export const createFacility = async (
  facility: Omit<
    FacilityPreview,
    "createdAt" | "updatedAt" | "metadata" | "_id"
  >
) => {
  return await fetch(`${backend_url}/facilities`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.NEXT_PUBLIC_TOKEN!}`,
    },
    body: JSON.stringify(facility),
  });
};

export const updateFacility = async (
  facility: Omit<
    FacilityPreview,
    "createdAt" | "updatedAt" | "metadata" | "manager"
  >
) => {
  const { _id, ...args } = facility;
  return await fetch(`${backend_url}/facilities/${_id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.NEXT_PUBLIC_TOKEN!}`,
    },
    body: JSON.stringify({ ...args }),
  });
};

export const deleteFacility = async (_id: string) => {
  return await fetch(`${backend_url}/facilities/${_id}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.NEXT_PUBLIC_TOKEN!}`,
    },
  });
};
