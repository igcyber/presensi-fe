<script setup lang="ts">
import { Building2 } from "lucide-vue-next";
import { computed, onMounted, ref, watch } from "vue";
import { toast } from "vue-sonner";

import BaseForm from "@/components/forms/BaseForm.vue";
import BaseInput from "@/components/forms/BaseInput.vue";
import { Button } from "@/components/ui/button";

import { updateProfile } from "@/lib/api/services/auth";
import type { UserAuth } from "@/lib/api/types/auth.types";
import { updateSelfProfileSchema } from "@/schemas/authSchema";

interface Props {
  userData?: UserAuth;
  onSuccess?: () => void;
}

const props = defineProps<Props>();

const isLoading = ref(false);

// --- DEBUGGING (Bisa dihapus nanti) ---
const logDataStructure = (data: any) => {
  console.log("🔍 Menerima Data Profil:", data);
};
onMounted(() => logDataStructure(props.userData));
watch(
  () => props.userData,
  (newVal) => logDataStructure(newVal),
);
// --------------------------------------

// Helper untuk mengambil NAMA
const getNama = (data: any) => {
  if (!data) return "";
  if (data.userPegawai?.nama) return data.userPegawai.nama;
  if (data.nama) return data.nama;
  return data.fullName || "";
};

// Helper untuk mengambil NO HP
const getNoHp = (data: any) => {
  if (!data) return "";
  // Prioritas 1: noHp (CamelCase - Sesuai response Postman Anda)
  if (data.noHp) return data.noHp;
  // Prioritas 2: no_hp (SnakeCase - Standar database lama)
  if (data.no_hp) return data.no_hp;

  return "";
};

// Helper untuk mengambil KANTOR
const getKantor = (data: any) => {
  if (!data) return "Memuat...";

  // Prioritas Utama: Relasi userPegawai.kantor (Data Baru dari Backend)
  if (data.userPegawai?.kantor?.nama) {
    return data.userPegawai.kantor.nama;
  }

  // Fallback: Jika backend belum di-deploy/di-update
  if (data.kantor) return data.kantor; // String langsung

  return "Tidak ada data kantor";
};

// Computed Display untuk Read-only
const displayKantor = computed(() => getKantor(props.userData));

// Mapping data awal ke Form
const getInitialValues = () => {
  const data = props.userData || {};
  return {
    nama: getNama(data),
    email: data.email ?? "",
    username: data.username ?? "",
    no_hp: getNoHp(data), // Menggunakan helper baru
  };
};

const initialValues = ref(getInitialValues());

// Watcher agar form terisi saat data API masuk
watch(
  () => props.userData,
  () => {
    initialValues.value = getInitialValues();
  },
  { deep: true },
);

async function onSubmit(values: any) {
  try {
    isLoading.value = true;

    const payload = {
      nama: values.nama,
      email: values.email,
      username: values.username,
      no_hp: values.no_hp,
    };

    await updateProfile(payload);

    toast.success("Profil berhasil diperbarui");
    props.onSuccess?.();
  } catch (error: any) {
    const errorMessage = error?.response?.data?.message || error.message || "Gagal memperbarui profil";
    toast.error("Gagal", { description: errorMessage });
  } finally {
    isLoading.value = false;
  }
}
</script>

<template>
  <BaseForm :schema="updateSelfProfileSchema" :initial-values="initialValues" :onSubmit="onSubmit">
    <div class="space-y-4">
      <div class="space-y-1">
        <label
          class="flex items-center gap-1 text-sm leading-none font-medium peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
        >
          <Building2 class="text-muted-foreground h-3.5 w-3.5" />
          Kantor / Unit Kerja
        </label>
        <div
          class="border-input bg-muted/50 text-muted-foreground flex min-h-[36px] w-full items-center rounded-md border px-3 py-1 text-sm font-medium shadow-sm"
        >
          {{ displayKantor }}
        </div>
      </div>

      <div class="grid gap-4 md:grid-cols-2">
        <BaseInput name="nama" label="Nama Lengkap" placeholder="Masukkan nama lengkap" required />

        <BaseInput name="no_hp" label="No. Handphone" placeholder="08xxxxxxxxxx" type="tel" required />
      </div>

      <div class="grid gap-4 md:grid-cols-2">
        <BaseInput name="email" label="Email" type="email" placeholder="email@instansi.go.id" required />

        <BaseInput name="username" label="Username" placeholder="username" required />
      </div>

      <div class="flex justify-end gap-2 pt-4">
        <Button type="submit" :disabled="isLoading">
          {{ isLoading ? "Menyimpan..." : "Simpan Perubahan" }}
        </Button>
      </div>
    </div>
  </BaseForm>
</template>
