<script setup lang="ts">
import { CheckCircle, Loader2, Send } from "lucide-vue-next";
import { ref } from "vue";
import { toast } from "vue-sonner";

import BaseForm from "@/components/forms/BaseForm.vue";
import BaseInput from "@/components/forms/BaseInput.vue";
import BaseInputFile from "@/components/forms/BaseInputFile.vue";
import BaseTextarea from "@/components/forms/BaseTextarea.vue";
import { Button } from "@/components/ui/button";

import { createBukuTamuPublic } from "@/lib/api/services/bukuTamu";
import { createBukuTamuPublicSchema } from "@/schemas/bukuTamuSchema";

// Props
interface Props {
  bukuTamuId: number;
  token: string;
}

const props = defineProps<Props>();

// Emits
const emit = defineEmits<{
  success: [];
}>();

// Local state
const isSubmitting = ref(false);
const isSuccess = ref(false);

// Form initial values
const initialValues = {
  nama: "",
  nohp: "",
  asal: "",
  tujuan: "",
  jumlah_tamu: undefined,
  perihal: "",
  dokumen: null,
};

// Methods
const handleSubmit = async (values: any) => {
  isSubmitting.value = true;
  console.log(values);

  try {
    // Convert to FormData for file upload support
    const formData = new FormData();

    if (values.nama) formData.append("nama", values.nama);
    if (values.nohp) formData.append("nohp", values.nohp);
    if (values.asal) formData.append("asal", values.asal);
    if (values.tujuan) formData.append("tujuan", values.tujuan);
    if (values.jumlah_tamu) formData.append("jumlah_tamu", values.jumlah_tamu.toString());
    if (values.perihal) formData.append("perihal", values.perihal);
    if (values.dokumen) formData.append("dokumen", values.dokumen);

    await createBukuTamuPublic(props.bukuTamuId, formData as any, props.token);

    isSuccess.value = true;
    toast.success("Buku tamu berhasil diisi!");
    emit("success");
  } catch (error: any) {
    toast.error(error.message || "Gagal mengisi buku tamu");
  } finally {
    isSubmitting.value = false;
  }
};
</script>

<template>
  <div class="mx-auto max-w-4xl">
    <!-- Success State -->
    <div v-if="isSuccess" class="rounded-lg bg-white p-8 text-center shadow-lg">
      <CheckCircle class="mx-auto mb-4 h-16 w-16 text-green-600" />
      <h2 class="mb-4 text-2xl font-bold text-gray-900">Buku Tamu Berhasil Diisi!</h2>
      <p class="mb-6 text-gray-600">Terima kasih telah mengisi buku tamu. Data Anda telah tersimpan dengan baik.</p>
      <div class="rounded-lg bg-yellow-50 p-4">
        <p class="text-sm text-yellow-800">
          <strong>Catatan:</strong> Anda akan diarahkan ke halaman utama dalam beberapa detik.
        </p>
      </div>
    </div>

    <!-- Form -->
    <div v-else class="rounded-lg bg-white p-6 shadow-lg">
      <h2 class="mb-6 text-2xl font-bold text-gray-900">Isi Buku Tamu</h2>

      <BaseForm
        v-slot="{ meta }"
        :schema="createBukuTamuPublicSchema"
        :initial-values="initialValues"
        :on-submit="handleSubmit"
      >
        <div class="space-y-8">
          <!-- Data Tamu Section -->
          <div class="rounded-lg border border-gray-200 p-6">
            <h3 class="mb-4 text-lg font-semibold text-gray-900">Data Tamu</h3>
            <div class="grid grid-cols-1 gap-6 md:grid-cols-2">
              <BaseInput name="nama" label="Nama Lengkap" placeholder="Masukkan nama lengkap" />

              <BaseInput name="nohp" label="Nomor HP" placeholder="Masukkan nomor HP" type="tel" />

              <BaseInput name="asal" label="Asal Instansi/Daerah" placeholder="Masukkan asal instansi atau daerah" />

              <BaseInput name="tujuan" label="Tujuan Kunjungan" placeholder="Masukkan tujuan kunjungan" />

              <BaseInput
                name="jumlah_tamu"
                label="Jumlah Tamu"
                placeholder="Masukkan jumlah tamu"
                type="number"
                customCss="border-yellow-600/50 focus-visible:border-yellow-600/50 focus-visible:ring-yellow-600/50"
              />
            </div>
          </div>

          <!-- Informasi Kunjungan Section -->
          <div class="rounded-lg border border-gray-200 p-6">
            <h3 class="mb-4 text-lg font-semibold text-gray-900">Informasi Kunjungan</h3>
            <div class="space-y-6">
              <BaseTextarea
                name="perihal"
                label="Perihal Kunjungan"
                placeholder="Jelaskan perihal kunjungan Anda..."
                :rows="4"
              />

              <BaseInputFile
                name="dokumen"
                label="Dokumen Pendukung"
                accept="application/pdf"
                :max-size="5"
                description="Upload dokumen pendukung dalam format PDF (maksimal 5MB)"
              />
            </div>
          </div>
        </div>

        <!-- Submit Button -->
        <div class="mt-8 flex justify-end">
          <Button
            type="submit"
            :disabled="!meta.valid || isSubmitting"
            class="bg-yellow-600 text-white hover:bg-yellow-700 disabled:bg-gray-400"
            size="lg"
          >
            <Loader2 v-if="isSubmitting" class="mr-2 h-4 w-4 animate-spin" />
            <Send v-else class="mr-2 h-4 w-4" />
            {{ isSubmitting ? "Menyimpan..." : "Simpan Buku Tamu" }}
          </Button>
        </div>
      </BaseForm>
    </div>
  </div>
</template>
