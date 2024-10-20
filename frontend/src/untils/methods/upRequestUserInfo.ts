import { RequestUserInfo } from "@/types/global";

const backend_url = process.env.NEXT_PUBLIC_API_URL!;

export const importRequestUserInfo = async (file: File) => {
  const formData = new FormData();
  formData.append("file", file);

  return await fetch(`${backend_url}/request-user-info/import`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.NEXT_PUBLIC_TOKEN!}`,
    },
    body: formData,
  });
};

export const createRequestUserInfo = async (
  customer: Omit<RequestUserInfo, "_id" | "createdAt" | "updatedAt" | "metadata">
) => {
  return await fetch(`${backend_url}/request-user-info`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.NEXT_PUBLIC_TOKEN!}`,
    },
    body: JSON.stringify(customer),
  });
};

export const updateRequestUserInfo = async (
  RequestUserInfo: Omit<RequestUserInfo, "createdAt" | "updatedAt">
) => {
  const { _id, ...args } = RequestUserInfo;
  return await fetch(`${backend_url}/request-user-info/${_id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.NEXT_PUBLIC_TOKEN!}`,
    },
    body: JSON.stringify(args),
  });
};

export const deleteRequestUserInfo = async (_id: string) => {
  return await fetch(`${backend_url}/request-user-info/${_id}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.NEXT_PUBLIC_TOKEN!}`,
    },
  });
};
