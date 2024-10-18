import { WalletPreview } from "@/types/global";

const backend_url = process.env.NEXT_PUBLIC_API_URL!;

export const createWallet = async (
  wallet: Omit<
    WalletPreview,
    "_id" | "createdAt" | "updatedAt" | "metadata" | "current_balance"
  >
) => {
  return await fetch(`${backend_url}/wallets`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.NEXT_PUBLIC_TOKEN!}`,
    },
    body: JSON.stringify(wallet),
  });
};

export const updateStatusWallet = async (
  wallet: Omit<
    WalletPreview,
    "createdAt" | "updatedAt" | "metadata" | "current_balance" | "customer"
  >
) => {
  const { _id, status } = wallet;
  return await fetch(`${backend_url}/wallets/${_id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.NEXT_PUBLIC_TOKEN!}`,
    },
    body: JSON.stringify({ status }),
  });
};

export const deleteWallet = async (_id: string) => {
  return await fetch(`${backend_url}/wallets/${_id}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.NEXT_PUBLIC_TOKEN!}`,
    },
  });
};
