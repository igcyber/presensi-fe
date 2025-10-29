import { z } from "zod";

// Schema untuk create buku tamu
export const createBukuTamuSchema = z.object({
  judul: z.string().trim().min(1, { message: "Judul wajib diisi" }).min(3, { message: "Minimal 3 karakter" }),
});

// Schema untuk create buku tamu public
export const createBukuTamuPublicSchema = z.object({
  nama: z.string().trim().optional(),
  nohp: z.string().trim().optional(),
  asal: z.string().trim().optional(),
  tujuan: z.string().trim().optional(),
  jumlah_tamu: z.number().int().optional(),
  perihal: z.string().trim().optional(),
  dokumen: z
    .any()
    .optional()
    .refine((file) => {
      if (!file) return true; // Optional field
      if (file instanceof File) {
        // Validate file type - hanya PDF
        const allowedTypes = ["application/pdf"];
        return allowedTypes.includes(file.type);
      }
      return false;
    }, "File harus berupa PDF"),
});

// Types dari schema
export type CreateBukuTamuFormData = z.infer<typeof createBukuTamuSchema>;
export type CreateBukuTamuPublicFormData = z.infer<typeof createBukuTamuPublicSchema>;
