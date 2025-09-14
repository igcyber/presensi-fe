import { z } from "zod";

// Helper function to validate YouTube and Facebook video URLs
const isValidVideoUrl = (url: string): boolean => {
  const youtubeRegex = /^https:\/\/www\.youtube\.com\/embed\/[a-zA-Z0-9_-]+$/;
  const facebookRegex = /^https:\/\/www\.facebook\.com\/plugins\/video\.php\?.*$/;
  return youtubeRegex.test(url) || facebookRegex.test(url);
};

// Schema untuk create video
export const createVideoSchema = z.object({
  judul: z
    .string()
    .min(1, "Judul wajib diisi")
    .min(3, "Judul minimal 3 karakter")
    .max(200, "Judul maksimal 200 karakter"),
  isi: z
    .string()
    .min(1, "Deskripsi wajib diisi")
    .min(3, "Deskripsi minimal 3 karakter")
    .max(1000, "Deskripsi maksimal 1000 karakter"),
  link: z
    .string()
    .min(1, "Link video wajib diisi")
    .url("Format link tidak valid")
    .refine(isValidVideoUrl, "Link harus berupa embed URL YouTube atau Facebook yang valid"),
});

// Schema untuk update video
export const updateVideoSchema = z.object({
  judul: z.string().min(3, "Judul minimal 3 karakter").max(200, "Judul maksimal 200 karakter").optional(),
  isi: z.string().min(3, "Deskripsi minimal 3 karakter").max(1000, "Deskripsi maksimal 1000 karakter").optional(),
  link: z
    .string()
    .url("Format link tidak valid")
    .refine(isValidVideoUrl, "Link harus berupa embed URL YouTube atau Facebook yang valid")
    .optional(),
});

// Schema untuk video query parameters
export const videoQuerySchema = z.object({
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
export type CreateVideoFormData = z.infer<typeof createVideoSchema>;
export type UpdateVideoFormData = z.infer<typeof updateVideoSchema>;
export type VideoQueryFormData = z.infer<typeof videoQuerySchema>;
