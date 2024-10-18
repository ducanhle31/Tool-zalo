import { CustomerPreview } from "@/types/global";

const backend_url = process.env.NEXT_PUBLIC_API_URL!;

export const importCustommers = async (file: File) => {
  const formData = new FormData();
  formData.append("file", file);

  return await fetch(`${backend_url}/customers/import`, {
    method: "POST",
    headers: { Authorization: `Bearer ${process.env.NEXT_PUBLIC_TOKEN!}` },
    body: formData,
  });
};

export const createCustomer = async (
  customer: Omit<
    CustomerPreview,
    "_id" | "createdAt" | "updatedAt" | "metadata"
  >
) => {
  return await fetch(`${backend_url}/customers`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.NEXT_PUBLIC_TOKEN!}`,
    },
    body: JSON.stringify(customer),
  });
};

export const updateCustomer = async (
  customer: Omit<CustomerPreview, "createdAt" | "updatedAt">
) => {
  const { _id, ...args } = customer;
  return await fetch(`${backend_url}/customers/${customer?._id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.NEXT_PUBLIC_TOKEN!}`,
    },
    body: JSON.stringify(args),
  });
};

export const deleteCustomer = async (_id: string) => {
  return await fetch(`${backend_url}/customers/${_id}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.NEXT_PUBLIC_TOKEN!}`,
    },
  });
};
