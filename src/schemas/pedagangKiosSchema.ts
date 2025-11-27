import { z } from "zod";

// Schema untuk create pedagang kios
export const createPedagangKiosSchema = z.object({
  kiosId: z.number().int().positive("Kios wajib dipilih"),
  isActive: z.boolean().default(false),
});

// Types dari schema
export type CreatePedagangKiosFormData = z.infer<typeof createPedagangKiosSchema>;
