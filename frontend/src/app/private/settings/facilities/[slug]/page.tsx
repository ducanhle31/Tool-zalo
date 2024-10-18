"use client";

import { Center, Spinner } from "@chakra-ui/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Page() {
  const router = useRouter();

  useEffect(() => {
    router?.push("/private/settings/facilities");
  }, [router]);

  return (
    <Center h={"400px"}>
      <Spinner />
    </Center>
  );
}
