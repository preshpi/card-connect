import { z } from "zod";

export const CodeCardSchema = z.object({
  fullName: z.string().min(2, "Name is too short"),
  role: z.string().min(2, "Role is required"),
  email: z.string().email("Invalid email address"),
  link: z.string().url("Must be a valid URL").or(z.string().length(0)),
  availableForJob: z.string().min(1, "Please select an option"),
});

export type CodeCardValues = z.infer<typeof CodeCardSchema>;
