import { UserPreview } from "@/types/global";

const backend_url = process.env.NEXT_PUBLIC_API_URL!;

export const createUser = async (
  user: Omit<UserPreview, "_id" | "createdAt" | "updatedAt">
) => {
  return await fetch(`${backend_url}/users`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.NEXT_PUBLIC_TOKEN!}`,
    },
    body: JSON.stringify(user),
  });
};

export const updateUser = async (
  user: Omit<UserPreview, "createdAt" | "updatedAt">
) => {
  const { _id, ...args } = user;
  return await fetch(`${backend_url}/users/${user?._id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.NEXT_PUBLIC_TOKEN!}`,
    },
    body: JSON.stringify(args),
  });
};

export const deleteUser = async (_id: string) => {
  return await fetch(`${backend_url}/users/${_id}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.NEXT_PUBLIC_TOKEN!}`,
    },
  });
};
