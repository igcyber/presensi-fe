import { z } from "zod";

// Schema untuk create opd
export const createOpdSchema = z.object({
  nama: z.string().min(1, "Nama wajib diisi").min(3, "Nama minimal 3 karakter").max(200, "Nama maksimal 200 karakter"),
  alamat: z.string().min(1, "Alamat wajib diisi").min(10, "Alamat minimal 10 karakter"),
  maps: z.string().optional().or(z.literal("")),
  keterangan: z.string().max(500, "Keterangan maksimal 500 karakter").optional(),
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
  website: z.string().url("Website harus berupa URL yang valid").optional(),
});

// Schema untuk update opd
export const updateOpdSchema = z.object({
  nama: z.string().min(3, "Nama minimal 3 karakter").max(200, "Nama maksimal 200 karakter").optional(),
  alamat: z.string().min(10, "Alamat minimal 10 karakter").optional(),
  maps: z.string().optional().or(z.literal("")),
  keterangan: z.string().max(500, "Keterangan maksimal 500 karakter").optional(),
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
  website: z.string().url("Website harus berupa URL yang valid").optional(),
});

// Schema untuk opd query parameters
export const opdQuerySchema = z.object({
  page: z.number().int().positive("Halaman harus berupa angka positif").optional().default(1),
  per_page: z
    .number()
    .int()
    .positive("Per page harus berupa angka positif")
    .max(100, "Maksimal 100 item per halaman")
    .optional()
    .default(10),
  search: z.string().max(100, "Search maksimal 100 karakter").optional(),
  sort_by: z.enum(["nama", "createdAt", "updatedAt"]).optional().default("createdAt"),
  sort_order: z.enum(["asc", "desc"]).optional().default("desc"),
});

// Types dari schema
export type CreateOpdFormData = z.infer<typeof createOpdSchema>;
export type UpdateOpdFormData = z.infer<typeof updateOpdSchema>;
export type OpdQueryFormData = z.infer<typeof opdQuerySchema>;
