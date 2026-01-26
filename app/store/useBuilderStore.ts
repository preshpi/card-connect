import { create } from "zustand";
import { persist } from "zustand/middleware";
import { CodeCardValues } from "../types/customize/codeCard";

interface BuilderState extends CodeCardValues {
  selectedTemplate: "code" | "plain" | null;
  setDetails: (values: Partial<CodeCardValues>) => void;
  setTemplate: (type: "code" | "plain") => void;
}
export const useBuilderStore = create<BuilderState>()(
  persist(
    (set) => ({
      selectedTemplate: "code",
      fullName: "",
      role: "",
      email: "",
      link: "",
      availableForJob: "",
      setDetails: (values) => set((state) => ({ ...state, ...values })),
      setTemplate: (type) => set({ selectedTemplate: type }),
    }),
    { name: "builder-storage" },
  ),
);
