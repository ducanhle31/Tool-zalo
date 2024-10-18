"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";

export default function Page() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const id = searchParams.get("id");
    id && router.push(`/private/wallets/${id}`);
    !id && router.push(`/private/wallets`);
  });
  return <div>Redirecting...</div>;
}
