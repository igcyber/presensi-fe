import { z } from "zod";

// Schema untuk create kategori dokumen
export const createKategoriDokumenSchema = z.object({
  nama: z
    .string()
    .min(1, "Nama kategori wajib diisi")
    .min(3, "Nama kategori minimal 3 karakter")
    .max(100, "Nama kategori maksimal 100 karakter"),
});

// Schema untuk update kategori dokumen
export const updateKategoriDokumenSchema = z.object({
  nama: z
    .string()
    .min(3, "Nama kategori minimal 3 karakter")
    .max(100, "Nama kategori maksimal 100 karakter")
    .optional(),
});

// Schema untuk kategori dokumen query parameters
export const kategoriDokumenQuerySchema = z.object({
  page: z.number().int().positive("Halaman harus berupa angka positif").optional().default(1),
  per_page: z
    .number()
    .int()
    .positive("Per page harus berupa angka positif")
    .max(100, "Maksimal 100 item per halaman")
    .optional()
    .default(10),
  search: z.string().max(100, "Search maksimal 100 karakter").optional(),
  sort_by: z.enum(["nama", "createdAt", "updatedAt"]).optional().default("nama"),
  sort_order: z.enum(["asc", "desc"]).optional().default("asc"),
});

// Types dari schema
export type CreateKategoriDokumenFormData = z.infer<typeof createKategoriDokumenSchema>;
export type UpdateKategoriDokumenFormData = z.infer<typeof updateKategoriDokumenSchema>;
export type KategoriDokumenQueryFormData = z.infer<typeof kategoriDokumenQuerySchema>;
