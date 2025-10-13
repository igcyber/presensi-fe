import { z } from "zod";

/**
 * Schema untuk validasi create standar pelayanan
 */
export const createStandarPelayananSchema = z.object({
  nama: z.string().min(3, "Nama minimal 3 karakter"),
  deskripsi: z.string().min(1, "Deskripsi wajib diisi"),
});

/**
 * Schema untuk validasi update standar pelayanan
 */
export const updateStandarPelayananSchema = z.object({
  nama: z.string().min(3, "Nama minimal 3 karakter").optional(),
  deskripsi: z.string().optional(),
});

/**
 * Schema untuk validasi query parameters standar pelayanan
 */
export const standarPelayananQuerySchema = z.object({
  page: z.coerce.number().min(1).optional(),
  limit: z.coerce.number().min(1).max(100).optional(),
  search: z.string().optional(),
  sort_by: z.enum(["nama", "createdAt", "updatedAt"]).optional(),
  sort_order: z.enum(["asc", "desc"]).optional(),
});
