import { z } from "zod";

export const createKantorSchema = z.object({
  nama: z
    .string()
    .min(1, "Nama wajib diisi")
    .min(2, "Nama minimal 2 karakter")
    .max(255, "Nama maksimal 255 karakter"),
  alamat: z
    .string()
    .max(500, "Alamat maksimal 500 karakter")
    .optional()
    .or(z.literal("")),
  lat: z
    .string()
    .min(1, "Latitude wajib diisi")
    .regex(/^-?\d+\.?\d*$/, "Format latitude tidak valid"),
  long: z
    .string()
    .min(1, "Longitude wajib diisi")
    .regex(/^-?\d+\.?\d*$/, "Format longitude tidak valid"),
  deskripsi: z
    .string()
    .max(1000, "Deskripsi maksimal 1000 karakter")
    .optional()
    .or(z.literal("")),
  radius_limit: z
    .number({
      required_error: "Radius limit wajib diisi",
      invalid_type_error: "Radius limit harus berupa angka",
    })
    .min(1, "Radius limit minimal 1 meter")
    .max(10000, "Radius limit maksimal 10000 meter"),
  jam_masuk: z
    .string()
    .min(1, "Jam masuk wajib diisi")
    .regex(/^([0-1][0-9]|2[0-3]):[0-5][0-9](:00)?$/, "Format jam masuk tidak valid (HH:mm atau HH:mm:ss)"),
  jam_pulang: z
    .string()
    .min(1, "Jam pulang wajib diisi")
    .regex(/^([0-1][0-9]|2[0-3]):[0-5][0-9](:00)?$/, "Format jam pulang tidak valid (HH:mm atau HH:mm:ss)"),
});

export const updateKantorSchema = z.object({
  nama: z
    .string()
    .min(2, "Nama minimal 2 karakter")
    .max(255, "Nama maksimal 255 karakter")
    .optional(),
  alamat: z
    .string()
    .max(500, "Alamat maksimal 500 karakter")
    .optional()
    .or(z.literal("")),
  lat: z
    .string()
    .regex(/^-?\d+\.?\d*$/, "Format latitude tidak valid")
    .optional(),
  long: z
    .string()
    .regex(/^-?\d+\.?\d*$/, "Format longitude tidak valid")
    .optional(),
  deskripsi: z
    .string()
    .max(1000, "Deskripsi maksimal 1000 karakter")
    .optional()
    .or(z.literal("")),
  radius_limit: z
    .number({
      invalid_type_error: "Radius limit harus berupa angka",
    })
    .min(1, "Radius limit minimal 1 meter")
    .max(10000, "Radius limit maksimal 10000 meter")
    .optional(),
  jam_masuk: z
    .string()
    .regex(/^([0-1][0-9]|2[0-3]):[0-5][0-9](:00)?$/, "Format jam masuk tidak valid (HH:mm atau HH:mm:ss)")
    .optional(),
  jam_pulang: z
    .string()
    .regex(/^([0-1][0-9]|2[0-3]):[0-5][0-9](:00)?$/, "Format jam pulang tidak valid (HH:mm atau HH:mm:ss)")
    .optional(),
});

export type CreateKantorFormData = z.infer<typeof createKantorSchema>;
export type UpdateKantorFormData = z.infer<typeof updateKantorSchema>;

