<script setup lang="ts">
import { computed, onMounted, ref } from "vue";
import { toast } from "vue-sonner";

import BaseFormDialog from "@/components/dialogs/BaseFormDialog.vue";
import BaseInput from "@/components/forms/BaseInput.vue";
import BaseInputFile from "@/components/forms/BaseInputFile.vue";
import BaseSelect from "@/components/forms/BaseSelect.vue";
import BaseTextarea from "@/components/forms/BaseTextarea.vue";

import { useFetch } from "@/composables/useFetch";
import { createDokumen, updateDokumen } from "@/lib/api/services/dokumen";
import { getKategoriDokumens } from "@/lib/api/services/kategoriDokumen";
import type { Dokumen } from "@/lib/api/types/dokumen.types";
import type { KategoriDokumenListResponse } from "@/lib/api/types/kategoriDokumen.types";
import { createDokumenSchema, updateDokumenSchema } from "@/schemas/dokumenSchema";

// Interface definitions
interface Props {
  open: boolean;
  mode: "create" | "edit" | "view";
  dokumen?: Dokumen | null;
  widthClass?: string;
}

interface Emits {
  (e: "update:open", v: boolean): void;
  (e: "success"): void;
  (e: "cancel"): void;
}

// Props
const props = withDefaults(defineProps<Props>(), { dokumen: null });

// Emits
const emit = defineEmits<Emits>();

// Fetch kategori dokumen
const { data: kategoriList, fetchData: fetchKategori, isLoading: isLoadingKategori } = useFetch<
  any,
  KategoriDokumenListResponse
>(() => getKategoriDokumens({ per_page: 100 }), {
  immediate: false,
  extractData: (response) => response.data,
});

// Computed properties
const initialValues = computed(() =>
  props.mode === "create"
    ? { nama: "", file: "", isi: "", kategoriId: 0 }
    : {
        nama: props.dokumen?.nama ?? "",
        isi: props.dokumen?.isi ?? "",
        kategoriId: props.dokumen?.kategoriId ?? 0,
      },
);

const kategoriOptions = computed(() => {
  return (
    kategoriList.value?.data?.map((kategori) => ({
      label: kategori.nama,
      value: kategori.id,
    })) || []
  );
});

const schema = computed(() => (props.mode === "create" ? createDokumenSchema : updateDokumenSchema));

const open = computed({
  get: () => props.open,
  set(value: boolean) {
    emit("update:open", value);
  },
});

// Methods
async function onSubmit(values: any) {
  if (props.mode === "create") {
    await createDokumen(values);
    toast.success("Berhasil", { description: "Dokumen berhasil ditambahkan" });
  } else if (props.dokumen) {
    await updateDokumen(props.dokumen.id, values);
    toast.success("Berhasil", { description: "Dokumen berhasil diperbarui" });
  }
}

// Lifecycle
onMounted(() => {
  fetchKategori();
});
</script>

<template>
  <BaseFormDialog
    v-model:open="open"
    :mode="mode"
    resource-name="Dokumen"
    :schema="schema"
    :initial-values="initialValues"
    :onSubmit="onSubmit"
    :width-class="widthClass"
    @success="() => $emit('success')"
    @cancel="() => $emit('cancel')"
  >
    <div class="grid grid-cols-1 gap-3">
      <BaseInput name="nama" label="Nama Dokumen" placeholder="Masukkan nama dokumen" required />

      <BaseSelect
        name="kategoriId"
        label="Kategori Dokumen"
        placeholder="Pilih kategori dokumen"
        :options="kategoriOptions"
        :loading="isLoadingKategori"
        required
      />

      <BaseInputFile
        name="file"
        label="File Dokumen"
        accept="application/pdf"
        :required="mode === 'create'"
        description="Format: PDF. Maksimal 10MB"
        :existing-files="props.dokumen?.fileUrl"
      />

      <BaseTextarea name="isi" label="Deskripsi" placeholder="Masukkan deskripsi dokumen" :rows="4" required />
    </div>
  </BaseFormDialog>
</template>
