<script setup lang="ts">
import { AlertCircle, RefreshCw, Send } from "lucide-vue-next";
import { computed, onMounted, ref } from "vue";
import { toast } from "vue-sonner";

import { createPengaduanPublic } from "@/lib/api/services/pengaduan";
import { clearCaptcha, generateCaptcha } from "@/lib/utils/captcha";
import { createPengaduanSchema, type CreatePengaduanFormData } from "@/schemas/pengaduanSchema";

// Emits
const emit = defineEmits<{
  success: [];
}>();

// State
const isLoading = ref(false);
const errors = ref<Record<string, string>>({});
const captchaData = ref<{ question: string; answer: number } | null>(null);

// Form data
const formData = ref<CreatePengaduanFormData>({
  nama: "",
  nik: "",
  alamat: "",
  noHp: "",
  email: "",
  aduan: "",
  deskripsi: "",
  captcha: "",
});

// Computed
const isFormValid = computed(() => {
  return Object.values(formData.value).every(value => value.trim() !== "");
});

// Methods
const generateNewCaptcha = () => {
  captchaData.value = generateCaptcha();
  formData.value.captcha = "";
  errors.value.captcha = "";
};

const validateForm = () => {
  try {
    createPengaduanSchema.parse(formData.value);
    errors.value = {};
    return true;
  } catch (error: any) {
    const newErrors: Record<string, string> = {};
    if (error.errors) {
      error.errors.forEach((err: any) => {
        newErrors[err.path[0]] = err.message;
      });
    }
    errors.value = newErrors;
    return false;
  }
};

const handleSubmit = async () => {
  if (!validateForm()) {
    toast.error("Form tidak valid", {
      description: "Mohon periksa kembali data yang diisi",
    });
    return;
  }

  try {
    isLoading.value = true;

    const response = await createPengaduanPublic({
      nama: formData.value.nama,
      nik: formData.value.nik,
      alamat: formData.value.alamat,
      noHp: formData.value.noHp,
      email: formData.value.email,
      aduan: formData.value.aduan,
      deskripsi: formData.value.deskripsi,
    });

    if (response.data.success) {
      toast.success("Pengaduan berhasil dikirim!", {
        description: "Terima kasih atas pengaduan Anda. Kami akan segera memprosesnya.",
      });

      // Clear form
      formData.value = {
        nama: "",
        nik: "",
        alamat: "",
        noHp: "",
        email: "",
        aduan: "",
        deskripsi: "",
        captcha: "",
      };

      // Clear captcha
      clearCaptcha();
      generateNewCaptcha();

      // Emit success event
      emit("success");
    } else {
      throw new Error(response.data.message || "Gagal mengirim pengaduan");
    }
  } catch (error: any) {
    console.error("Error submitting pengaduan:", error);
    toast.error("Gagal mengirim pengaduan", {
      description: error.message || "Terjadi kesalahan saat mengirim pengaduan",
    });
  } finally {
    isLoading.value = false;
  }
};

// Lifecycle
onMounted(() => {
  generateNewCaptcha();
});
</script>

