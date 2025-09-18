import { z } from "zod";

// Schema untuk create portal menu
export const createPortalMenuSchema = z.object({
  judul: z
    .string()
    .min(1, "Judul wajib diisi")
    .min(3, "Judul minimal 3 karakter")
    .max(20, "Judul maksimal 20 karakter"),
  link: z.string().max(100, "Link maksimal 100 karakter").optional(),
  icon: z
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

// Schema untuk update portal menu
export const updatePortalMenuSchema = z.object({
  judul: z.string().min(3, "Judul minimal 3 karakter").max(20, "Judul maksimal 20 karakter").optional(),
  link: z.string().max(100, "Link maksimal 100 karakter").optional(),
  icon: z
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

// Schema untuk portal menu query parameters
export const portalMenuQuerySchema = z.object({
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
export type CreatePortalMenuFormData = z.infer<typeof createPortalMenuSchema>;
export type UpdatePortalMenuFormData = z.infer<typeof updatePortalMenuSchema>;
export type PortalMenuQueryFormData = z.infer<typeof portalMenuQuerySchema>;
