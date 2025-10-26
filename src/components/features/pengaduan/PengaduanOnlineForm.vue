<script setup lang="ts">
import { CheckCircle, Loader2, Send } from "lucide-vue-next";
import { onMounted, ref } from "vue";
import { toast } from "vue-sonner";
import { z } from "zod";

import BaseCheckbox from "@/components/forms/BaseCheckbox.vue";
import BaseForm from "@/components/forms/BaseForm.vue";
import BaseInput from "@/components/forms/BaseInput.vue";
import BaseTextarea from "@/components/forms/BaseTextarea.vue";
import { Button } from "@/components/ui/button";

import { usePengaduanLangsung } from "@/composables/usePengaduanLangsung";
import { createPengaduanSchema } from "@/schemas/pengaduanSchema";

// Emits
const emit = defineEmits<{
  success: [];
}>();

// Composable
const { isSubmitting, captchaQuestion, canSubmit, remainingTime, generateCaptcha, checkRateLimit, submitPengaduan } =
  usePengaduanLangsung();

// Local state
const isSuccess = ref(false);

// Methods
const handleSubmit = async (values: any) => {
  if (!checkRateLimit()) {
    toast.error(`Anda baru saja mengirim pengaduan. Silakan tunggu ${remainingTime.value} menit lagi.`);
    return;
  }

  try {
    await submitPengaduan({
      nama: values.nama,
      nik: values.nik,
      alamat: values.alamat,
      noHp: values.noHp,
      email: values.email,
      aduan: values.aduan,
      deskripsi: values.deskripsi,
    });

    isSuccess.value = true;
    toast.success("Pengaduan berhasil dikirim!");
    emit("success");
  } catch (error: any) {
    toast.error(error.message || "Gagal mengirim pengaduan");
  }
};

// Lifecycle
onMounted(() => {
  generateCaptcha();
  checkRateLimit();
});
</script>

