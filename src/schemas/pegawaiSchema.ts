import { z } from "zod";

export const createPegawaiSchema = z
  .object({
    tipe_pegawai_id: z.preprocess(
      (val) => {
        if (val === null || val === undefined || val === "") return undefined;
        const num = typeof val === "string" ? parseInt(val, 10) : Number(val);
        return isNaN(num) ? undefined : num;
      },
      z.number().int().positive("Tipe pegawai harus dipilih"),
    ),
    kantor_id: z.preprocess(
      (val) => {
        if (val === null || val === undefined || val === "") return undefined;
        const num = typeof val === "string" ? parseInt(val, 10) : Number(val);
        return isNaN(num) ? undefined : num;
      },
      z.number().int().positive("Kantor harus dipilih"),
    ),
    nama: z
      .string()
      .min(1, "Nama wajib diisi")
      .min(2, "Nama minimal 2 karakter")
      .max(100, "Nama maksimal 100 karakter"),
    check_radius: z.enum(["YA", "TIDAK"], {
      required_error: "Check radius wajib dipilih",
    }),
    lat: z.string().min(1, "Latitude wajib diisi"),
    long: z.string().min(1, "Longitude wajib diisi"),
    no_hp: z
      .string()
      .min(1, "Nomor HP wajib diisi")
      .min(10, "Nomor HP minimal 10 karakter")
      .max(15, "Nomor HP maksimal 15 karakter")
      .regex(/^[0-9]+$/, "Nomor HP hanya boleh mengandung angka"),
    email: z.string().min(1, "Email wajib diisi").email("Format email tidak valid"),
    username: z
      .string()
      .min(1, "Username wajib diisi")
      .min(3, "Username minimal 3 karakter")
      .max(50, "Username maksimal 50 karakter")
      .regex(/^[a-zA-Z0-9_]+$/, "Username hanya boleh mengandung huruf, angka, dan underscore"),
    password: z
      .string()
      .min(1, "Password wajib diisi")
      .min(6, "Password minimal 6 karakter")
      .max(50, "Password maksimal 50 karakter"),
    password_confirmation: z.string().min(1, "Konfirmasi password wajib diisi"),
  })
  .refine(
    (data) => {
      // Jika password atau password_confirmation masih kosong, skip validasi ini
      // Biarkan validasi min() yang menangani error "wajib diisi"
      if (!data.password || !data.password_confirmation) {
        return true;
      }
      // Validasi kesamaan hanya jika keduanya sudah terisi
      return data.password === data.password_confirmation;
    },
    {
      message: "Konfirmasi password tidak cocok",
      path: ["password_confirmation"],
    },
  );

export const updatePegawaiSchema = z.object({
  tipe_pegawai_id: z.preprocess(
    (val) => {
      if (val === null || val === undefined || val === "") return undefined;
      const num = typeof val === "string" ? parseInt(val, 10) : Number(val);
      return isNaN(num) ? undefined : num;
    },
    z.number().int().positive().optional().nullable(),
  ),
  kantor_id: z.preprocess(
    (val) => {
      if (val === null || val === undefined || val === "") return undefined;
      const num = typeof val === "string" ? parseInt(val, 10) : Number(val);
      return isNaN(num) ? undefined : num;
    },
    z.number().int().positive().optional().nullable(),
  ),
  nama: z.preprocess(
    (val) => (val === "" ? undefined : val),
    z.string().min(2, "Nama minimal 2 karakter").max(100, "Nama maksimal 100 karakter").optional(),
  ),
  check_radius: z.preprocess(
    (val) => (val === "" ? undefined : val),
    z.enum(["YA", "TIDAK"]).optional(),
  ),
  lat: z.preprocess((val) => (val === "" ? undefined : val), z.string().optional()),
  long: z.preprocess((val) => (val === "" ? undefined : val), z.string().optional()),
  no_hp: z.preprocess(
    (val) => (val === "" ? undefined : val),
    z
      .string()
      .refine(
        (val) => {
          if (!val) return true;
          return val.length >= 10 && val.length <= 15 && /^[0-9]+$/.test(val);
        },
        {
          message: "Nomor HP minimal 10 karakter, maksimal 15 karakter, dan hanya boleh angka",
        },
      )
      .optional(),
  ),
  email: z.preprocess(
    (val) => (val === "" ? undefined : val),
    z
      .string()
      .refine(
        (val) => {
          if (!val) return true;
          return z.string().email().safeParse(val).success;
        },
        {
          message: "Format email tidak valid",
        },
      )
      .optional(),
  ),
  username: z.preprocess(
    (val) => (val === "" ? undefined : val),
    z
      .string()
      .refine(
        (val) => {
          if (!val) return true;
          return val.length >= 3 && val.length <= 50 && /^[a-zA-Z0-9_]+$/.test(val);
        },
        {
          message: "Username minimal 3 karakter, maksimal 50 karakter, dan hanya boleh huruf, angka, underscore",
        },
      )
      .optional(),
  ),
  password: z.preprocess(
    (val) => (val === "" ? undefined : val),
    z
      .string()
      .refine(
        (val) => {
          if (!val) return true;
          return val.length >= 6 && val.length <= 50;
        },
        {
          message: "Password minimal 6 karakter, maksimal 50 karakter",
        },
      )
      .optional(),
  ),
});

export type CreatePegawaiFormData = z.infer<typeof createPegawaiSchema>;
export type UpdatePegawaiFormData = z.infer<typeof updatePegawaiSchema>;

