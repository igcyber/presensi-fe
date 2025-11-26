import { z } from "zod";

// Schema untuk create kios
export const createKiosSchema = z.object({
  kode: z.string().min(1, "Kode wajib diisi").min(1, "Kode minimal 1 karakter").max(50, "Kode maksimal 50 karakter"),
  jenisUsahaId: z.number().int().positive("Jenis usaha wajib dipilih"),
  pasarId: z.number().int().positive("Pasar wajib dipilih"),
});

// Schema untuk update kios
export const updateKiosSchema = z.object({
  kode: z.string().min(1, "Kode minimal 1 karakter").max(50, "Kode maksimal 50 karakter").optional(),
  jenisUsahaId: z.number().int().positive("Jenis usaha wajib dipilih").optional(),
  pasarId: z.number().int().positive("Pasar wajib dipilih").optional(),
});

// Schema untuk kios query parameters
export const kiosQuerySchema = z.object({
  page: z.number().int().positive("Halaman harus berupa angka positif").optional().default(1),
  perPage: z
    .number()
    .int()
    .positive("Per page harus berupa angka positif")
    .max(100, "Maksimal 100 item per halaman")
    .optional()
    .default(10),
  search: z.string().max(100, "Search maksimal 100 karakter").optional(),
  sort_by: z.enum(["kode", "jenisUsahaId", "pasarId", "createdAt", "updatedAt"]).optional().default("createdAt"),
  sort_order: z.enum(["asc", "desc"]).optional().default("desc"),
});

// Types dari schema
export type CreateKiosFormData = z.infer<typeof createKiosSchema>;
export type UpdateKiosFormData = z.infer<typeof updateKiosSchema>;
export type KiosQueryFormData = z.infer<typeof kiosQuerySchema>;

