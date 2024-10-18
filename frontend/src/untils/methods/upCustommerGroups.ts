import { CustomerGroup } from "@/types/global";

const backend_url = process.env.NEXT_PUBLIC_API_URL!;

export const importCustommerGroups = async (file: File) => {
  const formData = new FormData();
  formData.append("file", file);

  return await fetch(`${backend_url}/customer-groups/import`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.NEXT_PUBLIC_TOKEN!}`,
    },
    body: formData,
  });
};

export const createCustomerGroup = async (
  customer: Omit<CustomerGroup, "_id" | "createdAt" | "updatedAt" | "metadata">
) => {
  return await fetch(`${backend_url}/customer-groups`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.NEXT_PUBLIC_TOKEN!}`,
    },
    body: JSON.stringify(customer),
  });
};

export const updateCustomerGroup = async (
  customerGroup: Omit<CustomerGroup, "createdAt" | "updatedAt">
) => {
  const { _id, ...args } = customerGroup;
  return await fetch(`${backend_url}/customer-groups/${_id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.NEXT_PUBLIC_TOKEN!}`,
    },
    body: JSON.stringify(args),
  });
};

export const deleteCustomerGroup = async (_id: string) => {
  return await fetch(`${backend_url}/customer-groups/${_id}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.NEXT_PUBLIC_TOKEN!}`,
    },
  });
};
