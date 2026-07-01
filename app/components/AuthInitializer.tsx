"use client";

import { useEffect } from "react";
import { useGetUser } from "@/app/services/auth";
import { useAuthStore } from "@/app/store/useAuthStore";

export default function AuthInitializer() {
  const { data, isSuccess } = useGetUser();
  const setUser = useAuthStore((state) => state.setUser);

  useEffect(() => {
    if (isSuccess && data?.data) {
      setUser(data.data);
    }
  }, [isSuccess, data, setUser]);

  return null;
}
