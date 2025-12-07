import { z } from "zod";

export const createPwaVersionSchema = z.object({
  version: z
    .string()
    .min(1, "Version wajib diisi")
    .regex(/^v\d+\.\d+\.\d+(\.\d+)?$/, "Format version tidak valid. Contoh: v1.0.0.1"),
});

export type CreatePwaVersionFormData = z.infer<typeof createPwaVersionSchema>;
