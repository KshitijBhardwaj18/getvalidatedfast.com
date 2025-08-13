import { z } from "zod";

export const LoginSchema = z.object({
  email: z.string().email("Enter a valid email address"),
  password: z.string(),
  otp : z.optional(z.string())
});

export const SignUpSchema = z.object({
  name: z.string().min(3, "Are you sure name is that"),
  email: z.string().email("Enter a valid email address"),
  password: z.string().min(8, "Password should be of minimum length 8"),
});

export const resetPasswordSchema = z.object({
  email: z.string().email("Enter a valid email address"),
});

export const newPasswordSchema = z.object({
  password: z.string().min(8, "Password should be of minimum length 8"),
});

export const twoFactorCodeSchema = z.object({
  otp : z.string()
})
