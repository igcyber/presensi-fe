import { z } from "zod";

// Schema untuk create bupati
export const createBupatiSchema = z
  .object({
    namaBupati: z
      .string()
      .min(1, "Nama bupati wajib diisi")
      .min(3, "Nama bupati minimal 3 karakter")
      .max(200, "Nama bupati maksimal 200 karakter"),
    namaWakil: z
      .string()
      .min(1, "Nama wakil bupati wajib diisi")
      .min(3, "Nama wakil bupati minimal 3 karakter")
      .max(200, "Nama wakil bupati maksimal 200 karakter"),
    tahunAwal: z.number().int().min(1900, "Tahun awal minimal 1900").max(2100, "Tahun awal maksimal 2100"),
    tahunAkhir: z.number().int().min(1900, "Tahun akhir minimal 1900").max(2100, "Tahun akhir maksimal 2100"),
    foto: z.any().refine((file) => {
      if (!file) return false; // Foto wajib diisi
      if (typeof file === "string") return true; // URL string
      if (file instanceof File) {
        // Validate file type
        const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
        return allowedTypes.includes(file.type);
      }
      return false;
    }, "Foto wajib diisi dan format file harus berupa JPG, PNG, atau WebP"),
  })
  .refine((data) => data.tahunAkhir >= data.tahunAwal, {
    message: "Tahun akhir harus lebih besar atau sama dengan tahun awal",
    path: ["tahunAkhir"],
  });

// Schema untuk update bupati
export const updateBupatiSchema = z
  .object({
    namaBupati: z
      .string()
      .min(3, "Nama bupati minimal 3 karakter")
      .max(200, "Nama bupati maksimal 200 karakter")
      .optional(),
    namaWakil: z
      .string()
      .min(3, "Nama wakil bupati minimal 3 karakter")
      .max(200, "Nama wakil bupati maksimal 200 karakter")
      .optional(),
    tahunAwal: z.number().int().min(1900, "Tahun awal minimal 1900").max(2100, "Tahun awal maksimal 2100").optional(),
    tahunAkhir: z
      .number()
      .int()
      .min(1900, "Tahun akhir minimal 1900")
      .max(2100, "Tahun akhir maksimal 2100")
      .optional(),
    foto: z
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
  })
  .refine(
    (data) => {
      if (data.tahunAwal && data.tahunAkhir) {
        return data.tahunAkhir >= data.tahunAwal;
      }
      return true;
    },
    {
      message: "Tahun akhir harus lebih besar atau sama dengan tahun awal",
      path: ["tahunAkhir"],
    },
  );

// Types dari schema
export type CreateBupatiFormData = z.infer<typeof createBupatiSchema>;
export type UpdateBupatiFormData = z.infer<typeof updateBupatiSchema>;
