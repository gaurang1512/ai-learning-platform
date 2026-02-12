import { z } from "zod";

const registerSchema = z.object({
  name: z.string().min(4, "Name must be atleat 4 character long"),
  email: z.string().email("Invalid Email format"),
  password: z
    .string()
    .min(8, "Password must contain atleast 8 characters long")
    .regex(
      /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>/?]/,
      "Password must contain atleast one special character",
    ),
});

export const teacherRegisterSchema = z.object({
  name: z.string().min(4, "Name must be atleat 4 character long"),
  email: z.string().email("Invalid Email format"),
  password: z
    .string()
    .min(8, "Password must contain atleast 8 characters long")
    .regex(
      /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>/?]/,
      "Password must contain atleast one special character",
    ),
});

export const studentRegisterSchema = z.object({
  name: z.string().min(4, "Name must be atleat 4 character long"),
  email: z.string().email("Invalid Email format"),
  password: z
    .string()
    .min(8, "Password must contain atleast 8 characters long")
    .regex(
      /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>/?]/,
      "Password must contain atleast one special character",
    ),
});

export const loginSchema = z.object({
  email: z.string().email("Invalid Email format"),
  password: z
    .string()
    .min(8, "Invalid credentials")
    .regex(/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>/?]/, "Invalid credentials"),
});

export const forgotPasswordSchema = z.object({
  email: z.string().email("Invalid Email format"),
});

export const verifyOtpSchema = z.object({
  email: z.string().email("Invalid Email format"),
  otp: z.string().length(6, "OTP must be 6 digits"),
});

export const resetPasswordSchema = z.object({
  password: z
    .string()
    .min(8, "Password must contain atleast 8 characters long")
    .regex(
      /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>/?]/,
      "Password must contain atleast one special character",
    ),
});

export default registerSchema;
