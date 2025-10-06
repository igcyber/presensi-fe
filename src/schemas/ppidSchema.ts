import { z } from "zod";

// Schema untuk create PPID
export const createPPIDSchema = z
  .object({
    judul: z
      .string()
      .min(1, "Judul wajib diisi")
      .min(5, "Judul minimal 5 karakter")
      .max(200, "Judul maksimal 200 karakter"),
    keterangan: z
      .string()
      .min(1, "Keterangan wajib diisi")
      .min(5, "Keterangan minimal 5 karakter")
      .max(1000, "Keterangan maksimal 1000 karakter"),
    kategori: z
      .string()
      .min(1, "Kategori wajib diisi")
      .min(3, "Kategori minimal 3 karakter")
      .max(100, "Kategori maksimal 100 karakter"),
    subKategori: z
      .string()
      .min(1, "Sub kategori wajib diisi")
      .min(3, "Sub kategori minimal 3 karakter")
      .max(100, "Sub kategori maksimal 100 karakter"),
    date: z
      .string()
      .min(1, "Tanggal wajib diisi")
      .regex(/^\d{4}$/, "Format tahun harus YYYY"),
    jenisfile: z
      .string()
      .min(1, "Jenis file wajib diisi")
      .refine((val) => ["dokumen", "gambar"].includes(val), "Jenis file harus dokumen atau gambar"),
    file: z.any().refine((file) => {
      if (!file) return false; // File wajib diisi
      if (typeof file === "string") return true; // URL string
      if (file instanceof File) {
        return true; // Validasi akan dilakukan di superRefine
      }
      return false;
    }, "File wajib diisi"),
  })
  .superRefine((data, ctx) => {
    // Validasi file berdasarkan jenisfile
    if (data.file instanceof File) {
      const allowedDocumentTypes = [
        "application/pdf",
        "application/msword",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      ];
      const allowedImageTypes = ["image/jpeg", "image/jpg", "image/png", "image/gif"];

      if (data.jenisfile === "dokumen" && !allowedDocumentTypes.includes(data.file.type)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "File dokumen harus berupa PDF, DOC, atau DOCX",
          path: ["file"],
        });
      }

      if (data.jenisfile === "gambar" && !allowedImageTypes.includes(data.file.type)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "File gambar harus berupa JPEG, JPG, PNG, atau GIF",
          path: ["file"],
        });
      }
    }
  });

// Schema untuk update PPID
export const updatePPIDSchema = z
  .object({
    judul: z.string().min(5, "Judul minimal 5 karakter").max(200, "Judul maksimal 200 karakter").optional(),
    keterangan: z
      .string()
      .min(5, "Keterangan minimal 5 karakter")
      .max(1000, "Keterangan maksimal 1000 karakter")
      .optional(),
    kategori: z.string().min(3, "Kategori minimal 3 karakter").max(100, "Kategori maksimal 100 karakter").optional(),
    subKategori: z
      .string()
      .min(3, "Sub kategori minimal 3 karakter")
      .max(100, "Sub kategori maksimal 100 karakter")
      .optional(),
    date: z
      .string()
      .regex(/^\d{4}$/, "Format tahun harus YYYY")
      .optional(),
    jenisfile: z
      .string()
      .refine((val) => val === "none" || ["dokumen", "gambar"].includes(val), "Jenis file harus dokumen atau gambar")
      .optional(),
    file: z
      .any()
      .optional()
      .refine((file) => {
        if (!file) return true; // Optional field
        if (typeof file === "string") return true; // URL string
        if (file instanceof File) {
          return true; // Validasi akan dilakukan di superRefine
        }
        return false;
      }, "File tidak valid"),
  })
  .superRefine((data, ctx) => {
    // Validasi file berdasarkan jenisfile jika ada file dan jenisfile
    if (data.file instanceof File && data.jenisfile) {
      const allowedDocumentTypes = [
        "application/pdf",
        "application/msword",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      ];
      const allowedImageTypes = ["image/jpeg", "image/jpg", "image/png", "image/gif"];

      if (data.jenisfile === "dokumen" && !allowedDocumentTypes.includes(data.file.type)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "File dokumen harus berupa PDF, DOC, atau DOCX",
          path: ["file"],
        });
      }

      if (data.jenisfile === "gambar" && !allowedImageTypes.includes(data.file.type)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "File gambar harus berupa JPEG, JPG, PNG, atau GIF",
          path: ["file"],
        });
      }
    }

    if (data.jenisfile !== "none" && !data.file) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "File wajib diisi jika memilih jenis file",
        path: ["file"],
      });
    }
  });

// Schema untuk PPID query parameters
export const ppidQuerySchema = z.object({
  page: z.number().int().positive("Halaman harus berupa angka positif").optional().default(1),
  per_page: z
    .number()
    .int()
    .positive("Per page harus berupa angka positif")
    .max(100, "Maksimal 100 item per halaman")
    .optional()
    .default(10),
  search: z.string().max(100, "Search maksimal 100 karakter").optional(),
  kategori: z.string().max(100, "Kategori maksimal 100 karakter").optional(),
  date: z
    .string()
    .regex(/^\d{4}$/, "Format tahun harus YYYY")
    .optional(),
  sort_by: z.enum(["judul", "kategori", "date", "createdAt", "updatedAt"]).optional().default("createdAt"),
  sort_order: z.enum(["asc", "desc"]).optional().default("desc"),
});

// Types dari schema
export type CreatePPIDFormData = z.infer<typeof createPPIDSchema>;
export type UpdatePPIDFormData = z.infer<typeof updatePPIDSchema>;
export type PPIDQueryFormData = z.infer<typeof ppidQuerySchema>;
