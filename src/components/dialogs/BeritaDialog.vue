<script setup lang="ts">
import { computed } from "vue";
import { toast } from "vue-sonner";

import BaseFormDialog from "@/components/dialogs/BaseFormDialog.vue";
import BaseInput from "@/components/forms/BaseInput.vue";
import BaseInputFile from "@/components/forms/BaseInputFile.vue";
import BaseTextarea from "@/components/forms/BaseTextarea.vue";
import BaseTextEditorEcho from "@/components/forms/BaseTextEditorEcho.vue";

import { createBerita, updateBerita } from "@/lib/api/services/berita";
import type { Berita } from "@/lib/api/types/berita.types";
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

// Computed properties
const initialValues = computed(() =>
  props.mode === "create"
    ? { judul: "", isi: "", foto: "", keterangan: "", tag: "" }
    : {
        judul: props.berita?.judul ?? "",
        isi: props.berita?.isi ?? "",
        keterangan: props.berita?.keterangan ?? "",
        tag: props.berita?.tag ?? "",
      },
);

const schema = computed(() => (props.mode === "create" ? createBeritaSchema : updateBeritaSchema));

const open = computed({
  get: () => props.open,
  set(value: boolean) {
    emit("update:open", value);
  },
});

// Methods
async function onSubmit(values: any) {
  if (props.mode === "create") {
    await createBerita(values);
    toast.success("Berhasil", { description: "Berita berhasil ditambahkan" });
  } else if (props.berita) {
    await updateBerita(props.berita.id, values);
    toast.success("Berhasil", { description: "Berita berhasil diperbarui" });
  }
}
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

      <BaseInput name="tag" label="Tag" placeholder="Masukkan tag (pisahkan dengan koma)" required />
    </div>
  </BaseFormDialog>
</template>
