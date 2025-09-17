import { z } from "zod";

// Schema untuk create perusda
export const createPerusdaSchema = z.object({
  nama: z
    .string()
    .min(1, "Nama perusda wajib diisi")
    .min(3, "Nama perusda minimal 3 karakter")
    .max(200, "Nama perusda maksimal 200 karakter"),
  alamat: z
    .string()
    .min(1, "Alamat wajib diisi")
    .min(5, "Alamat minimal 5 karakter")
    .max(500, "Alamat maksimal 500 karakter"),
  telepon: z
    .string()
    .min(1, "Telepon wajib diisi")
    .min(8, "Telepon minimal 8 karakter")
    .max(20, "Telepon maksimal 20 karakter"),
  email: z
    .string()
    .min(1, "Email wajib diisi")
    .email("Format email tidak valid")
    .max(100, "Email maksimal 100 karakter"),
  maps: z.string().url("Format URL maps tidak valid").optional().or(z.literal("")),
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
});

// Schema untuk update perusda
export const updatePerusdaSchema = z.object({
  nama: z.string().min(3, "Nama perusda minimal 3 karakter").max(200, "Nama perusda maksimal 200 karakter").optional(),
  alamat: z.string().min(5, "Alamat minimal 5 karakter").max(500, "Alamat maksimal 500 karakter").optional(),
  telepon: z.string().min(8, "Telepon minimal 8 karakter").max(20, "Telepon maksimal 20 karakter").optional(),
  email: z.string().email("Format email tidak valid").max(100, "Email maksimal 100 karakter").optional(),
  maps: z.string().url("Format URL maps tidak valid").optional().or(z.literal("")),
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
});

// Types dari schema
export type CreatePerusdaFormData = z.infer<typeof createPerusdaSchema>;
export type UpdatePerusdaFormData = z.infer<typeof updatePerusdaSchema>;
