import { z } from "zod";

export const loginSchema = z.object({
  phone: z.string().min(10, "Enter a valid phone number"),
  password: z.string().min(1, "Password is required"),
});

export const registerSchema = z.object({
  fullName: z.string().min(2, "Enter your full name"),
  phone: z.string().min(10, "Enter a valid phone number"),
  password: z.string().min(8, "At least 8 characters"),
  referralCode: z.string().trim().max(32, "Invite code is too long").refine((value) => value === "" || value.length >= 4, "Enter a valid invite code").optional(),
});

export const otpSchema = z.object({
  phone: z.string().min(10),
  otpCode: z.string().length(6, "Enter the 6-digit code"),
});

export const forgotPasswordSchema = z.object({
  phone: z.string().min(10, "Enter a valid phone number"),
});

export const resetPasswordSchema = z
  .object({
    otpCode: z.string().length(6, "Enter the 6-digit code"),
    newPassword: z.string().min(8, "At least 8 characters"),
    confirmPassword: z.string().min(1, "Confirm your new password"),
  })
  .refine((values) => values.newPassword === values.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords do not match",
  });

export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;
export type OtpInput = z.infer<typeof otpSchema>;
export type ForgotPasswordInput = z.infer<typeof forgotPasswordSchema>;
export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>;
