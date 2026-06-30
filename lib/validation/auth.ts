import { z } from "zod";

export const loginSchema = z.object({
  phone: z.string().min(10, "Enter a valid phone number"),
  password: z.string().min(1, "Password is required"),
});

export const registerSchema = z.object({
  fullName: z.string().min(2, "Enter your full name"),
  phone: z.string().min(10, "Enter a valid phone number"),
  password: z.string().min(8, "At least 8 characters"),
});

export const otpSchema = z.object({
  phone: z.string().min(10),
  otpCode: z.string().length(6, "Enter the 6-digit code"),
});

export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;
export type OtpInput = z.infer<typeof otpSchema>;
