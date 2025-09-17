import { z } from "zod";

// Schema untuk create dokumen
export const createDokumenSchema = z.object({
  nama: z
    .string()
    .min(1, "Nama dokumen wajib diisi")
    .min(5, "Nama dokumen minimal 5 karakter")
    .max(200, "Nama dokumen maksimal 200 karakter"),
  file: z.any().refine((file) => {
    if (!file) return false; // File wajib diisi
    if (typeof file === "string") return true; // URL string
    if (file instanceof File) {
      // Validate file type - hanya PDF
      const allowedTypes = ["application/pdf"];
      return allowedTypes.includes(file.type);
    }
    return false;
  }, "File wajib diisi dan harus berupa PDF"),
  isi: z
    .string()
    .min(1, "Deskripsi dokumen wajib diisi")
    .min(10, "Deskripsi minimal 10 karakter")
    .max(1000, "Deskripsi maksimal 1000 karakter"),
});

// Schema untuk update dokumen
export const updateDokumenSchema = z.object({
  nama: z.string().min(5, "Nama dokumen minimal 5 karakter").max(200, "Nama dokumen maksimal 200 karakter").optional(),
  file: z
    .any()
    .optional()
    .refine((file) => {
      if (!file) return true; // Optional field
      if (typeof file === "string") return true; // URL string
      if (file instanceof File) {
        // Validate file type - hanya PDF
        const allowedTypes = ["application/pdf"];
        return allowedTypes.includes(file.type);
      }
      return false;
    }, "File harus berupa PDF"),
  isi: z.string().min(10, "Deskripsi minimal 10 karakter").max(1000, "Deskripsi maksimal 1000 karakter").optional(),
});

// Schema untuk dokumen query parameters
export const dokumenQuerySchema = z.object({
  page: z.number().int().positive("Halaman harus berupa angka positif").optional().default(1),
  per_page: z
    .number()
    .int()
    .positive("Per page harus berupa angka positif")
    .max(100, "Maksimal 100 item per halaman")
    .optional()
    .default(10),
  search: z.string().max(100, "Search maksimal 100 karakter").optional(),
  bulan: z.number().int().min(1).max(12).optional(),
  tahun: z.number().int().min(2020).max(2030).optional(),
  sort_by: z.enum(["nama", "createdAt", "updatedAt"]).optional().default("createdAt"),
  sort_order: z.enum(["asc", "desc"]).optional().default("desc"),
});

// Types dari schema
export type CreateDokumenFormData = z.infer<typeof createDokumenSchema>;
export type UpdateDokumenFormData = z.infer<typeof updateDokumenSchema>;
export type DokumenQueryFormData = z.infer<typeof dokumenQuerySchema>;
