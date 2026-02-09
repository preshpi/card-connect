import { create } from "zustand";
import { persist } from "zustand/middleware";
import { CodeCardValues } from "../types/customize/codeCard";
import { PlainCardValues } from "../types/customize/plainCard"; // <-- create this type

interface BuilderState extends CodeCardValues {
  selectedTemplate: "code" | "plain" | null;
  plainCardValues: PlainCardValues;
  setDetails: (values: Partial<CodeCardValues>) => void;
  setPlainDetails: (values: Partial<PlainCardValues>) => void;
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
      theme: "light",
      plainCardValues: {
        // initialize with default values for plain card
        pattern: "",
        patternOpacity: 100,
        bgColor: "#FFFFFF",
        hasLogo: "no",
        logoFile: null,
        imageSize: 40,
        logoPosition: "center",
        logoSpacing: 16,
        text: "",
        fontSize: "16 px",
        fontWidth: "400 (Normal)",
        fontFamily: "Arial",
        link: "",
      },
      setDetails: (values) => set((state) => ({ ...state, ...values })),
      setPlainDetails: (values) =>
        set((state) => ({
          plainCardValues: { ...state.plainCardValues, ...values },
        })),
      setTemplate: (type) => set({ selectedTemplate: type }),
    }),
    { name: "builder-storage" },
  ),
);
