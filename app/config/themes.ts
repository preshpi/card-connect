import { ThemeId } from "@/app/types/design";

export interface ThemeDefinition {
  id: ThemeId;
  name: string;
  description: string;
  layout: {
    hasCover: boolean;
    profileAlignment: "center" | "left";
    profileOverlapsCover: boolean;
    typeScale: "normal" | "large";
  };
}

export const THEMES: ThemeDefinition[] = [
  {
    id: "minimal",
    name: "Minimal",
    description: "Centered, whitespace-first, circle photo",
    layout: {
      hasCover: false,
      profileAlignment: "center",
      profileOverlapsCover: false,
      typeScale: "normal",
    },
  },
  {
    id: "spotlight",
    name: "Spotlight",
    description: "Large cover, overlapping photo, creator-first",
    layout: {
      hasCover: true,
      profileAlignment: "center",
      profileOverlapsCover: true,
      typeScale: "large",
    },
  },
];
