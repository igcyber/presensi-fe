import { z } from "zod";

// Schema untuk create user
export const createUserSchema = z
  .object({
    fullName: z
      .string()
      .min(1, "Nama lengkap wajib diisi")
      .min(2, "Nama lengkap minimal 2 karakter")
      .max(100, "Nama lengkap maksimal 100 karakter"),
    email: z.string().min(1, "Email wajib diisi").email("Format email tidak valid"),
    username: z
      .string()
      .min(1, "Username wajib diisi")
      .min(3, "Username minimal 3 karakter")
      .max(50, "Username maksimal 50 karakter")
      .regex(/^[a-zA-Z0-9_]+$/, "Username hanya boleh mengandung huruf, angka, dan underscore"),
    nip: z
      .string()
      .min(1, "NIP wajib diisi")
      .min(8, "NIP minimal 8 karakter")
      .max(20, "NIP maksimal 20 karakter")
      .regex(/^[0-9]+$/, "NIP hanya boleh mengandung angka"),
    password: z
      .string()
      .min(1, "Password wajib diisi")
      .min(6, "Password minimal 6 karakter")
      .max(50, "Password maksimal 50 karakter"),
    confirmPassword: z.string().min(1, "Konfirmasi password wajib diisi"),
    roles: z.array(z.number().int().positive("Role ID harus berupa angka positif")).min(1, "Minimal pilih satu role"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Konfirmasi password tidak cocok",
    path: ["confirmPassword"],
  });

// Schema untuk update user
export const updateUserSchema = z.object({
  fullName: z
    .string()
    .min(2, "Nama lengkap minimal 2 karakter")
    .max(100, "Nama lengkap maksimal 100 karakter")
    .optional(),
  email: z.string().email("Format email tidak valid").optional(),
  username: z
    .string()
    .min(3, "Username minimal 3 karakter")
    .max(50, "Username maksimal 50 karakter")
    .regex(/^[a-zA-Z0-9_]+$/, "Username hanya boleh mengandung huruf, angka, dan underscore")
    .optional(),
  nip: z
    .string()
    .min(8, "NIP minimal 8 karakter")
    .max(20, "NIP maksimal 20 karakter")
    .regex(/^[0-9]+$/, "NIP hanya boleh mengandung angka")
    .optional(),
  roles: z
    .array(z.number().int().positive("Role ID harus berupa angka positif"))
    .min(1, "Minimal pilih satu role")
    .optional(),
});

// Schema untuk user query parameters
export const userQuerySchema = z.object({
  page: z.number().int().positive("Halaman harus berupa angka positif").optional().default(1),
  per_page: z
    .number()
    .int()
    .positive("Per page harus berupa angka positif")
    .max(100, "Maksimal 100 item per halaman")
    .optional()
    .default(10),
  search: z.string().max(100, "Search maksimal 100 karakter").optional(),
  role: z.string().max(50, "Role maksimal 50 karakter").optional(),
  sort_by: z.enum(["fullName", "email", "username", "nip", "createdAt", "updatedAt"]).optional().default("createdAt"),
  sort_order: z.enum(["asc", "desc"]).optional().default("desc"),
});

// Types dari schema
export type CreateUserFormData = z.infer<typeof createUserSchema>;
export type UpdateUserFormData = z.infer<typeof updateUserSchema>;
export type UserQueryFormData = z.infer<typeof userQuerySchema>;
