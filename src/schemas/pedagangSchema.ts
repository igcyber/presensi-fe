import { z } from "zod";

// Schema untuk create pedagang
export const createPedagangSchema = z.object({
  nama: z.string().min(1, "Nama wajib diisi").min(2, "Nama minimal 2 karakter").max(100, "Nama maksimal 100 karakter"),
  nik: z
    .string()
    .min(1, "NIK wajib diisi")
    .min(16, "NIK harus 16 digit")
    .max(16, "NIK harus 16 digit")
    .regex(/^\d+$/, "NIK hanya boleh mengandung angka"),
  noKk: z
    .string()
    .min(1, "No. KK wajib diisi")
    .min(16, "No. KK harus 16 digit")
    .max(16, "No. KK harus 16 digit")
    .regex(/^\d+$/, "No. KK hanya boleh mengandung angka"),
  tempatLahir: z.string().min(1, "Tempat lahir wajib diisi").min(2, "Tempat lahir minimal 2 karakter").max(100, "Tempat lahir maksimal 100 karakter"),
  tanggalLahir: z.string().min(1, "Tanggal lahir wajib diisi").regex(/^\d{4}-\d{2}-\d{2}$/, "Format tanggal harus YYYY-MM-DD"),
  alamat: z.string().min(1, "Alamat wajib diisi").min(5, "Alamat minimal 5 karakter").max(500, "Alamat maksimal 500 karakter"),
});

// Schema untuk update pedagang
export const updatePedagangSchema = z.object({
  nama: z.string().min(2, "Nama minimal 2 karakter").max(100, "Nama maksimal 100 karakter").optional(),
  nik: z
    .string()
    .min(16, "NIK harus 16 digit")
    .max(16, "NIK harus 16 digit")
    .regex(/^\d+$/, "NIK hanya boleh mengandung angka")
    .optional(),
  noKk: z
    .string()
    .min(16, "No. KK harus 16 digit")
    .max(16, "No. KK harus 16 digit")
    .regex(/^\d+$/, "No. KK hanya boleh mengandung angka")
    .optional(),
  tempatLahir: z.string().min(2, "Tempat lahir minimal 2 karakter").max(100, "Tempat lahir maksimal 100 karakter").optional(),
  tanggalLahir: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Format tanggal harus YYYY-MM-DD").optional(),
  alamat: z.string().min(5, "Alamat minimal 5 karakter").max(500, "Alamat maksimal 500 karakter").optional(),
});

// Schema untuk pedagang query parameters
export const pedagangQuerySchema = z.object({
  page: z.number().int().positive("Halaman harus berupa angka positif").optional().default(1),
  perPage: z
    .number()
    .int()
    .positive("Per page harus berupa angka positif")
    .max(100, "Maksimal 100 item per halaman")
    .optional()
    .default(10),
  search: z.string().max(100, "Search maksimal 100 karakter").optional(),
  sort_by: z.enum(["nama", "nik", "createdAt", "updatedAt"]).optional().default("createdAt"),
  sort_order: z.enum(["asc", "desc"]).optional().default("desc"),
});

// Types dari schema
export type CreatePedagangFormData = z.infer<typeof createPedagangSchema>;
export type UpdatePedagangFormData = z.infer<typeof updatePedagangSchema>;
export type PedagangQueryFormData = z.infer<typeof pedagangQuerySchema>;

