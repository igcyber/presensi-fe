import { z } from "zod";

// Schema untuk create pasar
export const createPasarSchema = z.object({
  nama: z.string().min(1, "Nama wajib diisi").min(2, "Nama minimal 2 karakter").max(100, "Nama maksimal 100 karakter"),
  jenisPasar: z.string().max(100, "Jenis pasar maksimal 100 karakter").nullable().optional(),
});

// Schema untuk update pasar
export const updatePasarSchema = z.object({
  nama: z.string().min(2, "Nama minimal 2 karakter").max(100, "Nama maksimal 100 karakter").optional(),
  jenisPasar: z.string().max(100, "Jenis pasar maksimal 100 karakter").nullable().optional(),
});

// Schema untuk pasar query parameters
export const pasarQuerySchema = z.object({
  page: z.number().int().positive("Halaman harus berupa angka positif").optional().default(1),
  perPage: z
    .number()
    .int()
    .positive("Per page harus berupa angka positif")
    .max(100, "Maksimal 100 item per halaman")
    .optional()
    .default(10),
  search: z.string().max(100, "Search maksimal 100 karakter").optional(),
  sort_by: z.enum(["nama", "jenisPasar", "createdAt", "updatedAt"]).optional().default("createdAt"),
  sort_order: z.enum(["asc", "desc"]).optional().default("desc"),
});

// Types dari schema
export type CreatePasarFormData = z.infer<typeof createPasarSchema>;
export type UpdatePasarFormData = z.infer<typeof updatePasarSchema>;
export type PasarQueryFormData = z.infer<typeof pasarQuerySchema>;

