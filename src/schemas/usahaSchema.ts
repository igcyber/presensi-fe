import { z } from "zod";

// Schema untuk create jenis usaha
export const createJenisUsahaSchema = z.object({
  nama: z.string().min(1, "Nama wajib diisi").min(2, "Nama minimal 2 karakter").max(100, "Nama maksimal 100 karakter"),
  warna: z
    .string()
    .min(1, "Warna wajib diisi")
    .regex(/^#[0-9A-Fa-f]{6}$/, "Format warna harus berupa hex color (contoh: #FF69B4)"),
});

// Schema untuk update jenis usaha
export const updateJenisUsahaSchema = z.object({
  nama: z.string().min(2, "Nama minimal 2 karakter").max(100, "Nama maksimal 100 karakter").optional(),
  warna: z
    .string()
    .regex(/^#[0-9A-Fa-f]{6}$/, "Format warna harus berupa hex color (contoh: #FF69B4)")
    .optional(),
});

// Schema untuk jenis usaha query parameters
export const jenisUsahaQuerySchema = z.object({
  page: z.number().int().positive("Halaman harus berupa angka positif").optional().default(1),
  perPage: z
    .number()
    .int()
    .positive("Per page harus berupa angka positif")
    .max(100, "Maksimal 100 item per halaman")
    .optional()
    .default(10),
  search: z.string().max(100, "Search maksimal 100 karakter").optional(),
  sort_by: z.enum(["nama", "warna", "createdAt", "updatedAt"]).optional().default("createdAt"),
  sort_order: z.enum(["asc", "desc"]).optional().default("desc"),
});

// Types dari schema
export type CreateJenisUsahaFormData = z.infer<typeof createJenisUsahaSchema>;
export type UpdateJenisUsahaFormData = z.infer<typeof updateJenisUsahaSchema>;
export type JenisUsahaQueryFormData = z.infer<typeof jenisUsahaQuerySchema>;