<template>
  <div class="mx-auto max-w-2xl">
    <div class="overflow-hidden rounded-lg border border-yellow-200 bg-white shadow-md">
      <!-- Header -->
      <div class="bg-gradient-to-r from-yellow-50 to-yellow-100 px-6 py-4">
        <h2 class="text-xl font-semibold text-yellow-800">Form Pengaduan Masyarakat</h2>
        <p class="mt-1 text-sm text-yellow-700">
          Silakan isi form di bawah ini untuk mengajukan pengaduan Anda
        </p>
      </div>

      <!-- Form -->
      <form @submit.prevent="handleSubmit" class="space-y-6 p-6">
        <!-- Nama -->
        <div>
          <label for="nama" class="block text-sm font-medium text-gray-700">
            Nama Lengkap <span class="text-red-500">*</span>
          </label>
          <input
            id="nama"
            v-model="formData.nama"
            type="text"
            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-yellow-500 focus:ring-yellow-500"
            :class="{ 'border-red-500': errors.nama }"
            placeholder="Masukkan nama lengkap"
          />
          <p v-if="errors.nama" class="mt-1 text-sm text-red-600">{{ errors.nama }}</p>
        </div>

        <!-- NIK -->
        <div>
          <label for="nik" class="block text-sm font-medium text-gray-700">
            NIK <span class="text-red-500">*</span>
          </label>
          <input
            id="nik"
            v-model="formData.nik"
            type="text"
            maxlength="16"
            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-yellow-500 focus:ring-yellow-500"
            :class="{ 'border-red-500': errors.nik }"
            placeholder="Masukkan NIK 16 digit"
          />
          <p v-if="errors.nik" class="mt-1 text-sm text-red-600">{{ errors.nik }}</p>
        </div>

        <!-- Alamat -->
        <div>
          <label for="alamat" class="block text-sm font-medium text-gray-700">
            Alamat <span class="text-red-500">*</span>
          </label>
          <textarea
            id="alamat"
            v-model="formData.alamat"
            rows="3"
            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-yellow-500 focus:ring-yellow-500"
            :class="{ 'border-red-500': errors.alamat }"
            placeholder="Masukkan alamat lengkap"
          ></textarea>
          <p v-if="errors.alamat" class="mt-1 text-sm text-red-600">{{ errors.alamat }}</p>
        </div>

        <!-- No HP -->
        <div>
          <label for="noHp" class="block text-sm font-medium text-gray-700">
            Nomor HP <span class="text-red-500">*</span>
          </label>
          <input
            id="noHp"
            v-model="formData.noHp"
            type="tel"
            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-yellow-500 focus:ring-yellow-500"
            :class="{ 'border-red-500': errors.noHp }"
            placeholder="Contoh: 081234567890"
          />
          <p v-if="errors.noHp" class="mt-1 text-sm text-red-600">{{ errors.noHp }}</p>
        </div>

        <!-- Email -->
        <div>
          <label for="email" class="block text-sm font-medium text-gray-700">
            Email <span class="text-red-500">*</span>
          </label>
          <input
            id="email"
            v-model="formData.email"
            type="email"
            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-yellow-500 focus:ring-yellow-500"
            :class="{ 'border-red-500': errors.email }"
            placeholder="contoh@email.com"
          />
          <p v-if="errors.email" class="mt-1 text-sm text-red-600">{{ errors.email }}</p>
        </div>

        <!-- Aduan -->
        <div>
          <label for="aduan" class="block text-sm font-medium text-gray-700">
            Jenis Aduan <span class="text-red-500">*</span>
          </label>
          <input
            id="aduan"
            v-model="formData.aduan"
            type="text"
            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-yellow-500 focus:ring-yellow-500"
            :class="{ 'border-red-500': errors.aduan }"
            placeholder="Contoh: Lampu jalan padam, Jalan rusak, dll"
          />
          <p v-if="errors.aduan" class="mt-1 text-sm text-red-600">{{ errors.aduan }}</p>
        </div>

        <!-- Deskripsi -->
        <div>
          <label for="deskripsi" class="block text-sm font-medium text-gray-700">
            Deskripsi Aduan <span class="text-red-500">*</span>
          </label>
          <textarea
            id="deskripsi"
            v-model="formData.deskripsi"
            rows="4"
            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-yellow-500 focus:ring-yellow-500"
            :class="{ 'border-red-500': errors.deskripsi }"
            placeholder="Jelaskan secara detail mengenai aduan Anda..."
          ></textarea>
          <p v-if="errors.deskripsi" class="mt-1 text-sm text-red-600">{{ errors.deskripsi }}</p>
        </div>

        <!-- Captcha -->
        <div>
          <label class="block text-sm font-medium text-gray-700">
            Verifikasi Keamanan <span class="text-red-500">*</span>
          </label>
          <div class="mt-1 flex items-center space-x-3">
            <div class="flex-1">
              <div class="flex items-center space-x-2">
                <span class="text-lg font-mono text-gray-600">
                  {{ captchaData?.question }} = ?
                </span>
                <button
                  type="button"
                  @click="generateNewCaptcha"
                  class="inline-flex items-center rounded-md bg-gray-100 p-2 text-gray-600 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-yellow-500"
                >
                  <RefreshCw class="h-4 w-4" />
                </button>
              </div>
              <input
                v-model="formData.captcha"
                type="text"
                class="mt-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-yellow-500 focus:ring-yellow-500"
                :class="{ 'border-red-500': errors.captcha }"
                placeholder="Masukkan jawaban"
              />
              <p v-if="errors.captcha" class="mt-1 text-sm text-red-600">{{ errors.captcha }}</p>
            </div>
          </div>
        </div>

        <!-- Submit Button -->
        <div class="pt-4">
          <button
            type="submit"
            :disabled="isLoading || !isFormValid"
            class="w-full inline-flex items-center justify-center rounded-md bg-yellow-600 px-4 py-3 text-sm font-medium text-white shadow-sm transition-colors hover:bg-yellow-700 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2 disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            <Send v-if="!isLoading" class="mr-2 h-4 w-4" />
            <div v-else class="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
            {{ isLoading ? "Mengirim..." : "Kirim Pengaduan" }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>
