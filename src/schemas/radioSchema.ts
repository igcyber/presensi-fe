import { z } from "zod";

// Schema untuk create radio
export const createRadioSchema = z.object({
  judul: z
    .string()
    .min(1, "Judul wajib diisi")
    .min(3, "Judul minimal 3 karakter")
    .max(200, "Judul maksimal 200 karakter"),
  isi: z.string().optional(),
  link: z.string().url("Link harus berupa URL yang valid"),
});

// Schema untuk update radio
export const updateRadioSchema = z.object({
  judul: z.string().min(3, "Judul minimal 3 karakter").max(200, "Judul maksimal 200 karakter").optional(),
  isi: z.string().optional(),
  link: z.string().url("Link harus berupa URL yang valid").optional(),
});

// Schema untuk radio query parameters
export const radioQuerySchema = z.object({
  page: z.number().int().positive("Halaman harus berupa angka positif").optional().default(1),
  per_page: z
    .number()
    .int()
    .positive("Per page harus berupa angka positif")
    .max(100, "Maksimal 100 item per halaman")
    .optional()
    .default(10),
  search: z.string().max(100, "Search maksimal 100 karakter").optional(),
  sort_by: z.enum(["judul", "createdAt", "updatedAt"]).optional().default("createdAt"),
  sort_order: z.enum(["asc", "desc"]).optional().default("desc"),
});

// Types dari schema
export type CreateRadioFormData = z.infer<typeof createRadioSchema>;
export type UpdateRadioFormData = z.infer<typeof updateRadioSchema>;
export type RadioQueryFormData = z.infer<typeof radioQuerySchema>;
