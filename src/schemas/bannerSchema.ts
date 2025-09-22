import { z } from "zod";

// Schema untuk create banner
export const createBannerSchema = z.object({
  nama: z.string().min(1, "Nama wajib diisi").max(255, "Nama maksimal 255 karakter"),
  url: z.string().url("URL harus valid").optional().or(z.literal("")),
  status: z.enum(["active", "inactive"], {
    required_error: "Status wajib dipilih",
    invalid_type_error: "Status harus berupa active atau inactive",
  }),
  isi: z.string().optional(),
  foto: z.any().refine((file) => {
    if (!file) return false; // Foto wajib diisi
    if (typeof file === "string") return true; // URL string
    if (file instanceof File) {
      // Validate file type
      const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/gif", "image/webp"];
      return allowedTypes.includes(file.type);
    }
    return false;
  }, "Foto wajib diisi dan format file harus berupa JPG, PNG, GIF, atau WebP"),
});

// Schema untuk update banner
export const updateBannerSchema = z.object({
  nama: z.string().min(1, "Nama wajib diisi").max(255, "Nama maksimal 255 karakter").optional(),
  url: z.string().url("URL harus valid").optional().or(z.literal("")),
  status: z.enum(["active", "inactive"]).optional(),
  isi: z.string().optional(),
  foto: z
    .any()
    .optional()
    .refine((file) => {
      if (!file) return true; // Optional field
      if (typeof file === "string") return true; // URL string
      if (file instanceof File) {
        // Validate file type
        const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/gif", "image/webp"];
        return allowedTypes.includes(file.type);
      }
      return false;
    }, "Format file harus berupa JPG, PNG, GIF, atau WebP"),
});

// Schema untuk banner query parameters
export const bannerQuerySchema = z.object({
  page: z.number().int().positive("Halaman harus berupa angka positif").optional().default(1),
  per_page: z
    .number()
    .int()
    .positive("Per page harus berupa angka positif")
    .max(100, "Maksimal 100 item per halaman")
    .optional()
    .default(10),
  search: z.string().max(100, "Search maksimal 100 karakter").optional(),
  sort_by: z.enum(["nama", "createdAt", "updatedAt"]).optional().default("createdAt"),
  sort_order: z.enum(["asc", "desc"]).optional().default("desc"),
});

// Types dari schema
export type CreateBannerFormData = z.infer<typeof createBannerSchema>;
export type UpdateBannerFormData = z.infer<typeof updateBannerSchema>;
export type BannerQueryFormData = z.infer<typeof bannerQuerySchema>;
