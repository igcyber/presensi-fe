<script setup lang="ts">
import { computed } from "vue";
import { toast } from "vue-sonner";

import BaseFormDialog from "@/components/dialogs/BaseFormDialog.vue";
import BaseInput from "@/components/forms/BaseInput.vue";

import { createPasar, updatePasar } from "@/lib/api/services/pasar";
import type { Pasar } from "@/lib/api/types/pasar.types";
import { createPasarSchema, updatePasarSchema } from "@/schemas/pasarSchema";

// Interface definitions
interface Props {
  open: boolean;
  mode: "create" | "edit" | "view";
  pasar?: Pasar | null;
}

interface Emits {
  (e: "update:open", v: boolean): void;
  (e: "success"): void;
}

// Props
const props = withDefaults(defineProps<Props>(), { pasar: null });

// Emits
const emit = defineEmits<Emits>();

// Computed properties
const initialValues = computed(() =>
  props.mode === "create"
    ? {
        nama: "",
        jenisPasar: null,
      }
    : {
        nama: props.pasar?.nama ?? "",
        jenisPasar: props.pasar?.jenisPasar ?? null,
      },
);

const schema = computed(() => (props.mode === "create" ? createPasarSchema : updatePasarSchema));

const open = computed({
  get: () => props.open,
  set(value: boolean) {
    emit("update:open", value);
  },
});

// Methods
async function onSubmit(values: any) {
  if (props.mode === "create") {
    await createPasar(values);
    toast.success("Berhasil", { description: "Pasar berhasil ditambahkan" });
  } else if (props.pasar) {
    await updatePasar(props.pasar.id, values);
    toast.success("Berhasil", { description: "Pasar berhasil diperbarui" });
  }
}
</script>

<template>
  <BaseFormDialog
    v-model:open="open"
    :mode="mode"
    resource-name="Pasar"
    :schema="schema"
    :initial-values="initialValues"
    :onSubmit="onSubmit"
    @success="() => $emit('success')"
  >
    <div class="grid grid-cols-1 gap-3">
      <BaseInput name="nama" label="Nama Pasar" placeholder="Masukkan nama pasar" required />

      <BaseInput name="jenisPasar" label="Jenis Pasar" placeholder="Masukkan jenis pasar (opsional)" />
    </div>
  </BaseFormDialog>
</template>

