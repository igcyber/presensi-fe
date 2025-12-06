import { z } from "zod";

export const createTipePegawaiSchema = z.object({
  nama: z
    .string()
    .min(1, "Nama tipe pegawai wajib diisi")
    .min(2, "Nama tipe pegawai minimal 2 karakter")
    .max(100, "Nama tipe pegawai maksimal 100 karakter"),
});

export const updateTipePegawaiSchema = z.object({
  nama: z
    .string()
    .min(2, "Nama tipe pegawai minimal 2 karakter")
    .max(100, "Nama tipe pegawai maksimal 100 karakter")
    .optional(),
});

export type CreateTipePegawaiFormData = z.infer<typeof createTipePegawaiSchema>;
export type UpdateTipePegawaiFormData = z.infer<typeof updateTipePegawaiSchema>;

