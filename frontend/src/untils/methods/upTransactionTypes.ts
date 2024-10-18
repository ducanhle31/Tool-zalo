import { TransactionType } from "@/types/global";

const backend_url = process.env.NEXT_PUBLIC_API_URL!;

export const createTransactionType = async (
  transactionType: Omit<TransactionType, "createdAt" | "updatedAt" | "metadata">
) => {
  return await fetch(`${backend_url}/transaction-types`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.NEXT_PUBLIC_TOKEN!}`,
    },
    body: JSON.stringify(transactionType),
  });
};

export const updateTransactionType = async (
  transactionType: Omit<TransactionType, "createdAt" | "updatedAt" | "metadata">
) => {
  const { _id, ...args } = transactionType;
  return await fetch(`${backend_url}/transaction-types/${_id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.NEXT_PUBLIC_TOKEN!}`,
    },
    body: JSON.stringify({ ...args }),
  });
};

export const deleteTransactionType = async (_id: string) => {
  return await fetch(`${backend_url}/transaction-types/${_id}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.NEXT_PUBLIC_TOKEN!}`,
    },
  });
};
