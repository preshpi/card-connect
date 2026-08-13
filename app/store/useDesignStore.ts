"use client";

import { create } from "zustand";
import { ProfileDesign, SocialLink, DEFAULT_PROFILE_DESIGN } from "@/app/types/design";

export interface DesignEditorState {
  draft: ProfileDesign;
  socialLinksDraft: SocialLink[];
  isDirty: boolean;
  isSaving: boolean;
  saveStatus: "idle" | "saving" | "saved" | "error";

  setDraft: (patch: Partial<ProfileDesign>) => void;
  setSocialLinksDraft: (links: SocialLink[]) => void;
  initFromUser: (design: ProfileDesign | null | undefined, socialLinks: SocialLink[] | null | undefined) => void;
  markSaving: () => void;
  markSaved: () => void;
  markError: () => void;
}

export const useDesignStore = create<DesignEditorState>((set) => ({
  draft: DEFAULT_PROFILE_DESIGN,
  socialLinksDraft: [],
  isDirty: false,
  isSaving: false,
  saveStatus: "idle",

  setDraft: (patch: Partial<ProfileDesign>) =>
    set((state) => ({
      draft: { ...state.draft, ...patch },
      isDirty: true,
      saveStatus: "idle",
    })),

  setSocialLinksDraft: (links: SocialLink[]) =>
    set((state) => ({
      socialLinksDraft: links,
      isDirty: true,
      saveStatus: "idle",
    })),

  initFromUser: (design: ProfileDesign | null | undefined, socialLinks: SocialLink[] | null | undefined) =>
    set({
      draft: design ?? DEFAULT_PROFILE_DESIGN,
      socialLinksDraft: socialLinks ?? [],
      isDirty: false,
      isSaving: false,
      saveStatus: "idle",
    }),

  markSaving: () =>
    set({
      isSaving: true,
      saveStatus: "saving",
    }),

  markSaved: () =>
    set({
      isSaving: false,
      isDirty: false,
      saveStatus: "saved",
    }),

  markError: () =>
    set({
      isSaving: false,
      saveStatus: "error",
    }),
}));
