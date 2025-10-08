import { z } from "zod";

// Helper function to validate image file types
const isValidImageType = (file: File): boolean => {
  const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
  return allowedTypes.includes(file.type);
};

// Helper function to validate image file size (2MB = 2 * 1024 * 1024 bytes)
const isValidImageSize = (file: File): boolean => {
  const maxSize = 2 * 1024 * 1024; // 2MB in bytes
  return file.size <= maxSize;
};

// Schema untuk create foto
export const createFotoSchema = z.object({
  judul: z
    .string()
    .min(1, "Judul wajib diisi")
    .min(3, "Judul minimal 3 karakter")
    .max(200, "Judul maksimal 200 karakter"),
  foto: z
    .instanceof(File, { message: "File foto wajib diisi" })
    .refine(isValidImageType, "File harus berupa gambar (JPG, JPEG, PNG, atau WebP)")
    .refine(isValidImageSize, "Ukuran file maksimal 2MB"),
});

// Schema untuk update foto
export const updateFotoSchema = z.object({
  judul: z.string().min(3, "Judul minimal 3 karakter").max(200, "Judul maksimal 200 karakter").optional(),
  foto: z
    .instanceof(File, { message: "File foto harus berupa file" })
    .refine(isValidImageType, "File harus berupa gambar (JPG, JPEG, PNG, atau WebP)")
    .refine(isValidImageSize, "Ukuran file maksimal 2MB")
    .optional(),
});

// Schema untuk foto query parameters
export const fotoQuerySchema = z.object({
  page: z.number().int().positive("Halaman harus berupa angka positif").optional().default(1),
  per_page: z
    .number()
    .int()
    .positive("Per page harus berupa angka positif")
    .max(100, "Maksimal 100 item per halaman")
    .optional()
    .default(10),
  search: z.string().max(100, "Search maksimal 100 karakter").optional(),
  sort_by: z.enum(["judul", "createdAt", "updatedAt"]).optional().default("createdAt"),
  sort_order: z.enum(["asc", "desc"]).optional().default("desc"),
});

// Types dari schema
export type CreateFotoFormData = z.infer<typeof createFotoSchema>;
export type UpdateFotoFormData = z.infer<typeof updateFotoSchema>;
export type FotoQueryFormData = z.infer<typeof fotoQuerySchema>;
