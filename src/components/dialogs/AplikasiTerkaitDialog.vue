<script setup lang="ts">
import { computed } from "vue";
import { toast } from "vue-sonner";

import BaseFormDialog from "@/components/dialogs/BaseFormDialog.vue";
import BaseInput from "@/components/forms/BaseInput.vue";
import BaseInputFile from "@/components/forms/BaseInputFile.vue";

import { createAplikasiTerkait, updateAplikasiTerkait } from "@/lib/api/services/aplikasiTerkait";
import type { AplikasiTerkait } from "@/lib/api/types/aplikasiTerkait.types";
import { createAplikasiTerkaitSchema, updateAplikasiTerkaitSchema } from "@/schemas/aplikasiTerkaitSchema";

interface Props {
  open: boolean;
  mode: "create" | "edit" | "view";
  aplikasiTerkait?: AplikasiTerkait | null;
  widthClass?: string;
}

interface Emits {
  (e: "update:open", v: boolean): void;
  (e: "success"): void;
  (e: "cancel"): void;
}

const props = withDefaults(defineProps<Props>(), { aplikasiTerkait: null });
const emit = defineEmits<Emits>();

const initialValues = computed(() =>
  props.mode === "create"
    ? { cover: "", text: "", link: "" }
    : {
        text: props.aplikasiTerkait?.text ?? "",
        link: props.aplikasiTerkait?.link ?? "",
      },
);

const schema = computed(() => (props.mode === "create" ? createAplikasiTerkaitSchema : updateAplikasiTerkaitSchema));

const open = computed({
  get: () => props.open,
  set(value: boolean) {
    emit("update:open", value);
  },
});

async function onSubmit(values: any) {
  if (props.mode === "create") {
    await createAplikasiTerkait(values);
    toast.success("Berhasil", { description: "Aplikasi terkait berhasil ditambahkan" });
  } else if (props.aplikasiTerkait) {
    await updateAplikasiTerkait(props.aplikasiTerkait.id, values);
    toast.success("Berhasil", { description: "Aplikasi terkait berhasil diperbarui" });
  }
}
</script>

<template>
  <BaseFormDialog
    v-model:open="open"
    :mode="mode"
    resource-name="Aplikasi Terkait"
    :schema="schema"
    :initial-values="initialValues"
    :onSubmit="onSubmit"
    :width-class="widthClass"
    @success="() => $emit('success')"
    @cancel="() => $emit('cancel')"
  >
    <div class="grid grid-cols-1 gap-3">
      <BaseInputFile
        name="cover"
        label="Cover Aplikasi"
        accept="image/*"
        :required="false"
        description="Format: JPG, PNG, WebP. Maksimal 5MB"
        :existing-files="props.aplikasiTerkait?.coverUrl"
      />

      <BaseInput name="text" label="Text" placeholder="Masukkan text aplikasi" required />

      <BaseInput
        name="link"
        label="Link"
        placeholder="Masukkan URL aplikasi"
        required
        description="URL aplikasi yang akan dibuka"
      />
    </div>
  </BaseFormDialog>
</template>
