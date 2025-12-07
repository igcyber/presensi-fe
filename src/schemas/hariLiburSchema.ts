import { z } from "zod";

export const createHariLiburSchema = z.object({
  tanggal: z.string().min(1, "Tanggal wajib diisi"),
  keterangan: z.string().optional(),
});

export const updateHariLiburSchema = z.object({
  tanggal: z.string().optional(),
  keterangan: z.string().optional(),
});

export type CreateHariLiburFormData = z.infer<typeof createHariLiburSchema>;
export type UpdateHariLiburFormData = z.infer<typeof updateHariLiburSchema>;
