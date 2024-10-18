"use client";

import { Layout } from "@/layouts";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";

export default function PrivateLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathName = usePathname();

  useEffect(() => {
    if (typeof window !== "undefined") {
      const userString = localStorage.getItem("nlk_user");
      const user = userString ? JSON.parse(userString) : null;
      if (!user) {
        router?.push("/login");
      } else {
        if (pathName === "/private") router?.push("/private/customers");
      }
    }
  }, [pathName, router]);

  return <Layout>{children}</Layout>;
}
