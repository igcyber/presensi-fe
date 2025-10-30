import { z } from "zod";

// Schema untuk create tindak lanjut
export const createTindakLanjutSchema = z.object({
  pengaduanId: z.number().int().positive("ID pengaduan harus berupa angka positif"),
  tanggalMulai: z.string().min(1, "Tanggal mulai wajib diisi"),
  tanggalTindakLanjut: z.string().optional(),
  deskripsi: z
    .string()
    .min(1, "Deskripsi wajib diisi")
    .min(10, "Deskripsi minimal 10 karakter")
    .max(1000, "Deskripsi maksimal 1000 karakter"),
  dokumenDukung: z
    .any()
    .optional()
    .refine((file) => {
      if (!file) return true; // Optional field
      if (file instanceof File) {
        // Validate file type - hanya PDF
        const allowedTypes = ["application/pdf"];
        return allowedTypes.includes(file.type);
      }
      return false;
    }, "File harus berupa PDF"),
});

// Schema untuk update tindak lanjut
export const updateTindakLanjutSchema = z.object({
  tanggalMulai: z.string().optional(),
  tanggalTindakLanjut: z.string().optional(),
  deskripsi: z
    .string()
    .min(10, "Deskripsi minimal 10 karakter")
    .max(1000, "Deskripsi maksimal 1000 karakter")
    .optional(),
  dokumenDukung: z
    .any()
    .optional()
    .refine((file) => {
      if (!file) return true; // Optional field
      if (file instanceof File) {
        // Validate file type - hanya PDF
        const allowedTypes = ["application/pdf"];
        return allowedTypes.includes(file.type);
      }
      return false;
    }, "File harus berupa PDF"),
});

// Types dari schema
export type CreateTindakLanjutFormData = z.infer<typeof createTindakLanjutSchema>;
export type UpdateTindakLanjutFormData = z.infer<typeof updateTindakLanjutSchema>;
