import { TransactionForm } from "@/types/global";

const backend_url = process.env.NEXT_PUBLIC_API_URL!;

export const createTransactionForm = async (
  transactionForm: Omit<
    TransactionForm,
    "createdAt" | "updatedAt" | "metadata" | "_id"
  >
) => {
  return await fetch(`${backend_url}/transaction-forms`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.NEXT_PUBLIC_TOKEN!}`,
    },
    body: JSON.stringify(transactionForm),
  });
};

export const updateTransactionForm = async (
  transactionForm: Omit<TransactionForm, "createdAt" | "updatedAt" | "metadata">
) => {
  const { _id, ...args } = transactionForm;
  return await fetch(`${backend_url}/transaction-forms/${_id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.NEXT_PUBLIC_TOKEN!}`,
    },
    body: JSON.stringify({ ...args }),
  });
};

export const deleteTransactionForm = async (_id: string) => {
  return await fetch(`${backend_url}/transaction-forms/${_id}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.NEXT_PUBLIC_TOKEN!}`,
    },
  });
};
