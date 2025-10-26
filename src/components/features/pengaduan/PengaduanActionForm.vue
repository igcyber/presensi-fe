<script setup lang="ts">
import { Save, X } from "lucide-vue-next";
import { computed, ref, watch } from "vue";
import { toast } from "vue-sonner";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

import { updatePengaduanKategori, updatePengaduanStatus } from "@/lib/api/services/pengaduan";
import type { Pengaduan } from "@/lib/api/types/pengaduan.types";
import {
  type UpdateKategoriFormData,
  updateKategoriSchema,
  type UpdateStatusFormData,
  updateStatusSchema,
} from "@/schemas/pengaduanSchema";

import KategoriSelect from "./KategoriSelect.vue";

// Props
interface Props {
  pengaduan: Pengaduan;
  actionType: "status" | "kategori";
  onSuccess?: () => void;
  onCancel?: () => void;
}

const props = defineProps<Props>();

// Emits
const emit = defineEmits<{
  (e: "success"): void;
  (e: "cancel"): void;
}>();

// State
const isLoading = ref(false);
const errors = ref<Record<string, string>>({});

// Form data
const formData = ref<UpdateStatusFormData | UpdateKategoriFormData>({
  status: props.pengaduan.status,
  kategori_aduan: props.pengaduan.kategoriAduan || "",
  keterangan: props.pengaduan.keterangan || "",
});

// Computed
const isStatusAction = computed(() => props.actionType === "status");
const isKategoriAction = computed(() => props.actionType === "kategori");
const showKategoriField = computed(() => {
  return isStatusAction.value && formData.value.status === "diterima";
});

const schema = computed(() => {
  return isStatusAction.value ? updateStatusSchema : updateKategoriSchema;
});

const title = computed(() => {
  return isStatusAction.value ? "Update Status" : "Update Kategori";
});

const description = computed(() => {
  return isStatusAction.value
    ? "Ubah status pengaduan dan tentukan kategori jika diperlukan"
    : "Ubah kategori pengaduan";
});

// Methods
const validateForm = () => {
  try {
    schema.value.parse(formData.value);
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

    if (isStatusAction.value) {
      await updatePengaduanStatus(props.pengaduan.id, formData.value as UpdateStatusFormData);
      toast.success("Status berhasil diupdate", {
        description: `Status pengaduan telah diubah menjadi ${formData.value.status}`,
      });
    } else {
      await updatePengaduanKategori(props.pengaduan.id, { kategori_aduan: formData.value.kategori_aduan });
      toast.success("Kategori berhasil diupdate", {
        description: `Kategori pengaduan telah diubah menjadi ${formData.value.kategori_aduan}`,
      });
    }

    emit("success");
    props.onSuccess?.();
  } catch (error: any) {
    console.error("Error updating pengaduan:", error);
    toast.error("Gagal mengupdate pengaduan", {
      description: error.message || "Terjadi kesalahan saat mengupdate pengaduan",
    });
  } finally {
    isLoading.value = false;
  }
};

const handleCancel = () => {
  emit("cancel");
  props.onCancel?.();
};

// Watchers
watch(
  () => formData.value.status,
  (newStatus) => {
    if (newStatus === "belum") {
      formData.value.kategori_aduan = "";
    }
  },
);
</script>

<template>
  <Card class="w-full max-w-md">
    <CardHeader class="pb-3">
      <CardTitle class="text-lg">{{ title }}</CardTitle>
      <CardDescription>{{ description }}</CardDescription>
    </CardHeader>
    <CardContent class="space-y-4">
      <!-- Status Field (only for status action) -->
      <div v-if="isStatusAction" class="space-y-2">
        <Label for="status">Status</Label>
        <Select v-model="formData.status">
          <SelectTrigger>
            <SelectValue placeholder="Pilih status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="belum">Belum</SelectItem>
            <SelectItem value="diterima">Diterima</SelectItem>
          </SelectContent>
        </Select>
        <p v-if="errors.status" class="text-sm text-red-600">{{ errors.status }}</p>
      </div>

      <!-- Kategori Field -->
      <div v-if="showKategoriField || isKategoriAction" class="space-y-2">
        <Label for="kategori">Kategori Aduan</Label>
        <KategoriSelect
          v-model="formData.kategori_aduan"
          :placeholder="isKategoriAction ? 'Pilih kategori baru...' : 'Pilih kategori...'"
        />
        <p v-if="errors.kategori_aduan" class="text-sm text-red-600">{{ errors.kategori_aduan }}</p>
      </div>

      <!-- Keterangan Field (only for status action) -->
      <div v-if="isStatusAction" class="space-y-2">
        <Label for="keterangan">Keterangan (Opsional)</Label>
        <Textarea v-model="formData.keterangan" placeholder="Tambahkan keterangan jika diperlukan..." rows="3" />
        <p v-if="errors.keterangan" class="text-sm text-red-600">{{ errors.keterangan }}</p>
      </div>

      <!-- Action Buttons -->
      <div class="flex gap-2 pt-2">
        <Button @click="handleSubmit" :disabled="isLoading" class="flex-1">
          <Save v-if="!isLoading" class="mr-2 h-4 w-4" />
          <div v-else class="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
          {{ isLoading ? "Menyimpan..." : "Simpan" }}
        </Button>
        <Button variant="outline" @click="handleCancel" :disabled="isLoading">
          <X class="mr-2 h-4 w-4" />
          Batal
        </Button>
      </div>
    </CardContent>
  </Card>
</template>
