<script setup lang="ts">
import { computed } from "vue";
import { toast } from "vue-sonner";

import BaseFormDialog from "@/components/dialogs/BaseFormDialog.vue";
import BaseInput from "@/components/forms/BaseInput.vue";
import BaseInputDateFuture from "@/components/forms/BaseInputDateFuture.vue";

import { createHariLibur, updateHariLibur } from "@/lib/api/services/hariLibur";
import type { HariLibur } from "@/lib/api/types/hariLibur.types";
import { createHariLiburSchema, updateHariLiburSchema } from "@/schemas/hariLiburSchema";

interface Props {
  open: boolean;
  mode: "create" | "edit" | "view";
  hariLibur?: HariLibur | null;
}

interface Emits {
  (e: "update:open", v: boolean): void;
  (e: "success"): void;
  (e: "cancel"): void;
}

const props = withDefaults(defineProps<Props>(), { hariLibur: null });
const emit = defineEmits<Emits>();

const initialValues = computed(() => {
  if (props.mode === "create") {
    return {
      tanggal: "",
      keterangan: "",
    };
  }

  return {
    tanggal: props.hariLibur?.tanggal ? props.hariLibur.tanggal.split(" ")[0] : "",
    keterangan: props.hariLibur?.keterangan ?? "",
  };
});

const schema = computed(() => (props.mode === "create" ? createHariLiburSchema : updateHariLiburSchema));

const open = computed({
  get: () => props.open,
  set(value: boolean) {
    emit("update:open", value);
  },
});

async function onSubmit(values: any) {
  if (props.mode === "create") {
    await createHariLibur(values);
    toast.success("Berhasil", { description: "Hari libur berhasil ditambahkan" });
  } else if (props.hariLibur) {
    await updateHariLibur(props.hariLibur.id, values);
    toast.success("Berhasil", { description: "Hari libur berhasil diperbarui" });
  }
}
</script>

<template>
  <BaseFormDialog
    v-model:open="open"
    :mode="mode"
    resource-name="Hari Libur"
    :schema="schema"
    :initial-values="initialValues"
    :onSubmit="onSubmit"
    @success="() => $emit('success')"
    @cancel="() => $emit('cancel')"
  >
    <div class="grid grid-cols-1 gap-3">
      <BaseInputDateFuture name="tanggal" label="Tanggal" placeholder="Pilih tanggal" required />
      <BaseInput name="keterangan" label="Keterangan" placeholder="Masukkan keterangan hari libur" />
    </div>
  </BaseFormDialog>
</template>
