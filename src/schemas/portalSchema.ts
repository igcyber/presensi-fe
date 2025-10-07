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

// Schema untuk create portal menu kategori
export const createPortalMenuKatSchema = z.object({
  judul: z
    .string()
    .min(1, "Judul wajib diisi")
    .min(3, "Judul minimal 3 karakter")
    .max(50, "Judul maksimal 50 karakter"),
  portalMenuId: z
    .number()
    .int("Portal Menu ID harus berupa angka")
    .positive("Portal Menu ID harus berupa angka positif"),
});

// Schema untuk update portal menu kategori
export const updatePortalMenuKatSchema = z.object({
  judul: z.string().min(3, "Judul minimal 3 karakter").max(50, "Judul maksimal 50 karakter").optional(),
  portalMenuId: z
    .number()
    .int("Portal Menu ID harus berupa angka")
    .positive("Portal Menu ID harus berupa angka positif")
    .optional(),
});

// Schema untuk portal menu kategori query parameters
export const portalMenuKatQuerySchema = z.object({
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
  portalMenuId: z
    .number()
    .int("Portal Menu ID harus berupa angka")
    .positive("Portal Menu ID harus berupa angka positif")
    .optional(),
});

// Schema untuk create portal menu sub
export const createPortalMenuSubSchema = z.object({
  judul: z
    .string()
    .min(1, "Judul wajib diisi")
    .min(3, "Judul minimal 3 karakter")
    .max(100, "Judul maksimal 100 karakter"),
  link: z.string().max(200, "Link maksimal 200 karakter").optional(),
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
  portalMenuId: z
    .number()
    .int("Portal Menu ID harus berupa angka")
    .positive("Portal Menu ID harus berupa angka positif")
    .optional(),
  portalKatId: z
    .number()
    .int("Portal Kat ID harus berupa angka")
    .positive("Portal Kat ID harus berupa angka positif")
    .optional(),
  order: z.number().int().positive("Order harus berupa angka positif").optional(),
  is_active: z.boolean().optional(),
});

// Schema untuk update portal menu sub
export const updatePortalMenuSubSchema = z.object({
  judul: z.string().min(3, "Judul minimal 3 karakter").max(100, "Judul maksimal 100 karakter").optional(),
  link: z.string().max(200, "Link maksimal 200 karakter").optional(),
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
  portalMenuId: z
    .number()
    .int("Portal Menu ID harus berupa angka")
    .positive("Portal Menu ID harus berupa angka positif")
    .optional(),
  portalKatId: z
    .number()
    .int("Portal Kat ID harus berupa angka")
    .positive("Portal Kat ID harus berupa angka positif")
    .optional(),
  order: z.number().int().positive("Order harus berupa angka positif").optional(),
  is_active: z.boolean().optional(),
});

// Schema untuk portal menu sub query parameters
export const portalMenuSubQuerySchema = z.object({
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
  portalMenuId: z
    .number()
    .int("Portal Menu ID harus berupa angka")
    .positive("Portal Menu ID harus berupa angka positif")
    .optional(),
  portalKatId: z
    .number()
    .int("Portal Kat ID harus berupa angka")
    .positive("Portal Kat ID harus berupa angka positif")
    .optional(),
  order: z.number().int().positive("Order harus berupa angka positif").optional(),
  is_active: z.boolean().optional(),
});

// Types dari schema
export type CreatePortalMenuFormData = z.infer<typeof createPortalMenuSchema>;
export type UpdatePortalMenuFormData = z.infer<typeof updatePortalMenuSchema>;
export type PortalMenuQueryFormData = z.infer<typeof portalMenuQuerySchema>;

// Types untuk portal menu kategori
export type CreatePortalMenuKatFormData = z.infer<typeof createPortalMenuKatSchema>;
export type UpdatePortalMenuKatFormData = z.infer<typeof updatePortalMenuKatSchema>;
export type PortalMenuKatQueryFormData = z.infer<typeof portalMenuKatQuerySchema>;

// Types untuk portal menu sub
export type CreatePortalMenuSubFormData = z.infer<typeof createPortalMenuSubSchema>;
export type UpdatePortalMenuSubFormData = z.infer<typeof updatePortalMenuSubSchema>;
export type PortalMenuSubQueryFormData = z.infer<typeof portalMenuSubQuerySchema>;
