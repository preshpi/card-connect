import { z } from "zod";

export const signupSchema = z
  .object({
    firstname: z
      .string("First Name is required")
      .min(1, "First Name is required"),
    lastname: z.string("Last Name is required").min(1, "Last Name is required"),
    email: z.email("Invalid email address"),
    password: z.string().min(10, "Password must be at least 10 characters"),
    phone: z.string().min(10, "Phone number must be at least 10 characters"),
    confirmPassword: z
      .string("Confirm Password is required")
      .min(10, "Confirm Password is required"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Password must match",
    path: ["confirmPassword"],
  });

export type TsignupSchema = z.infer<typeof signupSchema>;
