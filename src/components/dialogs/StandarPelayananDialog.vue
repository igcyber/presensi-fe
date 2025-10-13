<script setup lang="ts">
import { computed } from "vue";
import { toast } from "vue-sonner";

import BaseFormDialog from "@/components/dialogs/BaseFormDialog.vue";
import BaseInput from "@/components/forms/BaseInput.vue";
import BaseTextarea from "@/components/forms/BaseTextarea.vue";

import { createStandarPelayanan, updateStandarPelayanan } from "@/lib/api/services/standarPelayanan";
import type { StandarPelayanan } from "@/lib/api/types/standarPelayanan.types";
import { createStandarPelayananSchema, updateStandarPelayananSchema } from "@/schemas/standarPelayananSchema";

interface Props {
  open: boolean;
  mode: "create" | "edit";
  standarPelayanan?: StandarPelayanan | null;
}

interface Emits {
  (e: "update:open", value: boolean): void;
  (e: "success"): void;
  (e: "cancel"): void;
}

const props = withDefaults(defineProps<Props>(), {
  standarPelayanan: null,
});

const emit = defineEmits<Emits>();

// Computed
const open = computed({
  get: () => props.open,
  set: (value) => emit("update:open", value),
});

const schema = computed(() => (props.mode === "create" ? createStandarPelayananSchema : updateStandarPelayananSchema));

const initialValues = computed(() =>
  props.mode === "create"
    ? { nama: "", deskripsi: "" }
    : {
        nama: props.standarPelayanan?.nama ?? "",
        deskripsi: props.standarPelayanan?.deskripsi ?? "",
      },
);

const widthClass = computed(() => "max-w-2xl");

// Methods
async function onSubmit(values: any) {
  try {
    if (props.mode === "create") {
      await createStandarPelayanan(values);
      toast.success("Standar pelayanan berhasil dibuat");
    } else if (props.standarPelayanan) {
      await updateStandarPelayanan(props.standarPelayanan.id, values);
      toast.success("Standar pelayanan berhasil diperbarui");
    }
    emit("success");
  } catch (error: any) {
    console.error("Error:", error);
    toast.error(error?.response?.data?.message || "Terjadi kesalahan saat menyimpan data");
  }
}
</script>

<template>
  <BaseFormDialog
    v-model:open="open"
    :mode="mode"
    resource-name="Standar Pelayanan"
    :schema="schema"
    :initial-values="initialValues"
    :onSubmit="onSubmit"
    :width-class="widthClass"
    @success="() => $emit('success')"
    @cancel="() => $emit('cancel')"
  >
    <div class="grid grid-cols-1 gap-3">
      <BaseInput name="nama" label="Nama Standar Pelayanan" placeholder="Masukkan nama standar pelayanan" required />

      <BaseTextarea
        name="deskripsi"
        label="Deskripsi"
        placeholder="Masukkan deskripsi standar pelayanan"
        :rows="6"
        required
      />
    </div>
  </BaseFormDialog>
</template>
