import { z } from "zod";

// Allowed tipe values
const allowedTipe = ["file", "page"] as const;

// Schema untuk create page
export const createPageSchema = z
  .object({
    nama: z
      .string()
      .min(1, "Nama wajib diisi")
      .min(3, "Nama minimal 3 karakter")
      .max(200, "Nama maksimal 200 karakter"),
    tipe: z.enum(allowedTipe, {
      errorMap: () => ({ message: "Tipe harus dipilih (File atau Page)" }),
    }),
    content: z.string().optional(),
    file: z.any().optional(),
    menuId: z
      .union([z.number(), z.string()])
      .optional()
      .nullable()
      .transform((val) => {
        if (val === null || val === undefined || val === "") return undefined;
        return typeof val === "string" ? parseInt(val, 10) : val;
      }),

    temporaryFileNames: z.array(z.string()).optional(),
  })
  .superRefine((data, ctx) => {
    // Jika tipe adalah 'file', maka file wajib diisi dan harus PDF
    if (data.tipe === "file") {
      const file = data.file;

      if (!file) {
        ctx.addIssue({
          path: ["file"],
          message: "File wajib diisi karena tipe adalah File",
          code: z.ZodIssueCode.custom,
        });
        return;
      }

      if (typeof file === "string") return; // URL string (sudah di-upload sebelumnya)

      if (file instanceof File) {
        const allowedTypes = ["application/pdf"];
        if (!allowedTypes.includes(file.type)) {
          ctx.addIssue({
            path: ["file"],
            message: "File harus berupa PDF",
            code: z.ZodIssueCode.custom,
          });
        }
      } else {
        ctx.addIssue({
          path: ["file"],
          message: "File tidak valid",
          code: z.ZodIssueCode.custom,
        });
      }
    }
  });

// Schema untuk update page
export const updatePageSchema = z.object({
  nama: z.string().min(3, "Nama minimal 3 karakter").max(200, "Nama maksimal 200 karakter").optional(),
  tipe: z
    .enum(allowedTipe, {
      errorMap: () => ({ message: "Tipe harus dipilih (File atau Page)" }),
    })
    .optional(),
  content: z.string().optional(),
  file: z.any().optional(),
  menuId: z
    .union([z.number(), z.string()])
    .optional()
    .nullable()
    .transform((val) => {
      if (val === null || val === undefined || val === "") return undefined;
      return typeof val === "string" ? parseInt(val, 10) : val;
    }),
  temporaryFileNames: z.array(z.string()).optional(),
});

// Schema untuk page query parameters
export const pageQuerySchema = z.object({
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
  tipe: z.enum(allowedTipe).optional(),
  sort_by: z.enum(["nama", "tipe", "createdAt", "updatedAt"]).optional().default("createdAt"),
  sort_order: z.enum(["asc", "desc"]).optional().default("desc"),
});

// Types dari schema
export type CreatePageFormData = z.infer<typeof createPageSchema>;
export type UpdatePageFormData = z.infer<typeof updatePageSchema>;
export type PageQueryFormData = z.infer<typeof pageQuerySchema>;
