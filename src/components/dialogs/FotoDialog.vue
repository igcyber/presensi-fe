<script setup lang="ts">
import { computed } from "vue";
import { toast } from "vue-sonner";

import BaseFormDialog from "@/components/dialogs/BaseFormDialog.vue";
import BaseInput from "@/components/forms/BaseInput.vue";
import BaseInputFile from "@/components/forms/BaseInputFile.vue";

import { createFoto, updateFoto } from "@/lib/api/services/foto";
import type { Foto } from "@/lib/api/types/foto.types";
import { createFotoSchema, updateFotoSchema } from "@/schemas/fotoSchema";

interface Props {
  open: boolean;
  mode: "create" | "edit" | "view";
  foto?: Foto | null;
  widthClass?: string;
}

interface Emits {
  (e: "update:open", v: boolean): void;
  (e: "success"): void;
  (e: "cancel"): void;
}

const props = withDefaults(defineProps<Props>(), {
  foto: null,
  widthClass: "sm:max-w-[600px]",
});

const emit = defineEmits<Emits>();

// Computed properties
const initialValues = computed(() =>
  props.mode === "create"
    ? { judul: "", foto: undefined }
    : {
        judul: props.foto?.judul ?? "",
        foto: undefined,
      },
);

const schema = computed(() => (props.mode === "create" ? createFotoSchema : updateFotoSchema));

const open = computed({
  get: () => props.open,
  set(value: boolean) {
    emit("update:open", value);
  },
});

// Methods
async function onSubmit(values: any) {
  if (props.mode === "create") {
    await createFoto(values);
    toast.success("Berhasil", { description: "Foto berhasil ditambahkan" });
  } else if (props.foto) {
    await updateFoto(props.foto.id, values);
    toast.success("Berhasil", { description: "Foto berhasil diperbarui" });
  }
}
</script>

<template>
  <BaseFormDialog
    v-model:open="open"
    :mode="mode"
    resource-name="Foto"
    :schema="schema"
    :initial-values="initialValues"
    :onSubmit="onSubmit"
    :width-class="widthClass"
    @success="() => $emit('success')"
    @cancel="() => $emit('cancel')"
  >
    <div class="grid grid-cols-1 gap-3">
      <BaseInput name="judul" label="Judul Foto" placeholder="Masukkan judul foto" required />

      <BaseInputFile
        name="foto"
        label="File Foto"
        :required="mode === 'create'"
        accept="image/*"
        help-text="Format: JPG, JPEG, PNG, WebP. Maksimal 2MB"
      />
    </div>
  </BaseFormDialog>
</template>
