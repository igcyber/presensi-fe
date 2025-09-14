import { z } from "zod";

// Schema untuk create role
export const createRoleSchema = z.object({
  name: z
    .string()
    .min(1, "Nama role wajib diisi")
    .min(2, "Nama role minimal 2 karakter")
    .max(50, "Nama role maksimal 50 karakter")
    .regex(/^[a-zA-Z0-9\s_-]+$/, "Nama role hanya boleh mengandung huruf, angka, spasi, underscore, dan dash"),
});

// Schema untuk update role
export const updateRoleSchema = z.object({
  name: z
    .string()
    .min(2, "Nama role minimal 2 karakter")
    .max(50, "Nama role maksimal 50 karakter")
    .regex(/^[a-zA-Z0-9\s_-]+$/, "Nama role hanya boleh mengandung huruf, angka, spasi, underscore, dan dash")
    .optional(),
});

// Schema untuk role query parameters
export const roleQuerySchema = z.object({
  page: z.number().int().positive("Halaman harus berupa angka positif").optional().default(1),
  per_page: z
    .number()
    .int()
    .positive("Per page harus berupa angka positif")
    .max(100, "Maksimal 100 item per halaman")
    .optional()
    .default(10),
  search: z.string().max(100, "Search maksimal 100 karakter").optional(),
  sort_by: z.enum(["name", "description", "createdAt", "updatedAt"]).optional().default("createdAt"),
  sort_order: z.enum(["asc", "desc"]).optional().default("desc"),
});

// Types dari schema
export type CreateRoleFormData = z.infer<typeof createRoleSchema>;
export type UpdateRoleFormData = z.infer<typeof updateRoleSchema>;
export type RoleQueryFormData = z.infer<typeof roleQuerySchema>;
