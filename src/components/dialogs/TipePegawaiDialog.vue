<script setup lang="ts">
import { computed } from "vue";
import { toast } from "vue-sonner";

import BaseFormDialog from "@/components/dialogs/BaseFormDialog.vue";
import BaseInput from "@/components/forms/BaseInput.vue";

import { createTipePegawai, updateTipePegawai } from "@/lib/api/services/tipePegawai";
import type { TipePegawai } from "@/lib/api/types/tipePegawai.types";
import { createTipePegawaiSchema, updateTipePegawaiSchema } from "@/schemas/tipePegawaiSchema";

interface Props {
  open: boolean;
  mode: "create" | "edit" | "view";
  tipePegawai?: TipePegawai | null;
}

interface Emits {
  (e: "update:open", v: boolean): void;
  (e: "success"): void;
  (e: "cancel"): void;
}

const props = withDefaults(defineProps<Props>(), { tipePegawai: null });
const emit = defineEmits<Emits>();

const initialValues = computed(() => {
  if (props.mode === "create") {
    return {
      nama: "",
    };
  }

  return {
    nama: props.tipePegawai?.nama ?? "",
  };
});

const schema = computed(() => (props.mode === "create" ? createTipePegawaiSchema : updateTipePegawaiSchema));

const open = computed({
  get: () => props.open,
  set(value: boolean) {
    emit("update:open", value);
  },
});

async function onSubmit(values: any) {
  if (props.mode === "create") {
    await createTipePegawai(values);
    toast.success("Berhasil", { description: "Tipe pegawai berhasil ditambahkan" });
  } else if (props.tipePegawai) {
    await updateTipePegawai(props.tipePegawai.id, values);
    toast.success("Berhasil", { description: "Tipe pegawai berhasil diperbarui" });
  }
}
</script>

<template>
  <BaseFormDialog
    v-model:open="open"
    :mode="mode"
    resource-name="Tipe Pegawai"
    :schema="schema"
    :initial-values="initialValues"
    :onSubmit="onSubmit"
    @success="() => $emit('success')"
    @cancel="() => $emit('cancel')"
  >
    <div class="grid grid-cols-1 gap-3">
      <BaseInput name="nama" label="Nama Tipe Pegawai" placeholder="Masukkan nama tipe pegawai" required />
    </div>
  </BaseFormDialog>
</template>

