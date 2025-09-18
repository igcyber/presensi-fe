<script setup lang="ts">
import { computed } from "vue";
import { toast } from "vue-sonner";

import BaseFormDialog from "@/components/dialogs/BaseFormDialog.vue";
import BaseInput from "@/components/forms/BaseInput.vue";
import BaseTextarea from "@/components/forms/BaseTextarea.vue";

import { createRadio, updateRadio } from "@/lib/api/services/radio";
import type { Radio } from "@/lib/api/types/radio.types";
import { createRadioSchema, updateRadioSchema } from "@/schemas/radioSchema";

interface Props {
  open: boolean;
  mode: "create" | "edit" | "view";
  radio?: Radio | null;
  widthClass?: string;
}

interface Emits {
  (e: "update:open", v: boolean): void;
  (e: "success"): void;
  (e: "cancel"): void;
}

const props = withDefaults(defineProps<Props>(), { radio: null });
const emit = defineEmits<Emits>();

const initialValues = computed(() =>
  props.mode === "create"
    ? { judul: "", isi: "", link: "" }
    : {
        judul: props.radio?.judul ?? "",
        isi: props.radio?.isi ?? "",
        link: props.radio?.link ?? "",
      },
);

const schema = computed(() => (props.mode === "create" ? createRadioSchema : updateRadioSchema));

const open = computed({
  get: () => props.open,
  set(value: boolean) {
    emit("update:open", value);
  },
});

async function onSubmit(values: any) {
  if (props.mode === "create") {
    await createRadio(values);
    toast.success("Berhasil", { description: "Radio berhasil ditambahkan" });
  } else if (props.radio) {
    await updateRadio(props.radio.id, values);
    toast.success("Berhasil", { description: "Radio berhasil diperbarui" });
  }
}
</script>

<template>
  <BaseFormDialog
    v-model:open="open"
    :mode="mode"
    resource-name="Radio"
    :schema="schema"
    :initial-values="initialValues"
    :onSubmit="onSubmit"
    :width-class="widthClass"
    @success="() => $emit('success')"
    @cancel="() => $emit('cancel')"
  >
    <div class="grid grid-cols-1 gap-3">
      <BaseInput name="judul" label="Judul Radio" placeholder="Masukkan judul radio" required />

      <BaseTextarea name="isi" label="Deskripsi" placeholder="Masukkan deskripsi radio (opsional)" :rows="3" />

      <BaseInput
        name="link"
        label="Link Radio"
        placeholder="Masukkan URL radio streaming"
        required
        description="URL streaming radio (contoh: https://radio.kukarkab.go.id)"
      />
    </div>
  </BaseFormDialog>
</template>
