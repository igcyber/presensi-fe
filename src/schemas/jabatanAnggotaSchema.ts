import { z } from "zod";

// Schema untuk create jabatan anggota
export const createJabatanAnggotaSchema = z.object({
  nama: z.string().min(1, "Nama wajib diisi").min(3, "Nama minimal 3 karakter").max(200, "Nama maksimal 200 karakter"),
  jabatan: z
    .string()
    .min(1, "Jabatan wajib diisi")
    .min(3, "Jabatan minimal 3 karakter")
    .max(200, "Jabatan maksimal 200 karakter"),
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
    }, "Format file harus berupa JPG, PNG, atau WebP")
    .refine((file) => {
      if (!file || typeof file === "string") return true;
      if (file instanceof File) {
        // Validate file size (5MB max)
        return file.size <= 5 * 1024 * 1024;
      }
      return false;
    }, "Ukuran file maksimal 5MB"),
  anggotaId: z
    .union([z.number(), z.string()])
    .optional()
    .nullable()
    .transform((val) => {
      if (val === null || val === undefined || val === "") return null;
      return typeof val === "string" ? parseInt(val, 10) : val;
    }),
  strukturId: z
    .union([z.number(), z.string()])
    .refine((val) => val !== null && val !== undefined && val !== "", "Struktur wajib dipilih")
    .transform((val) => {
      return typeof val === "string" ? parseInt(val, 10) : val;
    }),
});

// Schema untuk update jabatan anggota
export const updateJabatanAnggotaSchema = z.object({
  nama: z.string().min(3, "Nama minimal 3 karakter").max(200, "Nama maksimal 200 karakter").optional(),
  jabatan: z.string().min(3, "Jabatan minimal 3 karakter").max(200, "Jabatan maksimal 200 karakter").optional(),
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
    }, "Format file harus berupa JPG, PNG, atau WebP")
    .refine((file) => {
      if (!file || typeof file === "string") return true;
      if (file instanceof File) {
        // Validate file size (5MB max)
        return file.size <= 5 * 1024 * 1024;
      }
      return false;
    }, "Ukuran file maksimal 5MB"),
  anggotaId: z
    .union([z.number(), z.string()])
    .optional()
    .nullable()
    .transform((val) => {
      if (val === null || val === undefined || val === "") return null;
      return typeof val === "string" ? parseInt(val, 10) : val;
    }),
  strukturId: z
    .union([z.number(), z.string()])
    .optional()
    .transform((val) => {
      if (val === null || val === undefined || val === "") return undefined;
      return typeof val === "string" ? parseInt(val, 10) : val;
    }),
});

// Schema untuk jabatan anggota query parameters
export const jabatanAnggotaQuerySchema = z.object({
  page: z.number().int().positive("Halaman harus berupa angka positif").optional().default(1),
  per_page: z
    .number()
    .int()
    .positive("Per page harus berupa angka positif")
    .max(100, "Maksimal 100 item per halaman")
    .optional()
    .default(10),
  search: z.string().max(100, "Search maksimal 100 karakter").optional(),
  date: z.string().optional(),
  struktur_id: z.number().optional(),
  sort_by: z.enum(["nama", "jabatan", "createdAt", "updatedAt"]).optional().default("createdAt"),
  sort_order: z.enum(["asc", "desc"]).optional().default("desc"),
});

// Types dari schema
export type CreateJabatanAnggotaFormData = z.infer<typeof createJabatanAnggotaSchema>;
export type UpdateJabatanAnggotaFormData = z.infer<typeof updateJabatanAnggotaSchema>;
export type JabatanAnggotaQueryFormData = z.infer<typeof jabatanAnggotaQuerySchema>;
