import { z } from "zod";

// Schema untuk create user
export const createUserSchema = z
  .object({
    name: z
      .string()
      .min(1, "Nama lengkap wajib diisi")
      .min(2, "Nama lengkap minimal 2 karakter")
      .max(100, "Nama lengkap maksimal 100 karakter"),
    username: z
      .string()
      .min(1, "Username wajib diisi")
      .min(3, "Username minimal 3 karakter")
      .max(50, "Username maksimal 50 karakter")
      .regex(/^[a-zA-Z0-9_]+$/, "Username hanya boleh berisi huruf, angka, dan underscore"),
    no_hp: z
      .string()
      .min(1, "No. HP wajib diisi")
      .regex(/^[0-9]+$/, "No. HP hanya boleh berisi angka")
      .min(10, "No. HP minimal 10 digit")
      .max(15, "No. HP maksimal 15 digit"),
    email: z.string().min(1, "Email wajib diisi").email("Format email tidak valid"),
    role: z.number().min(1, "Role wajib dipilih"),
    password: z
      .string()
      .min(1, "Password wajib diisi")
      .min(6, "Password minimal 6 karakter")
      .max(50, "Password maksimal 50 karakter"),
    password_confirmation: z.string().min(1, "Konfirmasi password wajib diisi"),
  })
  .refine((data) => data.password === data.password_confirmation, {
    message: "Konfirmasi password tidak cocok",
    path: ["password_confirmation"],
  });

// Schema untuk update user
export const updateUserSchema = z.object({
  id: z.string().min(1, "ID user wajib diisi"),
  name: z
    .string()
    .min(1, "Nama lengkap wajib diisi")
    .min(2, "Nama lengkap minimal 2 karakter")
    .max(100, "Nama lengkap maksimal 100 karakter"),
  username: z
    .string()
    .min(1, "Username wajib diisi")
    .min(3, "Username minimal 3 karakter")
    .max(50, "Username maksimal 50 karakter")
    .regex(/^[a-zA-Z0-9_]+$/, "Username hanya boleh berisi huruf, angka, dan underscore"),
  no_hp: z
    .string()
    .min(1, "No. HP wajib diisi")
    .regex(/^[0-9]+$/, "No. HP hanya boleh berisi angka")
    .min(10, "No. HP minimal 10 digit")
    .max(15, "No. HP maksimal 15 digit"),
  email: z.string().min(1, "Email wajib diisi").email("Format email tidak valid"),
  role: z.number().min(1, "Role wajib dipilih"),
});

// Schema untuk bulk actions
export const bulkUserActionSchema = z.object({
  userIds: z.array(z.string()).min(1, "Minimal pilih satu user"),
  action: z.enum(["delete", "activate", "deactivate"], {
    errorMap: () => ({ message: "Aksi tidak valid" }),
  }),
});

// Schema untuk update user profile (tanpa role dan user_type)
export const updateProfileSchema = z.object({
  name: z
    .string()
    .min(1, "Nama lengkap wajib diisi")
    .min(2, "Nama lengkap minimal 2 karakter")
    .max(100, "Nama lengkap maksimal 100 karakter"),
  username: z
    .string()
    .min(1, "Username wajib diisi")
    .min(3, "Username minimal 3 karakter")
    .max(50, "Username maksimal 50 karakter")
    .regex(/^[a-zA-Z0-9_]+$/, "Username hanya boleh berisi huruf, angka, dan underscore"),
  no_hp: z
    .string()
    .min(1, "No. HP wajib diisi")
    .regex(/^[0-9]+$/, "No. HP hanya boleh berisi angka")
    .min(10, "No. HP minimal 10 digit")
    .max(15, "No. HP maksimal 15 digit"),
  email: z.string().min(1, "Email wajib diisi").email("Format email tidak valid"),
});

// Types dari schema
export type CreateUserFormData = z.infer<typeof createUserSchema>;
export type UpdateUserFormData = z.infer<typeof updateUserSchema>;
export type BulkUserActionData = z.infer<typeof bulkUserActionSchema>;
export type UpdateProfileFormData = z.infer<typeof updateProfileSchema>;
