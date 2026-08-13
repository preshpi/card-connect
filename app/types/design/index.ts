export type ThemeId = "minimal" | "spotlight";
export type ButtonStyle = "filled" | "outline" | "soft";
export type ProfileShape = "circle" | "rounded-square";
export type LinkStyle = "button" | "card" | "split-card";
export type FontId = "manrope" | "poppins" | "inter" | "playfair";
export type SocialPlatform =
  | "instagram"
  | "x"
  | "linkedin"
  | "github"
  | "tiktok"
  | "youtube"
  | "facebook";

export interface ProfileDesign {
  theme: ThemeId;
  backgroundColor: string; // hex, e.g. "#FFFFFF"
  textColor: string; // hex
  buttonColor: string; // hex
  buttonStyle: ButtonStyle;
  font: FontId;
  profileShape: ProfileShape;
  linkStyle: LinkStyle;
  coverImage?: string | null; // Spotlight-only; Cloudinary secure_url
  showSocialIcons: boolean; // show/hide social icons row
}

export interface SocialLink {
  platform: SocialPlatform;
  url: string;
}

export const DEFAULT_PROFILE_DESIGN: ProfileDesign = {
  theme: "minimal",
  backgroundColor: "#FFFFFF",
  textColor: "#111111",
  buttonColor: "#7269E3",
  buttonStyle: "filled",
  font: "manrope",
  profileShape: "circle",
  linkStyle: "button",
  coverImage: null,
  showSocialIcons: true,
};

/**
 * Backend contract notes (for handing off to backend developer):
 *
 * 1. GET /profile and GET /profile/:username should return `design: ProfileDesign` on the user object.
 *    If null/absent, frontend falls back to DEFAULT_PROFILE_DESIGN.
 *
 * 2. PATCH /profile accepts optional `design` and `socialLinks` keys — whole-object/whole-array replace, not deep merge.
 *    Example payload:
 *    {
 *      "design": { ... ProfileDesign object ... },
 *      "socialLinks": [ { platform: "instagram", url: "..." }, ... ]
 *    }
 *
 * 3. Validation to implement:
 *    - theme: one of ["minimal", "spotlight"]
 *    - buttonStyle: one of ["filled", "outline", "soft"]
 *    - profileShape: one of ["circle", "rounded-square"]
 *    - linkStyle: one of ["button", "card", "split-card"]
 *    - font: one of ["manrope", "poppins", "inter", "playfair"]
 *    - backgroundColor/textColor/buttonColor: match ^#[0-9A-Fa-f]{6}$
 *    - coverImage: nullable URL (server should null it out when theme !== "spotlight")
 *    - showSocialIcons: boolean
 *    - socialLinks[].platform: one of the SocialPlatform enum
 *    - socialLinks[].url: valid URL
 */
