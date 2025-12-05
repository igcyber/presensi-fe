import { z } from "zod";

// Schema untuk login
export const loginSchema = z.object({
  username: z.string().min(1, "Username wajib diisi"),
  password: z.string().min(1, "Password wajib diisi").min(6, "Password minimal 6 karakter"),
});

// Schema untuk register
export const registerSchema = z
  .object({
    fullname: z
      .string()
      .min(1, "Nama lengkap wajib diisi")
      .min(2, "Nama lengkap minimal 2 karakter")
      .max(100, "Nama lengkap maksimal 100 karakter"),
    username: z.string().min(1, "Username wajib diisi"),
    password: z
      .string()
      .min(1, "Password wajib diisi")
      .min(6, "Password minimal 6 karakter")
      .max(50, "Password maksimal 50 karakter"),
    confirmPassword: z.string().min(1, "Konfirmasi password wajib diisi"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Konfirmasi password tidak cocok",
    path: ["confirmPassword"],
  });

// Schema untuk forgot password
export const forgotPasswordSchema = z.object({
  username: z.string().min(1, "Username wajib diisi"),
});

// Schema untuk reset password
export const resetPasswordSchema = z
  .object({
    token: z.string().min(1, "Token wajib diisi"),
    password: z
      .string()
      .min(1, "Password wajib diisi")
      .min(6, "Password minimal 6 karakter")
      .max(50, "Password maksimal 50 karakter"),
    confirmPassword: z.string().min(1, "Konfirmasi password wajib diisi"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Konfirmasi password tidak cocok",
    path: ["confirmPassword"],
  });

// Schema untuk update profile (manajemen user)
export const updateProfileSchema = z.object({
  fullName: z.string().trim().optional(),
  username: z.string().trim().optional(),
  nip: z.string().trim().optional(),
  email: z.string().trim().email("Format email tidak valid").optional(),
});

// Schema untuk update profile
export const updateSelfProfileSchema = z.object({
  nama: z.string().min(1, "Nama lengkap wajib diisi").max(255, "Nama lengkap maksimal 255 karakter"),
  email: z.string().min(1, "Email wajib diisi").email("Format email tidak valid"),
  username: z
    .string()
    .min(3, "Username minimal 3 karakter")
    .max(255, "Username maksimal 255 karakter")
    .regex(/^[a-zA-Z0-9_.]+$/, "Username hanya boleh huruf, angka, titik, dan underscore"),
  no_hp: z
    .string()
    .min(1, "No. Handphone wajib diisi")
    .regex(/^[0-9]+$/, "No. Handphone hanya boleh angka"),
});

// Schema untuk change password
export const changePasswordSchema = z
  .object({
    oldPassword: z.string().min(8, "Password lama minimal 8 karakter"),
    password: z.string().min(8, "Password baru minimal 8 karakter"),
    password_confirmation: z.string().min(1, "Konfirmasi password wajib diisi"),
  })
  .refine((data) => data.password === data.password_confirmation, {
    message: "Konfirmasi password tidak cocok",
    path: ["password_confirmation"],
  })
  .refine((data) => data.oldPassword !== data.password, {
    message: "Password baru harus berbeda dengan password lama",
    path: ["password"],
  });

// Types dari schema
export type LoginFormData = z.infer<typeof loginSchema>;
export type RegisterFormData = z.infer<typeof registerSchema>;
export type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;
export type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>;
export type UpdateProfileFormData = z.infer<typeof updateProfileSchema>;
export type UpdateSelfProfileFormData = z.infer<typeof updateSelfProfileSchema>;
export type ChangePasswordFormData = z.infer<typeof changePasswordSchema>;
