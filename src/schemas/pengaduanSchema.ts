import { z } from "zod";

// Schema untuk create pengaduan
export const createPengaduanSchema = z.object({
  nama: z
    .string()
    .min(1, "Nama wajib diisi")
    .min(2, "Nama minimal 2 karakter")
    .max(100, "Nama maksimal 100 karakter")
    .regex(/^[a-zA-Z\s\u00C0-\u017F]+$/, "Nama hanya boleh mengandung huruf dan spasi"),

  nik: z
    .string()
    .min(1, "NIK wajib diisi")
    .length(16, "NIK harus 16 digit")
    .regex(/^[0-9]+$/, "NIK hanya boleh mengandung angka"),

  alamat: z
    .string()
    .min(1, "Alamat wajib diisi")
    .min(5, "Alamat minimal 5 karakter")
    .max(500, "Alamat maksimal 500 karakter"),

  noHp: z
    .string()
    .min(1, "Nomor HP wajib diisi")
    .min(10, "Nomor HP minimal 10 digit")
    .max(15, "Nomor HP maksimal 15 digit")
    .regex(/^[0-9+\-\s()]+$/, "Format nomor HP tidak valid"),

  email: z
    .string()
    .min(1, "Email wajib diisi")
    .email("Format email tidak valid")
    .max(100, "Email maksimal 100 karakter"),

  aduan: z
    .string()
    .min(1, "Aduan wajib diisi")
    .min(5, "Aduan minimal 5 karakter")
    .max(200, "Aduan maksimal 200 karakter"),

  deskripsi: z
    .string()
    .min(1, "Deskripsi wajib diisi")
    .min(10, "Deskripsi minimal 10 karakter")
    .max(1000, "Deskripsi maksimal 1000 karakter"),

  captcha: z
    .string()
    .min(1, "Captcha wajib diisi")
    .refine((val) => {
      const storedAnswer = localStorage.getItem("captcha_answer");
      return storedAnswer && val === storedAnswer;
    }, "Captcha tidak valid"),

  persetujuan: z.boolean().refine((val: boolean) => val === true, "Persetujuan wajib dicentang"),
});

// Schema untuk update status pengaduan (admin)
export const updateStatusSchema = z
  .object({
    status: z.enum(["belum", "diterima"], {
      errorMap: () => ({ message: "Status harus dipilih" }),
    }),
    kategori_aduan: z.string().optional(),
    keterangan: z.string().optional(),
  })
  .refine(
    (data) => {
      // Jika status diterima, kategori_aduan wajib diisi
      if (data.status === "diterima" && !data.kategori_aduan) {
        return false;
      }
      return true;
    },
    {
      message: "Kategori aduan wajib diisi saat status diterima",
      path: ["kategori_aduan"],
    },
  );

// Schema untuk update kategori pengaduan (admin)
export const updateKategoriSchema = z.object({
  kategori_aduan: z
    .string()
    .min(1, "Kategori aduan wajib diisi")
    .min(2, "Kategori aduan minimal 2 karakter")
    .max(100, "Kategori aduan maksimal 100 karakter"),
});

// Types dari schema
export type CreatePengaduanFormData = z.infer<typeof createPengaduanSchema>;
export type UpdateStatusFormData = z.infer<typeof updateStatusSchema>;
export type UpdateKategoriFormData = z.infer<typeof updateKategoriSchema>;
