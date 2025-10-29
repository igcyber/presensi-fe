<script setup lang="ts">
import { computed } from "vue";
import { toast } from "vue-sonner";

import BaseFormDialog from "@/components/dialogs/BaseFormDialog.vue";
import BaseInput from "@/components/forms/BaseInput.vue";

import { createBukuTamu } from "@/lib/api/services/bukuTamu";
import { createBukuTamuSchema } from "@/schemas/bukuTamuSchema";

interface Props {
  open: boolean;
}

interface Emits {
  (e: "update:open", v: boolean): void;
  (e: "success"): void;
  (e: "cancel"): void;
}

const props = defineProps<Props>();
const emit = defineEmits<Emits>();

const open = computed({
  get: () => props.open,
  set: (value: boolean) => emit("update:open", value),
});

const initialValues = computed(() => ({
  judul: "",
}));

const widthClass = computed(() => "max-w-xl");

async function onSubmit(values: any) {
  await createBukuTamu({ judul: values.judul });
  toast.success("Buku tamu berhasil dibuat");
}
</script>

<template>
  <BaseFormDialog
    v-model:open="open"
    title="Tambah Buku Tamu"
    submit-text="Simpan"
    :schema="createBukuTamuSchema"
    :initial-values="initialValues"
    :width-class="widthClass"
    @submit="onSubmit"
    @success="() => emit('success')"
    @cancel="() => emit('cancel')"
  >
    <div class="grid gap-4">
      <BaseInput name="judul" label="Judul" placeholder="Masukkan judul" required />
    </div>
  </BaseFormDialog>
</template>
