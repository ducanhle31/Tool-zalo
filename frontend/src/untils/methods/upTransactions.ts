import { TransactionPreview } from "@/types/global";

const backend_url = process.env.NEXT_PUBLIC_API_URL!;

export const createTransaction = async (
  transaction: Omit<
    TransactionPreview,
    "_id" | "createdAt" | "updatedAt" | "previous_balance" | "metadata"
  >
) => {
  return await fetch(`${backend_url}/transactions`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.NEXT_PUBLIC_TOKEN!}`,
    },
    body: JSON.stringify(transaction),
  });
};

export const updateTransaction = async (
  transaction: Omit<
    TransactionPreview,
    | "createdAt"
    | "updatedAt"
    | "metadata"
    | "previous_balance"
    | "wallet"
    | "customer"
    | "facility"
    | "transaction_form"
    | "value"
    | "status"
    | "transaction_type"
  >
) => {
  const { _id, title, note } = transaction;
  return await fetch(`${backend_url}/transactions/${_id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.NEXT_PUBLIC_TOKEN!}`,
    },
    body: JSON.stringify({ title, note }),
  });
};

export const deleteTransaction = async (_id: string) => {
  return await fetch(`${backend_url}/transactions/${_id}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.NEXT_PUBLIC_TOKEN!}`,
    },
  });
};
