import { z } from "zod";

// Schema untuk create tag
export const createTagSchema = z.object({
  namaTag: z
    .string()
    .min(1, "Nama tag wajib diisi")
    .min(3, "Nama tag minimal 3 karakter")
    .max(100, "Nama tag maksimal 100 karakter"),
});

// Schema untuk update tag
export const updateTagSchema = z.object({
  namaTag: z.string().min(3, "Nama tag minimal 3 karakter").max(100, "Nama tag maksimal 100 karakter").optional(),
});

// Schema untuk tag query parameters
export const tagQuerySchema = z.object({
  page: z.number().int().positive("Halaman harus berupa angka positif").optional().default(1),
  per_page: z
    .number()
    .int()
    .positive("Per page harus berupa angka positif")
    .max(100, "Maksimal 100 item per halaman")
    .optional()
    .default(10),
  search: z.string().max(100, "Search maksimal 100 karakter").optional(),
  sort_by: z.enum(["namaTag", "createdAt", "updatedAt"]).optional().default("createdAt"),
  sort_order: z.enum(["asc", "desc"]).optional().default("desc"),
});

// Types dari schema
export type CreateTagFormData = z.infer<typeof createTagSchema>;
export type UpdateTagFormData = z.infer<typeof updateTagSchema>;
export type TagQueryFormData = z.infer<typeof tagQuerySchema>;
