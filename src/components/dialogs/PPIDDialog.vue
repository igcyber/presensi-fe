<script setup lang="ts">
import { computed, ref, watch } from "vue";
import { toast } from "vue-sonner";

import BaseFormDialog from "@/components/dialogs/BaseFormDialog.vue";
import BaseInput from "@/components/forms/BaseInput.vue";
import BaseInputFile from "@/components/forms/BaseInputFile.vue";
import BaseSelect from "@/components/forms/BaseSelect.vue";
import BaseTextEditorEcho from "@/components/forms/BaseTextEditorEcho.vue";

import { createPPID, getExternalPPIDKategori, updatePPID } from "@/lib/api/services/ppid";
import type { PPID } from "@/lib/api/types/ppid.types";
import { createPPIDSchema, updatePPIDSchema } from "@/schemas/ppidSchema";

// Interface definitions
interface Props {
  open: boolean;
  mode: "create" | "edit" | "view";
  ppid?: PPID | null;
  widthClass?: string;
}

interface Emits {
  (e: "update:open", v: boolean): void;
  (e: "success"): void;
  (e: "cancel"): void;
}

// Props
const props = withDefaults(defineProps<Props>(), { ppid: null });

// Emits
const emit = defineEmits<Emits>();

// Reactive references
const subKategoriOptions = ref<string[]>([]);
const isDisabledSubKategori = ref<boolean>(true);
const isLoadingSubKategori = ref<boolean>(false);

// Opsi untuk select
const kategoriOptions = [
  "Informasi Berkala",
  "Informasi Setiap Saat",
  "Informasi Serta Merta",
  "Informasi Dikecualikan",
];

// Options untuk jenis file - dengan option null untuk edit mode
const jenisfileOptions = computed(() => {
  const baseOptions = ["dokumen", "gambar"];

  // Jika mode edit, tambahkan option null di awal
  if (props.mode === "edit") {
    return [
      { value: "none", label: "Pilih Jenis File" },
      { value: "dokumen", label: "Dokumen" },
      { value: "gambar", label: "Gambar" },
    ];
  }

  return baseOptions;
});

// Computed properties
const initialValues = computed(() =>
  props.mode === "create"
    ? { judul: "", keterangan: "", kategori: "", subKategori: "", date: "", jenisfile: "dokumen", file: "" }
    : {
        judul: props.ppid?.judul ?? "",
        keterangan: props.ppid?.keterangan ?? "",
        kategori: props.ppid?.kategori ?? "",
        subKategori: props.ppid?.subKategori ?? "",
        date: props.ppid?.tahun ?? "",
        jenisfile: "none", // "none" untuk edit mode
      },
);

const schema = computed(() => (props.mode === "create" ? createPPIDSchema : updatePPIDSchema));

const open = computed({
  get: () => props.open,
  set(value: boolean) {
    emit("update:open", value);
  },
});

const existingFiles = computed(() => {
  if (!props.ppid?.ppid_json) return props.ppid?.fileUrl || "";
  try {
    const parsed = JSON.parse(props.ppid.ppid_json);
    return parsed.fileUrl || props.ppid?.fileUrl || "";
  } catch {
    return props.ppid?.fileUrl || "";
  }
});

// Methods
const loadSubKategoriOptions = async (value: string): Promise<void> => {
  try {
    isLoadingSubKategori.value = true;
    const subKategori = await getExternalPPIDKategori(value);

    // Konversi response ke array string
    if (Array.isArray(subKategori.data) && subKategori.data.length > 0) {
      subKategoriOptions.value = subKategori.data.map((item: any) =>
        typeof item === "string" ? item : item.name || item.label || String(item),
      );
      isDisabledSubKategori.value = false;
    } else {
      subKategoriOptions.value = [];
      isDisabledSubKategori.value = true;
      toast.warning("Info", { description: "Tidak ada sub kategori tersedia untuk kategori ini" });
    }
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : "Gagal memuat data sub kategori";
    toast.error("Gagal", { description: errorMessage });
    subKategoriOptions.value = [];
    isDisabledSubKategori.value = true;
  } finally {
    isLoadingSubKategori.value = false;
  }
};

