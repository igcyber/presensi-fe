<script setup lang="ts">
import { computed, ref, watch } from "vue";
import { toast } from "vue-sonner";

import BaseFormDialog from "@/components/dialogs/BaseFormDialog.vue";
import BaseInput from "@/components/forms/BaseInput.vue";
import BaseInputFile from "@/components/forms/BaseInputFile.vue";
import BaseSelect from "@/components/forms/BaseSelect.vue";
import BaseTextarea from "@/components/forms/BaseTextarea.vue";
import BaseTextEditorEcho from "@/components/forms/BaseTextEditorEcho.vue";

import { createBerita, updateBerita } from "@/lib/api/services/berita";
import { getTags } from "@/lib/api/services/tag";
import type { Berita } from "@/lib/api/types/berita.types";
import type { Tag } from "@/lib/api/types/tag.types";
import { createBeritaSchema, updateBeritaSchema } from "@/schemas/beritaSchema";

// Interface definitions
interface Props {
  open: boolean;
  mode: "create" | "edit" | "view";
  berita?: Berita | null;
  widthClass?: string;
}

interface Emits {
  (e: "update:open", v: boolean): void;
  (e: "success"): void;
  (e: "cancel"): void;
}

// Props
const props = withDefaults(defineProps<Props>(), { berita: null });

// Emits
const emit = defineEmits<Emits>();

// Reactive variables
const tagList = ref<Tag[]>([]);
const loadingTags = ref(false);

// Computed properties
const initialValues = computed(() =>
  props.mode === "create"
    ? { judul: "", isi: "", foto: "", keterangan: "", tagId: null, temporaryFileNames: [] }
    : {
        judul: props.berita?.judul ?? "",
        isi: props.berita?.isi ?? "",
        keterangan: props.berita?.keterangan ?? "",
        tagId: props.berita?.tagId ?? null,
        temporaryFileNames: [],
      },
);

const schema = computed(() => (props.mode === "create" ? createBeritaSchema : updateBeritaSchema));

const open = computed({
  get: () => props.open,
  set(value: boolean) {
    emit("update:open", value);
  },
});

const tagOptions = computed(() => {
  return tagList.value.map((tag) => ({
    label: tag.namaTag,
    value: tag.id.toString(),
  }));
});

// Methods
async function loadTags() {
  try {
    loadingTags.value = true;
    const response = await getTags({ limit: 100 }); // Load semua tags
    tagList.value = response.data.data;
  } catch (error) {
    console.error("Failed to load tags:", error);
    toast.error("Gagal memuat daftar tags");
  } finally {
    loadingTags.value = false;
  }
}

async function onSubmit(values: any) {
  if (props.mode === "create") {
    await createBerita(values);
    toast.success("Berhasil", { description: "Berita berhasil ditambahkan" });
  } else if (props.berita) {
    await updateBerita(props.berita.id, values);
    toast.success("Berhasil", { description: "Berita berhasil diperbarui" });
  }
}

// Watchers
watch(
  () => props.open,
  (isOpen) => {
    if (isOpen) {
      loadTags();
    }
  },
  { immediate: true },
);
</script>

<template>
  <BaseFormDialog
    v-model:open="open"
    :mode="mode"
    resource-name="Berita"
    :schema="schema"
    :initial-values="initialValues"
    :onSubmit="onSubmit"
    :width-class="widthClass"
    @success="() => $emit('success')"
    @cancel="() => $emit('cancel')"
  >
    <div class="grid grid-cols-1 gap-3">
      <BaseInput name="judul" label="Judul Berita" placeholder="Masukkan judul berita" required />

      <BaseTextEditorEcho name="isi" label="Isi Berita" placeholder="Masukkan isi berita" required />

      <BaseInputFile
        name="foto"
        label="Foto Berita"
        accept="image/*"
        :required="mode === 'create'"
        description="Format: JPG, PNG, WebP. Maksimal 5MB"
        :existing-files="props.berita?.fotoUrl"
      />

      <BaseTextarea name="keterangan" label="Keterangan" placeholder="Masukkan keterangan (opsional)" :rows="3" />

      <BaseSelect
        name="tagId"
        label="Tag Berita"
        :options="tagOptions"
        placeholder="Pilih tag"
        required
        searchable
        :disabled="loadingTags"
        description="Pilih kategori tag untuk berita"
      />
    </div>
  </BaseFormDialog>
</template>
