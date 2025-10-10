import { z } from "zod";

// Allowed source values
const allowedSources = ["file", "link", "text"] as const;

// Schema untuk create statik
export const createStatikSchema = z
  .object({
    nama: z
      .string()
      .min(1, "Nama wajib diisi")
      .min(3, "Nama minimal 3 karakter")
      .max(100, "Nama maksimal 100 karakter"),
    isi: z.string().optional(),
    source: z.enum(allowedSources, {
      errorMap: () => ({ message: "Source harus dipilih" }),
    }),
    kategori: z.string().min(1, "Kategori wajib diisi"),
    icon: z.string().optional(),
    attachment: z
      .any()
      .optional()
      .refine((file) => {
        if (!file) return true; // Optional field
        if (typeof file === "string") return true; // URL string
        if (file instanceof File) {
          // Validate file type
          const allowedTypes = [
            "image/jpeg",
            "image/jpg",
            "image/png",
            "image/webp", // Images
            "application/pdf", // PDF
            "application/msword",
            "application/vnd.openxmlformats-officedocument.wordprocessingml.document", // Word docs
            "video/mp4",
            "video/quicktime", // Videos
            "video/webm", // WebM videos
          ];
          return allowedTypes.includes(file.type);
        }
        return false;
      }, "Format file tidak didukung. Gunakan JPG, PNG, WebP, PDF, DOC, DOCX, MP4, atau MOV"),
  })
  .superRefine((data, ctx) => {
    // Validasi conditional berdasarkan source
    if (data.source === "file") {
      if (!data.attachment) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "File wajib diupload untuk source 'file'",
          path: ["attachment"],
        });
      }
    } else if (data.source === "link") {
      if (!data.attachment || typeof data.attachment !== "string") {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Link URL wajib diisi untuk source 'link'",
          path: ["attachment"],
        });
      } else {
        // Validate URL format
        try {
          new URL(data.attachment);
        } catch {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "Format URL tidak valid",
            path: ["attachment"],
          });
        }
      }
    } else if (data.source === "text") {
      if (!data.isi) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Isi wajib diisi untuk source 'text'",
          path: ["isi"],
        });
      }
    }
  });

// Schema untuk update statik
export const updateStatikSchema = z
  .object({
    nama: z.string().min(3, "Nama minimal 3 karakter").max(100, "Nama maksimal 100 karakter").optional(),
    isi: z.string().optional(),
    source: z
      .enum(allowedSources, {
        errorMap: () => ({ message: "Source harus dipilih" }),
      })
      .optional(),
    kategori: z.string().min(1, "Kategori wajib diisi").optional(),
    icon: z.string().optional(),
    attachment: z
      .any()
      .optional()
      .refine((file) => {
        if (!file) return true; // Optional field
        if (typeof file === "string") return true; // URL string
        if (file instanceof File) {
          // Validate file type
          const allowedTypes = [
            "image/jpeg",
            "image/jpg",
            "image/png",
            "image/webp", // Images
            "application/pdf", // PDF
            "application/msword",
            "application/vnd.openxmlformats-officedocument.wordprocessingml.document", // Word docs
            "video/mp4",
            "video/quicktime", // Videos
            "video/webm", // WebM videos
          ];
          return allowedTypes.includes(file.type);
        }
        return false;
      }, "Format file tidak didukung. Gunakan JPG, PNG, WebP, PDF, DOC, DOCX, MP4, atau MOV"),
  })
  .superRefine((data, ctx) => {
    // Validasi conditional berdasarkan source (hanya jika source di-set)
    if (data.source === "link" && data.attachment && typeof data.attachment === "string") {
      try {
        new URL(data.attachment);
      } catch {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Format URL tidak valid",
          path: ["attachment"],
        });
      }
    }
  });

// Schema untuk statik query parameters
export const statikQuerySchema = z.object({
  page: z.number().int().positive("Halaman harus berupa angka positif").optional().default(1),
  per_page: z
    .number()
    .int()
    .positive("Per page harus berupa angka positif")
    .max(100, "Maksimal 100 item per halaman")
    .optional()
    .default(10),
  search: z.string().max(100, "Search maksimal 100 karakter").optional(),
  sort_by: z.enum(["nama", "kategori", "source", "createdAt", "updatedAt"]).optional().default("createdAt"),
  sort_order: z.enum(["asc", "desc"]).optional().default("desc"),
});

// Types dari schema
export type CreateStatikFormData = z.infer<typeof createStatikSchema>;
export type UpdateStatikFormData = z.infer<typeof updateStatikSchema>;
export type StatikQueryFormData = z.infer<typeof statikQuerySchema>;
