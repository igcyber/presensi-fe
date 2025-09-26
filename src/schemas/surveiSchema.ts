import { z } from "zod";

// Schema untuk data responden
export const respondenSchema = z.object({
  nama: z
    .string()
    .min(1, "Nama wajib diisi")
    .min(2, "Nama minimal 2 karakter")
    .max(100, "Nama maksimal 100 karakter")
    .regex(/^[a-zA-Z\s\u00C0-\u017F]+$/, "Nama hanya boleh mengandung huruf dan spasi"),

  hp: z
    .string()
    .min(1, "Nomor HP wajib diisi")
    .min(10, "Nomor HP minimal 10 digit")
    .max(15, "Nomor HP maksimal 15 digit")
    .regex(/^[0-9+\-\s()]+$/, "Format nomor HP tidak valid"),

  jenis_kelamin: z.enum(["L", "P"], {
    errorMap: () => ({ message: "Jenis kelamin harus dipilih" }),
  }),

  usia: z
    .number()
    .int("Usia harus berupa angka bulat")
    .min(1, "Usia minimal 1 tahun")
    .max(120, "Usia maksimal 120 tahun"),

  pendidikan: z
    .string()
    .min(1, "Pendidikan wajib dipilih")
    .refine((val) => ["sd", "smp", "sma", "diploma", "s1", "s2", "s3"].includes(val), {
      message: "Pendidikan tidak valid",
    }),

  pekerjaan: z
    .string()
    .min(1, "Pekerjaan wajib diisi")
    .min(2, "Pekerjaan minimal 2 karakter")
    .max(100, "Pekerjaan maksimal 100 karakter"),
});

// Schema untuk jawaban survei
export const jawabanSurveiSchema = z.object({
  pertanyaan_id: z.number().int("ID pertanyaan harus berupa angka bulat").positive("ID pertanyaan harus positif"),
  jawaban_id: z.number(),
});

// Schema untuk submit survei
export const submitSurveiSchema = z.object({
  pelayanan_id: z.number().int("ID pelayanan harus berupa angka bulat").positive("ID pelayanan harus positif"),

  responden: respondenSchema,

  survei: z
    .array(jawabanSurveiSchema)
    .min(1, "Minimal ada 1 jawaban survei")
    .refine(
      (survei) => {
        const pertanyaanIds = survei.map((s) => s.pertanyaan_id);
        const uniquePertanyaanIds = [...new Set(pertanyaanIds)];
        return pertanyaanIds.length === uniquePertanyaanIds.length;
      },
      { message: "Setiap pertanyaan hanya boleh dijawab sekali" },
    )
    .superRefine((survei, ctx) => {
      survei.forEach((s, index) => {
        if (s.jawaban_id <= 0) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            path: [index, "jawaban_id"], // tunjuk error di item array
            message: `Jawaban pada Pertanyaan ${index + 1} belum diisi`,
          });
        }
      });
    }),

  masukkan: z
    .string()
    .max(1000, "Masukkan maksimal 1000 karakter")
    .optional()
    .transform((val) => val?.trim() || undefined),
});

// Schema untuk validasi pilihan layanan (untuk step 2)
export const pilihanLayananSchema = z.object({
  layanan_id: z.number().int("ID layanan harus berupa angka bulat").positive("ID layanan harus positif"),
});

// Schema untuk validasi jawaban kuesioner (untuk step 3)
export const kuesionerJawabanSchema = z.object({
  jawaban: z
    .array(jawabanSurveiSchema)
    .min(1, "Minimal ada 1 jawaban")
    .refine(
      (jawaban) => {
        // Cek apakah semua pertanyaan memiliki jawaban yang unik
        const pertanyaanIds = jawaban.map((j) => j.pertanyaan_id);
        const uniquePertanyaanIds = [...new Set(pertanyaanIds)];
        return pertanyaanIds.length === uniquePertanyaanIds.length;
      },
      {
        message: "Setiap pertanyaan hanya boleh dijawab sekali",
      },
    ),

  masukkan: z.string().max(1000, "Masukkan maksimal 1000 karakter").optional(),
});

// Schema untuk kuesioner form (untuk step 3 dengan BaseForm)
export const kuesionerFormSchema = z.object({
  masukkan: z.string().max(1000, "Masukkan maksimal 1000 karakter").optional(),
});

// Types dari schema
export type PilihanLayananFormData = z.infer<typeof pilihanLayananSchema>;
export type KuesionerJawabanFormData = z.infer<typeof kuesionerJawabanSchema>;
export type KuesionerFormData = z.infer<typeof kuesionerFormSchema>;
export type SubmitSurveiFormData = z.infer<typeof submitSurveiSchema>;
export type RespondenData = z.infer<typeof respondenSchema>;
export type JawabanSurveiData = z.infer<typeof jawabanSurveiSchema>;
