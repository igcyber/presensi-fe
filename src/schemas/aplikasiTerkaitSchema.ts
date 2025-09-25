import { z } from "zod";

// Schema untuk create aplikasi terkait
export const createAplikasiTerkaitSchema = z.object({
  cover: z
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
  text: z.string().min(1, "Text wajib diisi").max(255, "Text maksimal 255 karakter"),
  link: z
    .string()
    .min(1, "Link wajib diisi")
    .url("Link harus berupa URL yang valid")
    .max(500, "Link maksimal 500 karakter"),
});

// Schema untuk update aplikasi terkait
export const updateAplikasiTerkaitSchema = z.object({
  cover: z
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
  text: z.string().min(1, "Text wajib diisi").max(255, "Text maksimal 255 karakter").optional(),
  link: z
    .string()
    .min(1, "Link wajib diisi")
    .url("Link harus berupa URL yang valid")
    .max(500, "Link maksimal 500 karakter")
    .optional(),
});

// Schema untuk aplikasi terkait query parameters
export const aplikasiTerkaitQuerySchema = z.object({
  page: z.number().int().positive("Halaman harus berupa angka positif").optional().default(1),
  per_page: z
    .number()
    .int()
    .positive("Per page harus berupa angka positif")
    .max(100, "Maksimal 100 item per halaman")
    .optional()
    .default(10),
  search: z.string().max(100, "Search maksimal 100 karakter").optional(),
  sort_by: z.enum(["text", "createdAt", "updatedAt"]).optional().default("createdAt"),
  sort_order: z.enum(["asc", "desc"]).optional().default("desc"),
});

// Types dari schema
export type CreateAplikasiTerkaitFormData = z.infer<typeof createAplikasiTerkaitSchema>;
export type UpdateAplikasiTerkaitFormData = z.infer<typeof updateAplikasiTerkaitSchema>;
export type AplikasiTerkaitQueryFormData = z.infer<typeof aplikasiTerkaitQuerySchema>;
