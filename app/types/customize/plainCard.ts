import { z } from "zod";

export const PlainCardSchema = z.object({
  pattern: z.string().default("waves"),
  patternOpacity: z.number().min(0).max(100).default(30),
  hasLogo: z.enum(["yes", "no"]).default("no"),
  logoFile: z.any().optional(),
  bgColor: z.string().min(4, "Invalid color").default("#1A2E26"),
  fontSize: z.string().default("16 px"),
  fontWidth: z.string().default("400 (Normal)"),
  fontFamily: z.string().default("Arial"),
  link: z.string().default("https://example.com"),
  text: z.string().max(100, "Text too long").default(""),
  imageSize: z.number().default(500),
});

export type PlainCardValues = z.infer<typeof PlainCardSchema>;

export type PatternType = "waves" | "zebra" | "grid" | "dots" | "geo" | "lines";
