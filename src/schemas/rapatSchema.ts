import { z } from "zod";

// Schema untuk create rapat
export const createRapatSchema = z.object({
  judul: z
    .string()
    .min(1, "Judul wajib diisi")
    .min(5, "Judul minimal 5 karakter")
    .max(200, "Judul maksimal 200 karakter"),
  lokasi: z.string().max(200, "Lokasi maksimal 200 karakter").optional(),
  isi: z.string().optional(),
  tanggal: z
    .union([z.string(), z.date()])
    .refine((val) => {
      if (val instanceof Date) return true;
      if (typeof val === "string") {
        // Validate YYYY-MM-DD format
        const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
        return dateRegex.test(val);
      }
      return false;
    }, "Format tanggal harus YYYY-MM-DD")
    .transform((val) => {
      if (val instanceof Date) {
        return val.toISOString().split("T")[0];
      }
      return val;
    }),
  waktuMulai: z
    .string()
    .optional()
    .refine(
      (val) => {
        if (!val) return true;
        // Validate HH:mm or HH:mm:ss format
        const timeRegex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9](:[0-5][0-9])?$/;
        return timeRegex.test(val);
      },
      { message: "Format waktu harus HH:mm atau HH:mm:ss" },
    ),
  waktuBerakhir: z
    .string()
    .optional()
    .refine(
      (val) => {
        if (!val) return true;
        // Validate HH:mm or HH:mm:ss format
        const timeRegex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9](:[0-5][0-9])?$/;
        return timeRegex.test(val);
      },
      { message: "Format waktu harus HH:mm atau HH:mm:ss" },
    ),
});

// Schema untuk update rapat
export const updateRapatSchema = z.object({
  judul: z.string().min(5, "Judul minimal 5 karakter").max(200, "Judul maksimal 200 karakter").optional(),
  lokasi: z.string().max(200, "Lokasi maksimal 200 karakter").optional(),
  isi: z.string().optional(),
  tanggal: z
    .union([z.string(), z.date()])
    .optional()
    .refine(
      (val) => {
        if (!val) return true;
        if (val instanceof Date) return true;
        if (typeof val === "string") {
          // Validate YYYY-MM-DD format
          const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
          return dateRegex.test(val);
        }
        return false;
      },
      { message: "Format tanggal harus YYYY-MM-DD" },
    )
    .transform((val) => {
      if (!val) return val;
      if (val instanceof Date) {
        return val.toISOString().split("T")[0];
      }
      return val;
    }),
  waktuMulai: z
    .string()
    .optional()
    .refine(
      (val) => {
        if (!val) return true;
        // Validate HH:mm or HH:mm:ss format
        const timeRegex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9](:[0-5][0-9])?$/;
        return timeRegex.test(val);
      },
      { message: "Format waktu harus HH:mm atau HH:mm:ss" },
    ),
  waktuBerakhir: z
    .string()
    .optional()
    .refine(
      (val) => {
        if (!val) return true;
        // Validate HH:mm or HH:mm:ss format
        const timeRegex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9](:[0-5][0-9])?$/;
        return timeRegex.test(val);
      },
      { message: "Format waktu harus HH:mm atau HH:mm:ss" },
    ),
});

// Schema untuk rapat query parameters
export const rapatQuerySchema = z.object({
  page: z.number().int().positive("Halaman harus berupa angka positif").optional().default(1),
  per_page: z
    .number()
    .int()
    .positive("Per page harus berupa angka positif")
    .max(100, "Maksimal 100 item per halaman")
    .optional()
    .default(10),
  search: z.string().max(100, "Search maksimal 100 karakter").optional(),
  sort_by: z.enum(["judul", "lokasi", "tanggal", "createdAt", "updatedAt"]).optional().default("tanggal"),
  sort_order: z.enum(["asc", "desc"]).optional().default("desc"),
});

// Types dari schema
export type CreateRapatFormData = z.infer<typeof createRapatSchema>;
export type UpdateRapatFormData = z.infer<typeof updateRapatSchema>;
export type RapatQueryFormData = z.infer<typeof rapatQuerySchema>;
