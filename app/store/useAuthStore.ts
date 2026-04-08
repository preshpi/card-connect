import { create } from "zustand";
import { persist } from "zustand/middleware";
import { User } from "@/app/types/auth";

interface AuthStoreState {
  user: User | null;
  setUser: (user: User) => void;
  clearUser: () => void;
}

export const useAuthStore = create<AuthStoreState>()(
  persist(
    (set) => ({
      user: null,
      setUser: (user) => set({ user }),
      clearUser: () => set({ user: null }),
    }),
    { name: "auth-storage" },
  ),
);
