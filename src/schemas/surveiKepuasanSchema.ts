import { z } from "zod";

// Schema untuk survei kepuasan query parameters
export const surveiKepuasanQuerySchema = z
  .object({
    page: z.number().int().positive("Halaman harus berupa angka positif").optional().default(1),
    per_page: z
      .number()
      .int()
      .positive("Per page harus berupa angka positif")
      .max(100, "Maksimal 100 item per halaman")
      .optional()
      .default(10),
    search: z.string().max(100, "Search maksimal 100 karakter").optional(),
    startDate: z
      .string()
      .regex(/^\d{4}-\d{2}-\d{2}$/, "Format tanggal harus YYYY-MM-DD")
      .optional(),
    endDate: z
      .string()
      .regex(/^\d{4}-\d{2}-\d{2}$/, "Format tanggal harus YYYY-MM-DD")
      .optional(),
    sort_by: z.enum(["nama", "createdAt", "updatedAt"]).optional().default("createdAt"),
    sort_order: z.enum(["asc", "desc"]).optional().default("desc"),
  })
  .refine(
    (data) => {
      if (data.startDate && data.endDate) {
        return new Date(data.startDate) <= new Date(data.endDate);
      }
      return true;
    },
    {
      message: "Tanggal mulai tidak boleh lebih besar dari tanggal akhir",
      path: ["startDate"],
    },
  );

// Types dari schema
export type SurveiKepuasanQueryFormData = z.infer<typeof surveiKepuasanQuerySchema>;