const handleKategoriUpdate = (value: string) => {
  value = value.toLowerCase().split(" ").join("");
  loadSubKategoriOptions(value);
};

// Watcher untuk memuat sub kategori saat edit
watch(
  () => props.open,
  async (isOpen) => {
    if (isOpen && props.mode === "edit" && props.ppid?.kategori) {
      // Reset sub kategori options
      subKategoriOptions.value = [];
      isDisabledSubKategori.value = true;

      // Load sub kategori berdasarkan kategori yang ada
      const kategoriType = props.ppid.kategori.toLowerCase().split(" ").join("");
      await loadSubKategoriOptions(kategoriType);
    } else if (!isOpen) {
      // Reset saat dialog ditutup
      subKategoriOptions.value = [];
      isDisabledSubKategori.value = true;
    }
  },
  { immediate: true },
);

async function onSubmit(values: any) {
  const payload = {
    judul: values.judul,
    keterangan: values.keterangan,
    kategori: values.subKategori,
    date: values.date,
    jenisfile: values.jenisfile === "none" ? null : values.jenisfile, // Convert "none" to null
  };
  if (values.file) {
    (payload as any).file = values.file;
  }

  if (props.mode === "create") {
    await createPPID(payload as any, values.kategori.toLowerCase().split(" ").join(""));
    toast.success("Berhasil", { description: "PPID berhasil ditambahkan" });
  } else if (props.ppid) {
    await updatePPID(props.ppid.id, payload, props.ppid.kategori.toLowerCase().split(" ").join(""));
    toast.success("Berhasil", { description: "PPID berhasil diperbarui" });
  }
}
</script>

<template>
  <BaseFormDialog
    v-model:open="open"
    :mode="mode"
    resource-name="PPID"
    :schema="schema"
    :initial-values="initialValues"
    :onSubmit="onSubmit"
    :width-class="widthClass"
    @success="() => $emit('success')"
    @cancel="() => $emit('cancel')"
  >
    <div class="grid grid-cols-1 gap-3">
      <BaseInput name="judul" label="Judul" placeholder="Masukkan judul PPID" required />

      <BaseSelect
        name="kategori"
        label="Kategori"
        :options="kategoriOptions"
        placeholder="Pilih kategori"
        required
        @update:model-value="(value: string) => handleKategoriUpdate(value)"
      />

      <BaseSelect
        name="subKategori"
        label="Sub Kategori"
        :options="subKategoriOptions"
        :placeholder="
          isLoadingSubKategori
            ? 'Memuat sub kategori...'
            : subKategoriOptions.length === 0
              ? 'Pilih kategori terlebih dahulu'
              : 'Pilih sub kategori'
        "
        :disabled="isDisabledSubKategori || isLoadingSubKategori"
        :required="!isDisabledSubKategori"
        :description="isLoadingSubKategori ? 'Sedang memuat data sub kategori...' : ''"
      />

      <BaseInput name="date" label="Tahun" placeholder="Masukkan tahun (YYYY)" required />

      <BaseTextEditorEcho name="keterangan" label="Keterangan" placeholder="Masukkan keterangan PPID" required />

      <BaseSelect
        name="jenisfile"
        label="Jenis File"
        :options="jenisfileOptions"
        placeholder="Pilih jenis file"
        :required="props.mode === 'create'"
      />

      <BaseInputFile
        name="file"
        label="File"
        :accept="
          jenisfileOptions.some((opt) => (typeof opt === 'string' ? opt : opt.value) === 'dokumen')
            ? 'application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document'
            : 'image/jpeg,image/png,image/gif'
        "
        :required="mode === 'create'"
        description="Format: PDF/DOC untuk dokumen, JPG/PNG untuk gambar. Maksimal 10MB"
        :existing-files="existingFiles"
      />
    </div>
  </BaseFormDialog>
</template>