<template>
  <div class="mx-auto max-w-4xl">
    <!-- Success State -->
    <div v-if="isSuccess" class="rounded-lg bg-white p-8 text-center shadow-lg">
      <CheckCircle class="mx-auto mb-4 h-16 w-16 text-green-600" />
      <h2 class="mb-4 text-2xl font-bold text-gray-900">Pengaduan Berhasil Dikirim!</h2>
      <p class="mb-6 text-gray-600">
        Terima kasih telah mengirim pengaduan. Tim kami akan segera menindaklanjuti pengaduan Anda.
      </p>
      <div class="rounded-lg bg-yellow-50 p-4">
        <p class="text-sm text-yellow-800">
          <strong>Catatan:</strong> Anda dapat mengirim pengaduan lagi setelah 15 menit.
        </p>
      </div>
    </div>

    <!-- Form -->
    <div v-else class="rounded-lg bg-white p-6 shadow-lg">
      <h2 class="mb-6 text-2xl font-bold text-gray-900">Form Pengaduan Online</h2>

      <BaseForm
        v-slot="{ meta }"
        :schema="
          createPengaduanSchema.extend({
            persetujuan: z.boolean().refine((val: boolean) => val === true, 'Persetujuan wajib dicentang'),
          })
        "
        :initial-values="{
          nama: '',
          nik: '',
          alamat: '',
          noHp: '',
          email: '',
          aduan: '',
          deskripsi: '',
          captcha: '',
          persetujuan: false,
        }"
        :on-submit="handleSubmit"
      >
        <div class="space-y-8">
          <!-- Data Pelapor Section -->
          <div class="rounded-lg border border-gray-200 p-6">
            <h3 class="mb-4 text-lg font-semibold text-gray-900">Data Pelapor</h3>
            <div class="grid grid-cols-1 gap-6 md:grid-cols-2">
              <BaseInput
                name="nama"
                label="Nama Lengkap"
                placeholder="Masukkan nama lengkap"
                required
                customCss="border-yellow-600/50 focus-visible:border-yellow-600/50 focus-visible:ring-yellow-600/50"
              />

              <BaseInput
                name="nik"
                label="NIK"
                placeholder="Masukkan NIK (16 digit)"
                required
                customCss="border-yellow-600/50 focus-visible:border-yellow-600/50 focus-visible:ring-yellow-600/50"
              />

              <BaseInput
                name="alamat"
                label="Alamat"
                placeholder="Masukkan alamat lengkap"
                required
                customCss="border-yellow-600/50 focus-visible:border-yellow-600/50 focus-visible:ring-yellow-600/50"
              />

              <BaseInput
                name="noHp"
                label="Nomor HP"
                placeholder="Masukkan nomor HP"
                type="tel"
                required
                customCss="border-yellow-600/50 focus-visible:border-yellow-600/50 focus-visible:ring-yellow-600/50"
              />

              <BaseInput
                name="email"
                label="Email"
                placeholder="Masukkan email"
                type="email"
                required
                customCss="border-yellow-600/50 focus-visible:border-yellow-600/50 focus-visible:ring-yellow-600/50"
                class="md:col-span-2"
              />
            </div>
          </div>

          <!-- Data Pengaduan Section -->
          <div class="rounded-lg border border-gray-200 p-6">
            <h3 class="mb-4 text-lg font-semibold text-gray-900">Data Pengaduan</h3>
            <div class="space-y-6">
              <BaseInput
                name="aduan"
                label="Judul Aduan"
                placeholder="Masukkan judul aduan"
                required
                customCss="border-yellow-600/50 focus-visible:border-yellow-600/50 focus-visible:ring-yellow-600/50"
              />

              <BaseTextarea
                name="deskripsi"
                label="Deskripsi Aduan"
                placeholder="Jelaskan secara detail aduan Anda..."
                :rows="6"
                required
                customCss="border-yellow-600/50 focus-visible:border-yellow-600/50 focus-visible:ring-yellow-600/50"
              />
            </div>
          </div>

          <!-- Verifikasi Section -->
          <div class="rounded-lg border border-gray-200 p-6">
            <h3 class="mb-4 text-lg font-semibold text-gray-900">Verifikasi</h3>
            <div class="space-y-6">
              <!-- Captcha -->
              <div class="rounded-lg border border-gray-200 p-4">
                <label class="mb-2 block text-sm font-medium text-gray-700"> Verifikasi Keamanan </label>
                <div class="flex items-center space-x-4">
                  <div class="flex-1">
                    <BaseInput
                      name="captcha"
                      label="Captcha"
                      :placeholder="`Berapa hasil dari: ${captchaQuestion}`"
                      required
                      customCss="border-yellow-600/50 focus-visible:border-yellow-600/50 focus-visible:ring-yellow-600/50"
                    />
                  </div>
                  <Button type="button" @click="generateCaptcha" variant="outline" size="sm"> Refresh </Button>
                </div>
                <p class="mt-2 text-xs text-gray-500">
                  Jawab pertanyaan matematika di atas untuk memverifikasi bahwa Anda bukan robot.
                </p>
              </div>

              <!-- Persetujuan -->
              <div class="rounded-lg border border-gray-200 p-4">
                <BaseCheckbox
                  name="persetujuan"
                  label="Saya bersedia dihubungi dan bertanggung jawab atas data yang telah disampaikan pada form"
                  required
                />
              </div>

              <!-- Rate Limiting Warning -->
              <div v-if="!canSubmit" class="rounded-lg bg-yellow-50 p-4">
                <p class="text-sm text-yellow-800">
                  <strong>Perhatian:</strong> Anda baru saja mengirim pengaduan. Silakan tunggu
                  {{ remainingTime }} menit lagi sebelum mengirim pengaduan berikutnya.
                </p>
              </div>
            </div>
          </div>
        </div>

        <!-- Submit Button -->
        <div class="mt-8 flex justify-end">
          <Button
            type="submit"
            :disabled="!meta.valid || isSubmitting || !canSubmit"
            class="bg-yellow-600 text-white hover:bg-yellow-700 disabled:bg-gray-400"
            size="lg"
          >
            <Loader2 v-if="isSubmitting" class="mr-2 h-4 w-4 animate-spin" />
            <Send v-else class="mr-2 h-4 w-4" />
            {{ isSubmitting ? "Mengirim..." : "Kirim Pengaduan" }}
          </Button>
        </div>
      </BaseForm>
    </div>
  </div>
</template>
