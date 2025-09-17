import { z } from "zod";

// Schema untuk create prestasi
export const createPrestasiSchema = z.object({
  tahun: z
    .string()
    .min(1, "Tahun wajib diisi")
    .regex(/^\d{4}$/, "Tahun harus berupa 4 digit angka"),
  judul: z
    .string()
    .min(1, "Judul wajib diisi")
    .min(3, "Judul minimal 3 karakter")
    .max(200, "Judul maksimal 200 karakter"),
  tingkat: z.string().min(1, "Tingkat wajib diisi").max(50, "Tingkat maksimal 50 karakter"),
  nama: z
    .string()
    .min(1, "Nama prestasi wajib diisi")
    .min(5, "Nama prestasi minimal 5 karakter")
    .max(500, "Nama prestasi maksimal 500 karakter"),
  keterangan: z
    .string()
    .min(1, "Keterangan wajib diisi")
    .min(10, "Keterangan minimal 10 karakter")
    .max(2000, "Keterangan maksimal 2000 karakter"),
});

// Schema untuk update prestasi
export const updatePrestasiSchema = z.object({
  tahun: z
    .string()
    .regex(/^\d{4}$/, "Tahun harus berupa 4 digit angka")
    .optional(),
  judul: z.string().min(3, "Judul minimal 3 karakter").max(200, "Judul maksimal 200 karakter").optional(),
  tingkat: z.string().max(50, "Tingkat maksimal 50 karakter").optional(),
  nama: z
    .string()
    .min(5, "Nama prestasi minimal 5 karakter")
    .max(500, "Nama prestasi maksimal 500 karakter")
    .optional(),
  keterangan: z
    .string()
    .min(10, "Keterangan minimal 10 karakter")
    .max(2000, "Keterangan maksimal 2000 karakter")
    .optional(),
});

// Types dari schema
export type CreatePrestasiFormData = z.infer<typeof createPrestasiSchema>;
export type UpdatePrestasiFormData = z.infer<typeof updatePrestasiSchema>;
