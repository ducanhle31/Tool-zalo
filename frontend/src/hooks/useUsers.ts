"use client";

import { User, UserPreview } from "@/types/global";
import { instance } from "@/untils/instance";
import { useEffect, useState } from "react";

export const useUsers = () => {
  const [users, setUsers] = useState<UserPreview[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const getUsers = async () => {
      setIsLoading(true);
      const response = await instance.get(`users`);
      const data = await response.data;
      const users = data?.users;
      users && setUsers(users);
      setIsLoading(false);
    };

    getUsers();
  }, []);

  return {
    users,
    isLoading,
  };
};

export const useUser = (id: string) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const getUser = async () => {
      setIsLoading(true);
      try {
        const response = await instance.get(`users/${id}`);
        const data = await response.data;
        const user = data?.user;
        user && setUser(user);
        setIsLoading(false);
      } catch (error) {
        setIsLoading(false);
      }
    };

    getUser();
  }, [id]);

  return {
    user,
    isLoading,
  };
};
