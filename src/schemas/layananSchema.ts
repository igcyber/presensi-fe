import { z } from "zod";

// Schema untuk create layanan
export const createLayananSchema = z.object({
  nama: z
    .string()
    .min(1, "Nama layanan wajib diisi")
    .min(3, "Nama layanan minimal 3 karakter")
    .max(200, "Nama layanan maksimal 200 karakter"),
  jenis: z
    .string()
    .min(1, "Jenis layanan wajib diisi")
    .min(3, "Jenis layanan minimal 3 karakter")
    .max(100, "Jenis layanan maksimal 100 karakter"),
  opdId: z.number().int().positive("OPD ID harus berupa angka positif").min(1, "OPD wajib dipilih"),
  alamat: z
    .string()
    .min(1, "Alamat wajib diisi")
    .min(3, "Alamat minimal 3 karakter")
    .max(500, "Alamat maksimal 500 karakter"),
  keterangan: z.string().max(1000, "Keterangan maksimal 1000 karakter").optional(),
  logo: z.any().refine((file) => {
    if (!file) return false; // Logo wajib diisi
    if (typeof file === "string") return true; // URL string
    if (file instanceof File) {
      // Validate file type
      const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
      return allowedTypes.includes(file.type);
    }
    return false;
  }, "Logo wajib diisi dan format file harus berupa JPG, PNG, atau WebP"),
});

// Schema untuk update layanan
export const updateLayananSchema = z.object({
  nama: z.string().min(3, "Nama layanan minimal 3 karakter").max(200, "Nama layanan maksimal 200 karakter").optional(),
  jenis: z
    .string()
    .min(3, "Jenis layanan minimal 3 karakter")
    .max(100, "Jenis layanan maksimal 100 karakter")
    .optional(),
  opdId: z.number().int().positive("OPD ID harus berupa angka positif").min(1, "OPD wajib dipilih").optional(),
  alamat: z.string().min(3, "Alamat minimal 3 karakter").max(500, "Alamat maksimal 500 karakter").optional(),
  keterangan: z.string().max(1000, "Keterangan maksimal 1000 karakter").optional(),
  logo: z
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
});

// Types dari schema
export type CreateLayananFormData = z.infer<typeof createLayananSchema>;
export type UpdateLayananFormData = z.infer<typeof updateLayananSchema>;
