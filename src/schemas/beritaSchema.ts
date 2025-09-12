import { z } from "zod";

// Schema untuk create berita
export const createBeritaSchema = z.object({
  opdId: z.number().int().positive("OPD ID harus berupa angka positif").min(1, "OPD wajib dipilih"),
  judul: z
    .string()
    .min(1, "Judul wajib diisi")
    .min(5, "Judul minimal 5 karakter")
    .max(200, "Judul maksimal 200 karakter"),
  isi: z
    .string()
    .min(1, "Isi berita wajib diisi")
    .refine((value) => {
      // Hapus semua tag HTML dan hitung karakter alphabet saja
      const textOnly = value.replace(/<[^>]*>/g, "").replace(/&[^;]+;/g, "");
      const alphabetOnly = textOnly.replace(/[^a-zA-Z]/g, "");
      return alphabetOnly.length >= 10;
    }, "Isi berita minimal 10 karakter alphabet"),
  foto: z.any().refine((file) => {
    if (!file) return false; // Foto wajib diisi
    if (typeof file === "string") return true; // URL string
    if (file instanceof File) {
      // Validate file type
      const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
      return allowedTypes.includes(file.type);
    }
    return false;
  }, "Foto wajib diisi dan format file harus berupa JPG, PNG, atau WebP"),
  keterangan: z.string().max(500, "Keterangan maksimal 500 karakter").optional(),
  tag: z.string().min(1, "Tag wajib diisi").min(2, "Tag minimal 2 karakter").max(200, "Tag maksimal 200 karakter"),
});

// Schema untuk update berita
export const updateBeritaSchema = z.object({
  opdId: z.number().int().positive("OPD ID harus berupa angka positif").min(1, "OPD wajib dipilih").optional(),
  judul: z.string().min(5, "Judul minimal 5 karakter").max(200, "Judul maksimal 200 karakter").optional(),
  isi: z.string().min(10, "Isi berita minimal 10 karakter").optional(),
  foto: z
    .any()
    .optional()
    .refine((file) => {
      if (!file) return true; // Optional field
      if (typeof file === "string") return true; // URL string
      if (file instanceof File) {
        // Validate file type
        const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
        return allowedTypes.includes(file.type);
      }
      return false;
    }, "Format file harus berupa JPG, PNG, atau WebP"),
  keterangan: z.string().max(500, "Keterangan maksimal 500 karakter").optional(),
  tag: z.string().min(2, "Tag minimal 2 karakter").max(200, "Tag maksimal 200 karakter").optional(),
});

// Schema untuk berita query parameters
export const beritaQuerySchema = z.object({
  page: z.number().int().positive("Halaman harus berupa angka positif").optional().default(1),
  per_page: z
    .number()
    .int()
    .positive("Per page harus berupa angka positif")
    .max(100, "Maksimal 100 item per halaman")
    .optional()
    .default(10),
  search: z.string().max(100, "Search maksimal 100 karakter").optional(),
  opd: z.string().max(50, "OPD maksimal 50 karakter").optional(),
  tag: z.string().max(50, "Tag maksimal 50 karakter").optional(),
  sort_by: z.enum(["judul", "createdAt", "updatedAt"]).optional().default("createdAt"),
  sort_order: z.enum(["asc", "desc"]).optional().default("desc"),
});

// Types dari schema
export type CreateBeritaFormData = z.infer<typeof createBeritaSchema>;
export type UpdateBeritaFormData = z.infer<typeof updateBeritaSchema>;
export type BeritaQueryFormData = z.infer<typeof beritaQuerySchema>;
