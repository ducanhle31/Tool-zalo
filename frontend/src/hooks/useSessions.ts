"use client";

import { authLogin } from "@/untils/methods/auth";
import { useToast } from "@chakra-ui/react";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface User {
  _id: string;
  user_name: string;
  name: string;
  token: string;
  facility: string | null;
  role: "admin" | null;
}

export const useSessions = () => {
  const toast = useToast();
  const router = useRouter();

  const [user, setUser] = useState<User | null>(() => {
    if (typeof window !== "undefined") {
      const storedUser = localStorage.getItem("nlk_user");
      if (storedUser) {
        return JSON.parse(storedUser);
      }
      return null;
    }

    return null;
  });

  const authLoginMutation = useMutation({
    mutationFn: authLogin,
    onSuccess: async (res) => {
      const data = await res.json();
      if (data.ok) {
        const user = data.user;
        const status = user?.status;

        if (status === "active") {
          setUser(data.user);
          data.user && localStorage.setItem("nlk_user", JSON.stringify(user));
          toast({
            title: "Đăng nhập thành công",
            status: "success",
            position: "top-right",
          });

          router.push("/private/customers");
        } else {
          toast({
            title: "Đăng nhập thất bại",
            description:
              "Tài khoản của bạn đã bị khóa vui lòng liên hệ quản trị viên!",
            status: "warning",
            position: "top-right",
          });

          localStorage.removeItem("nlk_user");
        }
      } else {
        toast({
          title: "Đăng nhập thất bại",
          description: "Thông tin đăng nhập không chính xác!",
          status: "error",
          position: "top-right",
        });
        localStorage.removeItem("nlk_user");
      }
    },
    onError: (error) => {
      setUser(null);
      localStorage.removeItem("nlk_user");
    },
  });

  const logout = () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("nlk_user");
    }
    setUser(null);

    router.push("/login");
  };

  const login = async ({
    user_name,
    password,
  }: {
    user_name: string;
    password: string;
  }) => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("nlk_user");
    }
    authLoginMutation.mutate({ user_name, password });
  };

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedUser = localStorage.getItem("nlk_user");
      if (storedUser) {
        setUser(JSON.parse(storedUser) as User);
      }
    }
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined") {
      user && localStorage.setItem("nlk_user", JSON.stringify(user));
    }
  }, [user]);

  return { user, logout, login };
};
