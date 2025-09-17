<script setup lang="ts">
import { computed } from "vue";
import { toast } from "vue-sonner";

import BaseFormDialog from "@/components/dialogs/BaseFormDialog.vue";
import BaseInput from "@/components/forms/BaseInput.vue";
import BaseInputFile from "@/components/forms/BaseInputFile.vue";
import BaseTextarea from "@/components/forms/BaseTextarea.vue";

import { createDokumen, updateDokumen } from "@/lib/api/services/dokumen";
import type { Dokumen } from "@/lib/api/types/dokumen.types";
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

// Computed properties
const initialValues = computed(() =>
  props.mode === "create"
    ? { nama: "", file: "", isi: "" }
    : {
        nama: props.dokumen?.nama ?? "",
        isi: props.dokumen?.isi ?? "",
      },
);

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
