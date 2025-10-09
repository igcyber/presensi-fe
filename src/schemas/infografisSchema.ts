import { z } from "zod";

// Helper function to validate image file types
const isValidImageType = (file: File): boolean => {
  const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/gif", "image/webp"];
  return allowedTypes.includes(file.type);
};

// Helper function to validate image file size (5MB = 5 * 1024 * 1024 bytes)
const isValidImageSize = (file: File): boolean => {
  const maxSize = 5 * 1024 * 1024; // 5MB in bytes
  return file.size <= maxSize;
};

// Schema untuk create infografis
export const createInfografisSchema = z.object({
  nama: z.string().min(1, "Nama wajib diisi").max(255, "Nama maksimal 255 karakter"),
  url: z.string().url("URL harus valid").optional().or(z.literal("")),
  status: z.enum(["1", "0"], {
    required_error: "Status wajib dipilih",
    invalid_type_error: "Status harus berupa active atau inactive",
  }),
  isi: z.string().optional(),
  foto: z.any().refine(
    (file) => {
      if (!file) return false; // Foto wajib diisi
      if (typeof file === "string") return true; // URL string
      if (file instanceof File) {
        return isValidImageType(file) && isValidImageSize(file);
      }
      return false;
    },
    {
      message: "Foto wajib diisi. Format: JPG, PNG, GIF, WebP. Maksimal 5MB",
    },
  ),
});

// Schema untuk update infografis
export const updateInfografisSchema = z.object({
  nama: z.string().min(1, "Nama wajib diisi").max(255, "Nama maksimal 255 karakter").optional(),
  url: z.string().url("URL harus valid").optional().or(z.literal("")),
  status: z.enum(["1", "0"]).optional(),
  isi: z.string().optional(),
  foto: z
    .any()
    .optional()
    .refine(
      (file) => {
        if (!file) return true; // Optional field
        if (typeof file === "string") return true; // URL string
        if (file instanceof File) {
          return isValidImageType(file) && isValidImageSize(file);
        }
        return false;
      },
      {
        message: "Format file harus berupa JPG, PNG, GIF, WebP. Maksimal 5MB",
      },
    ),
});

// Schema untuk infografis query parameters
export const infografisQuerySchema = z.object({
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
export type CreateInfografisFormData = z.infer<typeof createInfografisSchema>;
export type UpdateInfografisFormData = z.infer<typeof updateInfografisSchema>;
export type InfografisQueryFormData = z.infer<typeof infografisQuerySchema>;
