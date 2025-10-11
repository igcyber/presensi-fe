import { z } from "zod";

// Schema untuk create menu
export const createMenuSchema = z.object({
  nama: z.string().min(1, "Nama wajib diisi").min(3, "Nama minimal 3 karakter").max(200, "Nama maksimal 200 karakter"),
  url: z.string().max(500, "URL maksimal 500 karakter").optional(),
  menuId: z
    .union([z.number(), z.string()])
    .optional()
    .nullable()
    .transform((val) => {
      if (val === null || val === undefined || val === "") return null;
      return typeof val === "string" ? parseInt(val, 10) : val;
    }),
});

// Schema untuk update menu
export const updateMenuSchema = z.object({
  nama: z.string().min(3, "Nama minimal 3 karakter").max(200, "Nama maksimal 200 karakter").optional(),
  url: z.string().max(500, "URL maksimal 500 karakter").optional(),
  menuId: z
    .union([z.number(), z.string()])
    .optional()
    .nullable()
    .transform((val) => {
      if (val === null || val === undefined || val === "") return null;
      return typeof val === "string" ? parseInt(val, 10) : val;
    }),
});

// Schema untuk menu query parameters
export const menuQuerySchema = z.object({
  page: z.number().int().positive("Halaman harus berupa angka positif").optional().default(1),
  per_page: z
    .number()
    .int()
    .positive("Per page harus berupa angka positif")
    .max(100, "Maksimal 100 item per halaman")
    .optional()
    .default(10),
  search: z.string().max(100, "Search maksimal 100 karakter").optional(),
  date: z.string().optional(),
  sort_by: z.enum(["nama", "createdAt", "updatedAt"]).optional().default("createdAt"),
  sort_order: z.enum(["asc", "desc"]).optional().default("desc"),
});

// Types dari schema
export type CreateMenuFormData = z.infer<typeof createMenuSchema>;
export type UpdateMenuFormData = z.infer<typeof updateMenuSchema>;
export type MenuQueryFormData = z.infer<typeof menuQuerySchema>;
