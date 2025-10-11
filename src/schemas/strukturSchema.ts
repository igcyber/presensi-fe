import { z } from "zod";

// Schema untuk create struktur
export const createStrukturSchema = z.object({
  nama: z.string().min(1, "Nama wajib diisi").min(3, "Nama minimal 3 karakter").max(200, "Nama maksimal 200 karakter"),
  tentang: z.string().min(1, "Tentang wajib diisi").min(10, "Tentang minimal 10 karakter"),
  strukturId: z
    .union([z.number(), z.string()])
    .optional()
    .nullable()
    .transform((val) => {
      if (val === null || val === undefined || val === "") return null;
      return typeof val === "string" ? parseInt(val, 10) : val;
    }),
});

// Schema untuk update struktur
export const updateStrukturSchema = z.object({
  nama: z.string().min(3, "Nama minimal 3 karakter").max(200, "Nama maksimal 200 karakter").optional(),
  tentang: z.string().min(10, "Tentang minimal 10 karakter").optional(),
  strukturId: z
    .union([z.number(), z.string()])
    .optional()
    .nullable()
    .transform((val) => {
      if (val === null || val === undefined || val === "") return null;
      return typeof val === "string" ? parseInt(val, 10) : val;
    }),
});

// Schema untuk struktur query parameters
export const strukturQuerySchema = z.object({
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
export type CreateStrukturFormData = z.infer<typeof createStrukturSchema>;
export type UpdateStrukturFormData = z.infer<typeof updateStrukturSchema>;
export type StrukturQueryFormData = z.infer<typeof strukturQuerySchema>;
