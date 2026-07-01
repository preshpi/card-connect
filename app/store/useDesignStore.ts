"use client";

import { create } from "zustand";

export interface DesignCustomization {
  headerStyle: string;
  buttonStyle: string;
  textFont: string;
  backgroundColor: string;
}

interface DesignStore {
  customization: DesignCustomization;
  setHeaderStyle: (style: string) => void;
  setButtonStyle: (style: string) => void;
  setTextFont: (font: string) => void;
  setBackgroundColor: (color: string) => void;
  setCustomization: (customization: DesignCustomization) => void;
  resetCustomization: () => void;
}

const defaultCustomization: DesignCustomization = {
  headerStyle: "Classic",
  buttonStyle: "Fill",
  textFont: "Manrope",
  backgroundColor: "Gradient",
};

export const useDesignStore = create<DesignStore>((set) => ({
  customization: defaultCustomization,

  setHeaderStyle: (style: string) =>
    set((state) => ({
      customization: { ...state.customization, headerStyle: style },
    })),

  setButtonStyle: (style: string) =>
    set((state) => ({
      customization: { ...state.customization, buttonStyle: style },
    })),

  setTextFont: (font: string) =>
    set((state) => ({
      customization: { ...state.customization, textFont: font },
    })),

  setBackgroundColor: (color: string) =>
    set((state) => ({
      customization: { ...state.customization, backgroundColor: color },
    })),

  setCustomization: (customization: DesignCustomization) =>
    set({ customization }),

  resetCustomization: () => set({ customization: defaultCustomization }),
}));
