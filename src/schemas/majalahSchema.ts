import { z } from "zod";

// Schema untuk create majalah
export const createMajalahSchema = z.object({
  bulan: z.number().int("Bulan harus berupa angka bulat").min(1, "Bulan minimal 1").max(12, "Bulan maksimal 12"),
  tahun: z
    .number()
    .int("Tahun harus berupa angka bulat")
    .min(2000, "Tahun minimal 2000")
    .max(2100, "Tahun maksimal 2100"),
  link: z.any().refine((file) => {
    if (!file) return false; // File wajib diisi
    if (typeof file === "string") return true; // URL string
    if (file instanceof File) {
      // Validate file type - hanya PDF
      const allowedTypes = ["application/pdf"];
      return allowedTypes.includes(file.type);
    }
    return false;
  }, "File wajib diisi dan format file harus berupa PDF"),
});

// Schema untuk update majalah
export const updateMajalahSchema = z.object({
  bulan: z
    .number()
    .int("Bulan harus berupa angka bulat")
    .min(1, "Bulan minimal 1")
    .max(12, "Bulan maksimal 12")
    .optional(),
  tahun: z
    .number()
    .int("Tahun harus berupa angka bulat")
    .min(2000, "Tahun minimal 2000")
    .max(2100, "Tahun maksimal 2100")
    .optional(),
  link: z
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
    }, "Format file harus berupa PDF"),
});

// Schema untuk majalah query parameters
export const majalahQuerySchema = z.object({
  page: z.number().int().positive("Halaman harus berupa angka positif").optional().default(1),
  per_page: z
    .number()
    .int()
    .positive("Per page harus berupa angka positif")
    .max(100, "Maksimal 100 item per halaman")
    .optional()
    .default(10),
  search: z.string().max(100, "Search maksimal 100 karakter").optional(),
  bulan: z
    .number()
    .int("Bulan harus berupa angka bulat")
    .min(1, "Bulan minimal 1")
    .max(12, "Bulan maksimal 12")
    .optional(),
  tahun: z
    .number()
    .int("Tahun harus berupa angka bulat")
    .min(2000, "Tahun minimal 2000")
    .max(2100, "Tahun maksimal 2100")
    .optional(),
  sort_by: z.enum(["bulan", "tahun", "createdAt", "updatedAt"]).optional().default("tahun"),
  sort_order: z.enum(["asc", "desc"]).optional().default("desc"),
});

// Types dari schema
export type CreateMajalahFormData = z.infer<typeof createMajalahSchema>;
export type UpdateMajalahFormData = z.infer<typeof updateMajalahSchema>;
export type MajalahQueryFormData = z.infer<typeof majalahQuerySchema>;
