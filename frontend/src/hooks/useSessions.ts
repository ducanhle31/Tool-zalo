"use client";

import { useEffect, useState } from "react";
import userData from "@/untils/data/user.json";

interface User {
  user_name: string;
  password: string;
}

export const useSessions = () => {
  const [user, setUser] = useState<User | null>(null);

  const logout = () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("nlk_user");
    }
    setUser(null);
  };

  const login = async ({
    user_name,
    password,
  }: {
    user_name: string;
    password: string;
  }) => {
    const user = { user_name, password };

    if (
      user_name === userData.user_name &&
      password === userData.user_pass &&
      typeof window !== "undefined"
    ) {
      localStorage.setItem("nlk_user", JSON.stringify(user));
      setUser(user);
    }
  };

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedUser = localStorage.getItem("nlk_user");
      if (storedUser) {
        setUser(JSON.parse(storedUser) as User);
      }
    }
  }, []);

  return { user, logout, login };
};
