import { Manrope, Poppins, Inter, Playfair_Display } from "next/font/google";
import { FontId } from "@/app/types/design";

export const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-manrope",
  weight: ["400", "500", "600", "700"],
});

export const poppins = Poppins({
  subsets: ["latin"],
  variable: "--font-poppins",
  weight: ["400", "500", "600", "700"],
});

export const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
});

export const FONT_VARIABLES = `${manrope.variable} ${poppins.variable} ${inter.variable} ${playfair.variable}`;

export const FONT_CLASS_MAP: Record<FontId, string> = {
  manrope: "font-manrope",
  poppins: "font-poppins",
  inter: "font-inter",
  playfair: "font-playfair",
};
