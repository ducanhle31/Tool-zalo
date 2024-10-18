"use client";

import { useSessions } from "@/hooks/useSessions";
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
  const { user } = useSessions();

  useEffect(() => {
    if (!user) {
      router?.push("/login");
    } else {
      if (pathName === "/private") router?.push("/private/customers");
    }
  }, [pathName, router, user]);

  return <Layout>{children}</Layout>;
}
